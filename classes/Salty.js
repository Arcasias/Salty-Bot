import config from '../data/config.js';
import * as Database from './Database.js';
import Discord from 'discord.js';
import Dialog from './Dialog.js';
import fs from 'fs';
import Guild from './Guild.js';
import list from '../data/list.js';
import path from 'path';
import QuickCommand from './QuickCommand.js';
import User from './User.js';

// Exported
const bot = new Discord.Client();
const commands = {
    list: new Discord.Collection(),
    keys: {},
    help: {},
};
const fishing = {};
const startTime = new Date();

bot.on('channelDelete', _onChannelDelete);
bot.on('error', _onError);
bot.on('guildCreate', _onGuildCreate);
bot.on('guildDelete', _onGuildDelete);
bot.on('guildMemberAdd', _onGuildMemberAdd);
bot.on('guildMemberRemove', _onGuildMemberRemove);
bot.on('message', _onMessage);
bot.on('messageReactionAdd', _onMessageReactionAdd);
bot.on('ready', _onReady);

function restart() {
    return _destroy(true);
}

function destroy() {
    return _destroy(false);
}

async function embed(msg, options) {
    // Embed options that might change
    let title = options.title || "";
    let description = options.description || "";
    let color = options.color || 0xFFFFFF;
    let author = options.author || "";
    let timestamp = options.timestamp || "";
    let footer = options.footer || "";

    // Other options that might change
    let { react, actions, type } = options;
    const inline = options.inline || false;
    const content = options.content || "";

    switch (type) {
        case 'error':
            if (! title) title = "error";
            if (! react) react = '❌';
            if (0xFFFFFF === color) color = 0xAA0000;
            break;
        case 'success':
            if (! title) title = "success";
            if (! react) react = '✅';
            if (0xFFFFFF === color) color = 0x32a032;
            break;
        default:
            break;
    }
    if (title) title = UTIL.title(title);
    if (description) description = UTIL.title(description);
    if (footer) footer = UTIL.title(footer);

    const embed = new Discord.RichEmbed()
        .setTitle(replacer(title, msg))
        .setDescription(replacer(description, msg))
        .setURL(options.url)
        .setColor(color)
        .setAuthor(author.username || '')
        .setTimestamp(timestamp)
        .setThumbnail(options.thumbnail)
        .setImage(options.image)
        .setFooter(footer);

    if (options.fields) {
        for (let i = 0; i < options.fields.length; i ++) {
            embed.addField(UTIL.title(options.fields[i].title), replacer(UTIL.title(options.fields[i].description), msg), inline);
        }
    }
    const newMessage = await this.msg(msg, content, { embed, file: options.file });

    if (react && ! msg.deleted) {
        msg.react(react).catch();
    }
    const dialog = new Dialog(msg, newMessage, actions);
    const reactions = Object.keys(dialog.actions);

    for (let i = 0; i < reactions.length; i ++) {
        if (newMessage.deleted) break;

        await newMessage.react(reactions[i]);
    }
}


function getList(array) {
    return list[array];
}

function getXpInfos(id) {
    let xp = User.get(id).xp;
    let newRank = 0;

    for (let i = 0; i < config.rank.length; i ++) {
        if (xp < config.rank[i].xp) {
            break;
        }
        xp -= config.rank[i].xp;
        newRank ++;
    }
    return { rank: newRank, xp };
}

async function init() {
    LOG.info("Initializing Salty");

    await Database.connect();
    await Promise.all([
        QuickCommand.load().then(commandData => commandData.forEach(setQuickCommand)),
        Guild.load(),
        User.load(),
        _getCommands('./commands').then(() => LOG.info('Commands loaded')),
    ]);
    await bot.login(process.env.DISCORD_API);
}

function isAdmin(user, guild) {
    if (isDev(user) || isOwner(user)) {
        return true;
    }
    return guild.member(user).hasPermission('ADMINISTRATOR');
}

function isDev(user) {
    if (isOwner(user)) {
        return true;
    }
    return config.devs.includes(user.id);
}

function isOwner(user) {
    return user.id == config.owner.id;
}

function msg (msg, message, options) {
    return msg.channel.send(message && replacer(UTIL.title(message), msg), options);
}

function replacer(string, msg) {
    const author = msg.member.nickname || msg.author.username;
    const mention = msg.mentions.members.first() ?
        msg.mentions.members.first().nickname || msg.mentions.members.first().user.username : author;

    return string
        .replace(/<author>'s/g, UTIL.possessive(author))
        .replace(/<author>/g, author)
        .replace(/<mention>'s/g, UTIL.possessive(mention))
        .replace(/<mention>/g, mention);
}

function setQuickCommand(command) {
    command.keys.split(',').forEach(key => {
        commands.keys[key] = command.name;
    });
    commands.list.set(command.name, {
        run: (msg, args) => {
            eval(command.effect);
        },
    });
}

function unsetQuickCommand(command) {
    command.keys.split(',').forEach(key => {
        delete commands.keys[key];
    });
    commands.list.delete(command.name);
}

// Not exported
async function _destroy(restart) {
    LOG.info("Disconnecting ...");
    await bot.destroy();

    if (restart) {
        await _getCommands('./commands').then(() => LOG.info('Commands loaded'));
        await bot.login(process.env.DISCORD_API);
    } else {
        await Database.disconnect();
        process.exit();
    }
}

function _getCommands(...paths) {
    const dirpath = path.join(...paths);
    return new Promise((resolve, reject) => {
        fs.readdir(dirpath, async (err, files) => {
            if (err) {
                reject(err);
            }

            const filesLoading = files.map(async file => {
                const fullpath = path.join(dirpath, file);
                const stats = fs.statSync(fullpath);
                const ext = file.split('.').pop();

                // If the file is a directory, execute the function inside
                if (stats.isDirectory(fullpath)) {
                    _getCommands(dirpath, file);
                // If the file is a .js, add it as a command
                } else if (['js', 'cjs', 'mjs'].includes(ext)) {
                    try {
                        const relativePath = path.join('..', fullpath).replace(path.sep, '/');
                        const { default: command } = await import(relativePath);
                        const category = dirpath.split(path.sep).pop();

                        const { name, keys, visibility } = command;

                        // Registers command
                        commands.list.set(name, command);
                        commands.keys[name] = name;

                        // Links each key to the command name in command keys
                        keys.forEach(key => {
                            commands.keys[key] = name;
                        });
                        if (!commands.help[category]) {
                            commands.help[category] = [];
                        }
                        // Sets help content
                        commands.help[category].push({ name, keys, visibility });
                    } catch (err) {
                        LOG.error(`Could not load file "${file}:"`, err.stack);
                    }
                }
            });
            await Promise.all(filesLoading);
            resolve();
        });
    });
}

async function _onChannelDelete(channel) {
    Guild.forEach(guild => {
        if (guild.default_channel == channel.id) {
            const guildDBId = Guild.get(guild.id).id;
            Guild.update(guildDBId, { default_channel: false });
        }
    });
}

async function _onError(err) {
    LOG.error(err);
    bot.destroy(true);
}

async function _onGuildCreate(guild) {
    Guild.create({ discord_id: guild.id });
}

async function _onGuildDelete(guild) {
    if (guild.member(bot.user)) {
        const guildDBId = Guild.find(guild.id).id;
        Guild.remove(guildDBId);
    }
}

async function _onGuildMemberAdd(member) {
    const guild = Guild.get(member.guild.id);
    if (guild.default_channel) {
        await bot.channels.get(guild.default_channel).send(`Hey there ${member.user} ! Have a great time here (͡° ͜ʖ ͡°)`);
    }
    if (guild.default_role) {
        try {
            member.addRole(guild.default_role);
        } catch (err) {
            LOG.error(`Couldn't add default role to ${member.user.username}: permission denied`);
        }
    }
}

async function _onGuildMemberRemove(member) {
    const guild = Guild.find(guild.id);
    if (guild.default_channel) {
        bot.channels.get(guild.default_channel).send(`Well, looks like ${member.user.username} got bored of us:c`);
    }
}

async function _onMessage(msg) {
    const { author } = msg;
    const user = User.get(author.id);

    // Ignore all bots
    if (author.bot) return;

    const mention = msg.mentions.users.first();
    const nickname = msg.guild.members.get(bot.user.id).nickname;
    const botNameRegex = bot.user.username + (nickname ? `|${UTIL.clean(nickname)}` : '');

    // Look for username/nickname match or a mention if in a guild, else (DM) interraction is always true.
    let interraction = msg.guild ?
        msg.content.match(new RegExp(botNameRegex, 'i')) ||
        (mention && mention.id === bot.user.id) :
        true;

    // Look for a prefix. Deleted if found.
    if (msg.content.startsWith(config.prefix)) {
        msg.content = msg.content.slice(1);
        interraction = true;
    }

    // Clean the message of any undesired spaces
    const msgArray = msg.content.split(' ').filter(word => word.trim() != '');

    // Need an interraction passed point. Everything else is a "normal" message.
    if (! interraction) {
        return;
    }

    // Warning if blacklisted
    if (user && user.black_listed) {
        return embed(msg, { title: "you seem to be blacklisted. To find out why, ask my glorious creator", type: 'error' });
    }

    if (0 === msgArray.length) {
        return msg(msg, "yes ?");
    }

    // Ensures the user and all mentions are already registered
    if (!user) {
        await User.create({ discord_id: author.id });
    }
    if (mention && !mention.bot && !User.get(mention.id)) {
        await User.create({ discord_id: mention.id });
    }
    for (let i = 0; i < msgArray.length; i ++) {
        const args = msgArray.slice(i + 1);
        const commandName = commands.keys[UTIL.clean(msgArray[i])];
        const command = commands.list.get(commandName);
        if (command) {
            return command.run(msg, args);
        }
    }
    return commands.list.get('talk').run(msg, msgArray);
}

async function _onMessageReactionAdd(msgReact, author) {
    if (author.bot) {
        return;
    }
    const { _emoji, message } = msgReact;
    const dialog = Dialog.all.find(d => d.author === author);

    if (! dialog || message != dialog.response) {
        return;
    }
    try {
        await dialog.run(_emoji.name);
    } catch (err) {
        LOG.error(err);
    }
}

async function _onReady() {
    const guildCreates = [];
    bot.user.setStatus('online'); // dnd , online , idle
    bot.guilds.forEach(discordGuild => {
        const guild = Guild.get(discordGuild.id);
        if (guild) {
            if (guild.default_channel) {
                bot.channels.get(guild.default_channel)
                    .send(UTIL.title(UTIL.choice(getList('intro'))));
            }
        } else {
            guildCreates.push({ discord_id: discordGuild.id });
        }
    });
    if (guildCreates.length) {
        Guild.create(...guildCreates);
    }

    const loadingTime = Math.floor((Date.now() - startTime.getTime()) / 100) / 10;

    LOG.info(`${commands.list.array().length} commands and ${QuickCommand.size} generic commands loaded. ${Object.keys(commands.keys).length} keys in total.`);
    LOG.info(`Salty loaded in ${loadingTime} second${loadingTime == 1 ? '' : 's'} and ready to salt the chat :D`);
}

export {
    // Props
    bot,
    commands,
    config,
    fishing,
    startTime,
    // Methods
    restart,
    destroy,
    embed,
    getList,
    getXpInfos,
    init,
    isAdmin,
    isDev,
    isOwner,
    msg,
    replacer,
    setQuickCommand,
    unsetQuickCommand,
};
