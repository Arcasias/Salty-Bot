import { Client, QueryResult, QueryResultRow } from "pg";
import { debug, error, log } from "../utils";

export type FieldsValues = { [field: string]: any };

let client: Client;

function _sanitizeTable(table: string): string {
    return table.toLowerCase().replace(/[^a-z_]/g, "");
}

async function connect(): Promise<void> {
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
        error(err);
    }
}

async function disconnect(): Promise<void> {
    try {
        await client.end();
    } catch (err) {
        error(err);
    }
}

async function create(
    table: string,
    ...allValues: FieldsValues[]
): Promise<QueryResultRow[]> {
    const queryString: string[] = ["INSERT INTO", _sanitizeTable(table)];
    const variables: string[] = [];
    let varCount: number = 0;

    // column names should come from Model and should be safe to use.
    queryString.push(`(${Object.keys(allValues[0]).join()}) VALUES`);

    const allFormattedValues: string[] = [];
    allValues.forEach((values: FieldsValues) => {
        allFormattedValues.push(
            `(${Object.values(values)
                .map(() => `$${++varCount}`)
                .join()})`
        );
        variables.push(...Object.values(values));
    });
    queryString.push(allFormattedValues.join());
    queryString.push("RETURNING *;");

    debug({ query: queryString.join(" ") }, variables);

    const result: QueryResult = await client.query(
        queryString.join(" "),
        variables
    );
    log(`${result.rows.length} record(s) of type "${table}" created.`);
    return result.rows;
}

async function remove(
    table: string,
    ids: number | number[]
): Promise<QueryResultRow[]> {
    const queryString: string[] = ["DELETE FROM", _sanitizeTable(table)];
    const variables: number[] = [];
    let varCount = 0;

    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    queryString.push(
        `WHERE id IN (${ids.map(() => `$${++varCount}`)}) RETURNING *;`
    );
    variables.push(...ids);

    debug({ query: queryString.join(" ") }, variables);

    const result: QueryResult = await client.query(
        queryString.join(" "),
        variables
    );
    log(`${result.rows.length} record(s) of type "${table}" removed.`);
    return result.rows;
}

async function read(
    table: string,
    ids?: string | string[],
    fields?: string[]
): Promise<QueryResultRow[]> {
    const queryString: string[] = ["SELECT"];
    const variables: string[] = [];
    let varCount: number = 0;

    if (fields) {
        if (!fields.includes("id")) {
            fields.unshift("id");
        }
        queryString.push(fields.map(() => `$${++varCount}`).join());
        variables.push(...fields);
    } else {
        queryString.push("*");
    }

    queryString.push(`FROM ${_sanitizeTable(table)}`);

    if (ids) {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        queryString.push(`WHERE id IN (${ids.map(() => `$${++varCount}`)});`);
        variables.push(...ids);
    }

    debug({ query: queryString.join(" ") }, variables);

    const result: QueryResult = await client.query(
        queryString.join(" "),
        variables
    );
    return result.rows;
}

async function update(
    table: string,
    ids: number | number[],
    values: FieldsValues
): Promise<QueryResultRow[]> {
    const queryString = ["UPDATE", _sanitizeTable(table), "SET"];
    const variables = [];
    let varCount = 0;

    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    const valuesArray: string[] = [];
    for (let fieldName in values) {
        valuesArray.push(`${fieldName}=$${++varCount}`);
        variables.push(values[fieldName]);
    }

    queryString.push(valuesArray.join());
    queryString.push(
        `WHERE id IN (${ids.map(() => `$${++varCount}`)}) RETURNING *;`
    );
    variables.push(...ids);

    debug({ query: queryString.join(" ") }, variables);

    const result: QueryResult = await client.query(
        queryString.join(" "),
        variables
    );
    log(`${result.rows.length} record(s) of type "${table}" updated.`);
    return result.rows;
}

export default {
    connect,
    create,
    disconnect,
    remove,
    read,
    update,
};
