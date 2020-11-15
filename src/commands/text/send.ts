import Command from "../../classes/Command";
import { prefix } from "../../config";
import salty from "../../salty";

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

Command.register({
  name: "send",
  aliases: ["say", prefix],
  category: "text",
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
});
