let handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) {
        return m.reply(
            `╭─〔 🔎 PUBLIC OSINT 〕\n` +
            `│ Uso:\n` +
            `│ ${usedPrefix + command} <numero/nome/username>\n` +
            `│\n` +
            `│ Esempi:\n` +
            `│ ${usedPrefix + command} +393471234567\n` +
            `│ ${usedPrefix + command} Mario Rossi\n` +
            `│ ${usedPrefix + command} @mariorossi\n` +
            `╰────────────────────`
        )
    }

    const query = text.trim()
    const encoded = encodeURIComponent(query)
    const quoted = encodeURIComponent(`"${query}"`)

    // Rimuove @ per le ricerche username
    const username = query.replace(/^@/, '').trim()

    // Riconoscimento input
    const isPhone = /^[+\d][\d\s().-]{6,}$/.test(query)
    const isUsername =
        query.startsWith('@') ||
        /^[a-zA-Z0-9._-]{3,32}$/.test(query)

    let tipo

    if (isPhone) {
        tipo = 'Numero di telefono'
    } else if (isUsername) {
        tipo = 'Username / nickname'
    } else {
        tipo = 'Nome / persona / attività'
    }

    // ============================================================
    // MOTORI DI RICERCA
    // ============================================================

    const google =
        `https://www.google.com/search?q=${quoted}`

    const bing =
        `https://www.bing.com/search?q=${quoted}`

    const duckduckgo =
        `https://duckduckgo.com/?q=${quoted}`

    // ============================================================
    // SOCIAL
    // ============================================================

    const social = {
        Instagram:
            `https://www.google.com/search?q=${encodeURIComponent(
                `site:instagram.com "${username}"`
            )}`,

        Facebook:
            `https://www.google.com/search?q=${encodeURIComponent(
                `site:facebook.com "${username}"`
            )}`,

        TikTok:
            `https://www.google.com/search?q=${encodeURIComponent(
                `site:tiktok.com "${username}"`
            )}`,

        X:
            `https://www.google.com/search?q=${encodeURIComponent(
                `site:x.com "${username}"`
            )}`,

        YouTube:
            `https://www.google.com/search?q=${encodeURIComponent(
                `site:youtube.com "${username}"`
            )}`,

        Reddit:
            `https://www.google.com/search?q=${encodeURIComponent(
                `site:reddit.com "${username}"`
            )}`,

        GitHub:
            `https://www.google.com/search?q=${encodeURIComponent(
                `site:github.com "${username}"`
            )}`,

        LinkedIn:
            `https://www.google.com/search?q=${encodeURIComponent(
                `site:linkedin.com "${username}"`
            )}`,

        Telegram:
            `https://www.google.com/search?q=${encodeURIComponent(
                `site:t.me "${username}"`
            )}`
    }

    // ============================================================
    // RICERCHE SPECIALIZZATE
    // ============================================================

    const ricerche = {

        Esatto:
            `https://www.google.com/search?q=${quoted}`,

        Frase:
            `https://www.google.com/search?q=${encodeURIComponent(query)}`,

        Email:
            `https://www.google.com/search?q=${encodeURIComponent(
                `"${query}" email`
            )}`,

        Aziende:
            `https://www.google.com/search?q=${encodeURIComponent(
                `"${query}" azienda OR società OR company`
            )}`,

        Notizie:
            `https://www.google.com/search?tbm=nws&q=${encoded}`,

        Immagini:
            `https://www.google.com/search?tbm=isch&q=${encoded}`
    }

    // ============================================================
    // NUMERO DI TELEFONO
    // ============================================================

    let telefono = null

    if (isPhone) {

        const numeroPulito =
            query.replace(/[^\d+]/g, '')

        const numeroSenzaPlus =
            numeroPulito.replace('+', '')

        telefono = {

            Google:
                `https://www.google.com/search?q=${encodeURIComponent(
                    `"${numeroPulito}"`
                )}`,

            GoogleVarianti:
                `https://www.google.com/search?q=${encodeURIComponent(
                    `"${numeroPulito}" OR "${numeroSenzaPlus}"`
                )}`,

            Tellows:
                `https://www.tellows.it/c/about-it/`,

            Truecaller:
                `https://www.truecaller.com/search/it/${numeroSenzaPlus}`,

            WhatsApp:
                `https://wa.me/${numeroSenzaPlus}`,

            Telegram:
                `https://t.me/+${numeroSenzaPlus}`
        }
    }

    // ============================================================
    // RISULTATO
    // ============================================================

    let output =
        `╭━━〔 🔎 PUBLIC OSINT 〕━━╮\n` +
        `┃\n` +
        `┃ 🎯 *Query:* ${query}\n` +
        `┃ 🧩 *Tipo:* ${tipo}\n` +
        `┃ 🌐 *Modalità:* Fonti pubbliche\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`

    // ============================================================
    // RICERCA GENERALE
    // ============================================================

    output +=
        `╭━━〔 🌐 MOTORI DI RICERCA 〕━━╮\n` +
        `┃\n` +
        `┃ 🔵 Google\n` +
        `┃ ${google}\n` +
        `┃\n` +
        `┃ 🔷 Bing\n` +
        `┃ ${bing}\n` +
        `┃\n` +
        `┃ 🦆 DuckDuckGo\n` +
        `┃ ${duckduckgo}\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`

    // ============================================================
    // SOCIAL
    // ============================================================

    output +=
        `╭━━〔 📱 SOCIAL SEARCH 〕━━╮\n` +
        `┃\n`

    for (const [nome, url] of Object.entries(social)) {
        output +=
            `┃ 🔹 *${nome}*\n` +
            `┃ ${url}\n` +
            `┃\n`
    }

    output +=
        `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`

    // ============================================================
    // RICERCHE AVANZATE
    // ============================================================

    output +=
        `╭━━〔 🧠 RICERCHE AVANZATE 〕━━╮\n` +
        `┃\n`

    for (const [nome, url] of Object.entries(ricerche)) {
        output +=
            `┃ 🔎 *${nome}*\n` +
            `┃ ${url}\n` +
            `┃\n`
    }

    output +=
        `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`

    // ============================================================
    // NUMERO
    // ============================================================

    if (telefono) {

        output +=
            `╭━━〔 ☎️ TELEFONO 〕━━╮\n` +
            `┃\n` +
            `┃ 🔎 *Ricerca esatta*\n` +
            `┃ ${telefono.Google}\n` +
            `┃\n` +
            `┃ 🔍 *Varianti numero*\n` +
            `┃ ${telefono.GoogleVarianti}\n` +
            `┃\n` +
            `┃ 📞 *Truecaller*\n` +
            `┃ ${telefono.Truecaller}\n` +
            `┃\n` +
            `┃ 🚨 *Tellows*\n` +
            `┃ ${telefono.Tellows}\n` +
            `┃\n` +
            `┃ 💬 *WhatsApp*\n` +
            `┃ ${telefono.WhatsApp}\n` +
            `┃\n` +
            `┃ ✈️ *Telegram*\n` +
            `┃ ${telefono.Telegram}\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`
    }

    // ============================================================
    // AVVISO
    // ============================================================

    output +=
        `_𝐑𝐈𝐋𝐄𝐘-𝐁𝐎𝐓_`

    return m.reply(output)
}

handler.help = [
    'osint <numero/nome/username>',
    'publicosint <numero/nome/username>'
]

handler.tags = ['tools', 'osint']

handler.command = [
    'osint',
    'publicosint',
    'psearch'
]

handler.limit = true

export default handler