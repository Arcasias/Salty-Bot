"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("./Model"));
class User extends Model_1.default {
    static get(id) {
        return this.find((user) => user.discord_id === id);
    }
}
User.fields = {
    discord_id: "",
    black_listed: false,
    todos: [],
};
User.table = "users";
exports.default = User;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL1VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvREFBNEI7QUFFNUIsTUFBTSxJQUFLLFNBQVEsZUFBSztJQWFiLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBVTtRQUN4QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQzs7QUFUeUIsV0FBTSxHQUFxQjtJQUNqRCxVQUFVLEVBQUUsRUFBRTtJQUNkLFlBQVksRUFBRSxLQUFLO0lBQ25CLEtBQUssRUFBRSxFQUFFO0NBQ1osQ0FBQztBQUN3QixVQUFLLEdBQUcsT0FBTyxDQUFDO0FBTzlDLGtCQUFlLElBQUksQ0FBQyJ9