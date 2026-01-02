import "dotenv/config";
import express from "express";
import solarUnitRouter from "./api/solar-unit";
import energyGenerationRecordRouter from "./api/energy-generation-records";
import {connectDB} from "./infrastructure/db";
import {globalErrorHandler} from "./api/middlewares/global-error-handling-middleware";
import cors from "cors";
import {loggerMiddleware} from "./api/middlewares/logger-middleware";
import {clerkMiddleware} from "@clerk/express";
import usersRouter from "./api/users";
import {initializeScheduler} from "./infrastructure/scripts/scheduler";
import weatherRouter from "./api/weather/weather.routes";
import anomalyRouter from "./api/anomaly/anomaly.routes";
import invoiceRouter from "./api/invoice/invoice.routes";
import paymentRoutes from "./api/payment/payment.routes";
import {handleStripeWebhook} from "./api/webhooks/stripe.webhook";

const server = express();

server.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://sunwind-analytics-frontends.netlify.app/",

        ],
        credentials: true,
    })
);
// "https://sunwind-analytics-frontend.netlify.app",
server.use(loggerMiddleware);

server.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

server.use(clerkMiddleware())
// server.use("/api/stripe/webhook", stripeWebhookRouter);
server.use(express.json());

server.use("/api/weather", weatherRouter);
server.use("/api/solar-units", solarUnitRouter);
server.use("/api/energy-generation-records", energyGenerationRecordRouter);
server.use("/api/users", usersRouter);
server.use("/api/anomalies", anomalyRouter);
server.use("/api/invoices", invoiceRouter);
server.use("/api/payments", paymentRoutes);

server.use(globalErrorHandler)
connectDB();
initializeScheduler();

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})


/* Identify the resources
Solar Unit
Energy Generation Record
User
House*/