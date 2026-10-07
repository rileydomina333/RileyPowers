let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `╭─〔 📞 NUMINFO 〕\n` +
            `│ Uso: ${usedPrefix + command} <numero>\n` +
            `│ Esempio: ${usedPrefix + command} +393471234567\n` +
            `╰───────────────`
        )
    }

    let numero = text.replace(/[^\d+]/g, '')

    if (!numero.startsWith('+')) {
        return m.reply(
            `❌ *Prefisso internazionale mancante!*\n\n` +
            `Esempio: *+39 347 1234567*`
        )
    }

    // Database prefissi Paesi
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
        '+61': 'Australia'
    }

    // Prefissi mobili italiani
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

    // Prefissi telefonia fissa italiana
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
        '+39080': 'Bari'
    }

    // Trova Paese
    let paese = null
    let prefissoPaese = null

    // Prima i prefissi più lunghi
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
            `Numero analizzato: ${numero}`
        )
    }

    let tipo = 'Sconosciuto'
    let operatore = 'Non identificato'
    let zona = null

    // Analisi numeri italiani
    if (numero.startsWith('+39')) {

        // Mobile
        for (const [op, prefs] of Object.entries(mobiliITA)) {
            if (prefs.some(pref => numero.startsWith(pref))) {
                tipo = 'Mobile'
                operatore = op
                break
            }
        }

        // Fisso
        if (tipo === 'Sconosciuto') {
            const prefissiFissi = Object.keys(fissiITA)
                .sort((a, b) => b.length - a.length)

            for (const pref of prefissiFissi) {
                if (numero.startsWith(pref)) {
                    tipo = 'Fisso'
                    zona = fissiITA[pref]
                    operatore = 'Rete fissa'
                    break
                }
            }
        }

        // Numero italiano non riconosciuto
        if (tipo === 'Sconosciuto') {
            tipo = 'Fisso / Mobile'
        }
    }

    // Validazione lunghezza
    const soloNumeri = numero.replace(/\D/g, '')
    const lunghezza = soloNumeri.length

    let validita = '✅ Formato valido'

    if (numero.startsWith('+39')) {
        if (lunghezza !== 12) {
            validita =
                `⚠️ Formato sospetto (${lunghezza} cifre, ` +
                `attese 12 per un numero italiano)`
        }
    }

    // Link
    const numeroLink = numero.replace(/\+/g, '')

    let info =
        `╭━━〔 📞 NUMINFO 〕━━╮\n` +
        `┃\n` +
        `┃ 📱 *Numero:* ${numero}\n` +
        `┃ 🌍 *Paese:* ${paese}\n` +
        `┃ 🔢 *Prefisso:* ${prefissoPaese}\n` +
        `┃ 📡 *Tipo:* ${tipo}\n` +
        `┃ 🏢 *Operatore:* ${operatore}\n`

    if (zona) {
        info += `┃ 📍 *Zona:* ${zona}\n`
    }

    info +=
        `┃ 📏 *Lunghezza:* ${lunghezza} cifre\n` +
        `┃ ${validita}\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━╯\n\n` +

        `🔗 *Link pubblici*\n` +
        `├─ WhatsApp: wa.me/${numeroLink}\n` +
        `└─ Telegram: t.me/+${numeroLink}\n\n` +

        `_⚠️ Le informazioni sono basate esclusivamente su prefissi e dati pubblici._\n` +
        `_𝐑𝐈𝐋𝐄𝐘-𝐁𝐎𝐓_`

    return m.reply(info)
}

handler.help = ['truecaller <numero>']
handler.tags = ['tools', 'osint']
handler.command = ['truecaller', 'numinfo', 'ninfo']
handler.limit = true

export default handler