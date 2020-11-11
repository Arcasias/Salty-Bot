import { env } from "process";
import "./commands";
import { debugMode } from "./config";
import "./modules";
import salty from "./salty";
import { debug, log } from "./utils";

log(`Running on ${env.MODE} environment`);

env.DEBUG = String(debugMode);
debug(`Debug is active`);

// Initialize bot
salty.start(env.DISCORD_API!);
