import {z} from "zod";

export const createSolarUnitDTO = z.object({
    serialNumber: z.string().min(1),
    installationDate: z.string().min(1),
    capacity: z.number(),
    status: z.enum(["ACTIVE","INACTIVE","MAINTENANCE"]),
    userId: z.string().min(1),
});