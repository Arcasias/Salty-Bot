'use strict';

const Command = require('../../classes/Command.js');
const error = require('../../classes/Exception.js');
const Salty = require('../../classes/Salty.js');

const INTERVALS = {};

module.exports = new Command({
    name: 'interval',
    keys: [],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "*delay* ***anything***",
            effect: "I'll tell what you want after a every **delay** seconds",
        },
    ],
    visibility: 'dev',
    async action(msg, args) {
        if (args[0] && Salty.getList('clear').includes(args[0])) {
            if (! INTERVALS[msg.guild.id]) {
                throw new error.EmptyObject("interval");
            }
            clearInterval(INTERVALS[msg.guild.id]);

            Salty.success(msg, "Interval cleared");
        } else {
            if (! args[0]) {
                throw new error.MissingArg("delay");
            }
            if (isNaN(args[0])) {
                throw new error.IncorrectValue("delay", "number");
            }
            if (! args[1]) {
                throw new error.MissingArg("message");
            }
            const delay = parseInt(args.shift()) * 1000;

            msg.delete().catch();

            if (INTERVALS[msg.guild.id]) {
                clearInterval(INTERVALS[msg.guild.id]);
            }
            INTERVALS[msg.guild.id] = setInterval(() => {
                Salty.message(msg, args.join(" "));
            }, delay);
        }
    },
});
