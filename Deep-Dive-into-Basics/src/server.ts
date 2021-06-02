import bodyParser = require("body-parser");
import express = require("express");
import * as mongoose from 'mongoose';
import { getEnvirmentVariables } from './environments/env';
import UserRouter from "./router/UserRouter";
import PostRouter from "./router/PostRouter";
import CommentRouter from "./router/CommentRouter";
import {JobMaster} from "./cronjobs/JobMaster";


export class Server {
    public app: express.Application = express();

    constructor()
    {
        this.setConfigurations();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();

    }

    setConfigurations()
    {
        this.connectMongodb();
        this.configureBodyParser();
        JobMaster.runRequiredJobs()
    }

    connectMongodb()
    {
        // Connect to databse
        const databaseUrl = getEnvirmentVariables().db_url;
        mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
            .then(()=>{
                console.log(('mongodb is connected'))
            })
    }

    configureBodyParser()
    {
        this.app.use(bodyParser.urlencoded({ extended:true}))
    }

    setRoutes()
    {
        this.app.use('/src/upload_files', express.static('src/upload_files'))
        this.app.use('/api/user', UserRouter)
        this.app.use('/api/post', PostRouter)
        this.app.use('/api/comment', CommentRouter)



    }

    error404Handler() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: 'Not Found',
                status_code: 404
            });
        })
    }

    handleErrors() {
        this.app.use((error, req, res, next) => {
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                message: error.message || 'Something Went Wrong. Please Try Again',
                status_code: errorStatus
            })
        })
    }


}