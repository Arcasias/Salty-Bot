"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Database_1 = __importDefault(require("./Database"));
class Model {
    constructor(values = {}) {
        this.stored = false;
        const name = this.constructor.name;
        if (!Model.instances[name]) {
            Model.instances[name] = [];
        }
        Model.instances[name].push(this);
        if (this.stored) {
            this.id = values.id;
            delete values.id;
            for (const key in values) {
                if (!this.hasOwnProperty(key)) {
                    throw new Error(`Invalid key "${key}" given to ${name} instance.`);
                }
                this[key] = values[key];
            }
        }
    }
    /**
     * Removes the current instance from the parent model instances list.
     */
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
    /**
     * Returns the list of instances fetched from the attached database table.
     */
    static async load() {
        const records = await Database_1.default.read(this.table);
        const instances = records.map((values) => new this(values));
        utils_1.log(`${utils_1.title(this.name)} data loaded`);
        return instances;
    }
    /**
     * Creates new model instances with the given values (one instance for each
     * value) and returns the list of instantiated objects.
     */
    static async create(...allValues) {
        const databaseObjects = await Database_1.default.create(this.table, ...allValues);
        const instances = databaseObjects.map((res) => {
            const instance = new this(res);
            instance.id = res.id;
            return instance;
        });
        return instances;
    }
    /**
     * Destroys the instances linked to the given ids.
     */
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
    /**
     * Writes the given values on all records matching the given ids.
     */
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
    //-------------------------------------------------------------------------
    // Array functions applied to all current instances
    //-------------------------------------------------------------------------
    /**
     * @see Array.filter()
     */
    static filter(...args) {
        return Model.instances[this.name].filter(...args);
    }
    /**
     * @see Array.find()
     */
    static find(...args) {
        return Model.instances[this.name].find(...args);
    }
    /**
     * @see Array.forEach()
     */
    static forEach(...args) {
        return Model.instances[this.name].forEach(...args);
    }
    /**
     * @see Array.map()
     */
    static map(...args) {
        return Model.instances[this.name].map(...args);
    }
    /**
     * @see Array.reduce()
     */
    static reduce(...args) {
        return Model.instances[this.name].reduce(...args);
    }
    /**
     * @see Array.sort()
     */
    static sort(...args) {
        return Model.instances[this.name].sort(...args);
    }
}
Model.instances = {};
Model.fields = {};
exports.default = Model;
