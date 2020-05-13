"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
class ResumeCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "resume";
        this.keys = ["unfreeze"];
        this.help = [
            {
                argument: null,
                effect: "Resumes the paused song",
            },
        ];
    }
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.connection) {
            try {
                playlist.resume();
                Salty_1.default.success(msg, `resumed **${playlist.playing.title}**`, {
                    react: "▶",
                });
            }
            catch (err) {
                Salty_1.default.error(msg, "the song isn't paused");
            }
        }
        else {
            Salty_1.default.error(msg, "there's nothing playing");
        }
    }
}
exports.default = ResumeCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL211c2ljL3Jlc3VtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUErRDtBQUMvRCxnRUFBd0M7QUFDeEMsZ0VBQXdDO0FBRXhDLE1BQU0sYUFBYyxTQUFRLGlCQUFPO0lBQW5DOztRQUNXLFNBQUksR0FBRyxRQUFRLENBQUM7UUFDaEIsU0FBSSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEIsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLHlCQUF5QjthQUNwQztTQUNKLENBQUM7SUFrQk4sQ0FBQztJQWhCRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFpQjtRQUMvQixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTdDLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUNyQixJQUFJO2dCQUNBLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbEIsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsYUFBYSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxFQUFFO29CQUN4RCxLQUFLLEVBQUUsR0FBRztpQkFDYixDQUFDLENBQUM7YUFDTjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHVCQUF1QixDQUFDLENBQUM7YUFDN0M7U0FDSjthQUFNO1lBQ0gsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUseUJBQXlCLENBQUMsQ0FBQztTQUMvQztJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLGFBQWEsQ0FBQyJ9