import Stripe from "stripe";
import { Request, Response } from "express";
import { Invoice } from "../../infrastructure/entities/Invoice";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 🔹 CREATE CHECKOUT SESSION
export const createCheckoutSession = async (
    req: Request,
    res: Response
) => {
    const { invoiceId } = req.body;

    // 1️⃣ Invoice fetch
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.paymentStatus === "PAID") {
        return res.status(400).json({ message: "Invoice already paid" });
    }

    // 2️⃣ Stripe session
    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        mode: "payment",

        line_items: [
            {
                price: process.env.STRIPE_PRICE_ID!,
                quantity: Math.round(invoice.totalEnergyGenerated),
            },
        ],

        return_url: `${process.env.FRONTEND_URL}/dashboard/invoices/complete?session_id={CHECKOUT_SESSION_ID}`,

        metadata: {
            invoiceId: invoice._id.toString(),
        },
    });

    // 3️⃣ Send client secret
    res.json({
        clientSecret: session.client_secret,
    });
};

export default stripe;
