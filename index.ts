import { mkdir, readdir, unlink } from "fs";
import { join } from "path";
import initLocalEnv from "./local";
import Salty from "./src/classes/Salty";
import { debug, error, log } from "./src/utils";

async function load(): Promise<void> {
    // Set ENV according to the presence of a SERVER env variable
    if (process.env.SERVER) {
        process.env.MODE = "server";
    } else {
        process.env.MODE = "local";
        initLocalEnv();
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
    Salty.init();
}

// Aaaaand here we go!
load();
