import { env } from "process";
import "./commands";
import { debugMode } from "./config";
import Cats from "./modules/Cats";
import Core from "./modules/Core";
import salty from "./salty";
import { debug, log } from "./utils";

log(`Running on ${env.MODE} environment`);

env.DEBUG = String(debugMode);
debug(`Debug is active`);

salty.registerModule(Core);
salty.registerModule(Cats);

// Initialize bot
salty.start(env.DISCORD_API!);
