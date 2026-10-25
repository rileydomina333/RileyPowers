let handler = async (m, { conn }) => {
  const amount = 100
  const link =
    'https://whatsapp.com/channel/0029VbDnKcjC1FuEFBKDZF3R'

  const payMsg = {
    requestPaymentMessage: {
      currencyCodeIso4217: 'EUR',
      amount1000: amount,
      requestFrom: m.sender,
      noteMessage: {
        extendedTextMessage: {
          text: `Ciao!\n${link}`
        }
      }
    }
  }

  await conn.relayMessage(m.chat, payMsg, {
    messageId: m.key.id
  })

  for (let i = 1; i <= 5; i++) {
    await conn.sendMessage(m.chat, {
      text: `Messaggio di prova ${i}\n${link}`
    })
  }
}

handler.help = ['payciao']
handler.tags = ['fun']
handler.command = /^(payciao|pagamento)$/i

export default handler