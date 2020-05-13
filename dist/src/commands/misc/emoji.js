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
class EmojiCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "emoji";
        this.keys = ["emojis", "saltmoji", "saltmojis"];
        this.help = [
            {
                argument: null,
                effect: "Shows my emojis list",
            },
            {
                argument: "***emoji name***",
                effect: "Sends the indicated emoji",
            },
        ];
    }
    async action({ msg, args }) {
        const files = await utils_1.promisify(fs_1.readdir.bind(null, emojiPath));
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
    }
}
exports.default = EmojiCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvbWlzYy9lbW9qaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJCQUE2QjtBQUM3QixvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLHVDQUFnRDtBQUVoRCxNQUFNLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztBQUUxQyxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMzQyxTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsc0JBQXNCO2FBQ2pDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsTUFBTSxFQUFFLDJCQUEyQjthQUN0QztTQUNKLENBQUM7SUE0Qk4sQ0FBQztJQTFCRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtRQUN0QixNQUFNLEtBQUssR0FBYSxNQUFNLGlCQUFTLENBQUMsWUFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN2RSxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUUvRCxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNULE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQyxJQUFJLEtBQUssR0FBa0IsSUFBSSxDQUFDO1lBRWhDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNsQyxLQUFLLEdBQUcsY0FBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzlCO2lCQUFNLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDakMsS0FBSyxHQUFHLEdBQUcsQ0FBQzthQUNmO1lBQ0QsSUFBSSxLQUFLLEVBQUU7Z0JBQ1AsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNiLE9BQU8sZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFO29CQUMxQixLQUFLLEVBQUUsQ0FBQyxHQUFHLFNBQVMsSUFBSSxLQUFLLE1BQU0sQ0FBQztpQkFDdkMsQ0FBQyxDQUFDO2FBQ047U0FDSjtRQUNELGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ2IsS0FBSyxFQUFFLG1CQUFtQjtZQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDckMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBRUQsa0JBQWUsWUFBWSxDQUFDIn0=