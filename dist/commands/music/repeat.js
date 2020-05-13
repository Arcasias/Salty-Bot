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
    async action({ args, msg }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL211c2ljL3JlcGVhdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUErRDtBQUMvRCxnRUFBd0M7QUFDeEMsZ0VBQXdDO0FBRXhDLE1BQU0sYUFBYyxTQUFRLGlCQUFPO0lBQW5DOztRQUNXLFNBQUksR0FBRyxRQUFRLENBQUM7UUFDaEIsU0FBSSxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqQyxTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsc0NBQXNDO2FBQ2pEO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLE1BQU0sRUFBRSwwQkFBMEI7YUFDckM7WUFDRDtnQkFDSSxRQUFRLEVBQUUsS0FBSztnQkFDZixNQUFNLEVBQUUsd0JBQXdCO2FBQ25DO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsTUFBTSxFQUFFLGlCQUFpQjthQUM1QjtTQUNKLENBQUM7SUFvQ04sQ0FBQztJQWxDRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBaUI7UUFDckMsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUzQyxNQUFNLE1BQU0sR0FBRyxHQUFHLEVBQUU7WUFDaEIsUUFBUSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7WUFDM0IsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsb0NBQW9DLEVBQUU7Z0JBQ3JELEtBQUssRUFBRSxJQUFJO2FBQ2QsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxHQUFHLEdBQUcsR0FBRyxFQUFFO1lBQ2IsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDeEIsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsbUNBQW1DLEVBQUU7Z0JBQ3BELEtBQUssRUFBRSxJQUFJO2FBQ2QsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxHQUFHLEdBQUcsR0FBRyxFQUFFO1lBQ2IsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDeEIsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xELE1BQU0sRUFBRSxDQUFDO1NBQ1o7YUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEQsR0FBRyxFQUFFLENBQUM7U0FDVDthQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsRCxHQUFHLEVBQUUsQ0FBQztTQUNUO2FBQU07WUFDSCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFO2dCQUMzQixHQUFHLEVBQUUsQ0FBQzthQUNUO2lCQUFNO2dCQUNILEdBQUcsRUFBRSxDQUFDO2FBQ1Q7U0FDSjtJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLGFBQWEsQ0FBQyJ9