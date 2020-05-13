"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const list_1 = require("../../list");
class FaultCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "fault";
        this.keys = ["overwatch", "reason"];
        this.help = [
            {
                argument: null,
                effect: "Check whose fault it is",
            },
        ];
    }
    async action({ msg }) {
        const text = (utils_1.choice(list_1.fault.start) + utils_1.choice(list_1.fault.sentence))
            .replace(/<subject>/g, utils_1.choice(list_1.fault.subject))
            .replace(/<reason>/g, utils_1.choice(list_1.fault.reason))
            .replace(/<punishment>/g, utils_1.choice(list_1.fault.punishment));
        await Salty_1.default.message(msg, text);
    }
}
exports.default = FaultCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvbWlzYy9mYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQUM1QyxnRUFBd0M7QUFDeEMsdUNBQXFDO0FBQ3JDLHFDQUFtQztBQUVuQyxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSx5QkFBeUI7YUFDcEM7U0FDSixDQUFDO0lBVU4sQ0FBQztJQVJHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFDaEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxjQUFNLENBQUMsWUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLGNBQU0sQ0FBQyxZQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDdEQsT0FBTyxDQUFDLFlBQVksRUFBRSxjQUFNLENBQUMsWUFBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzVDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsY0FBTSxDQUFDLFlBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUMxQyxPQUFPLENBQUMsZUFBZSxFQUFFLGNBQU0sQ0FBQyxZQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUV4RCxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDSjtBQUVELGtCQUFlLFlBQVksQ0FBQyJ9