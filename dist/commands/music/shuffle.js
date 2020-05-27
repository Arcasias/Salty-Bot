"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "shuffle",
    keys: ["mix"],
    help: [
        {
            argument: null,
            effect: "Shuffles the queue",
        },
    ],
    channel: "guild",
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.queue.length > 2) {
            playlist.shuffle();
            Salty_1.default.success(msg, "queue shuffled!", { react: "🔀" });
        }
        else {
            Salty_1.default.error(msg, "don't you think you'd need more than 1 song to make it useful?");
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1ZmZsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9zaHVmZmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFFeEMsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsU0FBUztJQUNmLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNiLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsb0JBQW9CO1NBQy9CO0tBQ0o7SUFDRCxPQUFPLEVBQUUsT0FBTztJQUVoQixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFO1FBQ2hCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsRUFBRSxDQUFFLENBQUM7UUFFL0MsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDM0IsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ25CLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDMUQ7YUFBTTtZQUNILGVBQUssQ0FBQyxLQUFLLENBQ1AsR0FBRyxFQUNILGdFQUFnRSxDQUNuRSxDQUFDO1NBQ0w7SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFDIn0=