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
    }
    static get(id) {
        return this.find((guild) => guild.discord_id === id);
    }
}
Guild.fields = {
    discord_id: "",
    default_channel: "",
    default_role: "",
};
Guild.table = "guilds";
exports.default = Guild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xhc3Nlcy9HdWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUFrRDtBQUNsRCwwREFBa0M7QUFFbEMsTUFBTSxLQUFNLFNBQVEsZUFBSztJQUF6Qjs7UUFDVyxhQUFRLEdBQWEsSUFBSSxrQkFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBZWpELENBQUM7SUFIVSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQVU7UUFDeEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBWSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7O0FBVHlCLFlBQU0sR0FBcUI7SUFDakQsVUFBVSxFQUFFLEVBQUU7SUFDZCxlQUFlLEVBQUUsRUFBRTtJQUNuQixZQUFZLEVBQUUsRUFBRTtDQUNuQixDQUFDO0FBQ3dCLFdBQUssR0FBVyxRQUFRLENBQUM7QUFPdkQsa0JBQWUsS0FBSyxDQUFDIn0=