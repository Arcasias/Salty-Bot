'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');
const User = require('../../classes/User');

module.exports = new Command({
    name: 'todo',
    keys: [
        "todo",
    ],
    help: [
        {
            argument: null,
            effect: "Shows your todo list"
        },
        {
            argument: "***something to do***",
            effect: "Adds something to your todo list"
        },
    ],
    visibility: 'public', 
    action: function (msg, args) {
        let user = User.get(msg.author.id);

        if (args[0] && S.getList('delete').includes(args[0])) {
            let todoList = user.todo;

            if (0 === todoList.length) {
                throw new error.SaltyException("your todo list is empty");
            }
            if (! args[1] || ! todoList[parseInt(args[1]) - 1]) {
                throw new error.OutOfRange(args[1]);
            }
            user.todo.splice(parseInt(args[1]) - 1, 1);

            S.embed(msg, { title: `item number **${ args[1] }** removed from your todo list`, type: 'success' });

        } else if (args[0] && S.getList('delete').includes(args[0])) {
            user.todo = [];
            S.msg(msg, "your todo list has been cleared");

        } else {
            if (args[0] && S.getList('list').includes(args[0]) || ! args[0]) {
                if (0 === user.todo.length) {
                    throw new error.EmptyObject("your todo list");
                }
                S.embed(msg, { title: "<author>'s todo list", description: `> ${ user.todo.join("\n> ") }` });
            
            } else {
                user.todo.push(args.join(" "));
                S.msg(msg, `I added "**${ args.join(" ") }**" to your todo list`);
            }
        }
    },
});

