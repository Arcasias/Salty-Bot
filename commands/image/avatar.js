'use strict';

const Command = require('../../classes/Command');
const fs = require("fs");
const path = require("path");
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'avatar',
    keys: [
        "avatar",
        "pic",
        "picture",
        "pp",
    ],
    help: [
        {
            argument: null,
            effect: "Shows a bigger version of your profile picture"
        },
        {
            argument: "***mention***",
            effect: "Shows a bigger version of ***mention***'s profile picture"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {

        // Sets author as default user and adapt color to his/her role
        const mention = msg.mentions.users.first();
        const askedUser = mention ? mention : msg.author;

        let name = mention ? msg.mentions.members.first().displayName : msg.member.displayName;
        let color  = mention ? msg.mentions.members.first().highestRole.color : msg.member.highestRole.color;
        let desc = "This is a huge piece of shit";

        // If there is someone in the mention list, sets that user as new default then generates random color for the swag
        if (askedUser.bot) {
            desc = "That's just a crappy bot";         // bot
        } else if (askedUser.id == S.config.owner.id) {
            desc = "He's the coolest guy i know ^-^";  // owner
        } else if (S.isAdmin(askedUser, msg.guild)) {
            desc = "It's a cute piece of shit";        // admin    
        }

        // Creates embed message
        const options = { title: `this is ${UTIL.possessive(name)} profile pic` };

        if (askedUser.id == S.bot.user.id) { // if Salty
            const files = fs.readdirSync("assets/img/salty");
            const pics = files.filter(f => f.split(".").pop() === "png");
            options.title = `how cute, you asked for my profile pic ^-^`;
            options.file = path.join("assets/img/salty/", UTIL.choice(pics));
        } else { 
            options.image = askedUser.avatarURL;
            options.color = parseInt(color);
            options.description = desc;
        }
        await S.embed(msg, options);
    },
});

