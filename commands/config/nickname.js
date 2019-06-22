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
    action: async (msg, args) => {

        let members = msg.guild.members.array();
        let promises = [];
        let progressMsg;

        if (args[0] && S.getList('add').includes(args[0])) {

            args.shift();

            if (! args[0]) throw new error.MissingArg("nickname particle");

            await S.msg(msg, `changing nicknames: 0/${ members.length }`).then(message => {

                progressMsg = message;

                for (let i = 0; i < members.length; i ++) {

                    let newNick = members[i].nickname ? members[i].nickname: members[i].user.username;

                    newNick = newNick.trim() + " " + args.join(" ");

                    promises.push(members[i].setNickname(newNick).then(() => {

                        message.edit(`changing nicknames: ${ i + 1 }/${ members.length }`);

                    }).catch(error => {

                        return true
                    }));
                }
            });

            Promise.all(promises).then(() => {

                progressMsg.delete().then(() => {

                    S.embed(msg, { title: "nicknames successfully changed", type: 'success' });
                });
            });

        } else if (args[0] && S.getList('delete').includes(args[0])) {

            args.shift();

            if (! args[0]) throw new error.MissingArg("nickname particle");
            
            await S.msg(msg, `changing nicknames: 0/${ members.length }`).then(message => {
                
                progressMsg = message;

                for (let i = 0; i < members.length; i ++) {

                    let newNick = members[i].nickname ? members[i].nickname: members[i].user.username;

                    newNick = newNick.replace(new RegExp(args.join(" "), 'g'), "").trim();

                    if (newNick != members[i].nickname) {

                        promises.push(members[i].setNickname(newNick).then(() => {

                            message.edit(`changing nicknames: ${ i + 1 }/${ members.length }`);

                        }).catch(error => {

                            return true
                        }));
                    
                    } else {

                        message.edit(`changing nicknames: ${ i + 1 }/${ members.length }`);
                    }
                }
            });

            Promise.all(promises).then(() => {

                progressMsg.delete().then(() => {

                    S.embed(msg, { title: "nicknames successfully changed", type: 'success' });
                });
            });

        } else {

            throw new error.MissingArg("add or delete + particle")
        }
    },
});

