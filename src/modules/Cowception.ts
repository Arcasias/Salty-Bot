import { EmbedField, Guild, Snowflake } from "discord.js";
import {
  CommandDescriptor,
  Dictionnary,
  Module,
  SaltyEmbedOptions,
} from "../typings";
import { choice, clean, formatDuration, possessive } from "../utils/generic";

const start = [
  "",
  "Want to know why you lost? ",
  "Isn't it obvious? ",
  "I think it was pretty clear ",
];
const sentence = [
  "It was **<subject>**'s fault for <reason>. The punishment will be <punishment>",
  "You lost because **<subject>** was <reason> again. Sanction will be <punishment>",
  "Just ask **<subject>** to think twice before <reason>. This time the sentence will just be <punishment>",
];
const subject = [
  "Antoine",
  "Dorian",
  "Florent",
  "Julien",
  "Martin",
  "Ophélie",
  "that random pickup",
  "your mom",
];
const reason = [
  "not providing enough healing",
  "not healing you enough",
  "repeatedly committing suicide",
  "troll picking",
  "flaming",
  "toxic behaviour",
  "extremely toxic behaviour",
  "being a complete ass throughout the entire game",
  "picking Genji",
  "not taking a good counterpick",
  "saying the N-word",
  "constantly rushing head down into unnessecary fights",
  "being good while no one else was",
  "not knowing his own hero abilities",
  "not knowing how to play",
  "constantly crying",
  "being a pessimistic ass",
  "whining all the time",
];
const punishment = [
  "death",
  "seppuku",
  "sudoku",
  "an apple in the ass",
  "a bunch of apples in the ass",
  "a warning. It's ok for this time",
  "a pat on the head. At least it was well performed",
  "uninstalling Overwatch",
  "being assraped by a gang of 8 strong N-words",
];

const overwatchFaultCommand: CommandDescriptor = {
  name: "fault",
  aliases: ["overwatch", "reason"],
  help: [
    {
      argument: null,
      effect: "Check whose fault it is",
    },
  ],
  guilds: ["458332259947118601"],

  async action({ send }) {
    await send.message(
      (choice(start) + choice(sentence))
        .replace(/<subject>/g, choice(subject))
        .replace(/<reason>/g, choice(reason))
        .replace(/<punishment>/g, choice(punishment))
    );
  },
};

const openedSessions: Dictionnary<{
  password: string;
  startedAt: number;
}> = {};
const OPEN = "open";
const CLOSE = "close";
const pingedRole = "816969856909049858";

const valheimCommand: CommandDescriptor = {
  name: "valheim",
  guilds: ["458332259947118601"],
  help: [
    {
      argument: null,
      effect: "Get a list of all active Valheim sessions.",
    },
    {
      argument: OPEN + " ***password***",
      effect:
        "Announces that you have an open session on Valheim, with the specified password (optional). Don't forget to close it afterward!",
    },
    {
      argument: CLOSE,
      effect: "Closes your current Valheim session.",
    },
  ],
  channel: "guild",
  async action({ args, msg, send, source }) {
    const options: SaltyEmbedOptions = { react: undefined };
    const uid: Snowflake = source.user.id;
    const arg: string = clean(args.shift() || "");
    const active: boolean = uid in openedSessions;

    if (arg === OPEN) {
      if (active) {
        return send.error("Your session is still open.");
      }
      const password = args.shift() || "";
      openedSessions[uid] = {
        password,
        startedAt: Date.now(),
      };
      options.description = password
        ? `Password: **${password}**`
        : "No password set.";
      options.content = `<@&${pingedRole}>`;
      msg.delete().catch();
      return send.success(
        `${possessive(source.name)} server is open. Come and have fun!`,
        options
      );
    } else if (arg === CLOSE) {
      if (!active) {
        return send.error("You haven't started a session yet.");
      }
      const { startedAt } = openedSessions[uid];
      delete openedSessions[uid];
      options.description = `Session duration: ${formatDuration(
        Date.now() - startedAt
      )}`;
      msg.delete().catch();
      return send.error(
        `${possessive(source.name)} server is now closed`,
        options
      );
    } else {
      const guild: Guild = msg.guild!;
      const fields: EmbedField[] = [];
      if (!Object.keys(openedSessions).length) {
        return send.info("There are no active sessions for Valheim right now.");
      }
      for (const uid in openedSessions) {
        const member = guild.members.cache.get(uid);
        const { password } = openedSessions[uid];
        if (member) {
          fields.push({
            name: `${possessive(member.displayName)} session`,
            value: password ? `Password: **${password}**` : "No password set.",
            inline: true,
          });
        } else {
          delete openedSessions[uid];
        }
      }
      return send.info("List of active Valheim sessions", { fields });
    }
  },
};

const cowceptionModule: Module = {
  commands: { misc: [overwatchFaultCommand, valheimCommand] },
};

export default cowceptionModule;
