import { existsSync, promises as fsPromises } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
if (global.conn.user.jid !== conn.user.jid) {
return conn.sendMessage(m.chat, {
text: "*⟡ ACCESSO NEGATO ⟡*\n\n💠 *Usa questo comando solo dal numero del bot*"
}, { quoted: m })
}

// Percorso assoluto della cartella sessioni nella root del bot
const sessionFolder = path.resolve(process.cwd(), 'sessioni')

if (!existsSync(sessionFolder)) {
return conn.sendMessage(m.chat, {
text: "*⟡ CARTELLA NON TROVATA ⟡*\n\n💠 *Percorso cercato:*\n${sessionFolder}\n\n💠 *Controlla dove si trova realmente la cartella sessioni.*"
}, { quoted: m })
}

let deletedCount = 0

try {
const files = await fsPromises.readdir(sessionFolder, {
withFileTypes: true
})

for (const file of files) {
  // Non eliminare credenziali o sottocartelle
  if (file.name === 'creds.json' || !file.isFile()) continue

  await fsPromises.unlink(path.join(sessionFolder, file.name))
  deletedCount++
}

} catch (e) {
return conn.sendMessage(m.chat, {
text: "*⟡ ERRORE ⟡*\n\n💠 ${e.message}"
}, { quoted: m })
}

const text = deletedCount === 0
? "*⟡ SVUOTAMENTO COMPLETATO ⟡*\n\n💠 *Nessun file da eliminare.*"
: "*⟡ SESSIONI ELIMINATE ⟡*\n\n💠 *Sono stati eliminati ${deletedCount} file.*\n\n💠 *Operazione completata!*"

await conn.sendMessage(m.chat, {
text,
footer: 'RLY BOT',
buttons: [
{
buttonId: '.svuota',
buttonText: { displayText: '💠 Svuota di nuovo' },
type: 1
},
{
buttonId: '.ping',
buttonText: { displayText: '💠 Ping' },
type: 1
}
]
}, { quoted: m })
}

handler.help = ['ds']
handler.tags = ['owner']
handler.command = /^(ds|clearsession)$/i
handler.owner = true

export default handler