'use strict';

const Database = require('./Database');

class Multiton {

    constructor(values) {
        const fields = this.constructor.fields;
        if (!Multiton._instances[this.constructor.name]) {
            Multiton._instances[this.constructor.name] = [];
        }

        Multiton._instances[this.constructor.name].push(this);

        if (fields) {
            for (let fieldName in fields) {
                this[fieldName] = values[fieldName] || fields[fieldName];
            }
        }
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

    static async load() {
        const rows = await Database.read(this.table);
        Multiton._instances[this.name] = rows;
        LOG.info(`${UTIL.title(this.name)} data loaded`);
        return rows;
    }

    static async create(...allValues) {
        const allFormattedValues = allValues.map(vals => this.validateFields(vals, true));
        const createdObjects = await Database.create(this.table, ...allFormattedValues);
        const formattedCreatedObjects = createdObjects.map(res => {
            const newObj = new this(res);
            newObj.id = res.id;
            return newObj;
        });
        return formattedCreatedObjects;
    }

    static async remove(...ids) {
        const newInstances = [];
        const instances = Multiton._instances[this.name];
        for (let i = 0; i < instances.length; i ++) {
            if (ids.includes(instances[i].id)) {
                await Database.delete(this.table, instances[i].id);
            } else {
                newInstances.push(instances[i]);
            }
        }
        Multiton._instances[this.name] = newInstances;
    }

    static async update(ids, values) {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        const validValues = this.validateFields(values);
        const results = await Database.update(this.table, ids, validValues);
        results.forEach(res => {
            const obj = this.find(obj => obj.id === res.id);
            for (let fieldName in validValues) {
                obj[fieldName] = validValues[fieldName];
            }
        });
        return results;
    }

    static validateFields(values, applyDefault=false) {
        const validObject = applyDefault ? JSON.parse(JSON.stringify(this.fields)) : {};
        for (let fieldName in values) {
            if (fieldName in this.fields) {
                validObject[fieldName] = values[fieldName];
            }
        }
        return validObject;
    }

    // Array functions applied to all current instances

    static filter(fn) { return Array.prototype.filter.apply(Multiton._instances[this.name], arguments); }
    static find(fn) { return Array.prototype.find.apply(Multiton._instances[this.name], arguments); }
    static forEach(fn) { return Array.prototype.forEach.apply(Multiton._instances[this.name], arguments); }
    static map(fn) { return Array.prototype.map.apply(Multiton._instances[this.name], arguments); }
    static reduce(fn) { return Array.prototype.reduce.apply(Multiton._instances[this.name], arguments); }
}

Multiton._instances = {};

module.exports = Multiton;
