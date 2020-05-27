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
const SALTY_IMAGES_PATH = "assets/img/salty";
Command_1.default.register({
    name: "avatar",
    keys: ["pic", "picture", "pp"],
    help: [
        {
            argument: null,
            effect: "Shows a bigger version of your profile picture",
        },
        {
            argument: "***mention***",
            effect: "Shows a bigger version of ***mention***'s profile picture",
        },
    ],
    async action({ msg, target }) {
        var _a;
        const options = {
            title: `this is ${utils_1.possessive(target.name)} profile pic`,
            color: (_a = target.member) === null || _a === void 0 ? void 0 : _a.displayColor,
        };
        if (target.user.id === Salty_1.default.bot.user.id) {
            const files = fs_1.default.readdirSync(SALTY_IMAGES_PATH);
            const pics = files.filter((f) => f.split(".").pop() === "png");
            options.title = `This is a picture of me. `;
            options.files = [path_1.default.join(SALTY_IMAGES_PATH, utils_1.choice(pics))];
        }
        else {
            if (target.user.bot) {
                options.description = "That's just a crappy bot";
            }
            else if (utils_1.isOwner(target.user)) {
                options.description = "He's the coolest guy i know ^-^";
            }
            else if (msg.guild && utils_1.isAdmin(target.user, msg.guild)) {
                options.description = "It's a cute piece of shit";
            }
            else {
                options.description = "This is a huge piece of shit";
            }
            const url = target.user.avatarURL({ size: 1024 });
            if (url) {
                options.image = { url };
            }
        }
        await Salty_1.default.embed(msg, options);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2ltYWdlL2F2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRDQUFvQjtBQUNwQixnREFBd0I7QUFDeEIsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUV4Qyx1Q0FBbUU7QUFFbkUsTUFBTSxpQkFBaUIsR0FBRyxrQkFBa0IsQ0FBQztBQUU3QyxpQkFBTyxDQUFDLFFBQVEsQ0FBQztJQUNiLElBQUksRUFBRSxRQUFRO0lBQ2QsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUM7SUFDOUIsSUFBSSxFQUFFO1FBQ0Y7WUFDSSxRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxnREFBZ0Q7U0FDM0Q7UUFDRDtZQUNJLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLE1BQU0sRUFBRSwyREFBMkQ7U0FDdEU7S0FDSjtJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFOztRQUN4QixNQUFNLE9BQU8sR0FBc0I7WUFDL0IsS0FBSyxFQUFFLFdBQVcsa0JBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWM7WUFDdkQsS0FBSyxRQUFFLE1BQU0sQ0FBQyxNQUFNLDBDQUFFLFlBQVk7U0FDckMsQ0FBQztRQUNGLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsRUFBRSxFQUFFO1lBRXZDLE1BQU0sS0FBSyxHQUFHLFlBQUUsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNoRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEtBQUssQ0FBQyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxLQUFLLEdBQUcsMkJBQTJCLENBQUM7WUFDNUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsY0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoRTthQUFNO1lBQ0gsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDakIsT0FBTyxDQUFDLFdBQVcsR0FBRywwQkFBMEIsQ0FBQzthQUNwRDtpQkFBTSxJQUFJLGVBQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzdCLE9BQU8sQ0FBQyxXQUFXLEdBQUcsaUNBQWlDLENBQUM7YUFDM0Q7aUJBQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxJQUFJLGVBQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDckQsT0FBTyxDQUFDLFdBQVcsR0FBRywyQkFBMkIsQ0FBQzthQUNyRDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsV0FBVyxHQUFHLDhCQUE4QixDQUFDO2FBQ3hEO1lBQ0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNsRCxJQUFJLEdBQUcsRUFBRTtnQkFDTCxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7YUFDM0I7U0FDSjtRQUNELE1BQU0sZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9