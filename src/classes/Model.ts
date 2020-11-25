import { QueryResultRow } from "pg";
import { Dictionnary, FieldsDescriptor } from "../types";
import { count, create, read, remove, update } from "./Database";

const CACHE_LIMIT = 1000;
const MODEL_CACHE: Dictionnary<Dictionnary<QueryResultRow[]>> = {};

export default class Model {
  public id!: number;

  public static readonly fields: FieldsDescriptor = {};
  public static readonly table: string;

  constructor(values: FieldsDescriptor = {}) {
    const { name, fields } = this.constructor as typeof Model;

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

  //===========================================================================
  // Static
  //===========================================================================

  public static async search<T extends Model>(
    idsOrWhere: number | number[] | Dictionnary<any> = {}
  ): Promise<T[]> {
    this.__ensureTable();
    let where: Dictionnary<any> | undefined;
    if (typeof idsOrWhere === "number" || Array.isArray(idsOrWhere)) {
      where = { id: idsOrWhere };
    } else if (typeof idsOrWhere === "object" && idsOrWhere !== null) {
      where = idsOrWhere;
    }
    const results = await this.__cache(read, this.table, where);
    return results.map((values: FieldsDescriptor) => <T>new this(values));
  }

  public static async count(
    idsOrWhere?: number | number[] | Dictionnary<any>
  ): Promise<number> {
    this.__ensureTable();
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
    ...allValues: FieldsDescriptor[]
  ): Promise<T[]> {
    this.__ensureTable();
    this.__ensureContent(allValues, "create", "values");
    this.__invalidateCache();
    const defaultValues = allValues.map((values) =>
      Object.assign({}, this.fields, values)
    );
    const results: FieldsDescriptor[] = await create(
      this.table,
      ...defaultValues
    );
    const models = results.map((values) => <T>new this(values));
    return models;
  }

  /**
   * Destroys the records linked to the given ids.
   */
  static async remove<T extends Model>(
    idsOrWhere: number | number[] | Dictionnary<any>
  ): Promise<T[]> {
    this.__ensureTable();
    this.__ensureContent(idsOrWhere, "remove", "id | ids | where");
    this.__invalidateCache();
    let where: Dictionnary<any>;
    if (typeof idsOrWhere === "number" || Array.isArray(idsOrWhere)) {
      where = { id: idsOrWhere };
    } else {
      where = idsOrWhere;
    }
    const results = await remove(this.table, where);
    return results.map((r) => <T>new this(r));
  }

  /**
   * Writes the given values on all records matching the given ids.
   */
  static async update<T extends Model>(
    idsOrWhere: number | number[] | Dictionnary<any>,
    values: FieldsDescriptor
  ): Promise<T[]> {
    this.__ensureTable();
    this.__ensureContent(idsOrWhere, "update", "id | ids | options");
    this.__ensureContent(values, "update", "values");
    this.__invalidateCache();
    let where: Dictionnary<any>;
    if (typeof idsOrWhere === "number" || Array.isArray(idsOrWhere)) {
      where = { id: idsOrWhere };
    } else {
      where = idsOrWhere;
    }
    const results = await update(this.table, where, values);
    return results.map((r) => <T>new this(r));
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

  private static __ensureTable(): void {
    if (!this.table) {
      throw new Error(`Model "${this.name}" is not stored in the database.`);
    }
  }

  private static __ensureContent(
    object: any,
    method: string,
    param: string
  ): void {
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

  /**
   * To call on an update/deletion on the model to invalidate the current
   * cache.
   */
  private static __invalidateCache(): void {
    MODEL_CACHE[this.name] = {};
  }
}
