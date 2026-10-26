import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, text }) => {
  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome = m.mentionedJid?.[0] ? await conn.getName(target) : (text ? text.replace(/@/g,'').trim() : null)

  if (!nome) return conn.reply(m.chat, `✦ Usa: .insta @utente`, m)

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  const format = (n) => n >= 1000000 ? (n/1000000).toFixed(1)+'M' : n >= 1000 ? (n/1000).toFixed(1)+'K' : n+''
  
  const posts = random(12, 250)
  const followers = random(5000, 500000)
  const following = random(200, 1200)
  const verified = Math.random() < 0.6
  const bio = ["Palermo 📍", "CEO vibes 😎", "DM for collab ✨", "19 • 🇮🇹"][random(0,3)]

  let avatarUrl
  try { avatarUrl = await conn.profilePictureUrl(target, 'image') } 
  catch { avatarUrl = 'https://i.imgur.com/8Km9tLL.png' }

  let avatar
  try { avatar = await loadImage(avatarUrl) } 
  catch { avatar = await loadImage('https://i.imgur.com/8Km9tLL.png') }

  const canvas = createCanvas(1080, 1350)
  const ctx = canvas.getContext('2d')

  // bg
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0,0,1080,1350)

  // header insta
  ctx.fillStyle = '#000'
  ctx.font = 'bold 36px Sans'
  ctx.textAlign = 'left'
  ctx.fillText(nome.replace(/\s/g,'').toLowerCase() + (verified ? '' : ''), 40, 80)

  // avatar con gradiente insta
  const grad = ctx.createLinearGradient(0,0,300,300)
  grad.addColorStop(0, '#feda75')
  grad.addColorStop(0.5, '#d62976')
  grad.addColorStop(1, '#4f5bd5')
  
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(160, 240, 110, 0, Math.PI*2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(160, 240, 104, 0, Math.PI*2)
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.arc(160, 240, 96, 0, Math.PI*2)
  ctx.clip()
  ctx.drawImage(avatar, 64, 144, 192, 192)
  ctx.restore()

  // stats
  ctx.fillStyle = '#000'
  ctx.textAlign = 'center'
  ctx.font = 'bold 38px Sans'
  ctx.fillText(posts, 460, 220)
  ctx.fillText(format(followers), 700, 220)
  ctx.fillText(format(following), 920, 220)

  ctx.font = '28px Sans'
  ctx.fillStyle = '#444'
  ctx.fillText('Post', 460, 260)
  ctx.fillText('Follower', 700, 260)
  ctx.fillText('Seguiti', 920, 260)

  // nome + bio
  ctx.textAlign = 'left'
  ctx.fillStyle = '#000'
  ctx.font = 'bold 32px Sans'
  ctx.fillText(nome, 40, 400)
  if (verified) {
    ctx.fillStyle = '#0095f6'
    ctx.beginPath()
    ctx.arc(40 + ctx.measureText(nome).width + 22, 388, 14, 0, Math.PI*2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px Sans'
    ctx.fillText('✓', 40 + ctx.measureText(nome).width + 16, 394)
  }
  ctx.fillStyle = '#444'
  ctx.font = '28px Sans'
  ctx.fillText(bio, 40, 445)
  ctx.fillText('Link in bio 👇', 40, 485)

  // bottoni
  ctx.fillStyle = '#efefef'
  ctx.beginPath()
  ctx.roundRect(40, 540, 480, 70, 12)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(560, 540, 480, 70, 12)
  ctx.fill()
  
  ctx.fillStyle = '#000'
  ctx.font = 'bold 28px Sans'
  ctx.textAlign = 'center'
  ctx.fillText('Segui', 280, 585)
  ctx.fillText('Messaggio', 800, 585)

  // grid 3x3
  let y = 650
  for(let r=0; r<3; r++){
    for(let c=0; c<3; c++){
      ctx.fillStyle = ['#ddd','#ccc','#bbb'][random(0,2)]
      ctx.fillRect(c*360+2, y + r*235, 356, 231)
      // icona reel
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.fillRect(c*360+2, y + r*235, 356, 35)
    }
  }

  const buffer = canvas.toBuffer('image/png')
  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `📸 Profilo Instagram di @${target.split('@')[0]}\n${format(followers)} follower • ${posts} post`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['insta <@utente>']
handler.tags = ['fun']
handler.command = /^(insta|instagram)$/i

export default handler