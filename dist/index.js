"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Salty_1 = __importDefault(require("./classes/Salty"));
require("./commands");
const config_1 = require("./config");
const utils_1 = require("./utils");
if (process.env.SERVER) {
    process.env.MODE = "server";
}
utils_1.log(`Running on ${process.env.MODE} environment`);
process.env.DEBUG = String(config_1.debugMode);
utils_1.debug(`Debug is active`);
Salty_1.default.start();
