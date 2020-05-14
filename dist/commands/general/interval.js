"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const INTERVALS = {};
class IntervalCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "interval";
        this.help = [
            {
                argument: null,
                effect: null,
            },
            {
                argument: "*delay* ***anything***",
                effect: "I'll tell what you want after a every **delay** seconds",
            },
        ];
        this.access = "dev";
    }
    async action({ args, msg }) {
        if (args[0] && terms_1.clear.includes(args[0])) {
            if (!INTERVALS[msg.guild.id]) {
                throw new Exception_1.EmptyObject("interval");
            }
            clearInterval(INTERVALS[msg.guild.id]);
            Salty_1.default.success(msg, "Interval cleared");
        }
        else {
            if (!args[0]) {
                throw new Exception_1.MissingArg("delay");
            }
            if (isNaN(Number(args[0]))) {
                throw new Exception_1.IncorrectValue("delay", "number");
            }
            if (!args[1]) {
                throw new Exception_1.MissingArg("message");
            }
            const delay = parseInt(args.shift()) * 1000;
            msg.delete().catch();
            if (INTERVALS[msg.guild.id]) {
                clearInterval(INTERVALS[msg.guild.id]);
            }
            INTERVALS[msg.guild.id] = setInterval(() => {
                Salty_1.default.message(msg, args.join(" "));
            }, delay);
        }
    }
}
exports.default = IntervalCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvZ2VuZXJhbC9pbnRlcnZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE4RTtBQUM5RSx1REFJaUM7QUFDakMsZ0VBQXdDO0FBQ3hDLHVDQUFvQztBQUVwQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFFckIsTUFBTSxlQUFnQixTQUFRLGlCQUFPO0lBQXJDOztRQUNXLFNBQUksR0FBRyxVQUFVLENBQUM7UUFDbEIsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNJLFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLE1BQU0sRUFBRSx5REFBeUQ7YUFDcEU7U0FDSixDQUFDO1FBQ0ssV0FBTSxHQUFrQixLQUFLLENBQUM7SUFnQ3pDLENBQUM7SUE5QkcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQWlCO1FBQ3JDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLGFBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUMxQixNQUFNLElBQUksdUJBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNyQztZQUNELGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRXZDLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGtCQUFrQixDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNILElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1YsTUFBTSxJQUFJLHNCQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDakM7WUFDRCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDeEIsTUFBTSxJQUFJLDBCQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQy9DO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDVixNQUFNLElBQUksc0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNuQztZQUNELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7WUFFNUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXJCLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ3pCLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzFDO1lBQ0QsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtnQkFDdkMsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNiO0lBQ0wsQ0FBQztDQUNKO0FBRUQsa0JBQWUsZUFBZSxDQUFDIn0=