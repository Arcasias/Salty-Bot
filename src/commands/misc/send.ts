import Command, { CommandParams } from "../../classes/Command";
import Salty from "../../classes/Salty";
import { prefix } from "../../config";

const specialActions = [
    {
        keywords: ["nude", "nudes"],
        response: "you wish",
    },
    {
        keywords: ["nood", "noods", "noodle", "noodles"],
        response: "you're so poor",
    },
    {
        keywords: ["noot", "noots"],
        response: "NOOT NOOT",
    },
];

class SendCommand extends Command {
    public name = "send";
    public keys = ["say", prefix];
    public help = [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***anything***",
            effect: "Sends something. Who knows what?",
        },
    ];

    async action({ args, msg }: CommandParams) {
        if (!args[0]) {
            return Salty.commands.list.get("talk").run(msg, args);
        }
        let message;
        for (let sa of specialActions) {
            if (sa.keywords.includes(args[0])) {
                message = sa.response;
            }
        }
        if (!message) {
            msg.delete();
            message = args.join(" ");
        }
        await Salty.message(msg, message);
    }
}

export default SendCommand;
