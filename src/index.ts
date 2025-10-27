import "dotenv/config";
import express from "express";
import solarUnitRouter from "./api/solar-unit";
import energyGenerationRecordRouter from "./api/energy-generation-records";
import {connectDB} from "./infrastructure/db";
import {globalErrorHandler} from "./api/middlewares/global-error-handling-middleware";
import cors from "cors"; 

const server = express();
server.use(express.json());
server.use(cors({origin:"http://localhost:5173"}));

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