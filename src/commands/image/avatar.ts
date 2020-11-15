import fs from "fs";
import path from "path";
import Command from "../../classes/Command";
import salty from "../../salty";
import { SaltyEmbedOptions } from "../../types";
import { choice, isAdmin, isOwner, possessive } from "../../utils";

const SALTY_IMAGES_PATH = "assets/img/salty";

Command.register({
  name: "avatar",
  aliases: ["pic", "picture", "pp"],
  category: "image",
  help: [
    {
      argument: null,
      effect: "Shows a bigger version of your profile picture",
    },
    {
      argument: "***mention***",
      effect: "Shows a bigger version of ***mention***'s profile picture",
    },
  ],

  async action({ msg, source, targets }) {
    const query = targets[0] || source;
    const options: SaltyEmbedOptions = {
      title: `this is ${possessive(query.name)} profile pic`,
      color: query.member?.displayColor,
    };
    if (query.user.id === salty.bot.user!.id) {
      // if Salty
      const files = fs.readdirSync(SALTY_IMAGES_PATH);
      const pics = files.filter((f) => f.split(".").pop() === "png");
      options.title = `This is a picture of me. `;
      options.files = [path.join(SALTY_IMAGES_PATH, choice(pics))];
    } else {
      if (query.user.bot) {
        options.description = "That's just a crappy bot"; // bot
      } else if (isOwner(query.user)) {
        options.description = "He's the coolest guy i know ^-^"; // owner
      } else if (msg.guild && isAdmin(query.user, msg.guild)) {
        options.description = "It's a cute piece of shit"; // admin
      } else {
        options.description = "This is a huge piece of shit"; // else
      }
      const url = query.user.avatarURL({ size: 1024 });
      if (url) {
        options.image = { url };
      }
    }
    await salty.embed(msg, options);
  },
});
