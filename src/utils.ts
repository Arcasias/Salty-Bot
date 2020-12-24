import { Guild, Message, User } from "discord.js";
import { env } from "process";
import { config } from "./classes/Database";
import { keywords } from "./strings";
import {
  Dictionnary,
  ExpressionDescriptor,
  MeaningKeys,
  Meanings,
} from "./typings";

const CONSOLE_RED = "\x1b[31m";
const CONSOLE_GREEN = "\x1b[32m";
const CONSOLE_YELLOW = "\x1b[33m";
const CONSOLE_BLUE = "\x1b[34m";
const CONSOLE_MAGENTA = "\x1b[35m";
const CONSOLE_CYAN = "\x1b[36m";
const CONSOLE_RESET = "\x1b[0m"; // default
// Weights used in the Levenshtein matrix
const LVD_REPLACE = 1.5;
const LVD_INSERT = 1;
const LVD_DELETE = 1;
const REACTIONS: Dictionnary<string[]> = {
  0: ["0️⃣"],
  1: ["1️⃣"],
  2: ["2️⃣"],
  3: ["3️⃣"],
  4: ["4️⃣"],
  5: ["5️⃣"],
  6: ["6️⃣"],
  7: ["7️⃣"],
  8: ["8️⃣"],
  9: ["9️⃣"],
  10: ["🔟"],
  a: ["🇦", "🅰️"],
  b: ["🇧", "🅱️"],
  c: ["🇨"],
  d: ["🇩"],
  e: ["🇪"],
  f: ["🇫"],
  g: ["🇬"],
  h: ["🇭"],
  i: ["🇮", "ℹ️"],
  j: ["🇯"],
  k: ["🇰"],
  l: ["🇱"],
  m: ["🇲", "Ⓜ️"],
  n: ["🇳"],
  o: ["🇴", "🅾️", "⭕"],
  p: ["🇵"],
  q: ["🇶"],
  r: ["🇷"],
  s: ["🇸"],
  t: ["🇹"],
  u: ["🇺"],
  v: ["🇻"],
  w: ["🇼"],
  x: ["🇽", "❌"],
  y: ["🇾"],
  z: ["🇿"],
};
const PARSABLE = /true|false|null/i;

const expressions: ExpressionDescriptor[] = [
  {
    expr: /authors?/,
    replacer: (match, ctx) => {
      const { displayName } = ctx.member;
      return match.endsWith("s") ? possessive(displayName) : displayName;
    },
  },
  {
    expr: /mentions?/,
    replacer: (match, ctx) => {
      const { displayName } = ctx.mentions.members.first();
      return match.endsWith("s") ? possessive(displayName) : displayName;
    },
  },
  {
    expr: /targets?/,
    replacer: (match, ctx) => {
      const { displayName } = ctx.mentions.members.first() || ctx.member;
      return match.endsWith("s") ? possessive(displayName) : displayName;
    },
  },
];

//=============================================================================
// Utility classes
//=============================================================================

export class ResolvablePromise<T> extends Promise<T> {
  public resolve(): void {}
}

//=============================================================================
// Utility functions
//=============================================================================

/**
 * Meant to be wrapped around potentially failing API calls, for example:
 * - calling a method on a deleted Discord message
 * - performing an action without the appropriate permissions
 * @param action
 */
export async function apiCatch<T>(
  action: (...args: any[]) => Promise<T>
): Promise<T | false> {
  try {
    return await action();
  } catch (err) {
    return false;
  }
}

/**
 * Returns a random item from a given array.
 * @param array
 */
export function choice<T>(array: T[]): T {
  return array[randInt(0, array.length - 1)];
}

/**
 * Returns a "cleaned" version of the given string:
 * - trimmed of trailing white spaces
 * - lower cased
 * @param text
 */
export function clean(text: string): string {
  return text.trim().toLowerCase();
}

/**
 * @param text
 * @param limit
 */
export function ellipsis(text: string, limit: number = 2000): string {
  return text.length < limit ? text : `${text.slice(0, limit - 4)} ...`;
}

/**
 * @param regex
 */
export function escapeRegex(regex: string): string {
  return regex.replace(/[\.\*\+\?\^\$\{\}\(\)\|\[\]\\]/g, "\\$&");
}

/**
 * @param raw
 * @param context
 */
export function format(raw: string, context: any): string {
  return raw.replace(/<\w+>/g, (match) => {
    const matchExpr = match.slice(1, -1);
    const { replacer } =
      expressions.find(({ expr }) => expr.test(matchExpr)) || {};
    if (replacer) {
      return replacer(matchExpr, context);
    }
    return match;
  });
}

/**
 * Format a given duration. If none is given, duration is set to current time.
 * Returned string is formatted as "HH:mm:ss".
 * @param time
 */
export function formatDuration(time: number | null = null): string {
  const d: Date = time ? new Date(time) : new Date();
  const formatted: number[] = [
    Math.max(d.getHours() - 1, 0),
    d.getMinutes(),
    d.getSeconds(),
  ];
  return formatted.map((x) => x.toString().padStart(2, "0")).join(":");
}

/**
 * Gets the queried amount of number emojis.
 * @param length
 */
export function getNumberReactions(length: number) {
  return Object.values(REACTIONS)
    .slice(1, length + 1)
    .map(([react]) => react);
}

/**
 * @param array
 * @param prop
 */
export function groupBy<T>(array: T[], prop: string): Dictionnary<T[]> {
  const groups: Dictionnary<T[]> = {};
  for (const el of array) {
    const val: any = el[prop as keyof T];
    if (!(val in groups)) {
      groups[val] = [];
    }
    groups[val].push(el);
  }
  return groups;
}

/**
 * Returns true if the given user has admin level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
export function isAdmin(user: User, guild: Guild | null): boolean {
  return (
    !guild ||
    isDev(user) ||
    guild.members.cache.get(user.id)!.hasPermission("ADMINISTRATOR")
  );
}

/**
 * Returns true if the given user has developer level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
export function isDev(user: User): boolean {
  return isOwner(user) || config.devIds.includes(user.id);
}

/**
 * Returns true if the given user has owner level privileges.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
export function isOwner(user: User): boolean {
  return user.id === config.ownerId;
}

/**
 * Returns true if the given array is sorted:
 * - alphabetically if an array of strings
 * - sequentially if an array of numbers
 * @param array
 */
export function isSorted(array: string[] | number[]): boolean {
  for (let i = 0; i < array.length; i++) {
    if (i < array.length && array[i + 1] < array[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Returns the edit distance between 2 given strings
 * @param a
 * @param b
 */
export function levenshtein(a: string, b: string): number {
  // One of the strings is empty => requires otherstring.length mutations
  if (!a.length || !b.length) {
    return (b || a).length;
  }
  const matrix: number[][] = [];
  // Assign first row and column
  for (let row = 0; row <= a.length; matrix[row] = [row++]);
  for (let col = 0; col <= b.length; matrix[0][col] = col++);
  // Fills the rest of the matrix
  for (let row = 1; row <= a.length; row++) {
    for (let col = 1; col <= b.length; col++) {
      matrix[row][col] =
        a[row - 1] === b[col - 1]
          ? matrix[row - 1][col - 1]
          : Math.min(
              matrix[row - 1][col - 1] + LVD_REPLACE,
              matrix[row][col - 1] + LVD_INSERT,
              matrix[row - 1][col] + LVD_DELETE
            );
    }
  }
  // Minimal distance is the last element
  return matrix[a.length][b.length];
}

/**
 * Returns the general meaning of a given word.
 * @param word
 */
export function meaning(word?: string): MeaningKeys | null {
  if (!word) {
    return null;
  }
  const cleanedWord = clean(word);
  for (const key in keywords) {
    if (keywords[key as keyof Meanings].includes(cleanedWord)) {
      return key as MeaningKeys;
    }
  }
  return "string";
}

/**
 * Returns true if a randomly generated number is below a given percentage.
 * @param percentage
 */
export function percent(percentage: number): boolean {
  return randFloat(0, 100) <= percentage;
}

/**
 * Returns the given word with its appropriate possessive form.
 * @param text
 */
export function possessive(text: string): string {
  return "s" === text[text.length - 1] ? `${text}'` : `${text}'s`;
}

/**
 * Generates a random high saturated color.
 */
export function randColor(): string {
  const primary = randInt(0, 2);
  const color = [];
  for (let i = 0; i < 3; color[i] = i === primary ? 255 : randInt(0, 255), i++);
  return "#" + color.map((c) => c.toString(16).padStart(2, "0")).join("");
}

/**
 * Returns a random float between the two given boundaries (max NOT included).
 * @param min
 * @param max
 */
export function randFloat(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between the two given boundaries (max included).
 * @param min
 * @param max
 */
export function randInt(min: number = 0, max: number = 1): number {
  return Math.floor(randFloat(min, max + 1));
}

/**
 * @param msg
 * @param args
 */
export function removeMentions(msg: Message, args: string[]): string[] {
  let content = args.join(" ");
  if (msg.mentions.members) {
    for (const [id, { displayName }] of msg.mentions.members) {
      content = content.replace(new RegExp(`@.?${displayName}`), "");
    }
  } else {
    for (const [id, { username }] of msg.mentions.users) {
      content = content.replace(new RegExp(`@.?${username}`), "");
    }
  }
  return content.split(/\s+/).filter(Boolean);
}

/**
 * Searches an array of string for a given target. Returns a list of the closest
 * results having an edit distance above given threshold, sorted by accuracy.
 * @param array
 * @param target
 * @param threshold
 */
export function search(array: string[], target: string, threshold?: number) {
  const closests: Array<[string, number]> = [];
  for (const str of array) {
    const lvd = levenshtein(target, str);
    if (!threshold || lvd <= threshold) {
      closests.push([str, lvd]);
    }
  }
  return closests.sort((a, b) => a[1] - b[1]).map((c) => c[0]);
}

/**
 * Returns a shuffled copy of the given array.
 * @param array
 */
export function shuffle<T>(array: T[]): T[] {
  const copy = array.slice();
  for (let i = copy.length - 1; i >= 0; i--) {
    const randId = randInt(0, i);
    const temp = copy[i];
    copy[i] = copy[randId];
    copy[randId] = temp;
  }
  return copy;
}

/**
 * Returns the given array sorted by the given prop if any.
 * @param array
 * @param prop
 */
export function sort<T>(
  array: T[],
  prop: string | null = null,
  asc: boolean = true
) {
  const sorted = array.sort((objA, objB) => {
    let a = objA as any;
    let b = objB as any;
    if (prop && a.hasOwnProperty(prop) && b.hasOwnProperty(prop)) {
      a = a[prop]!;
      b = b[prop]!;
    }
    return a > b ? 1 : a < b ? -1 : 0;
  });
  return asc ? sorted : sorted.reverse();
}

/**
 * @param str
 */
export function stringToReaction(str: string): string[] {
  const counters: Dictionnary<number> = {};
  const result: string[] = [];

  for (const key of str) {
    const index = counters[key] || 0;
    if (index < REACTIONS[key]?.length) {
      result.push(REACTIONS[key][index]);
      counters[key] = index + 1;
    }
  }

  return result;
}

/**
 * Returns the given string with the first letter capitalized.
 * @param string
 */
export function title(string: string) {
  if (!string.length) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
}

/**
 * Does the inverse job of `String(...)`.
 * @param value
 */
export function toAny(value: any): any {
  if (typeof value !== "string") {
    return value;
  }
  if (value === "undefined") {
    return undefined;
  }
  if (PARSABLE.test(value)) {
    return JSON.parse(value.toLowerCase());
  }
  const num = Number(value);
  if (!isNaN(num)) {
    return num;
  }
  return value;
}

//=============================================================================
// Log functions
//=============================================================================

/**
 * @param part
 * @param color
 * @param timestamp
 */
function consoleColor(part: string, color = CONSOLE_RESET, timestamp = true) {
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

/**
 * @param message
 */
export function debug(...message: any[]) {
  if (env.DEBUG !== "true") {
    return;
  }
  console.log(consoleColor("DEBUG", CONSOLE_MAGENTA), ...message);
}

/**
 * @param message
 */
export function error(...message: any[]) {
  console.error(consoleColor("ERROR", CONSOLE_RED), ...message);
}

/**
 * @param message
 */
export function log(...message: any[]) {
  console.log(consoleColor("INFO", CONSOLE_CYAN), ...message);
}

/**
 * @param guild
 * @param user
 * @param msg
 */
export function logRequest(guild: string, user: string, msg: string) {
  const content = msg
    ? consoleColor(`"${msg}"`, CONSOLE_GREEN, false)
    : consoleColor("[EMPTY MESSAGE]", CONSOLE_RED, false);
  const message = `${consoleColor(
    guild,
    CONSOLE_YELLOW,
    false
  )} > ${consoleColor(user, CONSOLE_YELLOW, false)} : ${content}`;
  console.log(consoleColor(message));
}

/**
 * @param message
 */
export function warn(...message: any[]) {
  console.warn(consoleColor("WARNING", CONSOLE_YELLOW), ...message);
}
