import { Snowflake, VoiceState } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor } from "../../types";
import { apiCatch, meaning } from "../../utils";

const autoDeafenMap = new Set<Snowflake>();
let listenerBound = false;

function autoDeafen(oldState: VoiceState, newState: VoiceState) {
  if (autoDeafenMap.has(newState.id) && newState.channelID) {
    apiCatch(() => newState.setDeaf(true));
  }
}

const command: CommandDescriptor = {
  name: "deafen",
  aliases: ["deaf"],
  channel: "guild",
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
  async action({ args, msg, source, targets }) {
    const member = (targets[0]?.member || source.member)!;
    const option = meaning(args[0]) || "";
    const deafen: boolean = ["clear", "remove"].includes(option)
      ? false
      : !autoDeafenMap.has(member.id);

    if (deafen) {
      autoDeafenMap.add(member.id);
    } else {
      autoDeafenMap.delete(member.id);
    }

    if (member.voice.channelID) {
      apiCatch(() => member.voice.setDeaf(deafen));
    }

    if (listenerBound && !autoDeafenMap.size) {
      salty.bot.off("voiceStateUpdate", autoDeafen);
      listenerBound = false;
    } else if (!listenerBound && autoDeafenMap.size) {
      salty.bot.on("voiceStateUpdate", autoDeafen);
      listenerBound = true;
    }

    salty.success(
      msg,
      `${member.displayName} has been ${deafen ? "" : "un"}deafened.`
    );
  },
};

export default command;
