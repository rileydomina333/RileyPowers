import { join } from 'path'
import fs from 'fs'

let handler = async (m, { conn, usedPrefix: _p, command, args, isOwner, isAdmin }) => {
  try {
    const localImg = join(process.cwd(), 'file_00000000e74081f4b08f65dfd8fe555e.png')
    
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    global.db.data.settings[conn.user.jid] = global.db.data.settings[conn.user.jid] || {}
    let chat = global.db.data.chats[m.chat]
    let bot = global.db.data.settings[conn.user.jid]
    let nomeDelBot = '𝐑𝐋𝐘 𝐁𝐎𝐓'

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

    let isMenuCommand = /^(menusicurezza|sicurezza|adminmenu)$/i.test(command)
    let isActivation = /^(attiva|disattiva|on|off|enable|disable)$/i.test(command)

    // SE È MENU
    if (isMenuCommand || (isActivation && (!args.length || /menu|help/i.test(args[0])))) {
      
      let menuContent = '';
      for (const [catName, features] of Object.entries(categories)) {
        menuContent += `╭── ${catName} ──⬣\n`;
        features.forEach(f => {
          let active = false
          if (ownerFeatures.find(o => o.key === f.key)) active = !!bot[f.db]
          else active = !!chat[f.db]
          let icon = active ? '🟢' : '🔴';
          menuContent += `│ ${icon} ✦ ${f.name} ➭ \`${f.key}\`\n`;
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

      // FIX IMMAGINE - controlla se esiste
      if (fs.existsSync(localImg)) {
        await conn.sendMessage(m.chat, {
          image: fs.readFileSync(localImg),
          caption: menuText,
          mentions: [m.sender]
        }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, {
          text: menuText,
          mentions: [m.sender]
        }, { quoted: m })
      }
      return
    }

    // LOGICA ATTIVA/DISATTIVA
    if (isActivation) {
      let isEnable = /attiva|on|enable/i.test(command)
      let type = args[0]?.toLowerCase()
      if (!type) return m.reply(`Specifica un modulo. Es: ${_p}attiva antilink`)

      let all = [...securityFeatures, ...automationFeatures, ...ownerFeatures]
      let found = all.find(f => f.key.toLowerCase() === type)
      if (!found) return m.reply('❓ Modulo non trovato.')

      let isOwnerKey = ownerFeatures.some(f => f.key.toLowerCase() === type)
      if (!isOwnerKey) {
        if (!m.isGroup) return m.reply('❌ Solo nei gruppi')
        if (m.isGroup && !isAdmin && !isOwner) return m.reply('🛡️ Solo per Admin')
        chat[found.db] = isEnable
      } else {
        if (!isOwner) return m.reply('👑 Solo per Owner')
        bot[found.db] = isEnable
      }

      await m.react(isEnable ? '✅' : '❌')
      return m.reply(`『 🛡️ 』 *SISTEMA AGGIORNATO*\n\nModulo: *${found.name}*\nStato: *${isEnable ? 'ATTIVATO ✅' : 'DISATTIVATO ❌'}*`)
    }

  } catch (e) {
    console.error(e)
    m.reply(`❌ Errore: ${e.message}\n\n${e.stack}`)
  }
}

handler.help = ['menusicurezza', 'attiva', 'disattiva']
handler.tags = ['admin']
handler.command = /^(menusicurezza|sicurezza|adminmenu|attiva|disattiva|on|off|enable|disable)$/i
handler.admin = true
handler.group = true

export default handler