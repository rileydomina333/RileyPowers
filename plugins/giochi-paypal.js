import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, text }) => {
  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome = m.mentionedJid?.[0] ? await conn.getName(target) : (text ? text.replace(/@/g,'').trim() : 'Palermo Boy')

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  const balance = random(0, 5)

  let avatarUrl
  try { avatarUrl = await conn.profilePictureUrl(target, 'image') } 
  catch { avatarUrl = 'https://i.imgur.com/8Km9tLL.png' }
  let avatar
  try { avatar = await loadImage(avatarUrl) } 
  catch { avatar = await loadImage('https://i.imgur.com/8Km9tLL.png') }

  const canvas = createCanvas(1080, 700)
  const ctx = canvas.getContext('2d')

  // bg azzurro parodia, NON blu PayPal vero
  ctx.fillStyle = '#e8f0fe'
  ctx.fillRect(0,0,1080,700)

  // scritta FAKE watermark gigante
  ctx.fillStyle = 'rgba(255,0,0,0.15)'
  ctx.font = 'bold 160px Sans'
  ctx.textAlign = 'center'
  ctx.save()
  ctx.translate(540, 350)
  ctx.rotate(-0.3)
  ctx.fillText('FAKE MEME', 0, 0)
  ctx.restore()

  // card bianca
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(60, 60, 960, 580, 24)
  ctx.fill()
  ctx.strokeStyle = '#ccc'
  ctx.lineWidth = 2
  ctx.stroke()

  // header parodia
  ctx.fillStyle = '#000'
  ctx.font = 'bold 36px Sans'
  ctx.textAlign = 'left'
  ctx.fillText('PayPal MEME (PARODIA)', 110, 140)

  // avatar
  ctx.save()
  ctx.beginPath()
  ctx.arc(180, 280, 70, 0, Math.PI*2)
  ctx.clip()
  ctx.drawImage(avatar, 110, 210, 140, 140)
  ctx.restore()

  ctx.fillStyle = '#000'
  ctx.font = 'bold 34px Sans'
  ctx.fillText(nome, 280, 270)
  ctx.font = '24px Sans'
  ctx.fillStyle = '#666'
  ctx.fillText(`@${nome.replace(/\s/g,'').toLowerCase()} • Palermo`, 280, 310)

  // saldo palesemente finto
  ctx.fillStyle = '#000'
  ctx.font = 'bold 28px Sans'
  ctx.fillText('Saldo Monopoly:', 110, 420)
  ctx.font = 'bold 56px Sans'
  ctx.fillText(`${balance},00 €`, 110, 485)

  ctx.fillStyle = '#ff0000'
  ctx.font = 'bold 22px Sans'
  ctx.fillText('⚠️ QUESTO È UN MEME - NON È UN PAGAMENTO REALE ⚠️', 110, 560)

  const buffer = canvas.toBuffer('image/png')
  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `💳 Parodia PayPal di @${target.split('@')[0]}\nSaldo: ${balance}€ (FAKE PER MEME)`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['paypal <@utente>']
handler.tags = ['fun']
handler.command = /^(paypal|pp)$/i

export default handler