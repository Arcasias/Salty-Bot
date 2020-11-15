import { Collection, Guild, Message, User } from "discord.js";
import salty from "../salty";
import {
  ActionParameters,
  AvailableCategories,
  CommandAccess,
  CommandAction,
  CommandCategoryInfo,
  CommandChannel,
  CommandDescriptor,
  CommandHelpDescriptor,
  CommandHelpSection,
  CommandType,
  MessageActor,
  Runnable,
} from "../types";
import { error, isAdmin, isDev, isOwner } from "../utils";
import QuickCommand from "./QuickCommand";

const permissions: {
  [key in CommandAccess]: (user: User, guild: Guild) => boolean;
} = {
  admin: isAdmin,
  dev: isDev,
  owner: isOwner,
  public: () => true,
};

export default class Command implements CommandDescriptor, Runnable {
  // Action
  public action: CommandAction;
  // Infos
  public name: string;
  public aliases: string[];
  public category: AvailableCategories;
  public help: CommandHelpSection[];
  // Restrictions
  public access: CommandAccess;
  public channel: CommandChannel;
  public type: CommandType = "core";

  public static aliases = new Collection<string, string>();
  public static categories = new Collection<string, CommandCategoryInfo>();
  public static doc = new Collection<string, CommandHelpDescriptor>();
  public static list = new Collection<string, Command | QuickCommand>();

  constructor({
    action,
    category,
    help,
    aliases,
    name,
    access,
    channel,
  }: CommandDescriptor) {
    this.action = action;
    this.name = name;
    this.aliases = aliases || [];
    this.category = category;
    this.help = help || [];
    this.access = access || "public";
    this.channel = channel || "all";
  }

  /**
   * Runs the command action
   */
  public async run(
    msg: Message,
    args: string[],
    source: MessageActor,
    targets: MessageActor[]
  ) {
    if (msg.guild && !permissions[this.access](msg.author, msg.guild)) {
      return salty.warn(
        msg,
        `You need to have the ${this.access} permission to do that.`
      );
    }
    if (this.channel === "guild" && !msg.guild) {
      return salty.warn(msg, "This is a direct message channel retard");
    }
    const commandParams: ActionParameters = { msg, args, source, targets };
    try {
      await this.action(commandParams);
    } catch (err) {
      error(err.stack);
      await salty.error(msg, `Whoops! ${err.message}`);
    }
  }

  public static register(descriptor: CommandDescriptor) {
    const command = new this(descriptor);
    const { access, category, channel, help, aliases, name } = command;
    this.list.set(name, command);
    for (const key of [name, ...aliases]) {
      if (this.aliases.has(key)) {
        throw new Error(`Duplicate key "${key}" in command "${name}".`);
      }
      this.aliases.set(key, name);
    }
    this.doc.set(name, {
      access,
      category,
      channel,
      aliases,
      name,
      sections: help,
    });
  }
}
