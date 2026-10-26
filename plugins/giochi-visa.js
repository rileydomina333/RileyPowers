import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, text }) => {
  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome = m.mentionedJid?.[0] ? await conn.getName(target) : (text ? text.replace(/@/g,'').trim() : 'PALERMO BOY')

  let avatarUrl
  try { avatarUrl = await conn.profilePictureUrl(target, 'image') } 
  catch { avatarUrl = 'https://i.imgur.com/8Km9tLL.png' }
  let avatar
  try { avatar = await loadImage(avatarUrl) } 
  catch { avatar = await loadImage('https://i.imgur.com/8Km9tLL.png') }

  const canvas = createCanvas(1080, 680)
  const ctx = canvas.getContext('2d')

  // bg
  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(0,0,1080,680)

  // carta parodia - colori volutamente brutti, non VISA vera
  ctx.fillStyle = '#1a1f71'
  ctx.beginPath()
  ctx.roundRect(70, 70, 940, 540, 24)
  ctx.fill()

  // watermark FAKE enorme
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.font = 'bold 140px Sans'
  ctx.textAlign = 'center'
  ctx.save()
  ctx.translate(540, 340)
  ctx.rotate(-0.25)
  ctx.fillText('FAKE MEME', 0, 0)
  ctx.restore()

  // testi finti
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.font = 'bold 38px Sans'
  ctx.fillText('CONTO VISA', 120, 150)

  ctx.font = '28px Monospace'
  ctx.fillText('0000 0000 0000 0000', 120, 300)
  ctx.font = '22px Sans'
  ctx.fillText('MM/YY 00/00   CVV 000', 120, 340)

  ctx.font = 'bold 30px Sans'
  ctx.fillText(nome.toUpperCase().slice(0,20), 120, 450)

  ctx.font = 'bold 20px Sans'
  ctx.fillStyle = '#ff4444'
  ctx.fillText('⚠️ CONTO BANCARIO ESTRATTO DA RILEY POWERS ⚠️', 120, 530)

  // avatar piccolo
  ctx.save()
  ctx.beginPath()
  ctx.arc(900, 140, 50, 0, Math.PI*2)
  ctx.clip()
  ctx.drawImage(avatar, 850, 90, 100, 100)
  ctx.restore()

  const buffer = canvas.toBuffer('image/png')
  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `💳 Conto Visa (FAKE) di @${target.split('@')[0]}\nPalesemente finta per meme`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['visa <@utente>']
handler.tags = ['fun']
handler.command = /^(visa|visameme)$/i

export default handler