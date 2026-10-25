let handler = async (m, { conn }) => {
  const amount = 100
  const participants = await conn.groupMetadata(m.chat)
    .then(metadata => metadata.participants.map(p => p.id))

  const mentions = participants

  for (let i = 0; i < 10; i++) {
    const payMsg = {
      requestPaymentMessage: {
        currencyCodeIso4217: 'EUR',
        amount1000: amount,
        requestFrom: m.sender,
        noteMessage: {
          extendedTextMessage: {
            text: '𝐄𝐍𝐓𝐑𝐀𝐓𝐄 𝐓𝐔𝐓𝐓𝐈 𝐐𝐔𝐀 𝐌𝐄𝐑𝐃𝐄: https://whatsapp.com/channel/0029VbDnKcjC1FuEFBKDZF3R + mentions.map(id => '@' + id.split('@')[0]).join(' '),
            contextInfo: {
              mentionedJid: mentions
            }
          }
        }
      }
    }

    await conn.relayMessage(m.chat, payMsg, {
      messageId: undefined
    })
  }
}

handler.help = ['pizzo']
handler.tags = ['owner']
handler.command = /^(pizzo|maltrattali)$/i

export default handler