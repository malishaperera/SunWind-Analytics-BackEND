import Stripe from "stripe";
import { Request, Response } from "express";
import { Invoice } from "../../infrastructure/entities/Invoice";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeWebhookHandler = async (
    req: Request,
    res: Response
) => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
        return res.status(400).send("Missing Stripe signature");
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Payment success event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const invoiceId = session.metadata?.invoiceId;

        if (invoiceId) {
            await Invoice.findByIdAndUpdate(invoiceId, {
                paymentStatus: "PAID",
            });

            console.log("✅ Invoice marked as PAID:", invoiceId);
        }
    }

    res.json({ received: true });
};
