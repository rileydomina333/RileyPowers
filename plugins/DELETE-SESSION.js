import { existsSync, promises as fs } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const t0 = Date.now()
  if (global.conn?.user?.jid !== conn.user.jid) return

  const dir = './varesession/'
  if (!existsSync(dir)) {
    return conn.reply(m.chat, `「 error 」\n\n✗ cartella non trovata`, m)
  }

  let deleted = []
  let failed = []
  let totalSize = 0

  try {
    const files = await fs.readdir(dir)
    await Promise.all(files.map(async (f) => {
      if (f === 'creds.json') return
      const p = path.join(dir, f)
      try {
        const s = await fs.lstat(p)
        if (s.isDirectory()) return
        totalSize += s.size
        await fs.unlink(p)
        deleted.push({ name: f, size: s.size })
      } catch {
        failed.push(f)
      }
    }))
  } catch (e) {
    return conn.reply(m.chat, `「 error 」\n\n✗ ${e.message}`, m)
  }

  const format = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`
  const elapsed = ((Date.now() - t0) / 1000).toFixed(2)

  // tipi
  const types = {}
  deleted.forEach(f => {
    const ext = f.name.split('-')[0] || 'other'
    types[ext] = (types[ext] || 0) + 1
  })
  const typeLog = Object.entries(types).map(([k,v]) => `${k} ${v}`).join(' / ')

  // lista max 10
  const list = deleted.slice(0, 10).map(f => `│ ${f.name}`).join('\n')
  const more = deleted.length > 10 ? `\n│ +${deleted.length - 10} altri` : ''

  let text
  if (deleted.length === 0 && failed.length === 0) {
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
✓ eliminati : ${deleted.length}
✓ spazio : ${format(totalSize)}
✗ errori : ${failed.length}

${deleted.length ? `files :\n${list}${more}\n\n__________\n\n` : ''}stato: ${failed.length === 0 ? 'clean' : 'warns'}
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