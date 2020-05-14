"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const PromiseManager_1 = __importDefault(require("../../classes/PromiseManager"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
async function changeNames(msg, transformation) {
    const members = msg.guild.members.cache.array();
    const progressMsg = await Salty_1.default.message(msg, `changing nicknames: 0/${members.length}`);
    const pm = new PromiseManager_1.default();
    for (let i = 0; i < members.length; i++) {
        const newNick = transformation(members[i].displayName);
        if (newNick !== members[i].nickname) {
            try {
                await members[i].setNickname(newNick);
                pm.add(progressMsg.edit.bind(progressMsg, {
                    content: `changing nicknames: ${i++}/${members.length}`,
                }));
            }
            catch (err) {
                if (err.name !== "DiscordAPIError" ||
                    err.message !== "Missing Permissions") {
                    throw err;
                }
            }
        }
        else {
            pm.add(progressMsg.edit.bind(progressMsg, {
                content: `changing nicknames: ${i++}/${members.length}`,
            }));
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
        this.access = "admin";
        this.channel = "guild";
    }
    async action({ args, msg }) {
        const particle = args.slice(1).join(" ");
        const particleRegex = new RegExp(particle, "g");
        if (!args.length) {
            throw new Exception_1.MissingArg("add or delete + particle");
        }
        else {
            if (!particle) {
                throw new Exception_1.MissingArg("nickname particle");
            }
            if (terms_1.add.includes(args[0])) {
                await changeNames.call(this, msg, (nickname) => nickname.match(particleRegex)
                    ? nickname
                    : `${nickname.trim()} ${particle}`);
            }
            else if (terms_1.remove.includes(args[0])) {
                await changeNames.call(this, msg, (nickname) => nickname.replace(particleRegex, "").trim());
            }
            else {
                throw new Exception_1.MissingArg("add or delete + particle");
            }
        }
    }
}
exports.default = NickNameCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmlja25hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL25pY2tuYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esb0VBSStCO0FBQy9CLHVEQUFxRDtBQUNyRCxrRkFBMEQ7QUFDMUQsZ0VBQXdDO0FBQ3hDLHVDQUFtRTtBQUVuRSxLQUFLLFVBQVUsV0FBVyxDQUN0QixHQUFZLEVBQ1osY0FBNEM7SUFFNUMsTUFBTSxPQUFPLEdBQWtCLEdBQUcsQ0FBQyxLQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNoRSxNQUFNLFdBQVcsR0FBWSxNQUFNLGVBQUssQ0FBQyxPQUFPLENBQzVDLEdBQUcsRUFDSCx5QkFBeUIsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUM1QyxDQUFDO0lBQ0YsTUFBTSxFQUFFLEdBQW1CLElBQUksd0JBQWMsRUFBRSxDQUFDO0lBQ2hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkQsSUFBSSxPQUFPLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtZQUNqQyxJQUFJO2dCQUNBLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdEMsRUFBRSxDQUFDLEdBQUcsQ0FDRixXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQy9CLE9BQU8sRUFBRSx1QkFBdUIsQ0FBQyxFQUFFLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtpQkFDMUQsQ0FBQyxDQUNMLENBQUM7YUFDTDtZQUFDLE9BQU8sR0FB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