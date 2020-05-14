"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const config_1 = require("../../config");
class AvatarCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "avatar";
        this.keys = ["pic", "picture", "pp"];
        this.help = [
            {
                argument: null,
                effect: "Shows a bigger version of your profile picture",
            },
            {
                argument: "***mention***",
                effect: "Shows a bigger version of ***mention***'s profile picture",
            },
        ];
    }
    async action({ msg, target }) {
        const options = {
            title: `this is ${utils_1.possessive(target.member.displayName)} profile pic`,
            color: target.member.displayColor,
        };
        if (target.user.id === Salty_1.default.bot.user.id) {
            const files = fs_1.default.readdirSync("assets/img/salty");
            const pics = files.filter((f) => f.split(".").pop() === "png");
            options.title = `how cute, you asked for my profile pic ^-^`;
            options.files = [path_1.default.join("assets/img/salty/", utils_1.choice(pics))];
        }
        else {
            if (target.user.bot) {
                options.description = "That's just a crappy bot";
            }
            else if (target.user.id === config_1.owner.id) {
                options.description = "He's the coolest guy i know ^-^";
            }
            else if (Salty_1.default.isAdmin(target.user, msg.guild)) {
                options.description = "It's a cute piece of shit";
            }
            else {
                options.description = "This is a huge piece of shit";
            }
            options.image = { url: target.user.avatarURL({ size: 1024 }) };
        }
        await Salty_1.default.embed(msg, options);
    }
}
exports.default = AvatarCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2ltYWdlL2F2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRDQUFvQjtBQUNwQixnREFBd0I7QUFDeEIsb0VBQStEO0FBQy9ELGdFQUEwRDtBQUMxRCx1Q0FBaUQ7QUFDakQseUNBQXFDO0FBRXJDLE1BQU0sYUFBYyxTQUFRLGlCQUFPO0lBQW5DOztRQUNXLFNBQUksR0FBRyxRQUFRLENBQUM7UUFDaEIsU0FBSSxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoQyxTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsZ0RBQWdEO2FBQzNEO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLE1BQU0sRUFBRSwyREFBMkQ7YUFDdEU7U0FDSixDQUFDO0lBNkJOLENBQUM7SUEzQkcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQWlCO1FBQ3ZDLE1BQU0sT0FBTyxHQUFpQjtZQUMxQixLQUFLLEVBQUUsV0FBVyxrQkFBVSxDQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FDNUIsY0FBYztZQUNmLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVk7U0FDcEMsQ0FBQztRQUNGLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsRUFBRSxFQUFFO1lBRXZDLE1BQU0sS0FBSyxHQUFHLFlBQUUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNqRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEtBQUssQ0FBQyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxLQUFLLEdBQUcsNENBQTRDLENBQUM7WUFDN0QsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsY0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsRTthQUFNO1lBQ0gsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDakIsT0FBTyxDQUFDLFdBQVcsR0FBRywwQkFBMEIsQ0FBQzthQUNwRDtpQkFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLGNBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsaUNBQWlDLENBQUM7YUFDM0Q7aUJBQU0sSUFBSSxlQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM5QyxPQUFPLENBQUMsV0FBVyxHQUFHLDJCQUEyQixDQUFDO2FBQ3JEO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxXQUFXLEdBQUcsOEJBQThCLENBQUM7YUFDeEQ7WUFDRCxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNsRTtRQUNELE1BQU0sZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztDQUNKO0FBRUQsa0JBQWUsYUFBYSxDQUFDIn0=