import { existsSync, promises as fsPromises } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, {
      text: `*⟡ ACCESSO NEGATO ⟡*

💠 *Usa questo comando solo dal numero del bot*`
    }, { quoted: m })
  }

  // Cerca automaticamente la cartella sessioni
  const searchRoot = '/home/riley'

  async function findSessionFolder(dir, depth = 0) {
    if (depth > 6) return null

    let entries

    try {
      entries = await fsPromises.readdir(dir, {
        withFileTypes: true
      })
    } catch {
      return null
    }

    // Controlla prima le cartelle direttamente presenti
    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        entry.name.toLowerCase() === 'sessioni'
      ) {
        return path.join(dir, entry.name)
      }
    }

    // Cerca nelle sottocartelle
    for (const entry of entries) {
      if (
        !entry.isDirectory() ||
        ['node_modules', '.git', 'proc', 'sys', 'dev'].includes(entry.name)
      ) continue

      const found = await findSessionFolder(
        path.join(dir, entry.name),
        depth + 1
      )

      if (found) return found
    }

    return null
  }

  const sessionFolder = await findSessionFolder(searchRoot)

  console.log('📂 Directory di avvio:', process.cwd())
  console.log('📂 Directory di ricerca:', searchRoot)
  console.log('📂 Cartella sessioni trovata:', sessionFolder)

  if (!sessionFolder || !existsSync(sessionFolder)) {
    return conn.sendMessage(m.chat, {
      text: `*⟡ CARTELLA NON TROVATA ⟡*

📂 *Directory di avvio:*
${process.cwd()}

📂 *Directory di ricerca:*
${searchRoot}

💠 *Nessuna cartella sessioni trovata entro 6 livelli di profondità.*`
    }, { quoted: m })
  }

  let deletedCount = 0

  try {
    const stat = await fsPromises.stat(sessionFolder)

    if (!stat.isDirectory()) {
      throw new Error('Il percorso trovato non è una cartella.')
    }

    const files = await fsPromises.readdir(sessionFolder, {
      withFileTypes: true
    })

    for (const file of files) {
      // Non eliminare credenziali, sottocartelle o altri elementi speciali
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

💠 *Nessun file da eliminare.*

📂 *Cartella:* ${sessionFolder}`
    : `*⟡ SESSIONI ELIMINATE ⟡*

💠 *File eliminati:* ${deletedCount}

📂 *Cartella:* ${sessionFolder}

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