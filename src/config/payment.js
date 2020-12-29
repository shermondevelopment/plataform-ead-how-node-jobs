const mercadoPago = require('mercadopago');

mercadoPago.configure({
    sandbox: true,
    access_token: process.env.PAYMENT_TOKEN,
});

module.exports = mercadoPago;
