import fetch from 'node-fetch'

const chatHistory = new Map()

const formatHistory = (history) => {
  if (!history || history.length === 0) return ''
  const lastMessages = history.slice(-10)
  return '\n\n💭 Cronologia recente:\n' + lastMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Inserisci un testo.\n\n• Esempio:\n${usedPrefix + command} come va`)

  try {
    const chatId = m.chat
    if (!chatHistory.has(chatId)) chatHistory.set(chatId, [])
    let history = chatHistory.get(chatId)

    const basePrompt = `Il tuo nome è VareBot e sei stato creato da Sam. Usi la lingua italiana. Sii coinvolgente, simpatico, diretto, curioso e rispondi sempre in modo chiaro e utile. Se puoi, aggiungi un tocco di ironia e stimola la conversazione. Le tue risposte devono essere brevi e concise.`
    const historyText = formatHistory(history)

    // react non deve mai bloccare il comando
    try { await m.react('💬') } catch {}

    const response = await getAIResponse(basePrompt + historyText, text)

    history.push({ role: 'user', content: text })
    history.push({ role: 'model', content: response })

    // Tieni solo ultimi 20 messaggi
    if (history.length > 20) {
      history = history.slice(-20)
      chatHistory.set(chatId, history)
    }

    await m.reply(response)

  } catch (e) {
    console.error('[GEMINI PLUGIN ERROR]:', e)
    await m.reply('Si è verificato un errore, riprova più tardi.\nErrore: ' + (e.message || e).toString().slice(0, 200))
  }
}

async function getAIResponse(prompt, question) {
  const googleApiKey = global.APIKeys?.google
  if (!googleApiKey || googleApiKey === 'INSERISCI_LA_TUA_CHIAVE' || googleApiKey.length < 10) {
    return "⚠️ Chiave API Google non configurata. Mettila in config.js in global.APIKeys.google"
  }

  // Fallback in ordine: se il primo è down prova gli altri
  const models = [
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash'
  ]

  let lastError = null
  for (const model of models) {
    try {
      return await getGeminiResponse(googleApiKey, prompt, question, model)
    } catch (err) {
      lastError = err
      console.log(`[GEMINI] Modello ${model} fallito:`, err.message.slice(0, 200))
      if (err.message.includes('403') || err.message.includes('API key not valid')) break
      // se è 429 aspetta 1 sec e prova il prossimo
      if (err.message.includes('429')) await new Promise(r => setTimeout(r, 1000))
    }
  }

  if (lastError?.message?.includes('403') || lastError?.message?.includes('API key')) {
    return "⚠️ API Google non abilitata o chiave non valida. Controlla Google AI Studio."
  }
  throw lastError || new Error("Al momento non riesco ad accedere ai servizi AI.")
}

async function getGeminiResponse(apiKey, prompt, question, model) {
  const fullPrompt = `${prompt}\n\nDomanda utente: ${question}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1000
          }
        }),
        signal: controller.signal
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Errore API Gemini (${model}): ${response.status} - ${errorText.slice(0, 300)}`)
    }

    const data = await response.json()
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!answer) throw new Error(`Risposta vuota da ${model}`)
    return answer

  } finally {
    clearTimeout(timeout)
  }
}

handler.command = /^(gemini|ai|varebot)$/i
handler.help = ['gemini <testo>']
handler.tags = ['strumenti', 'ia', 'iatesto']
// TOLTO handler.register = true -> era questo che bloccava la risposta
handler.register = false

export default handler