import Command from "../../classes/Command";
import { prefix } from "../../config";
import salty from "../../salty";
import { CommandDescriptor } from "../../types";

const specialActions: [RegExp, string][] = [
  [/nudes?/i, "You wish"],
  [/(noods?)|(noodles?)/i, "That's quite cheap"],
  [/noots?/i, "NOOT NOOT"],
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
      return Command.run("talk", msg, args, source, targets);
    }
    let message;
    for (const [expr, response] of specialActions) {
      if (expr.test(args[0])) {
        message = response;
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
