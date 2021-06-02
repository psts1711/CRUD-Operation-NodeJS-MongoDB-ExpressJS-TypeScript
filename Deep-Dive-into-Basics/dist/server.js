"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const env_1 = require("./environments/env");
const UserRouter_1 = require("./router/UserRouter");
const PostRouter_1 = require("./router/PostRouter");
const CommentRouter_1 = require("./router/CommentRouter");
const JobMaster_1 = require("./cronjobs/JobMaster");
class Server {
    constructor() {
        this.app = express();
        this.setConfigurations();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();
    }
    setConfigurations() {
        this.connectMongodb();
        this.configureBodyParser();
        JobMaster_1.JobMaster.runRequiredJobs();
    }
    connectMongodb() {
        // Connect to databse
        const databaseUrl = env_1.getEnvirmentVariables().db_url;
        mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
            .then(() => {
            console.log(('mongodb is connected'));
        });
    }
    configureBodyParser() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    setRoutes() {
        this.app.use('/src/upload_files', express.static('src/upload_files'));
        this.app.use('/api/user', UserRouter_1.default);
        this.app.use('/api/post', PostRouter_1.default);
        this.app.use('/api/comment', CommentRouter_1.default);
    }
    error404Handler() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: 'Not Found',
                status_code: 404
            });
        });
    }
    handleErrors() {
        this.app.use((error, req, res, next) => {
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                message: error.message || 'Something Went Wrong. Please Try Again',
                status_code: errorStatus
            });
        });
    }
}
exports.Server = Server;
