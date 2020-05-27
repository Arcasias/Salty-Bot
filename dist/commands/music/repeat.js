"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "repeat",
    keys: ["loop", "rep", "replay"],
    help: [
        {
            argument: null,
            effect: "Toggles repeat all/off for the queue",
        },
        {
            argument: "single",
            effect: "Repeats the current song",
        },
        {
            argument: "all",
            effect: "Repeat the whole queue",
        },
        {
            argument: "off",
            effect: "Disables repeat",
        },
    ],
    channel: "guild",
    async action({ args, msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        const single = () => {
            playlist.repeat = "single";
            Salty_1.default.success(msg, "I will now repeat the current song", {
                react: "🔂",
            });
        };
        const all = () => {
            playlist.repeat = "all";
            Salty_1.default.success(msg, "I will now repeat the whole queue", {
                react: "🔁",
            });
        };
        const off = () => {
            playlist.repeat = "off";
            Salty_1.default.success(msg, "repeat disabled", { react: "❎" });
        };
        if (["single", "1", "one", "this"].includes(args[0])) {
            single();
        }
        else if (["all", "queue", "q"].includes(args[0])) {
            all();
        }
        else if (["off", "disable", "0"].includes(args[0])) {
            off();
        }
        else {
            if (playlist.repeat === "off") {
                all();
            }
            else {
                off();
            }
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL211c2ljL3JlcGVhdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQUM1QyxnRUFBd0M7QUFDeEMsZ0VBQXdDO0FBRXhDLGlCQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2IsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQztJQUMvQixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLHNDQUFzQztTQUNqRDtRQUNEO1lBQ0ksUUFBUSxFQUFFLFFBQVE7WUFDbEIsTUFBTSxFQUFFLDBCQUEwQjtTQUNyQztRQUNEO1lBQ0ksUUFBUSxFQUFFLEtBQUs7WUFDZixNQUFNLEVBQUUsd0JBQXdCO1NBQ25DO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsS0FBSztZQUNmLE1BQU0sRUFBRSxpQkFBaUI7U0FDNUI7S0FDSjtJQUNELE9BQU8sRUFBRSxPQUFPO0lBRWhCLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsRUFBRSxDQUFFLENBQUM7UUFFL0MsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFO1lBQ2hCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQzNCLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLG9DQUFvQyxFQUFFO2dCQUNyRCxLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtZQUNiLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLG1DQUFtQyxFQUFFO2dCQUNwRCxLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtZQUNiLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsRCxNQUFNLEVBQUUsQ0FBQztTQUNaO2FBQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2hELEdBQUcsRUFBRSxDQUFDO1NBQ1Q7YUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbEQsR0FBRyxFQUFFLENBQUM7U0FDVDthQUFNO1lBQ0gsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEtBQUssRUFBRTtnQkFDM0IsR0FBRyxFQUFFLENBQUM7YUFDVDtpQkFBTTtnQkFDSCxHQUFHLEVBQUUsQ0FBQzthQUNUO1NBQ0o7SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFDIn0=