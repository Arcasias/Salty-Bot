import { log, title } from "../utils";
import Database from "./Database";

class Model {
    public id: string;
    protected stored: boolean = false;

    protected static instances: object = {};
    protected static fields: object = {};
    protected static readonly table: string;

    constructor(values: any = {}) {
        const name: string = this.constructor.name;
        if (!Model.instances[name]) {
            Model.instances[name] = [];
        }
        Model.instances[name].push(this);

        if (this.stored) {
            this.id = values.id;
            delete values.id;
            for (const key in values) {
                if (!this.hasOwnProperty(key)) {
                    throw new Error(
                        `Invalid key "${key}" given to ${name} instance.`
                    );
                }
                this[key] = values[key];
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

    public static get size(): number {
        return Model.instances[this.name].length;
    }

    /**
     * Returns the list of instances fetched from the attached database table.
     */
    public static async load<M extends Model>(): Promise<M[]> {
        const records: any[] = await Database.read(this.table);
        const instances: Model[] = records.map(
            (values: any): Model => new this(values)
        );
        log(`${title(this.name)} data loaded`);
        return <M[]>instances;
    }

    /**
     * Creates new model instances with the given values (one instance for each
     * value) and returns the list of instantiated objects.
     */
    public static async create<M extends Model>(
        ...allValues: any[]
    ): Promise<M[]> {
        const databaseObjects: any[] = await Database.create(
            this.table,
            ...allValues
        );
        const instances: Model[] = databaseObjects.map(
            (res: any): Model => {
                const instance: Model = new this(res);
                instance.id = res.id;
                return instance;
            }
        );
        return <M[]>instances;
    }

    /**
     * Destroys the instances linked to the given ids.
     */
    static async remove(...ids: string[]): Promise<void> {
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
        ids: string | string[],
        values: any
    ): Promise<M[]> {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        const results: any[] = await Database.update(this.table, ids, values);
        const instances: Model[] = results.map(
            (res: any): Model => {
                const instance: Model = this.find(
                    (instance: Model): boolean => instance.id === res.id
                );
                for (let fieldName in values) {
                    instance[fieldName] = values[fieldName];
                }
                return instance;
            }
        );
        return <M[]>instances;
    }

    //-------------------------------------------------------------------------
    // Array functions applied to all current instances
    //-------------------------------------------------------------------------

    /**
     * @see Array.filter()
     */
    public static filter<M extends Model>(...args: any): M[] {
        return Model.instances[this.name].filter(...args);
    }
    /**
     * @see Array.find()
     */
    public static find<M extends Model>(...args: any): M {
        return Model.instances[this.name].find(...args);
    }
    /**
     * @see Array.forEach()
     */
    public static forEach(...args: any): void {
        return Model.instances[this.name].forEach(...args);
    }
    /**
     * @see Array.map()
     */
    public static map<M extends Model>(...args: any): M[] {
        return Model.instances[this.name].map(...args);
    }
    /**
     * @see Array.reduce()
     */
    public static reduce(...args: any): any {
        return Model.instances[this.name].reduce(...args);
    }
    /**
     * @see Array.sort()
     */
    public static sort<M extends Model>(...args: any): M[] {
        return Model.instances[this.name].sort(...args);
    }
}

export default Model;
