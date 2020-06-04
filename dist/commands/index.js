"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../classes/Command"));
const utils_1 = require("../utils");
const config_1 = __importDefault(require("./config"));
const general_1 = __importDefault(require("./general"));
const image_1 = __importDefault(require("./image"));
const misc_1 = __importDefault(require("./misc"));
const music_1 = __importDefault(require("./music"));
const text_1 = __importDefault(require("./text"));
const warframe_1 = __importDefault(require("./warframe"));
const categories = {
    config: config_1.default,
    text: text_1.default,
    general: general_1.default,
    image: image_1.default,
    misc: misc_1.default,
    music: music_1.default,
    warframe: warframe_1.default,
};
for (const category in categories) {
    const categoryDoc = categories[category];
    const categoryInfo = Object.assign({}, categoryDoc, {
        commands: Object.keys(categoryDoc),
    });
    Command_1.default.categories.set(category, categoryInfo);
    const { name, commands } = categoryInfo;
    utils_1.debug(`Category "${name}": ${commands.length} commands loaded.`);
}
