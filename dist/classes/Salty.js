"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
const config_1 = require("../config");
const list = __importStar(require("../terms"));
const utils_1 = require("../utils");
const Command_1 = __importDefault(require("./Command"));
const Database_1 = require("./Database");
const Formatter_1 = __importDefault(require("./Formatter"));
const Guild_1 = __importDefault(require("./Guild"));
const QuickCommand_1 = __importDefault(require("./QuickCommand"));
const User_1 = __importDefault(require("./User"));
const bot = new discord_js_1.default.Client();
const startTime = new Date();
async function onChannelDelete(channel) {
    if (!(channel instanceof discord_js_1.GuildChannel)) {
        return;
    }
    Guild_1.default.each(async (guild) => {
        if (guild.default_channel === channel.id) {
            const relatedGuild = Guild_1.default.get(channel.guild.id);
            if (relatedGuild) {
                Guild_1.default.update(relatedGuild.id, { default_channel: false });
            }
        }
    });
}
async function onError(err) {
    utils_1.error(err);
    restart();
}
async function onGuildCreate(guild) {
    Guild_1.default.create({ discord_id: guild.id });
}
async function onGuildDelete(guild) {
    if (guild.member(bot.user)) {
        const relatedGuild = Guild_1.default.get(guild.id);
        if (relatedGuild) {
            Guild_1.default.remove(relatedGuild.id);
        }
    }
}
async function onGuildMemberAdd(member) {
    const guild = Guild_1.default.get(member.guild.id);
    if (guild === null || guild === void 0 ? void 0 : guild.default_channel) {
        const channel = getTextChannel(guild.default_channel);
        channel.send(`Hey there ${member.user}! Have a great time here (͡° ͜ʖ ͡°)`);
    }
    if (guild === null || guild === void 0 ? void 0 : guild.default_role) {
        member.roles.add(guild.default_role);
    }
}
async function onGuildMemberRemove(member) {
    var _a;
    const guild = Guild_1.default.get(member.guild.id);
    if (guild === null || guild === void 0 ? void 0 : guild.default_channel) {
        const channel = getTextChannel(guild.default_channel);
        const name = ((_a = member.user) === null || _a === void 0 ? void 0 : _a.username) || "unknown";
        channel.send(`Well, looks like ${name} got bored of us :c`);
    }
}
async function onMessage(msg) {
    var _a, _b;
    const { author, guild, mentions } = msg;
    let { content } = msg;
    if (author.bot) {
        return;
    }
    const user = User_1.default.get(author.id);
    const mention = mentions.users.first();
    const mentioned = Boolean(msg.mentions.users.size);
    const target = {
        user: mentioned ? msg.mentions.users.first() : msg.author,
        member: mentioned ? msg.mentions.members.first() : msg.member,
        isMention: mentioned,
        name: "",
    };
    const nickname = (_a = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(bot.user.id)) === null || _a === void 0 ? void 0 : _a.nickname;
    const botNameRegex = bot.user.username + (nickname ? `|${utils_1.clean(nickname)}` : "");
    let interaction = content.startsWith(config_1.prefix);
    if (interaction) {
        content = content.slice(1);
    }
    else if (msg.guild) {
        interaction =
            new RegExp(botNameRegex, "i").test(content) ||
                (mention === null || mention === void 0 ? void 0 : mention.id) === bot.user.id;
    }
    if (!interaction) {
        return;
    }
    utils_1.request(((_b = msg.guild) === null || _b === void 0 ? void 0 : _b.name) || "DM", author.username, content);
    if (user === null || user === void 0 ? void 0 : user.black_listed) {
        return error(msg, "you seem to be blacklisted. To find out why, ask my glorious creator");
    }
    if (!user) {
        await User_1.default.create({ discord_id: author.id });
    }
    if (mention && !mention.bot) {
        const mentionUser = User_1.default.get(mention.id);
        if (!mentionUser) {
            await User_1.default.create({ discord_id: mention.id });
        }
    }
    const msgArgs = content.split(" ").filter((word) => Boolean(word.trim()));
    if (!msgArgs.length) {
        return message(msg, "yes?");
    }
    const actionName = msgArgs.shift() || "";
    const commandName = Command_1.default.aliases.get(utils_1.clean(actionName));
    let command;
    let commandArgs = msgArgs;
    if (commandName) {
        if (list.help.includes(msgArgs[0])) {
            commandArgs = [commandName];
            command = Command_1.default.list.get("help");
        }
        else {
            command = Command_1.default.list.get(commandName);
        }
    }
    else {
        const closests = utils_1.search([...Command_1.default.aliases.keys()], actionName, 2);
        if (closests.length) {
            const cmds = {};
            for (const key of closests) {
                const cmdName = Command_1.default.aliases.get(key);
                if (!(cmdName in cmds)) {
                    cmds[cmdName] = key;
                }
            }
            return message(msg, `command "*${actionName}*" doesn't exist. Did you mean "*${Object.values(cmds).join(`*" or "*`)}*"?`);
        }
        command = Command_1.default.list.get("talk");
    }
    command.run(msg, commandArgs, target);
}
async function onReady() {
    const preGuilds = [];
    bot.user.setStatus("online");
    bot.guilds.cache.forEach((discordGuild) => {
        const guild = Guild_1.default.get(discordGuild.id);
        if (guild) {
            if (guild.default_channel) {
                const channel = getTextChannel(guild.default_channel);
                channel.send(utils_1.title(utils_1.choice(list.intro)));
            }
        }
        else {
            preGuilds.push({ discord_id: discordGuild.id });
        }
    });
    if (preGuilds.length) {
        await Guild_1.default.create(...preGuilds);
    }
    const loadingTime = Math.floor((Date.now() - startTime.getTime()) / 100) / 10;
    utils_1.log(`${Command_1.default.list.size} commands loaded. ${Command_1.default.aliases.size} keys in total.`);
    utils_1.log(`Salty loaded in ${loadingTime} second${loadingTime === 1 ? "" : "s"} and ready to salt the chat :D`);
}
function checkPermission(access, user, guild = null) {
    if (access === "public") {
        return true;
    }
    switch (access) {
        case "admin":
            return guild ? utils_1.isAdmin(user, guild) : false;
        case "dev":
            return utils_1.isDev(user);
        case "owner":
            return utils_1.isOwner(user);
    }
    return false;
}
async function restart() {
    utils_1.log("Restarting ...");
    bot.destroy();
    await bot.login(process.env.DISCORD_API);
}
async function destroy() {
    utils_1.log("Disconnecting ...");
    bot.destroy();
    await Database_1.disconnect();
    process.exit();
}
async function embed(msg, options = {}) {
    var _a;
    let { actions, react } = options;
    const inline = options.inline || false;
    const content = options.content || "";
    if (!options.color) {
        options.color = 0xffffff;
    }
    if (options.title) {
        options.title = Formatter_1.default.format(utils_1.title(options.title), msg);
    }
    if (options.description) {
        options.description = Formatter_1.default.format(utils_1.title(options.description), msg);
    }
    if ((_a = options.footer) === null || _a === void 0 ? void 0 : _a.text) {
        options.footer.text = Formatter_1.default.format(utils_1.title(options.footer.text), msg);
    }
    if (options.fields) {
        options.fields = options.fields.map((field) => {
            return {
                name: utils_1.title(field.name),
                value: Formatter_1.default.format(utils_1.title(field.value), msg),
                inline,
            };
        });
    }
    const embed = new discord_js_1.MessageEmbed(options);
    const newMessage = await message(msg, utils_1.ellipsis(utils_1.title(Formatter_1.default.format(content, msg))), {
        embed,
        files: options.files,
    });
    if (react && !msg.deleted) {
        msg.react(react).catch();
    }
    if (actions) {
        const { reactions, onAdd, onRemove, onEnd } = actions;
        const collector = newMessage.createReactionCollector((reaction, user) => !user.bot && reactions.includes(reaction.emoji.name), { time: 3 * 60 * 1000 });
        if (onAdd) {
            collector.on("collect", async (reaction, user) => {
                await Promise.all(reactionPromises);
                return onAdd(reaction, user);
            });
        }
        if (onRemove) {
            collector.on("remove", async (reaction, user) => {
                await Promise.all(reactionPromises);
                return onRemove(reaction, user);
            });
        }
        collector.on("end", async (collected, reason) => {
            await Promise.all(reactionPromises);
            newMessage.reactions.removeAll();
            collector.empty();
            if (onEnd) {
                return onEnd(collected, reason);
            }
        });
        const reactionPromises = [];
        for (const reaction of reactions) {
            if (newMessage.deleted) {
                break;
            }
            const reactionPromise = newMessage.react(reaction);
            reactionPromises.push(reactionPromise);
            await reactionPromise;
        }
    }
    return newMessage;
}
function error(msg, text = "error", options = {}) {
    return embed(msg, Object.assign({
        title: text,
        react: "❌",
        color: 0xc80000,
    }, options));
}
function getTextChannel(channelId) {
    console.log({ channelId });
    const channel = bot.channels.cache.get(channelId);
    if (!(channel instanceof discord_js_1.TextChannel)) {
        throw new Error(`Channel "${channelId}" is not a text channel.`);
    }
    return channel;
}
function message(msg, text, options) {
    return msg.channel.send(text && utils_1.ellipsis(utils_1.title(Formatter_1.default.format(text, msg))), options);
}
async function start() {
    utils_1.log("Initializing Salty");
    await Database_1.connect();
    await Promise.all([
        QuickCommand_1.default.load(),
        User_1.default.load(),
        Guild_1.default.load(),
    ]);
    await bot.login(process.env.DISCORD_API);
}
function success(msg, text = "success", options = {}) {
    return embed(msg, Object.assign({
        title: text,
        react: "✅",
        color: 0x00c800,
    }, options));
}
function warn(msg, text = "success", options = {}) {
    return embed(msg, Object.assign({
        title: text,
        react: "⚠️",
        color: 0xc8c800,
    }, options));
}
function wtf(msg) {
    return error(msg, "What the fuck");
}
function catchHandler(handler) {
    return function () {
        try {
            return handler(...arguments);
        }
        catch (err) {
            utils_1.error(err);
        }
    };
}
bot.on("channelDelete", catchHandler(onChannelDelete));
bot.on("error", catchHandler(onError));
bot.on("guildCreate", catchHandler(onGuildCreate));
bot.on("guildDelete", catchHandler(onGuildDelete));
bot.on("guildMemberAdd", catchHandler(onGuildMemberAdd));
bot.on("guildMemberRemove", catchHandler(onGuildMemberRemove));
bot.on("message", catchHandler(onMessage));
bot.on("ready", catchHandler(onReady));
exports.default = {
    bot,
    startTime,
    checkPermission,
    destroy,
    embed,
    error,
    getTextChannel,
    start,
    message,
    restart,
    success,
    warn,
    wtf,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2FsdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9TYWx0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5REFVb0I7QUFDcEIsc0NBQW1DO0FBQ25DLCtDQUFpQztBQU9qQyxvQ0FZa0I7QUFDbEIsd0RBQWdDO0FBQ2hDLHlDQUFpRDtBQUNqRCw0REFBb0M7QUFDcEMsb0RBQTRCO0FBQzVCLGtFQUEwQztBQUMxQyxrREFBMEI7QUFFMUIsTUFBTSxHQUFHLEdBQW1CLElBQUksb0JBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNqRCxNQUFNLFNBQVMsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0FBTW5DLEtBQUssVUFBVSxlQUFlLENBQzFCLE9BQW1DO0lBRW5DLElBQUksQ0FBQyxDQUFDLE9BQU8sWUFBWSx5QkFBWSxDQUFDLEVBQUU7UUFDcEMsT0FBTztLQUNWO0lBQ0QsZUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBWSxFQUFFLEVBQUU7UUFDOUIsSUFBSSxLQUFLLENBQUMsZUFBZSxLQUFLLE9BQU8sQ0FBQyxFQUFFLEVBQUU7WUFDdEMsTUFBTSxZQUFZLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELElBQUksWUFBWSxFQUFFO2dCQUNkLGVBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQzdEO1NBQ0o7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxLQUFLLFVBQVUsT0FBTyxDQUFDLEdBQVU7SUFDN0IsYUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsT0FBTyxFQUFFLENBQUM7QUFDZCxDQUFDO0FBRUQsS0FBSyxVQUFVLGFBQWEsQ0FBQyxLQUFvQjtJQUM3QyxlQUFLLENBQUMs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