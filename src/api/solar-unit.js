import express from "express";
import {
    createSolarUnit,
    deleteSolarUnit,
    getAllSolarUnits,
    getSolarUnitById,
    updateSolarUnit
} from "../application/solar-unit.js";

const solarUnitRouter = express.Router();

solarUnitRouter.route("/").get(getAllSolarUnits).post(createSolarUnit);
solarUnitRouter.route("/:id").get(getSolarUnitById).put(updateSolarUnit).delete(deleteSolarUnit);

export default solarUnitRouter;



