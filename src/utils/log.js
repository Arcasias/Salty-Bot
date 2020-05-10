"use strict";

const { formatDuration: getTimeStamp } = UTIL;
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
        message.unshift(
            `${colors.RESET + getTimeStamp()} ${colors.MAGENTA}DEBUG${
                colors.RESET
            }:`
        );
    }
    console.log(...message);
}

function error(...message) {
    if (process.env.MODE === "local") {
        message.unshift(
            `${colors.RESET + getTimeStamp()} ${colors.RED}ERROR${
                colors.RESET
            }:`
        );
    }
    console.error(...message);
}

function log(...message) {
    if (process.env.MODE === "local") {
        message.unshift(
            `${colors.RESET + getTimeStamp()} ${colors.CYAN}INFO${
                colors.RESET
            }:`
        );
    }
    console.log(...message);
}

function request(guild, user, msg) {
    const content = msg
        ? `${colors.GREEN}"${msg}"${colors.RESET}`
        : `${colors.RED}[EMPTY MESSAGE]${colors.RESET}`;
    const message = [
        `${colors.YELLOW + guild + colors.RESET} > ${
            colors.YELLOW + user + colors.RESET
        } : ${content}`,
    ];
    if (process.env.MODE === "local") {
        message.unshift(`${colors.RESET + getTimeStamp()}`);
    }
    console.log(...message);
}

function warn(...message) {
    if (process.env.MODE === "local") {
        message.unshift(
            `${colors.RESET + getTimeStamp()} ${colors.YELLOW}WARNING${
                colors.RESET
            }:`
        );
    }
    console.warn(...message);
}

module.exports = { debug, error, log, request, warn };
