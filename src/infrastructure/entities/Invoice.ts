import { Schema, model, Types } from "mongoose";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

const invoiceSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },

        solarUnitId: {
            type: Types.ObjectId,
            ref: "SolarUnit",
            required: true,
        },

        billingPeriodStart: {
            type: Date,
            required: true,
        },

        billingPeriodEnd: {
            type: Date,
            required: true,
        },

        totalEnergyGenerated: {
            type: Number, // kWh
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING",
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Invoice = model("Invoice", invoiceSchema);
