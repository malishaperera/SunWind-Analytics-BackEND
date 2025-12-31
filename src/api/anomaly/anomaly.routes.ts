import express from "express";
import { getAnomalies } from "../../application/anomaly/get-anomalies";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import {detectAnomalies} from "../../application/anomaly/detect-anomalies";
import {getAnomalyTrends} from "../../application/anomaly/getAnomalyTrend";

const router = express.Router();

router.get("/", authenticationMiddleware, getAnomalies);
router.post("/detect", authenticationMiddleware, async (req, res) => {
    await detectAnomalies();
    res.json({ message: "Anomaly detection completed" });
});
router.get("/trend",authenticationMiddleware, getAnomalyTrends);

export default router;
