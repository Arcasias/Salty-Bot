"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
const config_1 = require("../../config");
class StateCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "state";
        this.keys = ["git", "local", "server"];
        this.help = [
            {
                argument: null,
                effect: "Gets you some information about me",
            },
        ];
        this.visibility = "dev";
    }
    async action({ msg }) {
        const blacklist = User_1.default.filter((u) => u.black_listed);
        const options = {
            title: `Salty Bot`,
            url: config_1.homepage,
            description: `Last started on ${Salty_1.default.startTime.toString().split(" GMT")[0]}`,
            fields: [
                {
                    name: `Hosted on`,
                    value: process.env.MODE === "server"
                        ? "Server"
                        : "Local instance",
                },
                { name: `Owner`, value: config_1.owner.username },
                { name: `Developers`, value: `${config_1.devs.length} contributors` },
                {
                    name: `Servers`,
                    value: `Handling ${Guild_1.default.size} servers`,
                },
                { name: `Users`, value: `Handling ${User_1.default.size} users` },
            ],
            inline: true,
        };
        if (blacklist.length) {
            options.fields.push({
                name: `Blacklist`,
                value: `${blacklist.length} troublemakers`,
            });
        }
        if (process.env.DEBUG === "true") {
            options.footer = { text: `Debug mode active` };
        }
        await Salty_1.default.embed(msg, options);
    }
}
exports.default = StateCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvZ2VuZXJhbC9zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUcrQjtBQUMvQixnRUFBd0M7QUFDeEMsZ0VBQTBEO0FBQzFELDhEQUFzQztBQUN0Qyx5Q0FBcUQ7QUFFckQsTUFBTSxZQUFhLFNBQVEsaUJBQU87SUFBbEM7O1FBQ1csU0FBSSxHQUFHLE9BQU8sQ0FBQztRQUNmLFNBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEMsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLG9DQUFvQzthQUMvQztTQUNKLENBQUM7UUFDSyxlQUFVLEdBQXFCLEtBQUssQ0FBQztJQXVDaEQsQ0FBQztJQXJDRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFpQjtRQUMvQixNQUFNLFNBQVMsR0FBRyxjQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0QsTUFBTSxPQUFPLEdBQWlCO1lBQzFCLEtBQUssRUFBRSxXQUFXO1lBQ2xCLEdBQUcsRUFBRSxpQkFBUTtZQUNiLFdBQVcsRUFBRSxtQkFDVCxlQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQzlDLEVBQUU7WUFDRixNQUFNLEVBQUU7Z0JBQ0o7b0JBQ0ksSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLEtBQUssRUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxRQUFRO3dCQUN6QixDQUFDLENBQUMsUUFBUTt3QkFDVixDQUFDLENBQUMsZ0JBQWdCO2lCQUM3QjtnQkFDRCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGNBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ3hDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsR0FBRyxhQUFJLENBQUMsTUFBTSxlQUFlLEVBQUU7Z0JBQzVEO29CQUNJLElBQUksRUFBRSxTQUFTO29CQUNmLEtBQUssRUFBRSxZQUFZLGVBQUssQ0FBQyxJQUFJLFVBQVU7aUJBQzFDO2dCQUNELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsWUFBWSxjQUFJLENBQUMsSUFBSSxRQUFRLEVBQUU7YUFDMUQ7WUFDRCxNQUFNLEVBQUUsSUFBSTtTQUNmLENBQUM7UUFDRixJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDbEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLElBQUksRUFBRSxXQUFXO2dCQUNqQixLQUFLLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxnQkFBZ0I7YUFDN0MsQ0FBQyxDQUFDO1NBQ047UUFDRCxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLE1BQU0sRUFBRTtZQUM5QixPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLENBQUM7U0FDbEQ7UUFDRCxNQUFNLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FDSjtBQUVELGtCQUFlLFlBQVksQ0FBQyJ9