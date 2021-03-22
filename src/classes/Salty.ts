import {
  Channel,
  Client,
  DMChannel,
  Guild,
  GuildChannel,
  GuildEmoji,
  GuildMember,
  Message,
  MessageEmbed,
  MessageReaction,
  NewsChannel,
  PartialGuildMember,
  PartialMessage,
  PartialUser,
  ReactionCollector,
  Snowflake,
  TextChannel,
  User,
} from "discord.js";
import { readdir } from "fs";
import { join } from "path";
import { env } from "process";
import { promisify } from "util";
import { adjustDatabase } from "../database/autoDB";
import { config, loadConfig } from "../database/config";
import { connect, disconnect } from "../database/helpers";
import { answers } from "../strings";
import {
  CallbackDescriptor,
  CategoryId,
  CommandDescriptor,
  Dictionnary,
  MessageActionsDescriptor,
  RoleBox,
  SaltyEmbedOptions,
  SaltyMessageOptions,
} from "../typings";
import {
  choice,
  clean,
  ellipsis,
  parseRoleBox,
  plural,
  sort,
  title,
} from "../utils/generic";
import { clearHistory, debug, error, log } from "../utils/log";
import Command from "./Command";
import Crew from "./Crew";
import Sailor from "./Sailor";
import SaltyModule from "./SaltyModule";

const readFolder = promisify(readdir);
const SCRIPT_REGEX = /\.(ts|js)$/;

const runningCollectors: Dictionnary<ReactionCollector> = {};

const commandsDir = "commands";
const modulesDir = "modules";
const sourceDir = "src";

const TEXT_REGEX = /\w+/;

export default class Salty {
  //===========================================================================
  // Public properties
  //===========================================================================

  public bot: Client = this.createClient();
  public startTime = new Date();

  public get sailor() {
    return new Sailor({
      id: false,
      discordId: this.user.id,
    });
  }

  public get user() {
    return this.bot.user!;
  }

  //===========================================================================
  // Private properties
  //===========================================================================

  private callbackDescriptors: CallbackDescriptor[] = [];
  private destroyed: boolean = false;
  private dispatching: boolean = false;
  private roleBoxes: RoleBox[] = [];
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
    msg: Message,
    { actions, onEnd }: MessageActionsDescriptor,
    userId: string | null = null,
    time: number = 3 * 60 * 1000
  ) {
    if (msg.deleted) return;

    const collector = msg.createReactionCollector(
      ({ emoji }, { bot }) => !bot && actions.has(emoji.name),
      { dispose: true, time }
    );

    if (userId) {
      if (userId in runningCollectors) {
        runningCollectors[userId].stop("NEW_COLLECTOR");
      }
      runningCollectors[userId] = collector;
    }

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
      if (msg.deleted) return;

      if (userId) {
        delete runningCollectors[userId];
        msg.reactions.removeAll().catch();
      }
      collector.empty();
      if (onEnd) {
        onEnd(collected, reason);
      }
    });
  }

  /**
   * Cancels a currently dispatched action.
   */
  public cancelDispatch(): void {
    if (!this.dispatching) {
      throw new Error(`No dispatch in progress.`);
    }
    this.dispatching = false;
  }

  /**
   * @param roleBox
   */
  public async addRoleBox(message: Message, roleBox: RoleBox): Promise<void> {
    this.roleBoxes.push(roleBox);
    const emojis = roleBox.emojiRoles.map((e) => e[0]);
    await this.react(message, ...emojis);
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
    bot.on("messageDelete", this.onMessageDelete.bind(this));
    bot.on("messageReactionAdd", this.onMessageReactionAdd.bind(this));
    bot.on("messageReactionRemove", this.onMessageReactionRemove.bind(this));
    bot.on("ready", this.onReady.bind(this));
    return bot;
  }

  /**
   * Terminates the bot instance.
   */
  public async destroy(): Promise<void> {
    // Has been previously destroyed already
    if (this.destroyed) return;

    log("Disconnecting ...");
    this.destroyed = true;

    if (this.bot.user) {
      const crews: Crew[] = await Crew.search();
      await Promise.all(
        crews.map(async (crew) => {
          const guild = this.bot.guilds.cache.get(crew.discordId)!;
          const channel = crew.getDefaultChannel(guild);
          if (channel) {
            await this.message(channel, `${choice(answers.bye)} ♥`);
          }
        })
      );
      await disconnect();
      this.user.setStatus("invisible");
    }

    this.bot.destroy();
    process.exit();
  }

  /**
   * @param method
   * @param payload
   */
  public dispatch(method: string, ...payload: any[]): void {
    if (this.dispatching) {
      throw new Error(`Dispatch currently in progress.`);
    }
    this.dispatching = true;
    const filteredCallbacks = this.callbackDescriptors.filter(
      (cbDescriptor) => cbDescriptor.method === method
    );
    const sortedCallbacks = sort(filteredCallbacks, "sequence");

    debug(`Dispatch [${method}]: ${payload.join(", ")}`);

    for (const { callback } of sortedCallbacks) {
      if (!this.dispatching) return;
      callback(...payload);
    }
    this.dispatching = false;
  }

  /**
   * Sends an embed message in the channel of the given 'msg' object.
   */
  public async embed(
    msg: Message,
    options: SaltyEmbedOptions = {}
  ): Promise<Message> {
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
      defaultedOptions.title = title(defaultedOptions.title);
    }
    if (defaultedOptions.description) {
      defaultedOptions.description = title(defaultedOptions.description);
    }
    if (defaultedOptions.footer?.text) {
      defaultedOptions.footer.text = title(defaultedOptions.footer.text);
    }
    if (defaultedOptions.fields) {
      defaultedOptions.fields = defaultedOptions.fields.map(
        ({ name, value, inline: fieldInline }) => ({
          name: title(name),
          value: title(value),
          inline: fieldInline ?? inline,
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
  public error(
    msg: Message,
    text: string = "error",
    options: SaltyEmbedOptions = {}
  ): Promise<Message> {
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
   * @param msg
   * @param text
   * @param options
   */
  public info(
    msg: Message,
    text: string = "info",
    options: SaltyEmbedOptions = {}
  ): Promise<Message> {
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
   * Returns true if the given user has admin level privileges or higher.
   * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
   */
  public isAdmin(user: User, guild: Guild | null): boolean {
    return (
      !guild ||
      this.isDev(user) ||
      guild.members.cache.get(user.id)!.hasPermission("ADMINISTRATOR")
    );
  }

  /**
   * Returns true if the given user has developer level privileges or higher.
   * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
   */
  public isDev(user: User): boolean {
    return this.isOwner(user) || config.devIds.includes(user.id);
  }

  /**
   * Returns true if the given user has owner level privileges.
   * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
   */
  public isOwner(user: User): boolean {
    return user.id === config.ownerId;
  }

  /**
   * Sends a simply structured message in the channel of the given 'msg' object.
   */
  public async message(
    target: Message | TextChannel | DMChannel | NewsChannel | User,
    content: string = "",
    options?: SaltyMessageOptions
  ): Promise<Message> {
    const defaultedOptions = Object.assign(
      {
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
    if (defaultedOptions.title) {
      content = title(content);
    }
    const result = await channel.send(ellipsis(content), options || {});
    return Array.isArray(result) ? result[0] : result;
  }

  /**
   * @param msg
   * @param reactions
   */
  public async react(
    msg: Message,
    ...reactions: (string | GuildEmoji)[]
  ): Promise<void> {
    for (const react of reactions) {
      if (msg.deleted) return;

      const emoji =
        react instanceof GuildEmoji || !TEXT_REGEX.test(react)
          ? react
          : this.bot.emojis.cache.find((e) => clean(e.name) === clean(react));
      if (!emoji) {
        continue;
      }

      try {
        await msg.react(emoji);
      } catch (err) {
        return;
      }
    }
  }

  /**
   * @param roleBox
   */
  public removeRoleBox(channelId: Snowflake, messageId: Snowflake): number {
    const newRoleBoxes = this.roleBoxes.filter(
      (b) => b.channelId !== channelId || b.messageId !== messageId
    );
    const removeCount = this.roleBoxes.length - newRoleBoxes.length;
    this.roleBoxes = newRoleBoxes;
    return removeCount;
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
    this.bot.destroy();
    this.bot = this.createClient();
    await disconnect();
    Command.clearAll();
    this.roleBoxes = [];
    this.callbackDescriptors = [];
    this.startTime = new Date();
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
    await this.load();
    await this.bot.login(this.token);
    clearHistory();
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
  ): Promise<Message> {
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
  ): Promise<Message> {
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
   * Sequentially performs the following actions in order:
   * 1. Loads all categories of commands and related commands
   * 2. Loads all modules (synchronous part, i.e. class definition etc.)
   * 3. Establishes a connection to the database
   * 4. Ensures that the database schema matches the registered models
   * 5. Loads all modules asynchonous actions
   */
  private async load(): Promise<void> {
    // COMMANDS
    const categoryFolders = await readFolder(join(sourceDir, commandsDir));
    await Promise.all(
      // Load each category found in the "commands" folder.
      categoryFolders.map((categoryFolder) =>
        this.loadCommandCategory(categoryFolder as CategoryId)
      )
    );
    log(`${Command.list.size} static commands loaded.`);

    // MODULES
    const moduleFileNames = await readFolder(join(sourceDir, modulesDir));
    const previousCommandCount = Command.list.size;
    // Load each module found in the "modules" folder.
    await Promise.all(
      moduleFileNames.map((fileName) => this.loadModule(fileName))
    );
    const moduleCommandCount = Command.list.size - previousCommandCount;

    // DATABASE
    await connect();
    await adjustDatabase();
    await loadConfig();

    this.dispatch("load");

    log(`${moduleCommandCount} additionnal static commands loaded by modules.`);
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

  /**
   * @param fileName
   */
  private async loadModule(fileName: string): Promise<void> {
    if (!SCRIPT_REGEX.test(fileName)) return;

    const importedModule = await import(
      ["..", modulesDir, fileName.replace(SCRIPT_REGEX, "")].join("/")
    );
    const ModuleConstructor = importedModule.default as typeof SaltyModule;
    const module = new ModuleConstructor(this);
    for (const { method, callback, sequence } of module.callbacks) {
      this.callbackDescriptors.push({
        method,
        callback: callback.bind(module),
        sequence: sequence ?? 0,
      });
    }
    if (module.category) {
      const id = module.category.name as CategoryId;
      Command.registerCategory(id, module.category);
    }
    const commands = module.commands || {};
    for (const categoryName in commands) {
      const categoryId = categoryName as CategoryId;
      for (const command of commands[categoryId]!) {
        Command.registerCommand(command, categoryId);
      }
    }
  }

  //===========================================================================
  // Private handlers
  //===========================================================================

  private async onChannelDelete(channel: Channel): Promise<any> {
    if (channel instanceof GuildChannel) {
      await Crew.update(
        { defaultChannel: channel.id },
        { defaultChannel: null }
      );
    }
  }

  private async onError(err: Error): Promise<any> {
    error(err.message);
    this.restart();
  }

  private async onGuildCreate(guild: Guild): Promise<any> {
    await Crew.create({ discordId: guild.id });
  }

  private async onGuildDelete(guild: Guild): Promise<any> {
    await Crew.remove({ discordId: guild.id });
  }

  private async onGuildMemberAdd(
    member: GuildMember | PartialGuildMember
  ): Promise<any> {
    const crew = await Crew.get(member.guild.id);
    const channel = crew?.getDefaultChannel(member.guild);
    if (channel) {
      this.message(
        channel,
        `Hey there ${member.displayName}! Have a great time here (͡° ͜ʖ ͡°)`
      );
    }
    if (crew?.defaultRole) {
      member.roles.add(crew.defaultRole);
    }
  }

  private async onGuildMemberRemove(
    member: GuildMember | PartialGuildMember
  ): Promise<any> {
    const crew = await Crew.get(member.guild.id);
    const channel = crew?.getDefaultChannel(member.guild);
    if (channel) {
      this.message(
        channel,
        `Well, looks like ${member.displayName} got bored of us :c`
      );
    }
  }

  private async onMessage(msg: Message): Promise<void> {
    if (msg.author.bot) return;

    this.dispatch("message", msg);
  }

  private async onMessageDelete(
    message: Message | PartialMessage
  ): Promise<any> {
    if (!message.guild) return;

    this.removeRoleBox(message.channel.id, message.id);
  }

  private async onMessageReactionAdd(
    react: MessageReaction,
    user: User | PartialUser
  ): Promise<any> {
    const { emoji, message } = react;
    if (!message.guild || user.bot) return;

    const roleBox = this.roleBoxes.find((r) => r.messageId === message.id);
    if (!roleBox) return;

    const emojiRole = roleBox.emojiRoles.find((e) => e[0] === emoji.name);
    if (!emojiRole) {
      return react.remove().catch();
    }
    const member = message.guild.members.cache.get(user.id)!;
    member.roles.add(emojiRole[1]).catch();
  }

  private async onMessageReactionRemove(
    { emoji, message }: MessageReaction,
    user: User | PartialUser
  ): Promise<any> {
    if (!message.guild || user.bot) return;

    const roleBox = this.roleBoxes.find((r) => r.messageId === message.id);
    if (!roleBox) return;

    const emojiRole = roleBox.emojiRoles.find((e) => e[0] === emoji.name);
    if (!emojiRole) return;

    const member = message.guild.members.cache.get(user.id)!;
    member.roles.remove(emojiRole[1]).catch();
  }

  private async onReady(): Promise<any> {
    this.user.setStatus("online");

    // Fetch all guilds
    const activeGuilds: string[] = this.bot.guilds.cache.map(
      (guild) => guild.id
    );
    let crews: Crew[] = await Crew.search();
    const toRemove: number[] = crews
      .filter((g) => !activeGuilds.includes(g.discordId))
      .map((g) => g.id);
    const toCreate: Dictionnary<any>[] = activeGuilds
      .filter((id) => !crews.some((g) => g.discordId === id))
      .map((id) => ({ discordId: id }));
    if (toCreate.length) {
      await Crew.create(...toCreate);
    }
    if (toRemove.length) {
      // No need to wait for this one
      Crew.remove(toRemove);
      crews = crews.filter((c) => !toRemove.includes(c.id));
    }

    for (const crew of crews) {
      const guild = this.bot.guilds.cache.get(crew.discordId)!;
      const toUpdate: Dictionnary<any> = {};

      // Default channel
      if (crew.defaultChannel) {
        const channel = guild.channels.cache.get(crew.defaultChannel);
        if (!(channel instanceof TextChannel)) {
          toUpdate.defaultChannel = null;
        }
      }

      // Active roleBoxes
      const roleBoxesToRemove: string[] = [];
      for (const rawRoleBox of crew.roleBoxes) {
        const roleBox = parseRoleBox(rawRoleBox);
        const { channelId, messageId, emojiRoles } = roleBox;
        const channel = guild.channels.cache.get(channelId);

        // If the channel doesn't exist anymore => remove the role box
        if (!channel || !(channel instanceof TextChannel)) {
          roleBoxesToRemove.push(rawRoleBox);
          continue;
        }

        // If one of the roles is missing => remove the role box
        if (emojiRoles.find((e) => !guild.roles.cache.has(e[1]))) {
          roleBoxesToRemove.push(rawRoleBox);
          continue;
        }
        const message =
          channel.messages.cache.get(messageId) ||
          (await channel.messages.fetch(messageId).catch());

        // If the message doesn't exist anymore => remove the role box
        if (!message) {
          roleBoxesToRemove.push(rawRoleBox);
          continue;
        }

        // Role box is clear => add it
        this.addRoleBox(message, roleBox);
      }

      if (roleBoxesToRemove.length) {
        toUpdate.roleBoxes = crew.roleBoxes.filter(
          (b) => !roleBoxesToRemove.includes(b)
        );
      }

      // Update any necessary information
      if (Object.keys(toUpdate).length) {
        Crew.update(crew.id, toUpdate);
      }
    }

    const loadingTime: number =
      Math.floor((Date.now() - this.startTime.getTime()) / 100) / 10;

    log(`Bot loaded in ${loadingTime} ${plural("second", loadingTime)}.`);
  }
}
