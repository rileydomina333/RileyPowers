// PORNSEARCH PER TUTTI - v6 AUTO-DELETE 30s
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `Uso: ${usedPrefix + command} <nome>\nEs: ${usedPrefix + command} mia khalifa`, m)
  }

  // Cancella subito il comando dell'utente per non lasciare traccia
  try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {}

  let loadingMsg = null
  try {
    loadingMsg = await conn.reply(m.chat, `🔞 Cerco: *${text}*...`, m)

    const url = `https://www.pornhub.com/webmasters/search?search=${encodeURIComponent(text)}&thumbsize=medium&ordering=mostviewed&period=ever&page=1`
    
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const json = await res.json()

    if (!json.videos || json.videos.length === 0) {
      let noRes = await conn.reply(m.chat, 'Nessun risultato trovato.', m)
      setTimeout(async () => {
        try { await conn.sendMessage(m.chat, { delete: noRes.key }) } catch {}
      }, 30000)
      return
    }

    const results = json.videos.slice(0, 5)
    let caption = `🔞 *RISULTATI PER:* ${text}\n\n`
    results.forEach((v, i) => {
      caption += `*${i + 1}. ${v.title}*\n`
      caption += `👁️ ${v.views} | ⏱️ ${v.duration} | ⭐ ${v.rating}%\n`
      caption += `🔗 ${v.url}\n\n`
    })
    caption += `⏳ Questo messaggio si autodistrugge tra 30 secondi`

    // Cancella il "Cerco..."
    try { await conn.sendMessage(m.chat, { delete: loadingMsg.key }) } catch {}

    let sent = await conn.sendMessage(m.chat, {
      image: { url: results[0].default_thumb },
      caption: caption
    })

    // AUTO-DELETE DOPO 30 SECONDI
    setTimeout(async () => {
      try {
        await conn.sendMessage(m.chat, { delete: sent.key })
      } catch (e) {
        console.log('Delete fallito:', e.message)
      }
    }, 30000)

  } catch (e) {
    console.error(e)
    // Cancella anche il loading se c'è errore
    try { if (loadingMsg) await conn.sendMessage(m.chat, { delete: loadingMsg.key }) } catch {}
    let err = await conn.reply(m.chat, 'Errore ricerca. Riprova.', m)
    setTimeout(async () => {
      try { await conn.sendMessage(m.chat, { delete: err.key }) } catch {}
    }, 30000)
  }
}

handler.help = ['pornsearch <query>']
handler.tags = ['nsfw']
handler.command = /^(pornsearch|phsearch)$/i
handler.group = true

export default handler