import { existsSync, promises as fs } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const start = Date.now()
  if (global.conn?.user?.jid !== conn.user.jid) return

  const dir = './varesession/'
  if (!existsSync(dir)) {
    return conn.reply(m.chat, `「 ✦ error 」\n\n✗ folder not found\n> ${dir}`, m)
  }

  let deleted = []
  let failed = []
  let totalSize = 0
  let beforeFiles = 0

  try {
    const files = await fs.readdir(dir)
    beforeFiles = files.length

    await Promise.all(files.map(async (f) => {
      if (f === 'creds.json') return
      const p = path.join(dir, f)
      try {
        const s = await fs.lstat(p)
        if (s.isDirectory()) return
        totalSize += s.size
        await fs.unlink(p)
        deleted.push({ name: f, size: s.size })
      } catch (e) {
        failed.push({ name: f, reason: e.message })
      }
    }))

  } catch (e) {
    return conn.reply(m.chat, `「 ✦ system error 」\n\n✗ ${e.message}`, m)
  }

  const format = (b) => {
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / 1024 / 1024).toFixed(2)} MB`
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(2)
  const remain = beforeFiles - deleted.length - failed.length

  // raggruppa per tipo
  const types = {}
  deleted.forEach(f => {
    const ext = f.name.split('.').pop() || 'no-ext'
    types[ext] = (types[ext] || 0) + 1
  })
  const typeLog = Object.entries(types).map(([k,v]) => `${k}: ${v}`).join(' / ') || 'nessuno'

  // lista file (max 15 per non spammare)
  const listLog = deleted.slice(0, 15).map(f => `│  • ${f.name} (${format(f.size)})`).join('\n')
  const more = deleted.length > 15 ? `\n│  • ... +${deleted.length - 15} altri` : ''

  let text
  if (deleted.length === 0 && failed.length === 0) {
    text = `
「 varesession 」
__________

✓ system clean
> nessun file da eliminare
> creds.json protetto

__________
path: ${dir}
check: ${elapsed}s
`.trim()
  } else {
    text = `
「 pulizia sessioni 」
__________

info :
✓ path : ${dir}
✓ time : ${elapsed}s
✓ before : ${beforeFiles} files
✓ after : ${remain + 1} files ( + creds.json )

rules :
✓ deleted : ${deleted.length}
✓ types : ${typeLog}
✓ freed : ${format(totalSize)}
✗ failed : ${failed.length}

${deleted.length ? `files :\n${listLog}${more}\n\n__________\n\n` : ''}${failed.length ? `errors :\n${failed.map(f => `│  ✗ ${f.name}`).join('\n')}\n\n__________\n\n` : ''}stato: ${failed.length === 0 ? 'clean ✓' : 'clean with warns'}
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