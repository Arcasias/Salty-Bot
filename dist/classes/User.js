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
