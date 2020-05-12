import { log } from "../utils";
import Database, { FieldsValues } from "./Database";
import { SaltyException } from "./Exception";

export type FieldsDescriptor = { [field: string]: any };

class Model {
    public id: number;

    protected static instances: { [constructor: string]: any[] } = {};
    protected static readonly fields: FieldsDescriptor = {};
    protected static readonly table: string;

    constructor(values: FieldsValues = {}) {
        const { name, table, fields } = this.Class;
        if (!Model.instances[name]) {
            Model.instances[name] = [];
        }
        Model.instances[name].push(this);

        // Model is stored in database
        if (table) {
            if ("id" in values) {
                this.id = values.id;
                delete values.id;
            } else {
                throw new SaltyException(
                    `Missing field "id" on stored model ${name}.`
                );
            }
        }
        // Model has a fields descriptor
        if (Object.keys(fields).length) {
            const toAssign = Object.assign({}, fields);
            for (const key in values) {
                if (key in toAssign) {
                    this[key] = values[key];
                    delete toAssign[key];
                }
            }
            // Apply default values to unassigned fields
            for (const key in toAssign) {
                this[key] = toAssign[key];
            }
        }
    }

    get Class(): typeof Model {
        return (<any>this).constructor;
    }

    /**
     * Removes the current instance from the parent model instances list.
     */
    public destroy(): void {
        const newInstances = [];
        const instances = Model.instances[this.constructor.name];
        for (let i = 0; i < instances.length; i++) {
            if (instances[i] !== this) {
                newInstances.push(instances[i]);
            }
        }
        Model.instances[this.constructor.name] = newInstances;
    }

    public static get size(): number {
        return Model.instances[this.name].length;
    }

    /**
     * Returns the list of instances fetched from the attached database table.
     */
    public static async load<M extends Model>(): Promise<M[]> {
        if (!this.table) {
            throw new SaltyException(
                `Model "${this.name}" is not stored in the database.`
            );
        }
        const records: FieldsValues[] = await Database.read(this.table);
        const instances = records.map((values) => new this(values));
        log(`${records.length} ${this.name}(s) loaded`);
        return <M[]>instances;
    }

    /**
     * Creates new model instances with the given values (one instance for each
     * value) and returns the list of instantiated objects.
     */
    public static async create<M extends Model>(
        ...allValues: any[]
    ): Promise<M[]> {
        if (!this.table) {
            throw new SaltyException(
                `Model "${this.name}" is not stored in the database. Use 'new ${this.name}(...)' instead.`
            );
        }
        const records: FieldsValues[] = await Database.create(
            this.table,
            ...allValues
        );
        const instances = records.map((values) => new this(values));
        return <M[]>instances;
    }

    /**
     * Destroys the instances linked to the given ids.
     */
    static async remove(...ids: number[]): Promise<void> {
        if (!this.table) {
            throw new SaltyException(
                `Model "${this.name}" is not stored in the database.`
            );
        }
        const newInstances: Model[] = [];
        const instances: Model[] = Model.instances[this.name];
        for (let i = 0; i < instances.length; i++) {
            if (ids.includes(instances[i].id)) {
                await Database.remove(this.table, instances[i].id);
            } else {
                newInstances.push(instances[i]);
            }
        }
        Model.instances[this.name] = newInstances;
    }

    /**
     * Writes the given values on all records matching the given ids.
     */
    static async update<M extends Model>(
        ids: number | number[],
        values: any
    ): Promise<M[]> {
        if (!this.table) {
            throw new SaltyException(
                `Model "${
                    this.name
                }" is not stored in the database. Use 'Object.assign(${this.name.toLocaleLowerCase()}, ...)' instead.`
            );
        }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        const results: any[] = await Database.update(this.table, ids, values);
        const instances: Model[] = results.map(
            (res: any): Model => {
                const instance: Model = this.find(
                    (instance: Model) => instance.id === res.id
                );
                for (let fieldName in values) {
                    instance[fieldName] = values[fieldName];
                }
                return instance;
            }
        );
        return <M[]>instances;
    }

    public static all<M extends Model>(): M[] {
        return Model.instances[this.name];
    }

    public static filter<M extends Model>(callbackfn: {
        (instance?: M, index?: number): boolean;
    }): M[] {
        return Model.instances[this.name].filter(callbackfn);
    }

    public static find<M extends Model>(predicate: {
        (instance?: M, index?: number): boolean;
    }): M {
        return Model.instances[this.name].find(predicate);
    }

    public static each<M extends Model>(callbackfn: {
        (instance?: M, index?: number): void;
    }): void {
        return Model.instances[this.name].forEach(callbackfn);
    }

    public static map<M extends Model>(callbackfn: {
        (instance?: M, index?: number): any;
    }): any[] {
        return Model.instances[this.name].map(callbackfn);
    }

    public static sort<M extends Model>(comparefn: {
        (instance?: M, index?: number): number;
    }): M[] {
        return Model.instances[this.name].sort(comparefn);
    }
}

export default Model;
