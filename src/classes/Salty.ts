import Discord from "discord.js";
import { readdir, readFileSync, statSync } from "fs";
import { join, sep } from "path";
import config from "../data/config";
import list from "../data/list";
import {
    choice,
    clean,
    error as logError,
    log,
    possessive,
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

interface Commands {
    list: Discord.Collection;
    keys: Keys;
    help: HelpInfo;
}

interface EmbedField {
    title: string;
    description: string;
}

interface EmbedOptions {
    title?: string;
    description?: string;
    color?: number;
    author?: string;
    timestamp?: string;
    footer?: string;
    react?: string;
    actions?: any;
    inline?: boolean;
    content?: string;
    url?: string;
    thumbnail?: string;
    image?: string;
    fields?: EmbedField[];
    file?: string;
}

interface Help {
    info: CategoryInfo;
    commands: CommandHelp[];
}

interface PreGuild {
    discord_id: string;
}

type Keys = { [id: string]: string };
type HelpInfo = { [id: string]: Help };

const bot: Discord.Client = new Discord.Client();
const commandsRootPath: string[] = ["src", "commands"];
const commands: Commands = {
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
    await bot.destroy();
    if (restart) {
        await _loadCommands(...commandsRootPath).then(() =>
            log("Commands loaded")
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
    const command: any = await import(commandPath);
    const { name, keys, visibility } = command.default;
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
        } else if (["js", "cjs", "mjs"].includes(extension)) {
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
async function _onChannelDelete(channel: Discord.Channel): Promise<void> {
    Guild.forEach((guild: Discord.Guild) => {
        if (guild.default_channel === channel.id) {
            const guildDBId: string = Guild.get(guild.id).id;
            Guild.update(guildDBId, { default_channel: false });
        }
    });
}

/**
 * @private
 */
async function _onError(err: Error): Promise<void> {
    logError(err);
    bot.destroy(true);
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
        const guildDBId: string = Guild.find(guild.id).id;
        Guild.remove(guildDBId);
    }
}

/**
 * @private
 */
async function _onGuildMemberAdd(member: Discord.GuildMember): Promise<void> {
    const guild: Guild = Guild.get(member.guild.id);
    if (guild.default_channel) {
        await bot.channels
            .get(guild.default_channel)
            .send(`Hey there ${member.user} ! Have a great time here (͡° ͜ʖ ͡°)`);
    }
    if (guild.default_role) {
        try {
            member.addRole(guild.default_role);
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
    const guild: Guild = Guild.find(member.guild.id);
    if (guild.default_channel) {
        bot.channels
            .get(guild.default_channel)
            .send(`Well, looks like ${member.user.username} got bored of us:c`);
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

    const mention: Discord.GuildMember = msg.mentions.users.first();
    const nickname: string = msg.guild.members.cache.get(bot.user.id).nickname;
    const botNameRegex: string =
        bot.user.username + (nickname ? `|${clean(nickname)}` : "");

    // Look for username/nickname match or a mention if in a guild, else (DM) interaction
    // is always true.
    let interaction: boolean = true;
    if (msg.guild) {
        interaction =
            msg.content.match(new RegExp(botNameRegex, "i")) ||
            (mention && mention.id === bot.user.id);
    }
    // Look for a prefix. Deleted if found.
    if (msg.content.startsWith(config.prefix)) {
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
        return message(msg, "yes ?");
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
        const command: Command = commands.list.get(commandName);
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
    const { _emoji, message } = msgReact;
    const dialog: Dialog = Dialog.find((d: Dialog) => d.author === author);

    if (!dialog || message !== dialog.response) {
        return;
    }
    try {
        await dialog.run(_emoji.name);
    } catch (err) {
        logError(err);
    }
}

/**
 * @private
 */
async function _onReady(): Promise<void> {
    const preGuilds: PreGuild[] = [];
    bot.user.setStatus("online"); // dnd , online , idle
    bot.guilds.cache.forEach((discordGuild) => {
        const guild: Guild = Guild.get(discordGuild.id);
        if (guild) {
            if (guild.default_channel) {
                bot.channels
                    .get(guild.default_channel)
                    .send(title(choice(list.intro)));
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
    // Embed options that might change
    let messageTitle: string = options.title || "";
    let description: string = options.description || "";
    let color: number = options.color || 0xffffff;
    let author: Discord.User = options.author;
    let timestamp: string = options.timestamp || "";
    let footer: string = options.footer || "";

    // Other options that might change
    let { react, actions } = options;
    const inline: boolean = options.inline || false;
    const content: string = options.content || "";

    if (messageTitle) {
        messageTitle = title(messageTitle);
    }
    if (description) {
        description = title(description);
    }
    if (footer) {
        footer = title(footer);
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(replacer(messageTitle, msg))
        .setDescription(replacer(description, msg))
        .setURL(options.url)
        .setColor(color)
        .setAuthor(author.username || "")
        .setTimestamp(timestamp)
        .setThumbnail(options.thumbnail)
        .setImage(options.image)
        .setFooter(footer);

    if (options.fields) {
        for (let i = 0; i < options.fields.length; i++) {
            embed.addField(
                title(options.fields[i].title),
                replacer(title(options.fields[i].description), msg),
                inline
            );
        }
    }
    const newMessage: Discord.Message = await message(msg, content, {
        embed,
        file: options.file,
    });

    if (react && !msg.deleted) {
        msg.react(react).catch();
    }
    const dialog: Dialog = new Dialog(msg, newMessage, actions);
    const reactions: string[] = Object.keys(dialog.actions);

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

/**
 * Returns the list of terms associated with a given section name.
 */
function getList(sectionName: string): string[] {
    return list[sectionName];
}

/**
 * Entry point of the module. This function is responsible of executing the following
 * actions in the given order:
 * 1. Establish a connection with the PostgreSQL database
 * 2. Load the models: QuickCommand, Guild and User (order is irrelevant) and the
 *    command scripts
 * 3. Log into Discord through the API
 */
async function init(): Promise<void> {
    log("Initializing Salty");
    await Database.connect();
    await Promise.all([
        QuickCommand.load().then((commandData) =>
            commandData.forEach(setQuickCommand)
        ),
        Guild.load(),
        User.load(),
        _loadCommands(...commandsRootPath).then(() => log("Commands loaded")),
    ]);
    await bot.login(process.env.DISCORD_API);
}

/**
 * Returns true if the given user has owner level privileges.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
function isOwner(user: Discord.User): boolean {
    return user.id === config.owner.id;
}

/**
 * Returns true if the given user has developer level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
function isDev(user: Discord.User): boolean {
    if (isOwner(user)) {
        return true;
    }
    return config.devs.includes(user.id);
}

/**
 * Returns true if the given user has admin level privileges or higher.
 * Hierarchy (highest to lowest): Owner > Developer > Admin > User.
 */
function isAdmin(user: Discord.User, guild: Discord.Guild): boolean {
    if (isDev(user) || isOwner(user)) {
        return true;
    }
    return guild.member(user).hasPermission("ADMINISTRATOR");
}

/**
 * Sends a simply structured message in the channel of the given 'msg' object.
 */
function message(msg: Discord.Message, text: string, options?): Promise<any> {
    return msg.channel.send(text && replacer(title(text), msg), options);
}

/**
 * Returns a string in which the <author> and <mention> tags have been replaced
 * with their related values contained in the 'msg' object.
 */
function replacer(string: string, msg: Discord.Message): string {
    const author: Discord.User = msg.member.nickname || msg.author.username;
    const mention: Discord.GuildMember = msg.mentions.members.first();
    const target: string = mention
        ? mention.nickname || mention.user.username
        : author;
    return string
        .replace(/<author>'s/g, possessive(author))
        .replace(/<author>/g, author)
        .replace(/<mention>'s/g, possessive(target))
        .replace(/<mention>/g, target);
}

/**
 * Registers a command object in the current commands list.
 */
function setQuickCommand(command: QuickCommand): void {
    command.keys.split(",").forEach((key) => {
        commands.keys[key] = command.name;
    });
    commands.list.set(command.name, {
        run: () => eval(command.effect),
    });
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
    config,
    startTime,
    // Functions
    destroy,
    embed,
    error,
    getList,
    init,
    isAdmin,
    isDev,
    isOwner,
    message,
    replacer,
    restart,
    setQuickCommand,
    success,
    unsetQuickCommand,
};
