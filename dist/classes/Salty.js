"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
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
    list: new discord_js_1.Collection(),
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
    const files = await new Promise((res, rej) => {
        fs_1.readdir(dirpath, (err, files) => {
            if (err) {
                rej(err);
            }
            res(files);
        });
    });
    const category = dirpath.split(path_1.sep).pop() || "";
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
        const extension = file.split(".").pop() || "";
        if (stats.isDirectory()) {
            return _loadCommands(fullpath);
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
        return Promise.resolve();
    });
    await Promise.all(promises);
}
async function _onChannelDelete(channel) {
    if (!(channel instanceof discord_js_1.GuildChannel)) {
        return;
    }
    Guild_1.default.each((guild) => {
        if (guild.default_channel === channel.id) {
            const relatedGuild = Guild_1.default.get(channel.guild.id);
            if (relatedGuild) {
                Guild_1.default.update(relatedGuild.id, { default_channel: false });
            }
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
        const relatedGuild = Guild_1.default.get(guild.id);
        if (relatedGuild) {
            Guild_1.default.remove(relatedGuild.id);
        }
    }
}
async function _onGuildMemberAdd(member) {
    var _a;
    const guild = Guild_1.default.get(member.guild.id);
    if (guild === null || guild === void 0 ? void 0 : guild.default_channel) {
        const channel = getTextChannel(guild.default_channel);
        channel.send(`Hey there ${member.user}! Have a great time here (͡° ͜ʖ ͡°)`);
    }
    if (guild === null || guild === void 0 ? void 0 : guild.default_role) {
        try {
            member.roles.add(guild.default_role);
        }
        catch (err) {
            const name = ((_a = member.user) === null || _a === void 0 ? void 0 : _a.username) || "unknown";
            utils_1.error(`Couldn't add default role to "${name}": permission denied`);
        }
    }
}
async function _onGuildMemberRemove(member) {
    var _a;
    const guild = Guild_1.default.get(member.guild.id);
    if (guild === null || guild === void 0 ? void 0 : guild.default_channel) {
        const channel = getTextChannel(guild.default_channel);
        const name = ((_a = member.user) === null || _a === void 0 ? void 0 : _a.username) || "unknown";
        channel.send(`Well, looks like ${name} got bored of us :c`);
    }
}
async function _onMessage(msg) {
    var _a, _b, _c;
    const author = msg.author;
    const user = User_1.default.get(author.id);
    if (author.bot) {
        return;
    }
    const mention = msg.mentions.users.first();
    const nickname = (_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(bot.user.id)) === null || _b === void 0 ? void 0 : _b.nickname;
    const botNameRegex = bot.user.username + (nickname ? `|${utils_1.clean(nickname)}` : "");
    let interaction = true;
    if (msg.guild) {
        interaction =
            new RegExp(botNameRegex, "i").test(msg.content) ||
                (mention === null || mention === void 0 ? void 0 : mention.id) === bot.user.id;
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
    if (user === null || user === void 0 ? void 0 : user.black_listed) {
        return error(msg, "you seem to be blacklisted. To find out why, ask my glorious creator");
    }
    utils_1.request(((_c = msg.guild) === null || _c === void 0 ? void 0 : _c.name) || "DM", author.username, msg.content);
    if (!msgArgs.length) {
        return message(msg, "yes?");
    }
    if (!user) {
        await User_1.default.create({ discord_id: author.id });
    }
    if (mention && !mention.bot && !User_1.default.get(mention.id)) {
        await User_1.default.create({ discord_id: mention.id });
    }
    const commandName = msgArgs.shift() || "";
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
        dialog.run(emoji.name);
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
    var _a;
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
    if ((_a = options.footer) === null || _a === void 0 ? void 0 : _a.text) {
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
    const embed = new discord_js_1.MessageEmbed(options);
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
    if (!(channel instanceof discord_js_1.TextChannel)) {
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
        QuickCommand_1.default.load().then((commandData) => commandData.forEach((c) => setQuickCommand(c))),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2FsdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9TYWx0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5REFjb0I7QUFDcEIsMkJBQXFEO0FBQ3JELCtCQUFpQztBQUNqQyxzQ0FBZ0Q7QUFDaEQsK0NBQWlDO0FBQ2pDLG9DQVNrQjtBQUVsQiwwREFBa0M7QUFDbEMsc0RBQThCO0FBQzlCLG9EQUE0QjtBQUM1QixrRUFBMEM7QUFDMUMsa0RBQTBCO0FBQzFCLDJDQUE2QztBQUM3Qyw0REFBb0M7QUFnQ3BDLE1BQU0sR0FBRyxHQUFtQixJQUFJLG9CQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDakQsTUFBTSxnQkFBZ0IsR0FBYSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RCxNQUFNLFFBQVEsR0FBbUI7SUFDN0IsSUFBSSxFQUFFLElBQUksdUJBQVUsRUFBRTtJQUN0QixJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxFQUFFO0NBQ1gsQ0FBQztBQUNGLE1BQU0sU0FBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7QUFTbkMsS0FBSyxVQUFVLFFBQVEsQ0FBQyxPQUFnQjtJQUNwQyxXQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUN6QixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDZCxJQUFJLE9BQU8sRUFBRTtRQUNULFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdEIsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDbkIsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDbkIsTUFBTSxhQUFhLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FDL0MsV0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQ2hDLENBQUM7UUFDRixNQUFNLEdBQUcsQ0FBQyxLQUFLLENB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