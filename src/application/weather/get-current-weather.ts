import { Request, Response, NextFunction } from "express";
import { GetCurrentWeatherQueryDto } from "../../domain/dto/weather";
import { ValidationError } from "../../domain/errors/errors";
import {fetchCurrentWeather} from "../../infrastructure/weather/open-meteo.client";

export const getCurrentWeather = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = GetCurrentWeatherQueryDto.safeParse(req.query);

        if (!result.success) {
            throw new ValidationError(result.error.message);
        }

        const { lat, lon } = result.data;

        const data = await fetchCurrentWeather(
            Number(lat),
            Number(lon)
        );

        const current = data.current_weather;

        res.status(200).json({
            temperature: current.temperature,
            windSpeed: current.windspeed,
            isDay: current.is_day === 1,
            weatherCode: current.weathercode,
            time: current.time,
        });
    } catch (error) {
        next(error);
    }
};
