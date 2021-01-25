const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => { // eslint-disable-line
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: 'No token provided' });
    }
    const parts = authHeader.split(' ');
    if (!parts.length === 2) {
        return res.status(401).send({ error: 'Token Invalid' });
    }
    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token malformatted' });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Token invalid' });
        }
        req.userId = decoded.params.id;
        req.admin = decoded.params.admin;
        return next();
    });
};
