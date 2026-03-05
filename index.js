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
  console.log('Butter Bot online')
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'butter') {
    const message = interaction.options.getString('message')

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are Butter Bot, a sarcastic tactical logistics commander for Seal Team Rick’s." },
        { role: "user", content: message }
      ]
    })

    await interaction.reply(completion.choices[0].message.content)
  }
})

client.login(process.env.DISCORD_TOKEN)
