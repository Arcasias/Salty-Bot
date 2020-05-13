"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("./Model"));
class QuickCommand extends Model_1.default {
    async run() {
        eval(this.effect);
    }
}
QuickCommand.fields = {
    keys: "",
    effect: "",
    name: "",
};
QuickCommand.table = "commands";
exports.default = QuickCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tDb21tYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzZXMvUXVpY2tDb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQWtEO0FBRWxELE1BQU0sWUFBYSxTQUFRLGVBQUs7SUFZNUIsS0FBSyxDQUFDLEdBQUc7UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLENBQUM7O0FBVHlCLG1CQUFNLEdBQXFCO0lBQ2pELElBQUksRUFBRSxFQUFFO0lBQ1IsTUFBTSxFQUFFLEVBQUU7SUFDVixJQUFJLEVBQUUsRUFBRTtDQUNYLENBQUM7QUFDd0Isa0JBQUssR0FBRyxVQUFVLENBQUM7QUFPakQsa0JBQWUsWUFBWSxDQUFDIn0=