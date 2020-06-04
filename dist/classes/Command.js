"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const Salty_1 = __importDefault(require("./Salty"));
const permissions = {
    admin: utils_1.isAdmin,
    dev: utils_1.isDev,
    owner: utils_1.isOwner,
    public: () => true,
};
class Command {
    constructor({ action, category, help, aliases, name, access, channel, }) {
        this.action = action;
        this.name = name;
        this.aliases = aliases || [];
        this.category = category;
        this.help = help || [];
        this.access = access || "public";
        this.channel = channel || "all";
    }
    async run(msg, args, target) {
        if (msg.guild && !permissions[this.access](msg.author, msg.guild)) {
            return Salty_1.default.warn(msg, this.access);
        }
        if (this.channel === "guild" && !msg.guild) {
            return Salty_1.default.warn(msg, "this is a direct message channel retard");
        }
        const commandParams = { msg, args, target };
        await this.action(commandParams);
    }
    static register(descriptor) {
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
Command.aliases = new discord_js_1.Collection();
Command.categories = new discord_js_1.Collection();
Command.doc = new discord_js_1.Collection();
Command.list = new discord_js_1.Collection();
exports.default = Command;
