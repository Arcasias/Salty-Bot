import Command from "../../classes/Command";
import { prefix } from "../../config";
import salty from "../../salty";
import { CommandDescriptor } from "../../types";

const specialActions = [
  {
    keywords: ["nude", "nudes"],
    response: "you wish",
  },
  {
    keywords: ["nood", "noods", "noodle", "noodles"],
    response: "you're so poor",
  },
  {
    keywords: ["noot", "noots"],
    response: "NOOT NOOT",
  },
];

const command: CommandDescriptor = {
  name: "send",
  aliases: ["say", prefix],
  help: [
    {
      argument: "***anything***",
      effect: "Sends something. Who knows what?",
    },
  ],

  async action({ args, msg, source, targets }) {
    if (!args[0]) {
      return Command.list.get("talk")!.run(msg, args, source, targets);
    }
    let message;
    for (let sa of specialActions) {
      if (sa.keywords.includes(args[0])) {
        message = sa.response;
      }
    }
    if (!message) {
      salty.deleteMessage(msg);
      message = args.join(" ");
    }
    await salty.message(msg, message);
  },
};

export default command;
