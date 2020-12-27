import { Collection, Guild, Message, User } from "discord.js";
import salty from "../salty";
import {
  ActionContext,
  ActionContextMessageHelpers,
  Category,
  CategoryDescriptor,
  CategoryId,
  CommandAccess,
  CommandAction,
  CommandChannel,
  CommandDescriptor,
  CommandHelpDescriptor,
  CommandHelpSection,
  MessageActor,
  ParialActionContext,
} from "../typings";
import { error, isAdmin, isDev, isOwner, sort } from "../utils";

const permissions: {
  [key in CommandAccess]: (user: User, guild: Guild) => boolean;
} = {
  admin: isAdmin,
  dev: isDev,
  owner: isOwner,
  public: () => true,
};

export default class Command implements CommandDescriptor {
  // Action
  public action: CommandAction;
  // Infos
  public name: string;
  public aliases: string[];
  public category: CategoryId;
  public help: CommandHelpSection[];
  // Restrictions
  public access: CommandAccess;
  public channel: CommandChannel;

  public static aliases = new Collection<string, string>();
  public static categories = new Collection<CategoryId, Category>();
  public static doc = new Collection<string, CommandHelpDescriptor>();
  public static list = new Collection<string, Command>();

  constructor(
    { action, help, aliases, name, access, channel }: CommandDescriptor,
    category: CategoryId
  ) {
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
  public async run(context: ActionContext) {
    const { msg } = context;
    if (msg.guild && !permissions[this.access](msg.author, msg.guild)) {
      return salty.warn(
        msg,
        `You need to have the ${this.access} permission to do that.`
      );
    }
    if (this.channel === "guild" && !msg.guild) {
      return salty.warn(msg, "This is a direct message channel retard");
    }
    try {
      await this.action(context);
    } catch (err) {
      error(err.stack);
      await salty.error(msg, `Whoops! ${err.message}`);
    }
  }

  //===========================================================================
  // Static methods
  //===========================================================================

  /**
   * Resets all collections. This is typically done when starting or
   * restarting.
   */
  public static clearAll() {
    this.aliases = new Collection<string, string>();
    this.categories = new Collection<CategoryId, Category>();
    this.doc = new Collection<string, CommandHelpDescriptor>();
    this.list = new Collection<string, Command>();
  }

  public static getOrderedCategories(): Category[] {
    return sort([...this.categories.values()], "order");
  }

  public static registerCategory(
    id: CategoryId,
    descriptor: CategoryDescriptor
  ) {
    const category: Category = Object.assign({}, descriptor, {
      commands: [],
      id,
    });
    this.categories.set(id, category);
  }

  public static registerCommand(
    descriptor: CommandDescriptor,
    categoryId: CategoryId
  ): void {
    const command = new this(descriptor, categoryId);
    const { access, channel, help, aliases, name } = command;
    this.list.set(name, command);
    for (const key of [name, ...aliases]) {
      if (this.aliases.has(key)) {
        // throw new Error(`Duplicate key "${key}" in command "${name}".`);
      }
      this.aliases.set(key, name);
    }
    this.doc.set(name, {
      access,
      category: categoryId,
      channel,
      aliases,
      name,
      sections: help,
    });
    this.categories.get(categoryId)!.commands.push(command.name);
  }

  /**
   * @param command
   */
  public static removeCommand({ aliases, name }: CommandDescriptor) {
    for (const alias of aliases || []) {
      this.aliases.delete(alias);
    }
    this.list.delete(name);
  }

  public static createContext(
    msg: Message,
    alias: string,
    source: MessageActor,
    targets: MessageActor[],
    ctxArgs: string[] = []
  ): ParialActionContext {
    const messageHelpers: ActionContextMessageHelpers = {
      embed: (...args: any[]) => salty.embed(msg, ...args),
      error: (...args: any[]) => salty.error(msg, ...args),
      info: (...args: any[]) => salty.info(msg, ...args),
      message: (...args: any[]) => salty.message(msg, ...args),
      success: (...args: any[]) => salty.success(msg, ...args),
      warn: (...args: any[]) => salty.warn(msg, ...args),
    };
    const partialContext: ParialActionContext = {
      alias,
      args: ctxArgs,
      msg,
      source,
      targets,
      send: messageHelpers,
      run: (name: string, args: string[] = ctxArgs): Promise<any> => {
        if (!this.list.has(name)) {
          throw new Error(`No command found with name "${name}"`);
        }
        const actionParams = Object.assign(partialContext, { args });
        return this.list.get(name)!.run(actionParams as ActionContext);
      },
    };
    return partialContext;
  }
}
