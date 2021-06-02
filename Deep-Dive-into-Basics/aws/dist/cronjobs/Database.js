"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const JobScheduler = require("node-schedule");
class Database {
    static runDatabaseJobs() {
        this.backupJob();
    }
    static backupJob() {
        JobScheduler.scheduleJob('send email job', ' * * * * *', () => {
            console.log('Database Job Schedule');
        });
    }
}
exports.Database = Database;
