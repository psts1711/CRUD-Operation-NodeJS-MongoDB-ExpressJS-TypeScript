"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const JobScheduler = require("node-schedule");
class Email {
    static runEmailJobs() {
        this.sendEmailJobs();
    }
    static sendEmailJobs() {
        JobScheduler.scheduleJob('send email job', ' * * * * *', () => {
            console.log('Email Job Schedule');
        });
    }
}
exports.Email = Email;
