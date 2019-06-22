'use strict';

const Command = require('../../classes/Command');
const Creature = require('../../classes/Creature');
const creatures = require('../../data/creatures.json');
const items = require('../../data/items.json');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');
const User = require('../../classes/User');

module.exports = new Command({
    name: 'fish',
    keys: [
        "fish",
        "fishing",
        "fishes",
    ],
    help: [
        {
            argument: null,
            effect: "Hook, line and sinker !"
        },
    ],
    visibility: 'public', 
    action: function (msg, args) {
        let authorId = msg.author.id;
        let angler = User.get(msg.author.id);

        if (S.fishing[authorId]) {
            throw new error.SaltyException(`you're already fishing for ${ Math.floor((Date.now() - S.fishing[authorId].time) / 1000) } seconds`);
        }
        let fishingTime = UTIL.randRange(items[angler.equipped.rod].time);
        let options = {
            title: UTIL.choice(S.getList('fishingStart')),
            description: UTIL.choice(S.getList('fishingStartDescription')),
            color: 0x284680,
            react: UTIL.choice(S.getList('fishes')),
        };
        S.fishing[authorId] = {
            rod: items[angler.equipped.rod],
            time: Date.now(),
            bait: null,
            msg: null,
        };
        S.embed(msg, options).then(fishMsg => {

            S.fishing[authorId].msg = fishMsg;

            setTimeout(() => {
                let rod = S.fishing[authorId].rod;
                let bait = S.fishing[authorId].bait;
                let time = fishingTime / 1000;
                let quality, fish;

                S.fishing[authorId].msg.delete(() => {
                    delete S.fishing[authorId];
                }).catch(err => {
                    LOG.error(err);
                });
                // Not Junk
                if (UTIL.generate(15 + 10 * angler.rank)) {
                    if (bait) {
                        let fishPool = Object.keys(creatures).filter(creature => creatures[creature].bait == bait);
                        fish = new Creature(UTIL.choice(fishPool));
                        quality = fish.quality;
                    } else {
                        quality = UTIL.randStat(rod.pool);

                        let fishPool = Object.keys(creatures).filter(creature => creatures[creature].quality == quality);

                        if ('forgotten' === quality) angler.inventory.push("00270001");

                        fish = new Creature(UTIL.choice(fishPool));
                    }
                // Junk
                } else {
                    quality = 'junk';
                    let fishPool = Object.keys(creatures).filter(creature => creatures[creature].quality == quality);

                    fish = new Creature(UTIL.choice(fishPool));
                }
                let qualityProps = S.config.quality[quality];
                let xp = qualityProps.xp
                let gold = Math.ceil(fish.weight || 1 * fish.value || 0);

                angler.xp += xp;
                angler.gold += gold;
                angler.fishingTime += time;
                angler.fishCount ++;

                if (angler.bestFish) {
                    let bestFishRank = S.config.quality[angler.bestFish.quality].rank;
                    if (bestFishRank < qualityProps.rank || (bestFishRank == qualityProps.rank && angler.bestFish.weight < fish.weight)) {
                        angler.bestFish = fish;
                    }
                } else {
                    angler.bestFish = fish;
                }
                let options = {
                    title: fish.name,
                    description: fish.description,
                    color: qualityProps.color,
                    image: fish.image,
                    fields: [
                        { title: fish.quality, description: `+${ xp } xp` },
                        { title: `${ fish.weight || "0" } kg`, description: `+${ gold } gold` }
                    ],
                    content: msg.author,
                    inline: true,
                };
                S.embed(msg, options);

                let currentRank = angler.rank;
                let newRank = S.getXpInfos(authorId).rank;

                if (currentRank < newRank) {
                    angler.rank = newRank;
                    let rank = S.config.rank[newRank];
                    let rankProps = S.config.quality[rank.quality];
                    let options = {
                        title: "RANK UP !",
                        color: rankProps.color,
                        description: `Congratulations ! You're now a ${ rank.name } !`,
                        react: '⏫',
                    };
                    S.embed(msg, options);
                }
            }, fishingTime);
        });
    },
});

