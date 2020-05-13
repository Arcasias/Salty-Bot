import { MessageEmbed } from "discord.js";
import Command, { CommandParams } from "../../classes/Command";
import { IncorrectValue, MissingArg } from "../../classes/Exception";
import Salty from "../../classes/Salty";

class EmbedCommand extends Command {
    public name = "embed";
    public keys = ["json", "parse"];
    public help = [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***JSON data***",
            effect: "Parses the provided JSON as a Discord embed",
        },
    ];

    async action({ args, msg }: CommandParams) {
        let parsed;
        try {
            parsed = JSON.parse(args.join(" "));
        } catch (error) {
            throw new IncorrectValue("JSON", "json formatted string");
        }
        if (0 === Object.keys(parsed).length) {
            throw new MissingArg("JSON");
        }
        await Salty.message(msg, null, { embed: new MessageEmbed(parsed) });
    }
}

export default EmbedCommand;
