"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const terms_1 = require("../../terms");
class DisconnectCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "disconnect";
        this.help = [
            {
                argument: null,
                effect: "Disconnects me and terminates my program. Think wisely before using this one, ok?",
            },
        ];
        this.access = "dev";
    }
    async action({ msg }) {
        await Salty_1.default.success(msg, `${utils_1.choice(terms_1.answers.bye)} ♥`);
        await Salty_1.default.destroy();
    }
}
exports.default = DisconnectCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY29ubmVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWcvZGlzY29ubmVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE4RTtBQUM5RSxnRUFBd0M7QUFDeEMsdUNBQXFDO0FBQ3JDLHVDQUFzQztBQUV0QyxNQUFNLGlCQUFrQixTQUFRLGlCQUFPO0lBQXZDOztRQUNXLFNBQUksR0FBRyxZQUFZLENBQUM7UUFDcEIsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUNGLG1GQUFtRjthQUMxRjtTQUNKLENBQUM7UUFDSyxXQUFNLEdBQWtCLEtBQUssQ0FBQztJQU16QyxDQUFDO0lBSkcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBaUI7UUFDL0IsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLGNBQU0sQ0FBQyxlQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELE1BQU0sZUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzFCLENBQUM7Q0FDSjtBQUVELGtCQUFlLGlCQUFpQixDQUFDIn0=