"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "resume",
    keys: ["unfreeze"],
    help: [
        {
            argument: null,
            effect: "Resumes the paused song",
        },
    ],
    channel: "guild",
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
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL211c2ljL3Jlc3VtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQUM1QyxnRUFBd0M7QUFDeEMsZ0VBQXdDO0FBRXhDLGlCQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2IsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSx5QkFBeUI7U0FDcEM7S0FDSjtJQUNELE9BQU8sRUFBRSxPQUFPO0lBRWhCLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFDaEIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQU0sQ0FBQyxFQUFFLENBQUUsQ0FBQztRQUUvQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDckIsSUFBSTtnQkFDQSxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2xCLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGFBQWEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksRUFBRTtvQkFDeEQsS0FBSyxFQUFFLEdBQUc7aUJBQ2IsQ0FBQyxDQUFDO2FBQ047WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2FBQzdDO1NBQ0o7YUFBTTtZQUNILGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHlCQUF5QixDQUFDLENBQUM7U0FDL0M7SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFDIn0=