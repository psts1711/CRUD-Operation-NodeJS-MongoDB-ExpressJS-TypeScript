import * as JobScheduler from 'node-schedule';

export class Email{

    static runEmailJobs(){
        this.sendEmailJobs()
    }

    static sendEmailJobs(){
        JobScheduler.scheduleJob('send email job', ' * * * * *', ()=>{
            console.log('Email Job Schedule');
        })
    }

}