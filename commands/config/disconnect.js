'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'disconnect',
    keys: [
        "disconnect",
    ],
    help: [
        {
            argument: null,
            effect: "Disconnects me and terminates my program. Think wisely before using this one, ok ?"
        }
    ],
    visibility: 'dev', 
    action: async function (msg, args) {
        await S.embed(msg, {
            title: `${ UTIL.choice(S.getList('answers')['bye']) } ♥`,
            type: 'success',
        });
        await S.destroy();
    },
});

