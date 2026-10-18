let handler = async (m, { conn, command, text }) => {
    if (!text) return m.reply('Scrivi un nome! Esempio: *.altezza @zaffiro*')

    // Lista di altezze casuali da 140cm a 210cm
    let altezze = [
        '140cm', '145cm', '150cm', '152cm', '155cm', '158cm', 
        '160cm', '163cm', '165cm', '168cm', '170cm', '173cm', 
        '175cm', '178cm', '180cm', '183cm', '185cm', '188cm', 
        '190cm', '195cm', '200cm', '205cm', '210cm'
    ];

    let altezza = pickRandom(altezze);

    let msg = `*📏 CALCOLATORE DI ALTEZZA 📏*\n
━━━━━━━━━━━━━━━━━━━━━
${text} è alto/a *${altezza}*
━━━━━━━━━━━━━━━━━━━━━`.trim()

    m.reply(msg, null, { mentions: conn.parseMention(msg) })
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

handler.help = ['altezza']
handler.tags = ['fun']
handler.command = /^(altezza)$/i

export default handler;