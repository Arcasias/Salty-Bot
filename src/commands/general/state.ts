import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
import User from "../../classes/User";
import { devs, homepage, owner } from "../../config";
import { SaltyEmbedOptions } from "../../types";

Command.register({
    name: "state",
    aliases: ["git", "local", "server"],
    category: "general",
    help: [
        {
            argument: null,
            effect: "Gets you some information about me",
        },
    ],
    access: "dev",

    async action({ msg }) {
        const blacklist = User.filter((u: User) => u.black_listed);
        const options: SaltyEmbedOptions = {
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
            options.fields!.push({
                name: `Blacklist`,
                value: `${blacklist.length} troublemakers`,
            });
        }
        if (process.env.DEBUG === "true") {
            options.footer = { text: `Debug mode active` };
        }
        await Salty.embed(msg, options);
    },
});
