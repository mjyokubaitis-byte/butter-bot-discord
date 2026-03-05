import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("butter")
    .setDescription("Talk to Butter Bot.")
    .addStringOption(opt =>
      opt.setName("message").setDescription("What do you want?").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("roster")
    .setDescription("Show Seal Team Rick’s roster and key restrictions."),

  new SlashCommandBuilder()
    .setName("gearcheck")
    .setDescription("Show known loadouts / notes for an operator.")
    .addStringOption(opt =>
      opt.setName("operator").setDescription("e.g., Pissmaster, Nolan, Mike Honcho").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("maintenance")
    .setDescription("Enter Maintenance Mode for paintball marker/equipment.")
    .addStringOption(opt =>
      opt.setName("item").setDescription("e.g., 180R, EMEK, Axe 2.0, Autococker").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("eventplan")
    .setDescription("Generate a safe, legal paintball deployment plan.")
    .addStringOption(opt =>
      opt.setName("details").setDescription("Date/location/field/camping notes").setRequired(true)
    ),
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function main() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!clientId || !guildId) throw new Error("Missing DISCORD_CLIENT_ID or DISCORD_GUILD_ID");

  console.log("Registering slash commands...");
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
  console.log("✅ Registered commands: butter, roster, gearcheck, maintenance, eventplan");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
