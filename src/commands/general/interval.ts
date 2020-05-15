import Command, { CommandAccess, CommandParams } from "../../classes/Command";
import {
    EmptyObject,
    IncorrectValue,
    MissingArg,
} from "../../classes/Exception";
import Salty from "../../classes/Salty";
import { clear } from "../../terms";

const INTERVALS: { [guild: string]: NodeJS.Timeout } = {};

class IntervalCommand extends Command {
    public name = "interval";
    public help = [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "*delay* ***anything***",
            effect: "I'll tell what you want after a every **delay** seconds",
        },
    ];
    public access: CommandAccess = "dev";

    async action({ args, msg }: CommandParams) {
        const channel = msg.guild ? msg.guild.id : msg.author.id;
        if (args[0] && clear.includes(args[0])) {
            if (!INTERVALS[channel]) {
                throw new EmptyObject("interval");
            }
            clearInterval(INTERVALS[channel]);

            Salty.success(msg, "Interval cleared");
        } else {
            if (!args[0]) {
                throw new MissingArg("delay");
            }
            if (isNaN(Number(args[0]))) {
                throw new IncorrectValue("delay", "number");
            }
            if (!args[1]) {
                throw new MissingArg("message");
            }
            const delay = parseInt(args.shift()!) * 1000;

            msg.delete().catch();

            if (INTERVALS[channel]) {
                clearInterval(INTERVALS[channel]);
            }
            INTERVALS[channel] = setInterval(() => {
                Salty.message(msg, args.join(" "));
            }, delay);
        }
    }
}

export default IntervalCommand;
