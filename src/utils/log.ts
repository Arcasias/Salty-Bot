import { env } from "process";
import { Log, LogType } from "../typings";
import { formatDuration } from "./generic";

const CONSOLE_RED: string = "\x1b[31m";
const CONSOLE_GREEN: string = "\x1b[32m";
const CONSOLE_YELLOW: string = "\x1b[33m";
const CONSOLE_BLUE: string = "\x1b[34m";
const CONSOLE_MAGENTA: string = "\x1b[35m";
const CONSOLE_CYAN: string = "\x1b[36m";
const CONSOLE_RESET: string = "\x1b[0m"; // default

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
  color = CONSOLE_RESET,
  timestamp = true
): string {
  if (env.MODE !== "local") {
    return part;
  }
  const finalMessage = [];
  if (timestamp) {
    finalMessage.push(formatDuration());
  }
  finalMessage.push(color + part + CONSOLE_RESET);
  return finalMessage.join(" ");
}

//=============================================================================
// History
//=============================================================================

let history: Log[] = [];

function registerLog(type: LogType, ...args: string[]): void {
  const method =
    type === "error"
      ? console.error
      : type === "warn"
      ? console.warn
      : console.log;
  const argString: string = args.join(" ");
  method(argString);
  history.push({ type, message: argString });
  while (history.length > LOG_LIMIT) {
    history.shift();
  }
}

export function clearHistory(): void {
  history = [];
}

export function getHistory(): Log[] {
  return history;
}

//=============================================================================
// Log functions
//=============================================================================

/**
 * @param message
 */
export function debug(...message: any[]) {
  if (env.DEBUG !== "true") {
    return;
  }
  registerLog("debug", applyColor("DEBUG", CONSOLE_MAGENTA), ...message);
}

/**
 * @param message
 */
export function error(...message: any[]) {
  registerLog("error", applyColor("ERROR", CONSOLE_RED), ...message);
}

/**
 * @param message
 */
export function log(...message: any[]) {
  registerLog("log", applyColor("INFO", CONSOLE_CYAN), ...message);
}

/**
 * @param guild
 * @param user
 * @param msg
 */
export function logRequest(guild: string, user: string, msg: string) {
  const content = msg
    ? applyColor(`"${msg}"`, CONSOLE_GREEN, false)
    : applyColor("[EMPTY MESSAGE]", CONSOLE_RED, false);
  const message = `${applyColor(guild, CONSOLE_YELLOW, false)} > ${applyColor(
    user,
    CONSOLE_YELLOW,
    false
  )} : ${content}`;
  registerLog("logRequest", applyColor(message));
}

/**
 * @param message
 */
export function warn(...message: any[]) {
  registerLog("warn", applyColor("WARNING", CONSOLE_YELLOW), ...message);
}
