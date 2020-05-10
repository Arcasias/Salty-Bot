"use strict";

const fs = require("fs");
const path = require("path");

const { config, init } = require("./src/classes/Salty.js");
const initLocalEnv = require("./local.js");

global.UTIL = require("./src/utils/utils.js");
global.LOG = require("./src/utils/log.js");

async function load() {
    // Set ENV according to the presence of a SERVER env variable
    if (process.env.SERVER) {
        process.env.MODE = "server";
    } else {
        process.env.MODE = "local";
        initLocalEnv();
    }
    LOG.log(`Running on ${process.env.MODE} environment`);

    process.env.DEBUG = config.debug;
    if (process.env.DEBUG) {
        LOG.debug(`Debug is active`);
    }

    // Empty temp images folder
    fs.readdir(config.tempImageFolder, (error, files) => {
        if (error) {
            fs.mkdir(config.tempImageFolder, (err) => {
                if (err) {
                    LOG.error(err);
                }
            });
            return;
        }
        files.forEach((file) => {
            fs.unlink(path.join(config.tempImageFolder, file), (err) => {
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
