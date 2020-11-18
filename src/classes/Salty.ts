import {
  APIMessage,
  APIMessageContentResolvable,
  Channel,
  Client,
  Collection,
  DMChannel,
  Guild,
  GuildChannel,
  GuildEmoji,
  GuildMember,
  Message,
  MessageEditOptions,
  MessageEmbed,
  NewsChannel,
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
  MessageAction,
  MessageActionsDescriptor,
  MessageActor,
  SaltyEmbedOptions,
  SaltyMessageOptions,
} from "../types";
import {
  apiCatch,
  choice,
  clean,
  ellipsis,
  error,
  format,
  isAdmin,
  isDev,
  isOwner,
  log,
  logRequest,
  search,
  title,
} from "../utils";
import Command from "./Command";
import Crew from "./Crew";
import { connect, disconnect } from "./Database";
import QuickCommand from "./QuickCommand";
import Sailor from "./Sailor";

const runningCollectors: Dictionnary<ReactionCollector> = {};

export default class Salty {
  //===========================================================================
  // Public properties
  //===========================================================================

  public bot: Client = this.createClient();
  public startTime = new Date();

  public get sailor() {
    return new Sailor({
      id: false,
      discord_id: this.user.id,
    });
  }

  public get user() {
    return this.bot.user!;
  }

  //===========================================================================
  // Private properties
  //===========================================================================

  private token: string | null = null;

  //===========================================================================
  // Public methods
  //===========================================================================

  /**
   * @param userId
   * @param msg
   * @param actions
   */
  public addActions(
    userId: string,
    msg: Message,
    { actions, onEnd }: MessageActionsDescriptor
  ) {
    if (msg.deleted) {
      return;
    }
    if (userId in runningCollectors) {
      runningCollectors[userId].stop("NEW_COLLECTOR");
    }
    const collector = msg.createReactionCollector(
      ({ emoji }, { bot }) => !bot && actions.has(emoji.name),
      { time: 3 * 60 * 1000 }
    );

    runningCollectors[userId] = collector;
    const abort = () => collector.stop("OPTION_SELECTED");
    this.react(msg, ...actions.keys());

    collector.on("collect", async ({ emoji }, user) => {
      const action = actions.get(emoji.name);
      if (action?.onAdd) {
        action.onAdd(user, abort);
      }
    });
    collector.on("remove", async ({ emoji }, user) => {
      const action = actions.get(emoji.name);
      if (action?.onRemove) {
        action.onRemove(user, abort);
      }
    });
    collector.on("end", async (collected, reason) => {
      delete runningCollectors[userId];
      apiCatch(() => msg.reactions.removeAll());
      collector.empty();
      if (onEnd) {
        onEnd(collected, reason);
      }
    });
  }

  public createClient() {
    // Creates new client
    const bot = new Client();
    // Binds handlers
    bot.on("channelDelete", this.onChannelDelete.bind(this));
    bot.on("error", this.onError.bind(this));
    bot.on("guildCreate", this.onGuildCreate.bind(this));
    bot.on("guildDelete", this.onGuildDelete.bind(this));
    bot.on("guildMemberAdd", this.onGuildMemberAdd.bind(this));
    bot.on("guildMemberRemove", this.onGuildMemberRemove.bind(this));
    bot.on("message", this.onMessage.bind(this));
    bot.on("ready", this.onReady.bind(this));
    return bot;
  }

  /**
   * @param msg
   */
  public async deleteMessage(msg: Message): Promise<any> {
    await apiCatch(() => msg.delete());
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
    await apiCatch(() => msg.edit(content));
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
    const result = await apiCatch(() =>
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
      const result = apiCatch(() => msg.react(react));
      if (!result) {
      }
    }
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

  //===========================================================================
  // Private methods
  //===========================================================================

  /**
   * @param msg
   */
  private async getMessageActors({
    author,
    member,
    mentions,
  }: Message): Promise<{
    source: MessageActor;
    targets: MessageActor[];
  }> {
    const userSailors: Map<string, Sailor | null> = new Map();
    const idsToFetch: string[] = [];
    for (const user of [author, ...mentions.users.values()]) {
      if (user.id === this.bot.user?.id) {
        userSailors.set(user.id, this.sailor);
      } else if (!user.bot) {
        userSailors.set(user.id, null);
        idsToFetch.push(user.id);
      }
    }

    // Get existing sailors
    const existingSailors: Sailor[] = await Sailor.search({
      discord_id: idsToFetch,
    });
    for (const sailor of existingSailors) {
      userSailors.set(sailor.discord_id, sailor);
    }

    // Fill with new sailors if needed
    const idsToCreate: { discord_id: string }[] = [...userSailors]
      .filter(([id, sailor]) => !sailor)
      .map(([id]) => ({ discord_id: id }));
    if (idsToCreate.length) {
      const newSailors: Sailor[] = await Sailor.create(...idsToCreate);
      for (const sailor of newSailors) {
        userSailors.set(sailor.discord_id, sailor);
      }
    }

    const source: MessageActor = {
      user: author,
      member,
      sailor: userSailors.get(author.id)!,
      name: member?.displayName || author.username,
    };
    const targets: MessageActor[] = mentions.users.map((user, id) => {
      const member = mentions.members?.get(id) || null;
      return {
        user,
        member,
        sailor: userSailors.get(id)!,
        name: member?.displayName || user.username,
      };
    });

    return { source, targets };
  }

  //===========================================================================
  // Private handlers
  //===========================================================================

  protected async onChannelDelete(channel: Channel): Promise<any> {
    if (channel instanceof GuildChannel) {
      await Crew.update(
        { default_channel: channel.id },
        { default_channel: null }
      );
    }
  }

  protected async onError(err: Error): Promise<any> {
    error(err.message);
    this.restart();
  }

  protected async onGuildCreate(guild: Guild): Promise<any> {
    Crew.create({ discord_id: guild.id });
  }

  protected async onGuildDelete(guild: Guild): Promise<any> {
    if (guild.member(this.user)) {
      await Crew.remove({ discord_id: guild.id });
    }
  }

  protected async onGuildMemberAdd(
    member: GuildMember | PartialGuildMember
  ): Promise<any> {
    const guild = await Crew.get(member.guild.id);
    if (guild?.default_channel) {
      const channel = this.getTextChannel(guild.default_channel);
      this.message(
        channel,
        `Hey there ${member.user}! Have a great time here (͡° ͜ʖ ͡°)`
      );
    }
    if (guild?.default_role) {
      member.roles.add(guild.default_role);
    }
  }

  protected async onGuildMemberRemove(
    member: GuildMember | PartialGuildMember
  ): Promise<any> {
    const guild = await Crew.get(member.guild.id);
    if (guild?.default_channel) {
      const channel = this.getTextChannel(guild.default_channel);
      this.message(
        channel,
        `Well, looks like ${member.displayName} got bored of us :c`
      );
    }
  }

  protected async onReady(): Promise<any> {
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
        this.message(channel, choice(intro));
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

  protected async onMessage(msg: Message): Promise<any> {
    if (msg.author.bot) {
      return false;
    }
    const { attachments, author, cleanContent, guild } = msg;
    let content = cleanContent;

    // Look for an interaction: DM, prefix or mention
    const hasPrefix = content.startsWith(prefix);
    if (guild && !msg.mentions.users.has(this.user.id) && !hasPrefix) {
      return;
    }
    if (hasPrefix) {
      // Prefix is removed
      content = content.slice(prefix.length);
    }

    // Logs the  action
    logRequest(guild?.name || "DM", author.username, cleanContent);

    // Fetches the actors of the action
    const { source, targets } = await this.getMessageActors(msg);
    if (source.sailor.black_listed) {
      // The action is discarded if the user is black-listed
      return;
    }
    if (!content.length && !attachments.size) {
      // Simple interaction if the messsage is empty
      return this.message(msg, "Yes?");
    }

    // Handles the actual command if found
    const msgArgs = content
      .split(/\s+/)
      .map((w) => w.trim())
      .filter(Boolean);
    const rawArgs = msgArgs.slice();
    const rawCommandName = msgArgs.shift() || "";
    const commandName = Command.aliases.get(clean(rawCommandName));
    if (commandName) {
      if (msgArgs.length && keywords.help.includes(clean(msgArgs[0]))) {
        return Command.list.get("help")!.run(msg, rawArgs, source, targets);
      } else {
        return Command.list
          .get(commandName)!
          .run(msg, msgArgs, source, targets);
      }
    }
    // If no command found, tries to find the closest matches
    const [closest] = search(
      [...Command.aliases.keys()],
      clean(rawCommandName),
      2
    );
    if (!closest) {
      // If no command nor close match, the "talk" command is called instead
      return Command.list.get("talk")!.run(msg, rawArgs, source, targets);
    }
    const cmdName = Command.aliases.get(closest)!;
    const helpMessage = await this.message(
      msg,
      `command "*${rawCommandName}*" doesn't exist. Did you mean "*${cmdName}*"?`
    );
    if (!helpMessage) {
      return;
    }
    const actions = new Collection<string, MessageAction>();
    actions.set("✅", {
      onAdd: (user) => {
        if (author.id === user.id) {
          this.deleteMessage(helpMessage);
          Command.list.get(cmdName)!.run(msg, msgArgs, source, targets);
        }
      },
    });
    actions.set("❌", {
      onAdd: (user) => {
        if (author.id === user.id) {
          this.deleteMessage(helpMessage);
        }
      },
    });
    return this.addActions(author.id, helpMessage, {
      actions,
    });
  }

  //===========================================================================
  // Static properties
  //===========================================================================

  public static construct: typeof Salty = Salty;

  //===========================================================================
  // Static methods
  //===========================================================================

  public static create() {
    return new this.construct();
  }

  public static extend<T extends typeof Salty>(
    extender: (cls: typeof Salty) => T
  ): void {
    this.construct = extender(this.construct);
  }
}
