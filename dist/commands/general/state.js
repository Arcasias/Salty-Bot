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
Command_1.default.register({
    name: "state",
    keys: ["git", "local", "server"],
    help: [
        {
            argument: null,
            effect: "Gets you some information about me",
        },
    ],
    access: "dev",
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
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvZ2VuZXJhbC9zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQUM1QyxnRUFBd0M7QUFDeEMsZ0VBQXdDO0FBQ3hDLDhEQUFzQztBQUN0Qyx5Q0FBcUQ7QUFHckQsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsT0FBTztJQUNiLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDO0lBQ2hDLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsb0NBQW9DO1NBQy9DO0tBQ0o7SUFDRCxNQUFNLEVBQUUsS0FBSztJQUViLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFDaEIsTUFBTSxTQUFTLEdBQUcsY0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNELE1BQU0sT0FBTyxHQUFzQjtZQUMvQixLQUFLLEVBQUUsV0FBVztZQUNsQixHQUFHLEVBQUUsaUJBQVE7WUFDYixXQUFXLEVBQUUsbUJBQ1QsZUFBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUM5QyxFQUFFO1lBQ0YsTUFBTSxFQUFFO2dCQUNKO29CQUNJLElBQUksRUFBRSxXQUFXO29CQUNqQixLQUFLLEVBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssUUFBUTt3QkFDekIsQ0FBQyxDQUFDLFFBQVE7d0JBQ1YsQ0FBQyxDQUFDLGdCQUFnQjtpQkFDN0I7Z0JBQ0QsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxjQUFLLENBQUMsUUFBUSxFQUFFO2dCQUN4QyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEdBQUcsYUFBSSxDQUFDLE1BQU0sZUFBZSxFQUFFO2dCQUM1RDtvQkFDSSxJQUFJLEVBQUUsU0FBUztvQkFDZixLQUFLLEVBQUUsWUFBWSxlQUFLLENBQUMsSUFBSSxVQUFVO2lCQUMxQztnQkFDRCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFlBQVksY0FBSSxDQUFDLElBQUksUUFBUSxFQUFFO2FBQzFEO1lBQ0QsTUFBTSxFQUFFLElBQUk7U0FDZixDQUFDO1FBQ0YsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQ2xCLE9BQU8sQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNqQixJQUFJLEVBQUUsV0FBVztnQkFDakIsS0FBSyxFQUFFLEdBQUcsU0FBUyxDQUFDLE1BQU0sZ0JBQWdCO2FBQzdDLENBQUMsQ0FBQztTQUNOO1FBQ0QsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxNQUFNLEVBQUU7WUFDOUIsT0FBTyxDQUFDLE1BQU0sR0FBRyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxDQUFDO1NBQ2xEO1FBQ0QsTUFBTSxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIn0=