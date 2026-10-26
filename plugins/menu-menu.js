import { promises as fs } from 'fs'

const emojicategoria = {
info: '⁉️',
main: '🦋',
sicurezza: '🛡️'
}

let tags = {
main: '╭ "𝐑𝐋𝐘 𝐌𝐀𝐈𝐍" ╯',
info: '╭ "𝐑𝐋𝐘 𝐈𝐍𝐅𝐎" ╯'
}

const defaultMenu = {
before: " ╭⭒─ׄ─⊱ *𝐑 𝐋 𝐘 • 𝐁 𝐎 𝐓* ⊰ ✦ 👤 \"Utente:` %name
✧ ⚡ `Attivo da:` %uptime
✦ 👥 `Utenti:` %totalreg
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒

`.trimStart(),

header: '      ⋆｡˚『 %category 』˚｡⋆\n╭',
body: '│ ➤ 『%emoji』%cmd',
footer: '╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─\n',
after: ''
}

const localImg = './WA_1792617306300.jpeg'

function detectDevice(msgID) {
if (!msgID) return 'unknown'

if (/^[a-zA-Z]+-[a-fA-F0-9]+$/.test(msgID)) {
return 'bot'
} else if (
msgID.startsWith('false_') ||
msgID.startsWith('true_')
) {
return 'web'
} else if (
msgID.startsWith('3EB0') &&
/^[A-Z0-9]+$/.test(msgID)
) {
return 'web'
} else if (msgID.includes(':')) {
return 'desktop'
} else if (/^[A-F0-9]{32}$/i.test(msgID)) {
return 'android'
} else if (
/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(msgID)
) {
return 'ios'
} else if (
/^[A-Z0-9]{20,25}$/i.test(msgID) &&
!msgID.startsWith('3EB0')
) {
return 'ios'
}

return 'unknown'
}

function getRandomMenus() {
const allMenus = [
{
title: '🛡️ Sicurezza',
description: 'Protezione e sicurezza',
command: 'attiva'
},
{
title: '🎮 Giochi',
description: 'Giochi e divertimento',
command: 'menugiochi'
},
{
title: '🤖 Intelligenza Artificiale',
description: 'Funzioni IA',
command: 'menuia'
},
{
title: '👥 Gruppo',
description: 'Gestione dei gruppi',
command: 'menugruppo'
},
{
title: '📥 Download',
description: 'Scarica contenuti',
command: 'menudownload'
},
{
title: '🛠️ Strumenti',
description: 'Utilità e strumenti',
command: 'menustrumenti'
},
{
title: '⭐ Premium',
description: 'Funzioni premium',
command: 'menupremium'
},
{
title: '💰 Euro',
description: 'Sistema economico',
command: 'menueuro'
},
{
title: '🔍 Ricerche',
description: 'Ricerca online',
command: 'menuricerche'
},
{
title: '👨‍💻 Creatore',
description: 'Comandi proprietario',
command: 'menucreatore'
}
]

return allMenus
.sort(() => Math.random() - 0.5)
.slice(0, 5)
}

let handler = async (m, { conn, usedPrefix: _p }) => {
try {
await conn.sendPresenceUpdate('composing', m.chat)

let name = await conn.getName(m.sender) || 'Utente'
let uptime = clockString(process.uptime() * 1000)
let totalreg = Object.keys(global.db.data.users).length

let help = Object.values(global.plugins)
  .filter(plugin => !plugin.disabled)
  .map(plugin => ({
    help: Array.isArray(plugin.help)
      ? plugin.help
      : plugin.help
        ? [plugin.help]
        : [],
    tags: Array.isArray(plugin.tags)
      ? plugin.tags
      : plugin.tags
        ? [plugin.tags]
        : [],
    prefix: 'customPrefix' in plugin
  }))

let menuTags = Object.keys(tags)

let _text = [
  defaultMenu.before,

  ...menuTags.map(tag => {
    let commands = help
      .filter(menu =>
        menu.tags.includes(tag) && menu.help.length
      )
      .map(menu =>
        menu.help.map(command => {
          let rawCmd = menu.prefix
            ? command
            : '%p' + command

          return defaultMenu.body
            .replace(/%cmd/g, toTypewriter(rawCmd))
            .replace(/%emoji/g, emojicategoria[tag] || '❔')
            .trim()
        }).join('\\n')
      )

    return (
      defaultMenu.header.replace(
        /%category/g,
        tags[tag]
      ) +
      '\\n' +
      commands.join('\\n') +
      '\\n' +
      defaultMenu.footer
    )
  }),

  defaultMenu.after
].join('\\n')

const replace = {
  '%': '%',
  p: _p,
  uptime,
  name,
  totalreg
}

let text = _text.replace(
  /%([a-zA-Z]+)/g,
  (match, key) =>
    Object.prototype.hasOwnProperty.call(replace, key)
      ? String(replace[key])
      : match
).trim()

const msgID = m.id || m.key?.id
const deviceType = detectDevice(msgID)
const isGroup = m.chat.endsWith('@g.us')

let imageBuffer = null

try {
  imageBuffer = await fs.readFile(localImg)
} catch {
  console.log('⚠️ Immagine locale non trovata: invio il menu senza immagine.')
}

// iOS: pulsanti tradizionali con cinque menu casuali
if (deviceType === 'ios') {
  const randomMenus = getRandomMenus()

  const buttons = randomMenus.map(menu => ({
    buttonId: _p + menu.command,
    buttonText: {
      displayText: menu.title
    },
    type: 1
  }))

  await conn.sendMessage(m.chat, {
    ...(imageBuffer ? { image: imageBuffer } : {}),
    caption: text,
    footer: '⚡ RLY-BOT Core System',
    buttons,
    headerType: imageBuffer ? 4 : 1,
    mentions: [m.sender]
  }, { quoted: m })

} else if (isGroup) {
  // Gruppi: menu interattivo con selezione singola
  const rowsConsigliati = [
    {
      id: _p + 'menuia',
      title: '🤖 Menu IA',
      description: 'Intelligenza artificiale'
    },
    {
      id: _p + 'menupremium',
      title: '⭐ Menu Premium',
      description: 'Funzionalità premium'
    }
  ]

  const rowsStandard = [
    {
      id: _p + 'attiva',
      title: '🛡️ Sicurezza',
      description: 'Protezione e sicurezza'
    },
    {
      id: _p + 'menugiochi',
      title: '🎮 Menu Giochi',
      description: 'Giochi e divertimento'
    },
    {
      id: _p + 'menugruppo',
      title: '👥 Menu Gruppo',
      description: 'Gestione gruppi'
    },
    {
      id: _p + 'menudownload',
      title: '📥 Menu Download',
      description: 'Scarica contenuti'
    },
    {
      id: _p + 'menustrumenti',
      title: '🛠️ Menu Strumenti',
      description: 'Utilità e strumenti'
    },
    {
      id: _p + 'menueuro',
      title: '💰 Menu Euro',
      description: 'Sistema economico'
    },
    {
      id: _p + 'menuricerche',
      title: '🔍 Menu Ricerche',
      description: 'Ricerca online'
    },
    {
      id: _p + 'menucreatore',
      title: '👨‍💻 Menu Creatore',
      description: 'Comandi proprietario'
    }
  ]

  await conn.sendMessage(m.chat, {
    ...(imageBuffer
      ? { media: imageBuffer }
      : {}),
    interactiveButtons: [{
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: 'Menu Principale',
        sections: [
          {
            title: '⭐ Menu Consigliati ⭐',
            highlight_label: 'CONSIGLIATO',
            rows: rowsConsigliati
          },
          {
            title: '⚡ Menu RLY-BOT',
            highlight_label: 'STANDARD',
            rows: rowsStandard
          }
        ]
      })
    }],
    text,
    title: '⚡ RLY-BOT',
    footer: 'RLY-BOT Core System'
  }, { quoted: m })

} else {
  // Chat privata: menu a elenco
  const sections = [
    {
      title: '⭐ Menu Consigliati ⭐',
      rows: [
        {
          title: '🤖 Menu IA',
          description: 'Intelligenza artificiale',
          rowId: _p + 'menuia'
        },
        {
          title: '⭐ Menu Premium',
          description: 'Funzionalità premium',
          rowId: _p + 'menupremium'
        }
      ]
    },
    {
      title: '⚡ Menu RLY-BOT',
      rows: [
        {
          title: '🛡️ Sicurezza',
          description: 'Protezione e sicurezza',
          rowId: _p + 'attiva'
        },
        {
          title: '🎮 Menu Giochi',
          description: 'Giochi e divertimento',
          rowId: _p + 'menugiochi'
        },
        {
          title: '👥 Menu Gruppo',
          description: 'Gestione gruppi',
          rowId: _p + 'menugruppo'
        },
        {
          title: '📥 Menu Download',
          description: 'Scarica contenuti',
          rowId: _p + 'menudownload'
        },
        {
          title: '🛠️ Menu Strumenti',
          description: 'Utilità e strumenti',
          rowId: _p + 'menustrumenti'
        },
        {
          title: '💰 Menu Euro',
          description: 'Sistema economico',
          rowId: _p + 'menueuro'
        },
        {
          title: '🔍 Menu Ricerche',
          description: 'Ricerca online',
          rowId: _p + 'menuricerche'
        },
        {
          title: '👨‍💻 Menu Creatore',
          description: 'Comandi proprietario',
          rowId: _p + 'menucreatore'
        }
      ]
    }
  ]

  await conn.sendMessage(m.chat, {
    ...(imageBuffer ? { image: imageBuffer } : {}),
    caption: text,
    footer: '⚡ RLY-BOT Core System',
    title: '⚡ RLY-BOT',
    buttonText: 'Menu disponibili',
    sections,
    mentions: [m.sender]
  }, { quoted: m })
}

await m.react('⚡')

} catch (e) {
console.error(e)
conn.reply(
m.chat,
"❌ Errore RLY-SYS: ${e.message}",
m
)
}
}

handler.help = ['menu']
handler.command = [
'menu',
'help',
'menuall',
'menucompleto',
'funzioni',
'comandi'
]

export default handler

function clockString(ms) {
let h = Math.floor(ms / 3600000)
let m = Math.floor(ms / 60000) % 60
let s = Math.floor(ms / 1000) % 60

return [h, m, s]
.map(v => String(v).padStart(2, '0'))
.join(':')
}

function toTypewriter(str) {
const normal =
'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const typewriter =
'𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'

return str.split('').map(char => {
const index = normal.indexOf(char)

return index !== -1
  ? Array.from(typewriter).slice(index, index + 1).join('')
  : char

}).join('')
}