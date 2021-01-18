import { Role } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { apiCatch, clean, meaning } from "../../utils/generic";

const MAX_AMOUNT = 100;
const ROLE_NAME = "cum";

const cummand: CommandDescriptor = {
  name: ROLE_NAME,
  aliases: ["cover", "shower"],
  help: [
    {
      argument: null,
      effect: `Cover yourself in ${ROLE_NAME}`,
    },
    {
      argument: "remove",
      effect: `Remove all the ${ROLE_NAME} off of you`,
    },
  ],
  channel: "guild",
  async action({ args, msg, send, source }) {
    switch (meaning(args[0])) {
      case "clear":
      case "remove": {
        const roles = source.member!.roles.cache.filter(
          (r) => clean(r.name) === clean(ROLE_NAME)
        );
        const assignnMsg = await send.info(
          `Removing ${roles.size} ${ROLE_NAME}...`
        );
        await apiCatch(() => source.member!.roles.remove(roles));
        if (assignnMsg) {
          await salty.deleteMessage(assignnMsg);
        }

        return send.success(`You are now empty of ${ROLE_NAME}!`);
      }
      default: {
        const guild = msg.guild!;
        const existing = guild.roles.cache.filter(
          (r) => clean(r.name) === clean(ROLE_NAME)
        );
        const toCreate: number = Math.max(MAX_AMOUNT - existing.size, 0);
        const roles: Role[] = toCreate ? [] : [...existing.values()];

        if (toCreate) {
          const createMsg = await send.info(
            `Creating ${toCreate} ${ROLE_NAME}...`
          );
          await Promise.allSettled(
            [...new Array(toCreate)].map(async () => {
              const role = await apiCatch(() =>
                guild.roles.create({
                  name: ROLE_NAME,
                  mentionable: true,
                  color: 16777215,
                  permissions: [],
                  reason: `Created by ${msg.author.username} via Salty`,
                })
              );
              if (role) {
                roles.push(role);
              }
            })
          );
          if (createMsg) {
            await salty.deleteMessage(createMsg);
          }
        }

        const assignnMsg = await send.info(
          `Assigning ${roles.length} ${ROLE_NAME}...`
        );
        await apiCatch(() => source.member!.roles.add(roles));
        if (assignnMsg) {
          await salty.deleteMessage(assignnMsg);
        }

        return send.success(`You are now full of ${ROLE_NAME}!`);
      }
    }
  },
};

export default cummand;