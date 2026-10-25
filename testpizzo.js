
const handler = async (m, { conn, participants }) => {
  try {
    if (!m.isGroup)
      return m.reply("❌ Solo nei gruppi.");

    const senderNumber = m.sender.split('@')[0];
    const owners = global.owner || [];

    const isOwner = owners.some(v =>
      Array.isArray(v)
        ? v[0] === senderNumber
        : v === senderNumber
    ) || m.isOwner;

    if (!isOwner)
      return m.reply("❌ Solo l'OWNER del bot può usare questo comando.");

    if (!participants?.length)
      return m.reply("❌ Nessun partecipante trovato.");

    const users = participants.map(u => conn.decodeJid(u.id));

    const simulatedPayment = {
      requestPaymentMessage: {
        currencyCodeIso4217: 'EUR',
        amount1000: 100,
        requestFrom: m.sender,
        noteMessage: {
          extendedTextMessage: {
            text: 'Richiesta di pagamento di test'
          }
        }
      }
    };

    // Simulazione locale: nessun messaggio di pagamento inviato.
    for (let i = 0; i < 150; i++) {
      console.log(
        `Test ${i + 1}/150: richiesta simulata; partecipanti: ${users.length}`
      );
    }

    return m.reply(
      `✅ Simulazione completata.\n` +
      `Richieste simulate: 150\n` +
      `Partecipanti rilevati: ${users.length}\n` +
      `Richieste reali inviate: 0`
    );

  } catch (e) {
    console.error("Errore test pagamento:", e);
    return m.reply(global.errore || "❌ Si è verificato un errore.");
  }
};

handler.help = ['testpizzo'];
handler.tags = ['owner'];
handler.command = /^testpizzo$/i;
handler.group = true;

export default handler;
