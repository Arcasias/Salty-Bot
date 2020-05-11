"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const utils_1 = require("../utils");
let client;
function _sanitizeTable(table) {
    return table.toLowerCase().replace(/[^a-z_]/g, "");
}
async function connect() {
    if (!client) {
        client = new pg_1.Client({
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
    }
    catch (err) {
        utils_1.error(err);
    }
}
async function disconnect() {
    try {
        await client.end();
    }
    catch (err) {
        utils_1.error(err);
    }
}
async function create(table, ...allValues) {
    const queryString = ["INSERT INTO", _sanitizeTable(table)];
    const variables = [];
    let varCount = 0;
    queryString.push(`(${Object.keys(allValues[0]).join()}) VALUES`);
    const allFormattedValues = [];
    allValues.forEach((values) => {
        allFormattedValues.push(`(${Object.values(values)
            .map(() => `$${++varCount}`)
            .join()})`);
        variables.push(...Object.values(values));
    });
    queryString.push(allFormattedValues.join());
    queryString.push("RETURNING *;");
    utils_1.debug({ query: queryString.join(" ") }, variables);
    const result = await client.query(queryString.join(" "), variables);
    utils_1.log(`${result.rows.length} record(s) of type "${table}" created.`);
    return result.rows;
}
async function remove(table, ids) {
    const queryString = ["DELETE FROM", _sanitizeTable(table)];
    const variables = [];
    let varCount = 0;
    if (!Array.isArray(ids)) {
        ids = [ids];
    }
    queryString.push(`WHERE id IN (${ids.map(() => `$${++varCount}`)}) RETURNING *;`);
    variables.push(...ids);
    utils_1.debug({ query: queryString.join(" ") }, variables);
    const result = await client.query(queryString.join(" "), variables);
    utils_1.log(`${result.rows.length} record(s) of type "${table}" removed.`);
    return result.rows;
}
async function read(table, ids, fields) {
    const queryString = ["SELECT"];
    const variables = [];
    let varCount = 0;
    if (fields) {
        if (!fields.includes("id")) {
            fields.unshift("id");
        }
        queryString.push(fields.map(() => `$${++varCount}`).join());
        variables.push(...fields);
    }
    else {
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
    utils_1.debug({ query: queryString.join(" ") }, variables);
    const result = await client.query(queryString.join(" "), variables);
    return result.rows;
}
async function update(table, ids, values) {
    const queryString = ["UPDATE", _sanitizeTable(table), "SET"];
    const variables = [];
    let varCount = 0;
    if (!Array.isArray(ids)) {
        ids = [ids];
    }
    const valuesArray = [];
    for (let fieldName in values) {
        valuesArray.push(`${fieldName}=$${++varCount}`);
        variables.push(values[fieldName]);
    }
    queryString.push(valuesArray.join());
    queryString.push(`WHERE id IN (${ids.map(() => `$${++varCount}`)}) RETURNING *;`);
    variables.push(...ids);
    utils_1.debug({ query: queryString.join(" ") }, variables);
    const result = await client.query(queryString.join(" "), variables);
    utils_1.log(`${result.rows.length} record(s) of type "${table}" updated.`);
    return result.rows;
}
exports.default = {
    connect,
    create,
    disconnect,
    remove,
    read,
    update,
};
