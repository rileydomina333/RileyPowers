import { performance } from 'perf_hooks'

const toMathematicalAlphanumericSymbols = number => {
  const map = {
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗', '.': '.'
  }

  return number
    .toString()
    .split('')
    .map(d => map[d] || d)
    .join('')
}

const clockString = ms => {
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)

  return `${toMathematicalAlphanumericSymbols(days.toString().padStart(2, '0'))}d ${toMathematicalAlphanumericSymbols(hours.toString().padStart(2, '0'))}h ${toMathematicalAlphanumericSymbols(minutes.toString().padStart(2, '0'))}m`
}

const handler = async (m, { conn, usedPrefix }) => {
  const start = performance.now()
  const end = performance.now()

  const speed = (end - start).toFixed(4)
  const speedWithFont = toMathematicalAlphanumericSymbols(speed)

  const uptime = clockString(process.uptime() * 1000)

  const info = `
༻꫞ 𝗜𝗡𝗙𝗘𝗖𝗧𝗜𝗢𝗡 𝗣𝗜𝗡𝗚 ꫞༺ 
*🚀 𝐕𝐞𝐥𝐨𝐜𝐢𝐭𝐚̀:* ${speedWithFont} ms
*⏱️ 𝐀𝐭𝐭𝐢𝐯𝐢𝐭𝐚̀:* ${uptime}

> *INFECTION BOT*
`.trim()

  const buttons = [
    {
      buttonId: `${usedPrefix}menu`,
      buttonText: { displayText: '📋 Menu' },
      type: 1
    }
  ]

  await conn.sendMessage(m.chat, {
    text: info,
    buttons,
    headerType: 1
  }, { quoted: m })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^(ping)$/i

export default handler