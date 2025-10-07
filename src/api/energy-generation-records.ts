import express from "express";
import {getAllEnergyGenerationRecordsBySolarUnitId} from "../application/energy-generation-records";

const energyGenerationRecordRouter = express.Router();

energyGenerationRecordRouter.route("/solar-unit/:id").get(getAllEnergyGenerationRecordsBySolarUnitId);
// .post(createEnergyGenerationRecord)
// energyGenerationRecordRouter.route("/:id").get(getEnergyGenerationRecordById).put(updateEnergyGenerationRecord).delete(deleteEnergyGenerationRecord);

export default energyGenerationRecordRouter;