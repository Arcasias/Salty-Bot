import Command, { CommandParams } from "../../classes/Command";
import { MissingArg } from "../../classes/Exception";
import Salty from "../../classes/Salty";

class DelayCommand extends Command {
    public name = "delay";
    public keys = ["sleep", "timeout"];
    public help = [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "*delay* ***anything***",
            effect: "I'll tell what you want after a provided delay",
        },
    ];

    async action({ args, msg }: CommandParams) {
        if (!args.length) {
            throw new MissingArg("anything");
        }
        const delay =
            args[1] && !isNaN(Number(args[0]))
                ? parseInt(args.shift()!) * 1000
                : 5000;

        msg.delete().catch();
        setTimeout(() => {
            Salty.message(msg, args.join(" "));
        }, delay);
    }
}

export default DelayCommand;
