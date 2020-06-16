import { EmbedFieldData } from "discord.js";
import Items, { DamageTypes } from "warframe-items";
import Command from "../../classes/Command";
import salty from "../../salty";
import { Dictionnary, Weapon } from "../../types";
import { clean, getNumberReactions, levenshtein, search } from "../../utils";

const SEARCH_LIMIT = 5;

const weapons: Weapon[] = new Items({
    category: ["Primary", "Secondary", "Melee"],
});
const weaponMapping: Dictionnary<Weapon> = {};
const weaponNames: string[] = [];
for (const weapon of weapons) {
    const name = clean(weapon.name);
    weaponMapping[name] = weapon;
    weaponNames.push(name);
}

function displayCapacity({ ammo, magazineSize, fireRate, range }: Weapon) {
    const rate = Number(fireRate).toFixed(1);
    if (ammo) {
        return `${magazineSize}/${ammo} (${rate} shots/s)`;
    } else {
        return `${Number(range).toFixed(1)}m (${rate} hits/s)`;
    }
}

function displayCritical({ criticalChance, criticalMultiplier }: Weapon) {
    const critMult = Number(criticalMultiplier).toFixed(1);
    const critChance = (Number(criticalChance) * 100).toFixed(1);
    return `${critChance}% - ${critMult}x`;
}

function displayDamage({ damage, multishot }: Weapon) {
    const shots = multishot && multishot !== 1 ? ` / ${multishot}` : "";
    return `${damage}${shots}`;
}

function displayStatus({ procChance, damageTypes }: Weapon) {
    const statusChance = (Number(procChance) * 100).toFixed(1);
    const dmgTypes: DamageTypes = Object.assign({}, damageTypes);
    const totalDmgTypes = Object.values(dmgTypes).reduce(
        (acc, t) => acc + t,
        0
    );
    for (const type in dmgTypes) {
        const isSmaller = Object.values(dmgTypes).some(
            (t) => dmgTypes[<keyof DamageTypes>type]! < t
        );
        if (isSmaller) {
            delete dmgTypes[<keyof DamageTypes>type];
        }
    }
    const types = Object.keys(dmgTypes);
    const typeValue =
        (Object.values(dmgTypes)[0] / totalDmgTypes) * types.length;
    const typesString = types.length
        ? `(${types.join(" / ")} ${Math.round(typeValue * 100)}%)`
        : "";
    return `${statusChance}% ${typesString}`;
}

Command.register({
    name: "weapon",
    category: "warframe",
    async action({ args, msg, target }) {
        if (args.length) {
            if (levenshtein(args[0], "search") < 1) {
                args.shift();
                const query = args.join(" ");
                const results = search(weaponNames, query).slice(
                    0,
                    SEARCH_LIMIT
                );
                const numberReactions = getNumberReactions(results.length);
                const mapping: Dictionnary<string> = {};
                for (let i = 0; i < results.length; i++) {
                    mapping[numberReactions[i]] = results[i];
                }
                return salty.embed(msg, {
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
            const query = clean(args.join(" "));
            if (weaponNames.includes(query)) {
                const weapon = weaponMapping[query];
                const fields: EmbedFieldData[] = [
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
                return salty.embed(msg, {
                    title: weapon.name,
                    description: weapon.description,
                    inline: true,
                    fields,
                    url: weapon.wikiaUrl,
                    thumbnail: { url: weapon.wikiaThumbnail },
                });
            } else {
                const results = search(weaponNames, query, 5);
                if (results.length) {
                    return salty.message(
                        msg,
                        `Weapon "${
                            args[0]
                        }" did not match any item. Did you mean "${results.join(
                            `" or "`
                        )}"?`
                    );
                } else {
                    return salty.warn(
                        msg,
                        "That's not even close to a weapon name."
                    );
                }
            }
        }
        return salty.message(msg, "Oui");
    },
});
