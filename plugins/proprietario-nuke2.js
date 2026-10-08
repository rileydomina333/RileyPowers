let handler = async (m, { conn, isROwner }) => {
  if (!m.isGroup) return await conn.reply(m.chat, 'Questo comando funziona solo nei gruppi.', m)

  const userId = m.sender
  const groupId = m.chat
  const botJid = conn.user?.jid || conn.user?.id || ''

  try {
    const metadata = await conn.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return await conn.reply(m.chat, 'Impossibile recuperare i dati del gruppo.', m)

    const oldTitle = metadata.subject || 'FALLITI'
    const newTitle = `${oldTitle} | 𝐒𝐕𝐓 𝐁𝐘 𝐃𝐄𝐑𝐄𝐀𝐋𝐈𝐙𝐙𝐀𝐙𝐈𝐎𝐍𝐄`
    await conn.groupUpdateSubject(m.chat, newTitle)

    await conn.sendMessage(m.chat, { text: '«𝐒𝐢𝐞𝐭𝐞 𝐚𝐩𝐩𝐞𝐧𝐚 𝐬𝐭𝐚𝐭𝐢 𝐝𝐞𝐫𝐞𝐚𝐥𝐢𝐳𝐳𝐚𝐭𝐢 𝐟𝐢𝐧𝐨 𝐚𝐥𝐥𝐚 𝐯𝐨𝐬𝐭𝐫𝐚 𝐦𝐨𝐫𝐭𝐞, 𝐨𝐫𝐚 𝐚𝐯𝐞𝐭𝐞 𝐢𝐥 𝐝𝐢𝐫𝐢𝐭𝐭𝐨 𝐝𝐢 𝐬𝐭𝐚𝐫𝐞 𝐳𝐢𝐭𝐭𝐢 𝐝𝐚 𝐛𝐫𝐚𝐯𝐢 𝐜𝐚𝐧𝐢 𝐞 𝐦𝐚𝐧𝐠𝐢𝐚𝐫𝐞 𝐝𝐚𝐥𝐥𝐞 𝐯𝐨𝐬𝐭𝐫𝐞 𝐜𝐢𝐨𝐭𝐨𝐥𝐞.»' }, { quoted: m })

    const mentions = metadata.participants
      .filter(participant => participant.id !== botJid)
      .map(participant => participant.id)

    await conn.sendMessage(
      m.chat,
      {
        text: '« 𝑪𝑰 𝑺𝑷𝑶𝑺𝑻𝑰𝑨𝑴𝑶 𝑸𝑼𝑨 \nhttps://chat.whatsapp.com/KtzcRZY6hBLLV5qqZ0UbP9 »',
        mentions
      },
      { quoted: m }
    )

    const participantsToRemove = metadata.participants
      .filter(participant => participant.id !== m.sender)
      .map(participant => participant.id)

    if (participantsToRemove.length > 0) {
      try {
        await conn.groupParticipantsUpdate(m.chat, participantsToRemove, 'remove')
      } catch (error) {
        console.error('Errore kick partecipanti:', error)
      }
    }

    await conn.sendMessage(m.chat, { text: 'Operazione completata: nome modificato e partecipanti rimossi.' }, { quoted: m })
  } catch (error) {
    console.error(error)
    await conn.reply(m.chat, 'Errore durante l’esecuzione di .afterlight.', m)
  }
} 
handler.help = ['nuke']
handler.tags = ['owner']
handler.command = /^(derealizza)$/i
handler.group = true
handler.botAdmin = true
handler.rowner = true

export default handler