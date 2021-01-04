const express = require('express');

const router = express.Router();

const slug = require('slugify');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cache = require('../../lib/redis');
const adminMiddleware = require('../middlewares/adminAuth');

const {
    courses,
    users,
    disciplines,
    modules,
    classes,
    materials,
} = require('../models');

function generateTokenAdmin(params) {
    return jwt.sign({ params }, process.env.JWT_KEY_ADMIN, {
        expiresIn: 86400,
    });
}

/*
/* Rotas Relacionadads a administração de usuarios
/* Listar usuarios
/* Deletar usuarios
*/
router.get('/users', adminMiddleware, async (req, res) => {
    try {
        const params = 'users:all';
        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }
        const user = await users.findAll();
        cache.set(params, user, 60 * 20);
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(400).json({ err: 'erro na solicitação' });
    }
});

router.delete('/delete/users', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.body;
        await users.destroy({ where: { id } });
        return res.status(200).json({ success: 'deletado com sucesso' });
    } catch (err) {
        return res.status(400).json({ err: 'ocorreu um erro no procesamento' });
    }
});

/*
/* Rotas Relacionadads a autenticação
/* Autenticar um admin
/* atualizar informações
/* atualizar senha de acesso
/* atualizar perfil
*/

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const params = `user:admin:${email}`;

        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }
        const user = await users.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Email não cadastrado' });
        }
        if (user.email !== process.env.EMAIL_ADMIN) {
            return res.status(400).json({ error: 'você não tem permissão' });
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Email e/ou senha errado' });
        }

        const hash = crypto.randomBytes(20).toString('hex');

        await users.update({ private: hash }, { where: { id: user.id } });
        cache.set(params, user, 60 * 20);
        return res.status(200).json({
            admin: true,
            token: generateTokenAdmin({ id: user.id }),
            user,
        });
    } catch (err) {
        return res.status(400).json({ err });
    }
});

router.put('/update', adminMiddleware, async (req, res) => {
    try {
        await users.update({ ...req.body }, { where: { id: req.userId } });
        return res.status(200).json({ sucess: 'atualizado com sucesso!' });
    } catch (err) {
        return res.status(400).json({ err });
    }
});

/*
/* Rotas Relacionadads administração de cursos
/* 1º Listar Curso
/* 2º Criar Curso
/* 3º Atualizar Curso
/* 4º Deletar Curso
*/

router.get('/course/:page', adminMiddleware, async (req, res) => {
    try {
        const { page } = req.params;
        const params = `page:course:admin:${page}`;

        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }

        const pageActive = parseInt(page, 10);
        let offset = 0;
        if (pageActive === 1 || pageActive === 0) {
            offset = 0;
        } else {
            offset = parseInt(pageActive, 10) * 8 - 8;
        }
        const ready = await courses.findAndCountAll({
            limit: 8,
            offset,
        });
        let next = false;
        if (ready.count > offset + 8) {
            next = true;
        } else {
            next = false;
        }
        cache.set(params, { ...ready, next }, 60 * 20);
        return res.status(200).json({ ...ready, next });
    } catch (err) {
        return res.status(400).json({ err });
    }
});

router.post('/create/course', adminMiddleware, async (req, res) => {
    try {
        const { title, description, image, time } = req.body;
        await courses.create({
            title,
            description,
            image,
            slug: slug(title, { lower: true }),
            time,
        });
        return res.status(200).json({ success: 'adicionado com sucesso' });
    } catch (err) {
        return res.status(400).json({ err });
    }
});

router.put('/update/course', adminMiddleware, async (req, res) => {
    try {
        const { title, description, image, id } = req.body;
        await courses.update(
            { title, description, image, slug: slug(title, { lower: true }) },
            { where: { id } }
        );
        return res.status(200).json({ success: 'atualizado com sucesso' });
    } catch (err) {
        return res.status(400).json(err);
    }
});

router.delete('/delete/course', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.body;
        await courses.destroy({ where: { id } });
        return res.status(200).json({ success: 'deletado com sucesso!' });
    } catch (err) {
        return res.status(400).json({ err });
    }
});

/*
/* Rotas relacionadas a disciplina
/* Create | Ready | Updade | Delete
*/

router.get('/disciplines', adminMiddleware, async (req, res) => {
    try {
        const params = `discipline:admin`;

        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }

        const discipline = await disciplines.findAll();
        cache.set(params, discipline, 60 * 20);
        return res.status(200).json({ discipline });
    } catch (err) {
        return res.status(400).json({ err });
    }
});

router.post('/disciplines/create', adminMiddleware, async (req, res) => {
    try {
        const { title, image, qtModules, idCourse } = req.body;
        await disciplines.create({
            title,
            slug: slug(title, { lower: true }),
            image,
            qt_modules: qtModules,
            id_course: idCourse,
        });
        return res
            .status(200)
            .json({ success: 'disciplina adicionada com sucesso' });
    } catch (err) {
        return res.status(400).json({ err: 'erro na processamento' });
    }
});

router.put('/disciplines/update/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await disciplines.update({ ...req.body }, { where: { id } });
        return res.status(200).json({ success: 'atualizado com sucesso' });
    } catch (err) {
        return res.status(400).json({ err: 'erro no processamento' });
    }
});

router.delete('/disciplines/delete/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await disciplines.destroy({ where: { id } });
        return res.status(200).json({ success: 'deletado com sucesso!' });
    } catch (err) {
        return res.status(400).json({ err: 'erro no processo' });
    }
});

/*
/* Rotas relacionadas a modulos
/* Create | Ready | Update | Delete
*/

router.get('/modules', adminMiddleware, async (req, res) => {
    try {
        const params = `modules:admin`;

        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }

        const modulers = await modules.findAll();

        cache.set(params, modulers, 60 * 20);

        return res.status(200).json({ modulers });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu algum erro' });
    }
});

router.post('/modules/create', adminMiddleware, async (req, res) => {
    try {
        const { title, qtClass, qtConcluded, order, idDiscipline } = req.body;
        await modules.create({
            title,
            slug: slug(title, { lower: true }),
            qt_class: qtClass,
            qt_concluded: qtConcluded,
            order,
            id_discipline: idDiscipline,
        });
        return res.status(200).json({ success: 'adicionado com sucesso!' });
    } catch (err) {
        return res.status(400).json({ erro: 'Ocorreu algum erro' });
    }
});

router.put('/modules/update/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await modules.update(
            { ...req.body, slug: slug(req.body.title, { lowe: true }) },
            { where: { id } }
        );
        return res.status(200).json({ success: 'atualizado com sucesso' });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro' });
    }
});

router.delete('/modules/delete/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await modules.destroy({ where: { id } });
        return res.status(200).json({ success: 'deleletado com sucesso!' });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro' });
    }
});

/*
/* rotas relacionadas a aulas
/* Create | Ready | Updade | Delete
*/

router.get('/classes', adminMiddleware, async (req, res) => {
    try {
        const params = 'classes:admin';

        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }

        const classe = await classes.findAll();
        cache.set(params, classe, 60 * 20);
        return res.status(200).json({ classe });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro!' });
    }
});

router.post('/classes/create', adminMiddleware, async (req, res) => {
    try {
        const { title, url, order, idModule } = req.body;
        await classes.create({
            title,
            slug: slug(title, { lower: true }),
            url,
            order,
            id_module: idModule,
        });
        return res.status(200).json({ success: 'adicionado com sucesso!' });
    } catch (err) {
        return res.status(200).json({ err: 'Ocorreu algum erro' });
    }
});

router.put('/classes/update/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await classes.update(
            {
                ...req.body,
                slug: slug(req.body.title, { lower: true }),
            },
            { where: { id } }
        );
        return res.status(200).json({ success: 'atualizado com sucesso!' });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu algum erro' });
    }
});

router.delete('/classes/delete/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await classes.destroy({ where: { id } });
        return res.status(200).json({ success: 'deletado com sucesso!' });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu algum erro' });
    }
});

/*
/* Rotas relacionads a materias (pdf, apostilas)
*/

router.get('/materials', adminMiddleware, async (req, res) => {
    try {
        const params = 'material:admin';

        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }

        const material = await materials.findAll();
        cache.set(params, material, 60 * 20);
        return res.status(200).json({ material });
    } catch (err) {
        return res.status(400).json({ err: 'ocorreu algum erro!' });
    }
});

router.post('/materials/create', adminMiddleware, async (req, res) => {
    try {
        const { title, url, idModule } = req.body;
        await materials.create({ title, url, id_module: idModule });
        return res.status(200).json({ success: 'adiconado com sucesso' });
    } catch (err) {
        return res.status(200).json({ err: 'ocorreu um erro' });
    }
});

router.put('/materials/update/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await materials.update({ ...req.body }, { where: { id } });
        return res.status(200).json({ success: 'atualizado com sucesso' });
    } catch (err) {
        return res.status(200).json({ err: 'ocorreu um erro' });
    }
});

router.delete('/materials/delete/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await materials.destroy({ where: { id } });
        return res.status(200).json({ success: 'deletado com sucesso' });
    } catch (err) {
        return res.status(200).json({ err: 'ocorreu um erro' });
    }
});

module.exports = (app) => app.use('/admin', router);
