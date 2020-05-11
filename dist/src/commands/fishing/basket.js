import Command from "../../classes/Command.js";
import { SaltyException } from "../../classes/Exception.js";
import Salty from "../../classes/Salty.js";
import User from "../../classes/User.js";
import { formatDuration } from "../../utils.js";
export default new Command({
    name: "basket",
    keys: ["bucket", "stats", "statistics"],
    help: [
        {
            argument: null,
            effect: "Shows the content of your basket",
        },
        {
            argument: "***mention***",
            effect: "Shows the content of ***mention***'s basket",
        },
    ],
    visibility: "public",
    async action(msg) {
        let mention = msg.mentions.users.first();
        let reqUserId = null;
        let title = "";
        if (mention) {
            if (mention.id === Salty.bot.user.id) {
                throw new SaltyException("I don't have a basket. Fishes are friends, not food !");
            }
            title = "<mention>'s stats";
            reqUserId = mention.id;
        }
        else {
            title = "<author>'s stats";
            reqUserId = msg.author.id;
        }
        let userStats = User.get(reqUserId);
        let options = {
            title: title,
            color: Salty.config.quality[Salty.config.rank[userStats.rank].quality]
                .color,
            fields: [
                {
                    title: `Rank ${userStats.rank}: ${Salty.config.rank[userStats.rank].name}`,
                    description: `current XP: ${Math.floor(Salty.getXpInfos(reqUserId).xp)}/${Salty.config.rank[userStats.rank].xp}`,
                },
                {
                    title: "fish count: " + userStats.fishCount,
                    description: userStats.fishCount < 20
                        ? "that's not much"
                        : "that's a lot of fishes !",
                },
                {
                    title: "time spent fishing",
                    description: formatDuration(userStats.fishingTime),
                },
            ],
            inline: true,
        };
        if (userStats.bestFish) {
            let bestFish = Salty.creatures[userStats.bestFish.id];
            options.fields.push({
                title: `best fish: ${bestFish.name}`,
                description: "weight: " + userStats.bestFish.weight,
            });
            options.image = bestFish.image;
        }
        await Salty.embed(msg, options);
    },
});
