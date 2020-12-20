const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ cursor: 'Qg Do enem' });
});

module.exports = (app) => app.use('/course', router);
