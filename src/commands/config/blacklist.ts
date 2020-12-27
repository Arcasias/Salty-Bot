import Sailor from "../../classes/Sailor";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { isDev, meaning } from "../../utils";

const command: CommandDescriptor = {
  name: "blacklist",
  aliases: ["bl"],
  help: [
    {
      argument: null,
      effect: "Tells you wether you're an admin",
    },
    {
      argument: "***mention***",
      effect: "Tells you wether the ***mention*** is an admin",
    },
  ],
  access: "dev",

  async action({ args, send, msg, targets }) {
    const target = targets[0];
    switch (meaning(args[0])) {
      case "add":
      case "set": {
        if (!target) {
          return send.warn("You need to mention someone.");
        }
        if (target.user.id === salty.bot.user!.id) {
          return send.warn(
            "Woa woa woa! You can't just put me in my own blacklist you punk!"
          );
        }
        if (isDev(target.user)) {
          return send.warn(
            "Can't add a Salty dev to the blacklist: they're too nice for that!"
          );
        }
        await Sailor.update(target.sailor.id, { blackListed: true });
        return send.success(`<mention> added to the blacklist`);
      }
      case "remove": {
        if (!target) {
          return send.warn("You need to mention someone.");
        }
        if (target.user.id === salty.bot.user!.id) {
          return send.info(
            "Well... as you might expect, I'm not in the blacklist."
          );
        }
        if (!target.sailor.blackListed) {
          return send.info(`**${target.name}** is not in the blacklist.`);
        }
        await Sailor.update(target.sailor.id, { blackListed: false });
        return send.success(`<mention> removed from the blacklist`);
      }
      default: {
        if (target && target.user.id === salty.bot.user!.id) {
          return send.info("Nope, I am not and will never be in the blacklist");
        }
        if (target) {
          return send.info(
            target.sailor?.blackListed
              ? "<mention> is black-listed"
              : "<mention> isn't black-listed... yet"
          );
        }
        const blackListedSailors: Sailor[] = await Sailor.search({
          blackListed: true,
        });
        const blackListedNames: string[] = [];
        for (const { discordId } of blackListedSailors) {
          const name = msg.guild?.members.cache.get(discordId)?.displayName;
          if (name) {
            blackListedNames.push(name);
          }
        }
        if (blackListedNames.length) {
          return send.embed({
            title: "Blacklist",
            description: blackListedNames.join("\n"),
          });
        }
        return send.info(
          "The black list is empty. You can help by *expanding it*."
        );
      }
    }
  },
};

export default command;
