//-----------------------------------------------------------------------------
// Utility functions
//-----------------------------------------------------------------------------
/**
 * Returns a random item from a given array.
 */
function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}
/**
 * Returns a "cleaned" version of the given string:
 * - stripped of characters deemed unnecessary
 * - trimmed of trailing white spaces
 * - lower cased
 */
function clean(string) {
    return string
        .replace(/[,."'`\-_]/g, "")
        .trim()
        .toLowerCase();
}
/**
 * Format a given duration. If none is given, duration is set to current time.
 * Returned string is formatted as "HH:mm:ss".
 */
function formatDuration(time = null) {
    const d = new Date(time);
    const formatted = [
        Math.max(d.getHours() - 1, 0),
        d.getMinutes(),
        d.getSeconds(),
    ];
    return formatted.map((x) => x.toString().padStart(2, "0")).join(":");
}
/**
 * Returns true if a randomly generated number is below a given percentage.
 */
function generate(percentage) {
    return Math.random() * 100 <= percentage;
}
/**
 * Returns true if the given array is sorted:
 * - alphabetically if an array of strings
 * - sequentially if an array of numbers
 */
function isSorted(array) {
    for (let i = 0; i < array.length; i++) {
        if (i < array.length && array[i + 1] < array[i]) {
            return false;
        }
    }
    return true;
}
/**
 * Returns the given word with its appropriate possessive form.
 */
function possessive(text) {
    return "s" === text[text.length - 1] ? `${text}'` : `${text}'s`;
}
/**
 * Returns the given callback based function as a promise based one.
 * The given function will take the following function as argument:
 *      <callback: Function>(error: Error, result: any)
 */
function promisify(fn) {
    return new Promise((resolve, reject) => {
        fn((error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
/**
 * Returns a random number between the given boundaries.
 * The given array must be as following: [minimum: number, maximum: number]
 */
function randRange(array) {
    if (array.length !== 2) {
        throw new Error("Invalid Array content");
    }
    return Math.floor(Math.random() * (array[1] - array[0]) + array[0]);
}
/**
 * Uuuugh I don't know.
 * @param {???} array
 */
function randStat(array) {
    if (!Array.isArray(array)) {
        return array;
    }
    let rand = Math.random() * 100;
    for (let i = 0; i < array.length; i++) {
        let chances = array[i].chance;
        for (let j = 0; j < i; j++) {
            chances += array[j].chance;
        }
        if (rand < chances) {
            return array[i].val;
        }
    }
}
/**
 * Returns a shuffled copy of the given array.
 * @param {any[]} array
 * @returns {any[]}
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randId = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[randId];
        array[randId] = temp;
    }
    return array;
}
/**
 * Returns a shuffled copy of the given array.
 * @param {any[]} array
 * @returns {any[]}
 */
function sortArray(array) {
    if (array.length < 2) {
        return array;
    }
    return array.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
}
/**
 * Returns the given string with the first letter capitalized.
 * @param {String} string
 * @returns {String}
 */
function title(string) {
    return string[0].toUpperCase() + string.slice(1);
}
//-----------------------------------------------------------------------------
// Log functions
//-----------------------------------------------------------------------------
const colors = {
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    // default
    RESET: "\x1b[0m",
};
function debug(...message) {
    if (process.env.DEBUG !== "true") {
        return;
    }
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + formatDuration()} ${colors.MAGENTA}DEBUG${colors.RESET}:`);
    }
    console.log(...message);
}
function error(...message) {
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + formatDuration()} ${colors.RED}ERROR${colors.RESET}:`);
    }
    console.error(...message);
}
function log(...message) {
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + formatDuration()} ${colors.CYAN}INFO${colors.RESET}:`);
    }
    console.log(...message);
}
function request(guild, user, msg) {
    const content = msg
        ? `${colors.GREEN}"${msg}"${colors.RESET}`
        : `${colors.RED}[EMPTY MESSAGE]${colors.RESET}`;
    const message = [
        `${colors.YELLOW + guild + colors.RESET} > ${colors.YELLOW + user + colors.RESET} : ${content}`,
    ];
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + formatDuration()}`);
    }
    console.log(...message);
}
function warn(...message) {
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + formatDuration()} ${colors.YELLOW}WARNING${colors.RESET}:`);
    }
    console.warn(...message);
}
export { choice, clean, formatDuration, generate, isSorted, possessive, promisify, randRange, randStat, shuffle, sortArray, title, debug, error, log, request, warn, };
