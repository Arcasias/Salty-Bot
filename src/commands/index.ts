import Command from "../classes/Command";
import {
    AvailableCategories,
    CommandCategoryDoc,
    CommandCategoryInfo,
} from "../types";
import { debug } from "../utils";
import config from "./config";
import general from "./general";
import image from "./image";
import misc from "./misc";
import text from "./text";

const categories: { [key in AvailableCategories]: any } = {
    config,
    text,
    general,
    image,
    misc,
};

for (const category in categories) {
    const categoryDoc: CommandCategoryDoc =
        categories[<AvailableCategories>category];
    const categoryInfo: CommandCategoryInfo = Object.assign({}, categoryDoc, {
        commands: Object.keys(categoryDoc),
    });
    Command.categories.set(category, categoryInfo);
    const { name, commands } = categoryInfo;
    debug(`Category "${name}": ${commands.length} commands loaded.`);
}
