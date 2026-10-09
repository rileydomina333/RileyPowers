
require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const HF_TOKEN = process.env.HF_TOKEN;

async function chiediAI(domanda) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b:fastest",
          messages: [
            {
              role: "system",
              content: "Sei un assistente AI utile, veloce e preciso. Rispondi in italiano."
            },
            {
              role: "user",
              content: domanda
            }
          ],
          max_tokens: 700,
          temperature: 0.7
        }),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Errore API:", response.status, error);
      throw new Error("AI temporaneamente non disponibile.");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content
      || "Non sono riuscito a generare una risposta.";
  } finally {
    clearTimeout(timeout);
  }
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(".ia")) return;

  const domanda = message.content.slice(3).trim();

  if (!domanda) {
    return message.reply("❓ Scrivi una domanda! Esempio: `.ia Come funziona JavaScript?`");
  }

  await message.channel.sendTyping();

  try {
    const risposta = await chiediAI(domanda);

    // Discord limita i messaggi a 2000 caratteri
    const chunks = risposta.match(/[\s\S]{1,1900}/g) || [];

    await message.reply(chunks.shift() || "Nessuna risposta.");

    for (const chunk of chunks) {
      await message.channel.send(chunk);
    }
  } catch (error) {
    console.error(error);
    await message.reply(
      "⚠️ L'AI non è disponibile al momento. Riprova tra poco."
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
