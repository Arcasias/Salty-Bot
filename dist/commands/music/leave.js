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
        this.access = "admin";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbXVzaWMvbGVhdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBOEU7QUFDOUUsZ0VBQXdDO0FBQ3hDLGdFQUF3QztBQUd4QyxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxrQ0FBa0M7YUFDN0M7U0FDSixDQUFDO1FBQ0ssV0FBTSxHQUFrQixPQUFPLENBQUM7SUFlM0MsQ0FBQztJQWJHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQWlCO1FBQy9CLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFN0MsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ3JCLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNmLGVBQUssQ0FBQyxPQUFPLENBQ1QsR0FBRyxFQUNILGFBQTJCLEdBQUcsQ0FBQyxPQUFRLENBQUMsSUFBSSxJQUFJLENBQ25ELENBQUM7U0FDTDthQUFNO1lBQ0gsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztTQUNsRDtJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLFlBQVksQ0FBQyJ9