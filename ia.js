
if ((m.text || '').trim().toLowerCase().startsWith('.ia')) {
    const domanda = m.text.trim().slice(3).trim();

    if (!domanda) {
        await this.sendMessage(m.chat, {
            text: '🤖 Usa: .ia scrivi la tua domanda'
        }, { quoted: m });
        return;
    }

    try {
        await this.sendMessage(m.chat, {
            text: '🤖 Sto pensando...'
        }, { quoted: m });

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
                            content: 'Sei un assistente utile. Rispondi in italiano.'
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
            throw new Error(`Ollama HTTP ${response.status}`);
        }

        const data = await response.json();
        const risposta = data.message?.content?.trim();

        if (!risposta) {
            throw new Error('Il modello non ha restituito una risposta');
        }

        for (let i = 0; i < risposta.length; i += 3500) {
            await this.sendMessage(m.chat, {
                text: risposta.slice(i, i + 3500)
            }, { quoted: m });
        }
    } catch (err) {
        console.error('[ERRORE IA]', err);

        await this.sendMessage(m.chat, {
            text: '❌ AI non raggiungibile. Controlla che Ollama sia avviato e che il modello qwen2.5:3b sia installato.'
        }, { quoted: m });
    }

    return;
}
```

### 3. Prova su WhatsApp

Scrivi:

` .ia Spiegami come funziona JavaScript`

**Attenzione:** `127.0.0.1` indica il server stesso. Se il bot è su un hosting remoto, Ollama deve essere installato su quel server oppure devi configurare un endpoint raggiungibile dal bot.

Questa soluzione evita le API key, ma richiede che il modello locale sia in esecuzione. Non posso promettere un funzionamento al 100% senza conoscere il tuo hosting e verificare l'esecuzione.