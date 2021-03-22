import { Guild } from "discord.js";
import Sailor from "../classes/Sailor";
import SaltyModule from "../classes/SaltyModule";
import { extendTable } from "../database/autoDB";
import fields from "../database/fields";
import { CommandDescriptor, SaltyEmbedOptions } from "../typings";
import {
  choice,
  clean,
  formatDuration,
  normalRandom,
  possessive,
} from "../utils/generic";

const MIN_SIZE = 0;
const MAX_SIZE = 30;
const TOKEN_MAX_AMOUNT = 10;
const TOKEN_COOLDOWN = 60 * 60 * 1000;

const TRIM_KW: string[] = ["trim", "cut"];
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

const SIZE_FIRST: string[] = [
  "Congratulations! You have the biggest dick of the hole server!",
  "Look who's number one? It's <first> obviously!",
];
const SIZE_SECOND: string[] = [
  "You have a very large dick, but not as impressive as <first>'s",
  "Second place feels nice too, right?",
];
const SIZE_LAST: string[] = [
  "Look at that fucking loser! You have the smallest dick I've ever seen!",
  "Talk about fucking pathetic.",
  "Bet you can't even grab it with 2 fingers.",
];
const SIZE_NTH: string[] = [
  "You'd better step up your dick game, you're ranked #<rank> out of <total>.",
  "You're ranked #<rank> out of <total>. Not good, not bad I guess.",
];
const SIZE_INCREASE: string[] = [
  "Nice! You won <diff>cm!",
  "Looks like you did manage to grow your penis by <diff>cm. Scientists will hate you!",
  "Enjoy your <diff> additional centimeters.",
];
const SIZE_DECREASE: string[] = [
  "Looks like you lost <diff>cm.",
  "Ouch, you lost <diff>cm!",
  "Say goodbye to your old dick and enjoy this <diff>cm-shorter one.",
];
const SIZE_SAME: string[] = [
  "You don't even realise how low the chances are for this to happen, but yeah: basically nothing has changed.",
];
const TOKEN_ERROR: string[] = [
  "Nope, you can't do that yet! Next roll unlocks in <next>",
  "Calm down on the rolls will ya? You can try again in <next>",
  "Not enough rolls! You can come back in <next>",
];

class DickSailor extends Sailor {
  public dickSize!: number;
  public tokens!: string[];

  public static table = extendTable("sailors", [
    fields.number("dickSize", { nullable: true }),
    fields.varchar("tokens", {
      length: TOKEN_MAX_AMOUNT * 15 + 50,
      defaultValue: [],
    }),
  ]);
}

async function getRankedSailors(guild: Guild) {
  const allSailors = (await DickSailor.search()) as DickSailor[];
  const guildSailors: { id: number; name: string; size: number }[] = [];
  for (const s of allSailors) {
    const member = guild!.members.cache.get(s.discordId);
    if (s.dickSize && member) {
      guildSailors.push({
        id: s.id,
        name: member.displayName,
        size: s.dickSize,
      });
    }
  }
  return guildSailors
    .sort((a, b) => b.size - a.size)
    .map((s, index) => Object.assign(s, { index }));
}

function parseTokens(sailor: DickSailor) {
  const tokens = sailor.tokens.map(Number).sort((a, b) => a - b);
  const now = Date.now();
  const unavailable = [];
  let available = TOKEN_MAX_AMOUNT - tokens.length;
  for (const token of tokens) {
    const diff = now - TOKEN_COOLDOWN - token;
    if (diff >= 0) {
      available++;
    } else {
      unavailable.push(formatDuration(-diff));
    }
  }
  return { available, unavailable };
}

const boardCommand: CommandDescriptor = {
  name: "board",
  aliases: ["b", "score", "scoreboard"],
  channel: "guild",
  async action({ msg, send, source }) {
    const sailor = source.sailor as DickSailor;
    const rankedSailors = await getRankedSailors(msg.guild!);
    const index = rankedSailors.findIndex((s) => s.id === sailor.id);
    // Shows the top 2 + current user
    const top = rankedSailors.slice(0, 2);
    if (index < 2) {
      // If one of the top 2: shows the 3rd as well
      top.push(rankedSailors[2]);
    } else {
      top.push(rankedSailors[index]);
    }
    return send.embed({
      title: `${msg.guild!.name} Dick Scoreboard`,
      fields: top.map((s) => ({
        name: `#${s.index + 1}: ${
          s.index === index ? `You (${source.name})` : s.name
        }`,
        value: `Size: ${s.size.toFixed(2)}cm`,
      })),
    });
  },
};

const dickCommand: CommandDescriptor = {
  name: "mabite",
  aliases: ["dick"],
  channel: "guild",

  async action({ args, msg, send, source, targets }) {
    const target = targets[0] ?? source;
    const sailor = target.sailor as DickSailor;
    const previous = sailor.dickSize;
    const arg = clean(args.shift() || "");

    let action: string | null = null;
    if (TRIM_KW.includes(arg)) {
      action = "trim";
    } else if (
      (target === source && !sailor.dickSize) ||
      UPDATE_KW.includes(arg)
    ) {
      action = "update";
    }
    const rolls = Number(args.shift()) || 1;
    let tokenSpent = 0;

    if (action === "update") {
      const now = Date.now();
      const tokens = sailor.tokens.map(Number);
      let dickSize = 0;
      if (sailor.dickSize) {
        for (let i = 0; i < rolls; i++) {
          if (tokens.length < TOKEN_MAX_AMOUNT) {
            // Tokens are not filled yet
            tokens.push(now);
          } else {
            const oldest = Math.min(...tokens);
            const diff = now - TOKEN_COOLDOWN - oldest;
            if (diff >= 0) {
              // The oldest token is replaced
              tokens.splice(tokens.indexOf(oldest), 1, now);
            } else {
              // No token old enough => sends a warning
              return send.warn(
                choice(TOKEN_ERROR).replace(/<next>/, formatDuration(-diff))
              );
            }
          }
          // Batch rolls only keep the best one.
          const newRoll = normalRandom(5) * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
          if (newRoll > dickSize) {
            dickSize = newRoll;
          }
          tokenSpent++;
        }
      } else {
        // First sample is free ;)
        dickSize = normalRandom(5) * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
      }
      await sailor.update({ dickSize, tokens: tokens.map(String) });
    }

    if (action === "trim") {
      const { unavailable } = parseTokens(source.sailor as DickSailor);
      if (!unavailable.length) {
        return send.warn(`You already have all your tokens.`);
      }
      tokenSpent = -TOKEN_MAX_AMOUNT;
      const dickSize = sailor.dickSize * 0.9;
      await sailor.update({ dickSize, tokens: [] });
    }

    const rankedSailors = await getRankedSailors(msg.guild!);
    const index = rankedSailors.findIndex((s) => s.id === sailor.id);

    const total = String(rankedSailors.length);
    const first = rankedSailors[0].name;
    const rank = String(index);
    let descMsgs = SIZE_NTH;
    switch (index) {
      case 0:
        descMsgs = SIZE_FIRST;
        break;
      case 1:
        descMsgs = SIZE_SECOND;
        break;
      case rankedSailors.length - 1:
        descMsgs = SIZE_LAST;
        break;
    }
    const description = [
      choice(descMsgs)
        .replace(/<rank>/, rank)
        .replace(/<total>/, total)
        .replace(/<first>/, first),
    ];
    if (previous && action === "update") {
      let msgs = SIZE_SAME;
      if (sailor.dickSize < previous) {
        msgs = SIZE_DECREASE;
      } else if (sailor.dickSize > previous) {
        msgs = SIZE_INCREASE;
      }
      description.push(
        `The previous size was **${previous.toFixed(2)}cm**. ${choice(
          msgs
        ).replace(/<diff>/, Math.abs(sailor.dickSize - previous).toFixed(2))}`
      );
    }
    const embedOptions: SaltyEmbedOptions = {
      title: `${possessive(target.name)} dick is ${
        action ? "now " : ""
      }${sailor.dickSize.toFixed(2)}cm long!`,
      description: description.join("\n"),
    };
    if (tokenSpent !== 0) {
      embedOptions.footer = {
        text: `You ${tokenSpent < 0 ? "gained" : "spent"} ${Math.abs(
          tokenSpent
        )} tokens.`,
      };
    }
    return send.embed(embedOptions);
  },
};

const tokenCommand: CommandDescriptor = {
  name: "token",
  channel: "guild",
  async action({ send, source }) {
    const { available, unavailable } = parseTokens(source.sailor as DickSailor);
    return send.embed({
      title: `You're currently holding ${available} tokens.`,
      description: unavailable.length
        ? `Your next tokens will unlock in:\`\`\`\n\n${unavailable
            .map((t, i) => `${i + 1}) ${t}`)
            .join("\n")}\`\`\``
        : "",
    });
  },
};

export default class DickModule extends SaltyModule {
  public category = {
    name: "dick",
    description: "Dick commands",
    icon: "🍆",
    order: 20,
  };
  public commands = { dick: [boardCommand, dickCommand, tokenCommand] };
}
