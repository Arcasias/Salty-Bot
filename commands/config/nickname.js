'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'nickname',
    keys: [
        "nickname",
        "nick",
        "name",
    ],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "add ***particle***",
            effect: "Appends the ***particle*** to every possible nickname in the server. Careful to not exceed 32 characters !"
        },
        {
            argument: "remove ***particle***",
            effect: "Removes the ***particle*** from each matching nickname"
        },
    ],
    visibility: 'admin', 
    action: async function (msg, args) {
        const members = msg.guild.members.array();
        const particle = args.slice(1).join(" ");
        const particleRegex = new RegExp(particles);

        if (!args[0]) {
            throw new error.MissingArg("add or delete + particle");
        }
        if (!particle) {
            throw new error.MissingArg("nickname particle");
        }

        if (S.getList('add').includes(args[0])) {
            await changeNames(nickname => nickname.match(particleRegex) ? nickname : `${nickname.trim()} ${particle}`);
        } else if (S.getList('delete').includes(args[0])) {
            await changeNames(nickname => nickname.replace(particleRegex, "").trim());
        }

        async function changeNames(transformation) {
            const progressMsg = await S.msg(msg, `changing nicknames: 0/${members.length}`);
            for (let i = 0; i < members.length; i ++) {
                const newNick = transformation(members[i].nickname ? members[i].nickname : members[i].user.username);
                if (newNick != members[i].nickname) {
                    try {
                        await members[i].setNickname(newNick);
                        await progressMsg.edit(`changing nicknames: ${i + 1}/${members.length}`);
                    } catch (err) {
                        LOG.error(err);
                    }
                } else {
                    await progressMsg.edit(`changing nicknames: ${i + 1}/${members.length}`);
                }
            }
            await progressMsg.delete();
            await S.embed(msg, { title: "nicknames successfully changed", type: 'success' });
        }
    },
});

