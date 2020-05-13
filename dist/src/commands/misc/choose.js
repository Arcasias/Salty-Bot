"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
class ChooseCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "choose";
        this.keys = ["choice", "chose", "shoes"];
        this.help = [
            {
                argument: null,
                effect: null,
            },
            {
                argument: "***first choice*** / ***second choice*** / ...",
                effect: "Chooses randomly from all provided choices. They must be separated with \"/\". Please don't use this to decide important life choices, it's purely random ok?",
            },
        ];
    }
    async action({ msg, args }) {
        if (!args[0] || !args[1]) {
            throw new Exception_1.MissingArg("choices");
        }
        await Salty_1.default.message(msg, `I choose ${utils_1.choice(args.join(" ").split("/"))}`);
    }
}
exports.default = ChooseCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvb3NlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvY2hvb3NlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLHVEQUFxRDtBQUNyRCxnRUFBd0M7QUFDeEMsdUNBQXFDO0FBRXJDLE1BQU0sYUFBYyxTQUFRLGlCQUFPO0lBQW5DOztRQUNXLFNBQUksR0FBRyxRQUFRLENBQUM7UUFDaEIsU0FBSSxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQyxTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsSUFBSTthQUNmO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGdEQUFnRDtnQkFDMUQsTUFBTSxFQUNGLCtKQUErSjthQUN0SztTQUNKLENBQUM7SUFXTixDQUFDO0lBVEcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QixNQUFNLElBQUksc0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNuQztRQUNELE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gsWUFBWSxjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUNsRCxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBRUQsa0JBQWUsYUFBYSxDQUFDIn0=