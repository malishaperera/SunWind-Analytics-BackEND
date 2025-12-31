import cron from "node-cron";
import {runSeed} from "./production-seed";


export const initializeSeedScheduler = () => {
    // ⏰ Every day at 12:00 PM
    cron.schedule("0 12 * * *", async () => {
        console.log("⏰ Running daily seed job (12 PM)");
        await runSeed();
    });
    console.log("🌱 Seed cron scheduled at 12:00 PM daily");
};
