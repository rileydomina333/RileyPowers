// ============================================================
// 👋 BENVENUTO / ADDIO - UNIVERSAL BAILEYS PLUGIN
//
// COMANDI:
// .attiva benvenuto
// .disattiva benvenuto
//
// ATTIVO DI DEFAULT
// Stato separato per ogni gruppo
// Supporta:
// - ingresso
// - aggiunta
// - uscita
// - rimozione
// - più utenti contemporaneamente
// ============================================================


// ============================================================
// CONFIGURAZIONE
// ============================================================

const CONFIG = {
    attivoDiDefault: true,

    messaggioBenvenuto: (nome, gruppo) =>
        `╭━━〔 🎉 BENVENUTO 〕━━╮\n` +
        `┃\n` +
        `┃ 👋 Benvenuto/a @${nome}!\n` +
        `┃\n` +
        `┃ 🎊 Sei entrato/a nel gruppo\n` +
        `┃ *${gruppo}*!\n` +
        `┃\n` +
        `┃ ❤️ Buona permanenza!\n` +
        `┃ 📖 Ricordati di un fari u fagnu!.\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━╯`,

    messaggioAddio: (nome, gruppo) =>
        `╭━━〔 👋 ADDIO 〕━━╮\n` +
        `┃\n` +
        `┃ 👋 @${nome} ha lasciato\n` +
        `┃ *${gruppo}*.\n` +
        `┃\n` +
        `┃ tanto faceva schifo.\n` +
        `┃ 🖕 va iaccati!\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━╯`
}


// ============================================================
// DATABASE
// ============================================================

function getChatData(jid) {

    global.db ||= {}
    global.db.data ||= {}
    global.db.data.chats ||= {}

    global.db.data.chats[jid] ||= {}

    return global.db.data.chats[jid]
}


// ============================================================
// STATO DEL PLUGIN
// ============================================================

function benvenutoAttivo(jid) {

    const chat = getChatData(jid)

    // Se mai configurato -> ATTIVO
    if (chat.benvenuto === undefined) {
        chat.benvenuto = CONFIG.attivoDiDefault
    }

    return chat.benvenuto === true
}


// ============================================================
// OTTIENI NOME GRUPPO
// ============================================================

async function getGroupName(conn, jid) {

    try {

        const metadata =
            await conn.groupMetadata(jid)

        return metadata?.subject || 'questo gruppo'

    } catch (e) {

        return 'questo gruppo'
    }
}


// ============================================================
// OTTIENI NOME UTENTE
// ============================================================

async function getUserName(conn, jid) {

    try {

        const nome =
            await conn.getName(jid)

        if (nome && nome.trim()) {
            return nome.trim()
        }

    } catch (e) {}

    return jid.split('@')[0]
}


// ============================================================
// INVIA BENVENUTO
// ============================================================

async function sendWelcome(conn, groupJid, userJid) {

    if (!benvenutoAttivo(groupJid))
        return

    const gruppo =
        await getGroupName(conn, groupJid)

    const nome =
        await getUserName(conn, userJid)

    const numero =
        userJid.split('@')[0]

    const testo =
        CONFIG.messaggioBenvenuto(
            nome || numero,
            gruppo
        )

    try {

        await conn.sendMessage(
            groupJid,
            {
                text: testo,
                mentions: [userJid]
            }
        )

    } catch (error) {

        console.error(
            '[BENVENUTO] Errore invio:',
            error
        )
    }
}


// ============================================================
// INVIA ADDIO
// ============================================================

async function sendGoodbye(conn, groupJid, userJid) {

    if (!benvenutoAttivo(groupJid))
        return

    const gruppo =
        await getGroupName(conn, groupJid)

    const nome =
        await getUserName(conn, userJid)

    const numero =
        userJid.split('@')[0]

    const testo =
        CONFIG.messaggioAddio(
            nome || numero,
            gruppo
        )

    try {

        await conn.sendMessage(
            groupJid,
            {
                text: testo,
                mentions: [userJid]
            }
        )

    } catch (error) {

        console.error(
            '[ADDIO] Errore invio:',
            error
        )
    }
}


// ============================================================
// INSTALLAZIONE EVENT LISTENER
// ============================================================
//
// Evita di registrare lo stesso listener più volte.
// ============================================================

function installParticipantListener(conn) {

    if (!conn)
        return

    // Ogni connessione ha il proprio listener
    if (conn.__benvenutoAddioInstalled)
        return

    conn.__benvenutoAddioInstalled = true

    // Baileys
    conn.ev.on(
        'group-participants.update',
        async update => {

            try {

                if (!update)
                    return

                const groupJid =
                    update.id

                const action =
                    update.action

                const participants =
                    update.participants || []

                if (!groupJid)
                    return

                if (!participants.length)
                    return

                // --------------------------------------------
                // ENTRATA
                // --------------------------------------------

                if (
                    action === 'add' ||
                    action === 'invite'
                ) {

                    for (const userJid of participants) {

                        await sendWelcome(
                            conn,
                            groupJid,
                            userJid
                        )
                    }

                    return
                }

                // --------------------------------------------
                // USCITA
                // --------------------------------------------

                if (
                    action === 'remove' ||
                    action === 'leave'
                ) {

                    for (const userJid of participants) {

                        await sendGoodbye(
                            conn,
                            groupJid,
                            userJid
                        )
                    }

                    return
                }

            } catch (error) {

                console.error(
                    '[BENVENUTO/ADDIO] Errore:',
                    error
                )
            }
        }
    )

    console.log(
        '[BENVENUTO/ADDIO] Event listener installato.'
    )
}


// ============================================================
// HANDLER COMANDI
// ============================================================

let handler = async (m, { conn, command, args }) => {

    if (!m.isGroup) {

        return m.reply(
            `❌ Questo comando può essere usato solo nei gruppi.`
        )
    }

    // Installa il listener anche se il bot ha caricato
    // il plugin dopo l'avvio.
    installParticipantListener(conn)


    // --------------------------------------------------------
    // ATTIVA
    // --------------------------------------------------------

    if (command === 'attiva') {

        if (args[0]?.toLowerCase() !== 'benvenuto') {

            return m.reply(
                `❌ Usa:\n` +
                `*.attiva benvenuto*`
            )
        }

        const chat =
            getChatData(m.chat)

        chat.benvenuto = true

        return m.reply(
            `╭━━〔 👋 BENVENUTO 〕━━╮\n` +
            `┃\n` +
            `┃ ✅ *Sistema attivato!*\n` +
            `┃\n` +
            `┃ I messaggi di entrata e uscita\n` +
            `┃ sono nuovamente attivi.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        )
    }


    // --------------------------------------------------------
    // DISATTIVA
    // --------------------------------------------------------

    if (command === 'disattiva') {

        if (args[0]?.toLowerCase() !== 'benvenuto') {

            return m.reply(
                `❌ Usa:\n` +
                `*.disattiva benvenuto*`
            )
        }

        const chat =
            getChatData(m.chat)

        chat.benvenuto = false

        return m.reply(
            `╭━━〔 🔕 BENVENUTO 〕━━╮\n` +
            `┃\n` +
            `┃ ❌ *Sistema disattivato!*\n` +
            `┃\n` +
            `┃ Non verranno più inviati\n` +
            `┃ messaggi automatici.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        )
    }


    // --------------------------------------------------------
    // STATO
    // --------------------------------------------------------

    return m.reply(
        `╭━━〔 👋 BENVENUTO 〕━━╮\n` +
        `┃\n` +
        `┃ Stato: *${benvenutoAttivo(m.chat) ? 'ATTIVO ✅' : 'DISATTIVATO ❌'}*\n` +
        `┃\n` +
        `┃ .attiva benvenuto\n` +
        `┃ .disattiva benvenuto\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━╯`
    )
}


// ============================================================
// INIZIALIZZAZIONE AUTOMATICA
// ============================================================
//
// handler.before viene eseguito quando il plugin viene
// caricato/eseguito dal sistema dei plugin.
// Serve per installare il listener senza dover digitare
// prima un comando.
// ============================================================

handler.before = async function (m, { conn }) {

    try {

        installParticipantListener(conn)

    } catch (e) {

        console.error(
            '[BENVENUTO/ADDIO] Init error:',
            e
        )
    }

    return false
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


// Solo amministratori possono modificare
// l'impostazione.
handler.group = true
handler.admin = true


export default handler