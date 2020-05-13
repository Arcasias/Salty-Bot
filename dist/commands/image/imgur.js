"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imgur_1 = __importDefault(require("imgur"));
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
imgur_1.default.setClientId();
imgur_1.default.setAPIUrl("https://api.imgur.com/3/");
class ImgurCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "imgur";
        this.keys = ["img", "imgur"];
        this.help = [
            {
                argument: null,
                effect: "Work in progress",
            },
        ];
    }
    async action({ args, msg }) {
        if (!args[0]) {
            throw new Exception_1.MissingArg("image name");
        }
        try {
            const json = await imgur_1.default.search(args.join("AND"), {
                sort: "top",
                dateRange: "all",
                page: 1,
            });
            if (json.data.length < 1) {
                throw new Exception_1.SaltyException("no result");
            }
            const { title, link, images } = utils_1.choice(json.data);
            const image = images ? images[0].link : link;
            Salty_1.default.embed(msg, { title, url: link, image });
        }
        catch (err) {
            Salty_1.default.error(msg, "no result");
        }
    }
}
exports.default = ImgurCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1ndXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvaW1hZ2UvaW1ndXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsb0VBQStEO0FBQy9ELHVEQUFxRTtBQUNyRSxnRUFBd0M7QUFDeEMsdUNBQXFDO0FBRXJDLGVBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNwQixlQUFLLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFNUMsTUFBTSxZQUFhLFNBQVEsaUJBQU87SUFBbEM7O1FBQ1csU0FBSSxHQUFHLE9BQU8sQ0FBQztRQUNmLFNBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4QixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsa0JBQWtCO2FBQzdCO1NBQ0osQ0FBQztJQXVCTixDQUFDO0lBckJHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsTUFBTSxJQUFJLHNCQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDdEM7UUFFRCxJQUFJO1lBQ0EsTUFBTSxJQUFJLEdBQUcsTUFBTSxlQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzlDLElBQUksRUFBRSxLQUFLO2dCQUNYLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixJQUFJLEVBQUUsQ0FBQzthQUNWLENBQUMsQ0FBQztZQUNILElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN0QixNQUFNLElBQUksMEJBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUN6QztZQUNELE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLGNBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDN0MsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ2pEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztTQUNqQztJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLFlBQVksQ0FBQyJ9