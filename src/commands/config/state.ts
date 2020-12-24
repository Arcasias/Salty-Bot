import { env } from "process";
import Crew from "../../classes/Crew";
import { config } from "../../classes/Database";
import Sailor from "../../classes/Sailor";
import salty from "../../salty";
import { CommandDescriptor, SaltyEmbedOptions } from "../../typings";

const command: CommandDescriptor = {
  name: "state",
  aliases: ["git", "local", "server"],
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
      url: process.env.GITHUB_PAGE!,
      description: `Last started on ${
        salty.startTime.toString().split(" GMT")[0]
      }`,
      fields: [
        {
          name: `Hosting`,
          value: env.MODE === "server" ? "Server" : "Local instance",
        },
        { name: `Developers`, value: `${config.devIds.length} contributors` },
        {
          name: `Crews`,
          value: `Handling ${crewsCount} crews`,
        },
        {
          name: `Sailors`,
          value: `Watching over ${sailorsCount} sailors`,
        },
        {
          name: `Prefix`,
          value: `${config.prefix}`,
        },
      ],
      inline: true,
    };
    if (env.DEBUG === "true") {
      options.footer = { text: `Debug mode active` };
    }
    await salty.embed(msg, options);
  },
};

export default command;
