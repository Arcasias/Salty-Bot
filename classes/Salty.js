'use strict';

const Data = require('./Data');
const Discord = require('discord.js');
const Dialog = require('./Dialog');
const fs = require('fs');
const Guild = require('./Guild');
const list = require('../data/list.json');
const path = require('path');
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
        this.genericCommands = new Discord.Collection();
        this._setStarted = null;
        this.startTime = new Date();
        this.started = new Promise(resolve => {
            this._setStarted = resolve;
        });
    }

    _destroy(restart) {
        super._destroy();
        this.bot.destroy().then(() => {
            if (restart) {
                this.init();
            } else {
                process.exit();
            }
        });
        LOG.log("Disconnecting ...");
    }

    restart() {
        this._destroy(true);
    }

    destroy() {
        this._destroy(false);
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

        const msgPromise = msg.channel.send(content, { embed, file: data.file });

        msgPromise.then(async newMessage => {
            if (react && ! msg.deleted) {
                msg.react(react).catch();
            }
            const dialog = new Dialog(msg, newMessage, actions);
            const reactions = Object.keys(dialog.actions);

            for (let i = 0; i < reactions.length; i ++) {
                if (newMessage.deleted) break;

                await newMessage.react(reactions[i]);
            }
        });

        return msgPromise;
    }

    getCommands(...paths) {
        const dirpath = path.join(...paths);
        return new Promise((resolve, reject) => {
            fs.readdir(dirpath, (err, files) => {
                if (err) {
                    return LOG.error(err);
                }
                files.forEach(file => {
                    let fullpath = path.join(dirpath, file);

                    let dirPathArray = dirpath.split(path.sep);
                    let fileNameArray = file.split('.');
                    let fileExt = fileNameArray.pop();
                    let fileName = fileNameArray.join('.');
                    let stats = fs.statSync(fullpath);

                    // If the file is a directory, execute the function inside
                    if (stats.isDirectory(fullpath)) {
                        this.getCommands(dirpath, file);
                    // If the file is a .js, add it as a command
                    } else if (fileExt === 'js') {
                        let command = require(path.join(__dirname, '..', fullpath));
                        let category = dirPathArray.pop();

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
        return { rank: newRank, xp: xp };
    }

    init() {
        LOG.log("Initializing Salty");

        Promise.all([
            Data.read('users').then(userData => {
                User.all = userData;
                LOG.log("User data loaded");
            }),
            Data.read('guilds').then(guildData => {
                Guild.all = guildData;
                LOG.log("Guild data loaded");
            }),
            Data.read('commands').then(commandData => {
                commandData.forEach(this.setCommand.bind(this));
                LOG.log("Command data loaded");
            }),
            this.getCommands('./commands'),
        ]).then(this.start.bind(this));

        return this;
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
        return msg.channel.send(message ? this.replacer(UTIL.title(message), msg) : "", { file: file });
    }

    replacer(string, msg) {
        const author = msg.member.nickname || msg.author.username;
        const mention = msg.mentions.members.first() ?
            msg.mentions.members.first().nickname || msg.mentions.members.first().user.username : author;

        return string.replace(/<author>'s/g, UTIL.possessive(author))
            .replace(/<author>/g, author)
            .replace(/<mention>'s/g, UTIL.possessive(mention))
            .replace(/<mention>/g, mention);
    }

    setCommand(command) {
        command.keys.forEach(key => {
            this.commands.keys[key] = command.name;
        });
        this.genericCommands.set(command.name, { run: (msg, args) => {
            eval(command.effect);
        }});
    }

    start() {
        // Execute once the bot has succesfully started
        this.bot.on('ready', () => {
            this.bot.user.setStatus('online'); // dnd , online , idle
            this.bot.guilds.forEach(guild => {
                if (! Guild.get(guild.id)) {
                    new Guild(guild.id);
                }
            });

            Guild.forEach(guild => {
                if (guild.defaultChannel) {
                    this.bot.channels.get(guild.defaultChannel)
                        .send(UTIL.title(UTIL.choice(this.getList('intro'))));
                }
            });
            
            const loadingTime = Math.floor((Date.now() - this.startTime.getTime()) / 100) / 10;
            this._setStarted();

            LOG.log(`${this.commands.list.array().length} commands and ${this.genericCommands.size} generic commands loaded. ${Object.keys(this.commands.keys).length} keys in total.`);
            LOG.log(`Salty loaded in ${loadingTime} second${loadingTime == 1 ? '' : 's'} and ready to salt the chat :D`);
        });

        this.bot.on('guildCreate', guild => {
            new Guild(guild.id);
        });

        this.bot.on('guildDelete', guild => {
            if (guild.member(this.bot.user)) {
                Guild.remove(guild.id);
            }
        });

        this.bot.on('channelDelete', channel => {
            Guild.forEach(guild => {
                if (guild.defaultChannel == channel.id) {
                    guild.defaultChannel = null;
                }
            });
        });

        this.bot.on('disconnect', () => {
            this.updateFiles();
        });

        this.bot.on('error', err => {
            LOG.error(err);
            this.bot.destroy(true);
        });

        this.bot.on('guildMemberAdd', member => {
            const guild = Guild.get(member.guild.id);
            if (guild.defaultChannel) {
                this.bot.channels.get(guild.defaultChannel).send(`Hey there ${member.user} ! Have a great time here (͡° ͜ʖ ͡°)`);
            }
            if (guild.defaultRole) {
                member.addRole(guild.defaultRole).catch(err => {
                    LOG.error(`Couldn't add default role to ${member.user.username}: permission denied`);
                });
            }        
        });

        this.bot.on('guildMemberRemove', member => {
            const guild = Guild.get(member.guild.id);
            if (guild.defaultChannel) {
                this.bot.channels.get(guild.defaultChannel).send(`Well, looks like ${member.user.username} got bored of us:c`);
            }
        });

        // Execute at every message
        this.bot.on('message', async msg => {
            const { author } = msg;

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
            if (this.config.blackList.includes(author.id)) {
                return this.embed(msg, { title: "you seem to be blacklisted. To find out why, ask my glorious creator", type: 'error' });
            }

            // Log interraction.
            LOG.log(`Interraction from ${author.username}: ${msg.content}`);

            if (0 === msgArray.length) return this.msg(msg, "yes ?");

            // Ensures the user and all mentions are already registered
            if (! User.get(author.id)) {
                new User(author.id);
            }
            if (mention && ! User.get(mention.id)) {
                new User(mention.id);
            }
            for (let i = 0; i < msgArray.length; i ++) {
                const args = msgArray.slice(i + 1);
                const commandName = this.commands.keys[UTIL.clean(msgArray[i])];
                const command = this.commands.list.get(commandName) || this.genericCommands.get(commandName);
                if (command) {
                    return command.run(msg, args);
                }
            }
            this.commands.list.get('talk').run(msg, msgArray);
        });

        this.bot.on('messageReactionAdd', async (msgReact, author) => {
            if (author.bot) return;

            const { _emoji, message } = msgReact;
            const dialog = Dialog.all.find(d => d.author === author);

            if (! dialog || message != dialog.response) {
                return;
            }
            try {
                dialog.run(_emoji.name);
            } catch (err) {
                LOG.error(err);
            }
        });

        // Bot log in
        this.bot.login(process.env.DISCORD_API);

        return this;
    }

    updateFiles(prefix="") {
        return Promise.all([
            Data.write('guilds', Guild.all),
            Data.write('users', User.all),
            Data.write('config', this.config, './data', { pretty: true }),
        ]).then(() => {
            LOG.log(`Data files updated ${prefix}`);
        });
    }
}

module.exports = new Salty();
