"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
class RepeatCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "repeat";
        this.keys = ["loop", "rep", "replay"];
        this.help = [
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
        ];
    }
    async action({ msg, args }) {
        let { playlist } = Guild_1.default.get(msg.guild.id);
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
    }
}
exports.default = RepeatCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL211c2ljL3JlcGVhdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQUM1QyxnRUFBd0M7QUFDeEMsZ0VBQXdDO0FBRXhDLE1BQU0sYUFBYyxTQUFRLGlCQUFPO0lBQW5DOztRQUNXLFNBQUksR0FBRyxRQUFRLENBQUM7UUFDaEIsU0FBSSxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqQyxTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsc0NBQXNDO2FBQ2pEO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLE1BQU0sRUFBRSwwQkFBMEI7YUFDckM7WUFDRDtnQkFDSSxRQUFRLEVBQUUsS0FBSztnQkFDZixNQUFNLEVBQUUsd0JBQXdCO2FBQ25DO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsTUFBTSxFQUFFLGlCQUFpQjthQUM1QjtTQUNKLENBQUM7SUFvQ04sQ0FBQztJQWxDRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtRQUN0QixJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sTUFBTSxHQUFHLEdBQUcsRUFBRTtZQUNoQixRQUFRLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztZQUMzQixlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxvQ0FBb0MsRUFBRTtnQkFDckQsS0FBSyxFQUFFLElBQUk7YUFDZCxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFDRixNQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUU7WUFDYixRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUN4QixlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxtQ0FBbUMsRUFBRTtnQkFDcEQsS0FBSyxFQUFFLElBQUk7YUFDZCxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFDRixNQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUU7WUFDYixRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUN4QixlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbEQsTUFBTSxFQUFFLENBQUM7U0FDWjthQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNoRCxHQUFHLEVBQUUsQ0FBQztTQUNUO2FBQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xELEdBQUcsRUFBRSxDQUFDO1NBQ1Q7YUFBTTtZQUNILElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxLQUFLLEVBQUU7Z0JBQzNCLEdBQUcsRUFBRSxDQUFDO2FBQ1Q7aUJBQU07Z0JBQ0gsR0FBRyxFQUFFLENBQUM7YUFDVDtTQUNKO0lBQ0wsQ0FBQztDQUNKO0FBRUQsa0JBQWUsYUFBYSxDQUFDIn0=