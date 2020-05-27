"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
let purging = false;
async function purgeEndless(channel) {
    const messages = await channel.messages.fetch({ limit: 1 });
    if (!purging) {
        return;
    }
    if (messages.size) {
        await messages.first().delete();
        return purgeEndless(channel);
    }
}
Command_1.default.register({
    name: "purge",
    keys: ["prune"],
    help: [
        {
            argument: null,
            effect: "Deletes the last 100 messages",
        },
        {
            argument: "***amount***",
            effect: "Deletes the last ***amount*** messages",
        },
        {
            argument: "bot",
            effect: "Deletes the last 100 messages sent by a bot",
        },
        {
            argument: "endless",
            effect: "Recursively deletes every message one by one in the current channel. Use carefully.",
        },
        {
            argument: "clear",
            effect: "Used to stop the endless purge",
        },
    ],
    access: "dev",
    async action({ args, msg }) {
        switch (utils_1.meaning(args[0])) {
            case "bot":
                const messages = await msg.channel.messages.fetch();
                const messagesToDelete = messages.filter((message) => message.author.bot);
                if (msg.channel instanceof discord_js_1.DMChannel) {
                    await Promise.all(messagesToDelete.map((m) => msg.channel.delete(m.id)));
                }
                else {
                    await msg.channel.bulkDelete(messagesToDelete);
                }
                Salty_1.default.success(msg, "most recent bot messages have been deleted");
                break;
            case "clear":
                if (purging) {
                    purging = false;
                    Salty_1.default.success(msg, "purge stopped");
                }
                else {
                    Salty_1.default.error(msg, "i wasn't purging anything");
                }
                break;
            case "string":
                if (args[0] === "endless") {
                    purging = true;
                    return purgeEndless(msg.channel);
                }
            default:
                if (isNaN(Number(args[0]))) {
                    return Salty_1.default.warn(msg, "Given length must be a valid number.");
                }
                if (parseInt(args[0]) === 0) {
                    return Salty_1.default.warn(msg, "You must delete at least 1 message.");
                }
                const toDelete = Math.min(parseInt(args[0]), 100) || 100;
                try {
                    if (msg.channel instanceof discord_js_1.DMChannel) {
                        const messages = await msg.channel.messages.fetch();
                        await Promise.all(messages.map((m) => msg.channel.delete(m.id)));
                    }
                    else {
                        await msg.channel.bulkDelete(toDelete, true);
                    }
                    await Salty_1.default.success(msg, `${toDelete} messages have been successfully deleted`);
                }
                catch (err) {
                    utils_1.error(err);
                }
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVyZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL3B1cmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkNBQWlFO0FBQ2pFLG9FQUE0QztBQUM1QyxnRUFBd0M7QUFDeEMsdUNBQTZDO0FBRTdDLElBQUksT0FBTyxHQUFZLEtBQUssQ0FBQztBQUU3QixLQUFLLFVBQVUsWUFBWSxDQUN2QixPQUE4QztJQUU5QyxNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUQsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNWLE9BQU87S0FDVjtJQUNELElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtRQUNmLE1BQU0sUUFBUSxDQUFDLEtBQUssRUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2hDO0FBQ0wsQ0FBQztBQUVELGlCQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDZixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLCtCQUErQjtTQUMxQztRQUNEO1lBQ0ksUUFBUSxFQUFFLGNBQWM7WUFDeEIsTUFBTSxFQUFFLHdDQUF3QztTQUNuRDtRQUNEO1lBQ0ksUUFBUSxFQUFFLEtBQUs7WUFDZixNQUFNLEVBQUUsNkNBQTZDO1NBQ3hEO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsU0FBUztZQUNuQixNQUFNLEVBQ0YscUZBQXFGO1NBQzVGO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsT0FBTztZQUNqQixNQUFNLEVBQUUsZ0NBQWdDO1NBQzNDO0tBQ0o7SUFDRCxNQUFNLEVBQUUsS0FBSztJQUViLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLFFBQVEsZUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3RCLEtBQUssS0FBSztnQkFDTixNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNwRCxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQ3BDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FDbEMsQ0FBQztnQkFDRixJQUFJLEdBQUcsQ0FBQyxPQUFPLFlBQVksc0JBQVMsRUFBRTtvQkFDbEMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNiLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3hELENBQUM7aUJBQ0w7cUJBQU07b0JBQ0gsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUNsRDtnQkFDRCxlQUFLLENBQUMsT0FBTyxDQUNULEdBQUcsRUFDSCw0Q0FBNEMsQ0FDL0MsQ0FBQztnQkFDRixNQUFNO1lBQ1YsS0FBSyxPQUFPO2dCQUNSLElBQUksT0FBTyxFQUFFO29CQUNULE9BQU8sR0FBRyxLQUFLLENBQUM7b0JBQ2hCLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2lCQUN2QztxQkFBTTtvQkFDSCxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO2lCQUNqRDtnQkFDRCxNQUFNO1lBQ1YsS0FBSyxRQUFRO2dCQUNULElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFDdkIsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDZixPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3BDO1lBRUw7Z0JBQ0ksSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3hCLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FDYixHQUFHLEVBQ0gsc0NBQXNDLENBQ3pDLENBQUM7aUJBQ0w7Z0JBQ0QsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUN6QixPQUFPLGVBQUssQ0FBQyxJQUFJLENBQ2IsR0FBRyxFQUNILHFDQUFxQyxDQUN4QyxDQUFDO2lCQUNMO2dCQUNELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQztnQkFDekQsSUFBSTtvQkFDQSxJQUFJLEdBQUcsQ0FBQyxPQUFPLFlBQVksc0JBQVMsRUFBRTt3QkFDbEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDcEQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNiLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNoRCxDQUFDO3FCQUNMO3lCQUFNO3dCQUNILE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUNoRDtvQkFDRCxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILEdBQUcsUUFBUSwwQ0FBMEMsQ0FDeEQsQ0FBQztpQkFDTDtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDVixhQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2Q7U0FDUjtJQUNMLENBQUM7Q0FDSixDQUFDLENBQUMifQ==