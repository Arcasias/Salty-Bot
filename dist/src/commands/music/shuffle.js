"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
class ShuffleCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "shuffle";
        this.keys = ["mix"];
        this.help = [
            {
                argument: null,
                effect: "Shuffles the queue",
            },
        ];
    }
    async action({ msg }) {
        const { playlist } = Guild_1.default.get(msg.guild.id);
        if (playlist.queue.length > 2) {
            playlist.shuffle();
            Salty_1.default.success(msg, "queue shuffled!", { react: "🔀" });
        }
        else {
            Salty_1.default.error(msg, "don't you think you'd need more than 1 song to make it useful?");
        }
    }
}
exports.default = ShuffleCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1ZmZsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9tdXNpYy9zaHVmZmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUN4QyxnRUFBd0M7QUFFeEMsTUFBTSxjQUFlLFNBQVEsaUJBQU87SUFBcEM7O1FBQ1csU0FBSSxHQUFHLFNBQVMsQ0FBQztRQUNqQixTQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNmLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxvQkFBb0I7YUFDL0I7U0FDSixDQUFDO0lBZU4sQ0FBQztJQWJHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFDaEIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMzQixRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkIsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUMxRDthQUFNO1lBQ0gsZUFBSyxDQUFDLEtBQUssQ0FDUCxHQUFHLEVBQ0gsZ0VBQWdFLENBQ25FLENBQUM7U0FDTDtJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLGNBQWMsQ0FBQyJ9