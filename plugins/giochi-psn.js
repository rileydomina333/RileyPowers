import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, text, usedPrefix }) => {

  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome = m.mentionedJid?.[0] ? await conn.getName(target) : text?.replace(/@/g, '').trim()

  if (!nome) {
    return conn.reply(m.chat, `✦ Usa così:\n${usedPrefix}psn @utente\n${usedPrefix}psn nome`, m)
  }

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const level = random(1, 999)
  const plat = random(0, 50)
  const gold = random(10, 500)
  const silver = random(50, 1000)
  const bronze = random(100, 3000)
  const hours = random(10, 5000)
  const status = ["Online", "Offline", "In gioco", "Non disturbare"][random(0,3)]

  let avatarUrl
  try { avatarUrl = await conn.profilePictureUrl(target, 'image') }
  catch { avatarUrl = 'https://i.imgur.com/8Km9tLL.png' }

  let avatar
  try { avatar = await loadImage(avatarUrl) }
  catch { avatar = await loadImage('https://i.imgur.com/8Km9tLL.png') }

  const canvas = createCanvas(900, 1050)
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 900, 1050)
  grad.addColorStop(0, '#001a3a')
  grad.addColorStop(1, '#000814')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#003791'
  ctx.fillRect(0, 0, canvas.width, 130)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 44px Sans'
  ctx.textAlign = 'left'
  ctx.fillText('PlayStation', 30, 85)
  ctx.textAlign = 'right'
  ctx.font = 'bold 30px Sans'
  ctx.fillText('PSN', 870, 85)

  ctx.save()
  ctx.beginPath()
  ctx.arc(150, 260, 85, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatar, 65, 175, 170, 170)
  ctx.restore()

  ctx.strokeStyle = '#0070ff'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(150, 260, 85, 0, Math.PI * 2)
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 34px Sans'
  ctx.fillText(nome, 270, 250)

  ctx.font = '20px Sans'
  ctx.fillStyle = status === 'Online' ? '#00ff88' : '#999'
  ctx.fillText(`● ${status}`, 270, 280)

  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.roundRect(270, 300, 120, 40, 20)
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 18px Sans'
  ctx.fillText(`Level ${level}`, 285, 325)

  ctx.fillStyle = '#0d1b2a'
  ctx.beginPath()
  ctx.roundRect(40, 380, 820, 300, 20)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 24px Sans'
  ctx.fillText('TROFEI', 70, 420)

  const trophies = [
    { t: plat, icon: '🏆', label: 'Platinum' },
    { t: gold, icon: '🥇', label: 'Gold' },
    { t: silver, icon: '🥈', label: 'Silver' },
    { t: bronze, icon: '🥉', label: 'Bronze' },
  ]

  trophies.forEach((tr, i) => {
    const x = 70 + i * 195
    ctx.fillStyle = '#1a2a44'
    ctx.beginPath()
    ctx.roundRect(x, 440, 170, 190, 15)
    ctx.fill()

    ctx.fillStyle = '#fff'
    ctx.font = '40px Sans'
    ctx.textAlign = 'center'
    ctx.fillText(tr.icon, x + 85, 490)

    ctx.font = 'bold 32px Sans'
    ctx.fillText(tr.t.toString(), x + 85, 540)

    ctx.font = '16px Sans'
    ctx.fillStyle = '#aaa'
    ctx.fillText(tr.label, x + 85, 570)
  })

  ctx.textAlign = 'left'
  ctx.fillStyle = '#1a2a44'
  ctx.beginPath()
  ctx.roundRect(40, 710, 820, 110, 15)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = '22px Sans'
  ctx.fillText(`🕹️  Ore giocate: ${hours}h`, 70, 750)
  ctx.fillText(`🎮  Giochi: ${random(5,120)}`, 70, 785)
  ctx.fillText(`🌍  Paese: Italia`, 500, 750)
  ctx.fillText(`⭐  Plus: ${Math.random() > 0.5 ? 'Attivo' : 'Scaduto'}`, 500, 785)

  ctx.fillStyle = '#0070ff'
  ctx.beginPath()
  ctx.roundRect(40, 860, 820, 70, 35)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 26px Sans'
  ctx.textAlign = 'center'
  ctx.fillText('VISUALIZZA PROFILO  △', 450, 905)

  ctx.font = '18px Sans'
  ctx.fillStyle = '#888'
  ctx.fillText('△ □ ○ ×  PlayStation Network', 450, 980)

  const buffer = canvas.toBuffer('image/png')

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🎮 Profilo PSN di @${target.split('@')[0]}\nLevel ${level} • ${plat} platini`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['psn <@utente>']
handler.tags = ['fun']
handler.command = /^psn$/i

export default handler