import "dotenv/config";
import express from "express";
import solarUnitRouter from "./api/solar-unit";
import energyGenerationRecordRouter from "./api/energy-generation-records";
import {connectDB} from "./infrastructure/db";
import {globalErrorHandler} from "./api/middlewares/global-error-handling-middleware";
import cors from "cors";
import webhooksRouter from "./api/webhooks/webhooks";
import {loggerMiddleware} from "./api/middlewares/logger-middleware";
import {clerkMiddleware} from "@clerk/express";

const server = express();
server.use(cors({origin:"http://localhost:5173"}));

server.use(loggerMiddleware);

server.use("/api/webhooks", webhooksRouter);

server.use(clerkMiddleware())

server.use(express.json());

server.use("/api/solar-units", solarUnitRouter);
server.use("/api/energy-generation-records", energyGenerationRecordRouter);

server.use(globalErrorHandler)

connectDB();

const PORT = 3000;
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

/* Identify the resources
Solar Unit
Energy Generation Record
User
House*/