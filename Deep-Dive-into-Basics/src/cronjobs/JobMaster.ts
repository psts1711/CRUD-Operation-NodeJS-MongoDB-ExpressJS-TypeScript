import {Database} from "./Database";
import {Email} from "./Email";

export  class JobMaster {

    static runRequiredJobs(){
        Database.runDatabaseJobs()
        Email.runEmailJobs()
    }
}