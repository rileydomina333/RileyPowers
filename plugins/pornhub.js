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
    return conn.reply(m.chat, `✦ Usa così:\n${usedPrefix}pornhub @utente\n${usedPrefix}pornhub nome`, m)
  }

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const views = random(10000, 5000000)
  const videos = random(3, 120)
  const subs = random(1000, 800000)
  const rank = random(1, 500)
  const verified = Math.random() < 0.6

  const titles = [
    "Amatoriale in camera",
    "Video più visto del mese",
    "Live esclusiva",
    "Compilazione HOT",
    "1 ora senza tagli"
  ]
  const title = titles[Math.floor(Math.random() * titles.length)]

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

  const canvas = createCanvas(900, 1050)
  const ctx = canvas.getContext('2d')

  // bg
  ctx.fillStyle = '#0b0b0b'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // header pornhub style
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, 140)
  
  ctx.font = 'bold 48px Sans'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('Porn', 380, 92)
  ctx.fillStyle = '#ff9900'
  ctx.fillRect(450, 42, 150, 62)
  ctx.fillStyle = '#000'
  ctx.fillText('hub', 525, 92)

  // avatar
  ctx.save()
  ctx.beginPath()
  ctx.arc(450, 300, 140, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatar, 310, 160, 280, 280)
  ctx.restore()

  ctx.strokeStyle = '#ff9900'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(450, 300, 140, 0, Math.PI * 2)
  ctx.stroke()

  // nome + verified
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 38px Sans'
  ctx.textAlign = 'center'
  ctx.fillText(nome, 450, 495)

  if (verified) {
    const w = ctx.measureText(nome).width
    ctx.fillStyle = '#1b8aff'
    ctx.beginPath()
    ctx.arc(450 + w / 2 + 24, 482, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 15px Sans'
    ctx.fillText('✓', 450 + w / 2 + 24, 487)
  }

  ctx.font = '22px Sans'
  ctx.fillStyle = '#999'
  ctx.fillText(`RANK #${rank} • MODEL`, 450, 530)

  // stats
  ctx.fillStyle = '#ffffff'
  ctx.font = '26px Sans'
  ctx.fillText(`👁️ ${views.toLocaleString()} visualizzazioni`, 450, 590)
  ctx.fillText(`🎬 ${videos} video  •  👥 ${subs.toLocaleString()} iscritti`, 450, 630)
  
  ctx.fillStyle = '#ff9900'
  ctx.font = 'bold 24px Sans'
  ctx.fillText(`"${title}"`, 450, 700)

  // fake video thumbnails bar
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(60, 760, 780, 140)
  ctx.fillStyle = '#333'
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(80 + i * 260, 775, 230, 110)
  }
  ctx.fillStyle = '#666'
  ctx.font = '18px Sans'
  ctx.fillText(`${videos} video pubblici`, 450, 930)

  // button
  ctx.fillStyle = '#ff9900'
  ctx.beginPath()
  ctx.roundRect(275, 960, 350, 70, 35)
  ctx.fill()

  ctx.fillStyle = '#000'
  ctx.font = 'bold 26px Sans'
  ctx.fillText('GUARDA PROFILO', 450, 1005)

  const buffer = canvas.toBuffer('image/png')

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🍑 Profilo Pornhub di @${target.split('@')[0]}\nRank #${rank} • ${views.toLocaleString()} views`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['pornhub <@utente>']
handler.tags = ['fun']
handler.command = /^(pornhub|ph)$/i

export default handler