import Command from "../classes/Command";
import { CommandCategoryDoc, CommandCategoryInfo } from "../types";
import { debug } from "../utils";
import config from "./config";
import discord from "./discord";
import general from "./general";
import image from "./image";
import misc from "./misc";
import music from "./music";

const categories: { [category: string]: any } = {
    config,
    discord,
    general,
    image,
    misc,
    music,
};

for (const category in categories) {
    const categoryDoc: CommandCategoryDoc = categories[category];
    const categoryInfo: CommandCategoryInfo = Object.assign({}, categoryDoc, {
        commands: Object.keys(categoryDoc),
    });
    Command.categories.set(category, categoryInfo);
    const { name, commands } = categoryInfo;
    debug(`Category "${name}": ${commands.length} commands loaded.`);
}
