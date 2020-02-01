import pg from 'pg';

let client;
let connected = false;

function _sanitizeTable(table) {
    return table.toLowerCase().replace(/[^a-z_]/g, '');
}

async function connect() {
    if (!client) {
        client = new pg.Client({
            database: process.env.DATABASE_DATABASE,
            host: process.env.DATABASE_HOST,
            password: process.env.DATABASE_PASSWORD,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            ssl: true,
        });
    }
    try {
        await client.connect();
        connected = true;
    } catch (err) {
        LOG.error(err);
    }
}

async function disconnect() {
    try {
        await client.end();
        connected = false;
    } catch (err) {
        LOG.error(err);
    }
}

/**
 * @param  {string} table
 * @param  {Object} values
 * @return {Promise}
 */
async function create(table, ...allValues) {
    const queryString = [
        'INSERT INTO',
        _sanitizeTable(table),
    ];
    const variables = [];
    let varCount = 0;

    // column names should come from Multiton and should be safe to use.
    queryString.push(`(${Object.keys(allValues[0]).join()}) VALUES`);

    const allFormattedValues = [];
    allValues.forEach(values => {
        allFormattedValues.push(`(${Object.values(values).map(() => `$${++varCount}`).join()})`);
        variables.push(...Object.values(values));
    });
    queryString.push(allFormattedValues.join());
    queryString.push('RETURNING *;');

    LOG.debug({ query: queryString.join(" ") }, variables);

    const results = await client.query(queryString.join(" "), variables);
    return results.rows;
}

/**
 * @param  {string} table
 * @param  {number[]} ids
 * @return {Promise}
 */
async function remove(table, ids) {
    const queryString = [
        'DELETE FROM',
        _sanitizeTable(table),
    ];
    const variables = [];
    let varCount = 0;

    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    queryString.push(`WHERE id IN (${ids.map(() => `$${++varCount}`)}) RETURNING *;`);
    variables.push(...ids);

    LOG.debug({ query: queryString.join(" ") }, variables);

    const results = await client.query(queryString.join(" "), variables);
    return results.rows;
}

/**
 * @param  {string} table
 * @param  {number[]} ids
 * @param  {string[]} fields
 * @param  {Object} values
 * @return {Promise}
 */
async function read(table, ids, fields) {
    const queryString = ['SELECT'];
    const variables = [];
    let varCount = 0;

    if (fields) {
        if (!fields.includes('id')) {
            fields.unshift('id');
        }
        queryString.push(fields.map(() => `$${++varCount}`).join());
        variables.push(...fields);
    } else {
        queryString.push('*');
    }

    queryString.push(`FROM ${_sanitizeTable(table)}`);

    if (ids) {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        queryString.push(`WHERE id IN (${ids.map(() => `$${++varCount}`)});`);
        variables.push(...ids);
    }

    LOG.debug({ query: queryString.join(" ") }, variables);

    const results = await client.query(queryString.join(" "), variables);
    return results.rows;
}

/**
 * @param  {string} table
 * @param  {number[]} id
 * @param  {Object} values
 * @return {Promise}
 */
async function update(table, ids, values) {
    const queryString = [
        'UPDATE',
        _sanitizeTable(table),
        'SET',
    ];
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

    LOG.debug({ query: queryString.join(" ") }, variables);

    const results = await client.query(queryString.join(" "), variables);
    return results.rows;
}

export {
    connect,
    connected,
    create,
    disconnect,
    remove,
    read,
    update,
};