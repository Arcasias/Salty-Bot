"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const INTERVALS = {};
Command_1.default.register({
    name: "interval",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "*delay* ***anything***",
            effect: "I'll tell what you want after a every **delay** seconds",
        },
    ],
    access: "dev",
    async action({ args, msg }) {
        const channel = msg.guild ? msg.guild.id : msg.author.id;
        if (args[0] && terms_1.clear.includes(args[0])) {
            if (!INTERVALS[channel]) {
                return Salty_1.default.warn(msg, "There is no interval on this channel.");
            }
            clearInterval(INTERVALS[channel]);
            Salty_1.default.success(msg, "Interval cleared");
        }
        else {
            if (!args[0]) {
                return Salty_1.default.warn(msg, "You need to specify the interval length in milliseconds.");
            }
            if (isNaN(Number(args[0]))) {
                return Salty_1.default.warn(msg, "You need to specify the interval length in milliseconds.");
            }
            if (!args[1]) {
                return Salty_1.default.warn(msg, "You need to tell me what to say after each interval.");
            }
            const delay = parseInt(args.shift()) * 1000;
            msg.delete().catch();
            if (INTERVALS[channel]) {
                clearInterval(INTERVALS[channel]);
            }
            INTERVALS[channel] = setInterval(() => {
                Salty_1.default.message(msg, args.join(" "));
            }, delay);
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvZ2VuZXJhbC9pbnRlcnZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQUM1QyxnRUFBd0M7QUFDeEMsdUNBQW9DO0FBRXBDLE1BQU0sU0FBUyxHQUF3QyxFQUFFLENBQUM7QUFFMUQsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLElBQUk7U0FDZjtRQUNEO1lBQ0ksUUFBUSxFQUFFLHdCQUF3QjtZQUNsQyxNQUFNLEVBQUUseURBQXlEO1NBQ3BFO0tBQ0o7SUFDRCxNQUFNLEVBQUUsS0FBSztJQUViLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUN6RCxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsdUNBQXVDLENBQUMsQ0FBQzthQUNuRTtZQUNELGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUVsQyxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNWLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FDYixHQUFHLEVBQ0gsMERBQTBELENBQzdELENBQUM7YUFDTDtZQUNELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN4QixPQUFPLGVBQUssQ0FBQyxJQUFJLENBQ2IsR0FBRyxFQUNILDBEQUEwRCxDQUM3RCxDQUFDO2FBQ0w7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNWLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FDYixHQUFHLEVBQ0gsc0RBQXNELENBQ3pELENBQUM7YUFDTDtZQUNELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7WUFFN0MsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXJCLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNwQixhQUFhLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDckM7WUFDRCxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtnQkFDbEMsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNiO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9