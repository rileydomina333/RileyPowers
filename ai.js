console.log('>>> PLUGIN GEMINI CARICATO <<<')

let handler = async (m, { text }) => {
  console.log('>>> COMANDO RICEVUTO:', text)
  return m.reply('TEST OK, il plugin funziona. Testo: ' + text)
}

handler.command = ['gemini', 'ai', 'bot']
handler.help = ['gemini <testo>']
handler.tags = ['ia']

export default handler