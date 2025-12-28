import Stripe from "stripe";
import { Request, Response } from "express";
import { Invoice } from "../../infrastructure/entities/Invoice";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 🔹 CREATE CHECKOUT SESSION
export const createCheckoutSession = async (req: Request, res: Response) => {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.paymentStatus === "PAID") {
        return res.status(400).json({ message: "Invoice already paid" });
    }

    if (invoice.totalEnergyGenerated <= 0) {
        return res.status(400).json({
            message: "No energy usage to bill",
        });
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
            {
                price: process.env.STRIPE_PRICE_ID!,
                quantity: Math.max(1, Math.round(invoice.totalEnergyGenerated)),
            },
        ],
        success_url: `${process.env.FRONTEND_URL}/dashboard/invoices/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/dashboard/invoices`,
        metadata: {
            invoiceId: invoice._id.toString(),
        },
    });

    res.json({ sessionId: session.id });
};
