"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "choose",
    keys: ["choice", "chose", "shoes"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***first choice*** / ***second choice*** / ...",
            effect: "Chooses randomly from all provided choices. They must be separated with \"/\". Please don't use this to decide important life choices, it's purely random ok?",
        },
    ],
    async action({ args, msg }) {
        if (args.length < 2) {
            return Salty_1.default.warn(msg, "You need to give at least 2 choices.");
        }
        await Salty_1.default.message(msg, `I choose ${utils_1.choice(args.join(" ").split("/"))}`);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hvb3NlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvY2hvb3NlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUN4Qyx1Q0FBcUM7QUFFckMsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsUUFBUTtJQUNkLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0lBQ2xDLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsSUFBSTtTQUNmO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsZ0RBQWdEO1lBQzFELE1BQU0sRUFDRiwrSkFBK0o7U0FDdEs7S0FDSjtJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDakIsT0FBTyxlQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUNmLEdBQUcsRUFDSCxZQUFZLGNBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQ2xELENBQUM7SUFDTixDQUFDO0NBQ0osQ0FBQyxDQUFDIn0=