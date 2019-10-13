'use strict';

const Command = require('../../classes/Command');
const Discord = require('discord.js');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'embed',
    keys: [
        "embed",
        "embeds",
        "json",
        "parse",
    ],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "***JSON data***",
            effect: "Parses the provided JSON as a Discord embed"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {
        let parsed, embed, populatedEmbed;
        try {
            parsed = JSON.parse(args.join(" "));
        } catch (error) {
            throw new error.IncorrectValue("JSON", "json formatted string");
        }
        if (0 === Object.keys(parsed).length) {
            throw new error.MissingArg("JSON");
        }
        await msg.channel.send({ embed: new Discord.RichEmbed(parsed) });
    },
});

