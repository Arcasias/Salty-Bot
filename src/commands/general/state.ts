import Command, {
    CommandVisiblity,
    CommandParams,
} from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty, { EmbedOptions } from "../../classes/Salty";
import User from "../../classes/User";
import { devs, owner, homepage } from "../../config";

class StateCommand extends Command {
    public name = "state";
    public keys = ["git", "local", "server"];
    public help = [
        {
            argument: null,
            effect: "Gets you some information about me",
        },
    ];
    public visibility = <CommandVisiblity>"dev";

    async action({ msg }: CommandParams) {
        const blacklist = User.filter((u: User) => u.black_listed);
        const options: EmbedOptions = {
            title: `Salty Bot`,
            url: homepage,
            description: `Last started on ${
                Salty.startTime.toString().split(" GMT")[0]
            }`,
            fields: [
                {
                    name: `Hosted on`,
                    value:
                        process.env.MODE === "server"
                            ? "Server"
                            : "Local instance",
                },
                { name: `Owner`, value: owner.username },
                { name: `Developers`, value: `${devs.length} contributors` },
                {
                    name: `Servers`,
                    value: `Handling ${Guild.size} servers`,
                },
                { name: `Users`, value: `Handling ${User.size} users` },
            ],
            inline: true,
        };
        if (blacklist.length) {
            options.fields.push({
                name: `Blacklist`,
                value: `${blacklist.length} troublemakers`,
            });
        }
        if (process.env.DEBUG === "true") {
            options.footer = { text: `Debug mode active` };
        }
        await Salty.embed(msg, options);
    }
}

export default StateCommand;
