import { Collection, MessageEmbed } from "discord.js";
import salty from "../../salty";
import {
  CommandDescriptor,
  MessageAction,
  PollOption,
  SaltyEmbedOptions,
} from "../../typings";
import { getNumberReactions, possessive } from "../../utils/generic";

const VOTE_LENGTH = 20;
const VOTE_CHARS = ["🟥", "🟩", "🟦", "🟨", "🟪", "🟫", "⬜", "🟧", " ⬛"];
const OPTION_SEPARATOR = ";";

const command: CommandDescriptor = {
  name: "poll",
  channel: "guild",
  async action({ args, msg, send }) {
    if (!args.length) {
      return send.warn(`You need to specify options to create a poll.`);
    }
    const optionTexts = args.join(" ").split(OPTION_SEPARATOR);
    if (optionTexts.length < 2) {
      return send.warn(
        `You need to specify more than one option to create a poll.`
      );
    }
    if (optionTexts.length > VOTE_CHARS.length) {
      return send.warn(
        `You need to specify less than ${VOTE_CHARS.length} options to create a poll.`
      );
    }

    msg.delete().catch();

    const title = `${possessive(msg.member!.displayName)} poll`;
    const numberEmojis = getNumberReactions(VOTE_CHARS.length);
    const pollOptions: PollOption[] = optionTexts.map((text, index) => ({
      text,
      votes: new Set(),
      reaction: numberEmojis[index],
    }));
    const embedOptions: SaltyEmbedOptions = {
      title: `${possessive(msg.member!.displayName)} poll`,
      fields: pollOptions.map((option, index) => ({
        name: `${index + 1}) ${option.text}`,
        value: "No votes",
      })),
    };
    const initMessage = send.embed(embedOptions);
    const pollMessage = await initMessage;

    if (!pollMessage) {
      return;
    }

    function getEmbed(end?: boolean) {
      const votes = pollOptions.map(({ votes }) => votes.size);
      const mostVotes = Math.max(1, ...votes);
      const embed = new MessageEmbed({
        title,
        fields: pollOptions.map(({ text }, index) => {
          const length = Math.floor(VOTE_LENGTH / mostVotes) * votes[index];
          const voteString =
            length > 0
              ? new Array(length).fill(VOTE_CHARS[index]).join(" ")
              : "No votes";
          const won = end && votes[index] === mostVotes ? " (won)" : "";
          return {
            name: `${index + 1}) ${text}${won}`,
            value: voteString,
            inline: false,
          };
        }),
      });
      if (end) {
        embed.setFooter("This poll has ended.");
      }
      return embed;
    }

    const actions = new Collection<string, MessageAction>();
    for (const option of pollOptions) {
      const { reaction } = option;
      actions.set(reaction, {
        onAdd: async (user) => {
          await initMessage;
          option.votes.add(user.username);
          await pollMessage.edit(getEmbed()).catch();
        },
        onRemove: async (user) => {
          await initMessage;
          option.votes.delete(user.username);
          await pollMessage.edit(getEmbed()).catch();
        },
      });
    }
    salty.addActions(
      pollMessage,
      {
        actions,
        async onEnd() {
          await initMessage;
          await pollMessage.edit(getEmbed(true)).catch();
        },
      },
      msg.author.id
    );
  },
};

export default command;
