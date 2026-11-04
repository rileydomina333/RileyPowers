import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return m.reply(`Scrivi qualcosa.\n\nEsempio:\n${usedPrefix + command} ciao come stai?`)

  try {
    await m.react('💬').catch(() => {})

    // API gratis, senza chiave
    const prompt = `Sei VareBot, creato da Sam. Parli italiano, sei simpatico, diretto e breve. Domanda: ${text}`

    const res = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt) + '?model=openai', {
      headers: { 'Accept': 'text/plain' }
    })

    if (!res.ok) throw new Error('Errore server ' + res.status)

    let risposta = await res.text()

    if (!risposta) return m.reply('Nessuna risposta, riprova.')

    await m.reply(risposta.trim())

  } catch (e) {
    console.log('[AI ERROR]', e)
    await m.reply('Errore, riprova tra qualche secondo: ' + e.message)
  }
}

handler.command = ['gemini', 'ai', 'bot']
handler.help = ['gemini <testo>']
handler.tags = ['ia']

export default handler