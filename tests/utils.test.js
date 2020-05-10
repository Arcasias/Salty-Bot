"use strict";

const UTIL = require("../src/utils/utils.js");
const QUnit = require("qunit");

QUnit.module("Utils", {}, function () {
    QUnit.test("choice", async function (assert) {
        assert.expect(1);
        const { choice } = UTIL;
        const array = ["a", "b", "c"];
        global.randomValue = 0.1;
        assert.deepEqual(choice(array), "a");
        global.randomValue = 0.5;
        assert.deepEqual(choice(array), "b");
        global.randomValue = 0.9;
        assert.deepEqual(choice(array), "c");
    });

    QUnit.test("clean", async function (assert) {
        assert.expect(1);
        const { clean } = UTIL;
        assert.deepEqual(clean(` , b.on"j'\`o\\-u_r  `), "bonjour");
    });

    QUnit.test("formatDuration", async function (assert) {
        assert.expect(1);
        const { formatDuration } = UTIL;
        // Patch Date class
        const date = new Date();
        const dateString = date.toDateString();
        assert.deepEqual(formatDuration());
    });

    QUnit.test("generate", async function (assert) {
        assert.expect(1);
        const { generate } = UTIL;
        assert.deepEqual(generate());
    });

    QUnit.test("isSorted", async function (assert) {
        assert.expect(1);
        const { isSorted } = UTIL;
        assert.deepEqual(isSorted());
    });

    QUnit.test("possessive", async function (assert) {
        assert.expect(1);
        const { possessive } = UTIL;
        assert.deepEqual(possessive());
    });

    QUnit.test("promisify", async function (assert) {
        assert.expect(1);
        const { promisify } = UTIL;
        assert.deepEqual(promisify());
    });

    QUnit.test("randRange", async function (assert) {
        assert.expect(1);
        const { randRange } = UTIL;
        assert.deepEqual(randRange());
    });

    QUnit.test("randStat", async function (assert) {
        assert.expect(1);
        const { randStat } = UTIL;
        assert.deepEqual(randStat());
    });

    QUnit.test("shuffle", async function (assert) {
        assert.expect(1);
        const { shuffle } = UTIL;
        assert.deepEqual(shuffle());
    });

    QUnit.test("sortArray", async function (assert) {
        assert.expect(1);
        const { sortArray } = UTIL;
        assert.deepEqual(sortArray());
    });

    QUnit.test("table", async function (assert) {
        assert.expect(1);
        const { table } = UTIL;
        assert.deepEqual(table());
    });

    QUnit.test("title", async function (assert) {
        assert.expect(1);
        const { title } = UTIL;
        assert.deepEqual(title());
    });
});
