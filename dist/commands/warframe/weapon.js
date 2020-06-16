"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const warframe_items_1 = __importDefault(require("warframe-items"));
const Command_1 = __importDefault(require("../../classes/Command"));
const salty_1 = __importDefault(require("../../salty"));
const utils_1 = require("../../utils");
const SEARCH_LIMIT = 5;
const weapons = new warframe_items_1.default({
    category: ["Primary", "Secondary", "Melee"],
});
const weaponMapping = {};
const weaponNames = [];
for (const weapon of weapons) {
    const name = utils_1.clean(weapon.name);
    weaponMapping[name] = weapon;
    weaponNames.push(name);
}
function displayCapacity({ ammo, magazineSize, fireRate, range }) {
    const rate = Number(fireRate).toFixed(1);
    if (ammo) {
        return `${magazineSize}/${ammo} (${rate} shots/s)`;
    }
    else {
        return `${Number(range).toFixed(1)}m (${rate} hits/s)`;
    }
}
function displayCritical({ criticalChance, criticalMultiplier }) {
    const critMult = Number(criticalMultiplier).toFixed(1);
    const critChance = (Number(criticalChance) * 100).toFixed(1);
    return `${critChance}% - ${critMult}x`;
}
function displayDamage({ damage, multishot }) {
    const shots = multishot && multishot !== 1 ? ` / ${multishot}` : "";
    return `${damage}${shots}`;
}
function displayStatus({ procChance, damageTypes }) {
    const statusChance = (Number(procChance) * 100).toFixed(1);
    const dmgTypes = Object.assign({}, damageTypes);
    const totalDmgTypes = Object.values(dmgTypes).reduce((acc, t) => acc + t, 0);
    for (const type in dmgTypes) {
        const isSmaller = Object.values(dmgTypes).some((t) => dmgTypes[type] < t);
        if (isSmaller) {
            delete dmgTypes[type];
        }
    }
    const types = Object.keys(dmgTypes);
    const typeValue = (Object.values(dmgTypes)[0] / totalDmgTypes) * types.length;
    const typesString = types.length
        ? `(${types.join(" / ")} ${Math.round(typeValue * 100)}%)`
        : "";
    return `${statusChance}% ${typesString}`;
}
Command_1.default.register({
    name: "weapon",
    category: "warframe",
    async action({ args, msg, target }) {
        if (args.length) {
            if (utils_1.levenshtein(args[0], "search") < 1) {
                args.shift();
                const query = args.join(" ");
                const results = utils_1.search(weaponNames, query).slice(0, SEARCH_LIMIT);
                const numberReactions = utils_1.getNumberReactions(results.length);
                const mapping = {};
                for (let i = 0; i < results.length; i++) {
                    mapping[numberReactions[i]] = results[i];
                }
                return salty_1.default.embed(msg, {
                    title: `Weapon names matching "${query}":`,
                    description: results
                        .map((r, i) => `${i + 1}) ${weaponMapping[r].name}`)
                        .join("\n"),
                    actions: {
                        reactions: numberReactions,
                        onAdd: ({ emoji }, user, abort) => {
                            if (user === msg.author) {
                                abort();
                                return this.action({
                                    args: [mapping[emoji.name]],
                                    msg,
                                    target,
                                });
                            }
                        },
                    },
                });
            }
            const query = utils_1.clean(args.join(" "));
            if (weaponNames.includes(query)) {
                const weapon = weaponMapping[query];
                const fields = [
                    {
                        name: "Total damage",
                        value: displayDamage(weapon),
                    },
                    {
                        name: "Critical",
                        value: displayCritical(weapon),
                    },
                    {
                        name: "Status",
                        value: displayStatus(weapon),
                    },
                    {
                        name: "Capacity",
                        value: displayCapacity(weapon),
                    },
                ];
                return salty_1.default.embed(msg, {
                    title: weapon.name,
                    description: weapon.description,
                    inline: true,
                    fields,
                    url: weapon.wikiaUrl,
                    thumbnail: { url: weapon.wikiaThumbnail },
                });
            }
            else {
                const results = utils_1.search(weaponNames, query, 5);
                if (results.length) {
                    return salty_1.default.message(msg, `Weapon "${args[0]}" did not match any item. Did you mean "${results.join(`" or "`)}"?`);
                }
                else {
                    return salty_1.default.warn(msg, "That's not even close to a weapon name.");
                }
            }
        }
        return salty_1.default.message(msg, "Oui");
    },
});
