import { Collection, Guild, Message, User } from "discord.js";
import {
    AvailableCategories,
    CommandAccess,
    CommandAction,
    CommandCategoryInfo,
    CommandChannel,
    CommandDescriptor,
    CommandHelpDescriptor,
    CommandHelpSection,
    MessageTarget,
    Runnable,
} from "../types";
import { isAdmin, isDev, isOwner } from "../utils";
import Salty from "./Salty";

const permissions: {
    [key in CommandAccess]: (user: User, guild: Guild) => boolean;
} = {
    admin: isAdmin,
    dev: isDev,
    owner: isOwner,
    public: () => true,
};

class Command implements CommandDescriptor, Runnable {
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

    public static aliases = new Collection<string, string>();
    public static categories = new Collection<string, CommandCategoryInfo>();
    public static doc = new Collection<string, CommandHelpDescriptor>();
    public static list = new Collection<string, Command>();

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
    public async run(msg: Message, args: string[], target: MessageTarget) {
        if (msg.guild && !permissions[this.access](msg.author, msg.guild)) {
            return Salty.warn(msg, this.access);
        }
        if (this.channel === "guild" && !msg.guild) {
            return Salty.warn(msg, "this is a direct message channel retard");
        }
        const commandParams = { msg, args, target };
        await this.action(commandParams);
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

export default Command;
