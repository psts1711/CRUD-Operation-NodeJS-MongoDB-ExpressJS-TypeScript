import express = require("express");
export declare class Server {
    app: express.Application;
    constructor();
    setConfigurations(): void;
    connectMongodb(): void;
    configureBodyParser(): void;
    setRoutes(): void;
    error404Handler(): void;
    handleErrors(): void;
}
