import fs from "fs";
import path from "path";
import salty from "../../salty";
import { CommandDescriptor, SaltyEmbedOptions } from "../../typings";
import { choice, isAdmin, isOwner, possessive } from "../../utils/generic";

const SALTY_IMAGES_PATH = "assets/img/salty";

const command: CommandDescriptor = {
  name: "avatar",
  aliases: ["pic", "picture", "pp"],
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

  async action({ msg, send, source, targets }) {
    const { member, name, user } = targets[0] || source;
    const { guild } = msg;
    const options: SaltyEmbedOptions = {
      title: `This is ${possessive(name)} profile pic`,
      color: member?.displayColor,
    };
    if (user.id === salty.bot.user!.id) {
      // if Salty
      const files = fs.readdirSync(SALTY_IMAGES_PATH);
      const pics = files.filter((f) => f.split(".").pop() === "png");
      options.title = `This is a picture of me. `;
      options.files = [path.join(SALTY_IMAGES_PATH, choice(pics))];
    } else {
      if (user.bot) {
        options.description = "That's just a crappy bot"; // bot
      } else if (isOwner(user)) {
        options.description = "He's the coolest guy I know ^-^"; // owner
      } else if (isAdmin(user, guild)) {
        options.description = "It's a cute piece of shit"; // admin
      } else {
        options.description = "This is a huge piece of shit"; // else
      }
      const url = user.avatarURL({ size: 1024 });
      if (url) {
        options.image = { url };
      }
    }
    await send.embed(options);
  },
};

export default command;
