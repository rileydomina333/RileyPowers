import { existsSync, promises as fs } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const t0 = Date.now()
  if (global.conn?.user?.jid !== conn.user.jid) return

  const dir = './varesession/'
  if (!existsSync(dir)) {
    return conn.reply(m.chat, `「 error 」\n\n✗ cartella non trovata`, m)
  }

  let deleted = 0
  let failed = 0
  let totalSize = 0
  let types = {}

  try {
    const files = await fs.readdir(dir)
    await Promise.all(files.map(async (f) => {
      if (f === 'creds.json') return
      const p = path.join(dir, f)
      try {
        const s = await fs.lstat(p)
        if (s.isDirectory()) return
        totalSize += s.size
        const ext = f.split('-')[0] || 'other'
        types[ext] = (types[ext] || 0) + 1
        await fs.unlink(p)
        deleted++
      } catch { failed++ }
    }))
  } catch (e) {
    return conn.reply(m.chat, `「 error 」\n\n✗ ${e.message}`, m)
  }

  const format = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`
  const elapsed = ((Date.now() - t0) / 1000).toFixed(2)
  const typeLog = Object.entries(types).map(([k,v]) => `${k} ${v}`).join(' / ')

  let text
  if (deleted === 0 && failed === 0) {
    text = `
「 pulizia 」
__________

✓ già pulito
✓ creds protetto

__________
time: ${elapsed}s
`.trim()
  } else {
    text = `
「 pulizia 」
__________

info :
✓ tempo : ${elapsed}s
✓ tipi : ${typeLog || '—'}

data :
✓ eliminati : ${deleted}
✓ spazio : ${format(totalSize)}
✗ errori : ${failed}

__________
stato: ${failed === 0 ? 'clean' : 'warns'}
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