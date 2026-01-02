import { Request, Response, NextFunction } from "express";
import { Anomaly } from "../../infrastructure/entities/Anomaly";
import { SolarUnit } from "../../infrastructure/entities/SolarUnit";
import { User } from "../../infrastructure/entities/User";
import { getAuth } from "@clerk/express";

export const getAnomalies = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId: clerkUserId } = getAuth(req);

        if (!clerkUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Find user
        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find user's solar units
        const solarUnits = await SolarUnit.find({ userId: user._id });
        const solarUnitIds = solarUnits.map((s) => s._id);

        // TODAY START
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Fetch TODAY anomalies ONLY
        const anomalies = await Anomaly.find({
            solarUnitId: { $in: solarUnitIds },
            detectedAt: { $gte: startOfToday },
        }).sort({ detectedAt: -1 });

        res.status(200).json(anomalies);
    } catch (error) {
        next(error);
    }
};

