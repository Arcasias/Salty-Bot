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
    name: "fault",
    keys: ["overwatch", "reason"],
    help: [
        {
            argument: null,
            effect: "Check whose fault it is",
        },
    ],
    async action({ msg }) {
        const text = (utils_1.choice(terms_1.fault.start) + utils_1.choice(terms_1.fault.sentence))
            .replace(/<subject>/g, utils_1.choice(terms_1.fault.subject))
            .replace(/<reason>/g, utils_1.choice(terms_1.fault.reason))
            .replace(/<punishment>/g, utils_1.choice(terms_1.fault.punishment));
        await Salty_1.default.message(msg, text);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbWlzYy9mYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQUM1QyxnRUFBd0M7QUFDeEMsdUNBQW9DO0FBQ3BDLHVDQUFxQztBQUVyQyxpQkFBTyxDQUFDLFFBQVEsQ0FBQztJQUNiLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQztJQUM3QixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLHlCQUF5QjtTQUNwQztLQUNKO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRTtRQUNoQixNQUFNLElBQUksR0FBRyxDQUFDLGNBQU0sQ0FBQyxhQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsY0FBTSxDQUFDLGFBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN0RCxPQUFPLENBQUMsWUFBWSxFQUFFLGNBQU0sQ0FBQyxhQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDNUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxjQUFNLENBQUMsYUFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsY0FBTSxDQUFDLGFBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRXhELE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9