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

        //Find User by clerkUserId
        const user = await User.findOne({ clerkUserId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //Find user's solar units
        const solarUnits = await SolarUnit.find({ userId: user._id });

        const solarUnitIds = solarUnits.map((s) => s._id);

        //Find anomalies only for those units
        const anomalies = await Anomaly.find({
            solarUnitId: { $in: solarUnitIds },
        }).sort({ detectedAt: -1 });

        res.json(anomalies);
    } catch (error) {
        next(error);
    }
};

