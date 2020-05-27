import { Client, QueryResult, QueryResultRow } from "pg";
import { FieldsDescriptor } from "../types";
import { debug, error, log } from "../utils";

const SEPARATOR = "//";
const SEPARATOR_REGEX = new RegExp(SEPARATOR);
let client: Client;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

function formatValues(values: FieldsDescriptor) {
    for (const key in values) {
        if (Array.isArray(values[key])) {
            values[key] = values[key].join(SEPARATOR);
        }
    }
    return values;
}

function parseResult({ rows }: QueryResult) {
    for (const row of rows) {
        for (const key in row) {
            if (
                typeof row[key] === "string" &&
                SEPARATOR_REGEX.test(row[key])
            ) {
                row[key] = row[key].split(SEPARATOR);
            }
        }
    }
    return rows;
}

function sanitizeTable(table: string): string {
    return table.toLowerCase().replace(/[^a-z_]/g, "");
}

//-----------------------------------------------------------------------------
// Exported
//-----------------------------------------------------------------------------

export async function connect(): Promise<void> {
    if (!client) {
        client = new Client({
            database: process.env.DATABASE_DATABASE,
            host: process.env.DATABASE_HOST,
            password: process.env.DATABASE_PASSWORD,
            port: Number(process.env.DATABASE_PORT),
            user: process.env.DATABASE_USER,
            ssl: { rejectUnauthorized: false },
        });
    }
    try {
        await client.connect();
    } catch (err) {
        error(err.stack);
    }
}

export async function disconnect(): Promise<void> {
    try {
        await client.end();
    } catch (err) {
        error(err.stack);
    }
}

export async function create(
    table: string,
    ...allValues: FieldsDescriptor[]
): Promise<QueryResultRow[]> {
    const queryArray: string[] = ["INSERT INTO", sanitizeTable(table)];
    const variables: string[] = [];
    let varCount: number = 0;

    // column names should come from Model and should be safe to use.
    queryArray.push(`(${Object.keys(allValues[0]).join()}) VALUES`);

    const allFormattedValues: string[] = [];
    allValues.forEach((values: FieldsDescriptor) => {
        const formattedValues = formatValues(values);
        allFormattedValues.push(
            `(${Object.values(formattedValues)
                .map(() => `$${++varCount}`)
                .join()})`
        );
        variables.push(...Object.values(formattedValues));
    });
    queryArray.push(allFormattedValues.join());
    queryArray.push("RETURNING *");

    console.log({ variables: variables.join() });

    const query = queryArray.join(" ") + ";";
    debug({ query }, variables);

    try {
        return [];
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
    ids: number | number[]
): Promise<QueryResultRow[]> {
    const queryArray: string[] = ["DELETE FROM", sanitizeTable(table)];
    const variables: number[] = [];
    let varCount = 0;

    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    queryArray.push(
        `WHERE id IN (${ids.map(() => `$${++varCount}`)}) RETURNING *;`
    );
    variables.push(...ids);

    const query = queryArray.join(" ") + ";";
    debug({ query }, variables);

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
    where?: { [key: string]: any },
    fields?: string[]
): Promise<QueryResultRow[]> {
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

    queryArray.push(`FROM ${sanitizeTable(table)}`);

    if (where) {
        const whereString = [];
        for (const key in where) {
            if (Array.isArray(where[key])) {
                const values = where[key].map(() => `$${++varCount}`);
                whereString.push(`${key} IN (${values})`);
                variables.push(...where[key]);
            } else if (typeof key === "string") {
                whereString.push(`${key} = $${++varCount}`);
                variables.push(where[key]);
            }
        }
        queryArray.push("WHERE", whereString.join(" AND "));
    }

    const query = queryArray.join(" ") + ";";
    debug({ query }, variables);

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
    ids: number | number[],
    values: FieldsDescriptor
): Promise<QueryResultRow[]> {
    const queryArray = ["UPDATE", sanitizeTable(table), "SET"];
    const variables = [];
    let varCount = 0;

    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    const valuesArray: string[] = [];
    const formattedValues = formatValues(values);
    for (let fieldName in formattedValues) {
        valuesArray.push(`${fieldName}=$${++varCount}`);
        variables.push(formattedValues[fieldName]);
    }

    queryArray.push(valuesArray.join());
    queryArray.push(
        `WHERE id IN (${ids.map(() => `$${++varCount}`)}) RETURNING *;`
    );
    variables.push(...ids);

    const query = queryArray.join(" ") + ";";
    debug({ query }, variables);

    try {
        const result = await client.query(query, variables);
        log(`${result.rows.length} record(s) of type "${table}" updated.`);
        return result.rows;
    } catch (err) {
        error(err.stack);
        return [];
    }
}
