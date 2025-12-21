import { z } from "zod";

export const GetAnomaliesQueryDto = z.object({
    status: z.enum(["ACTIVE", "UNDER_REVIEW", "RESOLVED"]).optional(),
});
