import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, text, usedPrefix }) => {

  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome = m.mentionedJid?.[0] ? await conn.getName(target) : text?.replace(/@/g, '').trim()

  if (!nome) {
    return conn.reply(m.chat, `✦ Usa così:\n${usedPrefix}nintendo @utente\n${usedPrefix}nintendo nome`, m)
  }

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const hours = random(20, 4000)
  const games = random(2, 80)
  const stars = random(0, 999)
  const friendCode = `SW-${random(1000,9999)}-${random(1000,9999)}-${random(1000,9999)}`
  const title = ["Zelda", "Mario Kart", "Smash", "Animal Crossing", "Splatoon"][random(0,4)]

  let avatarUrl
  try { avatarUrl = await conn.profilePictureUrl(target, 'image') }
  catch { avatarUrl = 'https://i.imgur.com/8Km9tLL.png' }

  let avatar
  try { avatar = await loadImage(avatarUrl) }
  catch { avatar = await loadImage('https://i.imgur.com/8Km9tLL.png') }

  const canvas = createCanvas(900, 1000)
  const ctx = canvas.getContext('2d')

  // bg white nintendo
  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // header red
  ctx.fillStyle = '#e60012'
  ctx.fillRect(0, 0, canvas.width, 130)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 42px Sans'
  ctx.textAlign = 'left'
  ctx.fillText('NINTENDO', 30, 85)
  ctx.textAlign = 'right'
  ctx.font = 'bold 28px Sans'
  ctx.fillText('SWITCH', 870, 85)

  // card
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.roundRect(40, 170, 820, 750, 25)
  ctx.fill()
  ctx.shadowColor = '#00000020'
  ctx.shadowBlur = 20
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.shadowBlur = 0

  // avatar
  ctx.save()
  ctx.beginPath()
  ctx.arc(150, 280, 80, 0, Math.PI*2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatar, 70, 200, 160, 160)
  ctx.restore()

  ctx.strokeStyle = '#e60012'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(150, 280, 80, 0, Math.PI*2)
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.fillStyle = '#333'
  ctx.font = 'bold 32px Sans'
  ctx.fillText(nome, 260, 270)

  ctx.font = '18px Sans'
  ctx.fillStyle = '#888'
  ctx.fillText(friendCode, 260, 300)

  ctx.fillStyle = '#e60012'
  ctx.beginPath()
  ctx.roundRect(260, 320, 140, 30, 15)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 16px Sans'
  ctx.fillText('● Online', 275, 340)

  // stats
  ctx.fillStyle = '#f8f8f8'
  ctx.beginPath()
  ctx.roundRect(70, 390, 760, 240, 15)
  ctx.fill()

  ctx.fillStyle = '#333'
  ctx.font = 'bold 22px Sans'
  ctx.fillText('ATTIVITÀ', 90, 425)

  ctx.font = '20px Sans'
  ctx.fillText(`⏱️  Ore giocate: ${hours}h`, 90, 465)
  ctx.fillText(`🎮  Giochi: ${games}`, 90, 495)
  ctx.fillText(`⭐  Stelle: ${stars}`, 90, 525)
  ctx.fillText(`🏆  Gioco preferito: ${title}`, 90, 555)
  ctx.fillText(`👥  Amici: ${random(1,100)}`, 450, 465)
  ctx.fillText(`🌍  Regione: Europa`, 450, 495)

  // joycon colors
  ctx.fillStyle = '#00c3e3'
  ctx.fillRect(70, 660, 370, 80)
  ctx.fillStyle = '#ff4554'
  ctx.fillRect(460, 660, 370, 80)

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 20px Sans'
  ctx.textAlign = 'center'
  ctx.fillText('◀ JOY-CON ▶', 450, 708)

  // button
  ctx.fillStyle = '#e60012'
  ctx.beginPath()
  ctx.roundRect(70, 770, 760, 70, 35)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 24px Sans'
  ctx.fillText('PROFILO NINTENDO', 450, 815)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#aaa'
  ctx.font = '16px Sans'
  ctx.fillText('Nintendo Switch Online', 450, 885)

  const buffer = canvas.toBuffer('image/png')

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🔴 Profilo Nintendo di @${target.split('@')[0]}\n${friendCode} • ${hours}h giocate`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['nintendo <@utente>']
handler.tags = ['fun']
handler.command = /^(nintendo|switch)$/i

export default handler