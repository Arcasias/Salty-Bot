"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
class PauseCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "pause";
        this.keys = ["freeze"];
        this.help = [
            {
                argument: null,
                effect: "Pauses the song currently playing",
            },
        ];
    }
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            try {
                playlist.pause();
                Salty_1.default.success(msg, `paused **${playlist.playing.title}**`, {
                    react: "⏸",
                });
            }
            catch (err) {
                Salty_1.default.error(msg, "the song is already paused");
            }
        }
        else {
            Salty_1.default.error(msg, "there's nothing playing");
        }
    }
}
exports.default = PauseCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF1c2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbXVzaWMvcGF1c2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBK0Q7QUFDL0QsZ0VBQXdDO0FBQ3hDLGdFQUF3QztBQUV4QyxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEIsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLG1DQUFtQzthQUM5QztTQUNKLENBQUM7SUFrQk4sQ0FBQztJQWhCRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFpQjtRQUMvQixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTdDLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUNyQixJQUFJO2dCQUNBLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDakIsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsWUFBWSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxFQUFFO29CQUN2RCxLQUFLLEVBQUUsR0FBRztpQkFDYixDQUFDLENBQUM7YUFDTjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLDRCQUE0QixDQUFDLENBQUM7YUFDbEQ7U0FDSjthQUFNO1lBQ0gsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUseUJBQXlCLENBQUMsQ0FBQztTQUMvQztJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLFlBQVksQ0FBQyJ9