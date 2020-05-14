"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
class AdminCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "admin";
        this.keys = ["administrator"];
        this.help = [
            {
                argument: null,
                effect: "Tells you wether you're an admin",
            },
            {
                argument: "***mention***",
                effect: "Tells you wether the ***mention*** is an admin",
            },
        ];
        this.channel = "guild";
    }
    async action({ msg, target }) {
        const isRequestedUserAdmin = Salty_1.default.isAdmin(target.user, msg.guild);
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
    }
}
exports.default = AdminCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL2FkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQStFO0FBQy9FLGdFQUF3QztBQUV4QyxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekIsU0FBSSxHQUFHO1lBQ1Y7Z0JBQ0ksUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLGtDQUFrQzthQUM3QztZQUNEO2dCQUNJLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixNQUFNLEVBQUUsZ0RBQWdEO2FBQzNEO1NBQ0osQ0FBQztRQUNLLFlBQU8sR0FBbUIsT0FBTyxDQUFDO0lBa0M3QyxDQUFDO0lBaENHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFpQjtRQUN2QyxNQUFNLG9CQUFvQixHQUFZLGVBQUssQ0FBQyxPQUFPLENBQy9DLE1BQU0sQ0FBQyxJQUFJLEVBQ1gsR0FBRyxDQUFDLEtBQU0sQ0FDYixDQUFDO1FBR0YsZUFBSyxDQUFDLE9BQU8sQ0FDVCxHQUFHLEVBQ0gsTUFBTSxDQUFDLFNBQVM7WUFDWixDQUFDO2dCQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLEVBQUU7b0JBQ25DLENBQUM7d0JBQ0Msb0JBQW9COzRCQUNsQixDQUFDO2dDQUNDLDJCQUEyQjs0QkFDN0IsQ0FBQztnQ0FDQywwQ0FBMEM7b0JBQ2hELENBQUM7d0JBQ0Qsb0JBQW9COzRCQUNwQixDQUFDO2dDQUNDLHdDQUF3Qzs0QkFDMUMsQ0FBQztnQ0FDQywyQkFBMkI7WUFDakMsQ0FBQztnQkFDRCxvQkFBb0I7b0JBQ3BCLENBQUM7d0JBQ0MsMEZBQTBGO29CQUM1RixDQUFDO3dCQUNDLDJCQUEyQixDQUNwQyxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBRUQsa0JBQWUsWUFBWSxDQUFDIn0=