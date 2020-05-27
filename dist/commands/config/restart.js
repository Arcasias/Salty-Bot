"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "restart",
    keys: ["reset"],
    help: [
        {
            argument: null,
            effect: "Disconnects me and reconnects right after",
        },
    ],
    access: "dev",
    async action({ msg }) {
        await Salty_1.default.success(msg, "Restarting ...");
        await Salty_1.default.restart();
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25maWcvcmVzdGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQUM1QyxnRUFBd0M7QUFFeEMsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsU0FBUztJQUNmLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUNmLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsMkNBQTJDO1NBQ3REO0tBQ0o7SUFDRCxNQUFNLEVBQUUsS0FBSztJQUViLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFDaEIsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sZUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzFCLENBQUM7Q0FDSixDQUFDLENBQUMifQ==