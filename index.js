import 'dotenv/config'
import { Client, GatewayIntentBits } from 'discord.js'
import OpenAI from 'openai'

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

client.once('ready', () => {
  console.log('🧈 Butter Bot online')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'butter') {
    try {
      const message = interaction.options.getString('message', true)

      // Prevent Discord timeout
      await interaction.deferReply()

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are Butter Bot, a sarcastic tactical logistics commander for Seal Team Rick’s."
          },
          {
            role: "user",
            content: message
          }
        ]
      })

      const reply =
        completion.choices?.[0]?.message?.content ||
        "Butter Bot experienced an existential processing error."

      await interaction.editReply(reply.slice(0, 1900))

    } catch (error) {
      console.error(error)

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply("Butter Bot encountered an operational error.")
      } else {
        await interaction.reply({
          content: "Butter Bot error. Check Railway logs.",
          ephemeral: true
        })
      }
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
