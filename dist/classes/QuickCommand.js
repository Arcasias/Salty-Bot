"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Model_1 = __importDefault(require("./Model"));
const Salty_1 = __importDefault(require("./Salty"));
class QuickCommand extends Model_1.default {
    async run(msg, args) {
        return Salty_1.default.message(msg, utils_1.choice(this.answers));
    }
}
QuickCommand.fields = {
    answers: [],
    keys: [],
    name: "",
};
QuickCommand.table = "commands";
exports.default = QuickCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tDb21tYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzZXMvUXVpY2tDb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsb0NBQWtDO0FBQ2xDLG9EQUE0QjtBQUM1QixvREFBNEI7QUFFNUIsTUFBTSxZQUFhLFNBQVEsZUFBSztJQXVENUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFZLEVBQUUsSUFBYztRQUNsQyxPQUFPLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGNBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNwRCxDQUFDOztBQW5EeUIsbUJBQU0sR0FBcUI7SUFDakQsT0FBTyxFQUFFLEVBQUU7SUFDWCxJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxFQUFFO0NBQ1gsQ0FBQztBQUN3QixrQkFBSyxHQUFHLFVBQVUsQ0FBQztBQWlEakQsa0JBQWUsWUFBWSxDQUFDIn0=