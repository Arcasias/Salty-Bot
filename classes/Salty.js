'use strict';

const Database = require('./Database');
const Discord = require('discord.js');
const Dialog = require('./Dialog');
const fs = require('fs');
const Guild = require('./Guild');
const list = require('../data/list.json');
const path = require('path');
const QuickCommand = require('./QuickCommand');
const Singleton = require('./Singleton');
const User = require('./User');

/**
 * Class holding most useful functions and variables used accross
 * the program.
 */
class Salty extends Singleton {

    /**
     * @constructor
     */
    constructor() {
        super(...arguments);

        this.bot = new Discord.Client();
        this.commands = {
            list: new Discord.Collection(),
            keys: {},
            help: {},
        };
        this.config = require('../data/config.json');
        this.fishing = {};
        this.startTime = new Date();

        this.bot.on('guildCreate', this.onGuildCreate.bind(this));
        this.bot.on('guildDelete', this.onGuildDelete.bind(this));
        this.bot.on('channelDelete', this.onChannelDelete.bind(this));
        this.bot.on('error', this.onError.bind(this));
        this.bot.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
        this.bot.on('guildMemberRemove', this.onGuildMemberRemove.bind(this));
        this.bot.on('message', this.onMessage.bind(this));
        this.bot.on('messageReactionAdd', this.onMessageReactionAdd.bind(this));
        this.bot.on('ready', this.onReady.bind(this));
    }

    async _destroy(restart) {
        super._destroy();

        LOG.info("Disconnecting ...");
        await this.bot.destroy();

        if (restart) {
            await this.getCommands('./commands').then(() => LOG.info('Commands loaded'));
            await this.bot.login(process.env.DISCORD_API);
        } else {
            await Database.disconnect();
            process.exit();
        }
    }

    restart() {
        return this._destroy(true);
    }

    destroy() {
        return this._destroy(false);
    }

    async embed(msg, data) {
        // Embed options that might change
        let title = data.title || "";
        let description = data.description || "";
        let color = data.color || 0xFFFFFF;
        let author = data.author || "";
        let timestamp = data.timestamp || "";
        let footer = data.footer || "";
        let fields = [];

        // Other options that might change
        let { react, actions, type } = data;
        const inline = data.inline || false;
        const content = data.content || "";

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
            .setTitle(this.replacer(title, msg))
            .setDescription(this.replacer(description, msg))
            .setURL(data.url)
            .setColor(color)
            .setAuthor(author.username || '')
            .setTimestamp(timestamp)
            .setThumbnail(data.thumbnail)
            .setImage(data.image)
            .setFooter(footer);

        if (data.fields) {
            for (let i = 0; i < data.fields.length; i ++) {
                embed.addField(UTIL.title(data.fields[i].title), this.replacer(UTIL.title(data.fields[i].description), msg), inline);
            }
        }
        const newMessage = await msg.channel.send(content, { embed, file: data.file });

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

    getCommands(...paths) {
        const dirpath = path.join(...paths);
        return new Promise((resolve, reject) => {
            fs.readdir(dirpath, (err, files) => {
                if (err) {
                    return LOG.error(err);
                }
                files.forEach(file => {
                    const fullpath = path.join(dirpath, file);

                    const dirPathArray = dirpath.split(path.sep);
                    const fileNameArray = file.split('.');
                    const fileExt = fileNameArray.pop();
                    const stats = fs.statSync(fullpath);

                    // If the file is a directory, execute the function inside
                    if (stats.isDirectory(fullpath)) {
                        this.getCommands(dirpath, file);
                    // If the file is a .js, add it as a command
                    } else if (fileExt === 'js') {
                        const command = require(path.join(__dirname, '..', fullpath));
                        const category = dirPathArray.pop();

                        // Registers command
                        this.commands.list.set(command.name, command);

                        // Links each key to the command name in command keys
                        command.keys.forEach(key => {
                            this.commands.keys[key] = command.name;
                        });
                        if (! this.commands.help[category]) {
                            this.commands.help[category] = [];
                        }
                        // Sets help content
                        this.commands.help[category].push({
                            name: command.name,
                            visibility: command.visibility,
                            file,
                        });
                    }
                });
                resolve();
            });
        });
    }

    getList(array) {
        return list[array];
    }

    getXpInfos(id) {
        let xp = User.get(id).xp;
        let newRank = 0;

        for (let i = 0; i < this.config.rank.length; i ++) {
            if (xp < this.config.rank[i].xp) {
                break;
            }
            xp -= this.config.rank[i].xp;
            newRank ++;
        }
        return { rank: newRank, xp };
    }

    async init() {
        LOG.info("Initializing Salty");

        await Database.connect();
        await Promise.all([
            QuickCommand.load().then(commandData => {
                commandData.forEach(this.setQuickCommand.bind(this));
            }),
            Guild.load(),
            User.load(),
            this.getCommands('./commands').then(() => LOG.info('Commands loaded')),
        ]);
        await this.bot.login(process.env.DISCORD_API);
    }

    isAdmin(user, guild) {
        if (this.isDev(user) || this.isOwner(user)) {
            return true;
        }
        return guild.member(user).hasPermission('ADMINISTRATOR');
    }

    isDev(user) {
        if (this.isOwner(user)) {
            return true;
        }
        return this.config.devs.includes(user.id);
    }

    isOwner(user) {
        return user.id == this.config.owner.id;
    }

    async msg (msg, message, file=null) {
        await msg.channel.send(message ? this.replacer(UTIL.title(message), msg) : "", { file });
    }

    replacer(string, msg) {
        const author = msg.member.nickname || msg.author.username;
        const mention = msg.mentions.members.first() ?
            msg.mentions.members.first().nickname || msg.mentions.members.first().user.username : author;

        return string
            .replace(/<author>'s/g, UTIL.possessive(author))
            .replace(/<author>/g, author)
            .replace(/<mention>'s/g, UTIL.possessive(mention))
            .replace(/<mention>/g, mention);
    }

    setQuickCommand(command) {
        command.keys.split(',').forEach(key => {
            this.commands.keys[key] = command.name;
        });
        this.commands.list.set(command.name, {
            run: (msg, args) => {
                eval(command.effect);
            },
        });
    }

    unsetQuickCommand(command) {
        command.keys.split(',').forEach(key => {
            delete this.commands.keys[key];
        });
        this.commands.list.delete(command.name);
    }


    // HANDLERS

    async onChannelDelete(channel) {
        Guild.forEach(guild => {
            if (guild.default_channel == channel.id) {
                const guildDBId = Guild.get(guild.id).id;
                Guild.update(guildDBId, { default_channel: false });
            }
        });
    }

    async onError(err) {
        LOG.error(err);
        this.bot.destroy(true);
    }

    async onGuildCreate(guild) {
        Guild.create({ discord_id: guild.id });
    }

    async onGuildDelete(guild) {
        if (guild.member(this.bot.user)) {
            const guildDBId = Guild.find(guild.id).id;
            Guild.remove(guildDBId);
        }
    }

    async onGuildMemberAdd(member) {
        const guild = Guild.get(member.guild.id);
        if (guild.default_channel) {
            await this.bot.channels.get(guild.default_channel).send(`Hey there ${member.user} ! Have a great time here (͡° ͜ʖ ͡°)`);
        }
        if (guild.default_role) {
            try {
                member.addRole(guild.default_role);
            } catch (err) {
                LOG.error(`Couldn't add default role to ${member.user.username}: permission denied`);
            }
        }  
    }

    async onGuildMemberRemove(member) {
        const guild = Guild.find(guild.id);
        if (guild.default_channel) {
            this.bot.channels.get(guild.default_channel).send(`Well, looks like ${member.user.username} got bored of us:c`);
        }
    }

    async onMessage(msg) {
        const { author } = msg;
        const user = User.get(author.id);

        // Ignore all bots
        if (author.bot) return;

        const mention = msg.mentions.users.first();
        const nickname = msg.guild.members.get(this.bot.user.id).nickname;
        const botNameRegex = this.bot.user.username + (nickname ? `|${UTIL.clean(nickname)}` : '');

        // Look for username/nickname match or a mention if in a guild, else (DM) interraction is always true.
        let interraction = msg.guild ?
            msg.content.match(new RegExp(botNameRegex, 'i')) ||
            (mention && mention.id === this.bot.user.id) :
            true;

        // Look for a prefix. Deleted if found.
        if (msg.content.startsWith(this.config.prefix)) {
            msg.content = msg.content.slice(1);
            interraction = true;
        }

        // Clean the message of any undesired spaces
        const msgArray = msg.content.split(' ').filter(word => word.trim() != '');

        // Need an interraction passed this point. Everything else is a "normal" message.
        if (! interraction) {
            return;
        }

        // Warning if blacklisted
        if (user && user.black_listed) {
            return this.embed(msg, { title: "you seem to be blacklisted. To find out why, ask my glorious creator", type: 'error' });
        }

        if (0 === msgArray.length) {
            return this.msg(msg, "yes ?");
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
            const commandName = this.commands.keys[UTIL.clean(msgArray[i])];
            const command = this.commands.list.get(commandName);
            if (command) {
                return command.run(msg, args);
            }
        }
        return this.commands.list.get('talk').run(msg, msgArray);
    }

    async onMessageReactionAdd(msgReact, author) {
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

    async onReady() {
        const guildCreates = [];
        this.bot.user.setStatus('online'); // dnd , online , idle
        this.bot.guilds.forEach(discordGuild => {
            const guild = Guild.get(discordGuild.id);
            if (guild) {
                if (guild.default_channel) {
                    this.bot.channels.get(guild.default_channel)
                        .send(UTIL.title(UTIL.choice(this.getList('intro'))));
                }
            } else {
                guildCreates.push({ discord_id: discordGuild.id });
            }
        });
        if (guildCreates.length) {
            Guild.create(...guildCreates);
        }

        const loadingTime = Math.floor((Date.now() - this.startTime.getTime()) / 100) / 10;

        LOG.info(`${this.commands.list.array().length} commands and ${QuickCommand.size} generic commands loaded. ${Object.keys(this.commands.keys).length} keys in total.`);
        LOG.info(`Salty loaded in ${loadingTime} second${loadingTime == 1 ? '' : 's'} and ready to salt the chat :D`);
    }
}

module.exports = new Salty();
