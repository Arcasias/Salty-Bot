import { MessageEmbed } from "discord";
import Command from "../../classes/Command";
import { IncorrectValue, MissingArg } from "../../classes/Exception";
import Salty from "../../classes/Salty";

export default new Command({
    name: "embed",
    keys: ["embeds", "json", "parse"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***JSON data***",
            effect: "Parses the provided JSON as a Discord embed",
        },
    ],
    visibility: "public",
    async action(msg, args) {
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
    },
});
