import { GuildMember, Message } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { meaning } from "../../utils/generic";

async function changeNames(
  msg: Message,
  mutator: (nickname: string) => string
) {
  const members: GuildMember[] = msg.guild!.members.cache.array();
  const progressMsg = await salty.message(
    msg,
    `Changing ${members.length} nicknames...`
  );
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
      await progressMsg
        .edit({
          content: `Changing nicknames: ${i++}/${members.length}`,
        })
        .catch();
      updating = false;
    }
  });
  await Promise.all(promises);
  await Promise.allSettled([
    progressMsg.delete(),
    salty.success(msg, "Nicknames successfully changed"),
  ]);
}

const command: CommandDescriptor = {
  name: "nickname",
  aliases: ["name", "nick", "pseudo"],
  help: [
    {
      argument: "add `particle`",
      effect:
        "Appends the `particle` to every possible nickname in the server. Careful to not exceed 32 characters!",
    },
    {
      argument: "remove `particle`",
      effect: "Removes the `particle` from each matching nickname",
    },
  ],
  permissions: ["MANAGE_NICKNAMES"],
  access: "admin",
  channel: "guild",

  async action({ args, msg, send }) {
    const particle: string = args.slice(1).join(" ");
    const particleRegex = new RegExp(particle, "g");

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
        return send.warn(
          "You need to specify what nickname particle will be targeted."
        );
      }
      default: {
        return send.warn(
          "You need to tell whether to add or delete a global nickname particle."
        );
      }
    }
  },
};

export default command;
