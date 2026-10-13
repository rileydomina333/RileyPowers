import { createAIService } from '../lib/ai-service.js';
import { isActive, setActive } from '../lib/ai-toggle.js';

const ai = createAIService(process.env.GROQ_API_KEY, process.env.OPENAI_API_KEY);

let handler = async (m, { conn }) => {
  const txt = m.text.trim();
  const lower = txt.toLowerCase();

  if (lower === '.attiva ai') {
    setActive(m.chat, true);
    return conn.sendMessage(m.chat, { text: "*✅ AI attivata*\nOra rispondo a tutto." }, { quoted: m });
  }
  
  if (lower === '.disattiva ai') {
    setActive(m.chat, false);
    ai.resetHistory(m.chat);
    return conn.sendMessage(m.chat, { text: "*❌ AI disattivata*\nNon rispondo più. Usa *.bot* per parlarmi o *.attiva ai* per riattivarmi." }, { quoted: m });
  }

  if (lower.startsWith('.bot ')) {
    const query = txt.slice(5).trim();
    if (!query) return m.reply("Usa: *.bot ciao come stai*");

    const reply = await ai.generateReply({
      messageText: query,
      authorName: m.pushName || m.sender,
      chatId: m.chat
    });
    return conn.sendMessage(m.chat, { text: reply }, { quoted: m });
  }
}

handler.before = async (m, { conn }) => {
  if (m.isBaileys) return;
  if (!m.text) return;
  
  const lower = m.text.trim().toLowerCase();
  // ignora comandi
  if (lower === '.attiva ai' || lower === '.disattiva ai' || lower.startsWith('.bot ')) return;
  if (m.text.startsWith('.')) return;

  // Se è disattivata, NON rispondere nemmeno se rispondi al bot
  if (!isActive(m.chat)) return;

  const reply = await ai.generateReply({
    messageText: m.text,
    authorName: m.pushName || m.sender,
    chatId: m.chat
  });

  if (reply) await conn.sendMessage(m.chat, { text: reply }, { quoted: m });
}

handler.command = /^(attiva ai|disattiva ai|bot)$/i;
module.exports = handler;