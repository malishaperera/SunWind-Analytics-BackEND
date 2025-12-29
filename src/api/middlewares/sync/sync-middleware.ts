// import { NextFunction, Request, Response } from "express";
// import { getAuth } from "@clerk/express";
// import { NotFoundError } from "../../../domain/errors/errors";
// import { User } from "../../../infrastructure/entities/User"
// import { SolarUnit } from "../../../infrastructure/entities/SolarUnit";
// import { EnergyGenerationRecord } from "../../../infrastructure/entities/EnergyGenerationRecord";
//
// import { z } from "zod";
//
// export const DataAPIEnergyGenerationRecordDto = z.object({
//     _id: z.string(),
//     serialNumber: z.string(),
//     energyGenerated: z.number(),
//     timestamp: z.string(),
//     intervalHours: z.number(),
//     __v: z.number(),
// });
//
// /**
//  * Synchronizes energy generation records from the data API
//  * Fetches latest records and merges new data with existing records
//  */
// export const syncMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//     try {
//         const auth = getAuth(req);
//         console.log("Sync middleware - Authenticated user ID:", auth.userId);
//         const user = await User.findOne({ clerkUserId: auth.userId });
//         if (!user) {
//             throw new NotFoundError("User not found");
//         }
//
//         const solarUnit = await SolarUnit.findOne({ userId: user._id });
//         if (!solarUnit) {
//             throw new NotFoundError("Solar unit not found");
//         }
//
//         // Fetch latest records from data API
//         const dataAPIResponse = await fetch(
//             // `http://localhost: 3000/api/energy-generation-records/solar-unit/${solarUnit.serialNumber}`
//             `${process.env.DATA_API_URL}/api/energy-generation-records/solar-unit/${solarUnit.serialNumber}`
//         );
//         if (!dataAPIResponse.ok) {
//             throw new Error("Failed to fetch energy generation records from data API");
//         }
//
//         const latestEnergyGenerationRecords = DataAPIEnergyGenerationRecordDto
//             .array()
//             .parse(await dataAPIResponse.json());
//
//         // Get latest synced timestamp to only fetch new data
//         const lastSyncedRecord = await EnergyGenerationRecord
//             .findOne({ solarUnitId: solarUnit._id })
//             .sort({ timestamp: -1 });
//
//         // Filter records that are new (not yet in database)
//         const newRecords = latestEnergyGenerationRecords.filter(apiRecord => {
//             if (!lastSyncedRecord) return true; // First sync, add all
//             return new Date(apiRecord.timestamp) > lastSyncedRecord.timestamp;
//         });
//
//         if (newRecords.length > 0) {
//             // Transform API records to match schema
//             const recordsToInsert = newRecords.map(record => ({
//                 solarUnitId: solarUnit._id,
//                 energyGenerated: record.energyGenerated,
//                 timestamp: new Date(record.timestamp),
//                 intervalHours: record.intervalHours,
//             }));
//
//             await EnergyGenerationRecord.insertMany(recordsToInsert);
//             console.log(`Synced ${recordsToInsert.length} new energy generation records`);
//         } else {
//             console.log("No new records to sync");
//         }
//
//         next();
//     } catch (error) {
//         console.error("Sync middleware error:", error);
//         next(error);
//     }
// };

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

        // ⏱ Timeout protection
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
