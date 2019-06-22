'use strict';

class Multiton {

    constructor() {
        if (! Multiton._instances[this.constructor.name]) {
            Multiton._instances[this.constructor.name] = [];
        }
        Multiton._instances[this.constructor.name].push(this);
    }

    destroy() {
        const newInstances = [];
        const instances = Multiton._instances[this.constructor.name];
        for (let i = 0; i < instances.length; i ++) {
            if (instances[i] !== this) {
                newInstances.push(instances[i]);
            }
        }
        Multiton._instances[this.constructor.name] = newInstances;
    }

    loadAttributes(attrs, ...keys) {
        for (let i = 0; i < keys.length; i ++) {
            if (attrs[keys[i]] && ! this[keys[i]]) {
                this[keys[i]] = attrs[keys[i]];
            } else {
                return keys[i];
            }
        }
        return false;
    }

    static get all() {
        return Multiton._instances[this.name];
    }
    static set all(instances) {
        Multiton._instances[this.name] = instances;
    }

    static get size() {
        return Multiton._instances[this.name].length;
    }
    static set size(val) {
        throw new TypeError(`Cannot assign to read only property 'size' of function '${this.name}'`);
    }

    static forEach(fn) {
        const instances = Multiton._instances[this.name];
        for (let i = 0; i < instances.length; i ++) {
            fn.call(this, instances[i], i);
        }
    }

    static get(id) {
        const instances = Multiton._instances[this.name];
        for (let i = 0; i < instances.length; i ++) {
            if (instances[i].id === id) {
                return instances[i];
            }
        }
        return false;
    }

    static remove(id) {
        const newInstances = [];
        const instances = Multiton._instances[this.name];
        for (let i = 0; i < instances.length; i ++) {
            if (instances[i].id !== id) {
                newInstances.push(instances[i]);
            }
        }
        Multiton._instances[this.name] = newInstances;
    }
}

Multiton._instances = {};

module.exports = Multiton;
