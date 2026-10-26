// PLUGIN IA con OLLAMA - RLY BOT
// Modello locale, no key

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Scrivi qualcosa!\n\nEsempio:\n${usedPrefix + command} ciao come stai?\n${usedPrefix + command} fammi un plugin`)

  try {
    await conn.sendPresenceUpdate('composing', m.chat)

    // Cambia il modello se usi un altro
    const MODEL = "llama3.1:8b" // o gemma2:2b, mistral, qwen2.5:3b

    // Per VPS locale:
    const OLLAMA_URL = "http://127.0.0.1:11434/api/generate"

    // Se hai Ollama su un altro server metti:
    // const OLLAMA_URL = "http://IP_TUO_SERVER:11434/api/generate"

    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: `Sei RLY BOT, un bot WhatsApp siciliano, divertente, diretto, un po' sboccato ma simpatico. Parli in palermitano stretto quando serve. Rispondi sempre in italiano breve e utile. Utente dice: ${text}`,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 500
        }
      })
    })

    const data = await res.json()

    if (!data.response) throw new Error(JSON.stringify(data))

    await conn.sendMessage(m.chat, { text: data.response.trim() }, { quoted: m })

  } catch (e) {
    console.error(e)
    return m.reply(`❌ Errore Ollama\n\n1. Hai avviato Ollama? -> ollama serve\n2. Hai il modello? -> ollama pull llama3.1:8b\n\nErrore: ${e.message}`)
  }
}

handler.help = ['ia <testo>']
handler.tags = ['ai']
handler.command = /^(ia|ai|rly|chat)$/i

export default handler