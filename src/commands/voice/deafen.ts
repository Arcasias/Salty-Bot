import { Snowflake, VoiceState } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { meaning } from "../../utils/generic";

const autoDeafenMap = new Set<Snowflake>();
let listenerBound = false;

function autoDeafen(oldState: VoiceState, newState: VoiceState) {
  if (autoDeafenMap.has(newState.id) && newState.channelID) {
    newState.setDeaf(true).catch();
  }
}

const command: CommandDescriptor = {
  name: "deafen",
  aliases: ["deaf", "undeaf", "undeafen"],
  help: [
    {
      argument: null,
      effect: "Toggles the targetted user into an autodeaf loop.",
    },
    {
      argument: "clear",
      effect: "Removes the targetted user from the autodeaf loop.",
    },
  ],
  channel: "guild",
  permissions: ["DEAFEN_MEMBERS"],

  async action({ alias, args, send, source, targets }) {
    const member = (targets[0]?.member || source.member)!;
    const option = meaning(args[0]) || "";
    const deafen: boolean =
      ["clear", "remove"].includes(option) || alias.startsWith("un")
        ? false
        : !autoDeafenMap.has(member.id);

    if (deafen) {
      autoDeafenMap.add(member.id);
    } else {
      autoDeafenMap.delete(member.id);
    }

    if (member.voice.channelID) {
      member.voice.setDeaf(deafen).catch();
    }

    if (listenerBound && !autoDeafenMap.size) {
      salty.bot.off("voiceStateUpdate", autoDeafen);
      listenerBound = false;
    } else if (!listenerBound && autoDeafenMap.size) {
      salty.bot.on("voiceStateUpdate", autoDeafen);
      listenerBound = true;
    }

    return send.success(
      `${member.displayName} has been ${deafen ? "" : "un"}deafened.`
    );
  },
};

export default command;
