import { mkdir, readdir, unlink } from "fs";
import { join } from "path";
import Salty from "./classes/Salty";
import { debug, error, log } from "./utils";
import { debugMode, tempImageFolder } from "./config";

// Set ENV according to the presence of a SERVER env variable
if (process.env.SERVER) {
    process.env.MODE = "server";
}
log(`Running on ${process.env.MODE} environment`);

process.env.DEBUG = String(debugMode);
if (process.env.DEBUG) {
    debug(`Debug is active`);
}

// Empty temp images folder
readdir(tempImageFolder, (readErr, files) => {
    if (readErr) {
        mkdir(tempImageFolder, (mkdirErr) => {
            if (mkdirErr) {
                error(mkdirErr);
            }
        });
        return;
    }
    files.forEach((file) => {
        unlink(join(tempImageFolder, file), (unlinkErr) => {
            if (unlinkErr) {
                error(unlinkErr);
            }
        });
    });
});

// Initialize bot
Salty.start();
