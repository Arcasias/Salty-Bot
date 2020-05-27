import QUnit from "qunit";
import { debug, error, log, request, warn } from "../src/utils";

const initialDebug = process.env.DEBUG;
const initialMode = process.env.MODE;
const originalConsole = global.console;

QUnit.module(
    "Log",
    {
        beforeEach() {
            global.console = Object.assign({}, global.console);
            process.env.MODE = "local";
        },
        afterEach() {
            global.console = originalConsole;
            process.env.DEBUG = initialDebug;
            process.env.MODE = initialMode;
        },
    },
    function () {
        QUnit.test("Log (local and server)", async function (assert) {
            assert.expect(2);
            // Local env
            process.env.MODE = "local";
            console.log = (...args) => {
                assert.deepEqual(args, [
                    "\u001b[0m00:00:00 \u001b[36mINFO\u001b[0m:",
                    "aaa",
                ]);
            };
            log("aaa");
            // Server env
            process.env.MODE = "server";
            console.log = (...args) => {
                assert.deepEqual(args, ["aaa"]);
            };
            log("aaa");
        });

        QUnit.test("Debug (with and without debug mode)", async function (
            assert
        ) {
            assert.expect(1);
            // Debug true
            process.env.DEBUG = "true";
            console.log = (...args) => {
                assert.deepEqual(args, [
                    "\u001b[0m00:00:00 \u001b[35mDEBUG\u001b[0m:",
                    "aaa",
                ]);
            };
            debug("aaa");
            // Debug false
            process.env.DEBUG = "false";
            console.log = () => {
                return Salty.warn("Log is not supposed to be called.");
            };
            debug("aaa");
        });

        QUnit.test("Error", async function (assert) {
            assert.expect(1);
            console.error = (...args) => {
                assert.deepEqual(args, [
                    "\u001b[0m00:00:00 \u001b[31mERROR\u001b[0m:",
                    "aaa",
                ]);
            };
            error("aaa");
        });

        QUnit.test("Request", async function (assert) {
            assert.expect(1);
            console.log = (...args) => {
                assert.deepEqual(args, [
                    "\u001b[0m00:00:00",
                    '\u001b[33mCoolKidsServer\u001b[0m > \u001b[33mCoolestBoi\u001b[0m:\u001b[32m"aaa"\u001b[0m',
                ]);
            };
            request("CoolKidsServer", "CoolestBoi", "aaa");
        });

        QUnit.test("Warning", async function (assert) {
            assert.expect(1);
            console.warn = (...args) => {
                assert.deepEqual(args, [
                    "\u001b[0m00:00:00 \u001b[33mWARNING\u001b[0m:",
                    "aaa",
                ]);
            };
            warn("aaa");
        });
    }
);
