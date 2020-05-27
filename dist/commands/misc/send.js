"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const config_1 = require("../../config");
const specialActions = [
    {
        keywords: ["nude", "nudes"],
        response: "you wish",
    },
    {
        keywords: ["nood", "noods", "noodle", "noodles"],
        response: "you're so poor",
    },
    {
        keywords: ["noot", "noots"],
        response: "NOOT NOOT",
    },
];
Command_1.default.register({
    name: "send",
    keys: ["say", config_1.prefix],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***anything***",
            effect: "Sends something. Who knows what?",
        },
    ],
    async action({ args, msg, target }) {
        if (!args[0]) {
            return Command_1.default.list.get("talk").run(msg, args, target);
        }
        let message;
        for (let sa of specialActions) {
            if (sa.keywords.includes(args[0])) {
                message = sa.response;
            }
        }
        if (!message) {
            msg.delete();
            message = args.join(" ");
        }
        await Salty_1.default.message(msg, message);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9taXNjL3NlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHlDQUFzQztBQUV0QyxNQUFNLGNBQWMsR0FBRztJQUNuQjtRQUNJLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7UUFDM0IsUUFBUSxFQUFFLFVBQVU7S0FDdkI7SUFDRDtRQUNJLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztRQUNoRCxRQUFRLEVBQUUsZ0JBQWdCO0tBQzdCO0lBQ0Q7UUFDSSxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO1FBQzNCLFFBQVEsRUFBRSxXQUFXO0tBQ3hCO0NBQ0osQ0FBQztBQUVGLGlCQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2IsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsZUFBTSxDQUFDO0lBQ3JCLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsSUFBSTtTQUNmO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLE1BQU0sRUFBRSxrQ0FBa0M7U0FDN0M7S0FDSjtJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRTtRQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsT0FBTyxpQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDM0Q7UUFDRCxJQUFJLE9BQU8sQ0FBQztRQUNaLEtBQUssSUFBSSxFQUFFLElBQUksY0FBYyxFQUFFO1lBQzNCLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQy9CLE9BQU8sR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDO2FBQ3pCO1NBQ0o7UUFDRCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2IsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDNUI7UUFDRCxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDSixDQUFDLENBQUMifQ==