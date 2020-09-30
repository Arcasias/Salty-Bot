import "./commands";
import { debugMode } from "./config";
import salty from "./salty";
import { debug, log } from "./utils";

// Set ENV according to the presence of a SERVER env variable
if (process.env.SERVER) {
    process.env.MODE = "server";
}
log(`Running on ${process.env.MODE} environment`);

process.env.DEBUG = String(debugMode);
debug(`Debug is active`);

// Initialize bot
salty.start(process.env.DISCORD_API!);
