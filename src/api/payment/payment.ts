import express from "express";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";
import {createCheckoutSession} from "../../application/payment/payment";


const payment_webhook = express.Router();

// Create Stripe Checkout Session
payment_webhook.post(
    "/create-checkout-session",
    authenticationMiddleware,
    createCheckoutSession
);

export default payment_webhook;
