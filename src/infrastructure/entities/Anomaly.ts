import { Schema, model, Types } from "mongoose";

const anomalySchema = new Schema(
    {
        solarUnitId: {
            type: Schema.Types.ObjectId,
            ref: "SolarUnit",
            required: true,
        },
        type: {
            type: String,
            enum: [
                "LOW_POWER",
                "ZERO_OUTPUT",
                "NIGHT_GENERATION",
                "SUDDEN_DROP",
            ],
            required: true,
        },
        severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            required: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "UNDER_REVIEW", "RESOLVED"],
            default: "ACTIVE",
        },
        description: {
            type: String,
            required: true,
        },
        detectedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const Anomaly = model("Anomaly", anomalySchema);
