"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Database_1 = __importDefault(require("./Database"));
class Model {
    constructor(values = {}) {
        const { name, table, fields } = this.Class;
        if (!Model.instances[name]) {
            Model.instances[name] = [];
        }
        Model.instances[name].push(this);
        if (table) {
            if ("id" in values) {
                this.id = values.id;
                delete values.id;
            }
            else {
                throw new Error(`Missing field "id" on stored model ${name}.`);
            }
        }
        if (fields.length) {
            const toAssign = fields.slice();
            for (const key in values) {
                const keyIndex = toAssign.indexOf(key);
                if (keyIndex > -1) {
                    this[key] = values[key];
                    toAssign.splice(keyIndex, 1);
                }
            }
        }
    }
    get Class() {
        return this.constructor;
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
        const records = await Database_1.default.read(this.table);
        const instances = records.map((values) => new this(values));
        utils_1.log(`${records.length} ${this.name}(s) loaded`);
        return instances;
    }
    static async create(...allValues) {
        const records = await Database_1.default.create(this.table, ...allValues);
        const instances = records.map((values) => new this(values));
        return instances;
    }
    static async remove(...ids) {
        const newInstances = [];
        const instances = Model.instances[this.name];
        for (let i = 0; i < instances.length; i++) {
            if (ids.includes(instances[i].id)) {
                await Database_1.default.remove(this.table, instances[i].id);
            }
            else {
                newInstances.push(instances[i]);
            }
        }
        Model.instances[this.name] = newInstances;
    }
    static async update(ids, values) {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        const results = await Database_1.default.update(this.table, ids, values);
        const instances = results.map((res) => {
            const instance = this.find((instance) => instance.id === res.id);
            for (let fieldName in values) {
                instance[fieldName] = values[fieldName];
            }
            return instance;
        });
        return instances;
    }
    static filter(callbackfn) {
        return Model.instances[this.name].filter(callbackfn);
    }
    static find(predicate) {
        return Model.instances[this.name].find(predicate);
    }
    static forEach(callbackfn) {
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
Model.fields = [];
exports.default = Model;
