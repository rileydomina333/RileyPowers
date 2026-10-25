import { createCanvas } from 'canvas'

const styles = {
  fuoco: (ctx, w, h) => {
    let g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#ffff00'); g.addColorStop(0.4, '#ff6600'); g.addColorStop(1, '#ff0000')
    ctx.fillStyle = g; ctx.shadowColor = '#ff3300'; ctx.shadowBlur = 40
  },
  ghiaccio: (ctx) => {
    let g = ctx.createLinearGradient(0, 0, 0, 500)
    g.addColorStop(0, '#e0ffff'); g.addColorStop(1, '#0088ff')
    ctx.fillStyle = g; ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 30
  },
  hacker: (ctx) => { ctx.fillStyle = '#00ff00'; ctx.shadowColor = '#00ff00'; ctx.shadowBlur = 25; ctx.font = 'bold 90px Monospace' },
  neon: (ctx) => { ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = 3; ctx.shadowColor = '#ff00ff'; ctx.shadowBlur = 40 },
  oro: (ctx) => {
    let g = ctx.createLinearGradient(0, 0, 0, 500)
    g.addColorStop(0, '#fff8aa'); g.addColorStop(0.5, '#ffcc00'); g.addColorStop(1, '#b8860b')
    ctx.fillStyle = g; ctx.shadowColor = '#ffaa00'; ctx.shadowBlur = 25
  },
  sangue: (ctx) => { ctx.fillStyle = '#bb0000'; ctx.shadowColor = '#440000'; ctx.shadowBlur = 20 },
  glitch: (ctx) => { ctx.fillStyle = '#fff' },
  galaxy: (ctx, w) => {
    let g = ctx.createLinearGradient(0, 0, w, 0)
    g.addColorStop(0, '#ff00ff'); g.addColorStop(0.5, '#00ffff'); g.addColorStop(1, '#ff00ff')
    ctx.fillStyle = g; ctx.shadowColor = '#9900ff'; ctx.shadowBlur = 30
  },
  lava: (ctx) => {
    let g = ctx.createLinearGradient(0, 0, 0, 500)
    g.addColorStop(0, '#ff3300'); g.addColorStop(1, '#111')
    ctx.fillStyle = g; ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 30
  },
  toxic: (ctx) => { ctx.fillStyle = '#39ff14'; ctx.shadowColor = '#39ff14'; ctx.shadowBlur = 35 },
  metal: (ctx) => {
    let g = ctx.createLinearGradient(0, 0, 0, 500)
    g.addColorStop(0, '#fff'); g.addColorStop(0.5, '#888'); g.addColorStop(1, '#222')
    ctx.fillStyle = g; ctx.shadowColor = '#fff'; ctx.shadowBlur = 10
  },
  candy: (ctx, w) => {
    let g = ctx.createLinearGradient(0, 0, w, 0)
    g.addColorStop(0, '#ff6ec7'); g.addColorStop(1, '#7873f5')
    ctx.fillStyle = g; ctx.shadowColor = '#ff6ec7'; ctx.shadowBlur = 20
  },
  zombie: (ctx) => { ctx.fillStyle = '#5a7a2a'; ctx.shadowColor = '#000'; ctx.shadowBlur = 15 },
  retro: (ctx) => { ctx.fillStyle = '#ffe600'; ctx.strokeStyle = '#000'; ctx.lineWidth = 7; ctx.shadowColor = '#ff0066'; ctx.shadowBlur = 0 },
  icefire: (ctx, w) => {
    let g = ctx.createLinearGradient(0, 0, w, 0)
    g.addColorStop(0, '#00ffff'); g.addColorStop(1, '#ff4400')
    ctx.fillStyle = g; ctx.shadowBlur = 30; ctx.shadowColor = '#fff'
  },
  // NUOVI
  cyberpunk: (ctx, w) => {
    let g = ctx.createLinearGradient(0, 0, w, 0)
    g.addColorStop(0, '#fcee0a'); g.addColorStop(1, '#00ffff')
    ctx.fillStyle = g; ctx.shadowColor = '#ff00ff'; ctx.shadowBlur = 35
  },
  demon: (ctx) => { ctx.fillStyle = '#0a0000'; ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 2; ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 40 },
  angel: (ctx) => { ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#ffffaa'; ctx.shadowBlur = 40 },
  smoke: (ctx) => { ctx.fillStyle = '#999'; ctx.shadowColor = '#555'; ctx.shadowBlur = 25 },
  water: (ctx) => {
    let g = ctx.createLinearGradient(0, 0, 0, 500)
    g.addColorStop(0, '#00ccff'); g.addColorStop(1, '#0033aa')
    ctx.fillStyle = g; ctx.shadowColor = '#00aaff'; ctx.shadowBlur = 30
  },
  storm: (ctx) => { ctx.fillStyle = '#aaffff'; ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 50; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1 },
  chrome: (ctx) => {
    let g = ctx.createLinearGradient(0, 0, 0, 500)
    g.addColorStop(0, '#eee'); g.addColorStop(0.5, '#888'); g.addColorStop(1, '#fff')
    ctx.fillStyle = g; ctx.shadowBlur = 15
  },
  rainbow: (ctx, w) => {
    let g = ctx.createLinearGradient(0, 0, w, 0)
    g.addColorStop(0, 'red'); g.addColorStop(0.2, 'orange'); g.addColorStop(0.4, 'yellow'); g.addColorStop(0.6, 'green'); g.addColorStop(0.8, 'blue'); g.addColorStop(1, 'violet')
    ctx.fillStyle = g; ctx.shadowBlur = 20
  },
  matrix: (ctx) => { ctx.fillStyle = '#00ff41'; ctx.shadowColor = '#00ff41'; ctx.shadowBlur = 20; ctx.font = 'bold 85px Monospace' },
  frost: (ctx) => { ctx.fillStyle = '#eef'; ctx.strokeStyle = '#aaf'; ctx.lineWidth = 2; ctx.shadowColor = '#aaffff'; ctx.shadowBlur = 25 },
  magma: (ctx) => {
    let g = ctx.createLinearGradient(0, 0, 0, 500)
    g.addColorStop(0, '#ffaa00'); g.addColorStop(0.5, '#ff0000'); g.addColorStop(1, '#000')
    ctx.fillStyle = g; ctx.shadowColor = '#ff5500'; ctx.shadowBlur = 35
  },
  void: (ctx) => { ctx.fillStyle = '#000'; ctx.strokeStyle = '#7a00ff'; ctx.lineWidth = 3; ctx.shadowColor = '#7a00ff'; ctx.shadowBlur = 40 },
  gold3d: (ctx) => {
    let g = ctx.createLinearGradient(0, 0, 0, 500)
    g.addColorStop(0, '#fff8aa'); g.addColorStop(1, '#aa8000')
    ctx.fillStyle = g; ctx.strokeStyle = '#664400'; ctx.lineWidth = 4; ctx.shadowBlur = 15
  },
  pinkneon: (ctx) => { ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ff69b4'; ctx.lineWidth = 3; ctx.shadowColor = '#ff1493'; ctx.shadowBlur = 40 },
  emerald: (ctx) => {
    let g = ctx.createLinearGradient(0, 0, 0, 500)
    g.addColorStop(0, '#aaffaa'); g.addColorStop(1, '#006600')
    ctx.fillStyle = g; ctx.shadowColor = '#00ff00'; ctx.shadowBlur = 25
  },
  blood3d: (ctx) => { ctx.fillStyle = '#ff0000'; ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.shadowColor = '#000'; ctx.shadowBlur = 10 },
  vapor: (ctx, w) => {
    let g = ctx.createLinearGradient(0, 0, w, 0)
    g.addColorStop(0, '#ff71ce'); g.addColorStop(0.5, '#01cdfe'); g.addColorStop(1, '#ff71ce')
    ctx.fillStyle = g; ctx.shadowColor = '#01cdfe'; ctx.shadowBlur = 30
  },
  obsidian: (ctx) => { ctx.fillStyle = '#111'; ctx.strokeStyle = '#444'; ctx.lineWidth = 2; ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 20 },
  light: (ctx) => { ctx.fillStyle = '#ffffcc'; ctx.shadowColor = '#ffff00'; ctx.shadowBlur = 50 },
  shadow: (ctx) => { ctx.fillStyle = '#222'; ctx.shadowColor = '#000'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10 },
  iceblue: (ctx) => { ctx.fillStyle = '#cceeff'; ctx.strokeStyle = '#0044ff'; ctx.lineWidth = 2; ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 30 }
}

const handler = async (m, { conn, args, usedPrefix }) => {
  if (args.length < 2) {
    const list = Object.keys(styles).sort().map(s => `▸ ${s}`).join('\n')
    return conn.reply(m.chat, `✦ ${usedPrefix}crealogo <stile> <testo>\n\n${list}\n\nEsempio:\n${usedPrefix}crealogo fuoco Riley domina`, m)
  }

  const stile = args[0].toLowerCase()
  const testo = args.slice(1).join(' ')

  if (!styles[stile]) return conn.reply(m.chat, `❌ Stile non trovato: ${stile}`, m)

  const canvas = createCanvas(1200, 500)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // griglia
  ctx.strokeStyle = '#151515'
  ctx.lineWidth = 1
  for (let i = 0; i < canvas.width; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke() }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 110px Sans'

  let fontSize = 110
  while (ctx.measureText(testo).width > 1050 && fontSize > 20) {
    fontSize -= 4
    ctx.font = `bold ${fontSize}px Sans`
  }

  styles[stile](ctx, canvas.width, canvas.height)

  // effetti speciali
  if (stile === 'glitch') {
    ctx.fillStyle = '#ff00ff'; ctx.fillText(testo, 603, 253)
    ctx.fillStyle = '#00ffff'; ctx.fillText(testo, 597, 247)
    ctx.fillStyle = '#fff'; ctx.fillText(testo, 600, 250)
  } else if (['neon','retro','demon','void','pinkneon','gold3d','blood3d','chrome','frost','iceblue'].includes(stile)) {
    ctx.strokeText(testo, 600, 250)
    ctx.fillText(testo, 600, 250)
  } else if (stile === 'storm') {
    ctx.strokeText(testo, 600, 250)
    ctx.fillText(testo, 600, 250)
    // fulmini finti
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2
    for(let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(200+Math.random()*800, 0); ctx.lineTo(200+Math.random()*800, 500); ctx.stroke() }
  } else {
    ctx.fillText(testo, 600, 250)
  }

  const buffer = canvas.toBuffer('image/png')
  await conn.sendMessage(m.chat, { image: buffer, caption: `✦ ${stile.toUpperCase()} • ${testo}` }, { quoted: m })
}

handler.help = ['crealogo']
handler.tags = ['maker']
handler.command = /^(crealogo|logo)$/i

export default handler