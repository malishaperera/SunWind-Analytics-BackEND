import { SolarUnit } from "../../infrastructure/entities/SolarUnit";
import { EnergyGenerationRecord } from "../../infrastructure/entities/EnergyGenerationRecord";
import { Invoice } from "../../infrastructure/entities/Invoice";

export const generateMonthlyInvoices = async () => {
    console.log("🧾 Running monthly invoice generation...");

    //Get all ACTIVE solar units
    const solarUnits = await SolarUnit.find({ status: "ACTIVE" });

    for (const unit of solarUnits) {
        //Find last invoice for this solar unit
        const lastInvoice = await Invoice.findOne({
            solarUnitId: unit._id,
        }).sort({ billingPeriodEnd: -1 });

        let billingStart: Date;

        if (lastInvoice) {
            billingStart = new Date(lastInvoice.billingPeriodEnd);
        } else {
            billingStart = new Date(unit.installationDate);
        }

        //Calculate billing end (1 month)
        const billingEnd = new Date(billingStart);
        billingEnd.setMonth(billingEnd.getMonth() + 1);

        //Do not generate future invoices
        if (billingEnd > new Date()) {
            continue;
        }

        //Sum energy generated in this period
        const energyResult = await EnergyGenerationRecord.aggregate([
            {
                $match: {
                    solarUnitId: unit._id,
                    timestamp: {
                        $gte: billingStart,
                        $lt: billingEnd,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalEnergy: { $sum: "$energyGenerated" },
                },
            },
        ]);

        const totalEnergyGenerated =
            energyResult.length > 0 ? energyResult[0].totalEnergy : 0;

        //Create invoice
        await Invoice.create({
            userId: unit.userId,
            solarUnitId: unit._id,
            billingPeriodStart: billingStart,
            billingPeriodEnd: billingEnd,
            totalEnergyGenerated,
            paymentStatus: "PENDING",
        });

        console.log(
            `✅ Invoice created for unit ${unit.serialNumber} | ${billingStart.toDateString()} → ${billingEnd.toDateString()}`
        );
    }

    console.log("🧾 Invoice generation completed");
};