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
exports.default = new Command_1.default({
    name: "imgur",
    keys: ["img", "imgur"],
    help: [
        {
            argument: null,
            effect: "Work in progress",
        },
    ],
    visibility: "public",
    async action(msg, args) {
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
    },
});
