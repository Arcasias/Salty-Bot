"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
class RestartCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "restart";
        this.keys = ["reset"];
        this.help = [
            {
                argument: null,
                effect: "Disconnects me and reconnects right after",
            },
        ];
        this.visibility = "dev";
    }
    async action({ msg }) {
        await Salty_1.default.success(msg, "Restarting ...");
        await Salty_1.default.restart();
    }
}
exports.default = RestartCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWcvcmVzdGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUFrRTtBQUNsRSxnRUFBd0M7QUFFeEMsTUFBTSxjQUFlLFNBQVEsaUJBQU87SUFBcEM7O1FBQ1csU0FBSSxHQUFHLFNBQVMsQ0FBQztRQUNqQixTQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsMkNBQTJDO2FBQ3REO1NBQ0osQ0FBQztRQUNLLGVBQVUsR0FBcUIsS0FBSyxDQUFDO0lBTWhELENBQUM7SUFKRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFO1FBQ2hCLE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUMzQyxNQUFNLGVBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMxQixDQUFDO0NBQ0o7QUFFRCxrQkFBZSxjQUFjLENBQUMifQ==