import { Client, QueryResult, QueryResultRow } from "pg";
import {
  CharFieldOptions,
  Dictionnary,
  FieldDescriptor,
  FieldOptions,
  FieldStructure,
} from "../typings";
import { error, groupBy, log, warn } from "../utils";

export const config: Dictionnary<any> = {};

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
 * @todo: doc
 */
const registeredTables: Dictionnary<FieldDescriptor[]> = {};

//=============================================================================
// Helpers
//=============================================================================

/**
 * Builds a field column query from the information of a field descriptor.
 * @param field
 */
function buildFieldQuery({
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

/**
 * Converts a snake_string to a camelString.
 * @param snake
 */
function dbToJsKey(snake: string): string {
  return snake.replace(/_(\w)/g, (_, nextChar) => nextChar.toUpperCase());
}

function dbToJsValue(dbVal: any): any {
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
 * Ensures one of two things:
 * 1. if `mustHaveClient` is true: a client instance is ensured and will be
 *    returned. An error will be thrown if no client exists.
 * 2. if `mustHaveClient` is false: a new client instance will be instantiated
 *    and returned. An error will be thrown if a client already exists.
 * @param method
 * @param mustHaveClient
 */
function ensureClient(method: string, mustHaveClient: boolean = true): Client {
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
 * Used to convert arrays into serializable strings for the database.
 * @param values
 */
function formatValues(values: Dictionnary<any>) {
  const formattedValues: Dictionnary<any> = {};
  for (const jsKey in values) {
    formattedValues[jsToDbKey(jsKey)] = jsToDbValue(values[jsKey]);
  }
  return formattedValues;
}

/**
 * Converts a camelString to a snake_string.
 * @param camel
 */
function jsToDbKey(camel: string): string {
  return camel.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

function jsToDbValue(jsVal: any): any {
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
function parseResult({ rows }: QueryResult): Dictionnary<any>[] {
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
function sanitize(table: string): string {
  return table.replace(/[^\w\.\-]/g, "");
}

//=============================================================================
// Database fields
//=============================================================================

function boolean(
  name: string,
  { defaultValue }: FieldOptions<boolean> = {}
): FieldDescriptor {
  const defVal = Boolean(defaultValue);
  return {
    name,
    type: "BOOLEAN",
    defaultValue: defVal,
    nullable: false,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "boolean",
      isNullable: "NO",
      columnDefault: String(defVal),
    },
  };
}

function char(
  name: string,
  { length, nullable, defaultValue }: CharFieldOptions
): FieldDescriptor {
  const defVal = defaultValue || null;
  return {
    name,
    type: "CHAR",
    defaultValue: defVal,
    nullable,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "character",
      characterMaximumLength: length,
      isNullable: nullable ? "YES" : "NO",
      columnDefault: jsToDbValue(defVal),
    },
  };
}

function serial(name: string): FieldDescriptor {
  return {
    name,
    type: "SERIAL",
    defaultValue: null,
    nullable: false,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "integer",
      isNullable: "NO",
    },
  };
}

function snowflake(name: string, nullable?: boolean): FieldDescriptor {
  return char(name, { length: 18, nullable });
}

function timestamp(name: string): FieldDescriptor {
  return {
    name,
    type: "TIMESTAMPTZ",
    defaultValue: "CURRENT_TIMESTAMP",
    nullable: false,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "timestamp with time zone",
      isNullable: "NO",
    },
  };
}

function varchar(
  name: string,
  { length, nullable, defaultValue }: CharFieldOptions
): FieldDescriptor {
  const defVal = defaultValue || null;
  return {
    name,
    type: "VARCHAR",
    defaultValue: defVal,
    nullable,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "character varying",
      characterMaximumLength: length,
      isNullable: nullable ? "YES" : "NO",
      columnDefault: defVal && `'${jsToDbValue(defVal)}'::character varying`,
    },
  };
}

export const fields = {
  boolean,
  char,
  serial,
  snowflake,
  timestamp,
  varchar,
};

/**
 * Configuration table.
 */
const configTableName = registerTable("config", [
  fields.varchar("prefix", { length: 32, defaultValue: "$" }),
  fields.snowflake("ownerId"),
  fields.varchar("devIds", { length: 1000 }),
]);

//=============================================================================
// Database connection
//=============================================================================

async function adjustDatabase(): Promise<void> {
  const client = ensureClient("adjustDatabase");
  const dbColumns = await read("information_schema.columns", {
    tableSchema: "public",
  });
  const dbTables = groupBy(dbColumns, "tableName");
  const adjustments: string[] = [];
  const tasks: Promise<any>[] = [];

  // Excess tables
  for (const tableName in dbTables) {
    if (!(tableName in registeredTables)) {
      tasks.push(client.query(`DROP TABLE ${sanitize(tableName)}`));
      adjustments.push(`dropped table "${tableName}"`);
      delete dbTables[tableName];
    }
  }

  // Missing tables
  for (const tableName in registeredTables) {
    if (!(tableName in dbTables)) {
      const columns = registeredTables[tableName];
      const hasIdField = columns.some(({ name }) => name === "id");
      const query = `CREATE TABLE ${sanitize(tableName)} (${columns
        .map(buildFieldQuery)
        .join(", ")}${hasIdField ? ", PRIMARY KEY(id)" : ""});`;
      tasks.push(client.query(query));
      adjustments.push(
        `created table "${tableName}" (${columns.length} columns)`
      );
    }
  }

  // Existing tables: check columns
  for (const tableName in dbTables) {
    const dbTable = dbTables[tableName];
    const refTable = registeredTables[tableName];
    const existingColumns: [any, FieldDescriptor][] = [];

    // Excess columns
    for (const dbCol of dbTable) {
      const refColumn = refTable.find(
        (refCol) => refCol.structure.columnName === dbCol.columnName
      );
      if (refColumn) {
        existingColumns.push([dbCol, refColumn]);
      } else {
        tasks.push(
          client.query(
            `ALTER TABLE ${sanitize(tableName)} DROP COLUMN ${
              dbCol.columnName
            };`
          )
        );
        adjustments.push(
          `dropped column "${dbCol.columnName}" from table "${tableName}"`
        );
      }
    }

    // Missing columns
    for (const refCol of refTable) {
      if (
        !dbTable.some(
          (dbCol) => dbCol.columnName === refCol.structure.columnName
        )
      ) {
        tasks.push(
          client.query(
            `ALTER TABLE ${sanitize(tableName)} ADD COLUMN ${buildFieldQuery(
              refCol
            )};`
          )
        );
        adjustments.push(
          `added column "${refCol.structure.columnName}" into table "${tableName}"`
        );
      }
    }

    // Existing columns
    for (const [dbCol, field] of existingColumns) {
      const mismatch = Object.keys(field.structure).some(
        (k) => field.structure[k as keyof FieldStructure] !== dbCol[k]
      );
      if (mismatch) {
        tasks.push(
          client.query(
            `ALTER TABLE ${sanitize(tableName)} DROP COLUMN ${
              dbCol.columnName
            };`
          ),
          client.query(
            `ALTER TABLE ${sanitize(tableName)} ADD COLUMN ${buildFieldQuery(
              field
            )};`
          )
        );
        adjustments.push(
          `replaced column "${dbCol.columnName}" with "${field.structure.columnName}" in table "${tableName}"`
        );
      }
    }
  }

  await Promise.all(tasks);
  if (adjustments.length) {
    warn(
      `The following database adjustments have been performed:\n${adjustments
        .map((a) => `> ${a}`)
        .join("\n")}`
    );
  } else {
    log("Database is compliant with the models definition");
  }
}

/**
 * Loads and returns the configuration variables from the database.
 */
async function loadConfig(): Promise<Dictionnary<any>> {
  const [dbConfig] = await read(configTableName);
  for (const col in dbConfig) {
    config[col] = dbConfig[col];
  }
  log(`Configuration loaded: prefix is "${config.prefix}"`);
  return config;
}

export async function connect(): Promise<void> {
  const client = ensureClient("connect", false);
  try {
    await client.connect();
  } catch (err) {
    error(err.stack);
    return;
  }
  await adjustDatabase();
  await loadConfig();
}

export async function disconnect(): Promise<void> {
  const client = ensureClient("disconnect");
  try {
    await client.end();
    clientInstance = null;
  } catch (err) {
    error(err.stack);
  }
}

/**
 * @param tableName
 * @param columns
 */
export function registerTable(
  tableName: string,
  columns: FieldDescriptor[]
): string {
  if (tableName !== sanitize(tableName)) {
    throw new Error(`Incorrect table name: "${tableName}"`);
  }
  if (tableName in registeredTables) {
    throw new Error(`Table with name "${tableName}" already exists.`);
  }
  for (const { name } of columns) {
    if (name !== sanitize(name)) {
      throw new Error(
        `Incorrect column name: "${name}" in table "${tableName}"`
      );
    }
  }
  registeredTables[tableName] = columns;
  return tableName;
}

//=============================================================================
// Database queries
//=============================================================================

export async function count(
  table: string,
  where?: Dictionnary<any>
): Promise<QueryResultRow[]> {
  const client = ensureClient("count");
  const queryArray: string[] = [`SELECT COUNT(*) FROM ${sanitize(table)}`];
  const variables: string[] = [];
  let varCount: number = 0;

  if (where && Object.keys(where).length) {
    const whereString = [];
    for (const jsKey in where) {
      const key = jsToDbKey(jsKey);
      const value = where[jsKey];
      if (Array.isArray(value)) {
        const values = value.map(() => `$${++varCount}`);
        whereString.push(`${key} IN (${values})`);
        variables.push(...value);
      } else if (typeof key === "string") {
        whereString.push(`${key} = $${++varCount}`);
        variables.push(value);
      }
    }
    queryArray.push("WHERE", whereString.join(" AND "));
  }

  const query = queryArray.join(" ") + ";";
  try {
    const result = await client.query(query, variables);
    return result.rows;
  } catch (err) {
    error(err.stack);
    return [];
  }
}

export async function create(
  table: string,
  ...allValues: Dictionnary<any>[]
): Promise<QueryResultRow[]> {
  const client = ensureClient("create");
  const queryArray: string[] = ["INSERT INTO", sanitize(table)];
  const variables: string[] = [];
  const allFormattedValues = allValues.map(formatValues);
  let varCount: number = 0;

  // column names should come from Model and should be safe to use.
  const columnNames = Object.keys(allFormattedValues[0]);
  queryArray.push(`(${columnNames.join()}) VALUES`);

  const queryValues: string[] = [];
  for (const values of allFormattedValues) {
    queryValues.push(
      `(${Object.values(values)
        .map(() => `$${++varCount}`)
        .join()})`
    );
    variables.push(...Object.values(values));
  }
  queryArray.push(queryValues.join(), "RETURNING *");

  const query = queryArray.join(" ") + ";";
  try {
    const result = await client.query(query, variables);
    log(`${result.rows.length} record(s) of type "${table}" created.`);
    return parseResult(result);
  } catch (err) {
    error(err.stack);
    return [];
  }
}

export async function read(
  table: string,
  where?: Dictionnary<any>,
  fields?: string[]
): Promise<QueryResultRow[]> {
  const client = ensureClient("read");
  const queryArray: string[] = ["SELECT"];
  const variables: string[] = [];
  let varCount: number = 0;

  if (fields) {
    if (!fields.includes("id")) {
      fields.unshift("id");
    }
    queryArray.push(fields.map(() => `$${++varCount}`).join());
    variables.push(...fields);
  } else {
    queryArray.push("*");
  }

  queryArray.push(`FROM ${sanitize(table)}`);

  if (where && Object.keys(where).length) {
    const whereString = [];
    for (const jsKey in where) {
      const key = jsToDbKey(jsKey);
      const value = where[jsKey];
      if (Array.isArray(value)) {
        const values = value.map(() => `$${++varCount}`);
        whereString.push(`${key} IN (${values})`);
        variables.push(...value);
      } else if (typeof key === "string") {
        whereString.push(`${key} = $${++varCount}`);
        variables.push(value);
      }
    }
    queryArray.push("WHERE", whereString.join(" AND "));
  }

  const query = queryArray.join(" ") + ";";
  try {
    const result = await client.query(query, variables);
    return parseResult(result);
  } catch (err) {
    error(err.stack);
    return [];
  }
}

export async function remove(
  table: string,
  where: Dictionnary<any>
): Promise<QueryResultRow[]> {
  const client = ensureClient("remove");
  const queryArray: string[] = ["DELETE FROM", sanitize(table)];
  const variables: number[] = [];
  let varCount = 0;

  const whereString = [];
  for (const jsKey in where) {
    const key = jsToDbKey(jsKey);
    const value = where[jsKey];
    if (Array.isArray(value)) {
      const values = value.map(() => `$${++varCount}`);
      whereString.push(`${key} IN (${values})`);
      variables.push(...value);
    } else if (typeof key === "string") {
      whereString.push(`${key} = $${++varCount}`);
      variables.push(value);
    }
  }
  queryArray.push("WHERE", whereString.join(" AND "), "RETURNING *");

  const query = queryArray.join(" ") + ";";
  try {
    const result = await client.query(query, variables);
    log(`${result.rows.length} record(s) of type "${table}" removed.`);
    return parseResult(result);
  } catch (err) {
    error(err.stack);
    return [];
  }
}

export async function update(
  table: string,
  where: Dictionnary<any>,
  values: Dictionnary<any>
): Promise<QueryResultRow[]> {
  const client = ensureClient("update");
  const queryArray = ["UPDATE", sanitize(table), "SET"];
  const variables = [];
  let varCount = 0;

  const valuesArray: string[] = [];
  const formattedValues = formatValues(values);
  for (let fieldName in formattedValues) {
    valuesArray.push(`${fieldName}=$${++varCount}`);
    variables.push(formattedValues[fieldName]);
  }
  queryArray.push(valuesArray.join());

  const whereString = [];
  for (const jsKey in where) {
    const key = jsToDbKey(jsKey);
    const value = where[jsKey];
    if (Array.isArray(value)) {
      const values = value.map(() => `$${++varCount}`);
      whereString.push(`${key} IN (${values})`);
      variables.push(...value);
    } else if (typeof key === "string") {
      whereString.push(`${key} = $${++varCount}`);
      variables.push(value);
    }
  }
  queryArray.push("WHERE", whereString.join(" AND "), "RETURNING *");

  const query = queryArray.join(" ") + ";";
  try {
    const result = await client.query(query, variables);
    log(`${result.rows.length} record(s) of type "${table}" updated.`);
    return parseResult(result);
  } catch (err) {
    error(err.stack);
    return [];
  }
}
