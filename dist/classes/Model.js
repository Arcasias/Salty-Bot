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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9Nb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG9DQUErQjtBQUMvQix5Q0FBMEQ7QUFFMUQsTUFBTSxLQUFLO0lBUVAsWUFBWSxTQUEyQixFQUFFO1FBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQVMsSUFBSyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDbEU7UUFDRCxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFHLENBQUM7UUFDckIsT0FBTyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ2pCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDNUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0MsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUU7Z0JBQ3RCLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtvQkFDakIsSUFBSSxDQUFjLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDckMsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3hCO2FBQ0o7WUFFRCxLQUFLLE1BQU0sR0FBRyxJQUFJLFFBQVEsRUFBRTtnQkFDeEIsSUFBSSxDQUFjLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMxQztTQUNKO0lBQ0wsQ0FBQztJQUtNLE9BQU87UUFDVixNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDeEIsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDdkIsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuQztTQUNKO1FBQ0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQztJQUMxRCxDQUFDO0lBTU0sTUFBTSxLQUFLLElBQUk7UUFDbEIsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDN0MsQ0FBQztJQUtNLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNiLE1BQU0sSUFBSSxLQUFLLENBQ1gsVUFBVSxJQUFJLENBQUMsSUFBSSxrQ0FBa0MsQ0FDeEQsQ0FBQztTQUNMO1FBQ0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sT0FBTyxHQUF1QixNQUFNLGVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0QsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMvRCxXQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDO1FBQ2xELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFNTSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FDdEIsR0FBRyxTQUFnQjtRQUVuQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNiLE1BQU0sSUFBSSxLQUFLLENBQ1gsVUFBVSxJQUFJLENBQUMsSUFBSSw2Q0FBNkMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQzdGLENBQUM7U0FDTDtRQUNELE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUN6QyxDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQXVCLE1BQU0saUJBQU0sQ0FDNUMsSUFBSSxDQUFDLEtBQUssRUFDVixHQUFHLFdBQVcsQ0FDakIsQ0FBQztRQUNGLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUtELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFrQixHQUFHLEdBQWE7UUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDYixNQUFNLElBQUksS0FBSyxDQUNYLFVBQVUsSUFBSSxDQUFDLElBQUksa0NBQWtDLENBQ3hELENBQUM7U0FDTDtRQUNELE1BQU0sWUFBWSxHQUFRLEVBQUUsQ0FBQztRQUM3QixNQUFNLE9BQU8sR0FBUSxFQUFFLENBQUM7UUFDeEIsTUFBTSxRQUFRLEdBQW1CLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFXLEVBQUUsRUFBRTtZQUM1QixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNqQyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUMxQjtpQkFBTTtnQkFDSCxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQy9CO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBS0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQ2YsR0FBc0IsRUFDdEIsTUFBVztRQUVYLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FDWCxVQUNJLElBQUksQ0FBQyxJQUNULHVEQUF1RCxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixDQUN6RyxDQUFDO1NBQ0w7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQixHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNmO1FBQ0QsTUFBTSxPQUFPLEdBQVUsTUFBTSxpQkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdELE1BQU0sU0FBUyxHQUFRLE9BQU8sQ0FBQyxHQUFHLENBQzlCLENBQUMsR0FBUSxFQUFLLEVBQUU7WUFDWixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUN0QixDQUFDLFFBQVcsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUMxQyxDQUFDO1lBQ0YsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUU7Z0JBQ3RCLFFBQVMsQ0FBVSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDekM7WUFDRCxPQUFPLFFBQVMsQ0FBQztRQUNyQixDQUFDLENBQ0osQ0FBQztRQUNGLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFTSxNQUFNLENBQUMsR0FBRztRQUNiLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxNQUFNLENBQ2hCLFVBQWlEO1FBRWpELE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTSxNQUFNLENBQUMsSUFBSSxDQUNkLFNBQWdEO1FBRWhELE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFTSxNQUFNLENBQUMsSUFBSSxDQUNkLFVBQTZDO1FBRTdDLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxNQUFNLENBQUMsR0FBRyxDQUNiLFVBQTZDO1FBRTdDLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFTSxNQUFNLENBQUMsSUFBSSxDQUNkLFNBQStDO1FBRS9DLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7O0FBakxnQixlQUFTLEdBQXFDLEVBQUUsQ0FBQztBQUN4QyxZQUFNLEdBQXFCLEVBQUUsQ0FBQztBQW1MNUQsa0JBQWUsS0FBSyxDQUFDIn0=