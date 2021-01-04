import Crew from "../../classes/Crew";
import salty from "../../salty";
import { Banner, CommandDescriptor, SaltyEmbedOptions } from "../../typings";
import { getBannerActions, serializeBanner } from "../../utils/generic";

const PRIMARY_SEPARATOR = ";";
const SECONDARY_SEPARATOR = ",";
const ASSOCIATION_SEPARATOR = ":";

const PRIMARY_SEP_REGEX = new RegExp(`\\s*${PRIMARY_SEPARATOR}\\s*`);
const SECONDARY_SEP_REGEX = new RegExp(`\\s*${SECONDARY_SEPARATOR}\\s*`);
const ASSOCIATION_SEP_REGEX = new RegExp(`\\s*${ASSOCIATION_SEPARATOR}\\s*`);

const CUSTOM_EMOJI_REGEX = /<:\w+:\d{18}>/i;

const command: CommandDescriptor = {
  name: "banner",
  help: [
    {
      argument: `**emoji 1** ${ASSOCIATION_SEPARATOR} **role 1** ${SECONDARY_SEPARATOR} **emoji 2** ${ASSOCIATION_SEPARATOR} **role 2** ${PRIMARY_SEPARATOR} **description**`,
      effect:
        "Creates a new banner: the description will be its main text while each emoji/role pair represents a role any user can grab",
    },
  ],
  channel: "guild",
  async action({ args, msg, send }) {
    const guild = msg.guild!;
    const crew = await Crew.get(guild.id);
    const [emojiRolesString, description] = args
      .join(" ")
      .split(PRIMARY_SEP_REGEX);
    if (CUSTOM_EMOJI_REGEX.test(emojiRolesString)) {
      return send.warn("Can't use custom emojis yet!");
    }
    const emojiRoles: any[] = [];
    for (const emojiRoleName of emojiRolesString.split(SECONDARY_SEP_REGEX)) {
      const [emoji, roleName] = emojiRoleName.split(ASSOCIATION_SEP_REGEX);
      const role = guild.roles.cache.find((r) => r.name === roleName);
      if (!role) {
        return send.warn(
          `The role "${roleName}" does not exist. You must create it before I can use it.`
        );
      }
      emojiRoles.push([emoji, role.id]);
    }

    const embedOptions: SaltyEmbedOptions = {
      description,
    };

    await salty.deleteMessage(msg);
    const bannerMessage = await send.embed(embedOptions);
    if (!bannerMessage) {
      return;
    }
    const banners = crew.banners;
    const newBanner: Banner = {
      channelId: msg.channel.id,
      messageId: bannerMessage.id,
      emojiRoles,
    };
    banners.push(serializeBanner(newBanner));

    Crew.update(crew.id, { banners });

    salty.addActions(
      bannerMessage,
      {
        actions: getBannerActions(newBanner, guild),
      },
      null,
      0
    );
  },
};

export default command;
