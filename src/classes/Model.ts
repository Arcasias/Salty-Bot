import { Dictionnary, FieldsDescriptor } from "../types";
import { log } from "../utils";
import { create, read, remove, update } from "./Database";

class Model {
    public id!: number;
    protected Class!: typeof Model;

    protected static instances: Dictionnary<any[]> = {};
    protected static readonly fields: FieldsDescriptor = {};
    protected static readonly table: string;

    constructor(values: FieldsDescriptor = {}) {
        this.Class = (<any>this).constructor;
        const { name, fields } = this.Class;
        Model.instances[name].push(this);

        if (!("id" in values)) {
            throw new Error(`Missing field "id" on stored model ${name}.`);
        }
        this.id = values.id!;
        delete values.id;
        if (Object.keys(fields).length) {
            const toAssign = Object.assign({}, fields);
            for (const key in values) {
                if (key in toAssign) {
                    this[<keyof Model>key] = values[key];
                    delete toAssign[key];
                }
            }
            // Apply default values to unassigned fields
            for (const key in toAssign) {
                this[<keyof Model>key] = toAssign[key];
            }
        }
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

    //-------------------------------------------------------------------------
    // Static
    //-------------------------------------------------------------------------

    public static get size(): number {
        return Model.instances[this.name].length;
    }

    /**
     * Returns the list of instances fetched from the attached database table.
     */
    public static async load<T extends Model>(): Promise<T[]> {
        if (!this.table) {
            throw new Error(
                `Model "${this.name}" is not stored in the database.`
            );
        }
        Model.instances[this.name] = [];
        const records: FieldsDescriptor[] = await read(this.table);
        const instances = records.map((values) => <T>new this(values));
        log(`${instances.length} ${this.name}(s) loaded`);
        return instances;
    }

    /**
     * Creates new model instances with the given values (one instance for each
     * value) and returns the list of instantiated objects.
     */
    public static async create<T extends Model>(
        ...allValues: any[]
    ): Promise<T[]> {
        if (!this.table) {
            throw new Error(
                `Model "${this.name}" is not stored in the database. Use 'new ${this.name}(...)' instead.`
            );
        }
        const validValues = allValues.map((values) =>
            Object.assign({}, this.fields, values)
        );
        const records: FieldsDescriptor[] = await create(
            this.table,
            ...validValues
        );
        const instances = records.map((values) => <T>new this(values));
        return instances;
    }

    /**
     * Destroys the instances linked to the given ids.
     */
    static async remove<T extends Model>(...ids: number[]): Promise<T[]> {
        if (!this.table) {
            throw new Error(
                `Model "${this.name}" is not stored in the database.`
            );
        }
        const newInstances: T[] = [];
        const removed: T[] = [];
        const removing: Promise<any>[] = [];
        this.each(async (instance: T) => {
            if (ids.includes(instance.id || -1)) {
                removing.push(remove(this.table, instance.id!));
                removed.push(instance);
            } else {
                newInstances.push(instance);
            }
        });
        return removed;
    }

    /**
     * Writes the given values on all records matching the given ids.
     */
    static async update<T extends Model>(
        ids: number | number[],
        values: any
    ): Promise<T[]> {
        if (!this.table) {
            throw new Error(
                `Model "${
                    this.name
                }" is not stored in the database. Use 'Object.assign(${this.name.toLocaleLowerCase()}, ...)' instead.`
            );
        }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        const results: any[] = await update(this.table, ids, values);
        const instances: T[] = results.map(
            (res: any): T => {
                const instance = this.find(
                    (instance: T) => instance.id === res.id
                );
                for (const key in values) {
                    instance![<keyof T>key] = values[key];
                }
                return instance!;
            }
        );
        return instances;
    }

    public static all<T extends Model>(): T[] {
        return Model.instances[this.name];
    }

    public static filter<T extends Model>(
        callbackfn: (object: T, index: number) => boolean
    ): T[] {
        return Model.instances[this.name].filter(callbackfn);
    }

    public static find<T extends Model>(
        predicate: (object: T, index: number) => boolean
    ): T | null {
        return Model.instances[this.name].find(predicate);
    }

    public static each<T extends Model>(
        callbackfn: (object: T, index: number) => any
    ): void {
        return Model.instances[this.name].forEach(callbackfn);
    }

    public static map<T extends Model>(
        callbackfn: (object: T, index: number) => any
    ): any[] {
        return Model.instances[this.name].map(callbackfn);
    }

    public static sort<T extends Model>(
        comparefn: (object: T, index: number) => number
    ): T[] {
        return Model.instances[this.name].sort(comparefn);
    }
}

export default Model;
