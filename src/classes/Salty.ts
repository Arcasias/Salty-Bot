import {
    Channel,
    Client,
    Guild,
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
    User,
} from "discord.js";
import { prefix } from "../config";
import { intro, keywords } from "../terms";
import {
    Dictionnary,
    FieldsDescriptor,
    MessageActor,
    Runnable,
    SaltyEmbedOptions,
} from "../types";
import {
    choice,
    clean,
    ellipsis,
    error as logError,
    format,
    isAdmin,
    isDev,
    isOwner,
    log,
    request,
    search,
    title,
} from "../utils";
import Command from "./Command";
import Crew from "./Crew";
import { connect, disconnect } from "./Database";
import QuickCommand from "./QuickCommand";
import Sailor from "./Sailor";

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
    public bot = new Client();
    public startTime = new Date();

    constructor() {
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

    public get sailor() {
        return new Sailor({
            id: false,
            discord_id: this.user.id,
        });
    }

    public get user() {
        return this.bot.user!;
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
        this.bot = new Client();
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
            options.title = format(options.title, msg);
        }
        if (options.description) {
            options.description = format(options.description, msg);
        }
        if (options.footer?.text) {
            options.footer.text = format(options.footer.text, msg);
        }
        if (options.fields) {
            options.fields = options.fields.map((field) => {
                return {
                    name: format(field.name, msg),
                    value: format(field.value, msg),
                    inline,
                };
            });
        }
        const embed = new MessageEmbed(options);
        const newMessage: Message = await this.message(
            msg,
            ellipsis(format(content, msg)),
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
        user: User,
        guild: Guild | null = null
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
    public hasPermission(guild: Guild, permisson: PermissionString) {
        return guild.members.cache
            .get(this.user.id)
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
        return msg.channel.send(text && ellipsis(format(text, msg)), options);
    }

    /**
     * Entry point of the module. This function is responsible of executing the following
     * actions in the given order:
     * 1. Establish a connection with the PostgreSQL database
     * 2. Load the models: QuickCommand, Crew and Sailor (order is irrelevant)
     * 3. Log into Discord through the API
     */
    public async start(): Promise<void> {
        log("Initializing Salty");
        await connect();
        await QuickCommand.load();
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

    //-----------------------------------------------------------------------------
    // Not exported
    //-----------------------------------------------------------------------------

    private async onChannelDelete(
        channel: PartialDMChannel | Channel
    ): Promise<void> {
        if (!(channel instanceof GuildChannel)) {
            return;
        }
        await Crew.update(
            { default_channel: channel.id },
            { default_channel: null }
        );
    }

    private async onError(err: Error): Promise<void> {
        logError(err);
        this.restart();
    }

    private async onGuildCreate(guild: Guild): Promise<void> {
        Crew.create({ discord_id: guild.id });
    }

    private async onGuildDelete(guild: Guild): Promise<void> {
        if (guild.member(this.user)) {
            await Crew.remove({ discord_id: guild.id });
        }
    }

    private async onGuildMemberAdd(
        member: GuildMember | PartialGuildMember
    ): Promise<void> {
        const guild = await Crew.get(member.guild.id);
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
        const guild = await Crew.get(member.guild.id);
        if (guild?.default_channel) {
            const channel = this.getTextChannel(guild.default_channel);
            const name = member.user?.username || "unknown";
            channel.send(`Well, looks like ${name} got bored of us :c`);
        }
    }

    private async onMessage(msg: Message): Promise<any> {
        const { author, cleanContent, guild, member, mentions } = msg;

        // Ignore all bots
        if (author.bot) {
            return;
        }

        // Look for an interaction
        const mention = mentions.users.first();
        const nickname = guild?.members.cache.get(this.user.id)?.nickname;
        const botNameRegex = new RegExp(
            `${this.user.username}${nickname ? `|@?${clean(nickname)}` : ""}`,
            "i"
        );
        const hasPrefix = cleanContent.startsWith(prefix);
        const content = hasPrefix
            ? cleanContent.slice(prefix.length)
            : cleanContent;
        if (
            !hasPrefix && // starts with prefix
            guild && // is direct message
            mention?.id !== this.user.id && // mentions Salty
            !botNameRegex.test(content) // contains Salty alias or name
        ) {
            // The action is discarded if none of the above criteria are met
            return;
        }

        // Logs the  action
        request(guild?.name || "DM", author.username, content);

        // Fetches the actors of the action
        const toFetch = [author.id];
        if (mention && !mention.bot) {
            toFetch.push(mention.id);
        }
        let [sourceSailor, targetSailor]: Sailor[] = await Sailor.search({
            discord_id: toFetch,
        });
        if (sourceSailor?.black_listed) {
            // The action is discarded if the user is black-listed
            return;
        }

        // Cleans the message of any undesired spaces
        if (!content.replace(botNameRegex, "").trim().length) {
            // Drops the action here if the message is empty
            return this.message(msg, "yes?");
        }

        // Ensures the user and all mentions are correctly registered
        const toCreate = [];
        if (!sourceSailor) {
            toCreate.push({ discord_id: author.id });
        } else if (mention && !targetSailor) {
            if (mention.id === author.id) {
                targetSailor = sourceSailor;
            } else if (mention.id === this.bot.user?.id) {
                targetSailor = this.sailor;
            } else if (!mention.bot) {
                toCreate.push({ discord_id: mention.id });
            }
        }
        if (toCreate.length) {
            const created: Sailor[] = await Sailor.create(...toCreate);
            if (created.length && !sourceSailor) {
                sourceSailor = created.shift()!;
            }
            if (created.length && !targetSailor) {
                targetSailor = created.shift()!;
            }
        }

        // Generates the source actor object
        const source: MessageActor = {
            user: author,
            member,
            sailor: sourceSailor,
            name: member?.displayName || author.username,
        };
        let target: MessageActor | null = null;
        if (targetSailor) {
            const mem = mentions.members?.first() || null;
            // Generates the target actor object if a mention exists
            target = {
                user: mention!,
                member: mem,
                sailor: targetSailor,
                name: mem?.displayName || mention!.username,
            };
        }

        // Handles the actual command if found
        const msgArgs = content
            .split(" ")
            .filter((word) => Boolean(word.trim()));
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
            // If no command found, tries to find the closest matches
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
        // If no command nor close match, the "talk" command is called instead
        command.run(msg, commandArgs, source, target);
    }

    private async onReady(): Promise<void> {
        this.user.setStatus("online");
        // Fetch all guilds
        const activeGuilds: string[] = this.bot.guilds.cache.map(
            (guild) => guild.id
        );
        const guilds: Crew[] = await Crew.search();
        const toRemove: number[] = guilds
            .filter((g) => !activeGuilds.includes(g.discord_id))
            .map((g) => g.id);
        const toCreate: FieldsDescriptor[] = activeGuilds
            .filter((id) => !guilds.some((g) => g.discord_id === id))
            .map((id) => ({ discord_id: id }));
        if (toCreate.length) {
            await Crew.create(...toCreate);
        }
        if (toRemove.length) {
            // No need to wait for this one
            Crew.remove(toRemove);
        }
        for (const guild of guilds) {
            if (guild.default_channel) {
                const channel = this.getTextChannel(guild.default_channel);
                channel.send(title(choice(intro)));
            }
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
}

export default Salty;
