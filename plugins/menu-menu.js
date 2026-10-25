import { promises as fs } from 'fs'

const emojicategoria = {
  info: '⚡',
  main: '🌩️',
  sicurezza: '🛡️'
}

const tags = {
  main: '⚡ ʀʟʏ 𝙼𝙰𝙸𝙽 𝚂𝚈𝚂𝚃𝙴𝙼 ⚡',
  info: '⚡ ʀʟʏ 𝙸𝙽𝙵𝙾 𝙱𝙰𝚂𝙴 ⚡'
}

const defaultMenu = {
  testoInizio: `
⚡  〔 𝐑 𝐋 𝐘 • 𝐁 𝐎 𝐓 〕  ⚡

┃ 👤 𝚄𝚝𝚎𝚗𝚝𝚎 ⟡ @%user
┃ ⏳ 𝚄𝚙𝚝𝚒𝚖𝚎 ⟡ %uptime
┃ 👥 𝚄𝚝𝚎𝚗𝚝𝚒 ⟡ %totalreg

╭─「 𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎 」─╮
`.trim(),

  header: '\n〔 %category 〕',
  body: '┃ ⌲ %emoji %cmd',
  footer: '\n╰━━━━━━━━━━━━━━━━━━╯\n⚡ RLY-BOT Core System'
}

const localImg = './WA_1792617306300.jpeg'

const bldButtons = [
  { title: '🛡️ SICUREZZA', command: 'attiva' },
  { title: '🎮 GIOCHI', command: 'menugiochi' },
  { title: '🤖 IA', command: 'menuia' },
  { title: '👥 GRUPPO', command: 'menugruppo' },
  { title: '📥 DOWNLOAD', command: 'menudownload' },
  { title: '🛠️ STRUMENTI', command: 'menustrumenti' },
  { title: '⭐ PREMIUM', command: 'menupremium' },
  { title: '💰 EURO', command: 'menueuro' }
]

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    await conn.sendPresenceUpdate('composing', m.chat)

    const who = m.sender
    const uptime = clockString(process.uptime() * 1000)
    const totalreg = Object.keys(global.db.data.users).length

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p
      }))

    const sections = Object.keys(tags).map(tag => {
      const commands = help
        .filter(menu => menu.tags.includes(tag))
        .flatMap(menu =>
          menu.help.filter(Boolean).map(h => {
            const rawCmd = menu.prefix ? h : _p + h

            return defaultMenu.body
              .replace(/%cmd/g, toTypewriter(rawCmd))
              .replace(/%emoji/g, emojicategoria[tag] || '⚡')
          })
        )
        .join('\n')

      return commands
        ? defaultMenu.header.replace(/%category/g, tags[tag]) +
          '\n' + commands
        : ''
    }).filter(Boolean)

    const text = [
      defaultMenu.testoInizio,
      ...sections,
      defaultMenu.footer
    ].join('\n')
      .replace(/%user/g, who.split('@')[0])
      .replace(/%uptime/g, uptime)
      .replace(/%totalreg/g, String(totalreg))

    const buttons = bldButtons.map(btn => ({
      buttonId: _p + btn.command,
      buttonText: { displayText: btn.title },
      type: 1
    }))

    let imageBuffer = null

    try {
      imageBuffer = await fs.readFile(localImg)
    } catch {
      console.log('⚠️ Immagine non trovata')
    }

    await conn.sendMessage(m.chat, {
      ...(imageBuffer ? { image: imageBuffer } : {}),
      caption: text.trim(),
      footer: '⚡ RLY-BOT Core System',
      buttons,
      headerType: 4,
      viewOnce: true,
      mentions: [who]
    }, { quoted: m })

    await m.react('⚡')

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, `❌ Errore RLY-SYS: ${e.message}`, m)
  }
}

handler.help = ['menu']
handler.command = ['menu', 'help']

export default handler

function clockString(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60

  return [h, m, s]
    .map(v => v.toString().padStart(2, '0'))
    .join(':')
}

function toTypewriter(str) {
  const normal =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const styled = Array.from(
    '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣' +
    '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉' +
    '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'
  )

  const chars = Array.from(normal)

  return Array.from(str).map(char => {
    const index = chars.indexOf(char)
    return index !== -1 ? styled[index] : char
  }).join('')
}