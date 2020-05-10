'use strict';

const Command = require('../../classes/Command.js');
const Salty = require('../../classes/Salty.js');

module.exports = new Command({
    name: 'joke',
    keys: [
        "fun",
        "haha",
        "jest",
        "joker",
        "jokes",
    ],
    help: [
        {
            argument: null,
            effect: "Tells some spicy jokes !"
        },
    ],
    visibility: 'public',
    async action(msg) {
        await Salty.message(msg, UTIL.choice(Salty.getList('jokes')));
    },
});
