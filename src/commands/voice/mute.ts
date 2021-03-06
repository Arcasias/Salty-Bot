import { Snowflake, VoiceState } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { meaning } from "../../utils/generic";

const autoMuteMap = new Set<Snowflake>();
let listenerBound = false;

function autoMute(oldState: VoiceState, newState: VoiceState) {
  if (autoMuteMap.has(newState.id) && newState.channelID) {
    newState.setMute(true).catch();
  }
}

const command: CommandDescriptor = {
  name: "mute",
  aliases: ["stfu", "shutup", "unmute"],
  help: [
    {
      argument: null,
      effect: "Toggles the targetted user into an automute loop.",
    },
    {
      argument: "clear",
      effect: "Removes the targetted user from the automute loop.",
    },
  ],
  channel: "guild",
  permissions: ["MUTE_MEMBERS"],

  async action({ alias, args, send, source, targets }) {
    const member = (targets[0]?.member || source.member)!;
    const option = meaning(args[0]) || "";
    const mute: boolean =
      ["clear", "remove"].includes(option) || alias.startsWith("un")
        ? false
        : !autoMuteMap.has(member.id);

    if (mute) {
      autoMuteMap.add(member.id);
    } else {
      autoMuteMap.delete(member.id);
    }

    if (member.voice.channelID) {
      member.voice.setMute(mute).catch();
    }

    if (listenerBound && !autoMuteMap.size) {
      salty.bot.off("voiceStateUpdate", autoMute);
      listenerBound = false;
    } else if (!listenerBound && autoMuteMap.size) {
      salty.bot.on("voiceStateUpdate", autoMute);
      listenerBound = true;
    }

    return send.success(
      `${member.displayName} has been ${mute ? "" : "un"}muted.`
    );
  },
};

export default command;
