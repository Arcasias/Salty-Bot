"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const MESSAGES = [
    "nearly perfect!",
    "that's pretty good",
    "that's ok, i guess",
    "that's a bit laggy",
    "that's quite laggy",
    "ok that's laggy as fuck",
    "WTF that's super laggy",
    "Jesus Christ how can you manage with that much lag?",
    "dear god are you on a safari in the middle of the ocean?",
    "get off of this world you fucking chinese",
];
class PingCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "ping";
        this.keys = ["latency", "test"];
        this.help = [
            {
                argument: null,
                effect: "Tests client-server latency",
            },
        ];
    }
    async action({ msg }) {
        if (utils_1.generate(3)) {
            await Salty_1.default.error(msg, "pong, and I don't give a fuck about your latency");
        }
        else {
            const sentMsg = await msg.channel.send("Pinging...");
            const latency = sentMsg.createdTimestamp - msg.createdTimestamp;
            const message = MESSAGES[Math.floor(latency / 100)] || "lol wat";
            await sentMsg.delete();
            await Salty_1.default.success(msg, `pong! Latency is ${latency}. ${utils_1.title(message)}`);
        }
    }
}
exports.default = PingCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3BpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHVDQUE4QztBQUU5QyxNQUFNLFFBQVEsR0FBRztJQUNiLGlCQUFpQjtJQUNqQixvQkFBb0I7SUFDcEIsb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixvQkFBb0I7SUFDcEIseUJBQXlCO0lBQ3pCLHdCQUF3QjtJQUN4QixxREFBcUQ7SUFDckQsMERBQTBEO0lBQzFELDJDQUEyQztDQUM5QyxDQUFDO0FBRUYsTUFBTSxXQUFZLFNBQVEsaUJBQU87SUFBakM7O1FBQ1csU0FBSSxHQUFHLE1BQU0sQ0FBQztRQUNkLFNBQUksR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsNkJBQTZCO2FBQ3hDO1NBQ0osQ0FBQztJQXNCTixDQUFDO0lBcEJHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFFaEIsSUFBSSxnQkFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2IsTUFBTSxlQUFLLENBQUMsS0FBSyxDQUNiLEdBQUcsRUFDSCxrREFBa0QsQ0FDckQsQ0FBQztTQUNMO2FBQU07WUFFSCxNQUFNLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3JELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7WUFDaEUsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO1lBRWpFLE1BQU0sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FDZixHQUFHLEVBQ0gsb0JBQW9CLE9BQU8sS0FBSyxhQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FDbkQsQ0FBQztTQUNMO0lBQ0wsQ0FBQztDQUNKO0FBRUQsa0JBQWUsV0FBVyxDQUFDIn0=