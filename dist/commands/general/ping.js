"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const PING_MESSAGES = [
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
Command_1.default.register({
    name: "ping",
    keys: ["latency", "test"],
    help: [
        {
            argument: null,
            effect: "Tests client-server latency",
        },
    ],
    async action({ args, msg }) {
        var _a;
        if (args.length && args[0] === "role") {
            const roles = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.cache;
            if (roles) {
                const roleIds = roles
                    .filter((role) => Boolean(role.color))
                    .map((role) => utils_1.pingable(role.id));
                return Salty_1.default.message(msg, roleIds.join(" "));
            }
            else {
                return Salty_1.default.error(msg, "No roles on this server.");
            }
        }
        else {
            if (utils_1.generate(3)) {
                return Salty_1.default.success(msg, "pong, and I don't give a fuck about your latency");
            }
            const sentMsg = await msg.channel.send("Pinging...");
            const latency = sentMsg.createdTimestamp - msg.createdTimestamp;
            const message = PING_MESSAGES[Math.floor(latency / 100)] || "lol wat";
            await sentMsg.delete();
            await Salty_1.default.success(msg, `pong! Latency is ${latency}. ${utils_1.title(message)}`);
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3BpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHVDQUF3RDtBQUV4RCxNQUFNLGFBQWEsR0FBRztJQUNsQixpQkFBaUI7SUFDakIsb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixvQkFBb0I7SUFDcEIsb0JBQW9CO0lBQ3BCLHlCQUF5QjtJQUN6Qix3QkFBd0I7SUFDeEIscURBQXFEO0lBQ3JELDBEQUEwRDtJQUMxRCwyQ0FBMkM7Q0FDOUMsQ0FBQztBQUVGLGlCQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2IsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO0lBQ3pCLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsNkJBQTZCO1NBQ3hDO0tBQ0o7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRTs7UUFDdEIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7WUFDbkMsTUFBTSxLQUFLLFNBQUcsR0FBRyxDQUFDLEtBQUssMENBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNyQyxJQUFJLEtBQUssRUFBRTtnQkFDUCxNQUFNLE9BQU8sR0FBRyxLQUFLO3FCQUNoQixNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdEMsT0FBTyxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDaEQ7aUJBQU07Z0JBQ0gsT0FBTyxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO2FBQ3ZEO1NBQ0o7YUFBTTtZQUVILElBQUksZ0JBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDYixPQUFPLGVBQUssQ0FBQyxPQUFPLENBQ2hCLEdBQUcsRUFDSCxrREFBa0QsQ0FDckQsQ0FBQzthQUNMO1lBRUQsTUFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDO1lBQ2hFLE1BQU0sT0FBTyxHQUNULGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQztZQUUxRCxNQUFNLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN2QixNQUFNLGVBQUssQ0FBQyxPQUFPLENBQ2YsR0FBRyxFQUNILG9CQUFvQixPQUFPLEtBQUssYUFBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQ25ELENBQUM7U0FDTDtJQUNMLENBQUM7Q0FDSixDQUFDLENBQUMifQ==