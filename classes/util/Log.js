'use strict';

const Singleton = require('../Singleton');

const consoleColors = {
    BLACK: "\x1b[30m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",

    RESET: "\x1b[0m",
};

class Log extends Singleton {

    // PUBLIC
    debug(...log) {
        if (process.env.DEBUG !== 'true') return;
        this._log({
            type: 'DEBUG',
            color: 'MAGENTA',
        }, ...log);
    }

    error(...log) {
        this._log({
            type: 'ERROR',
            color: 'RED',
            method: console.error,
        }, ...log);
    }

    info(...log) {
        this._log({}, ...log);
    }

    log(...log) {
        this._log({}, ...log);
    }

    success(...log) {
        this._log({
            type: 'SUCCESS',
            color: 'GREEN',
        }, ...log);
    }

    warn(...log) {
        this._log({
            type: 'WARNING',
            color: 'YELLOW',
            method: console.warn,
        }, ...log);
    }

    // PRIVATE
    _log(options, ...log) {
        const stamp = UTIL.formatDuration();
        const color = options.color || 'CYAN';
        const method = options.method || console.log;
        const type = options.type || 'INFO';

        if (process.env.MODE === 'local') {
            log.unshift(`${consoleColors.RESET + stamp} ${consoleColors[color] + type + consoleColors.RESET}:`);
        }
        method(...log);
    }
}

module.exports = new Log();
