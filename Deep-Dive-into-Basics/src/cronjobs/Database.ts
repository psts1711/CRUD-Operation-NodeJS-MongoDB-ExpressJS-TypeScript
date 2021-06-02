import * as JobScheduler from "node-schedule";

export class Database{

    static runDatabaseJobs(){
        this.backupJob()
    }

    static backupJob(){
        JobScheduler.scheduleJob('send email job', ' * * * * *', ()=>{
            console.log('Database Job Schedule');
        })
    }

}