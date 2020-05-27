"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
Command_1.default.register({
    name: "role",
    help: [
        {
            argument: null,
            effect: "Shows the current default role",
        },
        {
            argument: "set ***new role***",
            effect: "Sets the ***new role*** as the default one. If no existing role matches the name you provided, a new role will be created",
        },
        {
            argument: "unset",
            effect: "Removes the default role",
        },
    ],
    access: "dev",
    channel: "guild",
    async action({ args, msg }) {
        const guild = msg.guild;
        const dbGuild = Guild_1.default.get(guild.id);
        if (args[0] && terms_1.add.includes(args[0])) {
            if (!args[1]) {
                return Salty_1.default.warn(msg, "You need to specify the name of the new role");
            }
            let role = msg.mentions.roles.first();
            const roleName = args.slice(1).join(" ");
            if (!role) {
                role = guild.roles.cache.find((r) => r.name === roleName);
            }
            if (!role) {
                try {
                    role = await guild.roles.create({
                        data: {
                            name: roleName,
                            color: "#1eff00",
                        },
                        reason: `Created by ${msg.author.username}`,
                    });
                    await Guild_1.default.update(dbGuild.id, { default_role: role.id });
                    await Salty_1.default.success(msg, `role **${role.name}** has been successfuly created and set as default role for **${guild.name}**`);
                }
                catch (error) {
                    return Salty_1.default.warn(msg, "I'm not allowed to create new roles.");
                }
            }
            else {
                await Guild_1.default.update(dbGuild.id, { default_role: role.id });
                await Salty_1.default.success(msg, `role **${role.name}** has been successfuly set as default role for **${guild.name}**`);
            }
        }
        else if (args[0] && terms_1.remove.includes(args[0])) {
            if (!dbGuild.default_channel) {
                return Salty_1.default.warn(msg, "No default role set.");
            }
            await Guild_1.default.update(dbGuild.id, { default_role: null });
            await Salty_1.default.success(msg, "default role has been successfuly removed");
        }
        else {
            if (!dbGuild.default_role) {
                return Salty_1.default.message(msg, "No default role set");
            }
            else {
                const role = guild.roles.cache.get(dbGuild.default_role);
                Salty_1.default.embed(msg, {
                    title: `default role is ${role === null || role === void 0 ? void 0 : role.name}`,
                    description: "newcomers will automatically get this role",
                    color: role === null || role === void 0 ? void 0 : role.color,
                });
            }
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9kaXNjb3JkL3JvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLGdFQUF3QztBQUN4Qyx1Q0FBMEM7QUFFMUMsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsZ0NBQWdDO1NBQzNDO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLE1BQU0sRUFDRiwySEFBMkg7U0FDbEk7UUFDRDtZQUNJLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLE1BQU0sRUFBRSwwQkFBMEI7U0FDckM7S0FDSjtJQUNELE1BQU0sRUFBRSxLQUFLO0lBQ2IsT0FBTyxFQUFFLE9BQU87SUFFaEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7UUFDdEIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQU0sQ0FBQztRQUN6QixNQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUUsQ0FBQztRQUVyQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1YsT0FBTyxlQUFLLENBQUMsSUFBSSxDQUNiLEdBQUcsRUFDSCw4Q0FBOEMsQ0FDakQsQ0FBQzthQUNMO1lBQ0QsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FB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