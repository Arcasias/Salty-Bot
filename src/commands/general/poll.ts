import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { PollOption, SaltyEmbedOptions } from "../../types";
import { getNumberReactions, possessive } from "../../utils";

const VOTE_LENGTH = 20;
const VOTE_CHAR = "🟦";
const OPTION_SEPARATOR = ";";
const OPTION_AMOUNT = 10;

function update(
    title: string,
    message: Message,
    options: PollOption[],
    end: boolean = false
) {
    const votes = options.map((option) => option.votes.size);
    const mostVotes = Math.max(1, ...votes);
    const embed = new MessageEmbed({
        title,
        fields: options.map((option, index) => {
            const length = Math.floor(VOTE_LENGTH / mostVotes) * votes[index];
            const voteString =
                length > 0
                    ? new Array(length).fill(VOTE_CHAR).join(" ")
                    : "No votes";
            return {
                name: `${index + 1}) ${option.text}${
                    end && votes[index] === mostVotes ? " (won)" : ""
                }`,
                value: voteString,
                inline: false,
            };
        }),
    });
    if (end) {
        embed.setFooter("This poll has ended.");
    }
    return message.edit(embed);
}

Command.register({
    name: "poll",
    category: "general",
    channel: "guild",
    async action({ args, msg }) {
        if (!args.length) {
            return Salty.warn(
                msg,
                `You need to specify options to create a poll.`
            );
        }
        const optionTexts = args.join(" ").split(OPTION_SEPARATOR);
        if (optionTexts.length < 2) {
            return Salty.warn(
                msg,
                `You need to specify more than one option to create a poll.`
            );
        }
        if (optionTexts.length > OPTION_AMOUNT) {
            return Salty.warn(
                msg,
                `You need to specify less than ${OPTION_AMOUNT} options to create a poll.`
            );
        }

        msg.delete().catch();

        async function onAdd({ emoji }: MessageReaction, user: User) {
            await initMessage;
            const option = pollOptions.find((o) => o.reaction === emoji.name)!;
            option.votes.add(user.username);
            update(title, pollMessage, pollOptions);
        }

        async function onRemove({ emoji }: MessageReaction, user: User) {
            await initMessage;
            const option = pollOptions.find((o) => o.reaction === emoji.name)!;
            option.votes.delete(user.username);
            update(title, pollMessage, pollOptions);
        }

        const title = `${possessive(msg.member!.displayName)} poll`;
        const numberEmojis = getNumberReactions(OPTION_AMOUNT);
        const pollOptions: PollOption[] = optionTexts.map((text, index) => ({
            text,
            votes: new Set(),
            reaction: numberEmojis[index],
        }));
        const embedOptions: SaltyEmbedOptions = {
            actions: {
                onAdd,
                onRemove,
                async onEnd() {
                    await initMessage;
                    update(title, pollMessage, pollOptions, true);
                },
                reactions: pollOptions.map((o) => o.reaction),
            },
            title: `${possessive(msg.member!.displayName)} poll`,
            fields: pollOptions.map((option, index) => ({
                name: `${index + 1}) ${option.text}`,
                value: "No votes",
            })),
        };
        const initMessage = Salty.embed(msg, embedOptions);
        const pollMessage = await initMessage;
    },
});
