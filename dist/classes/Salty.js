"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = require("../config");
const list = __importStar(require("../terms"));
const utils_1 = require("../utils");
const Database_1 = __importDefault(require("./Database"));
const Dialog_1 = __importDefault(require("./Dialog"));
const Guild_1 = __importDefault(require("./Guild"));
const QuickCommand_1 = __importDefault(require("./QuickCommand"));
const User_1 = __importDefault(require("./User"));
const Exception_1 = require("./Exception");
const Formatter_1 = __importDefault(require("./Formatter"));
const bot = new discord_js_1.default.Client();
const commandsRootPath = ["src", "commands"];
const commands = {
    list: new discord_js_1.default.Collection(),
    keys: {},
    help: {},
};
const startTime = new Date();
async function _destroy(restart) {
    utils_1.log("Disconnecting ...");
    bot.destroy();
    if (restart) {
        commands.list.clear();
        commands.keys = {};
        commands.help = {};
        await _loadCommands(...commandsRootPath).then(() => utils_1.log("Static commands loaded"));
        await bot.login(process.env.DISCORD_API);
    }
    else {
        await Database_1.default.disconnect();
        process.exit();
    }
}
async function _loadCommand(commandPath, category) {
    const commandImport = await Promise.resolve().then(() => __importStar(require(commandPath)));
    const CommandConstructor = commandImport.default;
    const command = new CommandConstructor();
    const { name, keys, visibility } = command;
    if (process.env.DEBUG === "true") {
        for (let key of [name, ...keys]) {
            if (commands.list.get(key)) {
                throw new Error(`Key "${key}" of command ${name} conflicts with command of the same name.`);
            }
            if (key in commands.keys) {
                throw new Error(`Duplicate key "${key}" in command "${name}".`);
            }
            if (key in commands.help || category === key) {
                throw new Error(`Key "${key}" of command "${name}" is already a category.`);
            }
        }
    }
    commands.list.set(name, command);
    commands.keys[name] = name;
    keys.forEach((key) => {
        commands.keys[key] = name;
    });
    commands.help[category].commands.push({ name, keys, visibility });
}
async function _loadCommands(...paths) {
    const dirpath = path_1.join(...paths);
    const files = await utils_1.promisify(fs_1.readdir.bind(null, dirpath));
    const category = dirpath.split(path_1.sep).pop();
    if (files.includes("__category__.json")) {
        const categoryInfoPath = path_1.join(dirpath, "__category__.json");
        const categoryInfo = JSON.parse(String(fs_1.readFileSync(categoryInfoPath)));
        commands.help[category] = {
            info: categoryInfo,
            commands: [],
        };
    }
    const promises = files.map((file) => {
        const fullpath = path_1.join(dirpath, file);
        const stats = fs_1.statSync(fullpath);
        const extension = file.split(".").pop();
        if (stats.isDirectory()) {
            _loadCommands(fullpath);
        }
        else if (["ts", "js", "cjs", "mjs"].includes(extension)) {
            try {
                const commandPath = path_1.join("..", "..", fullpath).replace(path_1.sep, "/");
                return _loadCommand(commandPath, category);
            }
            catch (err) {
                utils_1.error(`Could not load file "${file}:"`, err.stack);
            }
        }
    });
    await Promise.all(promises);
}
async function _onChannelDelete(channel) {
    Guild_1.default.each((guild) => {
        if (guild.default_channel === channel.id) {
            const guildDBId = Guild_1.default.get(channel.guild.id).id;
            Guild_1.default.update(guildDBId, { default_channel: false });
        }
    });
}
async function _onError(err) {
    utils_1.error(err);
    restart();
}
async function _onGuildCreate(guild) {
    Guild_1.default.create({ discord_id: guild.id });
}
async function _onGuildDelete(guild) {
    if (guild.member(bot.user)) {
        const guildDBId = Guild_1.default.get(guild.id).id;
        Guild_1.default.remove(guildDBId);
    }
}
async function _onGuildMemberAdd(member) {
    const guild = Guild_1.default.get(member.guild.id);
    if (guild.default_channel) {
        const channel = getTextChannel(guild.default_channel);
        channel.send(`Hey there ${member.user}! Have a great time here (͡° ͜ʖ ͡°)`);
    }
    if (guild.default_role) {
        try {
            member.roles.add(guild.default_role);
        }
        catch (err) {
            utils_1.error(`Couldn't add default role to ${member.user.username}: permission denied`);
        }
    }
}
async function _onGuildMemberRemove(member) {
    const guild = Guild_1.default.get(member.guild.id);
    if (guild.default_channel) {
        const channel = getTextChannel(guild.default_channel);
        channel.send(`Well, looks like ${member.user.username} got bored of us :c`);
    }
}
async function _onMessage(msg) {
    const author = msg.author;
    const user = User_1.default.get(author.id);
    if (author.bot) {
        return;
    }
    const mention = msg.mentions.users.first();
    const nickname = msg.guild.members.cache.get(bot.user.id).nickname;
    const botNameRegex = bot.user.username + (nickname ? `|${utils_1.clean(nickname)}` : "");
    let interaction = true;
    if (msg.guild) {
        interaction =
            new RegExp(botNameRegex, "i").test(msg.content) ||
                (mention && mention.id === bot.user.id);
    }
    if (msg.content.startsWith(config_1.prefix)) {
        msg.content = msg.content.slice(1);
        interaction = true;
    }
    const msgArgs = msg.content
        .split(" ")
        .filter((word) => word.trim() !== "");
    if (!interaction) {
        return;
    }
    if (user && user.black_listed) {
        return error(msg, "you seem to be blacklisted. To find out why, ask my glorious creator");
    }
    utils_1.request(msg.guild.name, author.username, msg.content);
    if (!msgArgs.length) {
        return message(msg, "yes?");
    }
    if (!user) {
        await User_1.default.create({ discord_id: author.id });
    }
    if (mention && !mention.bot && !User_1.default.get(mention.id)) {
        await User_1.default.create({ discord_id: mention.id });
    }
    const commandName = msgArgs.shift();
    const actualName = commands.keys[utils_1.clean(commandName)];
    const command = commands.list.get(actualName);
    if (command) {
        if (msgArgs[0] && list.help.includes(msgArgs[0])) {
            return commands.list.get("help").run(msg, [actualName]);
        }
        else {
            return command.run(msg, msgArgs);
        }
    }
    const closests = utils_1.search(Object.keys(commands.keys), commandName, 2);
    if (closests.length) {
        const cmds = {};
        for (const key of closests) {
            const cmdName = commands.keys[key];
            if (!(cmdName in cmds)) {
                cmds[cmdName] = key;
            }
        }
        return message(msg, `command "*${commandName}*" doesn't exist. Did you mean "*${Object.values(cmds).join(`*" or "*`)}*"?`);
    }
    else {
        return commands.list.get("talk").run(msg, msgArgs);
    }
}
async function _onMessageReactionAdd(msgReact, author) {
    if (author.bot) {
        return;
    }
    const { emoji, message } = msgReact;
    const dialog = Dialog_1.default.find((d) => d.author === author);
    if (!dialog || message !== dialog.response) {
        return;
    }
    try {
        await dialog.run(emoji.name);
    }
    catch (err) {
        utils_1.error(err);
    }
}
async function _onReady() {
    const preGuilds = [];
    bot.user.setStatus("online");
    bot.guilds.cache.forEach((discordGuild) => {
        const guild = Guild_1.default.get(discordGuild.id);
        if (guild) {
            if (guild.default_channel) {
                const channel = getTextChannel(guild.default_channel);
                channel.send(utils_1.title(utils_1.choice(list.intro)));
            }
        }
        else {
            preGuilds.push({ discord_id: discordGuild.id });
        }
    });
    if (preGuilds.length) {
        Guild_1.default.create(...preGuilds);
    }
    const loadingTime = Math.floor((Date.now() - startTime.getTime()) / 100) / 10;
    utils_1.log(`${commands.list.array().length} commands and ${QuickCommand_1.default.size} generic commands loaded. ${Object.keys(commands.keys).length} keys in total.`);
    utils_1.log(`Salty loaded in ${loadingTime} second${loadingTime === 1 ? "" : "s"} and ready to salt the chat :D`);
}
function restart() {
    return _destroy(true);
}
function destroy() {
    return _destroy(false);
}
async function embed(msg, options = {}) {
    let { react, actions } = options;
    const inline = options.inline || false;
    const content = options.content || "";
    if (!options.color) {
        options.color = 0xffffff;
    }
    if (options.title) {
        options.title = Formatter_1.default.format(utils_1.title(options.title), msg);
    }
    if (options.description) {
        options.description = Formatter_1.default.format(utils_1.title(options.description), msg);
    }
    if (options.footer && options.footer.text) {
        options.footer.text = Formatter_1.default.format(utils_1.title(options.footer.text), msg);
    }
    if (options.fields) {
        options.fields = options.fields.map((field) => {
            return {
                name: utils_1.title(field.name),
                value: Formatter_1.default.format(utils_1.title(field.value), msg),
                inline,
            };
        });
    }
    const embed = new discord_js_1.default.MessageEmbed(options);
    const newMessage = await message(msg, utils_1.ellipsis(utils_1.title(Formatter_1.default.format(content, msg))), {
        embed,
        files: options.files,
    });
    if (react && !msg.deleted) {
        msg.react(react).catch();
    }
    const dialog = new Dialog_1.default(msg, newMessage, actions);
    const reactions = Object.keys(dialog.actions);
    for (let i = 0; i < reactions.length; i++) {
        if (newMessage.deleted) {
            break;
        }
        await newMessage.react(reactions[i]);
    }
}
function error(msg, text = "error", options = {}) {
    return embed(msg, Object.assign({
        title: text,
        react: "❌",
        color: 0xaa0000,
    }, options));
}
function getTextChannel(channelId) {
    const channel = bot.channels.cache.get(channelId);
    if (!(channel instanceof discord_js_1.default.TextChannel)) {
        throw new Exception_1.SaltyException(`Default channel is not a text channel.`);
    }
    return channel;
}
function isOwner(user) {
    return user.id === config_1.owner.id;
}
function isDev(user) {
    return isOwner(user) || config_1.devs.includes(user.id);
}
function isAdmin(user, guild) {
    return (isOwner(user) ||
        isDev(user) ||
        guild.member(user).hasPermission("ADMINISTRATOR"));
}
function message(msg, text, options) {
    return msg.channel.send(utils_1.ellipsis(utils_1.title(Formatter_1.default.format(text, msg))), options);
}
function setQuickCommand(command) {
    command.keys.split(",").forEach((key) => {
        commands.keys[key] = command.name;
    });
    commands.list.set(command.name, command);
}
async function start() {
    utils_1.log("Initializing Salty");
    await Database_1.default.connect();
    await Promise.all([
        QuickCommand_1.default.load().then((commandData) => commandData.forEach(setQuickCommand)),
        Guild_1.default.load(),
        User_1.default.load(),
        _loadCommands(...commandsRootPath).then(() => utils_1.log("Static commands loaded")),
    ]);
    await bot.login(process.env.DISCORD_API);
}
function success(msg, text = "success", options = {}) {
    return embed(msg, Object.assign({
        title: text,
        react: "✅",
        color: 0x32a032,
    }, options));
}
function unsetQuickCommand(command) {
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
exports.default = {
    bot,
    commands,
    startTime,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2FsdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9TYWx0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw0REFBaUM7QUFDakMsMkJBQXFEO0FBQ3JELCtCQUFpQztBQUNqQyxzQ0FBZ0Q7QUFDaEQsK0NBQWlDO0FBQ2pDLG9DQVdrQjtBQUVsQiwwREFBa0M7QUFDbEMsc0RBQThCO0FBQzlCLG9EQUE0QjtBQUM1QixrRUFBMEM7QUFDMUMsa0RBQTBCO0FBQzFCLDJDQUE2QztBQUM3Qyw0REFBb0M7QUFnQ3BDLE1BQU0sR0FBRyxHQUFtQixJQUFJLG9CQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDakQsTUFBTSxnQkFBZ0IsR0FBYSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RCxNQUFNLFFBQVEsR0FBbUI7SUFDN0IsSUFBSSxFQUFFLElBQUksb0JBQU8sQ0FBQyxVQUFVLEVBQUU7SUFDOUIsSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUUsRUFBRTtDQUNYLENBQUM7QUFDRixNQUFNLFNBQVMsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0FBU25DLEtBQUssVUFBVSxRQUFRLENBQUMsT0FBZ0I7SUFDcEMsV0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDekIsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2QsSUFBSSxPQUFPLEVBQUU7UUFDVCxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ25CLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ25CLE1BQU0sYUFBYSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQy9DLFdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUNoQyxDQUFDO1FBQ0YsTUFBTSxHQUFHLENB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