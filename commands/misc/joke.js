'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'joke',
    keys: [
        "joke",
        "jokes",
        "jest",
    ],
    help: [
        {
            argument: null,
            effect: "Tells some spicy jokes !"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {
        await S.msg(msg, UTIL.choice(S.getList('jokes')));
    },
});

