'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'delay',
    keys: [
        "delay",
        "sleep",
        "later",
    ],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "*delay* ***anything***",
            effect: "I'll tell what you want after a provided delay",
        },
    ],
    visibility: 'public', 
    action: function (msg, args) {

		if (! args[0]) throw new error.MissingArg("anything");

		let delay = 5000;

		if (args[1] && ! isNaN(args[0])) delay = parseInt(args.shift()) * 1000;

		msg.delete().catch();

		setTimeout(() => {

			S.msg(msg, args.join(" "));
		}, delay);
    },
});

