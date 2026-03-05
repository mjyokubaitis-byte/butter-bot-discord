import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("butter")
    .setDescription("Talk to Butter Bot.")
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("What do you want Butter Bot to respond to?")
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function registerCommands() {
  try {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const guildId = process.env.DISCORD_GUILD_ID;

    if (!clientId || !guildId) {
      throw new Error("Missing DISCORD_CLIENT_ID or DISCORD_GUILD_ID");
    }

    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log("✅ Registered /butter command successfully.");
  } catch (error) {
    console.error(error);
  }
}

registerCommands();
