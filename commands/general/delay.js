import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';
import * as error from '../../classes/Exception.js';

export default new Command({
    name: 'delay',
    keys: [
        "later",
        "sleep",
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
    async action(msg, args) {
		if (!args[0]) {
            throw new error.MissingArg("anything");
        }

        const delay = args[1] && !isNaN(args[0]) ?
        parseInt(args.shift()) * 1000 :
            5000;

        msg.delete().catch();

		setTimeout(() => {
			Salty.message(msg, args.join(" "));
		}, delay);
    },
});

