"use strict";

const Command = require("../../classes/Command.js");
const error = require("../../classes/Exception.js");
const Salty = require("../../classes/Salty.js");
const User = require("../../classes/User.js");

module.exports = new Command({
    name: "todo",
    keys: ["todos"],
    help: [
        {
            argument: null,
            effect: "Shows your todo list",
        },
        {
            argument: "***something to do***",
            effect: "Adds something to your todo list",
        },
    ],
    visibility: "public",
    async action(msg, args) {
        let user = User.get(msg.author.id);

        if (args[0] && Salty.getList("delete").includes(args[0])) {
            let todoList = user.todo;

            if (0 === todoList.length) {
                throw new error.SaltyException("your todo list is empty");
            }
            if (!args[1] || !todoList[parseInt(args[1]) - 1]) {
                throw new error.OutOfRange(args[1]);
            }
            user.todo.splice(parseInt(args[1]) - 1, 1);

            Salty.success(
                msg,
                `item number **${args[1]}** removed from your todo list`
            );
        } else if (args[0] && Salty.getList("delete").includes(args[0])) {
            user.todo = [];
            Salty.message(msg, "your todo list has been cleared");
        } else {
            if (
                (args[0] && Salty.getList("list").includes(args[0])) ||
                !args[0]
            ) {
                if (0 === user.todo.length) {
                    throw new error.EmptyObject("your todo list");
                }
                Salty.embed(msg, {
                    title: "<author>'s todo list",
                    description: `> ${user.todo.join("\n> ")}`,
                });
            } else {
                user.todo.push(args.join(" "));
                Salty.message(
                    msg,
                    `I added "**${args.join(" ")}**" to your todo list`
                );
            }
        }
    },
});
