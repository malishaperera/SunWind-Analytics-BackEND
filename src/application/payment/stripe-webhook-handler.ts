import Stripe from "stripe";
import { Request, Response } from "express";
import { Invoice } from "../../infrastructure/entities/Invoice";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeWebhookHandler = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("Stripe webhook error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const invoiceId = session.metadata?.invoiceId;

        if (invoiceId && session.payment_status === "paid") {
            await Invoice.findByIdAndUpdate(invoiceId, {
                paymentStatus: "PAID",
                paidAt: new Date(),
            });
        }
    }

    res.json({ received: true });
};