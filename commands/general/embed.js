import Command from '../../classes/Command.js';
import Discord from 'discord.js';
import * as error from '../../classes/Exception.js';

export default new Command({
    name: 'embed',
    keys: [
        "embeds",
        "json",
        "parse",
    ],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "***JSON data***",
            effect: "Parses the provided JSON as a Discord embed"
        },
    ],
    visibility: 'public',
    async action(msg, args) {
        let parsed;
        try {
            parsed = JSON.parse(args.join(" "));
        } catch (error) {
            throw new error.IncorrectValue("JSON", "json formatted string");
        }
        if (0 === Object.keys(parsed).length) {
            throw new error.MissingArg("JSON");
        }
        await this.msg(msg, null, { embed: new Discord.RichEmbed(parsed) });
    },
});

