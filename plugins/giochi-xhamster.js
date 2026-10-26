import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, text }) => {
  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome = m.mentionedJid?.[0] ? await conn.getName(target) : (text ? text.replace(/@/g,'').trim() : null)
  if (!nome) return conn.reply(m.chat, `✦ Usa: .xhamster @utente`, m)

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const views = random(50000, 8000000)
  const videos = random(5, 200)
  const subs = random(2000, 900000)
  const rank = random(1, 300)

  let avatarUrl
  try { avatarUrl = await conn.profilePictureUrl(target, 'image') } 
  catch { avatarUrl = 'https://i.imgur.com/8Km9tLL.png' }

  let avatar
  try { avatar = await loadImage(avatarUrl) } 
  catch { avatar = await loadImage('https://i.imgur.com/8Km9tLL.png') }

  const canvas = createCanvas(900, 1050)
  const ctx = canvas.getContext('2d')

  // bg
  ctx.fillStyle = '#000000'
  ctx.fillRect(0,0,900,1050)

  // header xhamster - rosso e nero
  ctx.fillStyle = '#000'
  ctx.fillRect(0,0,900,120)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 50px Sans'
  ctx.textAlign = 'center'
  ctx.fillText('xHamster', 450, 85)

  ctx.fillStyle = '#e5262d'
  ctx.fillRect(0,120,900,6)

  // avatar
  ctx.save()
  ctx.beginPath()
  ctx.arc(450, 310, 130, 0, Math.PI*2)
  ctx.clip()
  ctx.drawImage(avatar, 320, 180, 260, 260)
  ctx.restore()

  ctx.strokeStyle = '#e5262d'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.arc(450, 310, 130, 0, Math.PI*2)
  ctx.stroke()

  // nome
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 38px Sans'
  ctx.textAlign = 'center'
  ctx.fillText(nome, 450, 495)
  ctx.font = '22px Sans'
  ctx.fillStyle = '#aaa'
  ctx.fillText(`Rank #${rank} • Verified Model`, 450, 530)

  // stats
  ctx.fillStyle = '#fff'
  ctx.font = '24px Sans'
  ctx.fillText(`👁️ ${views.toLocaleString()} views • 🎬 ${videos} videos • 👥 ${subs.toLocaleString()} subs`, 450, 590)

  // bio fake
  ctx.fillStyle = '#e5262d'
  ctx.font = 'bold 22px Sans'
  ctx.fillText('"Palermo boy 19y 🔥 DM"', 450, 650)

  // thumbnails fake
  ctx.fillStyle = '#111'
  ctx.fillRect(60, 700, 780, 180)
  for(let i=0;i<3;i++){
    ctx.fillStyle = '#222'
    ctx.fillRect(80 + i*260, 720, 230, 130)
    ctx.fillStyle = '#444'
    ctx.font = '16px Sans'
    ctx.fillText(`${random(2,40)}:12`, 90 + i*260, 835)
  }

  // bottone
  ctx.fillStyle = '#e5262d'
  ctx.beginPath()
  ctx.roundRect(275, 920, 350, 70, 35)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 26px Sans'
  ctx.fillText('VIEW PROFILE', 450, 965)

  const buffer = canvas.toBuffer('image/png')
  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🔴 Profilo xHamster di @${target.split('@')[0]}\nRank #${rank} • ${views.toLocaleString()} views`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['xhamster <@utente>']
handler.tags = ['fun']
handler.command = /^(xhamster|xh)$/i

export default handler