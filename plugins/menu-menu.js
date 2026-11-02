import { promises as fs } from 'fs'

const localImg = './file_00000000e74081f4b08f65dfd8fe555e.png'

const emojicategoria = {
  info: '⚡',
  main: '🌩️',
  sicurezza: '🛡️'
}

let tags = {
  main: '⚡ ʀʟʏ 𝙼𝙰𝙸𝙽 𝚂𝚈𝚂𝚃𝙴𝙼 ⚡',
  info: '⚡ ʀʟʏ 𝙸𝙽𝙵𝙾 𝙱𝙰𝚂𝙴 ⚡'
}

const bldButtons = [
  { title: "🛡️ SICUREZZA", command: "attiva" },
  { title: "🎮 GIOCHI", command: "menugiochi" },
  { title: "🤖 IA", command: "menuia" },
  { title: "👥 GRUPPO", command: "menugruppo" },
  { title: "📥 DOWNLOAD", command: "menudownload" },
  { title: "🛠️ STRUMENTI", command: "menustrumenti" },
  { title: "⭐ PREMIUM", command: "menupremium" },
  { title: "💰 EURO", command: "menueuro" }
]

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    await conn.sendPresenceUpdate('composing', m.chat)

    let name = await conn.getName(m.sender) || 'Utente'
    let uptime = clockString(process.uptime() * 1000)
    let totalreg = Object.keys(global.db.data.users).length
    let userJid = m.sender

    let help = Object.values(global.plugins).filter(p => !p.disabled).map(p => ({
      help: Array.isArray(p.help) ? p.help : [p.help],
      tags: Array.isArray(p.tags) ? p.tags : [p.tags],
      prefix: 'customPrefix' in p
    }))

    let menuTags = Object.keys(tags)
    
    let dynamicMenu = menuTags.map(tag => {
      let commands = help
        .filter(menu => menu.tags.includes(tag))
        .flatMap(menu => menu.help.map(h => {
          let rawCmd = menu.prefix ? h : `${_p}${h}`
          return `*│ ➤* ${emojicategoria[tag] || '⚡'} ${toTypewriter(rawCmd)}`
        })).join('\n')

      if (!commands) return ''
      return `╭⭒─ׄ─⊱ *${tags[tag]}* ⊰\n${commands}\n╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`
    }).filter(v => v).join('\n\n')

    let text = `
╭⭒─ׄ─⊱ *𝐌𝐄𝐍𝐔 - 𝐑𝐋𝐘 𝐁𝐎𝐓* ⊰
✦ 👤 \`Utente:\` *${name}*
✧ 🪐 \`Attivo da:\` *${uptime}*
✦ 👥 \`Utenti:\` *${totalreg}*
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒

      ⋆｡˚『 𝐌𝐄𝐍𝐔 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐈𝐋𝐈 』˚｡⋆

${dynamicMenu}

╭⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒
*│ ➤* ⭐ ${_p}menupremium
*│ ➤* 🛠️ ${_p}menustrumenti
*│ ➤* 💰 ${_p}menueuro
*│ ➤* 🎮 ${_p}menugiochi
*│ ➤* 👥 ${_p}menugruppo
*│ ➤* 📥 ${_p}menudownload
*│ ➤* 🛡️ ${_p}menumod
*│ ➤* 🚨 ${_p}menusicurezza
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*
`.trim()

    const buttons = bldButtons.map(btn => ({
      buttonId: _p + btn.command,
      buttonText: { displayText: btn.title },
      type: 1
    }))

    let imageBuffer = null
    try {
      imageBuffer = await fs.readFile(localImg)
    } catch (e) {
      console.log("⚠️ Immagine NON trovata:", localImg)
    }

    await conn.sendMessage(m.chat, {
      ...(imageBuffer ? { image: imageBuffer } : {}),
      caption: text,
      buttons: buttons,
      headerType: 4,
      viewOnce: true,
      mentions: [userJid]
    }, { quoted: m })

    await m.react('⚡')

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Errore RLY-SYS: ${e.message}`, m)
  }
}

handler.help = ['menu']
handler.command = ['menu', 'help', 'menuall', 'menucompleto']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

function toTypewriter(str) {
  const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const typewriter = "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"
  return str.split('').map(char => {
    const index = normal.indexOf(char)
    return index !== -1 ? [...typewriter][index] || char : char
  }).join('')
}