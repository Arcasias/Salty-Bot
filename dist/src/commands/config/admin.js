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
        this.keys = ["admins", "administrator", "administrators"];
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
    }
    async action({ msg, target }) {
        const isRequestedUserAdmin = Salty_1.default.isAdmin(target.user, msg.guild);
        await Salty_1.default.message(msg, target.isMention
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL2FkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLGdFQUF3QztBQUV4QyxNQUFNLFlBQWEsU0FBUSxpQkFBTztJQUFsQzs7UUFDVyxTQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2YsU0FBSSxHQUFHLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3JELFNBQUksR0FBRztZQUNWO2dCQUNJLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxrQ0FBa0M7YUFDN0M7WUFDRDtnQkFDSSxRQUFRLEVBQUUsZUFBZTtnQkFDekIsTUFBTSxFQUFFLGdEQUFnRDthQUMzRDtTQUNKLENBQUM7SUFrQ04sQ0FBQztJQWhDRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRTtRQUN4QixNQUFNLG9CQUFvQixHQUFZLGVBQUssQ0FBQyxPQUFPLENBQy9DLE1BQU0sQ0FBQyxJQUFJLEVBQ1gsR0FBRyxDQUFDLEtBQUssQ0FDWixDQUFDO1FBR0YsTUFBTSxlQUFLLENBQUMsT0FBTyxDQUNmLEdBQUcsRUFDSCxNQUFNLENBQUMsU0FBUztZQUNaLENBQUM7Z0JBQ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDbEMsQ0FBQzt3QkFDQyxvQkFBb0I7NEJBQ2xCLENBQUM7Z0NBQ0MsMkJBQTJCOzRCQUM3QixDQUFDO2dDQUNDLDBDQUEwQztvQkFDaEQsQ0FBQzt3QkFDRCxvQkFBb0I7NEJBQ3BCLENBQUM7Z0NBQ0Msd0NBQXdDOzRCQUMxQyxDQUFDO2dDQUNDLDJCQUEyQjtZQUNqQyxDQUFDO2dCQUNELG9CQUFvQjtvQkFDcEIsQ0FBQzt3QkFDQywwRkFBMEY7b0JBQzVGLENBQUM7d0JBQ0MsMkJBQTJCLENBQ3BDLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFFRCxrQkFBZSxZQUFZLENBQUMifQ==