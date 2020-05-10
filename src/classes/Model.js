"use strict";

const Database = require("./Database.js");

class Model {
    constructor(values = {}) {
        const fields = this.constructor.fields;
        if (!Model.__instances[this.constructor.name]) {
            Model.__instances[this.constructor.name] = [];
        }

        Model.__instances[this.constructor.name].push(this);

        if (fields) {
            // Database ID
            if ("id" in values) {
                this.id = values.id;
            }
            for (let fieldName in fields) {
                this[fieldName] = values[fieldName] || fields[fieldName];
            }
        }
    }

    /**
     * Removes the current instance from the parent model instances list.
     */
    destroy() {
        const newInstances = [];
        const instances = Model.__instances[this.constructor.name];
        for (let i = 0; i < instances.length; i++) {
            if (instances[i] !== this) {
                newInstances.push(instances[i]);
            }
        }
        Model.__instances[this.constructor.name] = newInstances;
    }

    /**
     * @returns {Model[]}
     */
    static get all() {
        return Model.__instances[this.name];
    }
    static set all(instances) {
        Model.__instances[this.name] = instances;
    }

    /**
     * @returns {Number}
     */
    static get size() {
        return Model.__instances[this.name].length;
    }
    /**
     * @throws {TypeError}
     */
    static set size(_) {
        throw new TypeError(
            `Cannot assign to read only property 'size' of function '${this.name}'`
        );
    }

    /**
     * Returns the list of instances fetched from the attached database table.
     * @returns {Promise<Object[]>}
     */
    static async load() {
        const rows = await Database.read(this.table);
        const objects = rows.map((rowData) => new this(rowData));
        LOG.log(`${UTIL.title(this.name)} data loaded`);
        return objects;
    }

    /**
     * Creates new model instances with the given values (one instance for each
     * value) and returns the list of instantiated objects.
     * @param {...Object} allValues
     * @returns {Model[]}
     */
    static async create(...allValues) {
        const allFormattedValues = allValues.map((vals) =>
            this.validateFields(vals, true)
        );
        const createdObjects = await Database.create(
            this.table,
            ...allFormattedValues
        );
        const formattedCreatedObjects = createdObjects.map((res) => {
            const newObj = new this(res);
            newObj.id = res.id;
            return newObj;
        });
        return formattedCreatedObjects;
    }

    /**
     * Destroys the instances linked to the given ids.
     * @param  {...number} ids
     */
    static async remove(...ids) {
        const newInstances = [];
        const instances = Model.__instances[this.name];
        for (let i = 0; i < instances.length; i++) {
            if (ids.includes(instances[i].id)) {
                await Database.remove(this.table, instances[i].id);
            } else {
                newInstances.push(instances[i]);
            }
        }
        Model.__instances[this.name] = newInstances;
    }

    /**
     * Writes the given values on all records matching the given ids.
     * @param {(number|number[])} ids
     * @param {Object} values
     * @returns {Object[]} list updated objects
     */
    static async update(ids, values) {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        const validValues = this.validateFields(values);
        const results = await Database.update(this.table, ids, validValues);
        results.forEach((res) => {
            const obj = this.find((obj) => obj.id === res.id);
            for (let fieldName in validValues) {
                obj[fieldName] = validValues[fieldName];
            }
        });
        return results;
    }

    /**
     * Filters the given values with fields allowed on the current model (defined
     * in the static 'fields' property). If 'applyDefault' is set to true, default
     * values will be set for each key absent from the 'vlues' object.
     * @param {Object} values
     * @param {boolean} [applyDefault=false]
     * @returns {Object}
     */
    static validateFields(values, applyDefault = false) {
        const validObject = applyDefault
            ? JSON.parse(JSON.stringify(this.fields))
            : {};
        for (let fieldName in values) {
            if (fieldName in this.fields) {
                validObject[fieldName] = values[fieldName];
            }
        }
        return validObject;
    }

    //-------------------------------------------------------------------------
    // Array functions applied to all current instances
    //-------------------------------------------------------------------------

    /**
     * @see Array.filter()
     */
    static filter() {
        return Array.prototype.filter.apply(
            Model.__instances[this.name],
            arguments
        );
    }
    /**
     * @see Array.find()
     */
    static find() {
        return Array.prototype.find.apply(
            Model.__instances[this.name],
            arguments
        );
    }
    /**
     * @see Array.forEach()
     */
    static forEach() {
        return Array.prototype.forEach.apply(
            Model.__instances[this.name],
            arguments
        );
    }
    /**
     * @see Array.map()
     */
    static map() {
        return Array.prototype.map.apply(
            Model.__instances[this.name],
            arguments
        );
    }
    /**
     * @see Array.reduce()
     */
    static reduce() {
        return Array.prototype.reduce.apply(
            Model.__instances[this.name],
            arguments
        );
    }
    /**
     * @see Array.sort()
     */
    static sort() {
        return Array.prototype.sort.apply(
            Model.__instances[this.name],
            arguments
        );
    }
}
Model.__instances = {};

module.exports = Model;
