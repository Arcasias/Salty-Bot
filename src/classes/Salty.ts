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
import { readdir } from "fs";
import { join } from "path";
import { env } from "process";
import { promisify } from "util";
import { help, intro, keywords, prefix } from "../strings";
import {
  CategoryId,
  CommandDescriptor,
  Dictionnary,
  FieldsDescriptor,
  MessageAction,
  MessageActionsDescriptor,
  MessageActor,
  Module,
  SaltyEmbedOptions,
  SaltyMessageOptions,
} from "../typings";
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
import Sailor from "./Sailor";

const readFolder = promisify(readdir);
const SCRIPT_REGEX = /\.(ts|js)$/;

const runningCollectors: Dictionnary<ReactionCollector> = {};

const commandsDir = "commands";
const modulesDir = "modules";
const sourceDir = "src";

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

  private modules: Module[] = [];
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
        return isAdmin(user, guild);
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
    Command.clearAll();
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
    log(`Initialising Salty (${env.MODE} environment).`);
    this.token = token;
    await connect();
    await this.loadCommands();
    await this.loadModules();
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

  /**
   * @param categoryFolder
   * @param fileName
   */
  private async loadCommand(
    categoryFolder: CategoryId,
    fileName: string
  ): Promise<void> {
    if (SCRIPT_REGEX.test(fileName)) {
      const module = await import(
        [
          "..",
          commandsDir,
          categoryFolder,
          fileName.replace(SCRIPT_REGEX, ""),
        ].join("/")
      );
      Command.registerCommand(
        module.default as CommandDescriptor,
        categoryFolder
      );
    }
  }

  /**
   * @param categoryFolder
   */
  private async loadCommandCategory(categoryFolder: CategoryId): Promise<void> {
    // Import __category__.json and all file names from category folder.
    const [categoryDescriptor, commandFileNames] = await Promise.all([
      import(["..", commandsDir, categoryFolder, "__category__"].join("/")),
      readFolder(join(sourceDir, commandsDir, categoryFolder)),
    ]);
    Command.registerCategory(categoryFolder, categoryDescriptor);
    // Load each command found in the given category folder.
    await Promise.all(
      commandFileNames.map((fileName) =>
        this.loadCommand(categoryFolder, fileName)
      )
    );
  }

  private async loadCommands(): Promise<void> {
    const categoryFolders = await readFolder(join(sourceDir, commandsDir));
    await Promise.all(
      // Load each category found in the "commands" folder.
      categoryFolders.map((categoryFolder) =>
        this.loadCommandCategory(categoryFolder as CategoryId)
      )
    );
    log(`${Command.list.size} static commands loaded.`);
  }

  /**
   * @param fileName
   */
  private async loadModule(fileName: string): Promise<void> {
    if (SCRIPT_REGEX.test(fileName)) {
      const importedModule = await import(
        ["..", modulesDir, fileName.replace(SCRIPT_REGEX, "")].join("/")
      );
      const module = importedModule.default as Module;
      if (module.onLoad) {
        await module.onLoad();
      }
      this.modules.push(module);
      for (const { category, command } of module.commands) {
        Command.registerCommand(command, category);
      }
    }
  }

  private async loadModules(): Promise<void> {
    const moduleFileNames = await readFolder(join(sourceDir, modulesDir));
    // Load each module found in the "modules" folder.
    await Promise.all(
      moduleFileNames.map((fileName) => this.loadModule(fileName))
    );
    const moduleCommands = this.modules.reduce(
      (acc, mod) => acc + mod.commands.length,
      0
    );
    log(
      `${this.modules.length} modules loaded with ${moduleCommands} additionnal static commands.`
    );
  }

  //===========================================================================
  // Private handlers
  //===========================================================================

  private async onChannelDelete(channel: Channel): Promise<any> {
    if (channel instanceof GuildChannel) {
      await Crew.update(
        { default_channel: channel.id },
        { default_channel: null }
      );
    }
  }

  private async onError(err: Error): Promise<any> {
    error(err.message);
    this.restart();
  }

  private async onGuildCreate(guild: Guild): Promise<any> {
    Crew.create({ discord_id: guild.id });
  }

  private async onGuildDelete(guild: Guild): Promise<any> {
    if (guild.members.cache.has(this.user.id)) {
      await Crew.remove({ discord_id: guild.id });
    }
  }

  private async onGuildMemberAdd(
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

  private async onGuildMemberRemove(
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

  private async onReady(): Promise<any> {
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
      `Salty loaded in ${loadingTime} second${
        loadingTime === 1 ? "" : "s"
      } and ready to salt the chat :D`
    );
  }

  private async onMessage(msg: Message): Promise<any> {
    const { attachments, author, cleanContent, guild } = msg;

    if (author.bot) {
      // Ignores all bots
      return;
    }

    // Looks for an interaction: DM, prefix or mention
    const prefixInteraction: boolean = cleanContent.startsWith(prefix);
    const mentionInteraction: boolean = msg.mentions.users.has(this.user.id);
    if (guild && !mentionInteraction && !prefixInteraction) {
      for (const module of this.modules) {
        if (module.onMessage) {
          module.onMessage(msg);
        }
      }
      return;
    }

    // Logs the  action
    logRequest(guild?.name || "DM", author.username, cleanContent);

    // All mentions are removed
    let content = msg.content.replace(/<@!\d+>/g, "");
    if (prefixInteraction) {
      // Prefix is removed
      content = content.slice(prefix.length);
    }

    // Fetches the actors of the action
    const { source, targets } = await this.getMessageActors(msg);
    if (source.sailor.black_listed) {
      // The action is discarded if the user is black-listed
      return;
    }

    // Handles the actual command if found
    const msgArgs = content
      .split(/\s+/)
      .map((w) => w.trim())
      .filter(Boolean);

    if (!msgArgs.length && !attachments.size) {
      // Simple interaction if the messsage is empty
      return this.message(msg, choice(help), { replyTo: msg });
    }

    const rawCommandName = msgArgs.shift() || "";
    const commandName = Command.aliases.get(clean(rawCommandName));
    if (commandName) {
      if (msgArgs.length && keywords.help.includes(clean(msgArgs[0]))) {
        return Command.run("help", msg, [rawCommandName], source, targets);
      } else {
        return Command.run(commandName, msg, msgArgs, source, targets);
      }
    }
    // If no command found, tries to find the closest matches
    const [closest] = search(
      [...Command.aliases.keys()],
      clean(rawCommandName),
      2
    );

    if (!closest) {
      return this.message(msg, choice(help), { replyTo: msg });
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
          Command.run(cmdName, msg, msgArgs, source, targets);
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
}
