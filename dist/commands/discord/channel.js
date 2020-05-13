"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
class ChannelCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "channel";
        this.keys = ["chan"];
        this.help = [
            {
                argument: null,
                effect: "Shows the current default channel",
            },
            {
                argument: "set",
                effect: "Sets this channel as the default one for this server",
            },
            {
                argument: "unset",
                effect: "Unsets this server's default channel",
            },
        ];
        this.visibility = "admin";
    }
    async action({ args, msg }) {
        const guild = Guild_1.default.get(msg.guild.id);
        if (args[0] && terms_1.add.includes(args[0])) {
            await Guild_1.default.update(guild.id, { default_channel: msg.channel.id });
            await Salty_1.default.success(msg, `channel **${msg.channel.name}** has been successfuly set as default bot channel for **${msg.guild.name}**`);
        }
        else if (args[0] && terms_1.remove.includes(args[0])) {
            if (!guild.default_channel) {
                return Salty_1.default.message(msg, "no default bot channel set");
            }
            await Guild_1.default.update(guild.id, { default_channel: null });
            await Salty_1.default.success(msg, "default bot channel has been successfuly removed");
        }
        else {
            if (!guild.default_channel) {
                return Salty_1.default.message(msg, "no default bot channel set");
            }
            const { name } = Salty_1.default.getTextChannel(guild.default_channel);
            if (msg.channel.id === guild.default_channel) {
                await Salty_1.default.embed(msg, {
                    title: "this is the current default channel",
                    description: "I'll speak right here when I need to",
                });
            }
            else {
                await Salty_1.default.embed(msg, {
                    title: `default bot channel is **${name}**`,
                    description: "this is where I'll speak when I need to",
                });
            }
        }
    }
}
exports.default = ChannelCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9kaXNjb3JkL2NoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFHK0I7QUFDL0IsZ0VBQXdDO0FBQ3hDLGdFQUF3QztBQUN4Qyx1Q0FBMEM7QUFHMUMsTUFBTSxjQUFlLFNBQVEsaUJBQU87SUFBcEM7O1FBQ1csU0FBSSxHQUFHLFNBQVMsQ0FBQztRQUNqQixTQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsbUNBQW1DO2FBQzlDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsTUFBTSxFQUFFLHNEQUFzRDthQUNqRTtZQUNEO2dCQUNJLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLEVBQUUsc0NBQXNDO2FBQ2pEO1NBQ0osQ0FBQztRQUNLLGVBQVUsR0FBcUIsT0FBTyxDQUFDO0lBMENsRCxDQUFDO0lBeENHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFdEMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksV0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsQyxNQUFNLGVBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLGVBQWUsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbEUsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUNmLEdBQUcsRUFDSCxhQUNrQixHQUFHLENBQUMsT0FBUSxDQUFDLElBQy9CLDREQUNJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFDZCxJQUFJLENBQ1AsQ0FBQztTQUNMO2FBQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksY0FBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtnQkFDeEIsT0FBTyxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO2FBQzNEO1lBQ0QsTUFBTSxlQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN4RCxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILGtEQUFrRCxDQUNyRCxDQUFDO1NBQ0w7YUFBTTtZQUNILElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO2dCQUN4QixPQUFPLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLDRCQUE0QixDQUFDLENBQUM7YUFDM0Q7WUFDRCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsZUFBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0QsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsZUFBZSxFQUFFO2dCQUMxQyxNQUFNLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO29CQUNuQixLQUFLLEVBQUUscUNBQXFDO29CQUM1QyxXQUFXLEVBQUUsc0NBQXNDO2lCQUN0RCxDQUFDLENBQUM7YUFDTjtpQkFBTTtnQkFDSCxNQUFNLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO29CQUNuQixLQUFLLEVBQUUsNEJBQTRCLElBQUksSUFBSTtvQkFDM0MsV0FBVyxFQUFFLHlDQUF5QztpQkFDekQsQ0FBQyxDQUFDO2FBQ047U0FDSjtJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLGNBQWMsQ0FBQyJ9