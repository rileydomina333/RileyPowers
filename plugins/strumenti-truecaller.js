let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `╭─〔 📞 TRUECALLER INFO〕\n` +
            `│ Uso: ${usedPrefix + command} <numero>\n` +
            `│ Esempio: ${usedPrefix + command} +393471234567\n` +
            `╰────────────────────`
        )
    }

    let numero = text.replace(/[^\d+]/g, '')

    // Mantiene un solo +
    numero = numero.replace(/(?!^)\+/g, '')

    if (!numero.startsWith('+')) {
        return m.reply(
            `❌ *Prefisso internazionale mancante!*\n\n` +
            `Esempio:\n` +
            `*${usedPrefix + command} +393471234567*`
        )
    }

    // ============================================================
    // DATABASE PAESI
    // ============================================================

    const paesi = {
        '+39': 'Italia',
        '+1': 'USA / Canada',
        '+44': 'Regno Unito',
        '+33': 'Francia',
        '+49': 'Germania',
        '+34': 'Spagna',
        '+41': 'Svizzera',
        '+43': 'Austria',
        '+32': 'Belgio',
        '+31': 'Olanda',
        '+351': 'Portogallo',
        '+30': 'Grecia',
        '+7': 'Russia / Kazakistan',
        '+86': 'Cina',
        '+81': 'Giappone',
        '+91': 'India',
        '+55': 'Brasile',
        '+52': 'Messico',
        '+54': 'Argentina',
        '+61': 'Australia',
        '+64': 'Nuova Zelanda',
        '+27': 'Sudafrica',
        '+20': 'Egitto',
        '+90': 'Turchia',
        '+972': 'Israele',
        '+971': 'Emirati Arabi Uniti',
        '+966': 'Arabia Saudita',
        '+380': 'Ucraina',
        '+48': 'Polonia',
        '+40': 'Romania',
        '+359': 'Bulgaria',
        '+385': 'Croazia',
        '+386': 'Slovenia',
        '+420': 'Repubblica Ceca',
        '+421': 'Slovacchia',
        '+36': 'Ungheria',
        '+353': 'Irlanda',
        '+45': 'Danimarca',
        '+46': 'Svezia',
        '+47': 'Norvegia',
        '+358': 'Finlandia',
        '+354': 'Islanda',
        '+52': 'Messico',
        '+57': 'Colombia',
        '+51': 'Perù',
        '+56': 'Cile',
        '+58': 'Venezuela'
    }

    // ============================================================
    // PREFISSI MOBILI ITALIANI
    // ============================================================

    const mobiliITA = {
        'TIM': [
            '+39328', '+39329', '+39330', '+39331',
            '+39333', '+39334', '+39335', '+39336',
            '+39337', '+39338', '+39339', '+39360',
            '+39366'
        ],

        'Vodafone': [
            '+39340', '+39341', '+39342', '+39343',
            '+39344', '+39345', '+39346', '+39347',
            '+39348', '+39349'
        ],

        'WindTre': [
            '+39320', '+39322', '+39323', '+39324',
            '+39325', '+39327', '+39380', '+39388',
            '+39389', '+39390', '+39391', '+39392',
            '+39393'
        ],

        'Iliad': [
            '+39351', '+39352', '+39353', '+39354',
            '+39355', '+39356', '+39357'
        ],

        'PosteMobile': [
            '+39371', '+39372', '+39373', '+39374',
            '+39375', '+39376', '+39377', '+39378'
        ],

        'Ho Mobile': [
            '+39370', '+39379'
        ],

        'Kena': [
            '+39350'
        ],

        'Very Mobile': [
            '+39319'
        ]
    }

    // ============================================================
    // PREFISSI TELEFONIA FISSA ITALIANA
    // ============================================================

    const fissiITA = {
        '+3902': 'Milano',
        '+3906': 'Roma',
        '+39011': 'Torino',
        '+39051': 'Bologna',
        '+39055': 'Firenze',
        '+39081': 'Napoli',
        '+39091': 'Palermo',
        '+39010': 'Genova',
        '+39049': 'Padova',
        '+39040': 'Trieste',
        '+39070': 'Cagliari',
        '+39080': 'Bari',
        '+39050': 'Pisa',
        '+39075': 'Perugia',
        '+39071': 'Ancona',
        '+39085': 'Pescara',
        '+39095': 'Catania',
        '+39089': 'Salerno',
        '+39045': 'Verona',
        '+39046': 'Trento',
        '+39031': 'Como',
        '+39032': 'Novara',
        '+39035': 'Bergamo',
        '+39039': 'Monza',
        '+39042': 'Treviso',
        '+39041': 'Venezia'
    }

    // ============================================================
    // TROVA PAESE
    // ============================================================

    let paese = null
    let prefissoPaese = null

    const prefissiOrdinati = Object.keys(paesi)
        .sort((a, b) => b.length - a.length)

    for (const pref of prefissiOrdinati) {
        if (numero.startsWith(pref)) {
            prefissoPaese = pref
            paese = paesi[pref]
            break
        }
    }

    if (!paese) {
        return m.reply(
            `❌ *Prefisso internazionale non riconosciuto.*\n\n` +
            `📞 Numero: ${numero}\n` +
            `🔢 Prefisso analizzato: non disponibile`
        )
    }

    // ============================================================
    // ANALISI GENERALE
    // ============================================================

    const soloNumeri = numero.replace(/\D/g, '')
    const lunghezza = soloNumeri.length

    let tipo = 'Sconosciuto'
    let operatore = 'Non identificato'
    let zona = 'Non identificata'
    let sottotipo = 'Non disponibile'

    // ============================================================
    // ANALISI ITALIA
    // ============================================================

    if (numero.startsWith('+39')) {

        // MOBILE
        for (const [op, prefs] of Object.entries(mobiliITA)) {
            if (prefs.some(pref => numero.startsWith(pref))) {
                tipo = 'Mobile'
                operatore = op
                sottotipo = 'Numero cellulare'
                break
            }
        }

        // FISSO
        if (tipo === 'Sconosciuto') {

            const prefissiFissi = Object.keys(fissiITA)
                .sort((a, b) => b.length - a.length)

            for (const pref of prefissiFissi) {

                if (numero.startsWith(pref)) {
                    tipo = 'Fisso'
                    operatore = 'Rete fissa'
                    zona = fissiITA[pref]
                    sottotipo = 'Numero geografico'
                    break
                }
            }
        }

        // NUMERO NON CLASSIFICATO
        if (tipo === 'Sconosciuto') {
            tipo = 'Numero italiano'
        }
    }

    // ============================================================
    // VALIDAZIONE
    // ============================================================

    let validita = '✅ Formato plausibile'

    if (numero.startsWith('+39')) {

        if (lunghezza !== 12) {
            validita =
                `⚠️ Formato sospetto (${lunghezza} cifre, ` +
                `normalmente 12 per numeri italiani)`
        }
    }

    // ============================================================
    // FORMATO NAZIONALE
    // ============================================================

    let formatoNazionale = numero

    if (numero.startsWith('+39')) {
        formatoNazionale = '0' + numero.substring(3)
    }

    // ============================================================
    // PREFISSO OPERATORE
    // ============================================================

    let prefissoOperatore = 'Non disponibile'

    if (numero.startsWith('+39')) {

        for (const prefs of Object.values(mobiliITA)) {

            const trovato = prefs.find(pref =>
                numero.startsWith(pref)
            )

            if (trovato) {
                prefissoOperatore = trovato
                break
            }
        }
    }

    // ============================================================
    // WHATSAPP / TELEGRAM
    // ============================================================

    const numeroLink = numero.replace(/\+/g, '')

    const whatsapp =
        `https://wa.me/${numeroLink}`

    const telegram =
        `https://t.me/+${numeroLink}`

    // ============================================================
    // RICERCHE PUBBLICHE
    // ============================================================

    const google =
        `https://www.google.com/search?q=${encodeURIComponent('"' + numero + '"')}`

    const bing =
        `https://www.bing.com/search?q=${encodeURIComponent('"' + numero + '"')}`

    const duckduckgo =
        `https://duckduckgo.com/?q=${encodeURIComponent('"' + numero + '"')}`

    // ============================================================
    // GOOGLE MAPS
    // ============================================================

    const maps =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(numero)}`

    // ============================================================
    // LINK DI RICERCA NUMERO
    // ============================================================

    const tellows =
        `https://www.tellows.it/c/about-it/`

    // ============================================================
    // ANALISI NUMERICA
    // ============================================================

    const ultime3 = soloNumeri.slice(-3)
    const ultime4 = soloNumeri.slice(-4)
    const prime3 = soloNumeri.substring(0, 3)

    // ============================================================
    // RISULTATO
    // ============================================================

    let info =
        `╭━━〔 📞 NUMINFO PRO 〕━━╮\n` +
        `┃\n` +
        `┃ 📱 *Numero:* ${numero}\n` +
        `┃ 🌍 *Paese:* ${paese}\n` +
        `┃ 🔢 *Prefisso:* ${prefissoPaese}\n` +
        `┃ 📡 *Tipo:* ${tipo}\n` +
        `┃ 🏢 *Operatore:* ${operatore}\n` +
        `┃ 🔎 *Pref. operatore:* ${prefissoOperatore}\n` +
        `┃ 📋 *Sottotipo:* ${sottotipo}\n`

    if (zona !== 'Non identificata') {
        info +=
            `┃ 📍 *Zona:* ${zona}\n`
    }

    info +=
        `┃ 📏 *Cifre:* ${lunghezza}\n` +
        `┃ 🔢 *Prime 3:* ${prime3}\n` +
        `┃ 🔢 *Ultime 4:* ${ultime4}\n` +
        `┃ 🇮🇹 *Formato nazionale:* ${formatoNazionale}\n` +
        `┃ ${validita}\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +

        `╭━━〔 🔎 RICERCHE PUBBLICHE 〕━━╮\n` +
        `┃\n` +
        `┃ 🌐 Google:\n` +
        `┃ ${google}\n` +
        `┃\n` +
        `┃ 🔍 Bing:\n` +
        `┃ ${bing}\n` +
        `┃\n` +
        `┃ 🦆 DuckDuckGo:\n` +
        `┃ ${duckduckgo}\n` +
        `┃\n` +
        `┃ 🗺️ Maps:\n` +
        `┃ ${maps}\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +

        `╭━━〔 🔗 SERVIZI 〕━━╮\n` +
        `┃\n` +
        `┃ 💬 WhatsApp:\n` +
        `┃ ${whatsapp}\n` +
        `┃\n` +
        `┃ ✈️ Telegram:\n` +
        `┃ ${telegram}\n` +
        `┃\n` +
        `┃ ☎️ Tellows:\n` +
        `┃ ${tellows}\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +

        `_𝐑𝐈𝐋𝐄𝐘-𝐁𝐎𝐓_`

    return m.reply(info)
}

handler.help = ['truecaller <numero>']
handler.tags = ['tools', 'osint']
handler.command = ['truecaller', 'numinfo', 'ninfo']
handler.limit = true

export default handler