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
    constructor({ action, help, keys, name, access, channel, }) {
        this.action = action;
        this.name = name;
        this.help = help || [];
        this.keys = keys || [];
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
        const { access, channel, help, keys, name } = command;
        this.list.set(name, command);
        for (const key of [name, ...keys]) {
            if (this.aliases.has(key)) {
                throw new Error(`Duplicate key "${key}" in command "${name}".`);
            }
            this.aliases.set(key, name);
        }
    }
}
Command.aliases = new discord_js_1.Collection();
Command.categories = new discord_js_1.Collection();
Command.doc = new discord_js_1.Collection();
Command.list = new discord_js_1.Collection();
exports.default = Command;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwyQ0FBOEQ7QUFZOUQsb0NBQW1EO0FBRW5ELG9EQUE0QjtBQUU1QixNQUFNLFdBQVcsR0FFYjtJQUNBLEtBQUssRUFBRSxlQUFPO0lBQ2QsR0FBRyxFQUFFLGFBQUs7SUFDVixLQUFLLEVBQUUsZUFBTztJQUNkLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJO0NBQ3JCLENBQUM7QUFFRixNQUFNLE9BQU87SUFnQlQsWUFBWSxFQUNSLE1BQU0sRUFDTixJQUFJLEVBQ0osSUFBSSxFQUNKLElBQUksRUFDSixNQUFNLEVBQ04sT0FBTyxHQUNTO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksUUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLEtBQUssQ0FBQztJQUNwQyxDQUFDO0lBS00sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFZLEVBQUUsSUFBYyxFQUFFLE1BQXFCO1FBQ2hFLElBQUksR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDL0QsT0FBTyxlQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkM7UUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtZQUN4QyxPQUFPLGVBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7U0FDckU7UUFDRCxNQUFNLGFBQWEsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDNUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFTSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQTZCO1FBQ2hELE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3QixLQUFLLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUU7WUFDL0IsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsQ0FBQzthQUNuRTtZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMvQjtJQVNMLENBQUM7O0FBckRhLGVBQU8sR0FBRyxJQUFJLHVCQUFVLEVBQWtCLENBQUM7QUFDM0Msa0JBQVUsR0FBRyxJQUFJLHVCQUFVLEVBQStCLENBQUM7QUFDM0QsV0FBRyxHQUFHLElBQUksdUJBQVUsRUFBaUMsQ0FBQztBQUN0RCxZQUFJLEdBQUcsSUFBSSx1QkFBVSxFQUFrQyxDQUFDO0FBcUQxRSxrQkFBZSxPQUFPLENBQUMifQ==