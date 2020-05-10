"use strict";

const config = require("../data/config.js");
const Database = require("./Database.js");
const Dialog = require("./Dialog.js");
const Discord = require("discord.js");
const fs = require("fs");
const Guild = require("./Guild.js");
const list = require("../data/list.js");
const path = require("path");
const QuickCommand = require("./QuickCommand.js");
const User = require("./User.js");

const bot = new Discord.Client();
const commandsRootPath = "./commands";
const pathSeparator = new RegExp(path.sep, "g");
const commands = {
    list: new Discord.Collection(),
    keys: {},
    help: {},
};
const fishing = {};
const startTime = new Date();

//-----------------------------------------------------------------------------
// Not exported
//-----------------------------------------------------------------------------

/**
 * @private
 * @param {boolean} restart
 */
async function _destroy(restart) {
    LOG.log("Disconnecting ...");
    await bot.destroy();

    if (restart) {
        await _loadCommands(commandsRootPath).then(() =>
            LOG.log("Commands loaded")
        );
        await bot.login(process.env.DISCORD_API);
    } else {
        await Database.disconnect();
        process.exit();
    }
}

/**
 * @private
 * @param {String} commandPath
 * @param {String} category
 */
function _loadCommand(commandPath, category) {
    const command = require(commandPath);
    const { name, keys, visibility } = command;

    if (process.env.DEBUG === "true") {
        for (let key of [name, ...keys]) {
            if (commands.list.get(key)) {
                throw new Error(
                    `Key "${key}" of command ${name} conflicts with command of the same name.`
                );
            }
            if (key in commands.keys) {
                throw new Error(`Duplicate key "${key}" in command "${name}".`);
            }
            if (key in commands.help || category === key) {
                throw new Error(
                    `Key "${key}" of command "${name}" is already a category.`
                );
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
 * @param  {...string} paths
 */
async function _loadCommands(...paths) {
    const dirpath = path.join(...paths);
    const files = await UTIL.promisify(fs.readdir.bind(fs, dirpath));
    const category = dirpath.split(path.sep).pop();
    if (files.includes("__category__.json")) {
        const categoryInfoPath = path.join(dirpath, "__category__.json");
        const categoryInfo = JSON.parse(fs.readFileSync(categoryInfoPath));
        commands.help[category] = {
            info: categoryInfo,
            commands: [],
        };
    }
    files.forEach((file) => {
        const fullpath = path.join(dirpath, file);
        const stats = fs.statSync(fullpath);
        const extension = file.split(".").pop();

        // If the file is a directory, execute the function inside
        if (stats.isDirectory(fullpath)) {
            _loadCommands(dirpath, file);
            // If the file is a category info file, extract its data
        } else if (["js", "cjs", "mjs"].includes(extension)) {
            const relativePath = path
                .join("..", fullpath)
                .replace(pathSeparator, "/");
            try {
                _loadCommand(relativePath, category);
            } catch (err) {
                LOG.error(`Could not load file "${file}:"`, err.stack);
            }
        }
    });
}

/**
 * @private
 * @param {Discord.Channel} channel
 */
async function _onChannelDelete(channel) {
    Guild.forEach((guild) => {
        if (guild.default_channel === channel.id) {
            const guildDBId = Guild.get(guild.id).id;
            Guild.update(guildDBId, { default_channel: false });
        }
    });
}

/**
 * @private
 * @param {Error} err
 */
async function _onError(err) {
    LOG.error(err);
    bot.destroy(true);
}

/**
 * @private
 * @param {Discord.Guild} guild
 */
async function _onGuildCreate(guild) {
    Guild.create({ discord_id: guild.id });
}

/**
 * @private
 * @param {Discord.Guild} guild
 */
async function _onGuildDelete(guild) {
    if (guild.member(bot.user)) {
        const guildDBId = Guild.find(guild.id).id;
        Guild.remove(guildDBId);
    }
}

/**
 * @private
 * @param {Discord.GuildMember} member
 */
async function _onGuildMemberAdd(member) {
    const guild = Guild.get(member.guild.id);
    if (guild.default_channel) {
        await bot.channels
            .get(guild.default_channel)
            .send(`Hey there ${member.user} ! Have a great time here (͡° ͜ʖ ͡°)`);
    }
    if (guild.default_role) {
        try {
            member.addRole(guild.default_role);
        } catch (err) {
            LOG.error(
                `Couldn't add default role to ${member.user.username}: permission denied`
            );
        }
    }
}

/**
 * @private
 * @param {Discord.GuildMember} member
 */
async function _onGuildMemberRemove(member) {
    const guild = Guild.find(member.guild.id);
    if (guild.default_channel) {
        bot.channels
            .get(guild.default_channel)
            .send(`Well, looks like ${member.user.username} got bored of us:c`);
    }
}

/**
 * @private
 * @param {Discord.Message} msg
 */
async function _onMessage(msg) {
    const { author } = msg;
    const user = User.get(author.id);

    // Ignore all bots
    if (author.bot) {
        return;
    }

    const mention = msg.mentions.users.first();
    const nickname = msg.guild.members.cache.get(bot.user.id).nickname;
    const botNameRegex =
        bot.user.username + (nickname ? `|${UTIL.clean(nickname)}` : "");

    // Look for username/nickname match or a mention if in a guild, else (DM) interaction
    // is always true.
    let interaction = true;
    if (msg.guild) {
        interaction =
            msg.content.match(new RegExp(botNameRegex, "i")) ||
            (mention && mention.id === bot.user.id);
    }
    // Look for a prefix. Deleted if found.
    if (msg.content.startsWith(config.prefix)) {
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
        return error(
            msg,
            "you seem to be blacklisted. To find out why, ask my glorious creator"
        );
    }

    LOG.request(msg.guild.name, author.username, msg.content);

    if (!msgArray.length) {
        return message(msg, "yes ?");
    }

    // Ensures the user and all mentions are already registered
    if (!user) {
        await User.create({ discord_id: author.id });
    }
    if (mention && !mention.bot && !User.get(mention.id)) {
        await User.create({ discord_id: mention.id });
    }
    for (let i = 0; i < msgArray.length; i++) {
        const args = msgArray.slice(i + 1);
        const commandName = commands.keys[UTIL.clean(msgArray[i])];
        const command = commands.list.get(commandName);
        if (command) {
            if (args[0] && list.help.includes(args[0])) {
                return commands.list.get("help").run(msg, [commandName]);
            } else {
                return command.run(msg, args);
            }
        }
    }
    return commands.list.get("talk").run(msg, msgArray);
}

/**
 * @private
 * @param {Discord.MessageReaction} msgReact
 * @param {Discord.User} author
 */
async function _onMessageReactionAdd(msgReact, author) {
    if (author.bot) {
        return;
    }
    const { _emoji, message } = msgReact;
    const dialog = Dialog.all.find((d) => d.author === author);

    if (!dialog || message !== dialog.response) {
        return;
    }
    try {
        await dialog.run(_emoji.name);
    } catch (err) {
        LOG.error(err);
    }
}

/**
 * @private
 */
async function _onReady() {
    const guildCreates = [];
    bot.user.setStatus("online"); // dnd , online , idle
    bot.guilds.cache.forEach((discordGuild) => {
        const guild = Guild.get(discordGuild.id);
        if (guild) {
            if (guild.default_channel) {
                bot.channels
                    .get(guild.default_channel)
                    .send(UTIL.title(UTIL.choice(list.intro)));
            }
        } else {
            guildCreates.push({ discord_id: discordGuild.id });
        }
    });
    if (guildCreates.length) {
        Guild.create(...guildCreates);
    }

    const loadingTime =
        Math.floor((Date.now() - startTime.getTime()) / 100) / 10;

    LOG.log(
        `${commands.list.array().length} commands and ${
            QuickCommand.size
        } generic commands loaded. ${
            Object.keys(commands.keys).length
        } keys in total.`
    );
    LOG.log(
        `Salty loaded in ${loadingTime} second${
            loadingTime === 1 ? "" : "s"
        } and ready to salt the chat :D`
    );
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
 * @param {Discord.message} msg
 * @param {Object} [options={}]
 * @param {Object} [options.actions]
 * @param {String} [options.author=""]
 * @param {Number} [options.color=0xffffff]
 * @param {String} [options.content=""]
 * @param {String} [options.description=""]
 * @param {Object[]} [options.fields]
 * @param {String} [options.file=""]
 * @param {String} [options.footer=""]
 * @param {String} [options.image=""]
 * @param {boolean} [options.inline=false]
 * @param {String} [options.thumbnail=""]
 * @param {String} [options.timestamp=""]
 * @param {String} [options.react]
 * @param {String} [options.title=""]
 * @param {String} [options.url=""]
 */
async function embed(msg, options = {}) {
    // Embed options that might change
    let title = options.title || "";
    let description = options.description || "";
    let color = options.color || 0xffffff;
    let author = options.author || "";
    let timestamp = options.timestamp || "";
    let footer = options.footer || "";

    // Other options that might change
    let { react, actions } = options;
    const inline = options.inline || false;
    const content = options.content || "";

    if (title) {
        title = UTIL.title(title);
    }
    if (description) {
        description = UTIL.title(description);
    }
    if (footer) {
        footer = UTIL.title(footer);
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(replacer(title, msg))
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
            embed.addField(
                UTIL.title(options.fields[i].title),
                replacer(UTIL.title(options.fields[i].description), msg),
                inline
            );
        }
    }
    const newMessage = await message(msg, content, {
        embed,
        file: options.file,
    });

    if (react && !msg.deleted) {
        msg.react(react).catch();
    }
    const dialog = new Dialog(msg, newMessage, actions);
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
 * @param {Discord.Message} msg
 * @param {String} text
 * @param {Object} [options={}]
 */
function error(msg, text = "error", options = {}) {
    return embed(
        msg,
        Object.assign(
            {
                title: text,
                react: "❌",
                color: 0xaa0000,
            },
            options
        )
    );
}

/**
 * Returns the list of terms associated with a given section name.
 * @param {String} sectionName
 * @returns {string[]}
 */
function getList(sectionName) {
    return list[sectionName];
}

/**
 * @typedef {Object} xpInfos
 * @property {Number} rank
 * @property {Number} xp
 */
/**
 * Update current user XP values and returns the current rank and xp.
 * @param {String} id
 * @returns {xpInfos}
 */
function getXpInfos(id) {
    let xp = User.get(id).xp;
    let newRank = 0;

    for (let i = 0; i < config.rank.length; i++) {
        if (xp < config.rank[i].xp) {
            break;
        }
        xp -= config.rank[i].xp;
        newRank++;
    }
    return { rank: newRank, xp };
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
    LOG.log("Initializing Salty");
    await Database.connect();
    await Promise.all([
        QuickCommand.load().then((commandData) =>
            commandData.forEach(setQuickCommand)
        ),
        Guild.load(),
        User.load(),
        _loadCommands(commandsRootPath).then(() => LOG.log("Commands loaded")),
    ]);
    await bot.login(process.env.DISCORD_API);
}

/**
 * Returns true if the given user has owner level privileges.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 * @param {Discord.User} user
 * @returns {boolean}
 */
function isOwner(user) {
    return user.id === config.owner.id;
}

/**
 * Returns true if the given user has developer level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 * @param {Discord.User} user
 * @returns {boolean}
 */
function isDev(user) {
    if (isOwner(user)) {
        return true;
    }
    return config.devs.includes(user.id);
}

/**
 * Returns true if the given user has admin level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 * @param {Discord.User} user
 * @returns {boolean}
 */
function isAdmin(user, guild) {
    if (isDev(user) || isOwner(user)) {
        return true;
    }
    return guild.member(user).hasPermission("ADMINISTRATOR");
}

/**
 * Sends a simply structured message in the channel of the given 'msg' object.
 * @param {Discord.Message} msg
 * @param {String} text
 * @param {Object} options
 */
function message(msg, text, options) {
    return msg.channel.send(text && replacer(UTIL.title(text), msg), options);
}

/**
 * Returns a string in which the <author> and <mention> tags have been replaced
 * with their related values contained in the 'msg' object.
 * @param {String} string
 * @param {Discord.Message} msg
 * @returns {String}
 */
function replacer(string, msg) {
    const author = msg.member.nickname || msg.author.username;
    const mention = msg.mentions.members.first();
    const target = mention ? mention.nickname || mention.user.username : author;
    return string
        .replace(/<author>'s/g, UTIL.possessive(author))
        .replace(/<author>/g, author)
        .replace(/<mention>'s/g, UTIL.possessive(target))
        .replace(/<mention>/g, target);
}

/**
 * Registers a command object in the current commands list.
 * @param {Object} command
 * @param {String} command.name
 * @param {string[]} command.keys
 * @param {String} command.effect stringified function
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
 * @param {Discord.Message} msg
 * @param {String} text
 * @param {Object} [options={}]
 */
function success(msg, text = "success", options = {}) {
    return embed(
        msg,
        Object.assign(
            {
                title: text,
                react: "✅",
                color: 0x32a032,
            },
            options
        )
    );
}

/**
 * Unregisters a command object from the current commands list.
 * @param {Object} command
 * @param {String} command.name
 * @param {string[]} command.keys
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

module.exports = {
    // Properties
    bot,
    commands,
    config,
    fishing,
    startTime,
    // Functions
    destroy,
    embed,
    error,
    getList,
    getXpInfos,
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
