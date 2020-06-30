import { Client, QueryResult, QueryResultRow } from "pg";
import { separator } from "../config";
import { Dictionnary, FieldsDescriptor } from "../types";
import { error, log } from "../utils";

const SEPARATOR_REGEX = new RegExp(`^${separator}.*${separator}$`);
let clientInstance: Client | null = null;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

function ensureClient(method: string): Client {
    if (!clientInstance) {
        throw new Error(
            `Could not perform action "${method}": client is not connected`
        );
    }
    return clientInstance;
}

function formatValues(values: FieldsDescriptor) {
    for (const key in values) {
        if (Array.isArray(values[key])) {
            values[key] = separator + values[key].join(separator) + separator;
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
                row[key] = row[key]
                    .slice(separator.length, -separator.length)
                    .split(separator)
                    .filter((w: string) => Boolean(w.trim()));
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
    if (clientInstance) {
        throw new Error(`Could not client: client is already connected`);
    }
    clientInstance = new Client({
        database: process.env.DATABASE_DATABASE,
        host: process.env.DATABASE_HOST,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        ssl: { rejectUnauthorized: false },
    });
    try {
        await clientInstance.connect();
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

export async function count(
    table: string,
    where?: Dictionnary<any>
): Promise<QueryResultRow[]> {
    const client = ensureClient("count");
    const queryArray: string[] = [
        `SELECT COUNT(*) FROM ${sanitizeTable(table)}`,
    ];
    const variables: string[] = [];
    let varCount: number = 0;

    if (where && Object.keys(where).length) {
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
    ...allValues: FieldsDescriptor[]
): Promise<QueryResultRow[]> {
    const client = ensureClient("create");
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
    queryArray.push(allFormattedValues.join(), "RETURNING *");

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
    const queryArray: string[] = ["DELETE FROM", sanitizeTable(table)];
    const variables: number[] = [];
    let varCount = 0;

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

    queryArray.push(`FROM ${sanitizeTable(table)}`);

    if (where && Object.keys(where).length) {
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
    values: FieldsDescriptor
): Promise<QueryResultRow[]> {
    const client = ensureClient("update");
    const queryArray = ["UPDATE", sanitizeTable(table), "SET"];
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
