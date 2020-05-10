'use strict';

const Command = require('../../classes/Command.js');
const { MessageEmbed } = require('discord.js');
const error = require('../../classes/Exception.js');
const Salty = require('../../classes/Salty.js');

module.exports = new Command({
    name: 'embed',
    keys: [
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
    async action(msg, args) {
        let parsed;
        try {
            parsed = JSON.parse(args.join(" "));
        } catch (error) {
            throw new error.IncorrectValue("JSON", "json formatted string");
        }
        if (0 === Object.keys(parsed).length) {
            throw new error.MissingArg("JSON");
        }
        await Salty.message(msg, null, { embed: new MessageEmbed(parsed) });
    },
});
