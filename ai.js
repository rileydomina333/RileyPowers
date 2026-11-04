// GEMINI NUOVO - v1 Semplice
// Metti la chiave qua sotto al posto di INCOLLA_QUI_LA_CHIAVE
import fetch from 'node-fetch'

console.log('>>> [GEMINI] Plugin caricato correttamente <<<')

const API_KEY = 'Ab8RN6J_W75LFt0hWKoLrJM1Wmex1u9eAXlj5TD5HWCTAxx6kg'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  console.log('>>> [GEMINI] Comando ricevuto da:', m.sender, 'Testo:', text)

  if (!text) {
    return m.reply(`Scrivi qualcosa dopo il comando.\n\nEsempio:\n${usedPrefix + command} raccontami una barzelletta`)
  }

  if (!API_KEY || API_KEY === 'INCOLLA_QUI_LA_CHIAVE' || API_KEY.length < 10) {
    console.log('>>> [GEMINI] ERRORE: Chiave mancante')
    return m.reply('⚠️ Chiave API non inserita.\nApri il file plugins/gemini.js e metti la chiave alla riga 6.')
  }

  try {
    await m.react('💬').catch(() => {})

    const prompt = `Sei VareBot, creato da Sam. Parli italiano, sei simpatico, diretto, breve e con un po' di ironia. Rispondi a questa domanda: ${text}`

    console.log('>>> [GEMINI] Chiamo Google...')

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    console.log('>>> [GEMINI] Google ha risposto con status:', res.status)

    if (!res.ok) {
      const errText = await res.text()
      console.log('>>> [GEMINI] ERRORE GOOGLE:', errText)
      return m.reply(`❌ Errore Google (${res.status})\n${errText.slice(0, 300)}`)
    }

    const data = await res.json()
    const risposta = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!risposta) {
      console.log('>>> [GEMINI] ERRORE: Risposta vuota', JSON.stringify(data))
      return m.reply('Google ha risposto ma senza testo. Riprova.')
    }

    console.log('>>> [GEMINI] Risposta OK, la invio')
    await m.reply(risposta)

  } catch (e) {
    console.log('>>> [GEMINI] ERRORE CATCH:', e)
    await m.reply('Errore: ' + e.message)
  }
}

handler.command = ['gemini', 'ai', 'bot', 'gpt']
handler.help = ['gemini <testo>']
handler.tags = ['ia']

export default handler