import { Guild, User } from "discord.js";
import { env } from "process";
import { Dictionnary, MessageActor } from "../typings";
import { formatDuration } from "./generic";

const RED: string = "\x1b[31m";
const GREEN: string = "\x1b[32m";
const YELLOW: string = "\x1b[33m";
const BLUE: string = "\x1b[34m";
const MAGENTA: string = "\x1b[35m";
const CYAN: string = "\x1b[36m";
const RESET: string = "\x1b[0m"; // default

const LOG_LIMIT: number = 100;

//=============================================================================
// Helpers
//=============================================================================

/**
 * @param part
 * @param color
 * @param timestamp
 */
function applyColor(
  part: string,
  color: string = RESET,
  timestamp: boolean = true
): string {
  if (env.MODE !== "local") {
    return part;
  }
  let message = color + part + RESET;
  if (timestamp) {
    message = `${formatDuration()} ${message}`;
  }
  return message;
}

//=============================================================================
// History
//=============================================================================

const guildHistory: Dictionnary<string[]> = {};

/**
 * @param guildOrUser
 */
export function clearHistory(guildOrUser?: Guild | User): void {
  if (guildOrUser) {
    delete guildHistory[guildOrUser.id];
  } else {
    for (const gId in guildHistory) {
      delete guildHistory[gId];
    }
  }
}

/**
 * @param guildOrUser
 */
export function getHistory({ id }: Guild | User): string[] {
  return guildHistory[id] || [];
}

//=============================================================================
// Log functions
//=============================================================================

/**
 * @param message
 */
export function debug(...message: any[]) {
  if (!JSON.parse(env.DEBUG || "0")) return;

  console.debug(applyColor("DEBUG", MAGENTA), ...message);
}

/**
 * @param message
 */
export function error(...message: any[]) {
  console.error(applyColor("ERROR", RED), ...message);
}

/**
 * @param message
 */
export function log(...message: any[]) {
  console.log(applyColor("INFO", CYAN), ...message);
}

/**
 * @param guild
 * @param source
 * @param msg
 */
export function logRequest(
  guild: Guild | null,
  source: MessageActor,
  msg: string
) {
  const gName = guild?.name || "DM";
  const gId = guild?.id || source.user.id;
  const content = msg
    ? applyColor(`"${msg}"`, GREEN, false)
    : applyColor("[EMPTY MESSAGE]", RED, false);
  const message = `${applyColor(gName, YELLOW, false)} > ${applyColor(
    source.user.username,
    YELLOW,
    false
  )} : ${content}`;
  console.log(applyColor(message));

  // Push log into history
  if (!(gId in guildHistory)) {
    guildHistory[gId] = [];
  }
  guildHistory[gId].push(`${source.name}: ${msg || "[EMPTY MESSAGE]"}`);

  // Remove excess logs
  while (guildHistory[gId].length > LOG_LIMIT) {
    guildHistory[gId].shift();
  }
}

/**
 * @param message
 */
export function warn(...message: any[]) {
  console.warn(applyColor("WARNING", YELLOW), ...message);
}
