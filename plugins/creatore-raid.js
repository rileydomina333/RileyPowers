
import crypto from 'crypto'

let handler = async (m, { conn }) => {
  const payMsg = {
    requestPaymentMessage: {
      currencyCodeIso4217: 'EUR',
      amount1000: 100,
      requestFrom: m.sender,
      noteMessage: {
        extendedTextMessage: {
          text: 'Ciao!\nhttps://whatsapp.com/channel/0029VbDnKcjC1FuEFBKDZF3R'
        }
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    await conn.relayMessage(m.chat, payMsg, {
      messageId: crypto.randomBytes(10).toString('hex')
    })
  }
}

handler.help = ['payciao']
handler.tags = ['fun']
handler.command = /^(payciao|pagamento)$/i

export default handler
