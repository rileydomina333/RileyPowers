let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    image: { url: 'https://i.imgur.com/IMG-20261022-WA0006(1).jpg' },
    caption: 'gli occhietti della moglie di riley!!!'
  }, { quoted: m })
}

handler.help = ['jas']
handler.tags = ['fun']
handler.command = /^jas$/i

export default handler
