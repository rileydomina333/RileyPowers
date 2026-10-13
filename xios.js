// plugin xios.js

const xiosMessages = [
  ".",
  "..",
  "..."
];

async function xiosPlugin(m, { conn }) {
  // attiva solo se scrivi.xios
  if (m.text?.trim()!== ".xios") return;

  for (let i = 0; i < xiosMessages.length; i++) {
    // aspetta 1 secondo tra un messaggio e l'altro
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await conn.sendMessage(m.chat, {
      text: xiosMessages[i]
    });
  }
}

module.exports = xiosPlugin;