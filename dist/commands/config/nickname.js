"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
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
Command_1.default.register({
    name: "nickname",
    keys: ["name", "nick", "pseudo"],
    help: [
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
    ],
    access: "admin",
    channel: "guild",
    async action({ args, msg }) {
        const particle = args.slice(1).join(" ");
        const particleRegex = new RegExp(particle, "g");
        if (terms_1.add.includes(args[0])) {
            await changeNames.call(this, msg, (nickname) => nickname.match(particleRegex)
                ? nickname
                : `${nickname.trim()} ${particle}`);
        }
        else if (terms_1.remove.includes(args[0])) {
            await changeNames.call(this, msg, (nickname) => nickname.replace(particleRegex, "").trim());
        }
        else if (args.length) {
            return Salty_1.default.warn(msg, "You need to specify what nickname particle will be targeted.");
        }
        else {
            return Salty_1.default.warn(msg, "You need to tell whether to add or delete a global nickname particle.");
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmlja25hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL25pY2tuYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esb0VBQTRDO0FBQzVDLGtGQUEwRDtBQUMxRCxnRUFBd0M7QUFDeEMsdUNBQW1FO0FBRW5FLEtBQUssVUFBVSxXQUFXLENBQ3RCLEdBQVksRUFDWixjQUE0QztJQUU1QyxNQUFNLE9BQU8sR0FBa0IsR0FBRyxDQUFDLEtBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2hFLE1BQU0sV0FBVyxHQUFZLE1BQU0sZUFBSyxDQUFDLE9BQU8sQ0FDNUMsR0FBRyxFQUNILHlCQUF5QixPQUFPLENBQUMsTUFBTSxFQUFFLENBQzVDLENBQUM7SUFDRixNQUFNLEVBQUUsR0FBbUIsSUFBSSx3QkFBYyxFQUFFLENBQUM7SUFDaEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDckMsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN2RCxJQUFJLE9BQU8sS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ2pDLElBQUk7Z0JBQ0EsTUFBTSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QyxFQUFFLENBQUMsR0FBRyxDQUNGLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDL0IsT0FBTyxFQUFFLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO2lCQUMxRCxDQUFDLENBQ0wsQ0FBQzthQUNMO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1Ys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