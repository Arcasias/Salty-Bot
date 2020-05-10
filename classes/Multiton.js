'use strict';

const Database = require('./Database.js');

class Multiton {
    constructor(values={}) {
        const fields = this.constructor.fields;
        if (!Multiton.__instances[this.constructor.name]) {
            Multiton.__instances[this.constructor.name] = [];
        }

        Multiton.__instances[this.constructor.name].push(this);

        if (fields) {
            // Database ID
            if ('id' in values) {
                this.id = values.id;
            }
            for (let fieldName in fields) {
                this[fieldName] = values[fieldName] || fields[fieldName];
            }
        }
    }

    destroy() {
        const newInstances = [];
        const instances = Multiton.__instances[this.constructor.name];
        for (let i = 0; i < instances.length; i ++) {
            if (instances[i] !== this) {
                newInstances.push(instances[i]);
            }
        }
        Multiton.__instances[this.constructor.name] = newInstances;
    }

    static get all() {
        return Multiton.__instances[this.name];
    }
    static set all(instances) {
        Multiton.__instances[this.name] = instances;
    }

    static get size() {
        return Multiton.__instances[this.name].length;
    }
    static set size(val) {
        throw new TypeError(`Cannot assign to read only property 'size' of function '${this.name}'`);
    }

    static async load() {
        const rows = await Database.read(this.table);
        const objects = rows.map(rowData => new this(rowData));
        LOG.info(`${UTIL.title(this.name)} data loaded`);
        return objects;
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
        const instances = Multiton.__instances[this.name];
        for (let i = 0; i < instances.length; i ++) {
            if (ids.includes(instances[i].id)) {
                await Database.remove(this.table, instances[i].id);
            } else {
                newInstances.push(instances[i]);
            }
        }
        Multiton.__instances[this.name] = newInstances;
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

    static filter() { return Array.prototype.filter.apply(Multiton.__instances[this.name], arguments); }
    static find() { return Array.prototype.find.apply(Multiton.__instances[this.name], arguments); }
    static forEach() { return Array.prototype.forEach.apply(Multiton.__instances[this.name], arguments); }
    static map() { return Array.prototype.map.apply(Multiton.__instances[this.name], arguments); }
    static reduce() { return Array.prototype.reduce.apply(Multiton.__instances[this.name], arguments); }
    static sort() { return Array.prototype.sort.apply(Multiton.__instances[this.name], arguments); }
}
Multiton.__instances = {};

module.exports = Multiton;
