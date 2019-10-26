import Command from '../../classes/Command.js';
import Fish from '../../classes/Fish.js';
import * as error from '../../classes/Exception.js';
import User from '../../classes/User.js';

export default new Command({
    name: 'fish',
    keys: [
        "fishes",
        "fishing",
    ],
    help: [
        {
            argument: null,
            effect: "Hook, line and sinker !"
        },
    ],
    visibility: 'public',
    async action(msg, args) {
        let authorId = msg.author.id;
        let angler = User.get(msg.author.id);

        if (this.fishing[authorId]) {
            throw new error.SaltyException(`you're already fishing for ${ Math.floor((Date.now() - this.fishing[authorId].time) / 1000) } seconds`);
        }
        let fishingTime = UTIL.randRange(items[angler.equipped.rod].time);
        let options = {
            title: UTIL.choice(this.getList('fishingStart')),
            description: UTIL.choice(this.getList('fishingStartDescription')),
            color: 0x284680,
            react: UTIL.choice(this.getList('fishes')),
        };
        this.fishing[authorId] = {
            rod: items[angler.equipped.rod],
            time: Date.now(),
            bait: null,
            msg: null,
        };
        this.embed(msg, options).then(fishMsg => {

            this.fishing[authorId].msg = fishMsg;

            setTimeout(() => {
                let rod = this.fishing[authorId].rod;
                let bait = this.fishing[authorId].bait;
                let time = fishingTime / 1000;
                let quality, fish;

                this.fishing[authorId].msg.delete(() => {
                    delete this.fishing[authorId];
                }).catch(err => {
                    LOG.error(err);
                });
                // Not Junk
                if (UTIL.generate(15 + 10 * angler.rank)) {
                    if (bait) {
                        let fishPool = Object.keys(creatures).filter(creature => creatures[creature].bait == bait);
                        fish = new Fish(UTIL.choice(fishPool));
                        quality = fish.quality;
                    } else {
                        quality = UTIL.randStat(rod.pool);

                        let fishPool = Object.keys(creatures).filter(creature => creatures[creature].quality == quality);

                        if ('forgotten' === quality) angler.inventory.push("00270001");

                        fish = new Fish(UTIL.choice(fishPool));
                    }
                // Junk
                } else {
                    quality = 'junk';
                    let fishPool = Object.keys(creatures).filter(creature => creatures[creature].quality == quality);

                    fish = new Fish(UTIL.choice(fishPool));
                }
                let qualityProps = this.config.quality[quality];
                let xp = qualityProps.xp;
                let gold = Math.ceil(fish.weight || 1 * fish.value || 0);

                angler.xp += xp;
                angler.gold += gold;
                angler.fishingTime += time;
                angler.fishCount ++;

                if (angler.bestFish) {
                    let bestFishRank = this.config.quality[angler.bestFish.quality].rank;
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
                this.embed(msg, options);

                let currentRank = angler.rank;
                let newRank = this.getXpInfos(authorId).rank;

                if (currentRank < newRank) {
                    angler.rank = newRank;
                    let rank = this.config.rank[newRank];
                    let rankProps = this.config.quality[rank.quality];
                    let options = {
                        title: "RANK UP !",
                        color: rankProps.color,
                        description: `Congratulations ! You're now a ${ rank.name } !`,
                        react: '⏫',
                    };
                    this.embed(msg, options);
                }
            }, fishingTime);
        });
    },
});

