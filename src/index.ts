import Salty from "./classes/Salty";
import { debug, log } from "./utils";
import { debugMode } from "./config";

// Set ENV according to the presence of a SERVER env variable
if (process.env.SERVER) {
    process.env.MODE = "server";
}
log(`Running on ${process.env.MODE} environment`);

process.env.DEBUG = String(debugMode);
if (process.env.DEBUG) {
    debug(`Debug is active`);
}

// Initialize bot
Salty.start();
