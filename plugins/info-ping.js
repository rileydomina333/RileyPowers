  const uptime = clockString(process.uptime() * 1000)

  const info = `
*🏓 𝐏𝐨𝐧𝐠!*

*🚀 ׁׅ᥎ׁׅꫀׁׅܻ݊ᥣׁׅ֪ᨵׁׅׅᝯׁ֒ꪱׁׁׁׅׅׅtׁׁׅׅɑׁׅ́:* ${speedWithFont} s
*⏱️ ɑׁׅtׁׅtׁׅꪱׁׁׁׁׅׅׅׅ᥎ׁׅꪱׁׁׁׅׅׅtׁׅɑׁׅ́:* ${uptime}
*✅ ׅ꯱tׁׅɑׁׅtׁׅᨵׁׅׅ:* Online

> *𝐑𝐈𝐋𝐄𝐘 𝚩𝚯𝐓*
`.trim()

  const buttons = [
    {
      buttonId: `${usedPrefix}ping`,
      buttonText: { displayText: '🔄 Ping' },
      type: 1
    },
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