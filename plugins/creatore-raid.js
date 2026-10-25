let handler = async (m, { conn }) => {
  const payMsg = {
    requestPaymentMessage: {
      currencyCodeIso4217: 'EUR',
      amount1000: 100,
      requestFrom: m.sender,
      noteMessage: {
        extendedTextMessage: {
          text: '𝐄𝐍𝐓𝐑𝐀𝐓𝐄 𝐐𝐔𝐀 𝐌𝐄𝐑𝐃𝐄: \nhttps://whatsapp.com/channel/0029VbDnKcjC1FuEFBKDZF3R'
        }
      }
    }
  }

  await conn.relayMessage(m.chat, payMsg, {
    messageId: m.key.id
  })
}

handler.help = ['payciao']
handler.tags = ['fun']
handler.command = /^(payciao|pagamento)$/i

export default handler