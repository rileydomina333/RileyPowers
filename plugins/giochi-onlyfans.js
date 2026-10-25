import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, args, usedPrefix, text }) => {

  // target = menzionato > quotato > autore
  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome

  if (m.mentionedJid?.[0]) {
    nome = await conn.getName(target)
  } else if (text) {
    // rimuove @ se scritto a mano
    nome = text.replace(/@/g, '').trim()
  }

  if (!nome) {
    return conn.reply(m.chat, `✦ Usa così:\n${usedPrefix}onlyfans @utente\n${usedPrefix}onlyfans nome`, m)
  }

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const id = random(100000, 999999)
  const prezzo = random(5, 50)
  const followers = random(1000, 900000)
  const post = random(5, 350)
  const likes = random(10000, 900000)
  const verified = Math.random() < 0.4

  const bioList = [
    "🔥 Contenuti esclusivi ogni giorno",
    "💋 Solo per veri fan",
    "😈 Non adatto ai deboli di cuore",
    "💎 Premium content 18+",
    "🌙 Notte calda garantita",
    "🖤 DM aperti per richieste speciali"
  ]
  const bio = bioList[Math.floor(Math.random() * bioList.length)]

  // foto del TARGET, non tua
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

  const canvas = createCanvas(900, 1100)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#0f0f14'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#00aff0'
  ctx.fillRect(0, 0, canvas.width, 140)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 50px Sans'
  ctx.textAlign = 'center'
  ctx.fillText('ONLYFANS', 450, 90)

  ctx.save()
  ctx.beginPath()
  ctx.arc(450, 300, 140, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatar, 310, 160, 280, 280)
  ctx.restore()

  ctx.strokeStyle = '#00aff0'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(450, 300, 140, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 38px Sans'
  ctx.textAlign = 'center'
  ctx.fillText(nome, 450, 495)

  if (verified) {
    const w = ctx.measureText(nome).width
    ctx.fillStyle = '#00aff0'
    ctx.beginPath()
    ctx.arc(450 + w / 2 + 22, 482, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px Sans'
    ctx.fillText('✓', 450 + w / 2 + 22, 487)
  }

  ctx.font = '24px Sans'
  ctx.fillStyle = '#8e8e93'
  ctx.fillText(`ID: OF${id}`, 450, 535)

  ctx.fillStyle = '#ffffff'
  ctx.font = '28px Sans'
  ctx.fillText(`💰 ${prezzo}€ / mese`, 450, 590)
  ctx.fillText(`👥 ${followers.toLocaleString()} followers`, 450, 630)
  ctx.fillText(`📸 ${post} post  •  🔥 ${likes.toLocaleString()} like`, 450, 670)

  ctx.font = '22px Sans'
  ctx.fillStyle = '#aaaaaa'
  ctx.fillText(bio, 450, 740)

  ctx.fillStyle = '#00aff0'
  ctx.beginPath()
  ctx.roundRect(300, 890, 300, 80, 40)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 28px Sans'
  ctx.fillText('ABBONATI ORA', 450, 940)

  const buffer = canvas.toBuffer('image/png')

  // numero corretto sull'utente menzionato
  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🔞 Profilo onlyfans di @${target.split('@')[0]}`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['onlyfans <@utente>']
handler.tags = ['fun']
handler.command = /^onlyfans$/i

export default handler