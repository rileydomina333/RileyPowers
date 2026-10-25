
import crypto from 'crypto'

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

  for (let i = 0; i < 150; i++) {
    await conn.relayMessage(m.chat, payMsg, {
      messageId: crypto.randomBytes(10).toString('hex')
    })
  }
}

handler.help = ['pizzo']
handler.tags = ['owner']
handler.command = /^(pizzo|maltrattali)$/i

export default handler
