const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const aws = require('aws-sdk');
const multerConfig = require('../../config/multer');
const mailer = require('../../lib/mailer');
const { users } = require('../models');

const userMiddleware = require('../middlewares/userAuth');

function generateToken(params) {
    return jwt.sign({ params }, process.env.JWT_KEY, { expiresIn: 86400 });
}

/*
/*  Rotas Relacionanas aos usuarios
/* Autenticação | Cadastro | Atualizar Password | Atualizar Perfil
*/

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send({ error: 'Email não cadastrado' });
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ error: 'Email e/ou senha errado' });
        }
        const hash = crypto.randomBytes(20).toString('hex');

        await users.update({ private: hash }, { where: { id: user.id } });

        return res.status(200).json({
            token: generateToken({ id: user.id }),
            user,
        });
    } catch (err) {
        return res.status(400).json({ err });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { email } = req.body;
        if (await users.findOne({ where: { email } })) {
            return res.status(400).send({ error: 'Usuário já existe' });
        }
        /* Defini uma data de Visualização grátis para as video-aula */
        const viewFree = new Date();
        viewFree.setHours(viewFree.getHours() + 120);

        /* Token para Ativar o email futuramente */
        const token = crypto.randomBytes(16).toString('hex');

        await mailer.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Verificação de E-mail | CérebroNerd',
            template: 'confirm_email',
            context: { token },
        });

        const user = await users.create({
            ...req.body,
            token,
            view_free: viewFree,
        });
        return res.status(200).json({
            success:
                'Obrigado Por se cadastrar! Veriique seu e-mail para continuar',
        });
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ error: err.errors[0].message });
        }
        return res.status(400).json({ err });
    }
});

router.put('/update', userMiddleware, async (req, res) => {
    try {
        const {
            name,
            cpf,
            dataofBirth,
            sexo,
            zipcode,
            state,
            city,
            address,
            number,
            phone,
            complement,
            bairro,
        } = req.body;
        await users.update(
            {
                name,
                cpf,
                dataofBirth,
                sexo,
                zipcode,
                state,
                city,
                address,
                number,
                phone,
                complement,
                bairro,
            },
            { where: { id: req.userId } }
        );
        return res.status(200).json({ sucess: 'atualizado com sucesso!' });
    } catch (err) {
        return res.status(400).json({ err });
    }
});

router.put('/update/password', userMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await users.findOne({ where: { id: req.userId } });

        if (!user) {
            return res.status(400).json({ error: 'usuario não existe' });
        }
        if (!(await bcrypt.compare(currentPassword, user.password))) {
            return res
                .status(400)
                .json({ error: 'Ocorreu um erro ao salvar sua senha' });
        }
        user.password = newPassword;
        await user.save();
        return res
            .status(200)
            .json({ message: 'Suas informações foram salvas' });
    } catch (err) {
        return res
            .status(400)
            .json({ err: 'Ocorreu um erro, tente novamente!' });
    }
});

router.post(
    '/update/profile',
    userMiddleware,
    multer(multerConfig).single('profile'),
    async (req, res) => {
        try {
            const { key: profile } = req.file;

            const seniorProfile = await users.findOne({
                where: { id: req.userId },
            });

            const s3 = new aws.S3();

            const params = {
                Bucket: 'profile-cerebronerd',
                Key: seniorProfile.profile,
            };
            await s3.deleteObject(params).promise();

            await users.update({ profile }, { where: { id: req.userId } });

            return res
                .status(200)
                .json({ sucess: 'Perfil atualizado com sucesso!' });
        } catch (err) {
            return res.status(400).json({ err: 'Ocorreu um erro' });
        }
    }
);

router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const tokens = await users.findOne({ where: { token } });

        if (!tokens) {
            return res.status(400).json({ err: 'Token inválido' });
        }

        await users.update(
            { status: true, token: '' },
            { where: { token: tokens.token } }
        );
        return res.status(200).json({ success: 'Email Verificado....' });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro' });
    }
});

router.post('/forgot_password', async (req, res) => {
    try {
        const { email } = req.body;

        const searchUser = await users.findOne({ where: { email } });

        if (!searchUser) {
            res.json({ error: 'Usuario não exite!' });
        }
        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();

        now.setHours(now.getHours() + 48);

        await users.update(
            { passwordResetToken: token, passwordResetExpired: now },
            { where: { id: searchUser.id } }
        );

        await mailer.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Seu link para recuperação de conta',
            template: 'forgot_password',
            context: { token, name: searchUser.name },
        });
        return res.status(200).json({
            success:
                'Link de recuperação de conta enviado. verifique seu email! ',
        });
    } catch (err) {
        return res.json({ err: 'Erro on forgot password, try again' });
    }
});

router.post('/reset_password', async (req, res) => {
    try {
        const { token, password } = req.body;

        const user = await users.findOne({
            where: { passwordResetToken: token },
        });

        if (token !== user.passwordResetToken) {
            return res
                .status(400)
                .send({ error: 'Token de redefinição de senha inválido' });
        }
        const now = new Date();
        if (now > user.passwordResetExpired) {
            return res
                .status(400)
                .send({ error: 'Token expirado, gere um novo' });
        }
        await users.update(
            { password, passwordResetExpired: null, passwordResetToken: null },
            { where: { id: user.id }, individualHooks: true }
        );
        return res.status(200).json({ success: 'Senha alterada, Faça Login!' });
    } catch (err) {
        return res.status(400).json({ error: err });
    }
});

module.exports = (app) => app.use('/user', router);
