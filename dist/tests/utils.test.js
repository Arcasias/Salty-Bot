import QUnit from "qunit";
import { choice, clean, formatDuration, generate, isSorted, possessive, promisify, randRange, randStat, shuffle, sortArray, title, } from "../src/utils";
QUnit.module("utils", {}, function () {
    QUnit.test("choice", async function (assert) {
        assert.expect(1);
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
        assert.deepEqual(clean(` , b.on"j'\`o\\-u_r  `), "bonjour");
    });
    QUnit.test("formatDuration", async function (assert) {
        assert.expect(1);
        const date = new Date();
        const dateString = date.toDateString();
        assert.deepEqual(formatDuration());
    });
    QUnit.test("generate", async function (assert) {
        assert.expect(1);
        assert.deepEqual(generate());
    });
    QUnit.test("isSorted", async function (assert) {
        assert.expect(1);
        assert.deepEqual(isSorted());
    });
    QUnit.test("possessive", async function (assert) {
        assert.expect(1);
        assert.deepEqual(possessive());
    });
    QUnit.test("promisify", async function (assert) {
        assert.expect(1);
        assert.deepEqual(promisify());
    });
    QUnit.test("randRange", async function (assert) {
        assert.expect(1);
        assert.deepEqual(randRange());
    });
    QUnit.test("randStat", async function (assert) {
        assert.expect(1);
        assert.deepEqual(randStat());
    });
    QUnit.test("shuffle", async function (assert) {
        assert.expect(1);
        assert.deepEqual(shuffle());
    });
    QUnit.test("sortArray", async function (assert) {
        assert.expect(1);
        assert.deepEqual(sortArray());
    });
    QUnit.test("title", async function (assert) {
        assert.expect(1);
        assert.deepEqual(title());
    });
});
