import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, text, usedPrefix }) => {

  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome = m.mentionedJid?.[0] ? await conn.getName(target) : text?.replace(/@/g, '').trim()

  if (!nome) {
    return conn.reply(m.chat, `✦ Usa così:\n${usedPrefix}xbox @utente\n${usedPrefix}xbox nome`, m)
  }

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const gamerscore = random(100, 150000)
  const level = random(1, 300)
  const achievements = random(10, 800)
  const followers = random(0, 5000)
  const hours = random(10, 6000)

  let avatarUrl
  try { avatarUrl = await conn.profilePictureUrl(target, 'image') }
  catch { avatarUrl = 'https://i.imgur.com/8Km9tLL.png' }

  let avatar
  try { avatar = await loadImage(avatarUrl) }
  catch { avatar = await loadImage('https://i.imgur.com/8Km9tLL.png') }

  const canvas = createCanvas(900, 1050)
  const ctx = canvas.getContext('2d')

  // bg xbox
  const grad = ctx.createLinearGradient(0, 0, 0, 1050)
  grad.addColorStop(0, '#107C10')
  grad.addColorStop(1, '#0a2a0a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // header
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, 130)
  
  // Xbox logo text
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 44px Sans'
  ctx.textAlign = 'left'
  ctx.fillText('XBOX', 30, 85)
  ctx.fillStyle = '#107C10'
  ctx.beginPath()
  ctx.arc(200, 68, 22, 0, Math.PI*2)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 22px Sans'
  ctx.fillText('X', 192, 76)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#888'
  ctx.font = '20px Sans'
  ctx.fillText('LIVE', 870, 85)

  // avatar
  ctx.save()
  ctx.beginPath()
  ctx.arc(150, 270, 90, 0, Math.PI*2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatar, 60, 180, 180, 180)
  ctx.restore()

  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(150, 270, 90, 0, Math.PI*2)
  ctx.stroke()

  // nome
  ctx.textAlign = 'left'
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 36px Sans'
  ctx.fillText(nome, 270, 255)
  
  ctx.font = '20px Sans'
  ctx.fillStyle = '#b4ff39'
  ctx.fillText(`● Online • Level ${level}`, 270, 285)

  // Gamerscore box
  ctx.fillStyle = '#000000aa'
  ctx.beginPath()
  ctx.roundRect(270, 305, 200, 38, 19)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 20px Sans'
  ctx.fillText(`Ⓖ ${gamerscore} G`, 285, 330)

  // stats
  ctx.fillStyle = '#0f3d0f'
  ctx.beginPath()
  ctx.roundRect(40, 390, 820, 280, 20)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 24px Sans'
  ctx.fillText('STATISTICHE', 70, 430)

  const stats = [
    { v: achievements, l: 'Obiettivi' },
    { v: `${hours}h`, l: 'Ore giocate' },
    { v: followers, l: 'Follower' },
    { v: random(1,100), l: 'Giochi' }
  ]

  stats.forEach((s, i) => {
    const x = 70 + i * 200
    ctx.fillStyle = '#1a5c1a'
    ctx.beginPath()
    ctx.roundRect(x, 450, 180, 15)
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 36px Sans'
    ctx.fillText(s.v.toString(), x+90, 530)
    ctx.font = '16px Sans'
    ctx.fillStyle = '#9acd32'
    ctx.fillText(s.l, x+90, 560)
  })

  // game pass
  ctx.textAlign = 'left'
  ctx.fillStyle = '#1a5c1a'
  ctx.beginPath()
  ctx.roundRect(40, 700, 820, 100, 15)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = '22px Sans'
  ctx.fillText(`🎮 Game Pass: ${Math.random()>0.5?'Ultimate Attivo':'Scaduto'}`, 70, 740)
  ctx.fillText(`🏆 Ultimo: ${["Halo","Forza","Gears","Starfield"][random(0,3)]}`, 70, 775)

  // button
  ctx.fillStyle = '#9acd32'
  ctx.beginPath()
  ctx.roundRect(40, 840, 820, 75, 37)
  ctx.fill()
  ctx.fillStyle = '#000'
  ctx.font = 'bold 26px Sans'
  ctx.textAlign = 'center'
  ctx.fillText('VISUALIZZA PROFILO', 450, 887)

  ctx.fillStyle = '#ffffff88'
  ctx.font = '18px Sans'
  ctx.fillText('XBOX NETWORK • A B X Y', 450, 965)

  const buffer = canvas.toBuffer('image/png')

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🟩 Profilo Xbox di @${target.split('@')[0]}\nⒼ ${gamerscore} • Level ${level}`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['xbox <@utente>']
handler.tags = ['fun']
handler.command = /^xbox$/i

export default handler