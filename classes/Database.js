'use strict';

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const Singleton = require('./Singleton');

class Database extends Singleton {

    constructor() {
        super(...arguments);

        this.writingFile = {};
        this.client = new Client({
            database: process.env.DATABASE_DATABASE,
            host: process.env.DATABASE_HOST,
            password: process.env.DATABASE_PASSWORD,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            ssl: true,
        });
        this.connected = false;
    }

    async connect() {
        try {
            await this.client.connect();
            this.connected = true;
        } catch (err) {
            LOG.error(err);
        }
    }

    async disconnect() {
        try {
            await this.client.end();
            this.connected = false;
        } catch (err) {
            LOG.error(err);
        }
    }

    /**
     * @param  {string} table
     * @param  {Object} values
     * @return {Promise}
     */
    async create(table, ...allValues) {
        const queryString = [
            'INSERT INTO',
            this.sanitizeTable(table),
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

        const results = await this.client.query(queryString.join(" "), variables);
        return results.rows;
    }

    /**
     * @param  {string} table
     * @param  {number[]} ids
     * @return {Promise}
     */
    async delete(table, ids) {
        const queryString = [
            'DELETE FROM',
            this.sanitizeTable(table),
        ];
        const variables = [];
        let varCount = 0;

        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        queryString.push(`WHERE id IN (${ids.map(() => `$${++varCount}`)}) RETURNING *;`);
        variables.push(...ids);

        LOG.debug({ query: queryString.join(" ") }, variables);

        const results = await this.client.query(queryString.join(" "), variables);
        return results.rows;
    }

    /**
     * @param  {string} table
     * @param  {number[]} ids
     * @param  {string[]} fields
     * @param  {Object} values
     * @return {Promise}
     */
    async read(table, ids, fields) {
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

        queryString.push(`FROM ${this.sanitizeTable(table)}`);

        if (ids) {
            if (!Array.isArray(ids)) {
                ids = [ids];
            }
            queryString.push(`WHERE id IN (${ids.map(() => `$${++varCount}`)});`);
            variables.push(...ids);
        }

        LOG.debug({ query: queryString.join(" ") }, variables);

        const results = await this.client.query(queryString.join(" "), variables);
        return results.rows;
    }

    /**
     * @param  {string} table
     * @param  {number[]} id
     * @param  {Object} values
     * @return {Promise}
     */
    async update(table, ids, values) {
        const queryString = [
            'UPDATE',
            this.sanitizeTable(table),
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

        const results = await this.client.query(queryString.join(" "), variables);
        return results.rows;
    }

    sanitizeTable(table) {
        return table.toLowerCase().replace(/[^a-z_]/g, '');
    }
}

module.exports = new Database();