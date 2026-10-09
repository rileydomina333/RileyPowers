
const handler = async (m, { conn, text }) => {
  const domanda = (text || '').trim();

  if (!domanda) {
    return m.reply('🤖 Usa il comando così:\n.ia Ciao, come stai?');
  }

  await conn.sendMessage(m.chat, {
    text: '🤖 Sto pensando...'
  }, { quoted: m });

  try {
    const response = await fetch(
      'http://127.0.0.1:11434/api/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: [
            {
              role: 'system',
              content: 'Sei Riley AI, un assistente intelligente. Rispondi in italiano in modo chiaro e utile.'
            },
            {
              role: 'user',
              content: domanda
            }
          ],
          stream: false
        }),
        signal: AbortSignal.timeout(120000)
      }
    );

    if (!response.ok) {
      throw new Error(
        `Ollama HTTP ${response.status}: ${await response.text()}`
      );
    }

    const data = await response.json();
    const risposta = data.message?.content?.trim();

    if (!risposta) {
      throw new Error('Risposta vuota da Ollama');
    }

    const parti = risposta.match(/[\s\S]{1,3500}/g) || [];

    for (const parte of parti) {
      await conn.sendMessage(m.chat, {
        text: parte
      }, { quoted: m });
    }

  } catch (err) {
    console.error('[RILEY AI]', err);

    await conn.sendMessage(m.chat, {
      text:
        '❌ *Riley AI non è disponibile.*\n\n' +
        'Errore: ' + String(err.message).slice(0, 500) +
        '\n\nControlla Ollama sul VPS e il modello qwen2.5:3b.'
    }, { quoted: m });
  }
};

handler.help = ['ia <domanda>'];
handler.tags = ['ai'];
handler.command = /^ia$/i;

export default handler;
