import { existsSync, promises as fsPromises } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, {
      text: `*⟡ ACCESSO NEGATO ⟡*

💠 *Usa questo comando solo dal numero del bot*`
    }, { quoted: m })
  }

  // Percorso della cartella sessioni
  const sessionFolder = path.resolve(process.cwd(), 'sessioni')

  console.log('📂 Directory di avvio:', process.cwd())
  console.log('📂 Percorso sessioni:', sessionFolder)
  console.log('📂 Cartella esistente:', existsSync(sessionFolder))

  if (!existsSync(sessionFolder)) {
    return conn.sendMessage(m.chat, {
      text: `*⟡ CARTELLA NON TROVATA ⟡*

📂 *Directory di avvio:*
${process.cwd()}

📂 *Percorso cercato:*
${sessionFolder}

💠 *Controlla dove si trova realmente la cartella sessioni.*`
    }, { quoted: m })
  }

  let deletedCount = 0

  try {
    const stat = await fsPromises.stat(sessionFolder)

    if (!stat.isDirectory()) {
      throw new Error('Il percorso indicato non è una cartella.')
    }

    const files = await fsPromises.readdir(sessionFolder, {
      withFileTypes: true
    })

    for (const file of files) {
      // Conserva le credenziali e tutte le sottocartelle
      if (file.name === 'creds.json' || !file.isFile()) {
        continue
      }

      await fsPromises.unlink(path.join(sessionFolder, file.name))
      deletedCount++
    }
  } catch (e) {
    console.error('Errore durante la pulizia:', e)

    return conn.sendMessage(m.chat, {
      text: `*⟡ ERRORE ⟡*

💠 ${e.message}`
    }, { quoted: m })
  }

  const text = deletedCount === 0
    ? `*⟡ SVUOTAMENTO COMPLETATO ⟡*

💠 *Nessun file da eliminare.*`
    : `*⟡ SESSIONI ELIMINATE ⟡*

💠 *Sono stati eliminati ${deletedCount} file dalla cartella sessioni.*

💠 *Operazione completata!*`

  await conn.sendMessage(m.chat, {
    text,
    footer: 'RLY BOT',
    buttons: [
      {
        buttonId: '.svuota',
        buttonText: { displayText: '💠 Svuota di nuovo' },
        type: 1
      },
      {
        buttonId: '.ping',
        buttonText: { displayText: '💠 Ping' },
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