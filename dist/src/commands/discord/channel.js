"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const list_1 = require("../../list");
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
    async action({ msg, args }) {
        const guild = Guild_1.default.get(msg.guild.id);
        if (args[0] && list_1.add.includes(args[0])) {
            await Guild_1.default.update(guild.id, { default_channel: msg.channel.id });
            await Salty_1.default.success(msg, `channel **${msg.channel.name}** has been successfuly set as default bot channel for **${msg.guild.name}**`);
        }
        else if (args[0] && list_1.remove.includes(args[0])) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9kaXNjb3JkL2NoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBa0U7QUFDbEUsZ0VBQXdDO0FBQ3hDLGdFQUF3QztBQUN4QyxxQ0FBeUM7QUFHekMsTUFBTSxjQUFlLFNBQVEsaUJBQU87SUFBcEM7O1FBQ1csU0FBSSxHQUFHLFNBQVMsQ0FBQztRQUNqQixTQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsbUNBQW1DO2FBQzlDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsTUFBTSxFQUFFLHNEQUFzRDthQUNqRTtZQUNEO2dCQUNJLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLEVBQUUsc0NBQXNDO2FBQ2pEO1NBQ0osQ0FBQztRQUNLLGVBQVUsR0FBcUIsT0FBTyxDQUFDO0lBMENsRCxDQUFDO0lBeENHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV0QyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xDLE1BQU0sZUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsZUFBZSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNsRSxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILGFBQ2tCLEdBQUcsQ0FBQyxPQUFRLENBQUMsSUFDL0IsNERBQ0ksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUNkLElBQUksQ0FDUCxDQUFDO1NBQ0w7YUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO2dCQUN4QixPQUFPLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLDRCQUE0QixDQUFDLENBQUM7YUFDM0Q7WUFDRCxNQUFNLGVBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gsa0RBQWtELENBQ3JELENBQUM7U0FDTDthQUFNO1lBQ0gsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7Z0JBQ3hCLE9BQU8sZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLENBQUMsQ0FBQzthQUMzRDtZQUNELE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxlQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM3RCxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxlQUFlLEVBQUU7Z0JBQzFDLE1BQU0sZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7b0JBQ25CLEtBQUssRUFBRSxxQ0FBcUM7b0JBQzVDLFdBQVcsRUFBRSxzQ0FBc0M7aUJBQ3RELENBQUMsQ0FBQzthQUNOO2lCQUFNO2dCQUNILE1BQU0sZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7b0JBQ25CLEtBQUssRUFBRSw0QkFBNEIsSUFBSSxJQUFJO29CQUMzQyxXQUFXLEVBQUUseUNBQXlDO2lCQUN6RCxDQUFDLENBQUM7YUFDTjtTQUNKO0lBQ0wsQ0FBQztDQUNKO0FBRUQsa0JBQWUsY0FBYyxDQUFDIn0=