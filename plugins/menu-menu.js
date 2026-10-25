import fs from 'fs/promises'
import { join } from 'path'

const emojicategoria = {
  info: '✦',
  main: '⚡',
  sicurezza: '🛡️'
}

const tags = {
  main: '✦ 𝐑𝐋𝐘 • 𝐌𝐀𝐈𝐍 𝐒𝐘𝐒𝐓𝐄𝐌 ✦',
  info: '✧ 𝐑𝐋𝐘 • 𝐈𝐍𝐅𝐎 𝐂𝐄𝐍𝐓𝐄𝐑 ✧',
  sicurezza: '⬡ 𝐑𝐋𝐘 • 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 ⬡'
}

const defaultMenu = {
  testoInizio: `
╭━━━〔 ✦ 𝐑 𝐋 𝐘 • 𝐁 𝐎 𝐓 ✦ 〕━━━╮
┃
┃  ◈ 𝚂𝚈𝚂𝚃𝙴𝙼 𝙰𝙲𝙲𝙴𝚂𝚂
┃  ────────────────────
┃  👤 𝚄𝚝𝚎𝚗𝚝𝚎   ⟡ @%user
┃  ⏳ 𝚄𝚙𝚝𝚒𝚖𝚎   ⟡ %uptime
┃  👥 𝚄𝚝𝚎𝚗𝚝𝚒    ⟡ %totalreg
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
`,
  header: `
╭━━〔 %category 〕━━╮
`,
  body: `┃  ⌁ %emoji  %cmd`,
  footer: `
╰━━━━━━━━━━━━━━━━━━╯
`,
  testoFine: `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃  ✦ 𝐑𝐋𝐘-𝐁𝐎𝐓 • 𝐂𝐎𝐑𝐄 𝐒𝐘𝐒𝐓𝐄𝐌
┃  ◈ 𝚂𝚝𝚊𝚋𝚕𝚎 • 𝚂𝚎𝚌𝚞𝚛𝚎 • 𝙴𝚕𝚎𝚐𝚊𝚗𝚝
╰━━━━━━━━━━━━━━━━━━━━━━╯
`
}

const localImg = './WA_1792617306300.jpeg'

const buttons = [
  ['⚙️', '.attiva'],
  ['🎮', '.menugiochi'],
  ['✧', '.menuia'],
  ['👥', '.menugruppo'],
  ['⇩', '.menudownload'],
  ['🧰', '.menustrumenti'],
  ['♛', '.menupremium'],
  ['€', '.menueuro']
]

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const help = Object.create(null)
    const categories = Object.create(null)

    for (const plugin of Object.values(global.plugins || {})) {
      if (!plugin || plugin.disabled) continue

      const commandList = Array.isArray(plugin.help)
        ? plugin.help
        : typeof plugin.help === 'string'
          ? [plugin.help]
          : []

      if (!commandList.length || !plugin.tags) continue

      for (const tag of plugin.tags) {
        if (!['main', 'info', 'sicurezza'].includes(tag)) continue

        categories[tag] = categories[tag] || []
        help[tag] = help[tag] || []

        for (const command of commandList) {
          if (typeof command !== 'string') continue

          const entry = {
            command,
            plugin,
            emoji: emojicategoria[tag] || '✦'
          }

          categories[tag].push(entry)
          help[tag].push(entry)
        }
      }
    }

    const uptime = clockString(process.uptime() * 1000)
    const totalreg = Object.keys(global.db?.data?.users || {}).length

    let menu = defaultMenu.testoInizio
      .replace(/%user/g, m.pushName || 'User')
      .replace(/%uptime/g, uptime)
      .replace(/%totalreg/g, totalreg)

    for (const category of Object.keys(tags)) {
      if (!help[category]?.length) continue

      menu += defaultMenu.header.replace(
        /%category/g,
        tags[category]
      )

      const commands = [...new Map(
        help[category].map(item => [item.command, item])
      ).values()]

      for (const item of commands) {
        menu += defaultMenu.body
          .replace(/%emoji/g, item.emoji)
          .replace(/%cmd/g, `${_p}${item.command}`)
      }

      menu += defaultMenu.footer
      menu += '\n'
    }

    menu += defaultMenu.testoFine

    const buttonRows = buttons.map(([displayText, id]) => ({
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: displayText,
        id
      })
    }))

    const message = {
      image: await fs.readFile(localImg).catch(() => null),
      caption: menu,
      footer: '✦ 𝐑𝐋𝐘 • 𝐋𝐔𝐗𝐔𝐑𝐘 𝐂𝐎𝐑𝐄 ✦',
      buttons: buttonRows,
      headerType: 4,
      viewOnce: true,
      mentions: [m.sender]
    }

    if (message.image) {
      await conn.sendMessage(m.chat, message, { quoted: m })
    } else {
      delete message.image
      await conn.sendMessage(m.chat, message, { quoted: m })
    }

    await conn.sendMessage(m.chat, {
      react: {
        text: '✦',
        key: m.key
      }
    })
  } catch (error) {
    console.error('Errore nel menu RLY:', error)
    await conn.sendMessage(
      m.chat,
      { text: '✧ Si è verificato un errore durante la creazione del menu.' },
      { quoted: m }
    )
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', '?']

export default handler

function clockString(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60

  return [h, m, s]
    .map(v => String(v).padStart(2, '0'))
    .join(':')
}