"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const terms_1 = require("../../terms");
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
        this.access = "admin";
    }
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            playlist.stop();
            Salty_1.default.success(msg, utils_1.choice(terms_1.answers.bye), {
                react: "⏹",
            });
        }
        else {
            Salty_1.default.error(msg, "I'm not in a voice channel");
        }
    }
}
exports.default = StopCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9zdG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQThFO0FBQzlFLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFDeEMsdUNBQXFDO0FBQ3JDLHVDQUFzQztBQUV0QyxNQUFNLFdBQVksU0FBUSxpQkFBTztJQUFqQzs7UUFDVyxTQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ2QsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUNWLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxnREFBZ0Q7YUFDM0Q7U0FDSixDQUFDO1FBQ0ssV0FBTSxHQUFrQixPQUFPLENBQUM7SUFjM0MsQ0FBQztJQVpHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQWlCO1FBQy9CLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFN0MsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ3JCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQixlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxjQUFNLENBQUMsZUFBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNwQyxLQUFLLEVBQUUsR0FBRzthQUNiLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztDQUNKO0FBRUQsa0JBQWUsV0FBVyxDQUFDIn0=