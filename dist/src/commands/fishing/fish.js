import Command from "../../classes/Command.js";
import { SaltyException } from "../../classes/Exception.js";
import Fish from "../../classes/Fish.js";
import Salty from "../../classes/Salty.js";
import User from "../../classes/User.js";
import { choice, error, generate, randRange, randStat } from "../../utils.js";
export default new Command({
    name: "fish",
    keys: ["fishes"],
    help: [
        {
            argument: null,
            effect: "Hook, line and sinker !",
        },
    ],
    visibility: "public",
    async action(msg) {
        let authorId = msg.author.id;
        let angler = User.get(msg.author.id);
        if (Salty.fishing[authorId]) {
            throw new SaltyException(`you're already fishing for ${Math.floor((Date.now() - Salty.fishing[authorId].time) / 1000)} seconds`);
        }
        let fishingTime = randRange(Salty.items[angler.equipped.rod].time);
        let options = {
            title: choice(Salty.getList("fishingStart")),
            description: choice(Salty.getList("fishingStartDescription")),
            color: 0x284680,
            react: choice(Salty.getList("fishes")),
        };
        Salty.fishing[authorId] = {
            rod: Salty.items[angler.equipped.rod],
            time: Date.now(),
            bait: null,
            msg: null,
        };
        Salty.embed(msg, options).then((fishMsg) => {
            Salty.fishing[authorId].msg = fishMsg;
            setTimeout(() => {
                let rod = Salty.fishing[authorId].rod;
                let bait = Salty.fishing[authorId].bait;
                let time = fishingTime / 1000;
                let quality, fish;
                Salty.fishing[authorId].msg
                    .delete(() => {
                    delete Salty.fishing[authorId];
                })
                    .catch((err) => {
                    error(err);
                });
                if (generate(15 + 10 * angler.rank)) {
                    if (bait) {
                        let fishPool = Object.keys(Salty.creatures).filter((creature) => Salty.creatures[creature].bait === bait);
                        fish = new Fish(choice(fishPool));
                        quality = fish.quality;
                    }
                    else {
                        quality = randStat(rod.pool);
                        let fishPool = Object.keys(Salty.creatures).filter((creature) => Salty.creatures[creature].quality === quality);
                        if ("forgotten" === quality) {
                            angler.inventory.push("00270001");
                        }
                        fish = new Fish(choice(fishPool));
                    }
                }
                else {
                    quality = "junk";
                    let fishPool = Object.keys(Salty.creatures).filter((creature) => Salty.creatures[creature].quality === quality);
                    fish = new Fish(choice(fishPool));
                }
                let qualityProps = Salty.config.quality[quality];
                let xp = qualityProps.xp;
                let gold = Math.ceil(fish.weight || 1 * fish.value || 0);
                angler.xp += xp;
                angler.gold += gold;
                angler.fishingTime += time;
                angler.fishCount++;
                if (angler.bestFish) {
                    let bestFishRank = Salty.config.quality[angler.bestFish.quality].rank;
                    if (bestFishRank < qualityProps.rank ||
                        (bestFishRank === qualityProps.rank &&
                            angler.bestFish.weight < fish.weight)) {
                        angler.bestFish = fish;
                    }
                }
                else {
                    angler.bestFish = fish;
                }
                let options = {
                    title: fish.name,
                    description: fish.description,
                    color: qualityProps.color,
                    image: fish.image,
                    fields: [
                        { title: fish.quality, description: `+${xp} xp` },
                        {
                            title: `${fish.weight || "0"} kg`,
                            description: `+${gold} gold`,
                        },
                    ],
                    content: msg.author,
                    inline: true,
                };
                Salty.embed(msg, options);
                let currentRank = angler.rank;
                let newRank = Salty.getXpInfos(authorId).rank;
                if (currentRank < newRank) {
                    angler.rank = newRank;
                    let rank = Salty.config.rank[newRank];
                    let rankProps = Salty.config.quality[rank.quality];
                    let options = {
                        title: "RANK UP !",
                        color: rankProps.color,
                        description: `Congratulations ! You're now a ${rank.name} !`,
                        react: "⏫",
                    };
                    Salty.embed(msg, options);
                }
            }, fishingTime);
        });
    },
});