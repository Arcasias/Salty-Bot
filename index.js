'use strict';

// Set ENV according to the existence of a Discord API token
process.env.MODE = process.env.DISCORD_API ? 'server' : 'local';
try {
    require('./local');
} catch (err) {}
require('./classes/util');

const fs = require('fs');
const path = require('path');
const S = require('./classes/Salty');

process.env.DEBUG = S.config.debug;

// Empty temp images folder
fs.readdir(S.config.tempImageFolder, (error, files) => {
    if (error) {
        fs.mkdir(S.config.tempImageFolder, err => {
            if (err) {
                LOG.error(err);
            }
        });
        return;
    }
    files.forEach(file => {
        fs.unlink(path.join(S.config.tempImageFolder, file), err => {
            if (err) {
                LOG.error(err);
            }
        });
    });
});

// Initialize bot
S.init();
