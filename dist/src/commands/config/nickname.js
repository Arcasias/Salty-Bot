"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const PromiseManager_1 = __importDefault(require("../../classes/PromiseManager"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const list_1 = require("../../list");
async function changeNames(msg, transformation) {
    const members = msg.guild.members.array();
    const progressMsg = await Salty_1.default.message(msg, `changing nicknames: 0/${members.length}`);
    const pm = new PromiseManager_1.default();
    for (let i = 0; i < members.length; i++) {
        const newNick = transformation(members[i].nickname ? members[i].nickname : members[i].user.username);
        if (newNick !== members[i].nickname) {
            try {
                await members[i].setNickname(newNick);
                pm.add(progressMsg.edit.bind(progressMsg, `changing nicknames: ${i++}/${members.length}`));
            }
            catch (err) {
                if (err.name !== "DiscordAPIError" ||
                    err.message !== "Missing Permissions") {
                    throw err;
                }
            }
        }
        else {
            pm.add(progressMsg.edit.bind(progressMsg, `changing nicknames: ${i++}/${members.length}`));
        }
    }
    pm.add(progressMsg.delete.bind(progressMsg));
    Salty_1.default.success(msg, "nicknames successfully changed");
}
class NickNameCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "nickname";
        this.keys = ["name", "nick", "pseudo"];
        this.help = [
            {
                argument: null,
                effect: null,
            },
            {
                argument: "add ***particle***",
                effect: "Appends the ***particle*** to every possible nickname in the server. Careful to not exceed 32 characters!",
            },
            {
                argument: "remove ***particle***",
                effect: "Removes the ***particle*** from each matching nickname",
            },
        ];
        this.visibility = "admin";
    }
    async action({ msg, args }) {
        const particle = args.slice(1).join(" ");
        const particleRegex = new RegExp(particle, "g");
        if (!args[0]) {
            throw new Exception_1.MissingArg("add or delete + particle");
        }
        else {
            if (!particle) {
                throw new Exception_1.MissingArg("nickname particle");
            }
            if (list_1.add.includes(args[0])) {
                await changeNames.call(this, msg, (nickname) => nickname.match(particleRegex)
                    ? nickname
                    : `${nickname.trim()} ${particle}`);
            }
            else if (list_1.remove.includes(args[0])) {
                await changeNames.call(this, msg, (nickname) => nickname.replace(particleRegex, "").trim());
            }
            else {
                throw new Exception_1.MissingArg("add or delete + particle");
            }
        }
    }
}
exports.default = NickNameCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmlja25hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL25pY2tuYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esb0VBQWtFO0FBQ2xFLHVEQUFxRDtBQUNyRCxrRkFBMEQ7QUFDMUQsZ0VBQXdDO0FBQ3hDLHFDQUFrRTtBQUVsRSxLQUFLLFVBQVUsV0FBVyxDQUFDLEdBQUcsRUFBRSxjQUFjO0lBQzFDLE1BQU0sT0FBTyxHQUFrQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6RCxNQUFNLFdBQVcsR0FBWSxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQzVDLEdBQUcsRUFDSCx5QkFBeUIsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUM1QyxDQUFDO0lBQ0YsTUFBTSxFQUFFLEdBQW1CLElBQUksd0JBQWMsRUFBRSxDQUFDO0lBQ2hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FDMUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQ3ZFLENBQUM7UUFDRixJQUFJLE9BQU8sS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ2pDLElBQUk7Z0JBQ0EsTUFBTSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QyxFQUFFLENBQUMsR0FBRyxDQUNGLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNqQixXQUFXLEVBQ1gsdUJBQXVC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