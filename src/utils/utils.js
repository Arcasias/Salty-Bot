"use strict";

/**
 * Returns a random item from a given array.
 * @param {any[]} array
 * @returns {any}
 */
function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a "cleaned" version of the given string:
 * - stripped of characters deemed unnecessary
 * - trimmed of trailing white spaces
 * - lower cased
 * @param {String} string
 * @returns {String}
 */
function clean(string) {
    return string
        .replace(/[,."'`\-_]/g, "")
        .trim()
        .toLowerCase();
}

/**
 * Format a given duration. If none is given, duration is set to current time.
 * @param {(string|null)} [time=null]
 * @returns {String} formatted as "HH:mm:ss".
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
 * @param {Number} percentage
 * @returns {boolean}
 */
function generate(percentage) {
    return Math.random() * 100 <= percentage;
}

/**
 * Returns true if the given array is sorted:
 * - alphabetically if an array of strings
 * - sequentially if an array of numbers
 * @param {(string|number)[]} array
 * @returns {boolean}
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
 * @param {String} text
 * @returns {String}
 */
function possessive(text) {
    return "s" === text[text.length - 1] ? `${text}'` : `${text}'s`;
}

/**
 * Returns the given callback based function as a promise based one.
 * @param {Function} fn will take the following function as argument:
 *      <callback: Function>(error: Error, result: any)
 * @returns {Promise}
 */
function promisify(fn) {
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
 * Returns a random number between the given boundaries.
 * @param {number[]} array in the form: [minimum: number, maximum: number]
 * @returns {Number}
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

module.exports = {
    choice,
    clean,
    formatDuration,
    generate,
    isSorted,
    possessive,
    promisify,
    randRange,
    randStat,
    shuffle,
    sortArray,
    title,
};
