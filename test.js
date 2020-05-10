"use strict";

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------

// Math.random: default value = 0.5, can be changed with 'setRandom()'
let randomValue = 0.5;
global.setRandom = (value) => {
    randomValue = value;
};
global.Math.random = () => randomValue;

// Date: default value = 09/01/1997 00:00:00
class MockDate extends Date {
    constructor(date = "Jan 09 1997") {
        super(date);
    }
}
global.Date = MockDate;

//-----------------------------------------------------------------------------
// Test scripts
//-----------------------------------------------------------------------------

/**
 * Tests must respect the following conventions:
 * - located inside the 'tests' root folder
 * - named as <feature>.test.js where <feature> is the name of the tested unit which
 *   must be registered in the following list.
 */
const tests = [
    // utils
    "log",
    "utils",
    // classes
    // commands
];

for (const test of tests) {
    require(`./tests/${test}.test.js`);
}
