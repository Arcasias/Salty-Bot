import Discord, { MessageEmbedOptions } from "discord.js";
import { readdir, readFileSync, statSync } from "fs";
import { join, sep } from "path";
import { devs, prefix, owner } from "../config";
import * as list from "../list";
import {
    choice,
    clean,
    error as logError,
    log,
    promisify,
    request,
    title,
} from "../utils";
import Command from "./Command";
import Database from "./Database";
import Dialog from "./Dialog";
import Guild from "./Guild";
import QuickCommand from "./QuickCommand";
import User from "./User";
import { SaltyException } from "./Exception";
import formatter from "./Formatter";

interface CategoryInfo {
    description: string;
    icon: string;
    name: string;
}

interface CommandHelp {
    keys: string[];
    name: string;
    visibility: string;
}

interface CommandManager {
    list: Discord.Collection<string, Command | QuickCommand>;
    keys: { [id: string]: string };
    help: { [id: string]: HelpManager };
}

export interface EmbedOptions extends MessageEmbedOptions {
    actions?: any;
    content?: string;
    inline?: boolean;
    react?: string;
}

interface HelpManager {
    info: CategoryInfo;
    commands: CommandHelp[];
}

const bot: Discord.Client = new Discord.Client();
const commandsRootPath: string[] = ["src", "commands"];
const commands: CommandManager = {
    list: new Discord.Collection(),
    keys: {},
    help: {},
};
const startTime: Date = new Date();

//-----------------------------------------------------------------------------
// Not exported
//-----------------------------------------------------------------------------

/**
 * @private
 */
async function _destroy(restart: boolean): Promise<void> {
    log("Disconnecting ...");
    bot.destroy();
    if (restart) {
        commands.list.clear();
        commands.keys = {};
        commands.help = {};
        await _loadCommands(...commandsRootPath).then(() =>
            log("Static commands loaded")
        );
        await bot.login(process.env.DISCORD_API);
    } else {
        await Database.disconnect();
        process.exit();
    }
}

/**
 * @private
 */
async function _loadCommand(
    commandPath: string,
    category: string
): Promise<void> {
    const commandImport: any = await import(commandPath);
    const command: Command = commandImport.default;
    const { name, keys, visibility } = command;
    if (process.env.DEBUG === "true") {
        for (let key of [name, ...keys]) {
            if (commands.list.get(key)) {
                throw new Error(
                    `Key "${key}" of command ${name} conflicts with command of the same name.`
                );
            }
            if (key in commands.keys) {
                throw new Error(`Duplicate key "${key}" in command "${name}".`);
            }
            if (key in commands.help || category === key) {
                throw new Error(
                    `Key "${key}" of command "${name}" is already a category.`
                );
            }
        }
    }
    // Registers command
    commands.list.set(name, command);
    commands.keys[name] = name;
    // Links each key to the command name in command keys
    keys.forEach((key) => {
        commands.keys[key] = name;
    });
    // Sets help content
    commands.help[category].commands.push({ name, keys, visibility });
}

/**
 * @private
 */
async function _loadCommands(...paths: string[]): Promise<void> {
    const dirpath: string = join(...paths);
    const files: string[] = await promisify(readdir.bind(null, dirpath));
    const category: string = dirpath.split(sep).pop();
    if (files.includes("__category__.json")) {
        const categoryInfoPath: string = join(dirpath, "__category__.json");
        const categoryInfo: CategoryInfo = JSON.parse(
            String(readFileSync(categoryInfoPath))
        );
        commands.help[category] = {
            info: categoryInfo,
            commands: [],
        };
    }
    const promises: Promise<void>[] = files.map((file) => {
        const fullpath: string = join(dirpath, file);
        const stats: any = statSync(fullpath);
        const extension: string = file.split(".").pop();

        if (stats.isDirectory()) {
            // If the file is a directory => executes the function inside
            _loadCommands(fullpath);
        } else if (["ts", "js", "cjs", "mjs"].includes(extension)) {
            // If the file is a category info file => extracts its data
            try {
                const commandPath: string = join("..", "..", fullpath).replace(
                    sep,
                    "/"
                );
                return _loadCommand(commandPath, category);
            } catch (err) {
                logError(`Could not load file "${file}:"`, err.stack);
            }
        }
    });
    await Promise.all(promises);
}

/**
 * @private
 */
async function _onChannelDelete(channel: Discord.GuildChannel): Promise<void> {
    Guild.each((guild: Guild) => {
        if (guild.default_channel === channel.id) {
            const guildDBId: number = Guild.get(channel.guild.id).id;
            Guild.update(guildDBId, { default_channel: false });
        }
    });
}

/**
 * @private
 */
async function _onError(err: Error): Promise<void> {
    logError(err);
    restart();
}

/**
 * @private
 */
async function _onGuildCreate(guild: Discord.Guild): Promise<void> {
    Guild.create({ discord_id: guild.id });
}

/**
 * @private
 */
async function _onGuildDelete(guild: Discord.Guild): Promise<void> {
    if (guild.member(bot.user)) {
        const guildDBId: number = Guild.get(guild.id).id;
        Guild.remove(guildDBId);
    }
}

/**
 * @private
 */
async function _onGuildMemberAdd(member: Discord.GuildMember): Promise<void> {
    const guild: Guild = Guild.get(member.guild.id);
    if (guild.default_channel) {
        const channel = getTextChannel(guild.default_channel);
        channel.send(
            `Hey there ${member.user}! Have a great time here (͡° ͜ʖ ͡°)`
        );
    }
    if (guild.default_role) {
        try {
            member.roles.add(guild.default_role);
        } catch (err) {
            logError(
                `Couldn't add default role to ${member.user.username}: permission denied`
            );
        }
    }
}

/**
 * @private
 */
async function _onGuildMemberRemove(
    member: Discord.GuildMember
): Promise<void> {
    const guild: Guild = Guild.get(member.guild.id);
    if (guild.default_channel) {
        const channel = getTextChannel(guild.default_channel);
        channel.send(
            `Well, looks like ${member.user.username} got bored of us :c`
        );
    }
}

/**
 * @private
 */
async function _onMessage(msg: Discord.Message): Promise<void> {
    const author: Discord.User = msg.author;
    const user: User = User.get(author.id);

    // Ignore all bots
    if (author.bot) {
        return;
    }

    const mention: Discord.User = msg.mentions.users.first();
    const nickname: string = msg.guild.members.cache.get(bot.user.id).nickname;
    const botNameRegex: string =
        bot.user.username + (nickname ? `|${clean(nickname)}` : "");

    // Look for username/nickname match or a mention if in a guild, else (DM) interaction
    // is always true.
    let interaction: boolean = true;
    if (msg.guild) {
        interaction =
            new RegExp(botNameRegex, "i").test(msg.content) ||
            (mention && mention.id === bot.user.id);
    }
    // Look for a prefix. Deleted if found.
    if (msg.content.startsWith(prefix)) {
        msg.content = msg.content.slice(1);
        interaction = true;
    }

    // Clean the message of any undesired spaces
    const msgArray: string[] = msg.content
        .split(" ")
        .filter((word) => word.trim() !== "");

    // Need an interaction passed point. Everything else is a "normal" message.
    if (!interaction) {
        return;
    }

    // Warning if blacklisted
    if (user && user.black_listed) {
        return error(
            msg,
            "you seem to be blacklisted. To find out why, ask my glorious creator"
        );
    }

    request(msg.guild.name, author.username, msg.content);

    if (!msgArray.length) {
        return message(msg, "yes?");
    }

    // Ensures the user and all mentions are already registered
    if (!user) {
        await User.create({ discord_id: author.id });
    }
    if (mention && !mention.bot && !User.get(mention.id)) {
        await User.create({ discord_id: mention.id });
    }
    for (let i = 0; i < msgArray.length; i++) {
        const args: string[] = msgArray.slice(i + 1);
        const commandName: string = commands.keys[clean(msgArray[i])];
        const command: Command | QuickCommand = commands.list.get(commandName);
        if (command) {
            if (args[0] && list.help.includes(args[0])) {
                return commands.list.get("help").run(msg, [commandName]);
            } else {
                return command.run(msg, args);
            }
        }
    }
    return commands.list.get("talk").run(msg, msgArray);
}

/**
 * @private
 */
async function _onMessageReactionAdd(
    msgReact: Discord.MessageReaction,
    author: Discord.User
): Promise<void> {
    if (author.bot) {
        return;
    }
    const { emoji, message } = msgReact;
    const dialog: Dialog = Dialog.find((d: Dialog) => d.author === author);

    if (!dialog || message !== dialog.response) {
        return;
    }
    try {
        await dialog.run(emoji.name);
    } catch (err) {
        logError(err);
    }
}

/**
 * @private
 */
async function _onReady(): Promise<void> {
    const preGuilds: { discord_id: string }[] = [];
    bot.user.setStatus("online"); // dnd , online , idle
    bot.guilds.cache.forEach((discordGuild) => {
        const guild: Guild = Guild.get(discordGuild.id);
        if (guild) {
            if (guild.default_channel) {
                const channel = getTextChannel(guild.default_channel);
                channel.send(title(choice(list.intro)));
            }
        } else {
            preGuilds.push({ discord_id: discordGuild.id });
        }
    });
    if (preGuilds.length) {
        Guild.create(...preGuilds);
    }

    const loadingTime: number =
        Math.floor((Date.now() - startTime.getTime()) / 100) / 10;

    log(
        `${commands.list.array().length} commands and ${
            QuickCommand.size
        } generic commands loaded. ${
            Object.keys(commands.keys).length
        } keys in total.`
    );
    log(
        `Salty loaded in ${loadingTime} second${
            loadingTime === 1 ? "" : "s"
        } and ready to salt the chat :D`
    );
}

//-----------------------------------------------------------------------------
// Exported
//-----------------------------------------------------------------------------

/**
 * Restarts the bot instance by reloading the command files and recreate a bot
 * instance.
 */
function restart(): Promise<void> {
    return _destroy(true);
}

/**
 * Terminates the bot instance.
 */
function destroy(): Promise<void> {
    return _destroy(false);
}

/**
 * Sends an embed message in the channel of the given 'msg' object.
 */
async function embed(
    msg: Discord.Message,
    options: EmbedOptions = {}
): Promise<void> {
    // Other options that might change
    let { react, actions } = options;
    const inline = options.inline || false;
    const content = options.content || "";

    if (!options.color) {
        options.color = 0xffffff;
    }
    if (options.title) {
        options.title = formatter.format(title(options.title), msg);
    }
    if (options.description) {
        options.description = formatter.format(title(options.description), msg);
    }
    if (options.footer && options.footer.text) {
        options.footer.text = formatter.format(title(options.footer.text), msg);
    }
    if (options.fields) {
        options.fields = options.fields.map((field) => {
            return {
                name: title(field.name),
                value: formatter.format(title(field.value), msg),
                inline,
            };
        });
    }
    const embed = new Discord.MessageEmbed(options);
    const newMessage: Discord.Message = await message(
        msg,
        formatter.format(content, msg),
        {
            embed,
            files: options.files,
        }
    );
    if (react && !msg.deleted) {
        msg.react(react).catch();
    }
    const dialog = new Dialog(msg, newMessage, actions);
    const reactions = Object.keys(dialog.actions);
    for (let i = 0; i < reactions.length; i++) {
        if (newMessage.deleted) {
            break;
        }
        await newMessage.react(reactions[i]);
    }
}

/**
 * Sends an embed with 'error' preset style.
 */
function error(
    msg: Discord.Message,
    text: string = "error",
    options: any = {}
): Promise<void> {
    return embed(
        msg,
        Object.assign(
            {
                title: text,
                react: "❌",
                color: 0xaa0000,
            },
            options
        )
    );
}

function getTextChannel(channelId: string): Discord.TextChannel {
    const channel: Discord.Channel = bot.channels.cache.get(channelId);
    if (!(channel instanceof Discord.TextChannel)) {
        throw new SaltyException(`Default channel is not a text channel.`);
    }
    return channel;
}

/**
 * Returns true if the given user has owner level privileges.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
function isOwner(user: Discord.User): boolean {
    return user.id === owner.id;
}

/**
 * Returns true if the given user has developer level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
function isDev(user: Discord.User): boolean {
    return isOwner(user) || devs.includes(user.id);
}

/**
 * Returns true if the given user has admin level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
function isAdmin(user: Discord.User, guild: Discord.Guild): boolean {
    return (
        isOwner(user) ||
        isDev(user) ||
        guild.member(user).hasPermission("ADMINISTRATOR")
    );
}

/**
 * Sends a simply structured message in the channel of the given 'msg' object.
 */
function message(
    msg: Discord.Message,
    text: string,
    options?: Discord.MessageOptions
): Promise<any> {
    return msg.channel.send(
        text && formatter.format(title(text), msg),
        options
    );
}

/**
 * Registers a command object in the current commands list.
 */
function setQuickCommand(command: QuickCommand): void {
    command.keys.split(",").forEach((key) => {
        commands.keys[key] = command.name;
    });
    commands.list.set(command.name, command);
}

/**
 * Entry point of the module. This function is responsible of executing the following
 * actions in the given order:
 * 1. Establish a connection with the PostgreSQL database
 * 2. Load the models: QuickCommand, Guild and User (order is irrelevant) and the
 *    command scripts
 * 3. Log into Discord through the API
 */
async function start(): Promise<void> {
    log("Initializing Salty");
    await Database.connect();
    await Promise.all([
        QuickCommand.load().then((commandData) =>
            commandData.forEach(setQuickCommand)
        ),
        Guild.load(),
        User.load(),
        _loadCommands(...commandsRootPath).then(() =>
            log("Static commands loaded")
        ),
    ]);
    await bot.login(process.env.DISCORD_API);
}

/**
 * Sends an embed with 'success' preset style.
 */
function success(
    msg: Discord.Message,
    text: string = "success",
    options: EmbedOptions = {}
): Promise<void> {
    return embed(
        msg,
        Object.assign(
            {
                title: text,
                react: "✅",
                color: 0x32a032,
            },
            options
        )
    );
}

/**
 * Unregisters a command object from the current commands list.
 */
function unsetQuickCommand(command: QuickCommand): void {
    command.keys.split(",").forEach((key) => {
        delete commands.keys[key];
    });
    commands.list.delete(command.name);
}

bot.on("channelDelete", _onChannelDelete);
bot.on("error", _onError);
bot.on("guildCreate", _onGuildCreate);
bot.on("guildDelete", _onGuildDelete);
bot.on("guildMemberAdd", _onGuildMemberAdd);
bot.on("guildMemberRemove", _onGuildMemberRemove);
bot.on("message", _onMessage);
bot.on("messageReactionAdd", _onMessageReactionAdd);
bot.on("ready", _onReady);

export default {
    // Properties
    bot,
    commands,
    startTime,
    // Functions
    destroy,
    embed,
    error,
    getTextChannel,
    start,
    isAdmin,
    isDev,
    isOwner,
    message,
    restart,
    setQuickCommand,
    success,
    unsetQuickCommand,
};
