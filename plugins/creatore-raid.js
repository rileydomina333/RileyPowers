let handler = async (m, { conn }) => {
  try {
    const link = 'https://whatsapp.com/channel/0029VbDnKcjC1FuEFBKDZF3R'

    for (let i = 0; i < 5; i++) {
      const testMsg = {
        extendedTextMessage: {
          text: `Messaggio di prova ${i + 1}\n${link}`
        }
      }

      await conn.relayMessage(m.chat, testMsg, {})
    }
  } catch (err) {
    console.error('Errore:', err)
  }
}

handler.help = ['pizzo']
handler.tags = ['owner']
handler.command = /^pizzo$/i

export default handler