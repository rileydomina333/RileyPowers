
let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("✅ Plugin IA caricato! Usa .ia ciao");
  }

  return m.reply("✅ Comando ricevuto correttamente!\nDomanda: " + text);
};

handler.help = ["ia"];
handler.tags = ["ai"];
handler.command = /^ia$/i;

export default handler;
