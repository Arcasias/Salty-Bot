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
const config_1 = __importDefault(require("../data/config"));
const list_1 = __importDefault(require("../data/list"));
const utils_1 = require("../utils");
const Database_1 = __importDefault(require("./Database"));
const Dialog_1 = __importDefault(require("./Dialog"));
const Guild_1 = __importDefault(require("./Guild"));
const QuickCommand_1 = __importDefault(require("./QuickCommand"));
const User_1 = __importDefault(require("./User"));
const bot = new discord_js_1.default.Client();
const commandsRootPath = ["src", "commands"];
const commands = {
    list: new discord_js_1.default.Collection(),
    keys: {},
    help: {},
};
const startTime = new Date();
//-----------------------------------------------------------------------------
// Not exported
//-----------------------------------------------------------------------------
/**
 * @private
 */
async function _destroy(restart) {
    utils_1.log("Disconnecting ...");
    await bot.destroy();
    if (restart) {
        await _loadCommands(...commandsRootPath).then(() => utils_1.log("Commands loaded"));
        await bot.login(process.env.DISCORD_API);
    }
    else {
        await Database_1.default.disconnect();
        process.exit();
    }
}
/**
 * @private
 */
async function _loadCommand(commandPath, category) {
    const command = await Promise.resolve().then(() => __importStar(require(commandPath)));
    const { name, keys, visibility } = command.default;
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
    // Registers command
    commands.list.set(name, command);
    commands.keys[name] = name;
    // Links each key to the command name in command keys
    keys.forEach((key) => {
        commands.keys[key] = name;
    });
    // Sets help content
    commands.help[category].commands.push({ name, keys, visibility });
}
/**
 * @private
 */
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
            // If the file is a directory => executes the function inside
            _loadCommands(fullpath);
        }
        else if (["js", "cjs", "mjs"].includes(extension)) {
            // If the file is a category info file => extracts its data
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
/**
 * @private
 */
async function _onChannelDelete(channel) {
    Guild_1.default.forEach((guild) => {
        if (guild.default_channel === channel.id) {
            const guildDBId = Guild_1.default.get(guild.id).id;
            Guild_1.default.update(guildDBId, { default_channel: false });
        }
    });
}
/**
 * @private
 */
async function _onError(err) {
    utils_1.error(err);
    bot.destroy(true);
}
/**
 * @private
 */
async function _onGuildCreate(guild) {
    Guild_1.default.create({ discord_id: guild.id });
}
/**
 * @private
 */
async function _onGuildDelete(guild) {
    if (guild.member(bot.user)) {
        const guildDBId = Guild_1.default.find(guild.id).id;
        Guild_1.default.remove(guildDBId);
    }
}
/**
 * @private
 */
async function _onGuildMemberAdd(member) {
    const guild = Guild_1.default.get(member.guild.id);
    if (guild.default_channel) {
        await bot.channels
            .get(guild.default_channel)
            .send(`Hey there ${member.user} ! Have a great time here (͡° ͜ʖ ͡°)`);
    }
    if (guild.default_role) {
        try {
            member.addRole(guild.default_role);
        }
        catch (err) {
            utils_1.error(`Couldn't add default role to ${member.user.username}: permission denied`);
        }
    }
}
/**
 * @private
 */
async function _onGuildMemberRemove(member) {
    const guild = Guild_1.default.find(member.guild.id);
    if (guild.default_channel) {
        bot.channels
            .get(guild.default_channel)
            .send(`Well, looks like ${member.user.username} got bored of us:c`);
    }
}
/**
 * @private
 */
async function _onMessage(msg) {
    const author = msg.author;
    const user = User_1.default.get(author.id);
    // Ignore all bots
    if (author.bot) {
        return;
    }
    const mention = msg.mentions.users.first();
    const nickname = msg.guild.members.cache.get(bot.user.id).nickname;
    const botNameRegex = bot.user.username + (nickname ? `|${utils_1.clean(nickname)}` : "");
    // Look for username/nickname match or a mention if in a guild, else (DM) interaction
    // is always true.
    let interaction = true;
    if (msg.guild) {
        interaction =
            msg.content.match(new RegExp(botNameRegex, "i")) ||
                (mention && mention.id === bot.user.id);
    }
    // Look for a prefix. Deleted if found.
    if (msg.content.startsWith(config_1.default.prefix)) {
        msg.content = msg.content.slice(1);
        interaction = true;
    }
    // Clean the message of any undesired spaces
    const msgArray = msg.content
        .split(" ")
        .filter((word) => word.trim() !== "");
    // Need an interaction passed point. Everything else is a "normal" message.
    if (!interaction) {
        return;
    }
    // Warning if blacklisted
    if (user && user.black_listed) {
        return error(msg, "you seem to be blacklisted. To find out why, ask my glorious creator");
    }
    utils_1.request(msg.guild.name, author.username, msg.content);
    if (!msgArray.length) {
        return message(msg, "yes ?");
    }
    // Ensures the user and all mentions are already registered
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
            if (args[0] && list_1.default.help.includes(args[0])) {
                return commands.list.get("help").run(msg, [commandName]);
            }
            else {
                return command.run(msg, args);
            }
        }
    }
    return commands.list.get("talk").run(msg, msgArray);
}
/**
 * @private
 */
async function _onMessageReactionAdd(msgReact, author) {
    if (author.bot) {
        return;
    }
    const { _emoji, message } = msgReact;
    const dialog = Dialog_1.default.find((d) => d.author === author);
    if (!dialog || message !== dialog.response) {
        return;
    }
    try {
        await dialog.run(_emoji.name);
    }
    catch (err) {
        utils_1.error(err);
    }
}
/**
 * @private
 */
async function _onReady() {
    const preGuilds = [];
    bot.user.setStatus("online"); // dnd , online , idle
    bot.guilds.cache.forEach((discordGuild) => {
        const guild = Guild_1.default.get(discordGuild.id);
        if (guild) {
            if (guild.default_channel) {
                bot.channels
                    .get(guild.default_channel)
                    .send(utils_1.title(utils_1.choice(list_1.default.intro)));
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
//-----------------------------------------------------------------------------
// Exported
//-----------------------------------------------------------------------------
/**
 * Restarts the bot instance by reloading the command files and recreate a bot
 * instance.
 */
function restart() {
    return _destroy(true);
}
/**
 * Terminates the bot instance.
 */
function destroy() {
    return _destroy(false);
}
/**
 * Sends an embed message in the channel of the given 'msg' object.
 */
async function embed(msg, options = {}) {
    // Embed options that might change
    let messageTitle = options.title || "";
    let description = options.description || "";
    let color = options.color || 0xffffff;
    let author = options.author;
    let timestamp = options.timestamp || "";
    let footer = options.footer || "";
    // Other options that might change
    let { react, actions } = options;
    const inline = options.inline || false;
    const content = options.content || "";
    if (messageTitle) {
        messageTitle = utils_1.title(messageTitle);
    }
    if (description) {
        description = utils_1.title(description);
    }
    if (footer) {
        footer = utils_1.title(footer);
    }
    const embed = new discord_js_1.default.MessageEmbed()
        .setTitle(replacer(messageTitle, msg))
        .setDescription(replacer(description, msg))
        .setURL(options.url)
        .setColor(color)
        .setAuthor(author.username || "")
        .setTimestamp(timestamp)
        .setThumbnail(options.thumbnail)
        .setImage(options.image)
        .setFooter(footer);
    if (options.fields) {
        for (let i = 0; i < options.fields.length; i++) {
            embed.addField(utils_1.title(options.fields[i].title), replacer(utils_1.title(options.fields[i].description), msg), inline);
        }
    }
    const newMessage = await message(msg, content, {
        embed,
        file: options.file,
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
/**
 * Sends an embed with 'error' preset style.
 */
function error(msg, text = "error", options = {}) {
    return embed(msg, Object.assign({
        title: text,
        react: "❌",
        color: 0xaa0000,
    }, options));
}
/**
 * Returns the list of terms associated with a given section name.
 */
function getList(sectionName) {
    return list_1.default[sectionName];
}
/**
 * Entry point of the module. This function is responsible of executing the following
 * actions in the given order:
 * 1. Establish a connection with the PostgreSQL database
 * 2. Load the models: QuickCommand, Guild and User (order is irrelevant) and the
 *    command scripts
 * 3. Log into Discord through the API
 */
async function init() {
    utils_1.log("Initializing Salty");
    await Database_1.default.connect();
    await Promise.all([
        QuickCommand_1.default.load().then((commandData) => commandData.forEach(setQuickCommand)),
        Guild_1.default.load(),
        User_1.default.load(),
        _loadCommands(...commandsRootPath).then(() => utils_1.log("Commands loaded")),
    ]);
    await bot.login(process.env.DISCORD_API);
}
/**
 * Returns true if the given user has owner level privileges.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
function isOwner(user) {
    return user.id === config_1.default.owner.id;
}
/**
 * Returns true if the given user has developer level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
function isDev(user) {
    if (isOwner(user)) {
        return true;
    }
    return config_1.default.devs.includes(user.id);
}
/**
 * Returns true if the given user has admin level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
function isAdmin(user, guild) {
    if (isDev(user) || isOwner(user)) {
        return true;
    }
    return guild.member(user).hasPermission("ADMINISTRATOR");
}
/**
 * Sends a simply structured message in the channel of the given 'msg' object.
 */
function message(msg, text, options) {
    return msg.channel.send(text && replacer(utils_1.title(text), msg), options);
}
/**
 * Returns a string in which the <author> and <mention> tags have been replaced
 * with their related values contained in the 'msg' object.
 */
function replacer(string, msg) {
    const author = msg.member.nickname || msg.author.username;
    const mention = msg.mentions.members.first();
    const target = mention
        ? mention.nickname || mention.user.username
        : author;
    return string
        .replace(/<author>'s/g, utils_1.possessive(author))
        .replace(/<author>/g, author)
        .replace(/<mention>'s/g, utils_1.possessive(target))
        .replace(/<mention>/g, target);
}
/**
 * Registers a command object in the current commands list.
 */
function setQuickCommand(command) {
    command.keys.split(",").forEach((key) => {
        commands.keys[key] = command.name;
    });
    commands.list.set(command.name, {
        run: () => eval(command.effect),
    });
}
/**
 * Sends an embed with 'success' preset style.
 */
function success(msg, text = "success", options = {}) {
    return embed(msg, Object.assign({
        title: text,
        react: "✅",
        color: 0x32a032,
    }, options));
}
/**
 * Unregisters a command object from the current commands list.
 */
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
    // Properties
    bot,
    commands,
    config: config_1.default,
    startTime,
    // Functions
    destroy,
    embed,
    error,
    getList,
    init,
    isAdmin,
    isDev,
    isOwner,
    message,
    replacer,
    restart,
    setQuickCommand,
    success,
    unsetQuickCommand,
};
