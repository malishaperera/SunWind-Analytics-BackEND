import express from "express";
import { stripeWebhookHandler } from "../../application/payment/stripe-webhook-handler";

const router = express.Router();

router.post(
    "/",
    express.raw({ type: "application/json" }),
    stripeWebhookHandler
);

export default router;
