import {
  Collection,
  Guild,
  Message,
  PermissionString,
  Snowflake,
  User,
} from "discord.js";
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
import { sort } from "../utils/generic";
import { error } from "../utils/log";
import Salty from "./Salty";

const permissions: {
  [key in CommandAccess]: (user: User, guild: Guild) => boolean;
} = {
  admin: (user: User, guild: Guild | null) => salty.isAdmin(user, guild),
  dev: (user: User) => salty.isDev(user),
  owner: (user: User) => salty.isOwner(user),
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
  public guilds: Snowflake[] | null = null;
  public permissions: PermissionString[] | null = null;

  public static aliases = new Collection<string, string>();
  public static categories = new Collection<CategoryId, Category>();
  public static doc = new Collection<string, CommandHelpDescriptor>();
  public static list = new Collection<string, Command>();

  constructor(
    {
      action,
      help,
      aliases,
      name,
      access,
      channel,
      guilds,
      permissions,
    }: CommandDescriptor,
    category: CategoryId
  ) {
    this.action = action;
    this.name = name;
    this.aliases = aliases || [];
    this.category = category;
    this.help = help || [];
    this.access = access || "public";
    if (guilds?.length) {
      this.guilds = guilds;
      this.channel = "guild";
      if (permissions?.length) {
        this.permissions = permissions;
      }
    } else {
      this.channel = channel || "all";
    }
  }

  /**
   * Returns a relevant error message if the command cannot be executed in the
   * given message context, or false if it can.
   * @param message
   */
  public isRestricted({ author, client, guild }: Message): string | false {
    // Right channel
    if (this.channel === "guild") {
      if (!guild) {
        return "This is a direct message channel retard";
      }
      if (this.guilds && !this.guilds.includes(guild.id)) {
        return `You can't use "${this.name}" in this server`;
      }
    }
    if (guild) {
      // Right permissions
      if (this.permissions) {
        const clientMember = guild.members.cache.get(client.user!.id)!;
        if (!clientMember.hasPermission(this.permissions)) {
          return "I don't have the permission to do that.";
        }
      }
      // Right access
      if (!permissions[this.access](author, guild)) {
        const article = ["admin", "owner"].includes(this.access) ? "an" : "a";
        return `You need to have ${article} ${this.access} access to do that.`;
      }
    }
    return false;
  }

  /**
   * Runs the command action
   */
  public async run(context: ActionContext) {
    const { msg } = context;
    const restricted = this.isRestricted(msg);
    if (restricted) {
      return context.send.warn(restricted);
    }
    try {
      await this.action(context);
    } catch (err) {
      error(err.stack);
      await context.send.error(
        `Oh no! "${
          err.message
        }"! If you have the time I'd appreciate if you could fill in an issue on the following link describing what you've been doing to get me in this state! <${process
          .env.GITHUB_PAGE!}/issues>`
      );
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

  public static count() {
    return this.list.size;
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
        throw new Error(`Duplicate key "${key}" in command "${name}".`);
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
    salty: Salty,
    msg: Message,
    alias: string,
    source: MessageActor,
    targets: MessageActor[],
    ctxArgs: string[] = []
  ): ParialActionContext {
    const messageHelpers: ActionContextMessageHelpers = {
      embed: salty.embed.bind(salty, msg),
      error: salty.error.bind(salty, msg),
      info: salty.info.bind(salty, msg),
      message: salty.message.bind(salty, msg),
      success: salty.success.bind(salty, msg),
      warn: salty.warn.bind(salty, msg),
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
