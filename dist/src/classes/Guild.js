"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("./Model"));
const Playlist_1 = __importDefault(require("./Playlist"));
class Guild extends Model_1.default {
    constructor() {
        super(...arguments);
        this.playlist = new Playlist_1.default({});
        this.discord_id = "";
        this.default_channel = "";
        this.default_role = "";
    }
    static get(id) {
        return this.find((guild) => guild.discord_id === id);
    }
}
Guild.fields = [
    "discord_id",
    "default_channel",
    "default_role",
];
Guild.table = "guilds";
exports.default = Guild;
