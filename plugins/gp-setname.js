let handler = async (m, { conn, text, isBotAdmin, isAdmin }) => {
  if (!m.isGroup) return m.reply('Questo comando funziona solo nei gruppi.');
  if (!isAdmin) return m.reply('Solo gli admin possono usare questo comando.');
  if (!isBotAdmin) return m.reply('Devo essere admin per cambiare il nome.');
  if (!text || !text.trim()) return m.reply('Usa cosi:\n.setname Nuovo Nome Gruppo');

  const newName = text.trim();

  if (newName.length < 1 || newName.length > 100) {
    return m.reply('Il nome deve essere tra 1 e 100 caratteri.');
  }

  try {
    await conn.groupUpdateSubject(m.chat, newName);
    await m.reply(`Nome del gruppo cambiato in:\n${newName}`);
  } catch (e) {
    console.error('setname error:', e);
    return m.reply(`Errore durante il cambio nome: ${e.message || e}`);
  }
}

handler.help = ['setname <nuovo nome>'];
handler.tags = ['group'];
handler.command = /^setname$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;