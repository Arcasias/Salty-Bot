"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../classes/Command"));
const salty_1 = __importDefault(require("../../salty"));
const utils_1 = require("../../utils");
const VOTE_LENGTH = 20;
const VOTE_CHAR = "🟦";
const OPTION_SEPARATOR = ";";
const OPTION_AMOUNT = 10;
function update(title, message, options, end = false) {
    const votes = options.map((option) => option.votes.size);
    const mostVotes = Math.max(1, ...votes);
    const embed = new discord_js_1.MessageEmbed({
        title,
        fields: options.map((option, index) => {
            const length = Math.floor(VOTE_LENGTH / mostVotes) * votes[index];
            const voteString = length > 0
                ? new Array(length).fill(VOTE_CHAR).join(" ")
                : "No votes";
            return {
                name: `${index + 1}) ${option.text}${end && votes[index] === mostVotes ? " (won)" : ""}`,
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
Command_1.default.register({
    name: "poll",
    category: "general",
    channel: "guild",
    async action({ args, msg }) {
        if (!args.length) {
            return salty_1.default.warn(msg, `You need to specify options to create a poll.`);
        }
        const optionTexts = args.join(" ").split(OPTION_SEPARATOR);
        if (optionTexts.length < 2) {
            return salty_1.default.warn(msg, `You need to specify more than one option to create a poll.`);
        }
        if (optionTexts.length > OPTION_AMOUNT) {
            return salty_1.default.warn(msg, `You need to specify less than ${OPTION_AMOUNT} options to create a poll.`);
        }
        msg.delete().catch();
        async function onAdd({ emoji }, user) {
            await initMessage;
            const option = pollOptions.find((o) => o.reaction === emoji.name);
            option.votes.add(user.username);
            update(title, pollMessage, pollOptions);
        }
        async function onRemove({ emoji }, user) {
            await initMessage;
            const option = pollOptions.find((o) => o.reaction === emoji.name);
            option.votes.delete(user.username);
            update(title, pollMessage, pollOptions);
        }
        const title = `${utils_1.possessive(msg.member.displayName)} poll`;
        const numberEmojis = utils_1.getNumberReactions(OPTION_AMOUNT);
        const pollOptions = optionTexts.map((text, index) => ({
            text,
            votes: new Set(),
            reaction: numberEmojis[index],
        }));
        const embedOptions = {
            actions: {
                onAdd,
                onRemove,
                async onEnd() {
                    await initMessage;
                    update(title, pollMessage, pollOptions, true);
                },
                reactions: pollOptions.map((o) => o.reaction),
            },
            title: `${utils_1.possessive(msg.member.displayName)} poll`,
            fields: pollOptions.map((option, index) => ({
                name: `${index + 1}) ${option.text}`,
                value: "No votes",
            })),
        };
        const initMessage = salty_1.default.embed(msg, embedOptions);
        const pollMessage = await initMessage;
    },
});
