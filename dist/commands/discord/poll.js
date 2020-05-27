"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const VOTE_LENGTH = 20;
const VOTE_CHAR = "🟦";
const OPTION_SEPARATOR = ";";
const OPTION_NUMBERS = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
];
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
    channel: "guild",
    async action({ args, msg, target }) {
        if (!args.length) {
            return Salty_1.default.warn(msg, `You need to specify options to create a poll.`);
        }
        const optionTexts = args.join(" ").split(OPTION_SEPARATOR);
        if (optionTexts.length < 2) {
            return Salty_1.default.warn(msg, `You need to specify more than one option to create a poll.`);
        }
        if (optionTexts.length > OPTION_NUMBERS.length) {
            return Salty_1.default.warn(msg, `You need to specify less than ${OPTION_NUMBERS.length} options to create a poll.`);
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
        const pollOptions = optionTexts.map((text, index) => ({
            text,
            votes: new Set(),
            reaction: OPTION_NUMBERS[index],
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
        const initMessage = Salty_1.default.embed(msg, embedOptions);
        const pollMessage = await initMessage;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9kaXNjb3JkL3BvbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwyQ0FBMEU7QUFDMUUsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUV4Qyx1Q0FBeUM7QUFFekMsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQztBQUN2QixNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztBQUM3QixNQUFNLGNBQWMsR0FBRztJQUNuQixLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxJQUFJO0NBQ1AsQ0FBQztBQUVGLFNBQVMsTUFBTSxDQUNYLEtBQWEsRUFDYixPQUFnQixFQUNoQixPQUFxQixFQUNyQixNQUFlLEtBQUs7SUFFcEIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sS0FBSyxHQUFHLElBQUkseUJBQVksQ0FBQztRQUMzQixLQUFLO1FBQ0wsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sVUFBVSxHQUNaLE1BQU0sR0FBRyxDQUFDO2dCQUNOLENBQUMsQ0FBQyxJQUFJ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