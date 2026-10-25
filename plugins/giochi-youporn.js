import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, text, usedPrefix }) => {

  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome = m.mentionedJid?.[0] ? await conn.getName(target) : text?.replace(/@/g, '').trim()

  if (!nome) {
    return conn.reply(m.chat, `✦ Usa così:\n${usedPrefix}youporn @utente\n${usedPrefix}youporn nome`, m)
  }

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const views = random(50000, 10000000)
  const videos = random(5, 250)
  const likes = random(5000, 900000)
  const rank = random(1, 1000)

  const cats = ["Amatoriale", "Italiano", "Milf", "Teen", "Hardcore", "POV", "Anal", "Lesbo"]
  const cat = cats[Math.floor(Math.random() * cats.length)]

  let avatarUrl
  try { avatarUrl = await conn.profilePictureUrl(target, 'image') } 
  catch { avatarUrl = 'https://i.imgur.com/8Km9tLL.png' }

  let avatar
  try { avatar = await loadImage(avatarUrl) } 
  catch { avatar = await loadImage('https://i.imgur.com/8Km9tLL.png') }

  const canvas = createCanvas(900, 1050)
  const ctx = canvas.getContext('2d')

  // bg
  ctx.fillStyle = '#0f0f0f'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // header YouPorn style (white + red)
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, canvas.width, 140)

  ctx.font = 'bold 50px Sans'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('You', 370, 95)
  ctx.fillStyle = '#ff0000'
  ctx.fillRect(430, 40, 130, 65)
  ctx.fillStyle = '#fff'
  ctx.fillText('Porn', 495, 95)

  // avatar
  ctx.save()
  ctx.beginPath()
  ctx.arc(450, 310, 135, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatar, 315, 175, 270, 270)
  ctx.restore()

  ctx.strokeStyle = '#ff0000'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(450, 310, 135, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 38px Sans'
  ctx.fillText(nome, 450, 505)

  ctx.font = '20px Sans'
  ctx.fillStyle = '#888'
  ctx.fillText(`TOP ${cat.toUpperCase()} • RANK #${rank}`, 450, 540)

  // stats box
  ctx.fillStyle = '#1a1a1a'
  ctx.beginPath()
  ctx.roundRect(70, 580, 760, 180, 20)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = '26px Sans'
  ctx.textAlign = 'left'
  ctx.fillText(`👁️  ${views.toLocaleString()} visualizzazioni`, 110, 630)
  ctx.fillText(`🎬  ${videos} video caricati`, 110, 670)
  ctx.fillText(`❤️  ${likes.toLocaleString()} like`, 110, 710)
  ctx.fillText(`🏷️  Categoria: ${cat}`, 500, 630)
  ctx.fillText(`⭐  Valutazione: ${(Math.random()*2+3).toFixed(1)}/5`, 500, 670)

  // fake bar
  ctx.fillStyle = '#222'
  ctx.fillRect(70, 800, 760, 120)
  ctx.fillStyle = '#333'
  for (let i = 0; i < 3; i++) ctx.fillRect(90 + i * 255, 815, 230, 90)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#666'
  ctx.font = '18px Sans'
  ctx.fillText(`canale verificato • ${videos} video`, 450, 955)

  // button
  ctx.fillStyle = '#ff0000'
  ctx.beginPath()
  ctx.roundRect(275, 975, 350, 65, 30)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 25px Sans'
  ctx.fillText('VISITA CANALE', 450, 1018)

  const buffer = canvas.toBuffer('image/png')

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🔴 Profilo YouPorn di @${target.split('@')[0]}\n👁️ ${views.toLocaleString()} • 🏷️ ${cat}`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['youporn <@utente>']
handler.tags = ['fun']
handler.command = /^(youporn|yp)$/i

export default handler