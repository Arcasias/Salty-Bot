'use strict';

const Singleton = require('./Singleton');

class Test extends Singleton {

    constructor() {
        super(...arguments);

        this.tests = {};
        this._count = 0;
        this._currentModule = null;
    }

    module(name) {
        this._currentModule = name;
        if (! this.tests[this._currentModule]) {
            this.tests[this._currentModule] = {};
        }
    }

    async run() {
        let errorCount = 0;
        for (let moduleName in this.tests) {
            LOG.info(`Testing module "${moduleName}"`)
            for (let testName in this.tests[moduleName]) {
                let assert = new Assert();
                if (this.tests[moduleName][testName].skipped) {
                    LOG.warn(`Skipped test "${moduleName} > ${testName}"`);
                } else {
                    try {
                        await this.tests[moduleName][testName].fn(assert);
                        LOG.success(`${moduleName} > ${testName} : passed ${assert.assertions}/${assert.assertions} assertions`);
                    } catch (err) {
                        errorCount ++;
                        LOG.error(err.message);
                    }
                }
            }
        }
        LOG.info(`${this._count - errorCount}/${this._count} tests passed, ${errorCount} failed.`);
    }

    skip(name, fn) {
        this.test(name, fn, { skipped: true });
    }

    test(name, fn, options) {
        if (! this._currentModule) {
            throw new Error(`No module defined for test "${name}"`);
        }
        this.tests[this._currentModule][name] = {
            fn,
            skipped: !!(options && options.skipped),
        };
        this._count ++;
    }
}

class Assert {

    constructor() {
        this.assertions = 0;
    }

    _equality(options, expected, result) {
        this.assertions ++;
        if (arguments.length < 3) {
            throw new Error(`Expected at least two parameters, got ${arguments.length - 1}`);
        }
        let assertion = true;
        if (Array.isArray(expected)) {
            for (let i = 0; i < expected.length; i ++) {
                if (! assertion) break;
                assertion = this._equality(options, expected[i], result[i]);
            }
        } else if (typeof expected === 'object' && Object.keys(expected).length) {
            for (let key in expected) {
                if (! assertion) break;
                assertion = this._equality(options, expected[key], result[key]);
            }
        } else {
            assertion = options.strict ? expected === result : expected == result;
        }
        return options.not ? ! assertion : assertion;
    }

    equals(expected, result, msg) {
        if (! this._equality({}, ...arguments)) {
            throw new Error(`"${msg}" failed. Expected ${expected} and got ${result}`);
        }
    }

    notEquals(expected, result, msg) {
        if (! this._equality({ not: true }, ...arguments)) {
            throw new Error(`"${msg}" failed. Got ${result} and expected different result`);
        }
    }

    ok(assert, msg) {
        return this.equals(true, !!assert, msg);
    }

    strictEquals(expected, result, msg) {
        if (! this._equality({ strict: true }, ...arguments)) {
            throw new Error(`"${msg}" failed. Expected ${expected} and got ${result}`);
        }
    }

    strictNotEquals(expected, result, msg) {
        if (! this._equality({ strict: true, not: true }, ...arguments)) {
            throw new Error(`"${msg}" failed. Got ${result} and expected different result`);
        }
    }
}

module.exports = new Test();