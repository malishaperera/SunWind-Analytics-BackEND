// import cron from 'node-cron';
// import { syncEnergyGenerationRecords } from '../application/background/sync-energy-generation-records';
//
// export const initializeScheduler = () => {
//   // Run daily at 00:00 (midnight) - cron expression: '0 0 * * *'
//   const schedule = process.env.SYNC_CRON_SCHEDULE || '0 0 * * *';
//
//   cron.schedule(schedule, async () => {
//     console.log(`[${new Date().toISOString()}] Starting daily energy generation records sync...`);
//     try {
//       await syncEnergyGenerationRecords();
//       console.log(`[${new Date().toISOString()}] Daily sync completed successfully`);
//     } catch (error) {
//       console.error(`[${new Date().toISOString()}] Daily sync failed:`, error);
//     }
//   });
//
//   console.log(`[Scheduler] Energy generation records sync scheduled for: ${schedule}`);
// };


import cron from "node-cron";
import { syncEnergyGenerationRecords } from "../application/background/sync-energy-generation-records";
import { generateMonthlyInvoices } from "../application/background/generate-invoices";

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
        process.env.INVOICE_CRON_SCHEDULE || "1 0 1 * *";

    cron.schedule(
        invoiceSchedule,
        async () => {
            console.log(
                `[${new Date().toISOString()}]Starting monthly invoice generation...`
            );
            try {
                await generateMonthlyInvoices();
                console.log(
                    `[${new Date().toISOString()}]Monthly invoices generated`
                );
            } catch (error) {
                console.error(
                    `[${new Date().toISOString()}]Invoice generation failed`,
                    error
                );
            }
        },
        {
            timezone: "Asia/Colombo",
        }
    );

    console.log("⏰ Scheduler initialized");
    console.log(`🔄 Energy Sync: ${syncSchedule}`);
    console.log(`🧾 Invoice Job: ${invoiceSchedule}`);
};
