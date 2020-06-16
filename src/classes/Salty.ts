import Discord, {
    Channel,
    GuildChannel,
    GuildMember,
    Message,
    MessageEmbed,
    MessageOptions,
    PartialDMChannel,
    PartialGuildMember,
    PermissionString,
    ReactionCollector,
    TextChannel,
} from "discord.js";
import { prefix } from "../config";
import { intro, keywords } from "../terms";
import {
    Dictionnary,
    FieldsDescriptor,
    MessageTarget,
    Runnable,
    SaltyEmbedOptions,
} from "../types";
import {
    choice,
    clean,
    ellipsis,
    error as logError,
    isAdmin,
    isDev,
    isOwner,
    log,
    request,
    search,
    title,
} from "../utils";
import Command from "./Command";
import { connect, disconnect } from "./Database";
import Formatter from "./Formatter";
import Guild from "./Guild";
import QuickCommand from "./QuickCommand";
import User from "./User";

const runningCollectors: Dictionnary<ReactionCollector> = {};

function catchHandler(
    handler: (...args: any[]) => any
): (...args: any[]) => any {
    return function () {
        try {
            return handler(...arguments);
        } catch (err) {
            logError(err);
        }
    };
}

class Salty {
    public bot = new Discord.Client();
    public startTime = new Date();
    private formatter: Formatter;

    constructor(formatter: Formatter) {
        this.formatter = formatter;

        this.bot.on(
            "channelDelete",
            catchHandler(this.onChannelDelete.bind(this))
        );
        this.bot.on("error", catchHandler(this.onError.bind(this)));
        this.bot.on("guildCreate", catchHandler(this.onGuildCreate.bind(this)));
        this.bot.on("guildDelete", catchHandler(this.onGuildDelete.bind(this)));
        this.bot.on(
            "guildMemberAdd",
            catchHandler(this.onGuildMemberAdd.bind(this))
        );
        this.bot.on(
            "guildMemberRemove",
            catchHandler(this.onGuildMemberRemove.bind(this))
        );
        this.bot.on("message", catchHandler(this.onMessage.bind(this)));
        this.bot.on("ready", catchHandler(this.onReady.bind(this)));
    }

    //-----------------------------------------------------------------------------
    // Not exported
    //-----------------------------------------------------------------------------

    private async onChannelDelete(
        channel: PartialDMChannel | Channel
    ): Promise<void> {
        if (!(channel instanceof GuildChannel)) {
            return;
        }
        Guild.each(async (guild: Guild) => {
            if (guild.default_channel === channel.id) {
                const relatedGuild = Guild.get(channel.guild.id);
                if (relatedGuild) {
                    Guild.update(relatedGuild.id, { default_channel: false });
                }
            }
        });
    }

    private async onError(err: Error): Promise<void> {
        logError(err);
        this.restart();
    }

    private async onGuildCreate(guild: Discord.Guild): Promise<void> {
        Guild.create({ discord_id: guild.id });
    }

    private async onGuildDelete(guild: Discord.Guild): Promise<void> {
        if (guild.member(this.bot.user!)) {
            const relatedGuild = Guild.get(guild.id);
            if (relatedGuild) {
                Guild.remove(relatedGuild.id);
            }
        }
    }

    private async onGuildMemberAdd(
        member: GuildMember | PartialGuildMember
    ): Promise<void> {
        const guild = Guild.get(member.guild.id);
        if (guild?.default_channel) {
            const channel = this.getTextChannel(guild.default_channel);
            channel.send(
                `Hey there ${member.user}! Have a great time here (͡° ͜ʖ ͡°)`
            );
        }
        if (guild?.default_role) {
            member.roles.add(guild.default_role);
        }
    }

    private async onGuildMemberRemove(
        member: GuildMember | PartialGuildMember
    ): Promise<void> {
        const guild = Guild.get(member.guild.id);
        if (guild?.default_channel) {
            const channel = this.getTextChannel(guild.default_channel);
            const name = member.user?.username || "unknown";
            channel.send(`Well, looks like ${name} got bored of us :c`);
        }
    }

    private async onMessage(msg: Message): Promise<any> {
        const { author, guild, mentions } = msg;
        let { content } = msg;

        // Ignore all bots
        if (author.bot) {
            return;
        }

        const user = User.get(author.id);
        const mention = mentions.users.first();
        const mentioned = Boolean(msg.mentions.users.size);
        const target: MessageTarget = {
            user: mentioned ? msg.mentions.users.first()! : msg.author,
            member: mentioned ? msg.mentions.members!.first()! : msg.member,
            isMention: mentioned,
            name: "",
        };
        const nickname = guild?.members.cache.get(this.bot.user!.id)?.nickname;
        const botNameRegex: string =
            this.bot.user!.username + (nickname ? `|${clean(nickname)}` : "");

        // Look for username/nickname match or a mention if in a guild, else (DM) interaction
        // is always true.
        let interaction = content.startsWith(prefix);
        // Look for a prefix. Deleted if found.
        if (interaction) {
            content = content.slice(1);
        } else if (msg.guild) {
            interaction =
                new RegExp(botNameRegex, "i").test(content) ||
                mention?.id === this.bot.user!.id;
        }
        // Need an interaction passed point. Everything else is a "normal" message.
        if (!interaction) {
            return;
        }
        request(msg.guild?.name || "DM", author.username, content);
        // Warning if blacklisted
        if (user?.black_listed) {
            return this.error(
                msg,
                "you seem to be blacklisted. To find out why, ask my glorious creator"
            );
        }
        // Ensures the user and all mentions are already registered
        if (!user) {
            await User.create({ discord_id: author.id });
        }
        if (mention && !mention.bot) {
            const mentionUser = User.get(mention.id);
            if (!mentionUser) {
                await User.create({ discord_id: mention.id });
            }
        }
        // Clean the message of any undesired spaces
        const msgArgs = content
            .split(" ")
            .filter((word) => Boolean(word.trim()));
        if (!msgArgs.length) {
            return this.message(msg, "yes?");
        }
        const actionName = msgArgs.shift() || "";
        const commandName = Command.aliases.get(clean(actionName));
        let command: Runnable;
        let commandArgs = msgArgs;
        if (commandName) {
            if (keywords.help.includes(msgArgs[0])) {
                commandArgs = [commandName];
                command = Command.list.get("help")!;
            } else {
                command = Command.list.get(commandName)!;
            }
        } else {
            const closests = search([...Command.aliases.keys()], actionName, 2);
            if (closests.length) {
                const cmds: Dictionnary<string> = {};
                for (const key of closests) {
                    const cmdName = Command.aliases.get(key)!;
                    if (!(cmdName in cmds)) {
                        cmds[cmdName] = key;
                    }
                }
                return this.message(
                    msg,
                    `command "*${actionName}*" doesn't exist. Did you mean "*${Object.values(
                        cmds
                    ).join(`*" or "*`)}*"?`
                );
            }
            commandArgs.unshift(actionName);
            command = Command.list.get("talk")!;
        }
        command.run(msg, commandArgs, target);
    }

    private async onReady(): Promise<void> {
        const preGuilds: FieldsDescriptor[] = [];
        this.bot.user!.setStatus("online"); // dnd , online , idle
        this.bot.guilds.cache.forEach((discordGuild) => {
            const guild = Guild.get(discordGuild.id);
            if (guild) {
                if (guild.default_channel) {
                    const channel = this.getTextChannel(guild.default_channel);
                    channel.send(title(choice(intro)));
                }
            } else {
                preGuilds.push({ discord_id: discordGuild.id });
            }
        });
        if (preGuilds.length) {
            await Guild.create(...preGuilds);
        }
        const loadingTime: number =
            Math.floor((Date.now() - this.startTime.getTime()) / 100) / 10;

        log(
            `${Command.list.size} commands loaded. ${Command.aliases.size} keys in total.`
        );
        log(
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
    public async restart(): Promise<void> {
        log("Restarting ...");
        for (const collector of Object.values(runningCollectors)) {
            collector.stop("restarted");
        }
        this.bot.destroy();
        this.bot = new Discord.Client();
        await disconnect();
        await this.start();
    }

    /**
     * Terminates the bot instance.
     */
    public async destroy(): Promise<void> {
        log("Disconnecting ...");
        for (const collector of Object.values(runningCollectors)) {
            collector.stop("disconnected");
        }
        this.bot.destroy();
        await disconnect();
        process.exit();
    }

    /**
     * Sends an embed message in the channel of the given 'msg' object.
     */
    public async embed(
        msg: Message,
        options: SaltyEmbedOptions = {}
    ): Promise<Message> {
        // Other options that might change
        let { actions, react } = options;
        const inline = options.inline || false;
        const content = options.content || "";

        if (!options.color) {
            options.color = 0xfefefe;
        }
        if (options.title) {
            options.title = this.formatter.format(title(options.title), msg);
        }
        if (options.description) {
            options.description = this.formatter.format(
                title(options.description),
                msg
            );
        }
        if (options.footer?.text) {
            options.footer.text = this.formatter.format(
                title(options.footer.text),
                msg
            );
        }
        if (options.fields) {
            options.fields = options.fields.map((field) => {
                return {
                    name: title(field.name),
                    value: this.formatter.format(title(field.value), msg),
                    inline,
                };
            });
        }
        const embed = new MessageEmbed(options);
        const newMessage: Message = await this.message(
            msg,
            ellipsis(title(this.formatter.format(content, msg))),
            {
                embed,
                files: options.files,
            }
        );
        if (react && !msg.deleted) {
            msg.react(react).catch();
        }
        if (actions) {
            if (msg.author.id in runningCollectors) {
                runningCollectors[msg.author.id].stop("newer-collector");
            }
            const { reactions, onAdd, onRemove, onEnd } = actions;
            const collector = newMessage.createReactionCollector(
                (reaction, user) =>
                    !user.bot && reactions.includes(reaction.emoji.name),
                { time: 3 * 60 * 1000 }
            );
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
            const reactionPromises: Promise<any>[] = [];
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

    /**
     * Sends an embed with 'error' preset style.
     * @param msg
     * @param text
     * @param options
     */
    public error(msg: Message, text: string = "error", options: any = {}) {
        return this.embed(
            msg,
            Object.assign(
                {
                    title: text,
                    react: "❌",
                    color: 0xc80000,
                },
                options
            )
        );
    }

    /**
     * @param channelId
     */
    public getTextChannel(channelId: string): TextChannel {
        const channel = this.bot.channels.cache.get(channelId);
        if (!(channel instanceof TextChannel)) {
            throw new Error(`Channel "${channelId}" is not a text channel.`);
        }
        return channel;
    }

    /**
     * @param access
     * @param user
     * @param guild
     */
    public hasAccess(
        access: string,
        user: Discord.User,
        guild: Discord.Guild | null = null
    ): boolean {
        if (access === "public") {
            return true;
        }
        switch (access) {
            case "admin":
                return guild ? isAdmin(user, guild) : false;
            case "dev":
                return isDev(user);
            case "owner":
                return isOwner(user);
        }
        return false;
    }

    /**
     * @param guild
     * @param permisson
     */
    public hasPermission(guild: Discord.Guild, permisson: PermissionString) {
        return guild.members.cache
            .get(this.bot.user!.id)
            ?.permissions.has(permisson);
    }

    /**
     * @param msg
     * @param text
     * @param options
     */
    public info(
        msg: Message,
        text: string = "info",
        options: SaltyEmbedOptions = {}
    ) {
        return this.embed(
            msg,
            Object.assign(
                {
                    title: text,
                    react: "ℹ️",
                    color: 0x4287f5,
                },
                options
            )
        );
    }

    /**
     * Sends a simply structured message in the channel of the given 'msg' object.
     */
    public message(
        msg: Message,
        text: string | null,
        options?: MessageOptions
    ): Promise<any> {
        return msg.channel.send(
            text && ellipsis(title(this.formatter.format(text, msg))),
            options
        );
    }

    /**
     * Entry point of the module. This function is responsible of executing the following
     * actions in the given order:
     * 1. Establish a connection with the PostgreSQL database
     * 2. Load the models: QuickCommand, Guild and User (order is irrelevant)
     * 3. Log into Discord through the API
     */
    public async start(): Promise<void> {
        log("Initializing Salty");
        await connect();
        await Promise.all([
            QuickCommand.load(),
            User.load<User>(),
            Guild.load<Guild>(),
        ]);
        await this.bot.login(process.env.DISCORD_API);
    }

    /**
     * Sends an embed with 'success' preset style.
     * @param msg
     * @param text
     * @param options
     */
    public success(
        msg: Message,
        text: string = "success",
        options: SaltyEmbedOptions = {}
    ) {
        return this.embed(
            msg,
            Object.assign(
                {
                    title: text,
                    react: "✅",
                    color: 0x00c800,
                },
                options
            )
        );
    }

    /**
     * Sends an embed with 'warning' preset style.
     * @param msg
     * @param text
     * @param options
     */
    public warn(
        msg: Message,
        text: string = "success",
        options: SaltyEmbedOptions = {}
    ) {
        return this.embed(
            msg,
            Object.assign(
                {
                    title: text,
                    react: "⚠️",
                    color: 0xc8c800,
                },
                options
            )
        );
    }

    /**
     * @param msg
     */
    public wtf(msg: Message) {
        return this.error(msg, "What the fuck");
    }
}

export default Salty;
