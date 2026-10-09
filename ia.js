
const axios = require("axios");

module.exports = {
  command: ".ia",

  async execute(sock, m, args) {
    const domanda = args.join(" ").trim();

    if (!domanda) {
      return sock.sendMessage(
        m.key.remoteJid,
        { text: "🤖 Scrivi una domanda!\nEsempio: .ia Ciao, come stai?" },
        { quoted: m }
      );
    }

    const chat = m.key.remoteJid;

    try {
      await sock.sendMessage(chat, {
        react: { text: "🤖", key: m.key }
      });

      const response = await fetch(
        "https://text.pollinations.ai/openai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openai",
            messages: [
              {
                role: "system",
                content: "Sei un assistente AI utile e veloce. Rispondi in italiano."
              },
              {
                role: "user",
                content: domanda
              }
            ]
          }),
          signal: AbortSignal.timeout(45000)
        }
      );

      if (!response.ok) {
        throw new Error(`Errore API: ${response.status}`);
      }

      const data = await response.json();

      const risposta =
        data.choices?.[0]?.message?.content ||
        data.message ||
        data.response;

      if (!risposta) {
        throw new Error("Risposta AI vuota");
      }

      await sock.sendMessage(
        chat,
        { text: `🤖 *AI*\n\n${risposta}` },
        { quoted: m }
      );

    } catch (err) {
      console.error("Errore IA:", err);

      await sock.sendMessage(
        chat,
        { text: "❌ AI non disponibile al momento. Riprova tra poco." },
        { quoted: m }
      );
    }
  }
};
