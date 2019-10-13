'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

const INTERVALS = {}

module.exports = new Command({
    name: 'interval',
    keys: [
        "interval",
    ],
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
    action: async function (msg, args) {
        if (args[0] && S.getList('clear').includes(args[0])) {
            if (! INTERVALS[msg.guild.id]) {
                throw new error.EmptyObject("interval");
            }
            clearInterval(INTERVALS[msg.guild.id]);

            S.embed(msg, { title: "Interval cleared", type: 'success' });
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
            let delay = parseInt(args.shift()) * 1000;

            msg.delete().catch();

            if (INTERVALS[msg.guild.id]) {
                clearInterval(INTERVALS[msg.guild.id]);
            }
            INTERVALS[msg.guild.id] = setInterval(() => {
                S.msg(msg, args.join(" "));
            }, delay);
        }
    },
});

