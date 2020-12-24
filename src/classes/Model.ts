import { QueryResultRow } from "pg";
import { Dictionnary, FieldDescriptor } from "../typings";
import {
  count,
  create,
  fields,
  read,
  registerTable,
  remove,
  update,
} from "./Database";

const AUTO_FILLED_COLUMNS = [
  fields.serial("id"),
  fields.timestamp("createdAt"),
];
const CACHE_LIMIT = 1000;
const MODEL_CACHE: Dictionnary<Dictionnary<QueryResultRow[]>> = {};

function ensureContent(object: any, method: string, param: string): void {
  let hasContent: boolean;
  if (Array.isArray(object)) {
    hasContent = Boolean(object.length);
  } else if (typeof object === "object" && object !== null) {
    hasContent = Boolean(Object.keys(object).length);
  } else {
    hasContent = Boolean(object);
  }
  if (!hasContent) {
    throw new Error(`Param "${param}" of method "${method}" is empty`);
  }
}

export default class Model {
  public id!: number;
  public createdAt!: number;

  public static fields: FieldDescriptor[];
  public static table: string;

  constructor(values: Dictionnary<any> = {}) {
    const constructor = this.constructor as typeof Model;
    for (const { name, nullable, defaultValue } of constructor.fields) {
      const key = name as keyof Model;
      if (!nullable && values[key] === null && defaultValue === null) {
        throw new Error(
          `Missing field "${key}" on stored model ${constructor.name}.`
        );
      }
      this[key] = key in values ? values[key] : defaultValue;
    }
  }

  //===========================================================================
  // Static
  //===========================================================================

  public static async search<T extends Model>(
    idsOrWhere: number | number[] | Dictionnary<any> = {}
  ): Promise<T[]> {
    let where: Dictionnary<any> | undefined;
    if (typeof idsOrWhere === "number" || Array.isArray(idsOrWhere)) {
      where = { id: idsOrWhere };
    } else if (typeof idsOrWhere === "object" && idsOrWhere !== null) {
      where = idsOrWhere;
    }
    const results = await this.__cache(read, this.table, where);
    return results.map((values: Dictionnary<any>) => new this(values) as T);
  }

  public static async count(
    idsOrWhere?: number | number[] | Dictionnary<any>
  ): Promise<number> {
    let where: Dictionnary<any> | undefined;
    if (typeof idsOrWhere === "number" || Array.isArray(idsOrWhere)) {
      where = { id: idsOrWhere };
    } else if (typeof idsOrWhere === "object" && idsOrWhere !== null) {
      where = idsOrWhere;
    }
    const results = await this.__cache(count, this.table, where);
    return results[0]?.count || 0;
  }

  /**
   * Creates new model instances with the given values (one instance for each
   * value) and returns the list of instantiated objects.
   */
  public static async create<T extends Model>(
    ...allValues: Dictionnary<any>[]
  ): Promise<T[]> {
    ensureContent(allValues, "create", "values");
    this.invalidateCache();
    const allDefaultedValues: Dictionnary<any>[] = allValues.map((vals) => {
      const values: Dictionnary<any> = {};
      for (const { name, defaultValue } of this.fields) {
        if (!AUTO_FILLED_COLUMNS.some((c) => c.name === name)) {
          values[name] = name in vals ? vals[name] : defaultValue;
        }
      }
      return values;
    });
    const results: Dictionnary<any>[] = await create(
      this.table,
      ...allDefaultedValues
    );
    const models = results.map((values) => new this(values) as T);
    return models;
  }

  /**
   * Destroys the records linked to the given ids.
   */
  static async remove<T extends Model>(
    idsOrWhere: number | number[] | Dictionnary<any>
  ): Promise<T[]> {
    ensureContent(idsOrWhere, "remove", "id | ids | where");
    this.invalidateCache();
    let where: Dictionnary<any>;
    if (typeof idsOrWhere === "number" || Array.isArray(idsOrWhere)) {
      where = { id: idsOrWhere };
    } else {
      where = idsOrWhere;
    }
    const results = await remove(this.table, where);
    return results.map((r) => new this(r) as T);
  }

  /**
   * Writes the given values on all records matching the given ids.
   */
  static async update<T extends Model>(
    idsOrWhere: number | number[] | Dictionnary<any>,
    values: Dictionnary<any>
  ): Promise<T[]> {
    ensureContent(idsOrWhere, "update", "id | ids | options");
    ensureContent(values, "update", "values");
    this.invalidateCache();
    let where: Dictionnary<any>;
    if (typeof idsOrWhere === "number" || Array.isArray(idsOrWhere)) {
      where = { id: idsOrWhere };
    } else {
      where = idsOrWhere;
    }
    const results = await update(this.table, where, values);
    return results.map((r) => new this(r) as T);
  }

  public static createTable(table: string, fields: FieldDescriptor[]): string {
    this.fields = [...AUTO_FILLED_COLUMNS, ...fields];
    return registerTable(table, this.fields);
  }

  //===========================================================================
  // Private
  //===========================================================================

  /**
   * Cache calls to a given method having the same arguments.
   * @param dbFunction
   * @param table
   * @param args
   */
  private static async __cache(
    dbFunction: (table: string, ...args: any) => Promise<QueryResultRow[]>,
    table: string,
    ...args: any[]
  ): Promise<QueryResultRow[]> {
    if (!(this.name in MODEL_CACHE)) {
      MODEL_CACHE[this.name] = {};
    }
    const cache = MODEL_CACHE[this.name];
    const cacheKey = JSON.stringify(args);
    if (!(cacheKey in cache)) {
      // Ensures cache doesn't overflow its allowed limit
      while (Object.keys(cache).length >= CACHE_LIMIT) {
        const firstKey = Object.keys(cache).shift()!;
        delete cache[firstKey];
      }
      // Registers the new result at the querried key
      cache[cacheKey] = await dbFunction(table, ...args);
    }
    return JSON.parse(JSON.stringify(cache[cacheKey]));
  }

  /**
   * To call on an update/deletion on the model to invalidate the current
   * cache.
   */
  private static invalidateCache(): void {
    MODEL_CACHE[this.name] = {};
  }
}
