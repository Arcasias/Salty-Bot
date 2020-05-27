"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "tts",
    keys: ["speak"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***something to say***",
            effect: "Says something out loud",
        },
    ],
    async action({ args, msg }) {
        if (!args[0]) {
            return Salty_1.default.warn(msg, "You need to tell me what to say.");
        }
        msg.delete();
        await msg.channel.send(args.join(" "), { tts: true });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvdHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUV4QyxpQkFBTyxDQUFDLFFBQVEsQ0FBQztJQUNiLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ2YsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxJQUFJO1NBQ2Y7UUFDRDtZQUNJLFFBQVEsRUFBRSx3QkFBd0I7WUFDbEMsTUFBTSxFQUFFLHlCQUF5QjtTQUNwQztLQUNKO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7UUFFdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNWLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztTQUM5RDtRQUNELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNiLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7Q0FDSixDQUFDLENBQUMifQ==