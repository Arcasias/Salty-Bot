import Command, { CommandParams } from "../../classes/Command";
import { MissingArg } from "../../classes/Exception";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";

class ChooseCommand extends Command {
    public name = "choose";
    public keys = ["choice", "chose", "shoes"];
    public help = [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***first choice*** / ***second choice*** / ...",
            effect:
                "Chooses randomly from all provided choices. They must be separated with \"/\". Please don't use this to decide important life choices, it's purely random ok?",
        },
    ];

    async action({ args, msg }: CommandParams) {
        if (!args[0] || !args[1]) {
            throw new MissingArg("choices");
        }
        await Salty.message(
            msg,
            `I choose ${choice(args.join(" ").split("/"))}`
        );
    }
}

export default ChooseCommand;
