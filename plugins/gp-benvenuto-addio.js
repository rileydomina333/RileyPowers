// ============================================================
// 👋 BENVENUTO / ADDIO - UNIVERSAL BAILEYS PLUGIN
// .1 benvenuto / .0 benvenuto
// .1 addio / .0 addio
// ============================================================
import { existsSync } from 'fs'

const CONFIG = {
    benvenutoAttivoDiDefault: true,
    addioAttivoDiDefault: true,

    imgBenvenuto: './media/WA_1793011863506.jpeg',
    imgAddio: './media/WA_1793011864777.jpg',

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

function getChatData(jid) {
    global.db ||= {}
    global.db.data ||= {}
    global.db.data.chats ||= {}
    global.db.data.chats[jid] ||= {}
    return global.db.data.chats[jid]
}

function benvenutoAttivo(jid) {
    const chat = getChatData(jid)
    if (chat.benvenuto === undefined) chat.benvenuto = CONFIG.benvenutoAttivoDiDefault
    return chat.benvenuto === true
}

function addioAttivo(jid) {
    const chat = getChatData(jid)
    if (chat.addio === undefined) chat.addio = CONFIG.addioAttivoDiDefault
    return chat.addio === true
}

async function getGroupName(conn, jid) {
    try {
        const metadata = await conn.groupMetadata(jid)
        return metadata?.subject || 'questo gruppo'
    } catch (e) { return 'questo gruppo' }
}

async function getUserName(conn, jid) {
    try {
        const nome = await conn.getName(jid)
        if (nome && nome.trim()) return nome.trim()
    } catch (e) {}
    return jid.split('@')[0]
}

async function sendWelcome(conn, groupJid, userJid) {
    if (!benvenutoAttivo(groupJid)) return
    const gruppo = await getGroupName(conn, groupJid)
    const nome = await getUserName(conn, userJid)
    const numero = userJid.split('@')[0]
    const testo = CONFIG.messaggioBenvenuto(nome || numero, gruppo)

    try {
        if (existsSync(CONFIG.imgBenvenuto)) {
            await conn.sendMessage(groupJid, {
                image: { url: CONFIG.imgBenvenuto },
                caption: testo,
                mentions: [userJid]
            })
        } else {
            await conn.sendMessage(groupJid, { text: testo, mentions: [userJid] })
        }
    } catch (error) {
        console.error('[BENVENUTO] Errore invio:', error)
    }
}

async function sendGoodbye(conn, groupJid, userJid) {
    if (!addioAttivo(groupJid)) return
    const gruppo = await getGroupName(conn, groupJid)
    const nome = await getUserName(conn, userJid)
    const numero = userJid.split('@')[0]
    const testo = CONFIG.messaggioAddio(nome || numero, gruppo)

    try {
        if (existsSync(CONFIG.imgAddio)) {
            await conn.sendMessage(groupJid, {
                image: { url: CONFIG.imgAddio },
                caption: testo,
                mentions: [userJid]
            })
        } else {
            await conn.sendMessage(groupJid, { text: testo, mentions: [userJid] })
        }
    } catch (error) {
        console.error('[ADDIO] Errore invio:', error)
    }
}

function installParticipantListener(conn) {
    if (!conn) return
    if (conn.__benvenutoAddioInstalled) return
    conn.__benvenutoAddioInstalled = true

    conn.ev.on('group-participants.update', async update => {
        try {
            if (!update) return
            const groupJid = update.id
            const action = update.action
            const participants = update.participants || []
            if (!groupJid) return
            if (!participants.length) return

            if (action === 'add' || action === 'invite') {
                for (const userJid of participants) await sendWelcome(conn, groupJid, userJid)
                return
            }
            if (action === 'remove' || action === 'leave') {
                for (const userJid of participants) await sendGoodbye(conn, groupJid, userJid)
                return
            }
        } catch (error) {
            console.error('[BENVENUTO/ADDIO] Errore:', error)
        }
    })
    console.log('[BENVENUTO/ADDIO] Event listener installato.')
}

let handler = async (m, { conn, command, args }) => {
    if (!m.isGroup) return m.reply(`❌ Questo comando può essere usato solo nei gruppi.`)
    installParticipantListener(conn)
    const tipo = args[0]?.toLowerCase()

    if (command === '1' && tipo === 'benvenuto') {
        const chat = getChatData(m.chat)
        chat.benvenuto = true
        return m.reply(`╭━━〔 🎉 BENVENUTO 〕━━╮\n┃\n┃ ✅ *Benvenuto attivato!*\n┃\n╰━━━━━━━━━━━━━━━━━━╯`)
    }
    if (command === '0' && tipo === 'benvenuto') {
        const chat = getChatData(m.chat)
        chat.benvenuto = false
        return m.reply(`╭━━〔 🔕 BENVENUTO 〕━━╮\n┃\n┃ ❌ *Benvenuto disattivato!*\n╰━━━━━━━━━━━━━━━━━━╯`)
    }
    if (command === '1' && tipo === 'addio') {
        const chat = getChatData(m.chat)
        chat.addio = true
        return m.reply(`╭━━〔 👋 ADDIO 〕━━╮\n┃\n┃ ✅ *Addio attivato!*\n╰━━━━━━━━━━━━━━━━━━╯`)
    }
    if (command === '0' && tipo === 'addio') {
        const chat = getChatData(m.chat)
        chat.addio = false
        return m.reply(`╭━━〔 🔕 ADDIO 〕━━╮\n┃\n┃ ❌ *Addio disattivato!*\n╰━━━━━━━━━━━━━━━━━━╯`)
    }

    return m.reply(
        `╭━━〔 👋 BENVENUTO / ADDIO 〕━━╮\n┃\n` +
        `┃ 🎉 Benvenuto: *${benvenutoAttivo(m.chat) ? 'ATTIVO ✅' : 'DISATTIVATO ❌'}*\n` +
        `┃ 👋 Addio: *${addioAttivo(m.chat) ? 'ATTIVO ✅' : 'DISATTIVATO ❌'}*\n┃\n` +
        `┃ .1 benvenuto\n┃ .0 benvenuto\n┃\n┃ .1 addio\n┃ .0 addio\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯`
    )
}

handler.before = async function (m, { conn }) {
    try { installParticipantListener(conn) } catch (e) { console.error('[BENVENUTO/ADDIO] Init error:', e) }
    return false
}

handler.command = ['1','0']
handler.help = ['1 benvenuto','0 benvenuto','1 addio','0 addio']
handler.tags = ['group']
handler.group = true
handler.admin = true

export default handler