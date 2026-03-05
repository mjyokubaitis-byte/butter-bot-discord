import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("butter")
    .setDescription("Talk to Butter Bot.")
    .addStringOption(opt =>
      opt.setName("message").setDescription("What do you want?").setRequired(true)
    )
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function main() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!clientId || !guildId) throw new Error("Missing DISCORD_CLIENT_ID or DISCORD_GUILD_ID");

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
  console.log("✅ Registered /butter");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
