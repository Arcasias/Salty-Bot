import Command from "../../classes/Command";
import { MissingArg, PermissionDenied, SaltyException, } from "../../classes/Exception";
import Guild from "../../classes/Guild";
import Salty from "../../classes/Salty";
export default new Command({
    name: "role",
    keys: ["role"],
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
    visibility: "dev",
    async action(msg, args) {
        const { guild } = msg;
        const guildDBId = Guild.get(guild.id).id;
        if (args[0] && Salty.getList("add").includes(args[0])) {
            if (!args[1]) {
                throw new MissingArg("new role");
            }
            let role = msg.mentions.roles.first();
            const roleName = args.slice(1).join(" ");
            if (!role) {
                role = guild.roles.find((r) => r.name === roleName);
            }
            if (!role) {
                try {
                    role = await guild.createRole({
                        name: roleName,
                        color: "#1eff00",
                    });
                    await Guild.update(guildDBId, { default_role: role.id });
                    await Salty.success(msg, `role **${role.name}** has been successfuly created and set as default role for **${guild.name}**`);
                }
                catch (error) {
                    throw new PermissionDenied("authorized to create new roles", "I");
                }
            }
            else {
                await Guild.update(guildDBId, { default_role: role.id });
                await Salty.success(msg, `role **${role.name}** has been successfuly set as default role for **${guild.name}**`);
            }
        }
        else if (args[0] && Salty.getList("delete").includes(args[0])) {
            if (!Guild.get(guild.id).default_channel) {
                throw new SaltyException("no default role set");
            }
            await Guild.update(guildDBId, { default_role: null });
            await Salty.success(msg, "default role has been successfuly removed");
        }
        else {
            if (!Guild.get(guild.id).default_role) {
                return Salty.message(msg, "No default role set");
            }
            else {
                const role = guild.roles.get(Guild.get(guild.id).default_role);
                Salty.embed(msg, {
                    title: `default role is ${role.name}`,
                    description: "newcomers will automatically get this role",
                    color: role.color,
                });
            }
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9kaXNjb3JkL3JvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxPQUFPLE1BQU0sdUJBQXVCLENBQUM7QUFDNUMsT0FBTyxFQUNILFVBQVUsRUFDVixnQkFBZ0IsRUFDaEIsY0FBYyxHQUNqQixNQUFNLHlCQUF5QixDQUFDO0FBQ2pDLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBQ3hDLE9BQU8sS0FBSyxNQUFNLHFCQUFxQixDQUFDO0FBRXhDLGVBQWUsSUFBSSxPQUFPLENBQUM7SUFDdkIsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDZCxJQUFJLEVBQUU7UUFDRjtZQUNJLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLGdDQUFnQztTQUMzQztRQUNEO1lBQ0ksUUFBUSxFQUFFLG9CQUFvQjtZQUM5QixNQUFNLEVBQ0YsMkhBQTJIO1NBQ2xJO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsT0FBTztZQUNqQixNQUFNLEVBQUUsMEJBQTBCO1NBQ3JDO0tBQ0o7SUFDRCxVQUFVLEVBQUUsS0FBSztJQUNqQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDdEIsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRXpDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1YsTUFBTSxJQUFJLFVBQVUsQ0FB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bW1hbmRcIjtcbmltcG9ydCB7XG4gICAgTWlzc2luZ0FyZyxcbiAgICBQZXJtaXNzaW9uRGVuaWVkLFxuICAgIFNhbHR5RXhjZXB0aW9uLFxufSBmcm9tIFwiLi4vLi4vY2xhc3Nlcy9FeGNlcHRpb25cIjtcbmltcG9ydCBHdWlsZCBmcm9tIFwiLi4vLi4vY2xhc3Nlcy9HdWlsZFwiO1xuaW1wb3J0IFNhbHR5IGZyb20gXCIuLi8uLi9jbGFzc2VzL1NhbHR5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDb21tYW5kKHtcbiAgICBuYW1lOiBcInJvbGVcIixcbiAgICBrZXlzOiBbXCJyb2xlXCJdLFxuICAgIGhlbHA6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgYXJndW1lbnQ6IG51bGwsXG4gICAgICAgICAgICBlZmZlY3Q6IFwiU2hvd3MgdGhlIGN1cnJlbnQgZGVmYXVsdCByb2xlXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFyZ3VtZW50OiBcInNldCAqKipuZXcgcm9sZSoqKlwiLFxuICAgICAgICAgICAgZWZmZWN0OlxuICAgICAgICAgICAgICAgIFwiU2V0cyB0aGUgKioqbmV3IHJvbGUqKiogYXMgdGhlIGRlZmF1bHQgb25lLiBJZiBubyBleGlzdGluZyByb2xlIG1hdGNoZXMgdGhlIG5hbWUgeW91IHByb3ZpZGVkLCBhIG5ldyByb2xlIHdpbGwgYmUgY3JlYXRlZFwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBhcmd1bWVudDogXCJ1bnNldFwiLFxuICAgICAgICAgICAgZWZmZWN0OiBcIlJlbW92ZXMgdGhlIGRlZmF1bHQgcm9sZVwiLFxuICAgICAgICB9LFxuICAgIF0sXG4gICAgdmlzaWJpbGl0eTogXCJkZXZcIixcbiAgICBhc3luYyBhY3Rpb24obXNnLCBhcmdzKSB7XG4gICAgICAgIGNvbnN0IHsgZ3VpbGQgfSA9IG1zZztcbiAgICAgICAgY29uc3QgZ3VpbGREQklkID0gR3VpbGQuZ2V0KGd1aWxkLmlkKS5pZDtcblxuICAgICAgICBpZiAoYXJnc1swXSAmJiBTYWx0eS5nZXRMaXN0KFwiYWRkXCIpLmluY2x1ZGVzKGFyZ3NbMF0pKSB7XG4gICAgICAgICAgICBpZiAoIWFyZ3NbMV0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWlzc2luZ0FyZyhcIm5ldyByb2xlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHJvbGUgPSBtc2cubWVudGlvbnMucm9sZXMuZmlyc3QoKTtcbiAgICAgICAgICAgIGNvbnN0IHJvbGVOYW1lID0gYXJncy5zbGljZSgxKS5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgIGlmICghcm9sZSkge1xuICAgICAgICAgICAgICAgIHJvbGUgPSBndWlsZC5yb2xlcy5maW5kKChyKSA9PiByLm5hbWUgPT09IHJvbGVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcm9sZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJvbGUgPSBhd2FpdCBndWlsZC5jcmVhdGVSb2xlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHJvbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzFlZmYwMFwiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgR3VpbGQudXBkYXRlKGd1aWxkREJJZCwgeyBkZWZhdWx0X3JvbGU6IHJvbGUuaWQgfSk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFNhbHR5LnN1Y2Nlc3MoXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2csXG4gICAgICAgICAgICAgICAgICAgICAgICBgcm9sZSAqKiR7cm9sZS5uYW1lfSoqIGhhcyBiZWVuIHN1Y2Nlc3NmdWx5IGNyZWF0ZWQgYW5kIHNldCBhcyBkZWZhdWx0IHJvbGUgZm9yICoqJHtndWlsZC5uYW1lfSoqYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBQZXJtaXNzaW9uRGVuaWVkKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhdXRob3JpemVkIHRvIGNyZWF0ZSBuZXcgcm9sZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiSVwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBHdWlsZC51cGRhdGUoZ3VpbGREQklkLCB7IGRlZmF1bHRfcm9sZTogcm9sZS5pZCB9KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBTYWx0eS5zdWNjZXNzKFxuICAgICAgICAgICAgICAgICAgICBtc2csXG4gICAgICAgICAgICAgICAgICAgIGByb2xlICoqJHtyb2xlLm5hbWV9KiogaGFzIGJlZW4gc3VjY2Vzc2Z1bHkgc2V0IGFzIGRlZmF1bHQgcm9sZSBmb3IgKioke2d1aWxkLm5hbWV9KipgXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmdzWzBdICYmIFNhbHR5LmdldExpc3QoXCJkZWxldGVcIikuaW5jbHVkZXMoYXJnc1swXSkpIHtcbiAgICAgICAgICAgIGlmICghR3VpbGQuZ2V0KGd1aWxkLmlkKS5kZWZhdWx0X2NoYW5uZWwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU2FsdHlFeGNlcHRpb24oXCJubyBkZWZhdWx0IHJvbGUgc2V0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXdhaXQgR3VpbGQudXBkYXRlKGd1aWxkREJJZCwgeyBkZWZhdWx0X3JvbGU6IG51bGwgfSk7XG4gICAgICAgICAgICBhd2FpdCBTYWx0eS5zdWNjZXNzKFxuICAgICAgICAgICAgICAgIG1zZyxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHQgcm9sZSBoYXMgYmVlbiBzdWNjZXNzZnVseSByZW1vdmVkXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIUd1aWxkLmdldChndWlsZC5pZCkuZGVmYXVsdF9yb2xlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNhbHR5Lm1lc3NhZ2UobXNnLCBcIk5vIGRlZmF1bHQgcm9sZSBzZXRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvbGUgPSBndWlsZC5yb2xlcy5nZXQoR3VpbGQuZ2V0KGd1aWxkLmlkKS5kZWZhdWx0X3JvbGUpO1xuICAgICAgICAgICAgICAgIFNhbHR5LmVtYmVkKG1zZywge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogYGRlZmF1bHQgcm9sZSBpcyAke3JvbGUubmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJuZXdjb21lcnMgd2lsbCBhdXRvbWF0aWNhbGx5IGdldCB0aGlzIHJvbGVcIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHJvbGUuY29sb3IsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG4iXX0=