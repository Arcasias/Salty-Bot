'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const { Client } = require('pg');

require('./local');
require('./classes/util');

const app = express();
const client = new Client({
    database: process.env.DATABASE_DATABASE,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    ssl: true,
});
let state = {};

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.delete('/delete', _delete);
app.get('/read', _read);
app.post('/write', _write);

beep('boop').then(() => {
    app.listen(process.env.SERVER_PORT);
});

async function beep(boop) {
    try {
        await client.connect();
    } catch (err) {
        LOG.error(err, boop);
    }
}

async function _delete(req, res) {

}

async function _read(req, res) {
    let { fields, table, domain } = req.query;
    let varCount = 0;
    let variables = [];
    let result;
    let queryString = ['SELECT'];

    if (fields) {
        if (!Array.isArray(fields)) {
            fields = [fields];
        }
        queryString.push(fields.map(() => `$${++varCount}`));
        variables.push(...fields);
    } else {
        queryString.push('*');
    }

    queryString.push(`FROM ${sanitizeTable(table)}`);

    if (domain) {
        queryString.push('WHERE');
        const [variable, operator, value] = domain;
        queryString.push(`$${++varCount} ${sanitizeOperator(operator)} $${++varCount}`);
        variables.push(variable, value);
    }
    try {
        LOG.log(queryString.join(" "), variables);
        result = await client.query(queryString.join(" "), variables);
    } catch (err) {
        LOG.error(err);
    }
    res.json(state.rows);
}

async function _write(req, res) {
    res.json(req.body);
}

function sanitizeOperator(operator) {
    operator = operator.toUpperCase()
    if (
        operator !== '=' &&
        operator !== '<' &&
        operator !== '>' &&
        operator !== '<=' &&
        operator !== '>=' &&
        operator !== '<>' &&
        operator !== '!=' &&
        operator !== 'IN' &&
        operator !== 'NOT IN' &&
        operator !== 'LIKE'
    ) {
        throw new Error(`Invalid operator: ${operator}`);
    }
    return operator;
}

function sanitizeTable(table) {
    return table.toLowerCase().replace(/[^a-z_]/g, '');
}
