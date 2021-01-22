import { Collection, Guild, Message, User } from "discord.js";
import { config } from "../database/config";
import { keywords } from "../strings";
import {
  Dictionnary,
  MeaningKeys,
  Meanings,
  MessageAction,
  RoleBox,
} from "../typings";

// Weights used in the Levenshtein matrix
const LVD_REPLACE: number = 1.5;
const LVD_INSERT: number = 1;
const LVD_DELETE: number = 1;
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
const SNOWFLAKE_REGEX = /^\d{18}$/;

//=============================================================================
// Generic functions
//=============================================================================

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
 * @param object
 * @param param
 */
export function ensureContent(object: any, param?: string): void {
  if (isEmpty(object)) {
    throw new Error(`Param ${param ? ` "${param}"` : ""}is empty`);
  }
}

/**
 * @param regex
 */
export function escapeRegex(regex: string): string {
  return regex.replace(/[\.\*\+\?\^\$\{\}\(\)\|\[\]\\]/g, "\\$&");
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
export function getNumberReactions(length: number): string[] {
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
 * Returns whether or not the given object is considered empty:
 * - for an object: no owned key-values
 * - for an array: no items
 * - for anything else: falsy
 * @param object
 */
export function isEmpty(object: any): boolean {
  if (Array.isArray(object)) {
    return !object.length;
  } else if (typeof object === "object" && object !== null) {
    return !Object.keys(object).length;
  } else {
    return !object;
  }
}

/**
 * Returns true if the given user has owner level privileges.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
export function isOwner(user: User): boolean {
  return user.id === config.ownerId;
}

/**
 * Returns true if the given argument is a snowflake.
 * @param string
 */
export function isSnowflake(string: any) {
  return SNOWFLAKE_REGEX.test(String(string));
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
 * Returns the edit distance between 2 given strings.
 * @param a
 * @param b
 */
export function levenshtein(a: string, b: string): number {
  // One of the strings is empty => requires otherstring.length mutations
  if (!a.length || !b.length) {
    return (b || a).length;
  }
  if (a === b) {
    return 0;
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

export function parseJSON(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch (error) {
    return false;
  }
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
): T[] {
  const sorted = array.sort((a: any, b: any) => {
    if (prop && a.hasOwnProperty(prop) && b.hasOwnProperty(prop)) {
      a = a[prop];
      b = b[prop];
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

//=============================================================================
// RoleBox functions
//=============================================================================

/**
 * @param roleBox
 * @param guild
 */
export function getRoleBoxActions(
  { emojiRoles }: RoleBox,
  guild: Guild
): Collection<string, MessageAction> {
  const actions = new Collection<string, MessageAction>();
  for (const [emoji, roleId] of emojiRoles) {
    actions.set(emoji, {
      async onAdd(user) {
        const member = guild.members.cache.get(user.id)!;
        member.roles.add(roleId).catch();
      },
      async onRemove(user) {
        const member = guild.members.cache.get(user.id)!;
        member.roles.remove(roleId).catch();
      },
    });
  }
  return actions;
}

/**
 * @param roleBox
 */
export function parseRoleBox(roleBox: string): RoleBox {
  const [channelId, messageId, ...emojiRoles] = JSON.parse(roleBox);
  return { channelId, messageId, emojiRoles };
}

/**
 * @param roleBox
 */
export function serializeRoleBox({
  channelId,
  messageId,
  emojiRoles,
}: RoleBox): string {
  return JSON.stringify([channelId, messageId, ...emojiRoles]);
}
