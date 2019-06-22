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
    action: function (msg, args) {
        S.msg(msg, UTIL.choice(S.getList('jokes')));
    },
});

