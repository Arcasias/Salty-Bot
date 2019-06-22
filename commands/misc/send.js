'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

const specialActions = [
    {
        keywords: ['nude', 'nudes'],
        response: "you wish",
    },
    {
        keywords: ['nood', 'noods', 'noodle', 'noodles'],
        response: "you're so poor",
    },
    {
        keywords: ['noot', 'noots'],
        response: "NOOT NOOT",
    },
];

module.exports = new Command({
    name: 'send',
    keys: [
        "send",
        "say",
        S.config.prefix,
    ],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "***anything***",
            effect: "Sends something. Who knows what ?"
        },
    ],
    visibility: 'public', 
    action: function (msg, args) {

        if (! args[0]) {
            return S.commands.list.get('talk').run(msg, args);
        }
        let message;

        for (let sa of specialActions) {
            if (sa.keywords.includes(args[0])) {
                message = sa.response;
            }
        }
        if (! message) {
            msg.delete();
            message = args.join(" ")
        }
        S.msg(msg, message);
    },
});

