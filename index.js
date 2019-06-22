'use strict';

require('./classes/util');
const fs = require('fs');
const path = require('path');
const S = require('./classes/Salty');

// SET ENV
process.env.DEBUG = S.config.debug;
process.env.MODE = process.env.DISCORD_API ? 'server' : 'local';

if (process.env.MODE === 'local') {
    const noserv = require('./noserv');
}

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

// Update database every x time
setInterval(S.updateFiles.bind(S, "(Interval update)"), S.config.updateDbInterval);

// Initialize bot
S.init();

module.exports = S.started;
