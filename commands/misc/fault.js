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
    action: function (msg, args) {

        let fault = S.getList('fault');
        let text = (UTIL.choice(fault.start) + UTIL.choice(fault.sentence))
            .replace(/<subject>/g, UTIL.choice(fault.subject))
            .replace(/<reason>/g, UTIL.choice(fault.reason))
            .replace(/<punishment>/g, UTIL.choice(fault.punishment));

        S.msg(msg, text);
    },
});

