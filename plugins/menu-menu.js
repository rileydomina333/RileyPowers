import { promises as fs } from 'fs'
import { join } from 'path'

const emojiCat = {
  info: '🌌',
  main: '⚡',
  sicurezza: '🛡️',
  gruppo: '👥',
  download: '📥',
  strumenti: '🛠️',
  giochi: '🎮',
  ia: '🤖'
}

let tags = {
  main: 'MAIN SYSTEM',
  info: 'INFO BASE',
  sicurezza: 'SICUREZZA',
  gruppo: 'GRUPPO',
  download: 'DOWNLOAD',
  strumenti: 'STRUMENTI',
  giochi: 'GIOCHI',
  ia: 'INTELLIGENZA'
}

const defaultMenu = {
  before: `
╭─〔 🌌 RLY-BOT • GALAXY BLUE 〕─
│ Utente: @%user
│ Uptime: %uptime
│ Utenti: %totalreg
│ Versione: Galaxy 2.0
╰──────────────────
`.trim(),

  header: '\n┌─〔 %category 〕',
  body: '│ ◦ %cmd',
  footer: '└────────────────',
  after: '\n_Powered by RLY-BOT Galaxy Blue_',
}

const menuImage = './media/menu.jpg' // metti qui la tua foto galassia

const sections = [
  { title: "🛡️ SICUREZZA", command: "attiva" },
  { title: "🎮 GIOCHI", command: "menugiochi" },
  { title: "🤖 IA", command: "menuia" },
  { title: "👥 GRUPPO", command: "menugruppo" },
  { title: "📥 DOWNLOAD", command: "menudownload" },
  { title: "🛠️ STRUMENTI", command: "menustrumenti" },
  { title: "⭐ PREMIUM", command: "menupremium" },
  { title: "💰 ECONOMIA", command: "menueuro" }
]

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    await conn.sendPresenceUpdate('composing', m.chat)

    let uptime = clockString(process.uptime() * 1000)
    let totalreg = Object.keys(global.db.data.users).length
    let userId = m.sender.split('@')[0]

    // Prende tutti i plugin
    let help = Object.values(global.plugins)
     .filter(p =>!p.disabled)
     .map(p => ({
        help: Array.isArray(p.help)? p.help : [p.help],
        tags: Array.isArray(p.tags)? p.tags : [p.tags],
        prefix: 'customPrefix' in p
      }))

    let text = defaultMenu.before
     .replace(/%user/g, userId)
     .replace(/%uptime/g, uptime)
     .replace(/%totalreg/g, totalreg)

    for (let tag of Object.keys(tags)) {
      let cmds = help
       .filter(menu => menu.tags.includes(tag))
       .flatMap(menu => menu.help.map(h => {
          let cmd = menu.prefix? h : _p + h
          return defaultMenu.body.replace(/%cmd/g, cmd)
        }))
       .join('\n')

      if (cmds) {
        text += '\n' + defaultMenu.header.replace(/%category/g, tags[tag]) + '\n' + cmds + '\n' + defaultMenu.footer
      }
    }

    text += '\n' + defaultMenu.after

    // Pulsanti
    const buttons = sections.map(s => ({
      buttonId: `${_p}${s.command}`,
      buttonText: { displayText: s.title },
      type: 1
    }))

    // Immagine con fallback
    let imgBuffer
    try {
      imgBuffer = await fs.readFile(join(process.cwd(), menuImage))
    } catch {
      try {
        imgBuffer = await fs.readFile('./WA_1791285295586.jpeg')
      } catch {
        imgBuffer = null
      }
    }

    await conn.sendMessage(m.chat, {
     ...(imgBuffer? { image: imgBuffer } : {}),
      caption: text.trim(),
      footer: '🌌 RLY-BOT • Galaxy Blue Edition',
      buttons: buttons,
      headerType: 4,
      mentions: [m.sender]
    }, { quoted: m })

    await m.react('🌌')

  } catch (e) {
    console.error('menu error:', e)
    conn.reply(m.chat, `Errore menu: ${e.message}`, m)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menù']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${h}h ${m}m ${s}s`
}