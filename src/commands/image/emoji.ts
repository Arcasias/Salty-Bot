import fs from "fs";
import { promisify } from "util";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { choice } from "../../utils";

const emojiPath = "./assets/img/saltmoji";
const readDir = promisify(fs.readdir.bind(fs));

const command: CommandDescriptor = {
  name: "emoji",
  aliases: ["emojis", "saltmoji", "saltmojis"],
  help: [
    {
      argument: null,
      effect: "Shows my emojis list",
    },
    {
      argument: "***emoji name***",
      effect: "Sends the indicated emoji",
    },
  ],

  async action({ args, msg }) {
    const files: string[] = await readDir(emojiPath);
    const pngs = files.filter((file) => file.split(".").pop() === "png");
    const emojiNames = pngs.map((name) => name.split(".").shift()!);

    if (args[0]) {
      const arg = args[0].toLowerCase();
      let emoji: string | null = null;

      if (["rand", "random"].includes(arg)) {
        emoji = choice(emojiNames);
      } else if (emojiNames.includes(arg)) {
        emoji = arg;
      }
      if (emoji) {
        salty.deleteMessage(msg);
        return salty.message(msg, "", {
          files: [`${emojiPath}/${emoji}.png`],
        });
      }
    }
    salty.embed(msg, {
      title: "list of saltmojis",
      description: emojiNames.join("\n"),
    });
  },
};

export default command;
