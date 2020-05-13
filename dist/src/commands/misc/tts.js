"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
class TtsCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "tts";
        this.keys = ["speak"];
        this.help = [
            {
                argument: null,
                effect: null,
            },
            {
                argument: "***something to say***",
                effect: "Says something out loud",
            },
        ];
    }
    async action({ msg, args }) {
        if (!args[0]) {
            throw new Exception_1.MissingArg("message");
        }
        msg.delete();
        await msg.channel.send(args.join(" "), { tts: true });
    }
}
exports.default = TtsCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvdHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLHVEQUFxRDtBQUVyRCxNQUFNLFVBQVcsU0FBUSxpQkFBTztJQUFoQzs7UUFDVyxTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsU0FBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakIsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNJLFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLE1BQU0sRUFBRSx5QkFBeUI7YUFDcEM7U0FDSixDQUFDO0lBVU4sQ0FBQztJQVJHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO1FBRXRCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDVixNQUFNLElBQUksc0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNuQztRQUNELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNiLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7Q0FDSjtBQUVELGtCQUFlLFVBQVUsQ0FBQyJ9