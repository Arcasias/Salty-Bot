import Command from "../../classes/Command";
import Crew from "../../classes/Crew";
import Sailor from "../../classes/Sailor";
import { devs, homepage, owner } from "../../config";
import salty from "../../salty";
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
        const [crewsCount, sailorsCount] = await Promise.all([
            Crew.count(),
            Sailor.count(),
        ]);
        const options: SaltyEmbedOptions = {
            title: `Salty Bot`,
            url: homepage,
            description: `Last started on ${
                salty.startTime.toString().split(" GMT")[0]
            }`,
            fields: [
                {
                    name: `Hosting`,
                    value:
                        process.env.MODE === "server"
                            ? "Server"
                            : "Local instance",
                },
                { name: `Owner`, value: owner.username },
                { name: `Developers`, value: `${devs.length} contributors` },
                {
                    name: `Crews`,
                    value: `Handling ${crewsCount} crews`,
                },
                {
                    name: `Sailors`,
                    value: `Watching over ${sailorsCount} sailors`,
                },
            ],
            inline: true,
        };
        if (process.env.DEBUG === "true") {
            options.footer = { text: `Debug mode active` };
        }
        await salty.embed(msg, options);
    },
});
