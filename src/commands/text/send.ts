import salty from "../../salty";
import { CommandDescriptor } from "../../typings";

const specialActions: [RegExp, string][] = [
  [/nudes?/i, "You wish"],
  [/(noods?)|(noodles?)/i, "That's quite cheap"],
  [/noots?/i, "NOOT NOOT"],
];

const command: CommandDescriptor = {
  name: "send",
  aliases: ["say"],
  help: [
    {
      argument: "`anything`",
      effect: "Sends something. Who knows what?",
    },
  ],

  async action({ args, msg, run, send }) {
    if (!args[0]) {
      return run("talk");
    }
    let text: string = "";
    for (const [expr, response] of specialActions) {
      if (expr.test(args[0])) {
        text = response;
      }
    }
    if (!text) {
      salty.deleteMessage(msg);
      text = args.join(" ");
    }
    await send.message(text);
  },
};

export default command;
