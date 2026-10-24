import { existsSync, promises as fsPromises } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const header = '╭━━━━━━━━━━━━━━━━━━━━╮'

  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, {
      text: `${header}
┃    ACCESSO NEGATO
╰━━━━━━━━━━━━━━━━━━━━╯

Non disponi dei permessi necessari
per eseguire questo comando.

Motivo: numero del bot non autorizzato.`
    }, { quoted: m })
  }

  const sessionFolder = './varesession/'

  if (!existsSync(sessionFolder)) {
    return conn.sendMessage(m.chat, {
      text: `${header}
┃  CARTELLA NON TROVATA
╰━━━━━━━━━━━━━━━━━━━━╯

La directory delle sessioni non esiste.

Percorso previsto:
${sessionFolder}`
    }, { quoted: m })
  }

  let deletedCount = 0
  let failedCount = 0

  try {
    const files = await fsPromises.readdir(sessionFolder)
    for (const file of files) {
      if (file === 'creds.json') continue
      const filePath = path.join(sessionFolder, file)
      try {
        const stat = await fsPromises.lstat(filePath)
        if (stat.isDirectory()) continue
        await fsPromises.unlink(filePath)
        deletedCount++
      } catch {
        failedCount++
      }
    }
  } catch (e) {
    return conn.sendMessage(m.chat, {
      text: `${header}
┃   ERRORE DI SISTEMA
╰━━━━━━━━━━━━━━━━━━━━╯

Impossibile pulire la directory
delle sessioni.

Dettagli: ${e.message}`
    }, { quoted: m })
  }

  let text
  if (deletedCount === 0 && failedCount === 0) {
    text = `${header}
┃   SESSIONI VUOTE
╰━━━━━━━━━━━━━━━━━━━━╯

Non ci sono file da eliminare.

Stato: NESSUNA OPERAZIONE NECESSARIA`
  } else {
    text = `${header}
┃   PULIZIA SESSIONI
╰━━━━━━━━━━━━━━━━━━━━╯

┌─ RIEPILOGO ──────────
│
│ File eliminati : ${deletedCount}
│ Errori rilevati: ${failedCount}
│
└━━━━━━━━━━━━━━━━━━━━━

${failedCount === 0 ? 'Stato: COMPLETATO CON SUCCESSO SENZA ERRORI' : 'Stato: COMPLETATO CON AVVISI'}`
  }

  await conn.sendMessage(m.chat, {
    text: text,
    buttons: [
      {
        buttonId: '.ping',
        buttonText: { displayText: 'Controlla ping' },
        type: 1
      }
    ]
  }, { quoted: m })
}

handler.help = ['ds']
handler.tags = ['owner']
handler.command = /^(ds|clearsession)$/i
handler.owner = true

export default handler