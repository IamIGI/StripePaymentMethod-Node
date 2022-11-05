require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const storeItems = new Map([
    [1, { priceInCents: 10000, name: 'Laptop nr.1' }],
    [2, { priceInCents: 9999, name: 'Laptop nr.2' }],
]);

app.post('/create-checkout-session', (req, res) => {
    res.json({ url: 'Hi12' });
});

app.listen(3000);
