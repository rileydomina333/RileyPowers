// .hunter - minigioco caccia
let cooldowns = {}

const animals = [
  { name: '🐰 Coniglio', rarity: 'comune', hp: 10, reward: 10, chance: 40 },
  { name: '🦊 Volpe', rarity: 'comune', hp: 20, reward: 25, chance: 25 },
  { name: '🐗 Cinghiale', rarity: 'raro', hp: 50, reward: 70, chance: 15 },
  { name: '🦌 Cervo', rarity: 'raro', hp: 70, reward: 100, chance: 10 },
  { name: '🐻 Orso', rarity: 'epico', hp: 120, reward: 250, chance: 6 },
  { name: '🐉 Drago della foresta', rarity: 'leggendario', hp: 300, reward: 1000, chance: 1 },
  { name: '👻 Nulla', rarity: 'fail', hp: 0, reward: 0, chance: 3 }
]

const weapons = {
  arco: { dmg: 20, name: '🏹 Arco' },
  fucile: { dmg: 60, name: '🔫 Fucile' },
  bazooka: { dmg: 200, name: '💥 Bazooka' }
}

function pickAnimal() {
  const r = Math.random() * 100
  let sum = 0
  for (let a of animals) {
    sum += a.chance
    if (r <= sum) return a
  }
  return animals[0]
}

const handler = async (m, { conn, usedPrefix, args }) => {
  const userId = m.sender
  const now = Date.now()
  
  if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
  const user = global.db.data.users[userId]
  
  if (!user.hunter) {
    user.hunter = {
      kills: 0,
      coins: 0,
      weapon: 'arco',
      inventory: {}
    }
  }

  // comandi extra: .hunter inv / shop
  const sub = (args[0] || '').toLowerCase()

  if (sub === 'inv' || sub === 'inventario') {
    const inv = user.hunter.inventory
    let txt = `╭─ 🏹 HUNTER INV ─╮\n│\n`
    txt += `│  Arma: ${weapons[user.hunter.weapon].name}\n`
    txt += `│  Coins: ${user.hunter.coins}\n`
    txt += `│  Kills: ${user.hunter.kills}\n│\n`
    if (Object.keys(inv).length === 0) txt += `│  Zaino vuoto\n`
    else {
      for (let k in inv) txt += `│  ${k} x${inv[k]}\n`
    }
    txt += `│\n╰─────────────╯`
    return conn.reply(m.chat, txt, m)
  }

  if (sub === 'shop') {
    let txt = `╭─ 🏹 HUNTER SHOP ─╮\n│\n`
    txt += `│  1. 🔫 Fucile - 500 coins [dmg 60]\n`
    txt += `│  2. 💥 Bazooka - 2000 coins [dmg 200]\n│\n`
    txt += `│  Usa: ${usedPrefix}hunter buy fucile\n╰────────────────╯`
    return conn.reply(m.chat, txt, m)
  }

  if (sub === 'buy') {
    const w = (args[1] || '').toLowerCase()
    if (!weapons[w] || w === 'arco') return conn.reply(m.chat, `Arma non valida.`, m)
    const price = w === 'fucile' ? 500 : 2000
    if (user.hunter.coins < price) return conn.reply(m.chat, `❌ Ti servono ${price} coins, hai ${user.hunter.coins}`, m)
    user.hunter.coins -= price
    user.hunter.weapon = w
    return conn.reply(m.chat, `✅ Hai comprato ${weapons[w].name}!\nOra fai più danni.`, m)
  }

  // cooldown 20 sec
  if (cooldowns[userId] && now - cooldowns[userId] < 20000) {
    const rest = Math.ceil((20000 - (now - cooldowns[userId])) / 1000)
    return conn.reply(m.chat, `⏳ Ricarica l'arma... ${rest}s`, m)
  }
  cooldowns[userId] = now

  const weapon = weapons[user.hunter.weapon]
  const target = pickAnimal()

  if (target.rarity === 'fail') {
    return conn.reply(m.chat, `
╭─ 🏹 CACCIA FALLITA ─╮
│
│  Hai girato per ore...
│  ma non hai trovato nulla.
│
│  ${weapon.name} - colpo a vuoto
│
╰──────────────────╯`.trim(), m)
  }

  const dmg = weapon.dmg + Math.floor(Math.random() * 20)
  const killed = dmg >= target.hp

  if (!killed) {
    return conn.reply(m.chat, `
╭─ 💨 FUGGITO ─╮
│
│  ${target.name} è scappato!
│  HP: ${target.hp} | tuo danno: ${dmg}
│
│  Riprova con arma migliore
│
╰───────────────╯`.trim(), m)
  }

  // vittoria
  user.hunter.kills++
  user.hunter.coins += target.reward
  user.hunter.inventory[target.name] = (user.hunter.inventory[target.name] || 0) + 1

  const rarityEmoji = {
    comune: '⚪', raro: '🔵', epico: '🟣', leggendario: '🟡'
  }

  let txt = `
╭─ 🎯 CACCIA RIUSCITA ─╮
│
│  ${target.name}
│  Rarità: ${rarityEmoji[target.rarity]} ${target.rarity.toUpperCase()}
│
│  ──────────────
│  Arma: ${weapon.name}
│  Danno: ${dmg} / ${target.hp} HP
│
│  ──────────────
│  +${target.reward} coins
│  Totale: ${user.hunter.coins}
│
╰───────────────────╯
`.trim()

  if (target.rarity === 'leggendario') {
    txt += `\n\n👑 LEGGENDARIO! @${m.sender.split('@')[0]} ha catturato il drago!`
  }

  await conn.reply(m.chat, txt, m, { mentions: target.rarity === 'leggendario' ? [m.sender] : [] })
}

handler.help = ['hunter', 'hunter inv', 'hunter shop']
handler.tags = ['game']
handler.command = /^(hunter|caccia)$/i

export default handler