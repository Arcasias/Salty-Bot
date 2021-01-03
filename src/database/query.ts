import { QueryResultRow } from "pg";
import { Dictionnary } from "../typings";
import { error, log } from "../utils/log";
import {
  formatValues,
  getClient,
  jsToDbKey,
  parseResult,
  sanitize,
} from "./helpers";

export async function count(
  table: string,
  where?: Dictionnary<any>
): Promise<QueryResultRow[]> {
  const client = getClient("count");
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
  const client = getClient("create");
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
  const client = getClient("read");
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
  const client = getClient("remove");
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
  const client = getClient("update");
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
