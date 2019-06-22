'use strict';

class Singleton {

    constructor() {
        if (! Singleton._instances[this.constructor.name]) {
            Singleton._instances[this.constructor.name] = this;
        }
        return Singleton._instances[this.constructor.name];
    }

    _destroy() {
        Singleton._instances[this.constructor.name] = null;
    }
}
Singleton._instances = {};

module.exports = Singleton;