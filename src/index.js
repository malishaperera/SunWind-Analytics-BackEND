import "dotenv/config";
import express from "express";
import solarUnitRouter from "./api/solar-unit.js";
import {connectDB} from "./infrastructure/db.js";


const server = express();
server.use(express.json());

server.use("/api/solar-units", solarUnitRouter);

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