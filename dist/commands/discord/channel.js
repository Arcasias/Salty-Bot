"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
Command_1.default.register({
    name: "channel",
    keys: ["chan"],
    help: [
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
    ],
    access: "admin",
    channel: "guild",
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
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9kaXNjb3JkL2NoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLGdFQUF3QztBQUN4Qyx1Q0FBMEM7QUFFMUMsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsU0FBUztJQUNmLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNkLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsbUNBQW1DO1NBQzlDO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsS0FBSztZQUNmLE1BQU0sRUFBRSxzREFBc0Q7U0FDakU7UUFDRDtZQUNJLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLE1BQU0sRUFBRSxzQ0FBc0M7U0FDakQ7S0FDSjtJQUNELE1BQU0sRUFBRSxPQUFPO0lBQ2YsT0FBTyxFQUFFLE9BQU87SUFFaEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7UUFDdEIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDLEVBQUUsQ0FBRSxDQUFDO1FBQ3hDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbEMsTUFBTSxlQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gsYUFDa0IsR0FBRyxDQUFDLE9BQVEsQ0FBQyxJQUMvQiw0REFDSSxHQUFHLENBQUMsS0FBTSxDQUFDLElBQ2YsSUFBSSxDQUNQLENBQUM7U0FDTDthQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7Z0JBQ3hCLE9BQU8sZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLENBQUMsQ0FBQzthQUMzRDtZQUNELE1BQU0sZUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDeEQsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUNmLEdBQUcsRUFDSCxrREFBa0QsQ0FDckQsQ0FBQztTQUNMO2FBQU07WUFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtnQkFDeEIsT0FBTyxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO2FBQzNEO1lBQ0QsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLGVBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzdELElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLGVBQWUsRUFBRTtnQkFDMUMsTUFBTSxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtvQkFDbkIsS0FBSyxFQUFFLHFDQUFxQztvQkFDNUMsV0FBVyxFQUFFLHNDQUFzQztpQkFDdEQsQ0FBQyxDQUFDO2FBQ047aUJBQU07Z0JBQ0gsTUFBTSxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtvQkFDbkIsS0FBSyxFQUFFLDRCQUE0QixJQUFJLElBQUk7b0JBQzNDLFdBQVcsRUFBRSx5Q0FBeUM7aUJBQ3pELENBQUMsQ0FBQzthQUNOO1NBQ0o7SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFDIn0=