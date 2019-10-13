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
    action: async function (msg, args) {
        const { guild } = msg;
        const guildDBId = Guild.get(guild.id).id;

        if (args[0] && S.getList('add').includes(args[0])) {
            if (!args[1]) {
                throw new error.MissingArg("new role");
            }
            let role = msg.mentions.roles.first();
            const roleName = args.slice(1).join(" ");
            if (!role) {
                role = guild.roles.find(r => r.name === roleName);
            }
            if (!role) {
                try {
                    role = await guild.createRole({ name: roleName, color: '#1eff00' });
                    await Guild.update(guildDBId, { default_role: role.id });
                    await S.embed(msg, { title: `role **${role.name}** has been successfuly created and set as default role for **${guild.name}**`, type: 'success' });
                } catch (error) {
                    throw new error.PermissionDenied("authorized to create new roles", "I");
                }
            } else {
                await Guild.update(guildDBId, { default_role: role.id });
                await S.embed(msg, { title: `role **${ role.name }** has been successfuly set as default role for **${guild.name}**`, type: 'success' });
            }
        } else if (args[0] && S.getList('delete').includes(args[0])) {
            if (!Guild.get(guild.id).default_channel) {
                throw new error.SaltyException("no default role set");
            }
            await Guild.update(guildDBId, { default_role: null });
            await S.embed(msg, { title: "default role has been successfuly removed", type: 'success' });
        } else {
            if (!Guild.get(guild.id).default_role) {
                return S.msg(msg, "No default role set");
            } else {
                const role = guild.roles.get(Guild.get(guild.id).default_role);
                S.embed(msg, { title: `default role is ${ role.name }`, description: "newcomers will automatically get this role", color: role.color });
            }
        }
    },
});

