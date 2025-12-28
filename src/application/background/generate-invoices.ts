import { SolarUnit } from "../../infrastructure/entities/SolarUnit";
import { EnergyGenerationRecord } from "../../infrastructure/entities/EnergyGenerationRecord";
import { Invoice } from "../../infrastructure/entities/Invoice";

export const generateMonthlyInvoices = async () => {
    console.log("📄 Starting invoice generation...");

    const solarUnits = await SolarUnit.find();

    for (const unit of solarUnits) {
        // 1️⃣ Find last invoice
        const lastInvoice = await Invoice.findOne({
            solarUnitId: unit._id,
        }).sort({ billingPeriodEnd: -1 });

        // 2️⃣ Determine billing period
        const periodStart = lastInvoice
            ? new Date(lastInvoice.billingPeriodEnd)
            : new Date(unit.installationDate);


        const periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        // 3️⃣ Sum energy generated
        const records = await EnergyGenerationRecord.find({
            solarUnitId: unit._id,
            timestamp: {
                $gte: periodStart,
                $lt: periodEnd,
            },
        });

        const totalEnergy = records.reduce(
            (sum, r) => sum + r.energyGenerated,
            0
        );

        // 4️⃣ Skip if no energy
        // if (totalEnergy === 0) continue;

        // 5️⃣ Create invoice
        await Invoice.create({
            userId: unit.userId,
            solarUnitId: unit._id,
            billingPeriodStart: periodStart,
            billingPeriodEnd: periodEnd,
            totalEnergyGenerated: Math.round(totalEnergy),
            paymentStatus: "PENDING",
        });

        console.log(`✅ Invoice created for SolarUnit ${unit._id}`);
    }
};
