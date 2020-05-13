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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9Nb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9DQUErQjtBQUMvQiwwREFBb0Q7QUFDcEQsMkNBQTZDO0FBSTdDLE1BQU0sS0FBSztJQU9QLFlBQVksU0FBdUIsRUFBRTtRQUNqQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQzlCO1FBQ0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFHakMsSUFBSSxLQUFLLEVBQUU7WUFDUCxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDcEIsT0FBTyxNQUFNLENBQUMsRUFBRSxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNILE1BQU0sSUFBSSwwQkFBYyxDQUNwQixzQ0FBc0MsSUFBSSxHQUFHLENBQ2hELENBQUM7YUFDTDtTQUNKO1FBRUQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUM1QixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzQyxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRTtnQkFDdEIsSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFO29CQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN4QixPQUFP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