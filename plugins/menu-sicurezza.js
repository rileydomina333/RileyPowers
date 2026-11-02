import { join } from 'path'
import { promises as fs } from 'fs'

let handler = async (m, { conn, usedPrefix: _p, command, args, isOwner, isAdmin }) => {
  const localImg = join(process.cwd(), 'file_00000000e74081f4b08f65dfd8fe555e.png')
  
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
  global.db.data.settings[conn.user.jid] = global.db.data.settings[conn.user.jid] || {}
  let chat = global.db.data.chats[m.chat]
  let bot = global.db.data.settings[conn.user.jid]
  let nomeDelBot = global.db.data.nomedelbot || `𝐑𝐋𝐘 𝐁𝐎𝐓`

  // --- DATABASE KEYS ---
  const securityFeatures = [
    { key: 'modoadmin', db: 'modoadmin', name: 'SoloAdmin' },
    { key: 'antiporno', db: 'antiporno', name: 'AntiPorn' },
    { key: 'antigore', db: 'antigore', name: 'AntiGore' },
    { key: 'antiraid', db: 'antiraid', name: 'AntiRaid' },
    { key: 'antivoip', db: 'antivoip', name: 'AntiVoip' },
    { key: 'antilink', db: 'antiLink', name: 'Anti-Link WA' },
    { key: 'antilinksocial', db: 'antiLink2', name: 'Anti-Social' },
    { key: 'antitrava', db: 'antitrava', name: 'Anti-Trava' },
    { key: 'antinuke', db: 'antinuke', name: 'AntiNuke' },
    { key: 'antiviewonce', db: 'antioneview', name: 'Anti-ViewOnce' },
    { key: 'antispam', db: 'antispam', name: 'AntiSpam' }
  ]

  const automationFeatures = [
    { key: 'ai', db: 'ai', name: 'Intelligenza Art.' },
    { key: 'vocali', db: 'vocali', name: 'Risposte Vocali' },
    { key: 'reaction', db: 'reaction', name: 'Auto-Reazioni' },
    { key: 'autolevelup', db: 'autolevelup', name: 'Auto-LevelUp' },
    { key: 'welcome', db: 'welcome', name: 'Benvenuto' }
  ]

  const ownerFeatures = [
    { key: 'anticall', db: 'anticall', name: 'AntiChiamate' },
    { key: 'antiprivate', db: 'antiPrivate', name: 'AntiPrivato' },
    { key: 'solocreatore', db: 'soloCreatore', name: 'Solo Creatore' }
  ]

  const categories = {
    '🚨 𝐒𝐈𝐂𝐔𝐑𝐄𝐙𝐙𝐀 𝐄 𝐅𝐈𝐋𝐓𝐑𝐈': securityFeatures,
    '🗣️ 𝐌𝐎𝐃𝐄𝐑𝐀𝐙𝐈𝐎𝐍𝐄 & 𝐈𝐀': automationFeatures,
    '👑 𝐎𝐖𝐍𝐄𝐑 𝐒𝐘𝐒𝐓𝐄𝐌': ownerFeatures
  }

  // --- SE È SOLO MENU ---
  if (!args.length || /menu|help/i.test(args[0])) {
    
    let menuContent = '';
    for (const [catName, features] of Object.entries(categories)) {
      menuContent += `╭── ${catName} ──⬣\n`;
      features.forEach(f => {
        let isAttivo = (f.db.startsWith('anti') || f.key === 'anticall' ? bot[f.db] || chat[f.db] : chat[f.db]) ? '🟢' : '🔴';
        // Per owner checkiamo bot, per il resto chat
        if (ownerFeatures.some(o => o.key === f.key)) isAttivo = bot[f.db] ? '🟢' : '🔴';
        else isAttivo = chat[f.db] ? '🟢' : '🔴';
        
        menuContent += `│ ${isAttivo} ✦ ${f.name} ➭ \`${f.key.toLowerCase()}\`\n`;
      });
      menuContent += `╰───────────────⬣\n\n`;
    }

    let menuText = `
✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦
· 🛡️ 𝐌𝐄𝐍𝐔 𝐒𝐈𝐂𝐔𝐑𝐄𝐙𝐙𝐀 🛡️ ·
✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦

╭﹕ℹ️ *𝐂𝐎𝐌𝐄 𝐒𝐈 𝐔𝐒𝐀:*
│ 🟢 ${_p}attiva [comando]
│ 🔴 ${_p}disattiva [comando]
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱

${menuContent}╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩
 ୧・👑 *𝐒𝐲𝐬𝐭𝐞𝐦:* ${nomeDelBot}
 ୧・💎 *𝐀𝐝𝐦𝐢𝐧:* @${m.sender.split('@')[0]}
╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩`.trim()

    let imageBuffer = null
    try { imageBuffer = await fs.readFile(localImg) } catch {}
    
    let channelContext = {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363232743845068@newsletter',
        newsletterName: "🛡️ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 𝐂𝐎𝐍𝐓𝐑𝐎𝐋 🛡️"
      }
    }

    await conn.sendMessage(m.chat, {
      ...(imageBuffer ? { image: imageBuffer } : { image: { url: localImg } }),
      caption: menuText,
      contextInfo: channelContext
    }, { quoted: m })
    return
  }

  // --- LOGICA ATTIVA / DISATTIVA ---
  let isEnable = !/disattiva|off|0/i.test(command)
  let type = args[0].toLowerCase()
  
  let allFeatures = [...securityFeatures, ...automationFeatures, ...ownerFeatures]
  let found = allFeatures.find(f => f.key.toLowerCase() === type)
  
  if (!found) return m.reply('❓ Modulo non trovato.')

  const isOwnerKey = ownerFeatures.some(f => f.key.toLowerCase() === type)

  if (!isOwnerKey) {
    if (!m.isGroup && !isOwner) return m.reply('❌ Solo nei gruppi')
    if (m.isGroup && !isAdmin && !isOwner) return m.reply('🛡️ Solo per Admin')
    chat[found.db] = isEnable
  } else {
    if (!isOwner) return m.reply('👑 Solo per l\'Owner')
    bot[found.db] = isEnable
  }

  await m.react(isEnable ? '✅' : '❌')
  m.reply(`『 🛡️ 』 *SISTEMA AGGIORNATO*\n\nModulo: *${found.name.toUpperCase()}*\nStato: *${isEnable ? 'ATTIVATO ✅' : 'DISATTIVATO ❌'}*`)
}

handler.command = ['attiva', 'disattiva', 'on', 'off', 'enable', 'disable']
handler.help = ['menusicurezza']
handler.tags = ['admin']
export default handler