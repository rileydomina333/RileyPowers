import fs from 'fs'

let handler = async (m, { conn }) => {
  const path = './media/IMG-20261022-WA0006(1).jpg'

  const buffer = fs.readFileSync(path)

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: 'gli occhietti di mia moglie jas 👀'
  }, { quoted: m })
}

handler.help = ['jas']
handler.tags = ['fun']
handler.command = /^jas$/i

export default handler