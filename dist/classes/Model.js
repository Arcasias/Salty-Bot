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
        this.Class = this.constructor;
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
        this.each(async (instance) => {
            if (ids.includes(instance.id || -1)) {
                await Database_1.default.remove(this.table, instance.id);
            }
            else {
                newInstances.push(instance);
            }
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9Nb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9DQUErQjtBQUMvQiwwREFBb0Q7QUFDcEQsMkNBQTZDO0FBSTdDLE1BQU0sS0FBSztJQVFQLFlBQVksU0FBdUIsRUFBRTtRQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFTLElBQUssQ0FBQyxXQUFXLENBQUM7UUFDckMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUM5QjtRQUNELEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBR2pDLElBQUksS0FBSyxFQUFFO1lBQ1AsSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFO2dCQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQ3BCLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQzthQUNwQjtpQkFBTTtnQkFDSCxNQUFNLElBQUksMEJBQWMsQ0FDcEIsc0NBQXNDLElBQUksR0FBRyxDQUNoRCxDQUFDO2FBQ0w7U0FDSjtRQUVELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDNUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0MsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUU7Z0JBQ3RCLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtvQkFDakIsSUFBSSxDQUFjLEdBQUcs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