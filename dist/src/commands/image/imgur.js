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
    async action({ msg, args }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1ndXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvaW1hZ2UvaW1ndXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsb0VBQTRDO0FBQzVDLHVEQUFxRTtBQUNyRSxnRUFBd0M7QUFDeEMsdUNBQXFDO0FBRXJDLGVBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNwQixlQUFLLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFNUMsTUFBTSxZQUFhLFNBQVEsaUJBQU87SUFBbEM7O1FBQ1csU0FBSSxHQUFHLE9BQU8sQ0FBQztRQUNmLFNBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4QixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsa0JBQWtCO2FBQzdCO1NBQ0osQ0FBQztJQXVCTixDQUFDO0lBckJHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDVixNQUFNLElBQUksc0JBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN0QztRQUVELElBQUk7WUFDQSxNQUFNLElBQUksR0FBRyxNQUFNLGVBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDOUMsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLElBQUksRUFBRSxDQUFDO2FBQ1YsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3RCLE1BQU0sSUFBSSwwQkFBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3pDO1lBQ0QsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsY0FBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM3QyxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDakQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztDQUNKO0FBRUQsa0JBQWUsWUFBWSxDQUFDIn0=