import { Request, Response } from "express";
import { Anomaly } from "../../infrastructure/entities/Anomaly";

const getWeekNumber = (date: Date): number => {
    const temp = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ));

    const day = temp.getUTCDay() || 7;
    temp.setUTCDate(temp.getUTCDate() + 4 - day);

    const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
    return Math.ceil((((temp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const getAnomalyTrends = async (req: Request, res: Response) => {
    const { range = "hourly" } = req.query;
    const now = new Date();

    if (range === "hourly") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const raw = await Anomaly.aggregate([
            { $match: { detectedAt: { $gte: start } } },
            {
                $group: {
                    _id: { hour: { $hour: "$detectedAt" } },
                    count: { $sum: 1 },
                },
            },
        ]);

        const result = Array.from({ length: 24 }, (_, h) => {
            const found = raw.find(r => r._id.hour === h);
            return {
                label: `${String(h).padStart(2, "0")}:00`,
                count: found ? found.count : 0,
            };
        });

        return res.json(result);
    }

    if (range === "daily") {
        const start = new Date();
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);

        const raw = await Anomaly.aggregate([
            { $match: { detectedAt: { $gte: start } } },
            {
                $group: {
                    _id: {
                        day: {
                            $dateToString: { format: "%Y-%m-%d", date: "$detectedAt" },
                        },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        const result = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const key = d.toISOString().slice(0, 10);
            const found = raw.find(r => r._id.day === key);

            return {
                label: d.toLocaleDateString("en-US", { weekday: "short" }),
                count: found ? found.count : 0,
            };
        });
        return res.json(result);
    }

    if (range === "weekly") {
        const start = new Date();
        start.setDate(start.getDate() - 28);

        const raw = await Anomaly.aggregate([
            { $match: { detectedAt: { $gte: start } } },
            {
                $group: {
                    _id: { week: { $week: "$detectedAt" } },
                    count: { $sum: 1 },
                },
            },
        ]);

        const currentWeek = getWeekNumber(now);

        const result = Array.from({ length: 4 }, (_, i) => {
            const week = currentWeek - (3 - i);
            const found = raw.find(r => r._id.week === week);

            return {
                label: `Week ${i + 1}`,
                count: found ? found.count : 0,
            };
        });

        return res.json(result);
    }

    return res.json([]);
};
