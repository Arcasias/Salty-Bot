'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'fault',
    keys: [
        "fault",
        "reason",
        "overwatch",
    ],
    help: [
        {
            argument: null,
            effect: "Check whose fault it is"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {
        const fault = S.getList('fault');
        const text = (UTIL.choice(fault.start) + UTIL.choice(fault.sentence))
            .replace(/<subject>/g, UTIL.choice(fault.subject))
            .replace(/<reason>/g, UTIL.choice(fault.reason))
            .replace(/<punishment>/g, UTIL.choice(fault.punishment));

        await S.msg(msg, text);
    },
});

