// ============================================================
//  PLUGIN BENVENUTO / ADDIO
//  Attivo di default
//
//  Comandi:
//  .attiva benvenuto
//  .disattiva benvenuto
//
//  Compatibile con bot basati su Baileys / WhatsApp
// ============================================================

let handler = async (m, { conn, command }) => {

    if (!m.isGroup) {
        return m.reply(
            `❌ *Questo comando può essere usato solo nei gruppi.*`
        )
    }

    // Database globale del bot
    global.db.data ||= {}
    global.db.data.chats ||= {}

    const chat = global.db.data.chats[m.chat] ||= {}

    // ATTIVA
    if (command === 'attiva') {

        chat.benvenuto = true

        return m.reply(
            `╭━━〔 👋 BENVENUTO 〕━━╮\n` +
            `┃\n` +
            `┃ ✅ *Benvenuto attivato!*\n` +
            `┃\n` +
            `┃ Da ora in poi verrà inviato\n` +
            `┃ automaticamente un messaggio\n` +
            `┃ quando qualcuno entra o esce.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        )
    }

    // DISATTIVA
    if (command === 'disattiva') {

        chat.benvenuto = false

        return m.reply(
            `╭━━〔 🔕 BENVENUTO 〕━━╮\n` +
            `┃\n` +
            `┃ ❌ *Benvenuto disattivato!*\n` +
            `┃\n` +
            `┃ Non verranno più inviati\n` +
            `┃ messaggi automatici di\n` +
            `┃ entrata e uscita.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        )
    }
}


// ============================================================
// COMANDI
// ============================================================

handler.command = [
    'attiva',
    'disattiva'
]

handler.help = [
    'attiva benvenuto',
    'disattiva benvenuto'
]

handler.tags = [
    'group'
]

handler.group = true
handler.admin = true
handler.botAdmin = true


// ============================================================
// EVENTO GRUPPO
// ============================================================

handler.before = async function (m, { conn }) {

    // Deve essere un evento di gruppo
    if (!m.isGroup) return

    // Controlliamo che esista il database
    global.db.data ||= {}
    global.db.data.chats ||= {}

    const chat = global.db.data.chats[m.chat] ||= {}

    // ========================================================
    // ATTIVO DI DEFAULT
    // ========================================================

    if (chat.benvenuto === undefined) {
        chat.benvenuto = true
    }

    // Se disattivato, non fare nulla
    if (chat.benvenuto === false) return

    // ========================================================
    // EVENTO DI CAMBIO MEMBRI
    // ========================================================

    // Baileys normalmente utilizza:
    // m.messageStubType
    // m.messageStubParameters

    const tipo = m.messageStubType

    // ========================================================
    // ENTRATA / AGGIUNTA
    // ========================================================

    if (
        tipo === 27 || // GROUP_PARTICIPANT_ADD
        tipo === 'GROUP_PARTICIPANT_ADD'
    ) {

        const users =
            m.messageStubParameters || []

        if (!users.length) return

        let metadata

        try {
            metadata =
                await conn.groupMetadata(m.chat)
        } catch (e) {
            metadata = null
        }

        const nomeGruppo =
            metadata?.subject ||
            'questo gruppo'

        for (const user of users) {

            const jid = user

            const numero =
                jid.split('@')[0]

            const nome =
                await conn.getName(jid)
                .catch(() => numero)

            const testo =
                `╭━━〔 🎉 BENVENUTO 〕━━╮\n` +
                `┃\n` +
                `┃ 👋 Benvenuto/a @${numero}!\n` +
                `┃\n` +
                `┃ 🎊 Siamo felici di averti\n` +
                `┃ nel gruppo *${nomeGruppo}*!\n` +
                `┃\n` +
                `┃ 📖 Dai un'occhiata alle regole\n` +
                `┃ e buona permanenza! ❤️\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━╯`

            await conn.sendMessage(
                m.chat,
                {
                    text: testo,
                    mentions: [jid]
                },
                {
                    quoted: m
                }
            )
        }
    }

    // ========================================================
    // USCITA / RIMOZIONE
    // ========================================================

    if (
        tipo === 28 || // GROUP_PARTICIPANT_REMOVE
        tipo === 'GROUP_PARTICIPANT_REMOVE'
    ) {

        const users =
            m.messageStubParameters || []

        if (!users.length) return

        let metadata

        try {
            metadata =
                await conn.groupMetadata(m.chat)
        } catch (e) {
            metadata = null
        }

        const nomeGruppo =
            metadata?.subject ||
            'questo gruppo'

        for (const user of users) {

            const jid = user

            const numero =
                jid.split('@')[0]

            const nome =
                await conn.getName(jid)
                .catch(() => numero)

            const testo =
                `╭━━〔 👋 ADDIO 〕━━╮\n` +
                `┃\n` +
                `┃ 👋 @${numero} ha lasciato\n` +
                `┃ *${nomeGruppo}*.\n` +
                `┃\n` +
                `┃ Ci dispiace vederti andare.\n` +
                `┃ Buona fortuna e a presto! ❤️\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━╯`

            await conn.sendMessage(
                m.chat,
                {
                    text: testo,
                    mentions: [jid]
                },
                {
                    quoted: m
                }
            )
        }
    }

    // ========================================================
    // RITORNA
    // ========================================================

    return false
}


// ============================================================
// EXPORT
// ============================================================

export default handler