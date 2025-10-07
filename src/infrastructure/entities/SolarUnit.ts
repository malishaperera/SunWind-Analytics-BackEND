import mongoose from "mongoose";

const SolarUnitSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    serialNumber:{
        type: String,
        required: true,
        unique: true,
    },
    installationDate:{
        type: Date,
        required: true,
    },
    capacity:{
        type: Number,
        required: true,
    },

    status:{
        type: String,
        enum: ["ACTIVE", "INACTIVE", "MAINTENANCE"],
        default: "ACTIVE",
    },
});

export const SolarUnit = mongoose.model("SolarUnit", SolarUnitSchema);