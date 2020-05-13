"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
class DelayCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "delay";
        this.keys = ["sleep", "timeout"];
        this.help = [
            {
                argument: null,
                effect: null,
            },
            {
                argument: "*delay* ***anything***",
                effect: "I'll tell what you want after a provided delay",
            },
        ];
    }
    async action({ args, msg }) {
        if (!args[0]) {
            throw new Exception_1.MissingArg("anything");
        }
        const delay = args[1] && !isNaN(Number(args[0]))
            ? parseInt(args.shift()) * 1000
            : 5000;
        msg.delete().catch();
        setTimeout(() => {
            Salty_1.default.message(msg, args.join(" "));
        }, delay);
    }
}
exports.default = DelayCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvZ2VuZXJhbC9kZWxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUErRDtBQUMvRCx1REFBcUQ7QUFDckQsZ0VBQXdDO0FBRXhDLE1BQU0sWUFBYSxTQUFRLGlCQUFPO0lBQWxDOztRQUNXLFNBQUksR0FBRyxPQUFPLENBQUM7UUFDZixTQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUIsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNJLFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLE1BQU0sRUFBRSxnREFBZ0Q7YUFDM0Q7U0FDSixDQUFDO0lBa0JOLENBQUM7SUFoQkcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQWlCO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDVixNQUFNLElBQUksc0JBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNwQztRQUVELE1BQU0sS0FBSyxHQUNQLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFJO1lBQy9CLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFZixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFckIsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNaLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDZCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxZQUFZLENBQUMifQ==