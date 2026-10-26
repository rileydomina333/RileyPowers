import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, text }) => {
  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome = m.mentionedJid?.[0] ? await conn.getName(target) : (text ? text.replace(/@/g,'').trim() : null)
  if (!nome) return conn.reply(m.chat, `✦ Usa: .roblox @utente`, m)

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  const format = (n) => n >= 1000000 ? (n/1000000).toFixed(1)+'M' : n >= 1000 ? (n/1000).toFixed(1)+'K' : n+''

  const robux = random(100, 50000)
  const friends = random(10, 500)
  const followers = random(100, 100000)
  const joinDate = `${random(2015,2023)}`
  const rap = random(1000, 90000)

  let avatarUrl
  try { avatarUrl = await conn.profilePictureUrl(target, 'image') } 
  catch { avatarUrl = 'https://i.imgur.com/8Km9tLL.png' }

  let avatar
  try { avatar = await loadImage(avatarUrl) } 
  catch { avatar = await loadImage('https://i.imgur.com/8Km9tLL.png') }

  const canvas = createCanvas(1080, 1250)
  const ctx = canvas.getContext('2d')

  // bg roblox grigio chiaro
  ctx.fillStyle = '#f2f4f5'
  ctx.fillRect(0,0,1080,1250)

  // header nero roblox
  ctx.fillStyle = '#232527'
  ctx.fillRect(0,0,1080,90)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 42px Sans'
  ctx.textAlign = 'left'
  ctx.fillText('ROBLOX', 40, 62)
  ctx.font = '28px Sans'
  ctx.textAlign = 'right'
  ctx.fillText(`@${nome.replace(/\s/g,'').toLowerCase()}`, 1040, 62)

  // card profilo
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(40, 130, 1000, 420, 12)
  ctx.fill()
  ctx.strokeStyle = '#e3e3e3'
  ctx.lineWidth = 2
  ctx.stroke()

  // avatar quadrato stile roblox
  ctx.fillStyle = '#e5e5e5'
  ctx.fillRect(80, 170, 300, 300)
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(80, 170, 300, 300, 12)
  ctx.clip()
  ctx.drawImage(avatar, 80, 170, 300, 300)
  ctx.restore()

  // info
  ctx.textAlign = 'left'
  ctx.fillStyle = '#000'
  ctx.font = 'bold 42px Sans'
  ctx.fillText(nome, 420, 230)
  
  ctx.fillStyle = '#666'
  ctx.font = '26px Sans'
  ctx.fillText(`@${nome.replace(/\s/g,'').toLowerCase()} • Joined ${joinDate}`, 420, 275)
  ctx.fillText(`💰 ${format(robux)} Robux • RAP: ${format(rap)}`, 420, 315)
  ctx.fillText(`👥 ${friends} Friends • ${format(followers)} Followers`, 420, 355)

  ctx.fillStyle = '#00a2ff'
  ctx.beginPath()
  ctx.roundRect(420, 390, 200, 55, 8)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 24px Sans'
  ctx.textAlign = 'center'
  ctx.fillText('Add Friend', 520, 424)

  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#ccc'
  ctx.beginPath()
  ctx.roundRect(640, 390, 200, 55, 8)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#000'
  ctx.fillText('Message', 740, 424)

  // about
  ctx.textAlign = 'left'
  ctx.fillStyle = '#000'
  ctx.font = 'bold 28px Sans'
  ctx.fillText('About', 60, 620)
  ctx.font = '24px Sans'
  ctx.fillStyle = '#444'
  ctx.fillText(`Ciao sono ${nome} da Palermo! Gioco Adopt Me, Brookhaven 😎`, 60, 660)

  // avatar items fake
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.roundRect(40, 700, 1000, 200, 12)
  ctx.fill()
  ctx.strokeStyle = '#e3e3e3'
  ctx.stroke()
  
  ctx.fillStyle = '#000'
  ctx.font = 'bold 28px Sans'
  ctx.fillText('Avatar • 127 Items', 60, 740)
  
  for(let i=0;i<6;i++){
    ctx.fillStyle = '#f0f0f0'
    ctx.beginPath()
    ctx.roundRect(60 + i*160, 760, 130, 120, 8)
    ctx.fill()
    ctx.fillStyle = '#aaa'
    ctx.font = '20px Sans'
    ctx.textAlign = 'center'
    ctx.fillText(['Head','Face','Shirt','Pants','Hat','Gear'][i], 125 + i*160, 830)
  }

  // badges
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.roundRect(40, 940, 1000, 260, 12)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#000'
  ctx.textAlign = 'left'
  ctx.font = 'bold 28px Sans'
  ctx.fillText('Statistics', 60, 985)
  
  ctx.font = '24px Sans'
  ctx.fillStyle = '#333'
  ctx.fillText(`Place Visits: ${format(random(10000, 5000000))}`, 60, 1025)
  ctx.fillText(`Place Visits: ${format(random(10000, 5000000))}`, 60, 1060)
  ctx.fillText(`Group: Palermo Gang • Rank: Owner`, 60, 1095)
  ctx.fillText(`Status: 🟢 Online in Brookhaven RP`, 60, 1130)

  const buffer = canvas.toBuffer('image/png')
  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🧱 Profilo Roblox di @${target.split('@')[0]}\n💰 ${format(robux)} Robux • 👥 ${friends} Friends`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['roblox <@utente>']
handler.tags = ['fun']
handler.command = /^(roblox|rbx)$/i

export default handler