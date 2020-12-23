const express = require('express');

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
        return res.status(200).json({ ...ready, next });
    } catch (err) {
        return res.status(400).json({ err });
    }
});

router.get('/catch_disci/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const disci = await disciplines.findAll({
            where: { id_course: id },
            raw: true,
        });

        return res.status(200).json({ disci });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu algum erro' });
    }
});

router.get('/catch_modules/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const module = await modules.findAll({
            where: { id_discipline: id },
            raw: true,
        });
        return res.status(200).json({ module });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro' });
    }
});

router.get('/catch_classes/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const classe = await classes.findAll({
            where: { id_module: id },
        });
        return res.status(200).json({ classe });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro' });
    }
});

router.get('/catch_materials/:id', userMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const material = await materials.findAll({
            where: { id_module: id },
        });
        return res.status(200).json({ material });
    } catch (err) {
        return res.status(400).json({ err: 'Ocorreu um erro' });
    }
});

module.exports = (app) => app.use('/course', router);
