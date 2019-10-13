'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'restart',
    keys: [
        "restart",
        "reset",
    ],
    help: [
        {
            argument: null,
            effect: "Disconnects me and reconnects right after",
        }
    ],
    visibility: 'dev', 
    action: async function (msg, args) {
    	await S.embed(msg, { title: "Restarting ...", type: 'success' });
        await S.restart();
    },
});

