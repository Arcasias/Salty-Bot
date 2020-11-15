import {
  APIMessage,
  APIMessageContentResolvable,
  Client,
  ClientEvents,
  DMChannel,
  Guild,
  GuildEmoji,
  Message,
  MessageEditOptions,
  MessageEmbed,
  NewsChannel,
  PermissionString,
  ReactionCollector,
  TextChannel,
  User,
} from "discord.js";
import {
  Dictionnary,
  ReactionActions,
  SaltyEmbedOptions,
  SaltyMessageOptions,
} from "../types";
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

class APIWrapper {
  do<T>(action: (...args: any[]) => T): T | false {
    try {
      return action()!;
    } catch (err) {
      return false;
    }
  }
}

export default class Salty {
  public bot: Client = this.createClient();
  public startTime = new Date();
  public api: APIWrapper = new APIWrapper();
  private modules: Dictionnary<Module[]> = {};
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

  /**
   * @param userId
   * @param msg
   * @param actions
   */
  public addActions(
    userId: string,
    msg: Message,
    { reactions, onAdd, onRemove, onEnd }: ReactionActions
  ) {
    if (userId in runningCollectors) {
      runningCollectors[userId].stop("NEW_COLLECTOR");
    }
    const collector = this.api.do(() =>
      msg.createReactionCollector(
        ({ emoji }, { bot }) => !bot && reactions.includes(emoji.name),
        { time: 3 * 60 * 1000 }
      )
    );
    if (!collector) {
      return;
    }
    runningCollectors[userId] = collector;
    const abort = () => collector.stop("OPTION_SELECTED");
    const reactPromise = this.react(msg, ...reactions);
    if (onAdd) {
      collector.on("collect", async (reaction, user) => {
        await reactPromise;
        onAdd(reaction, user, abort);
      });
    }
    if (onRemove) {
      collector.on("remove", async (reaction, user) => {
        await reactPromise;
        onRemove(reaction, user, abort);
      });
    }
    collector.on("end", async (collected, reason) => {
      delete runningCollectors[userId];
      await reactPromise;
      this.api.do(() => msg.reactions.removeAll());
      this.api.do(() => collector.empty());
      if (onEnd) {
        onEnd(collected, reason);
      }
    });
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
    bot.on(...this.createHandler("guildMemberRemove", "onGuildMemberRemove"));
    bot.on(
      ...this.createHandler("message", "onMessage", this.preprocessMessage)
    );
    bot.on(...this.createHandler("ready", "onReady"));
    return bot;
  }

  /**
   * @param msg
   */
  public async deleteMessage(msg: Message): Promise<any> {
    await this.api.do(() => msg.delete());
  }

  /**
   * Terminates the bot instance.
   */
  public async destroy(): Promise<void> {
    log("Disconnecting ...");
    for (const collector of Object.values(runningCollectors)) {
      collector.stop("DISCONNECTED");
    }
    this.bot.destroy();
    await disconnect();
    process.exit();
  }

  /**
   * @param msg
   * @param content
   */
  public async editMessage(
    msg: Message,
    content:
      | APIMessageContentResolvable
      | MessageEditOptions
      | MessageEmbed
      | APIMessage
  ): Promise<void> {
    await this.api.do(() => msg.edit(content));
  }

  /**
   * Sends an embed message in the channel of the given 'msg' object.
   */
  public async embed(
    msg: Message,
    options: SaltyEmbedOptions = {}
  ): Promise<Message | false> {
    // Other options that might change
    const defaultedOptions: SaltyEmbedOptions = Object.assign(
      {
        inline: false,
        content: "",
        color: 0xfefefe,
      },
      options
    );
    const { content, inline, react } = defaultedOptions;

    if (defaultedOptions.title) {
      defaultedOptions.title = title(format(defaultedOptions.title, msg));
    }
    if (defaultedOptions.description) {
      defaultedOptions.description = title(
        format(defaultedOptions.description, msg)
      );
    }
    if (defaultedOptions.footer?.text) {
      defaultedOptions.footer.text = title(
        format(defaultedOptions.footer.text, msg)
      );
    }
    if (defaultedOptions.fields) {
      defaultedOptions.fields = defaultedOptions.fields.map(
        ({ name, value }) => ({
          name: title(format(name, msg)),
          value: title(format(value, msg)),
          inline,
        })
      );
    }
    const embed = new MessageEmbed(defaultedOptions);
    const newMessage = await this.message(msg, content!, {
      embed,
      files: defaultedOptions.files,
    });

    if (react) {
      this.react(msg, react);
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
   * @param permissions
   */
  public hasPermission(guild: Guild, ...permissions: PermissionString[]) {
    const member = guild.members.cache.get(this.user.id);
    return permissions.every((perm) => member?.permissions.has(perm));
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
  public async message(
    target: Message | TextChannel | DMChannel | NewsChannel | User,
    content: string = "",
    options?: SaltyMessageOptions
  ): Promise<Message | false> {
    const defaultedOptions = Object.assign(
      {
        format: true,
        title: true,
      },
      options
    );
    let channel: TextChannel | DMChannel | NewsChannel | User;
    let msg: Message | null = null;
    if (target instanceof Message) {
      msg = target;
      channel = msg.channel;
    } else {
      channel = target;
    }
    if (msg && defaultedOptions.format) {
      content = format(content, msg);
    }
    if (defaultedOptions.title) {
      content = title(content);
    }
    const result = await this.api.do(() =>
      channel.send(ellipsis(content), options || {})
    );
    return Array.isArray(result) ? result[0] : result;
  }

  /**
   * @param msg
   * @param reactions
   */
  public async react(
    msg: Message,
    ...reactions: (string | GuildEmoji)[]
  ): Promise<any> {
    for (const react of reactions) {
      await this.api.do(() => msg.react(react));
    }
  }

  /**
   * @param ModuleConstructor
   */
  public registerModule(
    ModuleConstructor: typeof Module,
    priority: number
  ): void {
    if (!(priority in this.modules)) {
      this.modules[priority] = [];
    }
    this.modules[priority].push(new ModuleConstructor());
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
      collector.stop("RESTARTED");
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

  private get orderedModules(): Module[] {
    const modules: Module[] = [];
    for (const priority in this.modules) {
      modules.push(...this.modules[priority]);
    }
    return modules;
  }

  /**
   * @param type
   * @param method
   * @param preprocess
   */
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
      for (const module of this.orderedModules) {
        try {
          await (<(event: Event<K>) => any>module[method])(event);
        } catch (err) {
          error(err);
        }
        if (event.isStopped()) {
          break;
        }
      }
    };
    return [type, handler];
  }

  /**
   * @param msg
   */
  private preprocessMessage(msg: Message): boolean {
    // Ignores bot messages
    if (msg.author === this.user) {
      return false;
    }
    return true;
  }
}
