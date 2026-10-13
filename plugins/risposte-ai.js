const { createAIService } = require('../lib/ai-service.js');

// salva attivi in memoria (se riavvii il bot si resettano, ma almeno non crasha)
if (!global.aiActive) global.aiActive = new Set();
const ai = createAIService(process.env.GROQ_API_KEY, process.env.OPENAI_API_KEY);

let handler = async (m, { conn, text }) => {
  let chatId = m.chat;
  let msg = (m.text || '').trim();

  // .attiva ai
  if (/^\.attiva ai$/i.test(msg)) {
    global.aiActive.add(chatId);
    return conn.reply(m.chat, "✅ *AI attivata* in questa chat\nOra rispondo a tutto.\n`.disattiva ai` per spegnere", m);
  }

  // .disattiva ai
  if (/^\.disattiva ai$/i.test(msg)) {
    global.aiActive.delete(chatId);
    ai.resetHistory(chatId);
    return conn.reply(m.chat, "❌ *AI disattivata*\nOra rispondo solo con `.bot`", m);
  }

  // .bot
  if (/^\.bot /i.test(msg)) {
    let query = msg.replace(/^\.bot /i, '').trim();
    if (!query) return conn.reply(m.chat, "Scrivi: *.bot ciao*", m);
    
    let reply = await ai.generateReply({
      messageText: query,
      authorName: m.pushName || m.sender,
      chatId: chatId
    });
    return conn.reply(m.chat, reply, m);
  }
}

// Risposta automatica se attiva
handler.before = async (m, { conn }) => {
  if (!m.text) return;
  if (m.isBaileys) return;

  let msg = m.text.trim();
  if (/^\.attiva ai$/i.test(msg)) return;
  if (/^\.disattiva ai$/i.test(msg)) return;
  if (/^\.bot/i.test(msg)) return;
  if (msg.startsWith('.')) return; // ignora altri comandi

  if (!global.aiActive.has(m.chat)) return; // se non attiva, sta zitta

  let reply = await ai.generateReply({
    messageText: m.text,
    authorName: m.pushName || m.sender,
    chatId: m.chat
  });

  if (reply) await conn.reply(m.chat, reply, m);
}

handler.command = /^(attiva ai|disattiva ai|bot)$/i;
handler.help = ["attiva ai", "disattiva ai", "bot"];

module.exports = handler;