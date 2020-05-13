"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
class LeaveCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "leave";
        this.keys = ["exit", "quit"];
        this.help = [
            {
                argument: null,
                effect: "Leaves the current voice channel",
            },
        ];
        this.visibility = "admin";
    }
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            playlist.end();
            Salty_1.default.success(msg, `leaving **${msg.channel.name}**`);
        }
        else {
            Salty_1.default.error(msg, "I'm not in a voice channel");
        }
    }
}
exports.default = LeaveCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvbXVzaWMvbGVhdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBa0U7QUFDbEUsZ0VBQXdDO0FBQ3hDLGdFQUF3QztBQUd4QyxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxrQ0FBa0M7YUFDN0M7U0FDSixDQUFDO1FBQ0ssZUFBVSxHQUFxQixPQUFPLENBQUM7SUFlbEQsQ0FBQztJQWJHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFDaEIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDckIsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2YsZUFBSyxDQUFDLE9BQU8sQ0FDVCxHQUFHLEVBQ0gsYUFBMkIsR0FBRyxDQUFDLE9BQVEsQ0FBQyxJQUFJLElBQUksQ0FDbkQsQ0FBQztTQUNMO2FBQU07WUFDSCxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztDQUNKO0FBRUQsa0JBQWUsWUFBWSxDQUFDIn0=