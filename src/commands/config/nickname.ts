import { GuildMember, Message } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor } from "../../types";
import { meaning } from "../../utils";

async function changeNames(
  msg: Message,
  mutator: (nickname: string) => string
) {
  const members: GuildMember[] = msg.guild!.members.cache.array();
  const progressMsg = await salty.message(
    msg,
    `Changing ${members.length} nicknames...`
  );
  if (!progressMsg) {
    return;
  }
  let updating: boolean = false;
  const promises = members.map(async (member, i) => {
    const newNick: string = mutator(member.displayName);
    if (newNick !== member.displayName) {
      try {
        await member.setNickname(newNick);
      } catch (err) {
        if (err.message !== "Missing Permissions") {
          throw err;
        }
      }
    }
    if (!updating) {
      updating = true;
      await salty.editMessage(progressMsg, {
        content: `Changing nicknames: ${i++}/${members.length}`,
      });
      updating = false;
    }
  });
  await Promise.all(promises);
  await Promise.all([
    salty.deleteMessage(progressMsg),
    salty.success(msg, "Nicknames successfully changed"),
  ]);
}

const command: CommandDescriptor = {
  name: "nickname",
  aliases: ["name", "nick", "pseudo"],
  help: [
    {
      argument: "add ***particle***",
      effect:
        "Appends the ***particle*** to every possible nickname in the server. Careful to not exceed 32 characters!",
    },
    {
      argument: "remove ***particle***",
      effect: "Removes the ***particle*** from each matching nickname",
    },
  ],
  access: "admin",
  channel: "guild",

  async action({ args, msg }) {
    const particle: string = args.slice(1).join(" ");
    const particleRegex = new RegExp(particle, "g");

    if (!salty.hasPermission(msg.guild!, "MANAGE_NICKNAMES")) {
      return salty.warn(msg, `I don't have the permission to do that.`);
    }

    switch (meaning(args[0])) {
      case "add":
      case "set": {
        return changeNames(msg, (nickname: string) => {
          const transformed = `${nickname.trim()} ${particle}`;
          return particleRegex.test(nickname) || // already contains the particle
            transformed.length > 32 // not enough space
            ? nickname
            : transformed;
        });
      }
      case "remove": {
        return changeNames(msg, (nickname: string) =>
          nickname.replace(particleRegex, "").trim()
        );
      }
      case "string": {
        return salty.warn(
          msg,
          "You need to specify what nickname particle will be targeted."
        );
      }
      default: {
        return salty.warn(
          msg,
          "You need to tell whether to add or delete a global nickname particle."
        );
      }
    }
  },
};

export default command;
