"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "admin",
    keys: ["administrator"],
    channel: "guild",
    help: [
        {
            argument: null,
            effect: "Tells you wether you're an admin",
        },
        {
            argument: "***mention***",
            effect: "Tells you wether the ***mention*** is an admin",
        },
    ],
    async action({ msg, target }) {
        const isRequestedUserAdmin = utils_1.isAdmin(target.user, msg.guild);
        Salty_1.default.message(msg, target.isMention
            ?
                target.user.id === Salty_1.default.bot.user.id
                    ?
                        isRequestedUserAdmin
                            ?
                                "of course I'm an admin ;)"
                            :
                                "nope, I'm not an admin on this server :c"
                    :
                        isRequestedUserAdmin
                            ?
                                "<mention> is a wise and powerful admin"
                            :
                                "<mention> is not an admin"
            :
                isRequestedUserAdmin
                    ?
                        "you have been granted the administrators permissions. May your deeds be blessed forever!"
                    :
                        "nope, you're not an admin");
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL2FkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUN4Qyx1Q0FBc0M7QUFFdEMsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsT0FBTztJQUNiLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQztJQUN2QixPQUFPLEVBQUUsT0FBTztJQUNoQixJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLGtDQUFrQztTQUM3QztRQUNEO1lBQ0ksUUFBUSxFQUFFLGVBQWU7WUFDekIsTUFBTSxFQUFFLGdEQUFnRDtTQUMzRDtLQUNKO0lBQ0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUU7UUFDeEIsTUFBTSxvQkFBb0IsR0FBWSxlQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsS0FBTSxDQUFDLENBQUM7UUFHdkUsZUFBSyxDQUFDLE9BQU8sQ0FDVCxHQUFHLEVBQ0gsTUFBTSxDQUFDLFNBQVM7WUFDWixDQUFDO2dCQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLEVBQUU7b0JBQ25DLENBQUM7d0JBQ0Msb0JBQW9COzRCQUNsQixDQUFDO2dDQUNDLDJCQUEyQjs0QkFDN0IsQ0FBQztnQ0FDQywwQ0FBMEM7b0JBQ2hELENBQUM7d0JBQ0Qsb0JBQW9COzRCQUNwQixDQUFDO2dDQUNDLHdDQUF3Qzs0QkFDMUMsQ0FBQztnQ0FDQywyQkFBMkI7WUFDakMsQ0FBQztnQkFDRCxvQkFBb0I7b0JBQ3BCLENBQUM7d0JBQ0MsMEZBQTBGO29CQUM1RixDQUFDO3dCQUNDLDJCQUEyQixDQUNwQyxDQUFDO0lBQ04sQ0FBQztDQUNKLENBQUMsQ0FBQyJ9