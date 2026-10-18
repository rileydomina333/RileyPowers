let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('⚠️ Le fiamme ardono solo nei gruppi!');

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
  if (!who) {
    return m.reply(`🔥 *FLAME ACTIVATED* 🔥\n\nTaggala persona o rispondi a un suo messaggio per iniziare!\n\nEsempio: ${usedPrefix + command} @utente`);
  }

  const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
  if (who === botNumber) return m.reply('😏 Non puoi flammare me. Finiresti arrosto prima di subito!');

  // --- BLOCCO OWNER ---
  const isOwner = (jid) => {
    const num = jid.split('@')[0].replace(/[^0-9]/g, '');
    return global.owner.some(o => o[0].replace(/[^0-9]/g, '') === num);
  };
  if (isOwner(who)) return m.reply('👑 Non puoi flammare il mio owner! È intoccabile.');
  // --------------------

  const victimName = '@' + who.split('@')[0];
  const attackerName = '@' + m.sender.split('@')[0];

  const startMsg = `
╔══════════════════════╗
   🔥 *FLAME WAR INIZIATA* 🔥
╚══════════════════════╝

👊 *Sfidante:* ${attackerName}
🎯 *Vittima:* ${victimName}

⏱️ *Durata:* 3 minuti
💬 *Il bot attacca per primo!*`;

  await conn.sendMessage(m.chat, { text: startMsg, mentions: [m.sender, who] }, { quoted: m });

  let flameCount = 0;
  let battleActive = true;

  const generateFlame = (target) => {
    const flames = [
      `${target}, sei più abusato di nicolivorno in community 🫩`,
      `${target}, sei così brutto che quando ti guardi allo specchio,lo specchio si rompe`,
      ` ${target}, sei utile come una padella bucata e uno scolapasta senza buchi`,
      `${target}, se la stupidità fosse energia, saresti una centrale elettrica!`,
      ` ${target}, sei come gli scogli,prendi schizzi ogni secondo`,
      `${target},tuo padre da bravo cane sta mangiando nella ciotola col guinzaglio perché lo sa che se non obbedisce lo smonto`,
      `${target} tua madre è come le strisce pedonali,ci passano tutti sopra`,
      `${target}, prendi talmente tanti cazzi che hai la mandibola storta per le spinte`,
      `${target} tua madre è come l'unieuro,batte,forte,sempre.`,
      `${target} sei così brutto che quando ti guardi allo specchio punti contro il telecomando per cambiare canale`
    ];
    return flames[Math.floor(Math.random() * flames.length)];
  };

  const battleHandler = async (chatUpdate) => {
    if (!battleActive) return;
    const m2 = chatUpdate.messages[0];
    if (!m2.message || m2.key.fromMe) return;
    const sender = m2.key.participant || m2.key.remoteJid;
    if (sender === who && m2.key.remoteJid === m.chat) {
      flameCount++;
      const reply = generateFlame(victimName);
      await new Promise(res => setTimeout(res, 1000));
      await conn.sendMessage(m.chat, { text: reply, mentions: [who] }, { quoted: m2 });
    }
  };

  conn.ev.on('messages.upsert', battleHandler);
  setTimeout(() => {
    if (battleActive) conn.sendMessage(m.chat, { text: generateFlame(victimName), mentions: [who] });
  }, 2000);

  setTimeout(async () => {
    if (battleActive) {
      battleActive = false;
      conn.ev.off('messages.upsert', battleHandler);
      const endMsg = `
╔══════════════════════╗
   ⏱️ *TEMPO SCADUTO!* ⏱️
╚══════════════════════╝
🥊 Il bot vince per KO tecnico!
📊 Insulti totali scagliati: ${flameCount + 1}
*Vuoi scappare?* Corri per 2,5km (ovvero **3.750 passi**)!`;
      await conn.sendMessage(m.chat, { text: endMsg, mentions: [who] });
    }
  }, 180000);
};

handler.help = ['flame'];
handler.tags = ['giochi'];
handler.command = /^(flame)$/i;
handler.group = true;

export default handler;