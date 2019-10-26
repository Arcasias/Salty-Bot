import Command from '../../classes/Command.js';
import * as error from '../../classes/Exception.js';

const INTERVALS = {};

export default new Command({
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
        if (args[0] && this.getList('clear').includes(args[0])) {
            if (! INTERVALS[msg.guild.id]) {
                throw new error.EmptyObject("interval");
            }
            clearInterval(INTERVALS[msg.guild.id]);

            this.embed(msg, { title: "Interval cleared", type: 'success' });
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
                this.msg(msg, args.join(" "));
            }, delay);
        }
    },
});

