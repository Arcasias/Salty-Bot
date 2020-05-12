//-----------------------------------------------------------------------------
// Utility functions
//-----------------------------------------------------------------------------

/**
 * Returns a random item from a given array.
 */
function choice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a "cleaned" version of the given string:
 * - stripped of characters deemed unnecessary
 * - trimmed of trailing white spaces
 * - lower cased
 */
function clean(string: string): string {
    return string
        .replace(/[,."'`\-_]/g, "")
        .trim()
        .toLowerCase();
}

/**
 * Format a given duration. If none is given, duration is set to current time.
 * Returned string is formatted as "HH:mm:ss".
 */
function formatDuration(time: number = null): string {
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
 */
function generate(percentage: number): boolean {
    return Math.random() * 100 <= percentage;
}

/**
 * Returns true if the given array is sorted:
 * - alphabetically if an array of strings
 * - sequentially if an array of numbers
 */
function isSorted(array: string[] | number[]): boolean {
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
function possessive(text: string): string {
    return "s" === text[text.length - 1] ? `${text}'` : `${text}'s`;
}

/**
 * Returns the given callback based function as a promise based one.
 * The given function will take the following function as argument:
 *      <callback: Function>(error: Error, result: any)
 */
function promisify(
    fn: (callback: (error: any, result: any) => void) => void
): Promise<any> {
    return new Promise((resolve, reject) => {
        fn((error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * Returns a shuffled copy of the given array.
 * @param {any[]} array
 * @returns {any[]}
 */
function shuffle<T>(array: T[]): T[] {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const randId = Math.floor(Math.random() * (i + 1));
        const temp = copy[i];
        copy[i] = copy[randId];
        copy[randId] = temp;
    }
    return copy;
}

/**
 * Returns the given string with the first letter capitalized.
 */
function title(string: string) {
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

function debug(...message: any[]) {
    if (process.env.DEBUG !== "true") {
        return;
    }
    if (process.env.MODE === "local") {
        message.unshift(
            `${colors.RESET + formatDuration()} ${colors.MAGENTA}DEBUG${
                colors.RESET
            }:`
        );
    }
    console.log(...message);
}

function error(...message: any[]) {
    if (process.env.MODE === "local") {
        message.unshift(
            `${colors.RESET + formatDuration()} ${colors.RED}ERROR${
                colors.RESET
            }:`
        );
    }
    console.error(...message);
}

function log(...message: any[]) {
    if (process.env.MODE === "local") {
        message.unshift(
            `${colors.RESET + formatDuration()} ${colors.CYAN}INFO${
                colors.RESET
            }:`
        );
    }
    console.log(...message);
}

function request(guild: string, user: string, msg: string) {
    const content = msg
        ? `${colors.GREEN}"${msg}"${colors.RESET}`
        : `${colors.RED}[EMPTY MESSAGE]${colors.RESET}`;
    const message = [
        `${colors.YELLOW + guild + colors.RESET} > ${
            colors.YELLOW + user + colors.RESET
        }:${content}`,
    ];
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + formatDuration()}`);
    }
    console.log(...message);
}

function warn(...message: any[]) {
    if (process.env.MODE === "local") {
        message.unshift(
            `${colors.RESET + formatDuration()} ${colors.YELLOW}WARNING${
                colors.RESET
            }:`
        );
    }
    console.warn(...message);
}

export {
    // Utilities
    choice,
    clean,
    formatDuration,
    generate,
    isSorted,
    possessive,
    promisify,
    shuffle,
    title,
    // Log
    debug,
    error,
    log,
    request,
    warn,
};
