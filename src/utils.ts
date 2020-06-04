import { Guild, User } from "discord.js";
import { devs, owner } from "./config";
import { add, bot, clear, help, list, remove } from "./terms";
import { Dictionnary } from "./types";

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
const MEANING_ACTIONS: Dictionnary<string[]> = {
    add,
    bot,
    clear,
    help,
    list,
    remove,
};
const NUMBER_REACTIONS = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
];

//-----------------------------------------------------------------------------
// Utility functions
//-----------------------------------------------------------------------------

/**
 * Returns a random item from a given array.
 * @param array
 */
export function choice<T>(array: T[]): T {
    return array[randInt(0, array.length)];
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

export function ellipsis(text: string, limit: number = 2000): string {
    return text.length < limit ? text : `${text.slice(0, limit - 4)} ...`;
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
 * Returns true if a randomly generated number is below a given percentage.
 * @param percentage
 */
export function generate(percentage: number): boolean {
    return Math.random() * 100 <= percentage;
}

/**
 * Gets the queried amount of number emojis.
 * @param length
 */
export function getNumberReactions(length?: number) {
    return NUMBER_REACTIONS.slice(0, length);
}

/**
 * Returns true if the given user has admin level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
export function isAdmin(user: User, guild: Guild): boolean {
    return (
        isOwner(user) ||
        isDev(user) ||
        guild.member(user)!.hasPermission("ADMINISTRATOR")
    );
}

/**
 * Returns true if the given user has developer level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
export function isDev(user: User): boolean {
    return isOwner(user) || devs.includes(user.id);
}

/**
 * Returns true if the given user has owner level privileges.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
export function isOwner(user: User): boolean {
    return user.id === owner.id;
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
export function meaning(word?: string): string | null {
    if (!word) {
        return null;
    }
    for (const key in MEANING_ACTIONS) {
        if (MEANING_ACTIONS[key].includes(word)) {
            return key;
        }
    }
    return "string";
}

export function pingable(id: string): string {
    return `<@&${id}>`;
}

/**
 * Returns the given word with its appropriate possessive form.
 * @param text
 */
export function possessive(text: string): string {
    return "s" === text[text.length - 1] ? `${text}'` : `${text}'s`;
}

/**
 * Returns a random integer between the two given boundaries.
 * @param min
 * @param max
 */
export function randInt(min: number = 0, max: number = 1): number {
    return Math.floor(Math.random() * (max - min)) + min;
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
    for (let i = copy.length - 1; i > 0; i--) {
        const randId = randInt(0, i + 1);
        const temp = copy[i];
        copy[i] = copy[randId];
        copy[randId] = temp;
    }
    return copy;
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

//-----------------------------------------------------------------------------
// Log functions
//-----------------------------------------------------------------------------

/**
 * @param message
 */
export function debug(...message: any[]) {
    if (process.env.DEBUG !== "true") {
        return;
    }
    if (process.env.MODE === "local") {
        message.unshift(
            `${
                CONSOLE_RESET + formatDuration()
            } ${CONSOLE_MAGENTA}DEBUG${CONSOLE_RESET} :`
        );
    }
    console.log(...message);
}

/**
 * @param message
 */
export function error(...message: any[]) {
    if (process.env.MODE === "local") {
        message.unshift(
            `${
                CONSOLE_RESET + formatDuration()
            } ${CONSOLE_RED}ERROR${CONSOLE_RESET} :`
        );
    }
    console.error(...message);
}

/**
 * @param message
 */
export function log(...message: any[]) {
    if (process.env.MODE === "local") {
        message.unshift(
            `${
                CONSOLE_RESET + formatDuration()
            } ${CONSOLE_CYAN}INFO${CONSOLE_RESET} :`
        );
    }
    console.log(...message);
}

/**
 * @param guild
 * @param user
 * @param msg
 */
export function request(guild: string, user: string, msg: string) {
    const content = msg
        ? `${CONSOLE_GREEN}"${msg}"${CONSOLE_RESET}`
        : `${CONSOLE_RED}[EMPTY MESSAGE]${CONSOLE_RESET}`;
    const message = [
        `${CONSOLE_YELLOW + guild + CONSOLE_RESET} > ${
            CONSOLE_YELLOW + user + CONSOLE_RESET
        } : ${content}`,
    ];
    if (process.env.MODE === "local") {
        message.unshift(`${CONSOLE_RESET + formatDuration()}`);
    }
    console.log(...message);
}

/**
 * @param message
 */
export function warn(...message: any[]) {
    if (process.env.MODE === "local") {
        message.unshift(
            `${
                CONSOLE_RESET + formatDuration()
            } ${CONSOLE_YELLOW}WARNING${CONSOLE_RESET} :`
        );
    }
    console.warn(...message);
}
