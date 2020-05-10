'use strict';

const fs = require('fs');
const path = require('path');

const { config, init } = require('./classes/Salty.js');
const initLocalEnv = require('./local.js');

require('./classes/util/Log.js');
require('./classes/util/Util.js');

async function load() {
    // Set ENV according to the presence of a SERVER env variable
    if (process.env.SERVER) {
        process.env.MODE = 'server';
    } else {
        process.env.MODE = 'local';
        initLocalEnv();
    }
    LOG.info(`Running on ${process.env.MODE} environment`);

    process.env.DEBUG = config.debug;
    if (process.env.DEBUG) {
        LOG.debug(`Debug is active`);
    }

    // Empty temp images folder
    fs.readdir(config.tempImageFolder, (error, files) => {
        if (error) {
            fs.mkdir(config.tempImageFolder, err => {
                if (err) {
                    LOG.error(err);
                }
            });
            return;
        }
        files.forEach(file => {
            fs.unlink(path.join(config.tempImageFolder, file), err => {
                if (err) {
                    LOG.error(err);
                }
            });
        });
    });

    // Initialize bot
    init();
}

// Aaaaand here we go!
load();
