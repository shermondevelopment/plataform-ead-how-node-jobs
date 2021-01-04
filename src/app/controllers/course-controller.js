const express = require('express');
const cache = require('../../lib/redis');

const router = express.Router();

const userMiddleware = require('../middlewares/userAuth');

const {
    courses,
    disciplines,
    modules,
    classes,
    materials,
} = require('../models');

/*
/* Rotas relacionas a usuarios e cursos
*/

router.get('/:page', userMiddleware, async (req, res) => {
    try {
        const { page } = req.params;
        const pageActive = parseInt(page, 10);

        const params = `course${page}`;

        const cached = await cache.get(params);
        if (cached) {
            return res.status(200).json(cached);
        }

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

router.get('/catch_disci/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const params = `disc:${id}`;

        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }

        const disci = await disciplines.findAll({
            where: { id_course: id },
            raw: true,
        });

        cache.set(params, { disci }, 60 * 20);
        return res.status(200).json({ disci });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu algum erro' });
    }
});

router.get('/catch_modules/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const params = `module:${id}`;

        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }

        const module = await modules.findAll({
            where: { id_discipline: id },
            raw: true,
        });

        cache.set(params, { module }, 60 * 20);
        return res.status(200).json({ module });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro' });
    }
});

router.get('/catch_classes/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const params = `classes:${id}`;

        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }
        const classe = await classes.findAll({
            where: { id_module: id },
        });

        cache.set(params, classe, 60 * 20);
        return res.status(200).json({ classe });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro' });
    }
});

router.get('/catch_materials/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const params = `material:${id}`;

        const cached = await cache.get(params);

        if (cached) {
            return res.status(200).json(cached);
        }
        const material = await materials.findAll({
            where: { id_module: id },
        });

        cache.set(params, material, 60 * 20);
        return res.status(200).json({ material });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro' });
    }
});

router.put('/mark_viewed/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await classes.update({ view: 1 }, { where: { id } });
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(400).json({ err: 'erro no processamento!' });
    }
});

module.exports = (app) => app.use('/course', router);
