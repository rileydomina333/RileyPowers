import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, args, usedPrefix, text }) => {
  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome

  if (m.mentionedJid?.[0]) {
    nome = await conn.getName(target)
  } else if (text) {
    nome = text.replace(/@/g, '').trim()
  }

  if (!nome) {
    return conn.reply(m.chat, `✦ Usa così:\n${usedPrefix}tiktok @utente\n${usedPrefix}tiktok nome`, m)
  }

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  
  const formatNum = (n) => {
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n/1000).toFixed(1) + 'K'
    return n.toString()
  }

  const followers = random(5000, 2000000)
  const following = random(100, 1000)
  const likes = random(50000, 15000000)
  const verified = Math.random() < 0.7

  const bios = [
    "CEO di non fare un cazzo 📈",
    "Vivo a Palermo 📍 19y",
    "DM for collab ✨",
    "Solo vibes buone 😎",
    "For you page addicted"
  ]
  const bio = bios[Math.floor(Math.random() * bios.length)]

  let avatarUrl
  try {
    avatarUrl = await conn.profilePictureUrl(target, 'image')
  } catch {
    avatarUrl = 'https://i.imgur.com/8Km9tLL.png'
  }

  let avatar
  try {
    avatar = await loadImage(avatarUrl)
  } catch {
    avatar = await loadImage('https://i.imgur.com/8Km9tLL.png')
  }

  const canvas = createCanvas(1080, 1350)
  const ctx = canvas.getContext('2d')

  // bg bianco tiktok
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // header bar
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, 110)
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 32px Sans'
  ctx.textAlign = 'center'
  ctx.fillText(`@${nome.replace(/\s/g,'').toLowerCase()}`, 540, 75)

  // avatar
  ctx.save()
  ctx.beginPath()
  ctx.arc(540, 280, 130, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatar, 410, 150, 260, 260)
  ctx.restore()

  // anello tiktok cyan + pink
  ctx.strokeStyle = '#25F4EE'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(540, 280, 135, -0.5, 2)
  ctx.stroke()
  ctx.strokeStyle = '#FE2C55'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(540, 280, 135, 1, 4)
  ctx.stroke()

  // nome + spunta
  ctx.fillStyle = '#000'
  ctx.font = 'bold 44px Sans'
  ctx.textAlign = 'center'
  ctx.fillText(nome, 540, 480)

  if (verified) {
    const w = ctx.measureText(nome).width
    ctx.fillStyle = '#20D5EC'
    ctx.beginPath()
    ctx.arc(540 + w/2 + 30, 466, 18, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 18px Sans'
    ctx.fillText('✓', 540 + w/2 + 30, 472)
  }

  ctx.fillStyle = '#000'
  ctx.font = '32px Sans'
  ctx.fillText(`@${nome.replace(/\s/g,'').toLowerCase()}`, 540, 530)

  // stats
  ctx.textAlign = 'center'
  ctx.fillStyle = '#000'
  ctx.font = 'bold 42px Sans'
  ctx.fillText(formatNum(following), 280, 620)
  ctx.fillText(formatNum(followers), 540, 620)
  ctx.fillText(formatNum(likes), 800, 620)

  ctx.font = '26px Sans'
  ctx.fillStyle = '#8A8B91'
  ctx.fillText('Seguiti', 280, 660)
  ctx.fillText('Follower', 540, 660)
  ctx.fillText('Mi piace', 800, 660)

  // bio
  ctx.fillStyle = '#000'
  ctx.font = '28px Sans'
  ctx.fillText(bio, 540, 730)

  // bottoni
  ctx.fillStyle = '#FE2C55'
  ctx.beginPath()
  ctx.roundRect(140, 790, 800, 80, 8)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 32px Sans'
  ctx.fillText('Segui', 540, 840)

  // grid video fake
  ctx.fillStyle = '#000'
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      let x = col * 360
      let y = 920 + row * 215
      ctx.fillStyle = '#eee'
      ctx.fillRect(x+2, y, 356, 211)
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(x+2, y+175, 356, 36)
      ctx.fillStyle = '#fff'
      ctx.font = '22px Sans'
      ctx.textAlign = 'left'
      ctx.fillText('▸ ' + formatNum(random(10000, 800000)), x+15, y+200)
    }
  }

  const buffer = canvas.toBuffer('image/png')

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🎵 Profilo TikTok di @${target.split('@')[0]}\n👥 ${formatNum(followers)} follower • ❤️ ${formatNum(likes)} likes`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['tiktok <@utente>']
handler.tags = ['fun']
handler.command = /^(tiktokprofile|tiktok)$/i

export default handler