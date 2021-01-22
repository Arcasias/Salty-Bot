import { Client, QueryResult } from "pg";
import { Dictionnary, FieldDescriptor } from "../typings";
import { error } from "../utils/log";
import { adjustDatabase } from "./autoDB";
import { loadConfig } from "./config";

const DB_SEPARATOR: string = "//";
const SEPARATOR_REGEX = new RegExp(`^${DB_SEPARATOR}.*${DB_SEPARATOR}$`);
let clientInstance: Client | null = null;

// The database parameters are extracted from the URL to minimize the amount of
// config variables. We also cannot use `new Client(url)` since we need to give
// the `ssl` parameter which is not in the URL.
const [, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE] =
  process.env.DATABASE_URL?.match(
    /^postgres:\/\/(\w+):([\w]+)@([\w\-\.]+):(\d+)\/([\w]+)$/
  ) || [];

/**
 * Builds a field column query from the information of a field descriptor.
 * @param field
 */
export function buildFieldQuery({
  type,
  defaultValue,
  nullable,
  structure,
}: FieldDescriptor): string {
  let query: string = `${structure.columnName} ${type}`;
  const len = Number(structure.characterMaximumLength);
  if (!isNaN(len)) {
    query += `(${len})`;
  }
  if (!nullable) {
    query += " NOT NULL";
  }
  if (type === "SERIAL") {
    query += " UNIQUE";
  }
  if (defaultValue !== null) {
    const defVal = ["CHAR", "VARCHAR"].includes(type)
      ? `'${jsToDbValue(defaultValue)}'`
      : jsToDbValue(defaultValue);
    query += ` DEFAULT ${defVal}`;
  }
  return query;
}

export async function connect(): Promise<void> {
  const client = getClient("connect", false);
  try {
    await client.connect();
  } catch (err) {
    return error(err.stack);
  }
  await adjustDatabase();
  await loadConfig();
}

export async function disconnect(): Promise<void> {
  const client = getClient("disconnect");
  try {
    await client.end();
    clientInstance = null;
  } catch (err) {
    error(err.stack);
  }
}

/**
 * Converts a snake_string to a camelString.
 * @param snake
 */
export function dbToJsKey(snake: string): string {
  return snake.replace(/_(\w)/g, (_, nextChar) => nextChar.toUpperCase());
}

export function dbToJsValue(dbVal: any): any {
  if (typeof dbVal === "string" && SEPARATOR_REGEX.test(dbVal)) {
    return dbVal
      .slice(DB_SEPARATOR.length, -DB_SEPARATOR.length)
      .split(DB_SEPARATOR)
      .filter((w: string) => Boolean(w.trim()));
  } else {
    return dbVal;
  }
}

/**
 * Used to convert arrays into serializable strings for the database.
 * @param values
 */
export function formatValues(values: Dictionnary<any>) {
  const formattedValues: Dictionnary<any> = {};
  for (const jsKey in values) {
    formattedValues[jsToDbKey(jsKey)] = jsToDbValue(values[jsKey]);
  }
  return formattedValues;
}

/**
 * Ensures one of two things:
 * 1. if `mustHaveClient` is true: a client instance is ensured and will be
 *    returned. An error will be thrown if no client exists.
 * 2. if `mustHaveClient` is false: a new client instance will be instantiated
 *    and returned. An error will be thrown if a client already exists.
 * @param method
 * @param mustHaveClient
 */
export function getClient(
  method: string,
  mustHaveClient: boolean = true
): Client {
  if (mustHaveClient) {
    if (!clientInstance) {
      throw new Error(
        `Could not perform action "${method}": client is not connected`
      );
    }
  } else {
    if (clientInstance) {
      throw new Error(
        `Could not perform action "${method}": client is already connected`
      );
    }
    clientInstance = new Client({
      database: DB_DATABASE,
      host: DB_HOST,
      password: DB_PASSWORD,
      port: Number(DB_PORT),
      user: DB_USER,
      ssl: { rejectUnauthorized: false },
    });
  }
  return clientInstance;
}

/**
 * Converts a camelString to a snake_string.
 * @param camel
 */
export function jsToDbKey(camel: string): string {
  return camel.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

export function jsToDbValue(jsVal: any): any {
  if (Array.isArray(jsVal)) {
    return DB_SEPARATOR + jsVal.join(DB_SEPARATOR) + DB_SEPARATOR;
  } else {
    return jsVal;
  }
}

/**
 * Used to convert database strings into arrays when the config
 * seperator is found.
 * @param result
 */
export function parseResult({ rows }: QueryResult): Dictionnary<any>[] {
  const parsedRows: Dictionnary<any>[] = [];
  for (const row of rows) {
    const parsedRow: Dictionnary<any> = {};
    for (const dbKey in row) {
      parsedRow[dbToJsKey(dbKey)] = dbToJsValue(row[dbKey]);
    }
    parsedRows.push(parsedRow);
  }
  return parsedRows;
}

/**
 * Ensures that a given name is only composed of:
 * > letters
 * > numbers
 * > underscores and dashes
 * > dots
 */
export function sanitize(table: string): string {
  return table.replace(/[^\w\.\-]/g, "");
}
