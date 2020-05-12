"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = require("../config");
const list = __importStar(require("../list"));
const utils_1 = require("../utils");
const Database_1 = __importDefault(require("./Database"));
const Dialog_1 = __importDefault(require("./Dialog"));
const Guild_1 = __importDefault(require("./Guild"));
const QuickCommand_1 = __importDefault(require("./QuickCommand"));
const User_1 = __importDefault(require("./User"));
const Exception_1 = require("./Exception");
const Formatter_1 = __importDefault(require("./Formatter"));
const bot = new discord_js_1.default.Client();
const commandsRootPath = ["src", "commands"];
const commands = {
    list: new discord_js_1.default.Collection(),
    keys: {},
    help: {},
};
const startTime = new Date();
async function _destroy(restart) {
    utils_1.log("Disconnecting ...");
    bot.destroy();
    if (restart) {
        commands.list.clear();
        commands.keys = {};
        commands.help = {};
        await _loadCommands(...commandsRootPath).then(() => utils_1.log("Static commands loaded"));
        await bot.login(process.env.DISCORD_API);
    }
    else {
        await Database_1.default.disconnect();
        process.exit();
    }
}
async function _loadCommand(commandPath, category) {
    const commandImport = await Promise.resolve().then(() => __importStar(require(commandPath)));
    const command = commandImport.default;
    const { name, keys, visibility } = command;
    if (process.env.DEBUG === "true") {
        for (let key of [name, ...keys]) {
            if (commands.list.get(key)) {
                throw new Error(`Key "${key}" of command ${name} conflicts with command of the same name.`);
            }
            if (key in commands.keys) {
                throw new Error(`Duplicate key "${key}" in command "${name}".`);
            }
            if (key in commands.help || category === key) {
                throw new Error(`Key "${key}" of command "${name}" is already a category.`);
            }
        }
    }
    commands.list.set(name, command);
    commands.keys[name] = name;
    keys.forEach((key) => {
        commands.keys[key] = name;
    });
    commands.help[category].commands.push({ name, keys, visibility });
}
async function _loadCommands(...paths) {
    const dirpath = path_1.join(...paths);
    const files = await utils_1.promisify(fs_1.readdir.bind(null, dirpath));
    const category = dirpath.split(path_1.sep).pop();
    if (files.includes("__category__.json")) {
        const categoryInfoPath = path_1.join(dirpath, "__category__.json");
        const categoryInfo = JSON.parse(String(fs_1.readFileSync(categoryInfoPath)));
        commands.help[category] = {
            info: categoryInfo,
            commands: [],
        };
    }
    const promises = files.map((file) => {
        const fullpath = path_1.join(dirpath, file);
        const stats = fs_1.statSync(fullpath);
        const extension = file.split(".").pop();
        if (stats.isDirectory()) {
            _loadCommands(fullpath);
        }
        else if (["ts", "js", "cjs", "mjs"].includes(extension)) {
            try {
                const commandPath = path_1.join("..", "..", fullpath).replace(path_1.sep, "/");
                return _loadCommand(commandPath, category);
            }
            catch (err) {
                utils_1.error(`Could not load file "${file}:"`, err.stack);
            }
        }
    });
    await Promise.all(promises);
}
async function _onChannelDelete(channel) {
    Guild_1.default.each((guild) => {
        if (guild.default_channel === channel.id) {
            const guildDBId = Guild_1.default.get(channel.guild.id).id;
            Guild_1.default.update(guildDBId, { default_channel: false });
        }
    });
}
async function _onError(err) {
    utils_1.error(err);
    restart();
}
async function _onGuildCreate(guild) {
    Guild_1.default.create({ discord_id: guild.id });
}
async function _onGuildDelete(guild) {
    if (guild.member(bot.user)) {
        const guildDBId = Guild_1.default.get(guild.id).id;
        Guild_1.default.remove(guildDBId);
    }
}
async function _onGuildMemberAdd(member) {
    const guild = Guild_1.default.get(member.guild.id);
    if (guild.default_channel) {
        const channel = getTextChannel(guild.default_channel);
        channel.send(`Hey there ${member.user}! Have a great time here (͡° ͜ʖ ͡°)`);
    }
    if (guild.default_role) {
        try {
            member.roles.add(guild.default_role);
        }
        catch (err) {
            utils_1.error(`Couldn't add default role to ${member.user.username}: permission denied`);
        }
    }
}
async function _onGuildMemberRemove(member) {
    const guild = Guild_1.default.get(member.guild.id);
    if (guild.default_channel) {
        const channel = getTextChannel(guild.default_channel);
        channel.send(`Well, looks like ${member.user.username} got bored of us :c`);
    }
}
async function _onMessage(msg) {
    const author = msg.author;
    const user = User_1.default.get(author.id);
    if (author.bot) {
        return;
    }
    const mention = msg.mentions.users.first();
    const nickname = msg.guild.members.cache.get(bot.user.id).nickname;
    const botNameRegex = bot.user.username + (nickname ? `|${utils_1.clean(nickname)}` : "");
    let interaction = true;
    if (msg.guild) {
        interaction =
            new RegExp(botNameRegex, "i").test(msg.content) ||
                (mention && mention.id === bot.user.id);
    }
    if (msg.content.startsWith(config_1.prefix)) {
        msg.content = msg.content.slice(1);
        interaction = true;
    }
    const msgArray = msg.content
        .split(" ")
        .filter((word) => word.trim() !== "");
    if (!interaction) {
        return;
    }
    if (user && user.black_listed) {
        return error(msg, "you seem to be blacklisted. To find out why, ask my glorious creator");
    }
    utils_1.request(msg.guild.name, author.username, msg.content);
    if (!msgArray.length) {
        return message(msg, "yes?");
    }
    if (!user) {
        await User_1.default.create({ discord_id: author.id });
    }
    if (mention && !mention.bot && !User_1.default.get(mention.id)) {
        await User_1.default.create({ discord_id: mention.id });
    }
    for (let i = 0; i < msgArray.length; i++) {
        const args = msgArray.slice(i + 1);
        const commandName = commands.keys[utils_1.clean(msgArray[i])];
        const command = commands.list.get(commandName);
        if (command) {
            if (args[0] && list.help.includes(args[0])) {
                return commands.list.get("help").run(msg, [commandName]);
            }
            else {
                return command.run(msg, args);
            }
        }
    }
    return commands.list.get("talk").run(msg, msgArray);
}
async function _onMessageReactionAdd(msgReact, author) {
    if (author.bot) {
        return;
    }
    const { emoji, message } = msgReact;
    const dialog = Dialog_1.default.find((d) => d.author === author);
    if (!dialog || message !== dialog.response) {
        return;
    }
    try {
        await dialog.run(emoji.name);
    }
    catch (err) {
        utils_1.error(err);
    }
}
async function _onReady() {
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
        Guild_1.default.create(...preGuilds);
    }
    const loadingTime = Math.floor((Date.now() - startTime.getTime()) / 100) / 10;
    utils_1.log(`${commands.list.array().length} commands and ${QuickCommand_1.default.size} generic commands loaded. ${Object.keys(commands.keys).length} keys in total.`);
    utils_1.log(`Salty loaded in ${loadingTime} second${loadingTime === 1 ? "" : "s"} and ready to salt the chat :D`);
}
function restart() {
    return _destroy(true);
}
function destroy() {
    return _destroy(false);
}
async function embed(msg, options = {}) {
    let { react, actions } = options;
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
    if (options.footer && options.footer.text) {
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
    const embed = new discord_js_1.default.MessageEmbed(options);
    const newMessage = await message(msg, Formatter_1.default.format(content, msg), {
        embed,
        files: options.files,
    });
    if (react && !msg.deleted) {
        msg.react(react).catch();
    }
    const dialog = new Dialog_1.default(msg, newMessage, actions);
    const reactions = Object.keys(dialog.actions);
    for (let i = 0; i < reactions.length; i++) {
        if (newMessage.deleted) {
            break;
        }
        await newMessage.react(reactions[i]);
    }
}
function error(msg, text = "error", options = {}) {
    return embed(msg, Object.assign({
        title: text,
        react: "❌",
        color: 0xaa0000,
    }, options));
}
function getTextChannel(channelId) {
    const channel = bot.channels.cache.get(channelId);
    if (!(channel instanceof discord_js_1.default.TextChannel)) {
        throw new Exception_1.SaltyException(`Default channel is not a text channel.`);
    }
    return channel;
}
function isOwner(user) {
    return user.id === config_1.owner.id;
}
function isDev(user) {
    return isOwner(user) || config_1.devs.includes(user.id);
}
function isAdmin(user, guild) {
    return (isOwner(user) ||
        isDev(user) ||
        guild.member(user).hasPermission("ADMINISTRATOR"));
}
function message(msg, text, options) {
    return msg.channel.send(text && Formatter_1.default.format(utils_1.title(text), msg), options);
}
function setQuickCommand(command) {
    command.keys.split(",").forEach((key) => {
        commands.keys[key] = command.name;
    });
    commands.list.set(command.name, command);
}
async function start() {
    utils_1.log("Initializing Salty");
    await Database_1.default.connect();
    await Promise.all([
        QuickCommand_1.default.load().then((commandData) => commandData.forEach(setQuickCommand)),
        Guild_1.default.load(),
        User_1.default.load(),
        _loadCommands(...commandsRootPath).then(() => utils_1.log("Static commands loaded")),
    ]);
    await bot.login(process.env.DISCORD_API);
}
function success(msg, text = "success", options = {}) {
    return embed(msg, Object.assign({
        title: text,
        react: "✅",
        color: 0x32a032,
    }, options));
}
function unsetQuickCommand(command) {
    command.keys.split(",").forEach((key) => {
        delete commands.keys[key];
    });
    commands.list.delete(command.name);
}
bot.on("channelDelete", _onChannelDelete);
bot.on("error", _onError);
bot.on("guildCreate", _onGuildCreate);
bot.on("guildDelete", _onGuildDelete);
bot.on("guildMemberAdd", _onGuildMemberAdd);
bot.on("guildMemberRemove", _onGuildMemberRemove);
bot.on("message", _onMessage);
bot.on("messageReactionAdd", _onMessageReactionAdd);
bot.on("ready", _onReady);
exports.default = {
    bot,
    commands,
    startTime,
    destroy,
    embed,
    error,
    getTextChannel,
    start,
    isAdmin,
    isDev,
    isOwner,
    message,
    restart,
    setQuickCommand,
    success,
    unsetQuickCommand,
};
