import { existsSync, promises as fs } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  // Solo il bot principale può farlo
  if (global.conn?.user?.jid !== conn.user.jid) {
    return conn.reply(m.chat, `╭─〔 ✦ ACCESSO NEGATO 〕─╮\n│ Non sei il bot principale.\n╰────────────────────╯`, m)
  }

  const sessionFolder = './varesession/'
  if (!existsSync(sessionFolder)) {
    return conn.reply(m.chat, `╭─〔 ✦ ERRORE 〕─╮\n│ Cartella non trovata:\n│ ${sessionFolder}\n╰────────────────╯`, m)
  }

  let deleted = 0
  let failed = 0
  let totalSize = 0

  try {
    const files = await fs.readdir(sessionFolder)

    await Promise.all(files.map(async (file) => {
      if (file === 'creds.json') return
      const filePath = path.join(sessionFolder, file)
      try {
        const stat = await fs.lstat(filePath)
        if (stat.isDirectory()) return
        totalSize += stat.size
        await fs.unlink(filePath)
        deleted++
      } catch {
        failed++
      }
    }))

  } catch (e) {
    return conn.reply(m.chat, `╭─〔 ✦ ERRORE SISTEMA 〕─╮\n│ ${e.message}\n╰──────────────────────╯`, m)
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  let text
  if (deleted === 0 && failed === 0) {
    text = `
╭━━━━━━━━━━━━━━━━╮
┃  SESSIONI PULITE
╰━━━━━━━━━━━━━━━━╯

> Nessun file da eliminare.
> Tutto già pulito.

Stato: ✓ OK
`.trim()
  } else {
    text = `
╭━━━━━━━━━━━━━━━━╮
┃ PULIZIA SESSIONI
╰━━━━━━━━━━━━━━━━╯

┌─ Riepilogo
│
│ • Eliminati: ${deleted}
│ • Errori: ${failed}
│ • Spazio liberato: ${formatSize(totalSize)}
│
└──────────────

Stato: ${failed === 0 ? '✓ SUCCESSO' : '⚠ CON AVVISI'}
`.trim()
  }

  await conn.reply(m.chat, text, m)
}

handler.help = ['ds']
handler.tags = ['owner']
handler.command = /^(ds|clearsession|clearsesi)$/i
handler.owner = true
handler.rowner = true

export default handler