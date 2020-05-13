"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
class SkipCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "skip";
        this.keys = ["next"];
        this.help = [
            {
                argument: null,
                effect: "Skips to the next song",
            },
        ];
    }
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            playlist.skip();
            Salty_1.default.success(msg, `skipped **${playlist.playing.title}**, but it was trash anyway`, { react: "⏩" });
        }
        else {
            Salty_1.default.error(msg, "I'm not connected to a voice channel");
        }
    }
}
exports.default = SkipCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9za2lwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQStEO0FBQy9ELGdFQUF3QztBQUN4QyxnRUFBd0M7QUFFeEMsTUFBTSxXQUFZLFNBQVEsaUJBQU87SUFBakM7O1FBQ1csU0FBSSxHQUFHLE1BQU0sQ0FBQztRQUNkLFNBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hCLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSx3QkFBd0I7YUFDbkM7U0FDSixDQUFDO0lBZ0JOLENBQUM7SUFkRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFpQjtRQUMvQixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTdDLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUNyQixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDaEIsZUFBSyxDQUFDLE9BQU8sQ0FDVCxHQUFHLEVBQ0gsYUFBYSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssNkJBQTZCLEVBQ2hFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUNqQixDQUFDO1NBQ0w7YUFBTTtZQUNILGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHNDQUFzQyxDQUFDLENBQUM7U0FDNUQ7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxXQUFXLENBQUMifQ==