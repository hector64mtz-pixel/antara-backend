require("dotenv").config();
const { Stripe } = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-03-25.dahlia' });

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const mode = "payment"; // Pago único
        
        const session = await stripe.checkout.sessions.create({
            ui_mode: "form",
            mode,
            billing_address_collection: "auto",
            phone_number_collection: { enabled: false },
            automatic_tax: { enabled: false },
            payment_method_collection: "always",
            submit_type: "pay",
            integration_identifier: "custom_embedded_web_0001",
            line_items: [{ price: "price_1Mx...", quantity: 1 }], // <-- Aquí pondrás tu Price ID real de Stripe
            success_url: `${process.env.FRONTEND_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel.html`,
        });

        res.json({ client_secret: session.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Servidor de Antara corriendo en el puerto ${PORT}`));