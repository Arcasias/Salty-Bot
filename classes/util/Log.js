'use strict';

const Singleton = require('../Singleton');

const colors = {
    BLACK: "\x1b[30m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",

    // default
    RESET: "\x1b[0m",
};

class Log extends Singleton {

    // PUBLIC
    debug(...log) {
        if (process.env.DEBUG !== 'true') {
            return;
        }
        if (process.env.MODE === 'local') {
            log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.MAGENTA}DEBUG${colors.RESET}:`);
        }
        console.log(...log);
    }

    error(...log) {
        if (process.env.MODE === 'local') {
            log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.RED}ERROR${colors.RESET}:`);
        }
        console.error(...log);
    }

    info(...log) {
        if (process.env.MODE === 'local') {
            log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.CYAN}INFO${colors.RESET}:`);
        }
        console.info(...log);
    }

    log(...log) {
        if (process.env.MODE === 'local') {
            log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.CYAN}LOG${colors.RESET}:`);
        }
        console.log(...log);
    }

    success(...log) {
        if (process.env.MODE === 'local') {
            log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.GREEN}SUCCESS${colors.RESET}:`);
        }
        console.log(...log);
    }

    warn(...log) {
        if (process.env.MODE === 'local') {
            log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.YELLOW}WARNING${colors.RESET}:`);
        }
        console.warn(...log);
    }
}

module.exports = new Log();
