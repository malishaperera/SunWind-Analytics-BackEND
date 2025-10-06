import {EnergyGenerationRecord} from "../infrastructure/entities/EnergyGenerationRecord.js";

export const getAllEnergyGenerationRecordsBySolarUnitId = async (req,res) =>{
    try {
        const {id} = req.params;
        const energyGenerationRecords = await EnergyGenerationRecord.find({
            solarUnitId:req.params.id,
        });
        res.status(200).json(energyGenerationRecords);
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
    }
}