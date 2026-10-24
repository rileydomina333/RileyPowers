import { existsSync, promises as fs } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  if (global.conn?.user?.jid !== conn.user.jid) return

  const dir = './varesession/'
  if (!existsSync(dir)) {
    return conn.reply(m.chat, `· error — cartella non trovata`, m)
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
    return conn.reply(m.chat, `· error — ${e.message}`, m)
  }

  const fmt = b => b < 1024 ? `${b} b` : b < 1048576 ? `${(b/1024).toFixed(1)} kb` : `${(b/1048576).toFixed(2)} mb`
  const time = ((Date.now() - t0) / 1000).toFixed(2)

  const text = count === 0 && fail === 0 ? `
· pulizia
  ──────────
  stato · già pulito

  ${time}s
`.trim() : `
· pulizia
  ──────────
  eliminati · ${count}
  spazio    · ${fmt(size)}
  tempo     · ${time}s
  errori    · ${fail}

  ──────────
  ${fail === 0 ? 'clean' : 'warns'}
`.trim()

  await conn.reply(m.chat, text, m)
}

handler.help = ['ds']
handler.tags = ['owner']
handler.command = /^(ds|clearsession|clearsesi)$/i
handler.owner = true
handler.rowner = true

export default handler