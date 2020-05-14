"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
class CoffeeCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "coffee";
        this.keys = ["cof", "covfefe"];
        this.help = [
            {
                argument: null,
                effect: "Gets you a nice hot coffee",
            },
            {
                argument: "***mention***",
                effect: "Gets the ***mention*** a nice hot coffee",
            },
        ];
    }
    async action({ msg, target }) {
        const options = {
            title: "this is a nice coffee",
            description: "specially made for you ;)",
            image: {
                url: "https://cdn.cnn.com/cnnnext/dam/assets/150929101049-black-coffee-stock-super-tease.jpg",
            },
            color: 0x523415,
        };
        if (target.isMention) {
            if (target.user.id === Salty_1.default.bot.user.id) {
                options.description = "how cute, you gave me a coffee ^-^";
            }
            else {
                options.description = `Made with ♥ by **${msg.member.displayName}** for **${target.member.displayName}**`;
            }
        }
        await Salty_1.default.embed(msg, options);
    }
}
exports.default = CoffeeCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29mZmVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvY29mZmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQStEO0FBQy9ELGdFQUEwRDtBQUUxRCxNQUFNLGFBQWMsU0FBUSxpQkFBTztJQUFuQzs7UUFDVyxTQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ2hCLFNBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxQixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsNEJBQTRCO2FBQ3ZDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLE1BQU0sRUFBRSwwQ0FBMEM7YUFDckQ7U0FDSixDQUFDO0lBcUJOLENBQUM7SUFuQkcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQWlCO1FBQ3ZDLE1BQU0sT0FBTyxHQUFpQjtZQUMxQixLQUFLLEVBQUUsdUJBQXVCO1lBQzlCLFdBQVcsRUFBRSwyQkFBMkI7WUFDeEMsS0FBSyxFQUFFO2dCQUNILEdBQUcsRUFDQyx3RkFBd0Y7YUFDL0Y7WUFDRCxLQUFLLEVBQUUsUUFBUTtTQUNsQixDQUFDO1FBQ0YsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsRUFBRSxFQUFFO2dCQUN2QyxPQUFPLENBQUMsV0FBVyxHQUFHLG9DQUFvQyxDQUFDO2FBQzlEO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxXQUFXLEdBQUcsb0JBQW9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxZQUFZLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUM7YUFDN0c7U0FDSjtRQUNELE1BQU0sZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztDQUNKO0FBRUQsa0JBQWUsYUFBYSxDQUFDIn0=