import { mkdir, readdir, unlink } from "fs";
import { join } from "path";
import {
    DISCORD_API,
    GOOGLE_API,
    IMGUR_API,
    DATABASE_DATABASE,
    DATABASE_HOST,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    DATABASE_USER,
    SERVER_PORT,
} from "./local";
import Salty from "./src/classes/Salty";
import { debug, error, log } from "./src/utils";

// Set ENV according to the presence of a SERVER env variable
if (process.env.SERVER) {
    process.env.MODE = "server";
} else {
    process.env.MODE = "local";
    process.env.DISCORD_API = DISCORD_API;
    process.env.GOOGLE_API = GOOGLE_API;
    process.env.IMGUR_API = IMGUR_API;
    process.env.DATABASE_DATABASE = DATABASE_DATABASE;
    process.env.DATABASE_HOST = DATABASE_HOST;
    process.env.DATABASE_PASSWORD = DATABASE_PASSWORD;
    process.env.DATABASE_PORT = DATABASE_PORT;
    process.env.DATABASE_USER = DATABASE_USER;
    process.env.SERVER_PORT = SERVER_PORT;
}
log(`Running on ${process.env.MODE} environment`);

process.env.DEBUG = String(Salty.config.debug);
if (process.env.DEBUG) {
    debug(`Debug is active`);
}

// Empty temp images folder
readdir(Salty.config.tempImageFolder, (readErr, files) => {
    if (readErr) {
        mkdir(Salty.config.tempImageFolder, (mkdirErr) => {
            if (mkdirErr) {
                error(mkdirErr);
            }
        });
        return;
    }
    files.forEach((file) => {
        unlink(join(Salty.config.tempImageFolder, file), (unlinkErr) => {
            if (unlinkErr) {
                error(unlinkErr);
            }
        });
    });
});

// Initialize bot
Salty.start();
