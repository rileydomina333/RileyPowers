let handler = async (m, { conn }) => {
  const messages = [".", "..", "..."];
  
  for (let msg of messages) {
    await conn.sendMessage(m.chat, { text: msg });
    await new Promise(r => setTimeout(r, 1000)); // delay 1 sec
  }
}

handler.command = /^\.xios$/i
handler.tags = ["fun"]
module.exports = handler