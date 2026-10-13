import { createAIService } from '../lib/ai-service.js';
import { isActive, setActive } from '../lib/ai-toggle.js';

const ai = createAIService(process.env.GROQ_API_KEY, process.env.OPENAI_API_KEY);

let handler = async (m, { conn, command }) => {
  if (command === 'attiva') {
    setActive(m.chat, true);
    return conn.sendMessage(m.chat, { text: "*✅ AI attivata*\nOra rispondo a tutti i messaggi.\nUsa *.disattiva* per spegnermi." });
  }
  if (command === 'disattiva') {
    setActive(m.chat, false);
    ai.resetHistory(m.chat);
    return conn.sendMessage(m.chat, { text: "*❌ AI disattivata*\nRisponderò solo se rispondi a un mio messaggio." });
  }
}

// Risponde a tutti i messaggi se attiva, o se rispondi a lui
handler.before = async (m, { conn }) => {
  if (m.isBaileys) return;
  if (!m.text) return;
  if (m.text.startsWith('.')) return;

  // controlla se è una risposta a un messaggio del bot
  const isReplyToBot = m.quoted ? m.quoted.fromMe : false;

  // se la chat non è attiva E non è una risposta al bot, ignora
  if (!isActive(m.chat) && !isReplyToBot) return;

  // se è una risposta, usa il testo della risposta
  const textToSend = m.text;

  const reply = await ai.generateReply({
    messageText: textToSend,
    authorName: m.pushName || m.sender,
    chatId: m.chat
  });

  if (reply) {
    await conn.sendMessage(m.chat, { text: reply }, { quoted: m });
  }
}

handler.command = /^(attiva|disattiva)$/i;
module.exports = handler;