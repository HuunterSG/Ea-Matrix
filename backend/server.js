// server.js - Backend completo para EA Matrix con .env para credenciales
// Deploy en Vercel (variables de entorno) o local

require('dotenv').config(); // ← Carga .env al inicio

const express = require('express');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const twilio = require('twilio');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// ======================== CONFIGURACIÓN MERCADO PAGO v2 ========================
const mpClient = new MercadoPagoConfig({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

// ======================== CONFIGURACIÓN TWILIO ========================
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const TU_WHATSAPP = process.env.TU_WHATSAPP;

// ======================== BASE DE DATOS SQLITE ========================
const db = new sqlite3.Database(path.join(__dirname, 'orders.db'), (err) => {
    if (err) console.error('Error conectando DB:', err);
    else console.log('DB SQLite conectada');
});

// Crear tabla de órdenes
db.run(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payment_id TEXT UNIQUE,
        status TEXT,
        items TEXT,
        total REAL,
        buyer_name TEXT,
        buyer_email TEXT,
        buyer_phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// ======================== ENDPOINT CREAR PREFERENCE ========================
app.post('/create-preference', async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Carrito vacío' });
        }

        const preference = new Preference(mpClient);

        const response = await preference.create({
            body: {
                items: items.map(item => ({
                    title: item.name,
                    unit_price: item.price,
                    quantity: 1,
                    currency_id: 'ARS'
                })),
                back_urls: {
                    success: 'https://eamatrix.com.ar/success.html',
                    failure: 'https://eamatrix.com.ar/failure.html',
                    pending: 'https://eamatrix.com.ar/pending.html'
                },
                auto_return: 'approved',
                notification_url: `${req.protocol}://${req.get('host')}/webhook`
            }
        });

        res.json({ id: response.id });
    } catch (error) {
        console.error('Error creando preference:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// ======================== WEBHOOK MERCADO PAGO ========================
app.post('/webhook', async (req, res) => {
    try {
        const data = req.body || req.query;
        if (data.type === 'payment') {
            const paymentId = data.data.id;
            const payment = new Payment(mpClient);
            const paymentData = await payment.get({ id: paymentId });

            if (paymentData.status === 'approved') {
                const items = paymentData.additional_info?.items || [];
                const total = paymentData.transaction_amount;
                const buyer = paymentData.payer;

                // Guardar en DB
                db.run(
                    `INSERT OR IGNORE INTO orders (payment_id, status, items, total, buyer_name, buyer_email, buyer_phone)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        paymentId,
                        'approved',
                        JSON.stringify(items),
                        total,
                        `${buyer.first_name || ''} ${buyer.last_name || ''}`,
                        buyer.email || 'No proporcionado',
                        buyer.phone?.number || 'No proporcionado'
                    ]
                );

                // Mensaje WhatsApp
                const productList = items.map(i => `${i.title} x${i.quantity} - $${i.unit_price}`).join('\n');
                const message = `¡Nueva venta confirmada!\n\nProductos:\n${productList}\n\nTotal: $${total}\nComprador: ${buyer.first_name} ${buyer.last_name}\nEmail: ${buyer.email}\nTel: ${buyer.phone?.number || 'No proporcionado'}\n\nCoordiná el envío!`;

                await twilioClient.messages.create({
                    from: 'whatsapp:+14155238886', // Sandbox o número oficial
                    to: TU_WHATSAPP,
                    body: message
                });
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error webhook:', error);
        res.sendStatus(500);
    }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));