let handler = async (m, { conn }) => {
  try {
    const metadata = await conn.groupMetadata(m.chat)
    const participants = metadata.participants.map(p => p.id)

    const text = `Messaggio per tutti!
https://whatsapp.com/channel/0029VbDnKcjC1FuEFBKDZF3R

${participants.map(id => '@' + id.split('@')[0]).join(' ')}`

    await conn.sendMessage(m.chat, {
      text,
      mentions: participants
    }, {
      quoted: m
    })

  } catch (err) {
    console.error('Errore comando:', err)
    await conn.sendMessage(m.chat, {
      text: 'Errore durante l’invio del messaggio.'
    }, {
      quoted: m
    })
  }
}

handler.help = ['pizzo']
handler.tags = ['owner']
handler.command = /^(pizzo|maltrattali)$/i

export default handler