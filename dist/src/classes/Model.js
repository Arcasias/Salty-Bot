"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Database_1 = __importDefault(require("./Database"));
const Exception_1 = require("./Exception");
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
                throw new Exception_1.SaltyException(`Missing field "id" on stored model ${name}.`);
            }
        }
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
        if (!this.table) {
            throw new Exception_1.SaltyException(`Model "${this.name}" is not stored in the database.`);
        }
        const records = await Database_1.default.read(this.table);
        const instances = records.map((values) => new this(values));
        utils_1.log(`${records.length} ${this.name}(s) loaded`);
        return instances;
    }
    static async create(...allValues) {
        if (!this.table) {
            throw new Exception_1.SaltyException(`Model "${this.name}" is not stored in the database. Use 'new ${this.name}(...)' instead.`);
        }
        const records = await Database_1.default.create(this.table, ...allValues);
        const instances = records.map((values) => new this(values));
        return instances;
    }
    static async remove(...ids) {
        if (!this.table) {
            throw new Exception_1.SaltyException(`Model "${this.name}" is not stored in the database.`);
        }
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
        if (!this.table) {
            throw new Exception_1.SaltyException(`Model "${this.name}" is not stored in the database. Use 'Object.assign(${this.name.toLocaleLowerCase()}, ...)' instead.`);
        }
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
