const express = require('express');

const router = express.Router();
const multer = require('multer');
const slug = require('slugify');
const multerConfig = require('../../config/multer');
const cache = require('../../lib/redis');
const userMiddleware = require('../middlewares/userAuth');

const {
    courses,
    users,
    disciplines,
    modules,
    classes,
    materials,
} = require('../models');

/*
/* Rotas Relacionadads a administração de usuarios
/* Listar usuarios
/* Deletar usuarios
*/

router.get('/users', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const params = 'users:all';
        const cached = await cache.get(params);

        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }

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

router.delete('/delete/users', userMiddleware, async (req, res) => {
    try {
        const { id } = req.body;
        const { admin } = req;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
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
/* OBS: Essa rota pode bloquear ou modificar qualquer informações do usuarios desde que seja um admin
*/

router.put('/update/users/:id', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { id } = req.params;

        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }

        await users.update({ ...req.body }, { where: { id } });
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

router.post(
    '/create/course',
    userMiddleware,
    multer(multerConfig).single('profile'),
    async (req, res) => {
        try {
            const { admin } = req;
            const { key: capaBanner } = req.file;
            const { title, description, time, qtDisciplines } = req.body;

            if (!admin) {
                return res.status(400).json({ error: 'you are not an admin' });
            }

            await courses.create({
                title,
                description,
                image: capaBanner,
                slug: slug(title, { lower: true }),
                qt_disciplines: qtDisciplines,
                time,
            });
            return res.status(200).json({ success: 'adicionado com sucesso' });
        } catch (err) {
            return res.status(400).json({ err });
        }
    }
);

router.put('/update/course', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { title, description, image, id } = req.body;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
        await courses.update(
            { title, description, image, slug: slug(title, { lower: true }) },
            { where: { id } }
        );
        return res.status(200).json({ success: 'atualizado com sucesso' });
    } catch (err) {
        return res.status(400).json(err);
    }
});

router.delete('/delete/course/:id', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { id } = req.params;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
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

router.post('/disciplines/create', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { title, image, qtModules, idCourse } = req.body;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
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

router.put('/disciplines/update/:id', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { id } = req.params;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
        await disciplines.update({ ...req.body }, { where: { id } });
        return res.status(200).json({ success: 'atualizado com sucesso' });
    } catch (err) {
        return res.status(400).json({ err: 'erro no processamento' });
    }
});

router.delete('/disciplines/delete/:id', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { id } = req.params;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
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

router.post('/modules/create', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { title, qtClass, qtConcluded, order, idDiscipline } = req.body;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
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

router.put('/modules/update/:id', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { id } = req.params;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
        await modules.update(
            { ...req.body, slug: slug(req.body.title, { lowe: true }) },
            { where: { id } }
        );
        return res.status(200).json({ success: 'atualizado com sucesso' });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro' });
    }
});

router.delete('/modules/delete/:id', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { id } = req.params;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
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

router.post('/classes/create', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { title, url, order, idModule } = req.body;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
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

router.put('/classes/update/:id', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { id } = req.params;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
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

router.delete('/classes/delete/:id', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { id } = req.params;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
        await classes.destroy({ where: { id } });
        return res.status(200).json({ success: 'deletado com sucesso!' });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu algum erro' });
    }
});

/*
/* Rotas relacionads a materias (pdf, apostilas)
*/

router.post('/materials/create', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { title, url, idModule } = req.body;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
        await materials.create({ title, url, id_module: idModule });
        return res.status(200).json({ success: 'adiconado com sucesso' });
    } catch (err) {
        return res.status(200).json({ err: 'ocorreu um erro' });
    }
});

router.put('/materials/update/:id', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { id } = req.params;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
        await materials.update({ ...req.body }, { where: { id } });
        return res.status(200).json({ success: 'atualizado com sucesso' });
    } catch (err) {
        return res.status(200).json({ err: 'ocorreu um erro' });
    }
});

router.delete('/materials/delete/:id', userMiddleware, async (req, res) => {
    try {
        const { admin } = req;
        const { id } = req.params;
        if (!admin) {
            return res.status(400).json({ error: 'you are not an admin' });
        }
        await materials.destroy({ where: { id } });
        return res.status(200).json({ success: 'deletado com sucesso' });
    } catch (err) {
        return res.status(200).json({ err: 'ocorreu um erro' });
    }
});

module.exports = (app) => app.use('/admin', router);
