import Command from "../../classes/Command";
import Guild from "../../classes/Guild";
import Salty, { EmbedOptions } from "../../classes/Salty";
import User from "../../classes/User";

export default new Command({
    name: "state",
    keys: ["git", "instance", "local", "server"],
    help: [
        {
            argument: null,
            effect: "Gets you some information about me",
        },
    ],
    visibility: "dev",
    async action(msg) {
        const options: EmbedOptions = {
            title: `Salty Bot`,
            url: Salty.config.homepage,
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
                { name: `Owner`, value: Salty.config.owner.username },
                {
                    name: `Servers`,
                    value: `Running on ${Guild.size} servers`,
                },
                { name: `Users`, value: `Handling ${User.size} users` },
                {
                    name: `Developers`,
                    value: `${Salty.config.devs.length} contributors`,
                },
                {
                    name: `Blacklist`,
                    value: `${
                        User.filter((u: User) => u.black_listed).length
                    } troublemakers`,
                },
            ],
            inline: true,
        };
        if (process.env.DEBUG === "true") {
            options.footer = { text: `Debug mode active` };
        }
        await Salty.embed(msg, options);
    },
});
