"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const emojiPath = "./assets/img/saltmoji";
Command_1.default.register({
    name: "emoji",
    keys: ["emojis", "saltmoji", "saltmojis"],
    help: [
        {
            argument: null,
            effect: "Shows my emojis list",
        },
        {
            argument: "***emoji name***",
            effect: "Sends the indicated emoji",
        },
    ],
    async action({ args, msg }) {
        const files = await new Promise((res, rej) => {
            fs_1.readdir(emojiPath, (err, files) => {
                if (err) {
                    rej(err);
                }
                res(files);
            });
        });
        const pngs = files.filter((file) => file.split(".").pop() === "png");
        const emojiNames = pngs.map((name) => name.split(".").shift());
        if (args[0]) {
            const arg = args[0].toLowerCase();
            let emoji = null;
            if (["rand", "random"].includes(arg)) {
                emoji = utils_1.choice(emojiNames);
            }
            else if (emojiNames.includes(arg)) {
                emoji = arg;
            }
            if (emoji) {
                msg.delete();
                return Salty_1.default.message(msg, "", {
                    files: [`${emojiPath}/${emoji}.png`],
                });
            }
        }
        Salty_1.default.embed(msg, {
            title: "list of saltmojis",
            description: emojiNames.join("\n"),
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbWlzYy9lbW9qaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJCQUE2QjtBQUM3QixvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHVDQUFxQztBQUVyQyxNQUFNLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztBQUUxQyxpQkFBTyxDQUFDLFFBQVEsQ0FBQztJQUNiLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUM7SUFDekMsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxzQkFBc0I7U0FDakM7UUFDRDtZQUNJLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsTUFBTSxFQUFFLDJCQUEyQjtTQUN0QztLQUNKO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7UUFDdEIsTUFBTSxLQUFLLEdBQWEsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUNuRCxZQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUM5QixJQUFJLEdBQUcsRUFBRTtvQkFDTCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ1o7Z0JBQ0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUM7UUFDckUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUcsQ0FBQyxDQUFDO1FBRWhFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1QsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xDLElBQUksS0FBSyxHQUFrQixJQUFJLENBQUM7WUFFaEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xDLEtBQUssR0FBRyxjQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDOUI7aUJBQU0sSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNqQyxLQUFLLEdBQUcsR0FBRyxDQUFDO2FBQ2Y7WUFDRCxJQUFJLEtBQUssRUFBRTtnQkFDUCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2IsT0FBTyxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUU7b0JBQzFCLEtBQUssRUFBRSxDQUFDLEdBQUcsU0FBUyxJQUFJLEtBQUssTUFBTSxDQUFDO2lCQUN2QyxDQUFDLENBQUM7YUFDTjtTQUNKO1FBQ0QsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDYixLQUFLLEVBQUUsbUJBQW1CO1lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUNyQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0osQ0FBQyxDQUFDIn0=