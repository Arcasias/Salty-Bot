import axios from "axios";
import { Snowflake } from "discord.js";
import { Module } from "../typings";
import { log } from "../utils";

interface PartialApplicationCommand {
  name: string; // 3-32 chars
  description: string; // 1-100 chars
  options?: ApplicationCommandOption[];
}

interface ApplicationCommandOptionChoice {
  name: string; // 1-100 chars
  value: string | number;
}

interface ApplicationCommandOption {
  type: number;
  description: string; // 1-100 chars
  default?: boolean;
  required?: boolean;
  choices?: ApplicationCommandOptionChoice[];
  options?: ApplicationCommandOption[];
}

interface ApplicationCommand extends PartialApplicationCommand {
  id: Snowflake;
  application_id: Snowflake;
}

function getUrl(guildId?: string, commandId?: string): string {
  let url: string = process.env.APPLICATION_URL!;
  if (guildId) {
    url += `/guilds/${guildId}`;
  }
  return `${url}/commands${commandId ? `/${commandId}` : ""}`;
}

/**
 * @param commandId
 */
async function getCommands(commandId?: string): Promise<ApplicationCommand[]> {
  const { data } = await axios.get(getUrl(commandId), {
    headers: { Authorization: `Bot ${process.env.DISCORD_API}` },
  });
  return data;
}

/**
 * @param commandOptions
 */
async function createCommand(
  commandOptions: PartialApplicationCommand
): Promise<ApplicationCommand> {
  const { data } = await axios.post(getUrl(), commandOptions, {
    headers: { Authorization: `Bot ${process.env.DISCORD_API}` },
  });
  return data;
}

/**
 * @param commandId
 * @param commandOptions
 */
async function updateCommand(
  commandId: string,
  commandOptions: PartialApplicationCommand
): Promise<ApplicationCommand> {
  const { data } = await axios.patch(getUrl(commandId), commandOptions, {
    headers: { Authorization: `Bot ${process.env.DISCORD_API}` },
  });
  return data;
}

/**
 * @param commandId
 */
async function deleteCommand(commandId: string): Promise<boolean> {
  await axios.delete(getUrl(commandId), {
    headers: { Authorization: `Bot ${process.env.DISCORD_API}` },
  });
  return true;
}

const slashCommandModule: Module = {
  async onLoad() {
    const commands = await getCommands();
    log(`${commands.length} slash commands available`);
  },
};

export default slashCommandModule;
