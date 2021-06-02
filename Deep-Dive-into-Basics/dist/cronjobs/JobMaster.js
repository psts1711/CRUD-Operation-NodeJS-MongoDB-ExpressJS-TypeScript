"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobMaster = void 0;
const Database_1 = require("./Database");
const Email_1 = require("./Email");
class JobMaster {
    static runRequiredJobs() {
        Database_1.Database.runDatabaseJobs();
        Email_1.Email.runEmailJobs();
    }
}
exports.JobMaster = JobMaster;
