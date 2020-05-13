"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const list_1 = require("../../list");
class DisconnectCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "disconnect";
        this.keys = [];
        this.help = [
            {
                argument: null,
                effect: "Disconnects me and terminates my program. Think wisely before using this one, ok?",
            },
        ];
        this.visibility = "dev";
    }
    async action({ msg }) {
        await Salty_1.default.success(msg, `${utils_1.choice(list_1.answers.bye)} ♥`);
        await Salty_1.default.destroy();
    }
}
exports.default = DisconnectCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY29ubmVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWcvZGlzY29ubmVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUFrRTtBQUNsRSxnRUFBd0M7QUFDeEMsdUNBQXFDO0FBQ3JDLHFDQUFxQztBQUVyQyxNQUFNLGlCQUFrQixTQUFRLGlCQUFPO0lBQXZDOztRQUNXLFNBQUksR0FBRyxZQUFZLENBQUM7UUFDcEIsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUNWLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFDRixtRkFBbUY7YUFDMUY7U0FDSixDQUFDO1FBQ0ssZUFBVSxHQUFxQixLQUFLLENBQUM7SUFNaEQsQ0FBQztJQUpHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFDaEIsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLGNBQU0sQ0FBQyxjQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELE1BQU0sZUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzFCLENBQUM7Q0FDSjtBQUVELGtCQUFlLGlCQUFpQixDQUFDIn0=