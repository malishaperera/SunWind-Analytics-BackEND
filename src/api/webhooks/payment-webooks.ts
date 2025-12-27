import express from "express";
import { stripeWebhookHandler } from "../../application/payment/stripe-webhook";

const router = express.Router();

// ⚠️ IMPORTANT: raw body for Stripe
router.post(
    "/stripe/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhookHandler
);

export default router;
