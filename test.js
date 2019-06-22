'use strict';

const fs = require('fs');
const Data = require('./classes/Data');
const Test = require('./classes/Test');

const started = require('./main').then(() => {

    const truthyObject = { oof: 'oui' };

    Test.module("Test assertions");

    Test.test("Equals", async function (assert) {
        assert.equals(false, 0, "False and zero should be nearly equal");
    });

    Test.test("Not equals", async function (assert) {
        assert.notEquals('hello', 'goodbye', "Two different strings should not be equal");
    });

    Test.test("Strict equals", async function (assert) {
        assert.strictEquals('hello', 'hello', "Two equal strings should be strictly equal");
    });

    Test.test("Strict not equals", async function (assert) {
        assert.strictNotEquals(false, 0, "False and zero should not be strictly equal");
    });

    Test.test("Ok", async function (assert) {
        assert.ok(truthyObject, "Any truthy object should be valid")
    });

    Test.module("Data");

    Test.test("Encoding and deconding objects", async function (assert) {

        let obj = {
            oof: 'oui',
            array : ['value1', 56],
            bool: true,
        }
        let encoded = Data.encode(obj);

        assert.strictEquals(typeof encoded, 'string', "Encoded value should be a string");

        let decoded = Data.decode(encoded);

        assert.strictEquals(obj, decoded, "Decoded string should be the same as the original");
    });

    Test.run();
});

