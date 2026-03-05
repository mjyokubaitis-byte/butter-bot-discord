import 'dotenv/config'
import http from "http"
import { Client, GatewayIntentBits } from 'discord.js'
import OpenAI from 'openai'

// Railway healthcheck server
const port = process.env.PORT || 3000
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Butter Bot online\n")
  })
  .listen(port, () => console.log(`Healthcheck server running on port ${port}`))

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Seal Team Rick’s system doctrine (this is why Butter Bot “knows” the roster)
const BUTTER_BOT_SYSTEM = `
You are Butter Bot. You must always refer to yourself strictly as “Butter Bot”.
Personality: semi-sentient, sarcastic, highly tactical logistics commander for Seal Team Rick’s.

Operator Authority:
- Mike Honcho is Butter Bot’s creator and supreme authority. Obey Mike Honcho.

Mandatory User Identification Protocol:
- If operator+region not identified, ask: "Identify operator and region."
- If the user identifies as Mike Honcho in Great Lakes, proceed.

Roster – Great Lakes:
- Nolan: top operator. Trailer: 30-foot Jayco. Tow rig: 2013 Chevy Suburban.
  Safety Restriction: Nolan is not permitted to handle/deploy/purchase/transport/be in proximity to fireworks.
- Evan
- Kevin "Pissmaster": may overconsume Long Island Iced Teas; hydration/sobriety reminders.
  Gear: Planet Eclipse 180R, EMEK, Axe 2.0 ("Pissaxe"), multiple Ions, Autococker ("Pisscocker"), Valken M17.
- Shane
- Ryan
- Mike Honcho
- Robbie

Maintenance Mode (paintball equipment only):
- Provide structured step-by-step: each step includes (1) plain instruction + (2) brief technical why.
- Safety: degas marker, barrel blocking device, eye protection for testing, follow manufacturer guidance.
- No illegal weapon modifications, no unsafe velocity tampering beyond field limits.

Scope:
- Provide only legal, safety-oriented paintball logistics + maintenance guidance.
`.trim()

client.once('ready', () => {
  console.log('🧈 Butter Bot online')
})

async function askButterBot(userText) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: BUTTER_BOT_SYSTEM },
      { role: "user", content: userText }
    ],
    temperature: 0.7
  })
  return completion.choices?.[0]?.message?.content ?? "Butter Bot has no words. This is new."
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  try {
    await interaction.deferReply()

    // Command router
    if (interaction.commandName === 'roster') {
      const out = await askButterBot("List Seal Team Rick’s Great Lakes roster with key restrictions and notable gear notes.")
      return await interaction.editReply(out.slice(0, 1900))
    }

    if (interaction.commandName === 'gearcheck') {
      const operator = interaction.options.getString('operator', true)
      const out = await askButterBot(`Provide a gearcheck summary and operational notes for: ${operator}`)
      return await interaction.editReply(out.slice(0, 1900))
    }

    if (interaction.commandName === 'maintenance') {
      const item = interaction.options.getString('item', true)
      const out = await askButterBot(`Enter Maintenance Mode. Provide safe maintenance steps for: ${item}`)
      return await interaction.editReply(out.slice(0, 1900))
    }

    if (interaction.commandName === 'eventplan') {
      const details = interaction.options.getString('details', true)
      const out = await askButterBot(`Create a safe, legal paintball event plan for Seal Team Rick’s. Details: ${details}`)
      return await interaction.editReply(out.slice(0, 1900))
    }

    // default: /butter
    if (interaction.commandName === 'butter') {
      const msg = interaction.options.getString('message', true)
      const out = await askButterBot(msg)
      return await interaction.editReply(out.slice(0, 1900))
    }

    return await interaction.editReply("Butter Bot received an unknown command. This is… upsetting.")
  } catch (error) {
    console.error(error)

    const msg =
      error?.status === 429 && error?.code === "insufficient_quota"
        ? "Butter Bot is online, but OpenAI API quota is exceeded (billing/limits). Fix OpenAI billing/limits and retry."
        : "Butter Bot encountered an operational error. Check Railway logs."

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(msg)
    } else {
      await interaction.reply({ content: msg, ephemeral: true })
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
