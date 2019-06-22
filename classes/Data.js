'use strict';

const fs = require('fs');
const path = require('path');
const Singleton = require('./Singleton');

class Data extends Singleton {

    constructor() {
        super(...arguments);

        this.writingFile = {};
    }

    decode(jsonString) {
        if (! jsonString) {
            return {};
        }
        if (typeof jsonString !== 'string') {
            throw new Error(`Encoded value must be a string, got ${typeof jsonString} instead`);
        }
        return JSON.parse(jsonString);
    }

    encode(obj, pretty=false) {
        return JSON.stringify(obj, null, (pretty ? 4 : null));
    }

    read(file, folder='./data/global/', options={}) {
        const ext = options.ext || '.json';
        const fullPath = path.join(folder, file + ext);

        if (this.writingFile[fullPath]) {
            return LOG.error(`Data already busy for path ${fullPath}`);
        }
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(fullPath, 'utf-8', (err, data) => {
                    if (err) {
                        LOG.error(err);
                    }
                    resolve(this.decode(data));
                });
            } catch (err) {
                LOG.error(err);
                reject();
            }
        });
    }

    write(file, data, folder='./data/global/', options={}) {
        const ext = options.ext || '.json';
        const pretty = options.pretty || false;
        const fullPath = path.join(folder, file + ext);

        if (this.writingFile[fullPath]) {
            return LOG.warn(`Data already busy for path ${fullPath}`);
        }
        this.writingFile[fullPath] = true;
        return new Promise((resolve, reject) => {
            try {
                const encodedData = this.encode(data, pretty);

                fs.writeFile(fullPath, encodedData, 'utf-8', err => {
                    if (err) {
                        LOG.error(err);
                    }
                    this.writingFile[fullPath] = false;
                    resolve(encodedData);
                });
            } catch (err) {
                LOG.error(err);
                reject();
            }
        });
    }
}

module.exports = new Data();