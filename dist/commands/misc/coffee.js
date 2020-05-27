"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
Command_1.default.register({
    name: "coffee",
    keys: ["cof", "covfefe"],
    help: [
        {
            argument: null,
            effect: "Gets you a nice hot coffee",
        },
        {
            argument: "***mention***",
            effect: "Gets the ***mention*** a nice hot coffee",
        },
    ],
    channel: "guild",
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
                options.description = `Made with ♥ by **${msg.member.displayName}** for **${target.name}**`;
            }
        }
        await Salty_1.default.embed(msg, options);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29mZmVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL21pc2MvY29mZmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUd4QyxpQkFBTyxDQUFDLFFBQVEsQ0FBQztJQUNiLElBQUksRUFBRSxRQUFRO0lBQ2QsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQztJQUN4QixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLDRCQUE0QjtTQUN2QztRQUNEO1lBQ0ksUUFBUSxFQUFFLGVBQWU7WUFDekIsTUFBTSxFQUFFLDBDQUEwQztTQUNyRDtLQUNKO0lBQ0QsT0FBTyxFQUFFLE9BQU87SUFFaEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUU7UUFDeEIsTUFBTSxPQUFPLEdBQXNCO1lBQy9CLEtBQUssRUFBRSx1QkFBdUI7WUFDOUIsV0FBVyxFQUFFLDJCQUEyQjtZQUN4QyxLQUFLLEVBQUU7Z0JBQ0gsR0FBRyxFQUNDLHdGQUF3RjthQUMvRjtZQUNELEtBQUssRUFBRSxRQUFRO1NBQ2xCLENBQUM7UUFDRixJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsb0NBQW9DLENBQUM7YUFDOUQ7aUJBQU07Z0JBQ0gsT0FBTyxDQUFDLFdBQVcsR0FBRyxvQkFDbEIsR0FBRyxDQUFDLE1BQU8sQ0FBQyxXQUNoQixZQUFZLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQzthQUMvQjtTQUNKO1FBQ0QsTUFBTSxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIn0=