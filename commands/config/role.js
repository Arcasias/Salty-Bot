'use strict';

const Command = require('../../classes/Command');
const Guild = require('../../classes/Guild');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'role',
    keys: [
        "role",
        "roles",
    ],
    help: [
        {
            argument: null,
            effect: "Shows the current default role"
        },
        {
            argument: "set ***new role***",
            effect: "Sets the ***new role*** as the default one. If no existing role matches the name you provided, a new role will be created"
        },
        {
            argument: "unset",
            effect: "Removes the default role"
        },
    ],
    visibility: 'dev', 
    action: function (msg, args) {
        if (args[0] && S.getList('add').includes(args[0])) {
            let { guild } = msg;

            if (! args[1]) {
                throw new error.MissingArg("name of the role");
            }
            args.shift();
            let role = guild.roles.find(r => r.name === args.join(" "));
            if (! role) {
                try {
                    guild.createRole({ name: args.join(" "), color: '#1eff00' }).then(role => {
                        Guild.get(guild.id).defaultRole = role.id;
                        S.embed(msg, { title: `role **${ role.name }** has been successfuly created and set as default role for **${ guild.name }**`, type: 'success' });
                    });
                } catch (error) {
                    throw new error.PermissionDenied("authorized to create new roles", "I");
                }
            } else {
                Guild.get(guild.id).defaultRole = role.id;
                S.embed(msg, { title: `role **${ role.name }** has been successfuly set as default role for **${ guild.name }**`, type: 'success' });
            }
        } else if (args[0] && S.getList('delete').includes(args[0])) {
            let { guild } = msg;
            if (! Guild.get(guild.id).defaultChannel) {
                throw new error.SaltyException("no default role set");
            }
            Guild.get(guild.id).defaultRole = null;
            S.embed(msg, { title: "default role has been successfuly removed", type: 'success' });
        } else {
            let { guild } = msg;
            if (! Guild.get(guild.id).defaultRole) {
                return S.msg(msg, "No default role set");
            } else {
                let role = guild.roles.get(Guild.get(guild.id).defaultRole);
                S.embed(msg, { title: `default role is ${ role.name }`, description: "newcomers will automatically get this role", color: role.color });
            }
        }
    },
});

