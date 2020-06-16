"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("../config");
const utils_1 = require("../utils");
const SEPARATOR_REGEX = new RegExp(`^${config_1.separator}.*${config_1.separator}$`);
let client = null;
function formatValues(values) {
    for (const key in values) {
        if (Array.isArray(values[key])) {
            values[key] = config_1.separator + values[key].join(config_1.separator) + config_1.separator;
        }
    }
    return values;
}
function parseResult({ rows }) {
    for (const row of rows) {
        for (const key in row) {
            if (typeof row[key] === "string" &&
                SEPARATOR_REGEX.test(row[key])) {
                row[key] = row[key]
                    .slice(config_1.separator.length, -config_1.separator.length)
                    .split(config_1.separator)
                    .filter((w) => Boolean(w.trim()));
            }
        }
    }
    return rows;
}
function sanitizeTable(table) {
    return table.toLowerCase().replace(/[^a-z_]/g, "");
}
async function connect() {
    if (client) {
        throw new Error(`Could not client: client is already connected`);
    }
    client = new pg_1.Client({
        database: process.env.DATABASE_DATABASE,
        host: process.env.DATABASE_HOST,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        ssl: { rejectUnauthorized: false },
    });
    try {
        await client.connect();
    }
    catch (err) {
        utils_1.error(err.stack);
    }
}
exports.connect = connect;
async function disconnect() {
    if (!client) {
        throw new Error(`Could not disconnect client: client is not connected`);
    }
    try {
        await client.end();
        client = null;
    }
    catch (err) {
        utils_1.error(err.stack);
    }
}
exports.disconnect = disconnect;
async function create(table, ...allValues) {
    if (!client) {
        throw new Error(`Could not perform action "create": client is not connected`);
    }
    const queryArray = ["INSERT INTO", sanitizeTable(table)];
    const variables = [];
    let varCount = 0;
    queryArray.push(`(${Object.keys(allValues[0]).join()}) VALUES`);
    const allFormattedValues = [];
    allValues.forEach((values) => {
        const formattedValues = formatValues(values);
        allFormattedValues.push(`(${Object.values(formattedValues)
            .map(() => `$${++varCount}`)
            .join()})`);
        variables.push(...Object.values(formattedValues));
    });
    queryArray.push(allFormattedValues.join());
    queryArray.push("RETURNING *");
    const query = queryArray.join(" ") + ";";
    utils_1.debug({ query }, variables);
    try {
        const result = await client.query(query, variables);
        utils_1.log(`${result.rows.length} record(s) of type "${table}" created.`);
        return parseResult(result);
    }
    catch (err) {
        utils_1.error(err.stack);
        return [];
    }
}
exports.create = create;
async function remove(table, ids) {
    if (!client) {
        throw new Error(`Could not perform action "remove": client is not connected`);
    }
    const queryArray = ["DELETE FROM", sanitizeTable(table)];
    const variables = [];
    let varCount = 0;
    if (!Array.isArray(ids)) {
        ids = [ids];
    }
    queryArray.push(`WHERE id IN (${ids.map(() => `$${++varCount}`)}) RETURNING *`);
    variables.push(...ids);
    const query = queryArray.join(" ") + ";";
    utils_1.debug({ query }, variables);
    try {
        const result = await client.query(query, variables);
        utils_1.log(`${result.rows.length} record(s) of type "${table}" removed.`);
        return parseResult(result);
    }
    catch (err) {
        utils_1.error(err.stack);
        return [];
    }
}
exports.remove = remove;
async function read(table, where, fields) {
    if (!client) {
        throw new Error(`Could not perform action "read": client is not connected`);
    }
    const queryArray = ["SELECT"];
    const variables = [];
    let varCount = 0;
    if (fields) {
        if (!fields.includes("id")) {
            fields.unshift("id");
        }
        queryArray.push(fields.map(() => `$${++varCount}`).join());
        variables.push(...fields);
    }
    else {
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
            }
            else if (typeof key === "string") {
                whereString.push(`${key} = $${++varCount}`);
                variables.push(where[key]);
            }
        }
        queryArray.push("WHERE", whereString.join(" AND "));
    }
    const query = queryArray.join(" ") + ";";
    utils_1.debug({ query }, variables);
    try {
        const result = await client.query(query, variables);
        return parseResult(result);
    }
    catch (err) {
        utils_1.error(err.stack);
        return [];
    }
}
exports.read = read;
async function update(table, ids, values) {
    if (!client) {
        throw new Error(`Could not perform action "update": client is not connected`);
    }
    const queryArray = ["UPDATE", sanitizeTable(table), "SET"];
    const variables = [];
    let varCount = 0;
    if (!Array.isArray(ids)) {
        ids = [ids];
    }
    const valuesArray = [];
    const formattedValues = formatValues(values);
    for (let fieldName in formattedValues) {
        valuesArray.push(`${fieldName}=$${++varCount}`);
        variables.push(formattedValues[fieldName]);
    }
    queryArray.push(valuesArray.join());
    queryArray.push(`WHERE id IN (${ids.map(() => `$${++varCount}`)}) RETURNING *`);
    variables.push(...ids);
    const query = queryArray.join(" ") + ";";
    utils_1.debug({ query }, variables);
    try {
        const result = await client.query(query, variables);
        utils_1.log(`${result.rows.length} record(s) of type "${table}" updated.`);
        return parseResult(result);
    }
    catch (err) {
        utils_1.error(err.stack);
        return [];
    }
}
exports.update = update;
