"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const Exception_1 = require("../../classes/Exception");
let purging = false;
async function purgeEndless(channel) {
    const messages = await channel.messages.fetch({ limit: 1 });
    if (!purging) {
        return;
    }
    await messages.first().delete();
    return purgeEndless(channel);
}
class PurgeCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "purge";
        this.keys = ["prune"];
        this.help = [
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
        ];
        this.visibility = "dev";
    }
    async action({ args, msg }) {
        switch (this.meaning(args[0])) {
            case "bot":
                const messages = await msg.channel.messages.fetch();
                let messagesToDelete = messages.filter((message) => message.author.bot);
                try {
                    await msg.channel.bulkDelete(messagesToDelete);
                    await Salty_1.default.success(msg, "most recent bot messages have been deleted");
                }
                catch (err) {
                    utils_1.error(err);
                }
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
                    throw new Exception_1.IncorrectValue("length", "number");
                }
                if (parseInt(args[0]) === 0) {
                    throw new Exception_1.SaltyException("you must delete at least 1 message");
                }
                const toDelete = Math.min(parseInt(args[0]), 100) || 100;
                try {
                    await msg.channel.bulkDelete(toDelete, true);
                    await Salty_1.default.success(msg, `${toDelete} messages have been successfully deleted`);
                }
                catch (err) {
                    utils_1.error(err);
                }
        }
    }
}
exports.default = PurgeCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVyZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL3B1cmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esb0VBRytCO0FBQy9CLGdFQUF3QztBQUN4Qyx1Q0FBb0M7QUFDcEMsdURBQXlFO0FBRXpFLElBQUksT0FBTyxHQUFZLEtBQUssQ0FBQztBQUU3QixLQUFLLFVBQVUsWUFBWSxDQUFDLE9BQW9CO0lBQzVDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1RCxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1YsT0FBTztLQUNWO0lBQ0QsTUFBTSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEMsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVELE1BQU0sWUFBYSxTQUFRLGlCQUFPO0lBQWxDOztRQUNXLFNBQUksR0FBRyxPQUFPLENBQUM7UUFDZixTQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsK0JBQStCO2FBQzFDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLE1BQU0sRUFBRSx3Q0FBd0M7YUFDbkQ7WUFDRDtnQkFDSSxRQUFRLEVBQUUsS0FBSztnQkFDZixNQUFNLEVBQUUsNkNBQTZDO2FBQ3hEO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLE1BQU0sRUFDRixxRkFBcUY7YUFDNUY7WUFDRDtnQkFDSSxRQUFRLEVBQUUsT0FBTztnQkFDakIsTUFBTSxFQUFFLGdDQUFnQzthQUMzQztTQUNKLENBQUM7UUFDSyxlQUFVLEdBQXFCLEtBQUssQ0FBQztJQXdEaEQsQ0FBQztJQXRERyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBaUI7UUFDckMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzNCLEtBQUssS0FBSztnQkFDTixNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNwRCxJQUFJLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQ2xDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FDbEMsQ0FBQztnQkFDRixJQUFJO29CQUNBLE1BQW9CLEdBQUcsQ0FBQyxPQUFRLENBQUMsVUFBVSxDQUN2QyxnQkFBZ0IsQ0FDbkIsQ0FBQztvQkFDRixNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILDRDQUE0QyxDQUMvQyxDQUFDO2lCQUNMO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNWLGFBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDZDtnQkFDRCxNQUFNO1lBQ1YsS0FBSyxPQUFPO2dCQUNSLElBQUksT0FBTyxFQUFFO29CQUNULE9BQU8sR0FBRyxLQUFLLENBQUM7b0JBQ2hCLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2lCQUN2QztxQkFBTTtvQkFDSCxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO2lCQUNqRDtnQkFDRCxNQUFNO1lBQ1YsS0FBSyxRQUFRO2dCQUNULElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFDdkIsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDZixPQUFPLFlBQVksQ0FBYyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ2pEO1lBRUw7Z0JBQ0ksSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3hCLE1BQU0sSUFBSSwwQkFBYyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDaEQ7Z0JBQ0QsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUN6QixNQUFNLElBQUksMEJBQWMsQ0FDcEIsb0NBQW9DLENBQ3ZDLENBQUM7aUJBQ0w7Z0JBQ0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDO2dCQUN6RCxJQUFJO29CQUNBLE1BQW9CLEdBQUcsQ0FBQyxPQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDNUQsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUNmLEdBQUcsRUFDSCxHQUFHLFFBQVEsMENBQTBDLENBQ3hELENBQUM7aUJBQ0w7Z0JBQUMsT0FBTyxHQUFHLEVBQUU7b0JBQ1YsYUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNkO1NBQ1I7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxZQUFZLENBQUMifQ==