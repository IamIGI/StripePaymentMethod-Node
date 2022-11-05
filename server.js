require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const storeItems = new Map([
    [1, { priceInZloty: 3999.99, name: 'Laptop nr.1' }],
    [2, { priceInZloty: 6900.0, name: 'Laptop nr.2' }],
]);

app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map((item) => {
                const storeItem = storeItems.get(item.id);
                return {
                    price_data: {
                        currency: 'pln',
                        product_data: {
                            name: storeItem.name,
                        },
                        unit_amount: storeItem.priceInZloty * 100, //stripe need payment in cents/ groszy
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: `${process.env.SERVER_URL}/success.html`,
            cancel_url: `${process.env.SERVER_URL}/cancel.html`,
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000);
