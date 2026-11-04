import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return m.reply(`Scrivi qualcosa.\n\nEsempio:\n${usedPrefix + command} ciao`)

  await m.react('💬').catch(() => {})

  const prompt = `Sei VareBot, creato da Sam. Parli italiano, sei simpatico e breve. Domanda: ${text}`

  // Prova 1: Pollinations
  try {
    const r1 = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt), {
      headers: { 'Accept': 'text/plain', 'User-Agent': 'Mozilla/5.0' }
    })
    if (r1.ok) {
      const t1 = await r1.text()
      if (t1 && t1.length > 5) return m.reply(t1.trim())
    }
    console.log('[AI] Pollinations fallita:', r1.status)
  } catch (e) { console.log('[AI] Pollinations errore:', e.message) }

  // Prova 2: DuckDuckGo AI (senza chiave)
  try {
    const r2 = await fetch('https://duckduckgo.com/duckchat/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-vqd-4': '4-123456' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const d2 = await r2.text()
    console.log('[AI] Duck:', d2.slice(0, 200))
    if (d2 && d2.length > 10) return m.reply(d2.slice(0, 4000))
  } catch (e) { console.log('[AI] Duck errore:', e.message) }

  return m.reply('Le API gratis sono down in questo momento, riprova tra 1 minuto.\n\nDimmi cosa ti esce in Termux così ti sistemo il plugin definitivo.')
}

handler.command = ['gemini', 'ai', 'bot']
handler.help = ['gemini <testo>']
handler.tags = ['ia']

export default handler