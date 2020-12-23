const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
        const viewFree = new Date();
        viewFree.setHours(viewFree.getHours() + 120);

        const user = await users.create({ ...req.body, view_free: viewFree });
        return res.status(200).json({
            user,
            token: generateToken({ id: user.id }),
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
        return res.status(400).json({ err: 'Não foi possivel concluir ação' });
    }
});

module.exports = (app) => app.use('/user', router);
