import { EnergyGenerationRecord } from "../../infrastructure/entities/EnergyGenerationRecord";
import { Anomaly } from "../../infrastructure/entities/Anomaly";

export const detectAnomalies = async () => {
    console.log("Starting anomaly detection...");
    const records = await EnergyGenerationRecord.find()
        .sort({ timestamp: -1 })
        .limit(50);

    for (const record of records) {
        // ZERO OUTPUT DURING DAY
        if (
            record.energyGenerated === 0 &&
            record.timestamp.getHours() >= 6 &&
            record.timestamp.getHours() <= 18
        ) {
            await Anomaly.create({
                solarUnitId: record.solarUnitId,
                type: "ZERO_OUTPUT",
                severity: "HIGH",
                description: "No energy generated during daylight hours",
                sourceTimestamp: record.timestamp,
            });
        }

        // NIGHT GENERATION
        if (
            record.energyGenerated > 50 &&
            (record.timestamp.getHours() < 6 ||
                record.timestamp.getHours() > 18)
        ) {
            await Anomaly.create({
                solarUnitId: record.solarUnitId,
                type: "NIGHT_GENERATION",
                severity: "MEDIUM",
                description: "Energy generated during night time",
            });
        }

        // LOW POWER
        if (record.energyGenerated < 100) {
            await Anomaly.create({
                solarUnitId: record.solarUnitId,
                type: "LOW_POWER",
                severity: "LOW",
                description: "Energy output lower than expected",
            });
        }
    }
};
