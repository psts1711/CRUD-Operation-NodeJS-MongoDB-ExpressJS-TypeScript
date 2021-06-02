"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
let server = new server_1.Server().app;
let PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
    console.log('Server is running on port number: ', PORT);
});
