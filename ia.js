
if (text.toLowerCase().startsWith(".ia")) {
  const domanda = text.slice(3).trim();
  const chat = m.key.remoteJid;

  if (!domanda) {
    await sock.sendMessage(chat, {
      text: "Usa: .ia la tua domanda"
    }, { quoted: m });
    return;
  }

  try {
    await sock.sendMessage(chat, { text: "🤖 Sto pensando..." });

    const url =
      "https://text.pollinations.ai/" +
      encodeURIComponent(domanda);

    const res = await fetch(url, {
      signal: AbortSignal.timeout(30000)
    });

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const risposta = (await res.text()).trim();

    if (!risposta) {
      throw new Error("Risposta vuota dal servizio AI");
    }

    await sock.sendMessage(chat, {
      text: "🤖 *AI*\n\n" + risposta.slice(0, 4000)
    }, { quoted: m });

  } catch (e) {
    console.error("[IA]", e);

    await sock.sendMessage(chat, {
      text: "❌ AI non disponibile.\nErrore: " +
        String(e.message).slice(0, 200)
    }, { quoted: m });
  }
}
