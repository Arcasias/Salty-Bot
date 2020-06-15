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
const terms_1 = require("../terms");
const utils_1 = require("../utils");
const Command_1 = __importDefault(require("./Command"));
const Database_1 = require("./Database");
const Formatter_1 = __importDefault(require("./Formatter"));
const Guild_1 = __importDefault(require("./Guild"));
const QuickCommand_1 = __importDefault(require("./QuickCommand"));
const User_1 = __importDefault(require("./User"));
const bot = new discord_js_1.default.Client();
const runningCollectors = {};
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
        if (terms_1.keywords.help.includes(msgArgs[0])) {
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
                channel.send(utils_1.title(utils_1.choice(terms_1.intro)));
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
function hasAccess(access, user, guild = null) {
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
    for (const collector of Object.values(runningCollectors)) {
        collector.stop("restarted");
    }
    bot.destroy();
    await bot.login(process.env.DISCORD_API);
}
async function destroy() {
    utils_1.log("Disconnecting ...");
    for (const collector of Object.values(runningCollectors)) {
        collector.stop("disconnected");
    }
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
        options.color = 0xfefefe;
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
        if (msg.author.id in runningCollectors) {
            runningCollectors[msg.author.id].stop("newer-collector");
        }
        const { reactions, onAdd, onRemove, onEnd } = actions;
        const collector = newMessage.createReactionCollector((reaction, user) => !user.bot && reactions.includes(reaction.emoji.name), { time: 3 * 60 * 1000 });
        runningCollectors[msg.author.id] = collector;
        const abort = () => collector.stop("option-selected");
        if (onAdd) {
            collector.on("collect", async (reaction, user) => {
                await Promise.all(reactionPromises);
                return onAdd(reaction, user, abort);
            });
        }
        if (onRemove) {
            collector.on("remove", async (reaction, user) => {
                await Promise.all(reactionPromises);
                return onRemove(reaction, user, abort);
            });
        }
        collector.on("end", async (collected, reason) => {
            delete runningCollectors[msg.author.id];
            await Promise.all(reactionPromises);
            newMessage.reactions.removeAll();
            collector.empty();
            if (onEnd) {
                return onEnd(collected, reason);
            }
        });
        const reactionPromises = [];
        for (const reaction of reactions) {
            if (newMessage.deleted || collector.ended) {
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
function hasPermission(guild, permisson) {
    var _a;
    return (_a = guild.members.cache.get(bot.user.id)) === null || _a === void 0 ? void 0 : _a.permissions.has(permisson);
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
    destroy,
    embed,
    error,
    getTextChannel,
    hasAccess,
    hasPermission,
    start,
    message,
    restart,
    success,
    warn,
    wtf,
};
