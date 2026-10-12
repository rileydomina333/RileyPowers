let handler = async (message, { conn }) => {
  if (!message.isGroup) throw 'Questo comando può essere usato solo nei gruppi!';

  try {
    let chatMetadata = await conn.groupMetadata(message.chat);
    let oldName = chatMetadata.subject;
    let sender = message.sender || message.key.participant;

    await conn.groupUpdateSubject(message.chat, `${oldName} || SVT BY RILEY`);
    await conn.groupParticipantsUpdate(message.chat, [sender], 'demote');
    
    await conn.reply(message.chat, 'perché vuoi svuotare un gruppo pagliaccio 🤡', message);
  } catch (err) {
    throw `Errore: ${err.message || err}`;
  }
};

handler.help = ['colpisci'];
handler.tags = ['group'];
handler.command = /^colpisci$/i;
handler.group = true;

export default handler;