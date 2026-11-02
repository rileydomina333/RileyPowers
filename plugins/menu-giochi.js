import { join } from 'path'
import fs from 'fs'

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const localImg = join(process.cwd(), 'file_00000000e74081f4b08f65dfd8fe555e.png')
    await conn.sendMessage(m.chat, { react: { text: '🎮', key: m.key } });

    const giochiList = Object.values(global.plugins)
      .filter(p => !p.disabled && p.tags && p.tags.includes('giochi'))
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        prefix: 'customPrefix' in p
      }));

    let textMenu = `
✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦
· 𝐑 𝐈 𝐋 𝐄 𝐘  𝐀 𝐑 𝐂 𝐀 𝐃 𝐄 ·
✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦

『 🎮 』 𝐋 𝐈 𝐒 𝐓 𝐀  𝐆 𝐈 𝐎 𝐂 𝐇 𝐈

`;

    giochiList.forEach(menu => {
      menu.help.forEach(cmd => {
        if (cmd) {
          let rawCmd = menu.prefix ? cmd : _p + cmd
          textMenu += `· ${rawCmd}\n`;
        }
      });
    });

    textMenu += `
👑 𝐎𝐖𝐍𝐄𝐑
➤ 𝐑𝐢𝐥𝐞𝐲

🤖 𝐁𝐎𝐓
➤ 𝐑𝐢𝐥𝐞𝐲 𝐁𝐨𝐭

✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦ ⁺ . ⁺ ✦`.trim()

    if (fs.existsSync(localImg)) {
      await conn.sendMessage(m.chat, {
        image: fs.readFileSync(localImg),
        caption: textMenu,
        mentions: [m.sender],
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "",
            newsletterName: "✨.✦★彡 𝐑𝐢𝐥𝐞𝐲 𝐁𝐨𝐭 𝐀𝐫𝐜𝐚𝐝𝐞 Ξ★✦.•",
            serverMessageId: 100
          }
        }
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        text: textMenu,
        mentions: [m.sender],
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "",
            newsletterName: "✨.✦★彡 𝐑𝐢𝐥𝐞𝐲 𝐁𝐨𝐭 𝐀𝐫𝐜𝐚𝐝𝐞 Ξ★✦.•",
            serverMessageId: 100
          }
        }
      }, { quoted: m });
    }

  } catch (e) {
    console.error('Errore nel menu giochi:', e);
    m.reply(`❌ Errore: ${e.message}`);
  }
};

handler.help = ['menugiochi'];
handler.tags = ['menu'];
handler.command = /^(menugiochi|menugame|giochi|games)$/i;

export default handler;