import { Request, Response } from "express";
import Stripe from "stripe";
import { Invoice } from "../../infrastructure/entities/Invoice";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // MUST be raw body
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("❌ Webhook signature verification failed", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid") {
            const invoiceId = session.metadata?.invoiceId;

            if (invoiceId) {
                await Invoice.findByIdAndUpdate(invoiceId, {
                    paymentStatus: "PAID",
                    paidAt: new Date(),
                });

                console.log("✅ Invoice marked as PAID:", invoiceId);
            }
        }
    }

    res.status(200).json({ received: true });
};
