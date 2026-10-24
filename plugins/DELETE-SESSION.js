import { existsSync, promises as fs } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  if (global.conn?.user?.jid !== conn.user.jid) return

  const dir = './varesession/'
  if (!existsSync(dir)) {
    return conn.reply(m.chat, `「 error 」\n\n✗ folder not found`, m)
  }

  let deleted = 0
  let failed = 0
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
        deleted++
      } catch { failed++ }
    }))
  } catch (e) {
    return conn.reply(m.chat, `「 error 」\n\n✗ ${e.message}`, m)
  }

  const format = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(2)} MB`

  let text
  if (deleted === 0 && failed === 0) {
    text = `
「 pulizia 」
__________

✓ già pulito
`.trim()
  } else {
    text = `
「 pulizia 」
__________

✓ eliminati : ${deleted}
✓ liberati : ${format(totalSize)}
${failed ? `✗ errori : ${failed}` : ''}

__________
${failed === 0 ? 'stato: clean' : 'stato: warns'}
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