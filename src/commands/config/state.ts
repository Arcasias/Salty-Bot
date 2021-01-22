import { env } from "process";
import Command from "../../classes/Command";
import Crew from "../../classes/Crew";
import Sailor from "../../classes/Sailor";
import { config } from "../../database/config";
import salty from "../../salty";
import { CommandDescriptor, SaltyEmbedOptions } from "../../typings";

const command: CommandDescriptor = {
  name: "state",
  aliases: ["git", "local", "server", "who", "salty"],
  help: [
    {
      argument: null,
      effect: "Gets you some information about me",
    },
  ],
  access: "dev",

  async action({ msg, send }) {
    const [crewsCount, sailorsCount] = await Promise.all([
      Crew.count(),
      Sailor.count(),
    ]);
    const commandCount = Command.count();
    const options: SaltyEmbedOptions = {
      title: `Salty Bot`,
      url: process.env.GITHUB_PAGE!,
      description: `Hi! My name is Salty. Here are some useful informations about my current state:`,
      fields: [
        {
          name: `Hosting`,
          value: env.MODE === "server" ? "Server" : "Local instance",
        },
        {
          name: `Developers`,
          value: `${config.devIds.length} contributors`,
        },
        {
          name: `Crews (servers)`,
          value: `Handling ${crewsCount} crews`,
        },
        {
          name: `Sailors (users)`,
          value: `Watching over ${sailorsCount} sailors`,
        },
        {
          name: `Commands`,
          value: `${commandCount} registered commands`,
        },
        {
          name: `Server latency`,
          value: `${Date.now() - msg.createdTimestamp}ms`,
        },
      ],
      inline: true,
    };
    options.footer = {
      text: `Last started on ${salty.startTime.toString().split(" GMT")[0]}.${
        env.DEBUG === "true" ? " Debug mode is active." : ""
      }`,
    };
    await send.embed(options);
  },
};

export default command;
