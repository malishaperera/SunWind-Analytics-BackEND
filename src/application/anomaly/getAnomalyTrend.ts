import { Request, Response } from "express";
import { Anomaly } from "../../infrastructure/entities/Anomaly";

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

       // (LAST 7 DAYS)
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

       // WEEKLY (LAST 4 WEEKS – TODAY INCLUDED)

    if (range === "weekly") {
        const start = new Date();
        start.setDate(start.getDate() - 27); // last 28 days
        start.setHours(0, 0, 0, 0);

        const anomalies = await Anomaly.find({
            detectedAt: { $gte: start },
        });

        const result = [
            { label: "Week 1", count: 0 }, // 22–28 days ago
            { label: "Week 2", count: 0 }, // 15–21 days ago
            { label: "Week 3", count: 0 }, // 8–14 days ago
            { label: "Week 4", count: 0 }, // last 7 days (TODAY)
        ];

        anomalies.forEach((a) => {
            const diffDays = Math.floor(
                (now.getTime() - a.detectedAt.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            if (diffDays <= 6) result[3].count++;        // TODAY
            else if (diffDays <= 13) result[2].count++;
            else if (diffDays <= 20) result[1].count++;
            else if (diffDays <= 27) result[0].count++;
        });

        return res.json(result);
    }

    return res.json([]);
};
