"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "future",
    keys: ["predict"],
    help: [
        {
            argument: null,
            effect: "",
        },
    ],
    async action({ msg }) {
        const pred = [];
        for (const prediction of terms_1.predictions) {
            pred.push(...new Array(utils_1.randInt(2, 4)).fill(prediction));
        }
        const shuffled = utils_1.shuffle(pred);
        const ellipsed = utils_1.ellipsis(shuffled.join(" ||||"), 1995);
        Salty_1.default.message(msg, `||${ellipsed}||`);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnV0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvZnV0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUN4Qyx1Q0FBMEM7QUFDMUMsdUNBQXlEO0FBRXpELGlCQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2IsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUM7SUFDakIsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxFQUFFO1NBQ2I7S0FDSjtJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFDaEIsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLEtBQUssTUFBTSxVQUFVLElBQUksbUJBQVcsRUFBRTtZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsZUFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsTUFBTSxRQUFRLEdBQUcsZUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLE1BQU0sUUFBUSxHQUFHLGdCQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9