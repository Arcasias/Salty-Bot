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
    if (messages.size) {
        await messages.first().delete();
        return purgeEndless(channel);
    }
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
        this.access = "dev";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVyZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL3B1cmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esb0VBQThFO0FBQzlFLGdFQUF3QztBQUN4Qyx1Q0FBb0M7QUFDcEMsdURBQXlFO0FBRXpFLElBQUksT0FBTyxHQUFZLEtBQUssQ0FBQztBQUU3QixLQUFLLFVBQVUsWUFBWSxDQUFDLE9BQW9CO0lBQzVDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1RCxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1YsT0FBTztLQUNWO0lBQ0QsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQ2YsTUFBTSxRQUFRLENBQUMsS0FBSyxFQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDaEM7QUFDTCxDQUFDO0FBRUQsTUFBTSxZQUFhLFNBQVEsaUJBQU87SUFBbEM7O1FBQ1csU0FBSSxHQUFHLE9BQU8sQ0FBQztRQUNmLFNBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSwrQkFBK0I7YUFDMUM7WUFDRDtnQkFDSSxRQUFRLEVBQUUsY0FBYztnQkFDeEIsTUFBTSxFQUFFLHdDQUF3QzthQUNuRDtZQUNEO2dCQUNJLFFBQVEsRUFBRSxLQUFLO2dCQUNmLE1BQU0sRUFBRSw2Q0FBNkM7YUFDeEQ7WUFDRDtnQkFDSSxRQUFRLEVBQUUsU0FBUztnQkFDbkIsTUFBTSxFQUNGLHFGQUFxRjthQUM1RjtZQUNEO2dCQUNJLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLEVBQUUsZ0NBQWdDO2FBQzNDO1NBQ0osQ0FBQztRQUNLLFdBQU0sR0FBa0IsS0FBSyxDQUFDO0lBd0R6QyxDQUFDO0lBdERHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDM0IsS0FBSyxLQUFLO2dCQUNOLE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3BELElBQUksZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FDbEMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUNsQyxDQUFDO2dCQUNGLElBQUk7b0JBQ0EsTUFBb0IsR0FBRyxDQUFDLE9BQVEsQ0FBQyxVQUFVLENBQ3ZDLGdCQUFnQixDQUNuQixDQUFDO29CQUNGLE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gsNENBQTRDLENBQy9DLENBQUM7aUJBQ0w7Z0JBQUMsT0FBTyxHQUFHLEVBQUU7b0JBQ1YsYUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNkO2dCQUNELE1BQU07WUFDVixLQUFLLE9BQU87Z0JBQ1IsSUFBSSxPQUFPLEVBQUU7b0JBQ1QsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDaEIsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7aUJBQ3ZDO3FCQUFNO29CQUNILGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUM7aUJBQ2pEO2dCQUNELE1BQU07WUFDVixLQUFLLFFBQVE7Z0JBQ1QsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUN2QixPQUFPLEdBQUcsSUFBSSxDQUFDO29CQUNmLE9BQU8sWUFBWSxDQUFjLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDakQ7WUFFTDtnQkFDSSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDeEIsTUFBTSxJQUFJLDBCQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUNoRDtnQkFDRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3pCLE1BQU0sSUFBSSwwQkFBYyxDQUNwQixvQ0FBb0MsQ0FDdkMsQ0FBQztpQkFDTDtnQkFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUM7Z0JBQ3pELElBQUk7b0JBQ0EsTUFBb0IsR0FBRyxDQUFDLE9BQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUM1RCxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILEdBQUcsUUFBUSwwQ0FBMEMsQ0FDeEQsQ0FBQztpQkFDTDtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDVixhQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2Q7U0FDUjtJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLFlBQVksQ0FBQyJ9