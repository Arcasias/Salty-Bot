"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const terms_1 = require("./terms");
const CONSOLE_RED = "\x1b[31m";
const CONSOLE_GREEN = "\x1b[32m";
const CONSOLE_YELLOW = "\x1b[33m";
const CONSOLE_BLUE = "\x1b[34m";
const CONSOLE_MAGENTA = "\x1b[35m";
const CONSOLE_CYAN = "\x1b[36m";
const CONSOLE_RESET = "\x1b[0m";
const LVD_REPLACE = 1.5;
const LVD_INSERT = 1;
const LVD_DELETE = 1;
const MEANING_ACTIONS = {
    add: terms_1.add,
    bot: terms_1.bot,
    clear: terms_1.clear,
    help: terms_1.help,
    list: terms_1.list,
    remove: terms_1.remove,
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
function choice(array) {
    return array[randInt(0, array.length)];
}
exports.choice = choice;
function clean(text) {
    return text.trim().toLowerCase();
}
exports.clean = clean;
function ellipsis(text, limit = 2000) {
    return text.length < limit ? text : `${text.slice(0, limit - 4)} ...`;
}
exports.ellipsis = ellipsis;
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
function getNumberReactions(length) {
    return NUMBER_REACTIONS.slice(0, length);
}
exports.getNumberReactions = getNumberReactions;
function isAdmin(user, guild) {
    return (isOwner(user) ||
        isDev(user) ||
        guild.member(user).hasPermission("ADMINISTRATOR"));
}
exports.isAdmin = isAdmin;
function isDev(user) {
    return isOwner(user) || config_1.devs.includes(user.id);
}
exports.isDev = isDev;
function isOwner(user) {
    return user.id === config_1.owner.id;
}
exports.isOwner = isOwner;
function isSorted(array) {
    for (let i = 0; i < array.length; i++) {
        if (i < array.length && array[i + 1] < array[i]) {
            return false;
        }
    }
    return true;
}
exports.isSorted = isSorted;
function levenshtein(a, b) {
    if (!a.length || !b.length) {
        return (b || a).length;
    }
    const matrix = [];
    for (let row = 0; row <= a.length; matrix[row] = [row++])
        ;
    for (let col = 0; col <= b.length; matrix[0][col] = col++)
        ;
    for (let row = 1; row <= a.length; row++) {
        for (let col = 1; col <= b.length; col++) {
            matrix[row][col] =
                a[row - 1] === b[col - 1]
                    ? matrix[row - 1][col - 1]
                    : Math.min(matrix[row - 1][col - 1] + LVD_REPLACE, matrix[row][col - 1] + LVD_INSERT, matrix[row - 1][col] + LVD_DELETE);
        }
    }
    return matrix[a.length][b.length];
}
exports.levenshtein = levenshtein;
function meaning(word) {
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
exports.meaning = meaning;
function pingable(id) {
    return `<@&${id}>`;
}
exports.pingable = pingable;
function possessive(text) {
    return "s" === text[text.length - 1] ? `${text}'` : `${text}'s`;
}
exports.possessive = possessive;
function randInt(min = 0, max = 1) {
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.randInt = randInt;
function round(num, digit = 3) {
    return Math.round(Number(num) * 10 ** digit) / 10 ** digit;
}
exports.round = round;
function search(array, target, threshold) {
    const closests = [];
    for (const str of array) {
        const lvd = levenshtein(target, str);
        if (!threshold || lvd <= threshold) {
            closests.push([str, lvd]);
        }
    }
    return closests.sort((a, b) => a[1] - b[1]).map((c) => c[0]);
}
exports.search = search;
function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const randId = randInt(0, i + 1);
        const temp = copy[i];
        copy[i] = copy[randId];
        copy[randId] = temp;
    }
    return copy;
}
exports.shuffle = shuffle;
function title(string) {
    if (!string.length) {
        return string;
    }
    return string[0].toUpperCase() + string.slice(1);
}
exports.title = title;
function debug(...message) {
    if (process.env.DEBUG !== "true") {
        return;
    }
    if (process.env.MODE === "local") {
        message.unshift(`${CONSOLE_RESET + formatDuration()} ${CONSOLE_MAGENTA}DEBUG${CONSOLE_RESET} :`);
    }
    console.log(...message);
}
exports.debug = debug;
function error(...message) {
    if (process.env.MODE === "local") {
        message.unshift(`${CONSOLE_RESET + formatDuration()} ${CONSOLE_RED}ERROR${CONSOLE_RESET} :`);
    }
    console.error(...message);
}
exports.error = error;
function log(...message) {
    if (process.env.MODE === "local") {
        message.unshift(`${CONSOLE_RESET + formatDuration()} ${CONSOLE_CYAN}INFO${CONSOLE_RESET} :`);
    }
    console.log(...message);
}
exports.log = log;
function request(guild, user, msg) {
    const content = msg
        ? `${CONSOLE_GREEN}"${msg}"${CONSOLE_RESET}`
        : `${CONSOLE_RED}[EMPTY MESSAGE]${CONSOLE_RESET}`;
    const message = [
        `${CONSOLE_YELLOW + guild + CONSOLE_RESET} > ${CONSOLE_YELLOW + user + CONSOLE_RESET} : ${content}`,
    ];
    if (process.env.MODE === "local") {
        message.unshift(`${CONSOLE_RESET + formatDuration()}`);
    }
    console.log(...message);
}
exports.request = request;
function warn(...message) {
    if (process.env.MODE === "local") {
        message.unshift(`${CONSOLE_RESET + formatDuration()} ${CONSOLE_YELLOW}WARNING${CONSOLE_RESET} :`);
    }
    console.warn(...message);
}
exports.warn = warn;
