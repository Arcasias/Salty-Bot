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
    async action({ args, msg }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbWlzYy9lbW9qaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJCQUE2QjtBQUM3QixvRUFBK0Q7QUFDL0QsZ0VBQXdDO0FBQ3hDLHVDQUFnRDtBQUVoRCxNQUFNLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztBQUUxQyxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMzQyxTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsc0JBQXNCO2FBQ2pDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsTUFBTSxFQUFFLDJCQUEyQjthQUN0QztTQUNKLENBQUM7SUE0Qk4sQ0FBQztJQTFCRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBaUI7UUFDckMsTUFBTSxLQUFLLEdBQWEsTUFBTSxpQkFBUyxDQUFDLFlBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDdkUsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQztRQUNyRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFL0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDVCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEMsSUFBSSxLQUFLLEdBQWtCLElBQUksQ0FBQztZQUVoQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbEMsS0FBSyxHQUFHLGNBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUM5QjtpQkFBTSxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pDLEtBQUssR0FBRyxHQUFHLENBQUM7YUFDZjtZQUNELElBQUksS0FBSyxFQUFFO2dCQUNQLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDYixPQUFPLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRTtvQkFDMUIsS0FBSyxFQUFFLENBQUMsR0FBRyxTQUFTLElBQUksS0FBSyxNQUFNLENBQUM7aUJBQ3ZDLENBQUMsQ0FBQzthQUNOO1NBQ0o7UUFDRCxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNiLEtBQUssRUFBRSxtQkFBbUI7WUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ3JDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQUVELGtCQUFlLFlBQVksQ0FBQyJ9