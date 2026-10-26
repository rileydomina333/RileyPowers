import { Aki } from 'aki-api'

const akiGames = {}

let handler = async (m, { conn, text }) => {
  const key = m.chat + ':' + m.sender
  const txt = (text || '').toLowerCase().trim()

  // === SE HA UNA PARTITA IN CORSO ===
  if (akiGames[key]) {
    const aki = akiGames[key]

    if (['fine','stop','esci','basta'].includes(txt)) {
      delete akiGames[key]
      return await conn.sendMessage(m.chat, { text: '❌ Partita Akinator chiusa.' }, { quoted: m })
    }

    let ans = null
    if (['si','sì','s','0','si!'].includes(txt)) ans = 0
    if (['no','n','1','no!'].includes(txt)) ans = 1
    if (['non so','boh','idk','non lo so','ns','2'].includes(txt)) ans = 2
    if (['probabile','forse si','prob si','3'].includes(txt)) ans = 3
    if (['poco','forse no','non probabile','prob no','4'].includes(txt)) ans = 4

    if (ans === null) {
      return await conn.sendMessage(m.chat, {
        text: `*Rispondi con:*\n\n*si* → Si\n*no* → No\n*non so* → Non so\n*probabile* → Probabilmente si\n*poco* → Probabilmente no\n\nDomanda attuale:\n*${aki.question}*`
      }, { quoted: m })
    }

    try {
      await aki.step(ans)

      // Se è sicuro al 85% tenta di vincere
      if (aki.progress >= 80) {
        await aki.win()
        const guess = aki.answers[0]
        delete akiGames[key]

        return await conn.sendMessage(m.chat, {
          image: { url: guess.absolute_picture_path },
          caption: `🔮 *AKINATOR HA INDOVINATO?* 🔮\n\n` +
                   `*Nome:* ${guess.name}\n` +
                   `*Descrizione:* ${guess.description}\n\n` +
                   `*Progresso:* ${Math.floor(aki.progress)}%\n` +
                   `Era lui? Se non è lui fai di nuovo .akinator`
        }, { quoted: m })
      }

      // Altrimenti prossima domanda
      return await conn.sendMessage(m.chat, {
        text: `*Domanda ${aki.currentStep + 1} - ${Math.floor(aki.progress)}%*\n\n${aki.question}\n\n` +
              `Rispondi: *si / no / non so / probabile / poco*\n` +
              `Scrivi *fine* per uscire.`
      }, { quoted: m })

    } catch (e) {
      console.error(e)
      delete akiGames[key]
      return await conn.sendMessage(m.chat, { text: '*Errore Akinator, riprova con .akinator*' }, { quoted: m })
    }
  }

  // === AVVIA NUOVA PARTITA ===
  try {
    const aki = new Aki({ region: 'it', childMode: false })
    await aki.start()
    akiGames[key] = aki

    return await conn.sendMessage(m.chat, {
      text: `🧞‍♂️ *AKINATOR AVVIATO* 🧞‍♂️\n\nPensa a un personaggio famoso (reale o fittizio) e risponderò alle domande!\n\n*Domanda 1:*\n${aki.question}\n\nRispondi con:\n*si* | *no* | *non so* | *probabile* | *poco*`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    return await conn.sendMessage(m.chat, { text: `Errore avvio: ${e.message}` }, { quoted: m })
  }
}

handler.help = ['akinator']
handler.tags = ['game']
handler.command = /^(akinator|aki)$/i
handler.group = false
handler.private = false

export default handler