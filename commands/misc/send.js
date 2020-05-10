'use strict';

const Command = require('../../classes/Command.js');
const { config } = require('../../classes/Salty.js');
const Salty = require('../../classes/Salty.js');

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
        "say",
        config.prefix,
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
    async action(msg, args) {
        if (!args[0]) {
            return Salty.commands.list.get('talk').run(msg, args);
        }
        let message;
        for (let sa of specialActions) {
            if (sa.keywords.includes(args[0])) {
                message = sa.response;
            }
        }
        if (! message) {
            msg.delete();
            message = args.join(" ");
        }
        await Salty.message(msg, message);
    },
});
