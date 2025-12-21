import { z } from "zod";

export const GetCurrentWeatherQueryDto = z.object({
    lat: z.string().min(1),
    lon: z.string().min(1),
});
