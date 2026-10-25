let handler = async (m, { conn }) => {
  try {
    const payMsg = {
      requestPaymentMessage: {
        currencyCodeIso4217: 'EUR',
        amount1000: 100000,
        requestFrom: m.sender,
        noteMessage: {
          extendedTextMessage: {
            text: 'Richiesta di pagamento: 100 EUR'
          }
        }
      }
    }

    await conn.relayMessage(m.chat, payMsg, {})
  } catch (err) {
    console.error('Errore richiesta pagamento:', err)
    await conn.sendMessage(m.chat, {
      text: 'Impossibile inviare la richiesta di pagamento con questa versione di Baileys.'
    }, { quoted: m })
  }
}

handler.help = ['pizzo']
handler.tags = ['owner']
handler.command = /^(pizzo|maltrattali)$/i

export default handler