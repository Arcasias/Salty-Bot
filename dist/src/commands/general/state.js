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
        this.keys = ["git", "instance", "local", "server"];
        this.help = [
            {
                argument: null,
                effect: "Gets you some information about me",
            },
        ];
        this.visibility = "dev";
    }
    async action({ msg }) {
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
                {
                    name: `Servers`,
                    value: `Running on ${Guild_1.default.size} servers`,
                },
                { name: `Users`, value: `Handling ${User_1.default.size} users` },
                {
                    name: `Developers`,
                    value: `${config_1.devs.length} contributors`,
                },
                {
                    name: `Blacklist`,
                    value: `${User_1.default.filter((u) => u.black_listed).length} troublemakers`,
                },
            ],
            inline: true,
        };
        if (process.env.DEBUG === "true") {
            options.footer = { text: `Debug mode active` };
        }
        await Salty_1.default.embed(msg, options);
    }
}
exports.default = StateCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvZ2VuZXJhbC9zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUFrRTtBQUNsRSxnRUFBd0M7QUFDeEMsZ0VBQTBEO0FBQzFELDhEQUFzQztBQUN0Qyx5Q0FBcUQ7QUFFckQsTUFBTSxZQUFhLFNBQVEsaUJBQU87SUFBbEM7O1FBQ1csU0FBSSxHQUFHLE9BQU8sQ0FBQztRQUNmLFNBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxvQ0FBb0M7YUFDL0M7U0FDSixDQUFDO1FBQ0ssZUFBVSxHQUFxQixLQUFLLENBQUM7SUF5Q2hELENBQUM7SUF2Q0csS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRTtRQUNoQixNQUFNLE9BQU8sR0FBaUI7WUFDMUIsS0FBSyxFQUFFLFdBQVc7WUFDbEIsR0FBRyxFQUFFLGlCQUFRO1lBQ2IsV0FBVyxFQUFFLG1CQUNULGVBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FDOUMsRUFBRTtZQUNGLE1BQU0sRUFBRTtnQkFDSjtvQkFDSSxJQUFJLEVBQUUsV0FBVztvQkFDakIsS0FBSyxFQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVE7d0JBQ3pCLENBQUMsQ0FBQyxRQUFRO3dCQUNWLENBQUMsQ0FBQyxnQkFBZ0I7aUJBQzdCO2dCQUNELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsY0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDeEM7b0JBQ0ksSUFBSSxFQUFFLFNBQVM7b0JBQ2YsS0FBSyxFQUFFLGNBQWMsZUFBSyxDQUFDLElBQUksVUFBVTtpQkFDNUM7Z0JBQ0QsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxZQUFZLGNBQUksQ0FBQyxJQUFJLFFBQVEsRUFBRTtnQkFDdkQ7b0JBQ0ksSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLEtBQUssRUFBRSxHQUFHLGFBQUksQ0FBQyxNQUFNLGVBQWU7aUJBQ3ZDO2dCQUNEO29CQUNJLElBQUksRUFBRSxXQUFXO29CQUNqQixLQUFLLEVBQUUsR0FDSCxjQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsTUFDN0MsZ0JBQWdCO2lCQUNuQjthQUNKO1lBQ0QsTUFBTSxFQUFFLElBQUk7U0FDZixDQUFDO1FBQ0YsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxNQUFNLEVBQUU7WUFDOUIsT0FBTyxDQUFDLE1BQU0sR0FBRyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxDQUFDO1NBQ2xEO1FBQ0QsTUFBTSxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxZQUFZLENBQUMifQ==