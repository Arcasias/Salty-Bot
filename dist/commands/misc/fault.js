"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const terms_1 = require("../../terms");
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
        const text = (utils_1.choice(terms_1.fault.start) + utils_1.choice(terms_1.fault.sentence))
            .replace(/<subject>/g, utils_1.choice(terms_1.fault.subject))
            .replace(/<reason>/g, utils_1.choice(terms_1.fault.reason))
            .replace(/<punishment>/g, utils_1.choice(terms_1.fault.punishment));
        await Salty_1.default.message(msg, text);
    }
}
exports.default = FaultCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbWlzYy9mYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUErRDtBQUMvRCxnRUFBd0M7QUFDeEMsdUNBQXFDO0FBQ3JDLHVDQUFvQztBQUVwQyxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSx5QkFBeUI7YUFDcEM7U0FDSixDQUFDO0lBVU4sQ0FBQztJQVJHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQWlCO1FBQy9CLE1BQU0sSUFBSSxHQUFHLENBQUMsY0FBTSxDQUFDLGFBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxjQUFNLENBQUMsYUFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3RELE9BQU8sQ0FBQyxZQUFZLEVBQUUsY0FBTSxDQUFDLGFBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM1QyxPQUFPLENBQUMsV0FBVyxFQUFFLGNBQU0sQ0FBQyxhQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDMUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxjQUFNLENBQUMsYUFBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFFeEQsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxZQUFZLENBQUMifQ==