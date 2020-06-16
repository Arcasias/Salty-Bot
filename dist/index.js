"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./commands");
const config_1 = require("./config");
const salty_1 = __importDefault(require("./salty"));
const utils_1 = require("./utils");
if (process.env.SERVER) {
    process.env.MODE = "server";
}
utils_1.log(`Running on ${process.env.MODE} environment`);
process.env.DEBUG = String(config_1.debugMode);
utils_1.debug(`Debug is active`);
salty_1.default.start();
