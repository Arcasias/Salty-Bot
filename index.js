import fs from 'fs';
import path from 'path';
import './classes/util/Log.js';
import './classes/util/Util.js';

async function load() {
    // Set ENV according to the presence of a SERVER env variable
    if (process.env.SERVER) {
        process.env.MODE = 'server';
    } else {
        process.env.MODE = 'local';
        await import('./local.js');
    }

    const { config, init } = await import('./classes/Salty.js');

    process.env.DEBUG = config.debug;

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
