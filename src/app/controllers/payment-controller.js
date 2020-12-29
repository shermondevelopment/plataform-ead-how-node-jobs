const express = require('express');

const { v4: uuidv4 } = require('uuid');

const { payments, users } = require('../models/index');
const mercadoPago = require('../../config/payment');
const userMiddleware = require('../middlewares/userAuth');

const router = express.Router();

router.post('/generate-payment', userMiddleware, async (req, res) => {
    try {
        const { id, email } = req.body;

        const reference = uuidv4();

        const dados = {
            items: [
                item = { // eslint-disable-line
                    id: reference,
                    title: 'Produto acesso',
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: parseFloat(20),
                }, // eslint-disable-line
            ],
            payer: {
                email,
            },
            external_reference: reference,
        };

        const paymentGenerate = await mercadoPago.preferences.create(dados);

        await payments.create({
            payment_reference: reference,
            id_payment_user: id,
            email_payment_user: email,
        });

        return res.status(200).json({ link: paymentGenerate.body.init_point });
    } catch (err) {
        return res
            .status(400)
            .json({ err: 'não foi possivel gerar pagamento' });
    }
});

router.post('/notification-payment', (req, res) => {
    try {
        const { id } = req.params;

        setTimeout(() => {
            const filtro = { 'order.id': id };
            mercadoPago.payment
                .search({
                    qs: filtro,
                })
                .then((data) => {
                    const pagamento = data.body.results[0];
                    if (pagamento.status === 'approved') {
                        payments
                            .update(
                                {
                                    status: 'approved',
                                },
                                {
                                    where: {
                                        payment_reference:
                                            pagamento.external_reference,
                                    },
                                }
                            )
                            .then((info) => {
                                users.update(
                                    { payment: true },
                                    { where: { id: info.id_payment_user } }
                                );
                            });
                    } else {
                        payments.update(
                            { status: pagamento.status },
                            {
                                where: {
                                    payment_reference:
                                        pagamento.external_reference,
                                },
                            }
                        );
                    }
                });
        }, 20000);
        return res.status(200).json({ received: true });
    } catch (err) {
        return res.status(400).json({ err: 'não há notificação' });
    }
});

module.exports = (app) => app.use('/payment', router);
