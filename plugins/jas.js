import fs from 'fs'

let handler = async (m, { conn }) => {
  const folder = './media//' // metti tutte le foto qui dentro
  const files = fs.readdirSync(folder).filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  
  if (!files.length) return conn.reply(m.chat, '❌ Nessuna foto in media/jas/', m)

  const pick = files[Math.floor(Math.random() * files.length)]
  const buffer = fs.readFileSync(folder + pick)

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `✦ Jas`
  }, { quoted: m })
}

handler.help = ['jas']
handler.tags = ['fun']
handler.command = /^jas$/i

export default handler