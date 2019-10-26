import fs from 'fs';
import path from 'path';
import './classes/util/Log.js';
import './classes/util/Util.js';

async function load() {
    // Set ENV according to the presence of a Discord API token
    try {
        await import('./local.js');
        process.env.MODE = 'local';
    } catch (err) {
        process.env.MODE = 'server';
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
