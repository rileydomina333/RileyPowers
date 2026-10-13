let handler = async (m, { conn, text }) => {
  try {
    if (!text || !text.trim()) {
      return m.reply('Inserisci la nuova descrizione.\nEsempio: .setbio Regole del gruppo...');
    }

    if (text.length > 500) {
      return m.reply('Descrizione troppo lunga. Max 500 caratteri.');
    }

    await conn.groupUpdateDescription(m.chat, text.trim());

    await conn.sendMessage(m.chat, {
      text: `Descrizione aggiornata.\n\nNuova bio:\n${text.trim()}`
    }, { quoted: m });

  } catch (e) {
    console.error('setbio error:', e);
    
    if (e.message?.includes('not-authorized')) {
      return m.reply('Non ho i permessi per cambiare la descrizione. Rendimi admin.');
    }
    
    return m.reply(`Errore durante l'aggiornamento: ${e.message || e}`);
  }
}

handler.help = ['setbio <testo>'];
handler.tags = ['gruppo'];
handler.command = ['setbio'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;