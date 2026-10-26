import { createCanvas, loadImage } from 'canvas'

const handler = async (m, { conn, text }) => {
  let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  let nome = m.mentionedJid?.[0] ? await conn.getName(target) : (text ? text.replace(/@/g,'').trim() : 'Palermo Anon')

  let avatarUrl
  try { avatarUrl = await conn.profilePictureUrl(target, 'image') } 
  catch { avatarUrl = 'https://i.imgur.com/8Km9tLL.png' }
  let avatar
  try { avatar = await loadImage(avatarUrl) } 
  catch { avatar = await loadImage('https://i.imgur.com/8Km9tLL.png') }

  const canvas = createCanvas(1080, 850)
  const ctx = canvas.getContext('2d')

  // bg nero hacker
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0,0,1080,850)

  // watermark FAKE
  ctx.fillStyle = 'rgba(255,0,0,0.12)'
  ctx.font = 'bold 130px Monospace'
  ctx.textAlign = 'center'
  ctx.save()
  ctx.translate(540, 425)
  ctx.rotate(-0.3)
  ctx.fillText('RLY BOT', 0, 0)
  ctx.restore()

  // card verde hacker
  ctx.strokeStyle = '#00ff41'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(50, 50, 980, 750, 12)
  ctx.stroke()

  ctx.fillStyle = '#00ff41'
  ctx.textAlign = 'left'
  ctx.font = 'bold 36px Monospace'
  ctx.fillText('[ PROFILO DOXBIN PUBBLICO ]', 90, 130)

  // avatar
  ctx.save()
  ctx.beginPath()
  ctx.arc(180, 250, 70, 0, Math.PI*2)
  ctx.clip()
  ctx.drawImage(avatar, 110, 180, 140, 140)
  ctx.restore()

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 32px Monospace'
  ctx.fillText(nome.slice(0,22), 280, 240)
  ctx.font = '22px Monospace'
  ctx.fillStyle = '#00ff41'
  ctx.fillText(`User: @${nome.replace(/\s/g,'').toLowerCase()}`, 280, 280)

  // campi SCHERZOSI, ZERO DATI REALI
  ctx.fillStyle = '#ccc'
  ctx.font = '22px Monospace'
  const lines = [
    `> Threat Level: TESTA DI MINCHIA 100%`,
    `> OS: Windows Palermo Edition`,
    `> Skill: Mangia cannoli.exe`,
    `> Status: Online su WhatsApp`,
    `> Last Seen: 2 minuti fa a Ballarò`,
    `> Warning: VIA DALLE PALLE 104 (PORTO)`
  ]
  let y = 380
  lines.forEach(l => { ctx.fillText(l, 90, y); y+=50 })

  ctx.fillStyle = '#ff0000'
  ctx.font = 'bold 20px Monospace'
  ctx.fillText('⚠️ DOXXED BY RILEY POWERS BOT ⚠️', 90, 720)

  const buffer = canvas.toBuffer('image/png')
  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `💻 DOXBIN di @${target.split('@')[0]}`,
    mentions: [target]
  }, { quoted: m })
}

handler.help = ['doxbin @utente']
handler.tags = ['fun']
handler.command = /^(doxbin|dosbin|docsbin)$/i

export default handler