"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvirmentVariables = void 0;
const dev_env_1 = require("./dev.env");
const pro_env_1 = require("./pro.env");
function getEnvirmentVariables() {
    if (process.env.NODE_ENV === 'production') {
        return pro_env_1.ProdEnvironment;
    }
    else {
        return dev_env_1.DevEnvironment;
    }
}
exports.getEnvirmentVariables = getEnvirmentVariables;
