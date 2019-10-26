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

function debug(...log) {
    if (process.env.DEBUG !== 'true') {
        return;
    }
    if (process.env.MODE === 'local') {
        log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.MAGENTA}DEBUG${colors.RESET}:`);
    }
    console.log(...log);
}

function error(...log) {
    if (process.env.MODE === 'local') {
        log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.RED}ERROR${colors.RESET}:`);
    }
    console.error(...log);
}

function info(...log) {
    if (process.env.MODE === 'local') {
        log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.CYAN}INFO${colors.RESET}:`);
    }
    console.info(...log);
}

function log(...log) {
    if (process.env.MODE === 'local') {
        log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.CYAN}LOG${colors.RESET}:`);
    }
    console.log(...log);
}

function success(...log) {
    if (process.env.MODE === 'local') {
        log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.GREEN}SUCCESS${colors.RESET}:`);
    }
    console.log(...log);
}

function warn(...log) {
    if (process.env.MODE === 'local') {
        log.unshift(`${colors.RESET + UTIL.formatDuration()} ${colors.YELLOW}WARNING${colors.RESET}:`);
    }
    console.warn(...log);
}

global.LOG = {
    debug,
    error,
    info,
    log,
    success,
    warn,
};
