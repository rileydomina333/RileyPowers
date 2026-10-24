import { existsSync, promises as fs } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  if (global.conn?.user?.jid !== conn.user.jid) return

  const dir = './varesession/'
  if (!existsSync(dir)) {
    return conn.reply(m.chat, `╭─ error ─╮\n│ cartella non trovata\n╰──────────╯`, m)
  }

  const t0 = Date.now()
  let count = 0, fail = 0, size = 0

  try {
    const files = await fs.readdir(dir)
    await Promise.all(files.map(async f => {
      if (f === 'creds.json') return
      const p = path.join(dir, f)
      try {
        const s = await fs.lstat(p)
        if (s.isDirectory()) return
        size += s.size
        await fs.unlink(p)
        count++
      } catch { fail++ }
    }))
  } catch (e) {
    return conn.reply(m.chat, `╭─ error ─╮\n│ ${e.message}\n╰────────╯`, m)
  }

  const fmt = b => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`
  const time = ((Date.now() - t0) / 1000).toFixed(2)
  const ping = Date.now() - m.messageTimestamp * 1000
  const pingFix = ping > 0 && ping < 5000 ? `${ping} ms` : `${time}s`

  const text = count === 0 && fail === 0 ? `
╭─ pulizia sessioni ─╮
│
│  ○ stato : già pulito
│  ○ creds : protetto
│
│  ──────────────
│  ○ ping : ${pingFix}
│  ○ time : ${time}s
│
╰────────────────╯
`.trim() : `
╭─ pulizia sessioni ─╮
│
│  ○ eliminati : ${count}
│  ○ spazio    : ${fmt(size)}
│  ○ ping      : ${pingFix}
│  ○ tempo     : ${time}s
│  ○ errori    : ${fail}
│
│  ──────────────
│  ○ ${fail === 0 ? 'clean' : 'completato con avvisi'}
│
╰────────────────╯
`.trim()

  await conn.sendMessage(m.chat, {
    text: text,
    buttons: [
      { buttonId: '.ping', buttonText: { displayText: '◍ ping' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.help = ['ds']
handler.tags = ['owner']
handler.command = /^(ds|clearsession|clearsesi)$/i
handler.owner = true
handler.rowner = true

export default handler