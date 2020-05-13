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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2ltYWdlL2F2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRDQUFvQjtBQUNwQixnREFBd0I7QUFDeEIsb0VBQTRDO0FBQzVDLGdFQUEwRDtBQUMxRCx1Q0FBaUQ7QUFDakQseUNBQXFDO0FBRXJDLE1BQU0sYUFBYyxTQUFRLGlCQUFPO0lBQW5DOztRQUNXLFNBQUksR0FBRyxRQUFRLENBQUM7UUFDaEIsU0FBSSxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoQyxTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsZ0RBQWdEO2FBQzNEO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLE1BQU0sRUFBRSwyREFBMkQ7YUFDdEU7U0FDSixDQUFDO0lBNkJOLENBQUM7SUEzQkcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUU7UUFDeEIsTUFBTSxPQUFPLEdBQWlCO1lBQzFCLEtBQUssRUFBRSxXQUFXLGtCQUFVLENBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUM1QixjQUFjO1lBQ2YsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWTtTQUNwQyxDQUFDO1FBQ0YsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFFdEMsTUFBTSxLQUFLLEdBQUcsWUFBRSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUM7WUFDL0QsT0FBTyxDQUFDLEtBQUssR0FBRyw0Q0FBNEMsQ0FBQztZQUM3RCxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxjQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xFO2FBQU07WUFDSCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNqQixPQUFPLENBQUMsV0FBVyxHQUFHLDBCQUEwQixDQUFDO2FBQ3BEO2lCQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssY0FBSyxDQUFDLEVBQUUsRUFBRTtnQkFDcEMsT0FBTyxDQUFDLFdBQVcsR0FBRyxpQ0FBaUMsQ0FBQzthQUMzRDtpQkFBTSxJQUFJLGVBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzlDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsMkJBQTJCLENBQUM7YUFDckQ7aUJBQU07Z0JBQ0gsT0FBTyxDQUFDLFdBQVcsR0FBRyw4QkFBOEIsQ0FBQzthQUN4RDtZQUNELE9BQU8sQ0FBQyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ2xFO1FBQ0QsTUFBTSxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxhQUFhLENBQUMifQ==