import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { User } from "../../../infrastructure/entities/User";
import { SolarUnit } from "../../../infrastructure/entities/SolarUnit";
import { EnergyGenerationRecord } from "../../../infrastructure/entities/EnergyGenerationRecord";
import { z } from "zod";

export const DataAPIEnergyGenerationRecordDto = z.object({
    _id: z.string(),
    serialNumber: z.string(),
    energyGenerated: z.number(),
    timestamp: z.string(),
    intervalHours: z.number(),
    __v: z.number(),
});

export const syncMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log("Starting sync middleware...");
        const auth = getAuth(req);
        if (!auth.userId) return next();

        const user = await User.findOne({ clerkUserId: auth.userId });
        if (!user) return next();

        const solarUnit = await SolarUnit.findOne({ userId: user._id });
        if (!solarUnit) return next();

        // sync only once per 5 minutes
        if (
            solarUnit.lastSyncedAt &&
            Date.now() - solarUnit.lastSyncedAt.getTime() < 5 * 60 * 1000
        ) {
            return next();
        }

        const lastRecord = await EnergyGenerationRecord
            .findOne({ solarUnitId: solarUnit._id })
            .sort({ timestamp: -1 });

        const url = new URL(
            `${process.env.DATA_API_URL}/api/energy-generation-records/solar-unit/${solarUnit.serialNumber}`
        );

        if (lastRecord?.timestamp) {
            url.searchParams.append(
                "sinceTimestamp",
                lastRecord.timestamp.toISOString()
            );
        }

        //Timeout protection
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url.toString(), {
            signal: controller.signal,
        });

        if (!response.ok) {
            console.warn("⚠️ Sync skipped: Data API not ready");
            return next();
        }

        const records = DataAPIEnergyGenerationRecordDto
            .array()
            .parse(await response.json());

        if (records.length > 0) {
            const docs = records.map(r => ({
                solarUnitId: solarUnit._id,
                energyGenerated: r.energyGenerated,
                timestamp: new Date(r.timestamp),
                intervalHours: r.intervalHours,
            }));

            await EnergyGenerationRecord.insertMany(docs);
        }

        // Update last sync time
        solarUnit.lastSyncedAt = new Date();
        await solarUnit.save();

        next();
    } catch (error) {
        console.error("Sync failed but ignored:", error);
        next();
    }
};
