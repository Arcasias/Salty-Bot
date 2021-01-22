import fs from "fs";
import { promisify } from "util";
import { CommandDescriptor } from "../../typings";
import { choice } from "../../utils/generic";

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
      argument: "`emoji name`",
      effect: "Sends the indicated emoji",
    },
  ],

  async action({ args, msg, send }) {
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
        msg.delete().catch();
        return send.message("", {
          files: [`${emojiPath}/${emoji}.png`],
        });
      }
    }
    return send.embed({
      title: "list of saltmojis",
      description: emojiNames.join("\n"),
    });
  },
};

export default command;
