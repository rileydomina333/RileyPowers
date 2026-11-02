import { join } from 'path'
import fs from 'fs'

const localImg = join(process.cwd(), 'file_00000000e74081f4b08f65dfd8fe555e.png');

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '👥', key: m.key } });

    let user = global.db.data.users[m.sender] || {}
    let { role = 'Utente' } = user
    let prems = user.premiumTime > 0 ? '𝐏𝐫𝐞𝐦𝐢𝐮𝐦' : '𝐒𝐭𝐚𝐧𝐝𝐚𝐫𝐝'
    let name = await conn.getName(m.sender) || 'Utente'

    const gruppoList = Object.values(global.plugins)
      .filter(p => !p.disabled && p.tags && p.tags.includes('gruppo'))
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        prefix: 'customPrefix' in p
      }));

    let commandsText = '';
    gruppoList.forEach(menu => {
      menu.help.forEach(cmd => {
        if (cmd) {
          let rawCmd = menu.prefix ? cmd : _p + cmd
          commandsText += `┃ ⌲ 👥 ${toTypewriter(rawCmd)}\n`;
        }
      });
    });

    let textMenu = `
⚡  〔 𝐑 𝐋 𝐘  •  𝐆 𝐑 𝐎 𝐔 𝐏 〕  ⚡

┃ 👤 𝚄𝚝𝚎𝚗𝚝𝚎 ⭔ @${m.sender.split('@')[0]}
┃ 🛡️ 𝚁𝚊𝚗𝚐𝚘 ⭔ ${role}
┃ 🛰️ 𝚂𝚝𝚊𝚝𝚞𝚜 ⭔ ${prems}
┃ 👑 𝙾𝚠𝚗𝚎𝚛 ⭔ 𝐑𝐢𝐥𝐞𝐲
┃ 🤖 𝙱𝚘𝚝 ⭔ 𝐑𝐢𝐥𝐞𝐲 𝐁𝐨𝐭

〔 ⚡ ʀʟʏ 𝙶𝚁𝙾𝚄𝙿 𝙲𝙾𝙽𝚃𝚁𝙾𝙻 ⚡ 〕
${commandsText.trim()}

_SYSTEM GROUP MANAGEMENT_
✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦`.trim()

    if (fs.existsSync(localImg)) {
      await conn.sendMessage(m.chat, {
        image: fs.readFileSync(localImg),
        caption: textMenu,
        mentions: [m.sender],
        contextInfo: {
          mentionedJid: [m.sender],
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363232743845068@newsletter',
            newsletterName: "✧ 𝐑𝐢𝐥𝐞𝐲 𝐁𝐨𝐭 𝐆𝐑𝐎𝐔𝐏 𝐀𝐃𝐌𝐈𝐍 ✧"
          }
        }
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        text: textMenu,
        mentions: [m.sender]
      }, { quoted: m })
    }

  } catch (e) {
    console.error('Errore nel menu gruppo:', e);
    m.reply(`❌ Errore: ${e.message}`);
  }
};

handler.help = ['menugruppo'];
handler.tags = ['menu'];
handler.command = /^(menugruppo|menugp|menuadmin|gruppo|group)$/i;

export default handler;

function toTypewriter(str) {
  const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const typewriter = "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"
  return str.split('').map(char => {
    const index = normal.indexOf(char)
    return index !== -1 ? [...typewriter][index] || char : char
  }).join('')
}