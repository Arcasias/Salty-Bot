import {
    Client,
    ClientEvents,
    Guild,
    Message,
    MessageEmbed,
    PermissionString,
    ReactionCollector,
    TextChannel,
    User,
} from "discord.js";
import { Dictionnary, SaltyEmbedOptions, SaltyMessageOptions } from "../types";
import {
    ellipsis,
    error,
    format,
    isAdmin,
    isDev,
    isOwner,
    log,
    title,
} from "../utils";
import { connect, disconnect } from "./Database";
import Event from "./Event";
import Module from "./Module";
import QuickCommand from "./QuickCommand";
import Sailor from "./Sailor";

const runningCollectors: Dictionnary<ReactionCollector> = {};

export default class Salty {
    public bot: Client = this.createClient();
    public startTime = new Date();
    private modules: Module[] = [];
    private token: string | null = null;

    public get sailor() {
        return new Sailor({
            id: false,
            discord_id: this.user.id,
        });
    }

    public get user() {
        return this.bot.user!;
    }

    public createClient() {
        // Creates new client
        const bot = new Client();
        // Binds handlers
        bot.on(...this.createHandler("channelDelete", "onChannelDelete"));
        bot.on(...this.createHandler("error", "onError"));
        bot.on(...this.createHandler("guildCreate", "onGuildCreate"));
        bot.on(...this.createHandler("guildDelete", "onGuildDelete"));
        bot.on(...this.createHandler("guildMemberAdd", "onGuildMemberAdd"));
        bot.on(
            ...this.createHandler("guildMemberRemove", "onGuildMemberRemove")
        );
        bot.on(
            ...this.createHandler(
                "message",
                "onMessage",
                this.preprocessMessage
            )
        );
        bot.on(...this.createHandler("ready", "onReady"));
        return bot;
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
            options.title = title(format(options.title, msg));
        }
        if (options.description) {
            options.description = title(format(options.description, msg));
        }
        if (options.footer?.text) {
            options.footer.text = title(format(options.footer.text, msg));
        }
        if (options.fields) {
            options.fields = options.fields.map((field) => {
                return {
                    name: title(format(field.name, msg)),
                    value: title(format(field.value, msg)),
                    inline,
                };
            });
        }
        const embed = new MessageEmbed(options);
        const newMessage: Message = await this.message(
            msg,
            ellipsis(title(format(content, msg))),
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
        options?: SaltyMessageOptions
    ): Promise<any> {
        const defaultedOptions = Object.assign(
            {
                format: true,
                title: true,
            },
            options
        );
        let content = text || "";
        if (defaultedOptions.format) {
            content = format(content, msg);
        }
        if (defaultedOptions.title) {
            content = title(content);
        }
        return msg.channel.send(ellipsis(content), options || {});
    }

    /**
     * @param ModuleConstructor
     */
    public registerModule(ModuleConstructor: typeof Module): void {
        this.modules.push(new ModuleConstructor());
    }

    /**
     * Restarts the bot instance by reloading the command files and recreate a bot
     * instance.
     */
    public async restart(): Promise<void> {
        if (!this.token) {
            throw new Error("Could not restart Salty: missing token");
        }
        log("Restarting ...");
        for (const collector of Object.values(runningCollectors)) {
            collector.stop("restarted");
        }
        this.bot.destroy();
        this.bot = this.createClient();
        await disconnect();
        await this.start(this.token);
    }

    /**
     * Entry point of the module. This function is responsible of executing the following
     * actions in the given order:
     * 1. Establish a connection with the PostgreSQL database
     * 2. Load the models: QuickCommand, Crew and Sailor (order is irrelevant)
     * 3. Log into Discord through the API
     * @param token
     */
    public async start(token: string): Promise<void> {
        log("Initializing Salty");
        this.token = token;
        await connect();
        await QuickCommand.load();
        await this.bot.login(this.token);
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

    private createHandler<K extends keyof ClientEvents>(
        type: K,
        method: keyof Module,
        preprocess?: (...args: ClientEvents[K]) => boolean
    ): [K, (...args: any[]) => any] {
        const handler = async (...args: ClientEvents[K]): Promise<void> => {
            if (preprocess && !preprocess.call(this, ...args)) {
                return;
            }
            const event = new Event<K>(args);
            for (const module of this.modules) {
                try {
                    await (<(event: Event<K>) => any>module[method])(event);
                } catch (err) {
                    error(err.message);
                }
                if (event.isStopped()) {
                    break;
                }
            }
        };
        return [type, handler];
    }

    private preprocessMessage(msg: Message): boolean {
        // Ignores bot messages
        if (msg.author === this.user) {
            return false;
        }
        return true;
    }
}
