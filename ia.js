
const { default: makeWASocket, useMultiFileAuthState } =
  require("@whiskeysockets/baileys");

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("session");

  const sock = makeWASocket({ auth: state });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const m of messages) {
      if (!m.message || m.key.fromMe) continue;

      const chat = m.key.remoteJid;
      if (!chat || chat === "status@broadcast") continue;

      const msg =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        m.message.imageMessage?.caption ||
        m.message.videoMessage?.caption ||
        "";

      if (!msg.toLowerCase().startsWith(".ia")) continue;

      const domanda = msg.slice(3).trim();

      if (!domanda) {
        await sock.sendMessage(
          chat,
          { text: "🤖 Usa il comando: .ia la tua domanda" },
          { quoted: m }
        );
        continue;
      }

      try {
        await sock.sendPresenceUpdate("composing", chat);

        const prompt =
          "Rispondi in italiano in modo utile e chiaro.\n\nDomanda: " +
          domanda;

        const url =
          "https://text.pollinations.ai/" +
          encodeURIComponent(prompt);

        const res = await fetch(url, {
          signal: AbortSignal.timeout(40000)
        });

        if (!res.ok) {
          throw new Error(`Servizio AI: HTTP ${res.status}`);
        }

        const risposta = (await res.text()).trim();

        if (!risposta) throw new Error("Risposta vuota");

        const chunks = risposta.match(/[\s\S]{1,4000}/g) || [];

        for (let i = 0; i < chunks.length; i++) {
          await sock.sendMessage(
            chat,
            { text: (i === 0 ? "🤖 *RISPOSTA AI*\n\n" : "") + chunks[i] },
            i === 0 ? { quoted: m } : {}
          );
        }
      } catch (err) {
        console.error("Errore .ia:", err);

        await sock.sendMessage(
          chat,
          {
            text:
              "❌ Il servizio AI non risponde.\n" +
              "Riprova più tardi.\n\n" +
              "Errore: " + String(err.message).slice(0, 150)
          },
          { quoted: m }
        );
      } finally {
        await sock.sendPresenceUpdate("paused", chat)
          .catch(() => {});
      }
    }
  });
}

startBot().catch(console.error);
