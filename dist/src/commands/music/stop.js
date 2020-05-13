"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const list_1 = require("../../list");
class StopCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "stop";
        this.keys = [];
        this.help = [
            {
                argument: null,
                effect: "Leaves the voice channel and deletes the queue",
            },
        ];
        this.visibility = "admin";
    }
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            playlist.stop();
            Salty_1.default.success(msg, utils_1.choice(list_1.answers.bye), {
                react: "⏹",
            });
        }
        else {
            Salty_1.default.error(msg, "I'm not in a voice channel");
        }
    }
}
exports.default = StopCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9zdG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQWtFO0FBQ2xFLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFDeEMsdUNBQXFDO0FBQ3JDLHFDQUFxQztBQUVyQyxNQUFNLFdBQVksU0FBUSxpQkFBTztJQUFqQzs7UUFDVyxTQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ2QsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUNWLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxnREFBZ0Q7YUFDM0Q7U0FDSixDQUFDO1FBQ0ssZUFBVSxHQUFxQixPQUFPLENBQUM7SUFjbEQsQ0FBQztJQVpHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFDaEIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDckIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hCLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGNBQU0sQ0FBQyxjQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3BDLEtBQUssRUFBRSxHQUFHO2FBQ2IsQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLDRCQUE0QixDQUFDLENBQUM7U0FDbEQ7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxXQUFXLENBQUMifQ==