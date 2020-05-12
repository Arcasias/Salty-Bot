"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}
exports.choice = choice;
function clean(string) {
    return string
        .replace(/[,."'`\-_]/g, "")
        .trim()
        .toLowerCase();
}
exports.clean = clean;
function formatDuration(time = null) {
    const d = time ? new Date(time) : new Date();
    const formatted = [
        Math.max(d.getHours() - 1, 0),
        d.getMinutes(),
        d.getSeconds(),
    ];
    return formatted.map((x) => x.toString().padStart(2, "0")).join(":");
}
exports.formatDuration = formatDuration;
function generate(percentage) {
    return Math.random() * 100 <= percentage;
}
exports.generate = generate;
function isSorted(array) {
    for (let i = 0; i < array.length; i++) {
        if (i < array.length && array[i + 1] < array[i]) {
            return false;
        }
    }
    return true;
}
exports.isSorted = isSorted;
function possessive(text) {
    return "s" === text[text.length - 1] ? `${text}'` : `${text}'s`;
}
exports.possessive = possessive;
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
exports.promisify = promisify;
function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const randId = Math.floor(Math.random() * (i + 1));
        const temp = copy[i];
        copy[i] = copy[randId];
        copy[randId] = temp;
    }
    return copy;
}
exports.shuffle = shuffle;
function title(string) {
    return string[0].toUpperCase() + string.slice(1);
}
exports.title = title;
const colors = {
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
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
exports.debug = debug;
function error(...message) {
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + formatDuration()} ${colors.RED}ERROR${colors.RESET}:`);
    }
    console.error(...message);
}
exports.error = error;
function log(...message) {
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + formatDuration()} ${colors.CYAN}INFO${colors.RESET}:`);
    }
    console.log(...message);
}
exports.log = log;
function request(guild, user, msg) {
    const content = msg
        ? `${colors.GREEN}"${msg}"${colors.RESET}`
        : `${colors.RED}[EMPTY MESSAGE]${colors.RESET}`;
    const message = [
        `${colors.YELLOW + guild + colors.RESET} > ${colors.YELLOW + user + colors.RESET}:${content}`,
    ];
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + formatDuration()}`);
    }
    console.log(...message);
}
exports.request = request;
function warn(...message) {
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + formatDuration()} ${colors.YELLOW}WARNING${colors.RESET}:`);
    }
    console.warn(...message);
}
exports.warn = warn;
