import "dotenv/config";
import express from "express";
import solarUnitRouter from "./api/solar-unit";
import energyGenerationRecordRouter from "./api/energy-generation-records";
import {connectDB} from "./infrastructure/db";



const server = express();
server.use(express.json());

server.use("/api/solar-units", solarUnitRouter);
server.use("/api/energy-generation-records", energyGenerationRecordRouter);

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