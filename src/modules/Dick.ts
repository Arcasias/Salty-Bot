import Sailor from "../classes/Sailor";
import { extendTable } from "../database/autoDB";
import fields from "../database/fields";
import { CommandDescriptor, Module } from "../typings";
import { clean, gaussian, possessive } from "../utils/generic";

const UPDATE_KW = [
  "update",
  "reset",
  "roll",
  "reroll",
  "try",
  "retry",
  "grow",
  "increase",
];
const BOARD_KW = [
  "list",
  "ls",
  "l",
  "board",
  "b",
  "score",
  "scoreboard",
  "all",
  "server",
];

class DickSailor extends Sailor {
  public dickSize!: number;

  public static table = extendTable("sailors", [
    fields.number("dickSize", { nullable: true }),
  ]);
}

const MIN_DICK_SIZE = 1;
const MAX_DICK_SIZE = 30;

const dickCommand: CommandDescriptor = {
  name: "mabite",
  aliases: ["dick"],
  channel: "guild",

  async action({ args, msg, send, source, targets }) {
    const target = targets[0] ?? source;
    const sailor = target.sailor as DickSailor;
    const previous = sailor.dickSize;
    const arg = clean(args[0] || "");

    const showBoard = BOARD_KW.includes(arg);
    const willUpdate =
      (target === source && !sailor.dickSize) || UPDATE_KW.includes(arg);

    if (willUpdate) {
      const dickSize = gaussian(MIN_DICK_SIZE, MAX_DICK_SIZE, 4);
      await sailor.update({ dickSize });
    }

    const allSailors = (await DickSailor.search()) as DickSailor[];
    const guildSailors: { id: number; name: string; size: number }[] = [];
    for (const s of allSailors) {
      const member = msg.guild!.members.cache.get(s.discordId);
      if (s.dickSize && member) {
        guildSailors.push({
          id: s.id,
          name: member.displayName,
          size: s.dickSize,
        });
      }
    }
    const rankedSailors = guildSailors.sort((a, b) => b.size - a.size);
    const rank = rankedSailors.findIndex((s) => s.id === sailor.id);

    if (showBoard) {
      const top3 = rankedSailors.slice(0, 3);
      const you = `You (${source.name})`;
      const fields = top3.map((s, i) => ({
        name: `#${i + 1}: ${i === rank ? you : s.name}`,
        value: `Size: ${s.size.toFixed(2)}cm`,
      }));
      if (rank > 2) {
        fields.push({
          name: `#${rank + 1}: ${you}`,
          value: `Size: ${sailor.dickSize.toFixed(2)}cm`,
        });
      }
      return send.embed({
        title: `${msg.guild!.name} Dick Scoreboard`,
        fields,
      });
    }

    let description;
    switch (rank) {
      case 0: {
        description = `Congratulations! You have the biggest dick of the hole server!`;
        break;
      }
      case 1: {
        description = `You have a very large dick, but not as impressive as ${possessive(
          rankedSailors[0].name
        )}`;
        break;
      }
      case 2: {
        description = `Still the 3rd biggest dick on this server!`;
        break;
      }
      case rankedSailors.length - 1: {
        description = `Look at that fucking looser! You have the smallest dick I've ever seen!`;
        break;
      }
      default: {
        description = `You'd better step up your dick game, you're ranked #${rank} out of ${rankedSailors.length}`;
      }
    }
    if (previous && willUpdate) {
      description += `\nThe previous size was *${previous.toFixed(2)}cm*. `;
      if (sailor.dickSize < previous) {
        description +=
          "This has been the worst trade deal in the history of trade deals, maybe ever.";
      } else {
        description += "That's nice improvement :)";
      }
    }
    return send.embed({
      title: `${possessive(target.name)} dick is ${sailor.dickSize.toFixed(
        2
      )}cm long!`,
      description,
    });
  },
};

const dickModule: Module = {
  commands: [{ category: "misc", command: dickCommand }],
};

export default dickModule;
