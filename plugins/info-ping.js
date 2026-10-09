import { performance } from 'perf_hooks'

const toMathematicalAlphanumericSymbols = number => {
  const map = {
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗', '.': '.'
  }
  return number.toString().split('').map(d => map[d] || d).join('')
}

const clockString = ms => {
  const giorni = Math.floor(ms / 86400000)
  const ore = Math.floor((ms % 86400000) / 3600000)
  const minuti = Math.floor((ms % 3600000) / 60000)
  const secondi = Math.floor((ms % 60000) / 1000)

  return `${String(giorni).padStart(2, '0')}g ` +
         `${String(ore).padStart(2, '0')}o ` +
         `${String(minuti).padStart(2, '0')}m ` +
         `${String(secondi).padStart(2, '0')}s`
}

const handler = async (m, { conn, usedPrefix }) => {
  const inizio = performance.now()
  await Promise.resolve()
  const fine = performance.now()

  const velocita = (fine - inizio).toFixed(4)
  const attivita = clockString(process.uptime() * 1000)
  const ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`

  const caption = `
╭━━━〔 𝑰𝑵𝑭𝑶 𝑷𝑰𝑵𝑮 〕━━━╮
┃
┃  ◈ 𝗩𝗘𝗟𝗢𝗖𝗜𝗧𝗔̀ 𝗗𝗜 𝗥𝗜𝗦𝗣𝗢𝗦𝗧𝗔
┃  └─ ${toMathematicalAlphanumericSymbols(velocita)} ms
┃
┃  ◈ 𝗧𝗘𝗠𝗣𝗢 𝗗𝗜 𝗔𝗧𝗧𝗜𝗩𝗜𝗧𝗔̀
┃  └─ ${attivita}
┃
┃  ◈ 𝗠𝗘𝗠𝗢𝗥𝗜𝗔 𝗨𝗧𝗜𝗟𝗜𝗭𝗭𝗔𝗧𝗔
┃  └─ ${toMathematicalAlphanumericSymbols(ram)}
┃
┃  ◈ 𝗦𝗧𝗔𝗧𝗢 𝗗𝗘𝗟 𝗕𝗢𝗧
┃  └─ 🟢 Online
┃
╰━━━━━━━━━━━━━━━━━━╯
`.trim()

  await conn.reply(m.chat, caption, m, {
    buttons: [
      {
        buttonId: `${usedPrefix}ping`,
        buttonText: { displayText: 'CALCOLA PING' }
      }
    ],
    footer: '『 R L Y • B O T 』',
    headerType: 1
  })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']

export default handler