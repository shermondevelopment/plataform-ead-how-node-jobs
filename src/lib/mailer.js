const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const mailer = require('../config/mail');

mailer.use(
    'compile',
    hbs({
        viewEngine: {
            extName: '.html',
            partialsDir: path.resolve('.src/resources/mail/auth/'),
            layoutsDir: path.resolve('./src/resources/mail/auth/'),
            defaultLayout: '',
        },
        viewPath: path.resolve('./src/resources/mail/auth/'),
        extName: '.html',
    })
);

module.exports = mailer;
