import cron from "node-cron";
import { syncEnergyGenerationRecords } from "../../application/background/sync-energy-generation-records";
import { generateMonthlyInvoices } from "../../application/background/generate-invoices";

export const initializeScheduler = () => {

    //  Daily Energy Sync
    const syncSchedule =
        process.env.SYNC_CRON_SCHEDULE || "0 0 * * *";

    cron.schedule(
        syncSchedule,
        async () => {
            console.log(
                `[${new Date().toISOString()}] Starting daily energy sync...`
            );
            try {
                await syncEnergyGenerationRecords();
                console.log(
                    `[${new Date().toISOString()}]Daily energy sync completed`
                );
            } catch (error) {
                console.error(
                    `[${new Date().toISOString()}]Daily energy sync failed`,
                    error
                );
            }
        });
    // 🧾 Monthly Invoice Generation
    const invoiceSchedule =
        process.env.INVOICE_CRON_SCHEDULE || "0 1 * * *";

    cron.schedule(invoiceSchedule, async () => {
        console.log(
            `[${new Date().toISOString()}] Starting invoice generation...`
        );
        try {
            await generateMonthlyInvoices();
            console.log(
                `[${new Date().toISOString()}] Invoice job finished`
            );
        } catch (error) {
            console.error(
                `[${new Date().toISOString()}] Invoice job failed`,
                error
            );
        }
    });

    console.log("⏰ Scheduler initialized");
    console.log(`🔄 Energy Sync: ${syncSchedule}`);
    console.log(`🧾 Invoice Job: ${invoiceSchedule}`);
};
