import { env } from "process";
import salty from "./salty";
import { debug } from "./utils/log";

debug(`Debug is active`);

// Initialize bot
salty.start(env.DISCORD_API!);
