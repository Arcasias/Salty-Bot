import { Client, QueryResult, QueryResultRow } from "pg";
import { separator } from "../strings";
import {
  CharFieldOptions,
  Dictionnary,
  FieldDescriptor,
  FieldOptions,
  FieldStructure,
} from "../typings";
import { error, log, warn } from "../utils";

const SEPARATOR_REGEX = new RegExp(`^${separator}.*${separator}$`);
let clientInstance: Client | null = null;

// The database parameters are extracted from the URL to minimize the amount of
// config variables. We also cannot use `new Client(url)` since we need to give
// the `ssl` parameter which is not in the URL.
const [
  ,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
] = process.env.DATABASE_URL!.match(
  /^postgres:\/\/(\w+):([\w]+)@([\w\-\.]+):(\d+)\/([\w]+)$/
)!;

//=============================================================================
// Helpers
//=============================================================================

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
    query += ` DEFAULT ${defaultValue}`;
  }
  return query;
}

/**
 * Converts a camelString to a snake_string.
 * @param camel
 */
function camelToSnake(camel: string): string {
  return camel.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
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
    const key = camelToSnake(jsKey);
    const value = values[jsKey];
    if (Array.isArray(value)) {
      formattedValues[key] = separator + value.join(separator) + separator;
    } else {
      formattedValues[key] = value;
    }
  }
  return formattedValues;
}

/**
 * Used to convert database strings into arrays when the config
 * seperator is found.
 * @param result
 */
function parseResult({ rows }: QueryResult) {
  const parsedRows: Dictionnary<any>[] = [];
  for (const row of rows) {
    const parsedRow: Dictionnary<any> = {};
    for (const dbKey in row) {
      const key = snakeToCamel(dbKey);
      const value = row[dbKey];
      if (typeof value === "string" && SEPARATOR_REGEX.test(value)) {
        parsedRow[key] = value
          .slice(separator.length, -separator.length)
          .split(separator)
          .filter((w: string) => Boolean(w.trim()));
      } else {
        parsedRow[key] = value;
      }
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

/**
 * Converts a snake_string to a camelString.
 * @param snake
 */
function snakeToCamel(snake: string): string {
  return snake.replace(/_(\w)/g, (_, nextChar) => nextChar.toUpperCase());
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
      columnName: camelToSnake(name),
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
      columnName: camelToSnake(name),
      dataType: "character",
      characterMaximumLength: length,
      isNullable: nullable ? "YES" : "NO",
      columnDefault: defVal,
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
      columnName: camelToSnake(name),
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
      columnName: camelToSnake(name),
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
      columnName: camelToSnake(name),
      dataType: "character varying",
      characterMaximumLength: length,
      isNullable: nullable ? "YES" : "NO",
      columnDefault: defVal,
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

//=============================================================================
// Database connection
//=============================================================================

export async function connect(): Promise<void> {
  const client = ensureClient("connect", false);
  try {
    await client.connect();
  } catch (err) {
    error(err.stack);
  }
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

//=============================================================================
// Database adjustments
//=============================================================================

export async function adjustDatabase(
  tables: Dictionnary<FieldDescriptor[]>
): Promise<void> {
  // Check given tables
  for (const tableName in tables) {
    if (tableName !== sanitize(tableName)) {
      throw new Error(`Incorrect table name: "${tableName}"`);
    }
    for (const column of tables[tableName]) {
      if (column.name !== sanitize(column.name)) {
        throw new Error(
          `Incorrect column name: "${column.name}" in table "${tableName}"`
        );
      }
    }
  }
  const client = ensureClient("adjustDatabase");
  const dbColumns = await read("information_schema.columns", {
    tableSchema: "public",
  });
  const dbTables: Dictionnary<QueryResultRow[]> = {};
  const adjustments: string[] = [];
  const tasks: Promise<any>[] = [];

  for (const column of dbColumns) {
    if (!dbTables[column.tableName]) {
      dbTables[column.tableName] = [];
    }
    dbTables[column.tableName].push(column);
  }

  // Excess tables
  for (const tableName in dbTables) {
    if (!(tableName in tables)) {
      tasks.push(client.query(`DROP TABLE ${sanitize(tableName)}`));
      adjustments.push(`dropped table "${tableName}"`);
      delete dbTables[tableName];
    }
  }

  // Missing tables
  for (const tableName in tables) {
    if (!(tableName in dbTables)) {
      tasks.push(
        client.query(
          `CREATE TABLE ${sanitize(tableName)} (${tables[tableName]
            .map(buildFieldQuery)
            .join(", ")}, PRIMARY KEY(id));`
        )
      );
      adjustments.push(
        `created table "${tableName}" (${tables[tableName].length} columns)`
      );
    }
  }

  // Existing tables: check columns
  for (const tableName in dbTables) {
    const dbTable = dbTables[tableName];
    const refTable = tables[tableName];
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
      const key = camelToSnake(jsKey);
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
    const key = camelToSnake(jsKey);
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
      const key = camelToSnake(jsKey);
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
    const key = camelToSnake(jsKey);
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
