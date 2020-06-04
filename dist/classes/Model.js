"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Database_1 = require("./Database");
class Model {
    constructor(values = {}) {
        this.Class = this.constructor;
        const { name, fields } = this.Class;
        Model.instances[name].push(this);
        if (!("id" in values)) {
            throw new Error(`Missing field "id" on stored model ${name}.`);
        }
        this.id = values.id;
        delete values.id;
        if (Object.keys(fields).length) {
            const toAssign = Object.assign({}, fields);
            for (const key in values) {
                if (key in toAssign) {
                    this[key] = values[key];
                    delete toAssign[key];
                }
            }
            for (const key in toAssign) {
                this[key] = toAssign[key];
            }
        }
    }
    destroy() {
        const newInstances = [];
        const instances = Model.instances[this.constructor.name];
        for (let i = 0; i < instances.length; i++) {
            if (instances[i] !== this) {
                newInstances.push(instances[i]);
            }
        }
        Model.instances[this.constructor.name] = newInstances;
    }
    static get size() {
        return Model.instances[this.name].length;
    }
    static async load() {
        if (!this.table) {
            throw new Error(`Model "${this.name}" is not stored in the database.`);
        }
        Model.instances[this.name] = [];
        const records = await Database_1.read(this.table);
        const instances = records.map((values) => new this(values));
        utils_1.log(`${instances.length} ${this.name}(s) loaded`);
        return instances;
    }
    static async create(...allValues) {
        if (!this.table) {
            throw new Error(`Model "${this.name}" is not stored in the database. Use 'new ${this.name}(...)' instead.`);
        }
        const validValues = allValues.map((values) => Object.assign({}, this.fields, values));
        const records = await Database_1.create(this.table, ...validValues);
        const instances = records.map((values) => new this(values));
        return instances;
    }
    static async remove(...ids) {
        if (!this.table) {
            throw new Error(`Model "${this.name}" is not stored in the database.`);
        }
        const newInstances = [];
        const removed = [];
        const removing = [];
        this.each(async (instance) => {
            if (ids.includes(instance.id || -1)) {
                removing.push(Database_1.remove(this.table, instance.id));
                removed.push(instance);
            }
            else {
                newInstances.push(instance);
            }
        });
        return removed;
    }
    static async update(ids, values) {
        if (!this.table) {
            throw new Error(`Model "${this.name}" is not stored in the database. Use 'Object.assign(${this.name.toLocaleLowerCase()}, ...)' instead.`);
        }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        const results = await Database_1.update(this.table, ids, values);
        const instances = results.map((res) => {
            const instance = this.find((instance) => instance.id === res.id);
            for (const key in values) {
                instance[key] = values[key];
            }
            return instance;
        });
        return instances;
    }
    static all() {
        return Model.instances[this.name];
    }
    static filter(callbackfn) {
        return Model.instances[this.name].filter(callbackfn);
    }
    static find(predicate) {
        return Model.instances[this.name].find(predicate);
    }
    static each(callbackfn) {
        return Model.instances[this.name].forEach(callbackfn);
    }
    static map(callbackfn) {
        return Model.instances[this.name].map(callbackfn);
    }
    static sort(comparefn) {
        return Model.instances[this.name].sort(comparefn);
    }
}
Model.instances = {};
Model.fields = {};
exports.default = Model;
