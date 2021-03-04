import { Role } from "discord.js";
import { CommandDescriptor, Module } from "../typings";
import { clean, meaning } from "../utils/generic";

const MAX_AMOUNT = 100;
const ROLE_NAME = "cum";

const cumCommand: CommandDescriptor = {
  name: ROLE_NAME,
  aliases: ["cover", "shower"],
  help: [
    {
      argument: null,
      effect: `Cover yourself in ${ROLE_NAME}`,
    },
    {
      argument: "clear",
      effect: `Cleanse yourself of all the ${ROLE_NAME}`,
    },
    {
      argument: "remove",
      effect: `Remove all the ${ROLE_NAME} roles from the server`,
    },
  ],
  channel: "guild",
  async action({ args, msg, send, source }) {
    const guild = msg.guild!;
    const existing = guild.roles.cache.filter(
      (r) => clean(r.name) === clean(ROLE_NAME)
    );
    switch (meaning(args[0])) {
      case "clear": {
        const roles = source.member!.roles.cache.filter(
          (r) => clean(r.name) === clean(ROLE_NAME)
        );
        const assignnMsg = await send.info(
          `Removing ${roles.size} ${ROLE_NAME}...`
        );
        await source.member!.roles.remove(roles).catch();
        await assignnMsg.delete().catch();

        return send.success(`You are now empty of ${ROLE_NAME}!`);
      }
      case "remove": {
        const deleteMsg = await send.info(
          `Removing ${existing.size} ${ROLE_NAME}...`
        );
        await Promise.allSettled(
          existing.map((r) =>
            r.delete(`Deleted by ${msg.author.username} via Salty`)
          )
        );
        await deleteMsg.delete().catch();
        return send.success(`All ${ROLE_NAME} roles have been removed.`);
      }
      default: {
        const toCreate: number = Math.max(MAX_AMOUNT - existing.size, 0);
        const roles: Role[] = toCreate ? [] : [...existing.values()];

        if (toCreate) {
          const createMsg = await send.info(
            `Creating ${toCreate} ${ROLE_NAME}...`
          );
          await Promise.allSettled(
            [...new Array(toCreate)].map(async () => {
              const role = await guild.roles
                .create({
                  data: {
                    name: ROLE_NAME,
                    mentionable: true,
                    color: 16777215,
                    permissions: [],
                  },
                  reason: `Created by ${msg.author.username} via Salty`,
                })
                .catch();
              if (role) {
                roles.push(role);
              }
            })
          );
          await createMsg.delete().catch();
        }

        const assignnMsg = await send.info(
          `Assigning ${roles.length} ${ROLE_NAME}...`
        );
        await Promise.allSettled([
          source.member!.roles.add(roles).catch(),
          assignnMsg.delete().catch(),
        ]);

        return send.success(`You are now full of ${ROLE_NAME}!`);
      }
    }
  },
};

const cumModule: Module = {
  commands: { misc: [cumCommand] },
};

export default cumModule;
