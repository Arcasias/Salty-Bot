"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "embed",
    keys: ["json", "parse"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***JSON data***",
            effect: "Parses the provided JSON as a Discord embed",
        },
    ],
    async action({ args, msg }) {
        let parsed;
        try {
            parsed = JSON.parse(args.join(" "));
        }
        catch (error) {
            return Salty_1.default.warn(msg, "Given data must be formatted as a JSON string.");
        }
        if (!Object.keys(parsed).length) {
            return Salty_1.default.warn(msg, "You must give me some data to parse.");
        }
        await Salty_1.default.message(msg, null, { embed: new discord_js_1.MessageEmbed(parsed) });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvZ2VuZXJhbC9lbWJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJDQUEwQztBQUMxQyxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBRXhDLGlCQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO0lBQ3ZCLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsSUFBSTtTQUNmO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLE1BQU0sRUFBRSw2Q0FBNkM7U0FDeEQ7S0FDSjtJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLElBQUksTUFBTSxDQUFDO1FBQ1gsSUFBSTtZQUNBLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN2QztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osT0FBTyxlQUFLLENBQUMsSUFBSSxDQUNiLEdBQUcsRUFDSCxnREFBZ0QsQ0FDbkQsQ0FBQztTQUNMO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQzdCLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztTQUNsRTtRQUNELE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUkseUJBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEUsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9