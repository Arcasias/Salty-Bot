"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const local_1 = require("./local");
const Salty_1 = __importDefault(require("./src/classes/Salty"));
const utils_1 = require("./src/utils");
if (process.env.SERVER) {
    process.env.MODE = "server";
}
else {
    process.env.MODE = "local";
    process.env.DISCORD_API = local_1.DISCORD_API;
    process.env.GOOGLE_API = local_1.GOOGLE_API;
    process.env.IMGUR_API = local_1.IMGUR_API;
    process.env.DATABASE_DATABASE = local_1.DATABASE_DATABASE;
    process.env.DATABASE_HOST = local_1.DATABASE_HOST;
    process.env.DATABASE_PASSWORD = local_1.DATABASE_PASSWORD;
    process.env.DATABASE_PORT = local_1.DATABASE_PORT;
    process.env.DATABASE_USER = local_1.DATABASE_USER;
    process.env.SERVER_PORT = local_1.SERVER_PORT;
}
utils_1.log(`Running on ${process.env.MODE} environment`);
process.env.DEBUG = String(Salty_1.default.config.debug);
if (process.env.DEBUG) {
    utils_1.debug(`Debug is active`);
}
fs_1.readdir(Salty_1.default.config.tempImageFolder, (readErr, files) => {
    if (readErr) {
        fs_1.mkdir(Salty_1.default.config.tempImageFolder, (mkdirErr) => {
            if (mkdirErr) {
                utils_1.error(mkdirErr);
            }
        });
        return;
    }
    files.forEach((file) => {
        fs_1.unlink(path_1.join(Salty_1.default.config.tempImageFolder, file), (unlinkErr) => {
            if (unlinkErr) {
                utils_1.error(unlinkErr);
            }
        });
    });
});
Salty_1.default.start();
