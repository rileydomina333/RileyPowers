import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawn } from 'child_process'

// Se yt-dlp è installato nella tua home senza sudo
const YTDLP = path.join(os.homedir(), '.local', 'bin', 'yt-dlp')

// FFmpeg: usa il percorso del sistema oppure quello della tua home
const FFMPEG = 'ffmpeg'

function runCommand(program, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(program, args, {
      stdio: ['ignore', 'pipe', 'pipe']
    })

    let stderr = ''

    proc.stderr.on('data', data => {
      stderr += data.toString()
    })

    proc.on('error', reject)

    proc.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(stderr || `${program}: codice ${code}`))
    })
  })
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let outputPath
  let voicePath

  try {
    if (!text?.trim()) {
      return m.reply(
        `💡 *Uso corretto:*\n${usedPrefix + command} <nome canzone o URL>`
      )
    }

    const isDownloadCommand = ['playaud', 'playvid'].includes(command)
    const directUrl = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(text.trim())
      ? text.trim()
      : null

    const search = directUrl ? null : await yts(text.trim())

    const vid = directUrl
      ? {
          url: directUrl,
          title: directUrl,
          timestamp: '',
          author: { name: '' },
          views: 0,
          thumbnail: null
        }
      : search?.videos?.[0]

    if (!vid) {
      return m.reply('❌ *Nessun risultato trovato per la ricerca.*')
    }

    const url = vid.url

    // MENU CON PULSANTI
    if (!isDownloadCommand) {
      const infoMsg = `
─── 𝗥𝗜𝗟𝗘𝗬 𝗣𝗟𝗔𝗬𝗘𝗥 ───

🎵 *Titolo:* ${vid.title}
⏱️ *Durata:* ${vid.timestamp || 'N/D'}
👤 *Canale:* ${vid.author?.name || 'N/D'}
👁️ *Visualizzazioni:* ${(vid.views || 0).toLocaleString()}

👇 *Scegli il formato:*`.trim()

      const buttons = [
        {
          buttonId: `${usedPrefix}playaud ${url}`,
          buttonText: { displayText: '🎧 𝐌𝐏𝟑' },
          type: 1
        },
        {
          buttonId: `${usedPrefix}playvid ${url}`,
          buttonText: { displayText: '📹 𝐌𝐏𝟒' },
          type: 1
        }
      ]

      const buttonMessage = {
        image: vid.thumbnail ? { url: vid.thumbnail } : undefined,
        text: infoMsg,
        footer: '𝗥𝗜𝗟𝗘𝗬 𝗕𝗢𝗧 • Downloader',
        buttons,
        headerType: vid.thumbnail ? 4 : 1
      }

      return await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
    }

    await conn.sendMessage(m.chat, {
      react: { text: '⏳', key: m.key }
    })

    const isAudio = command === 'playaud'
    const tmpDir = os.tmpdir()
    const fileName = `riley_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    // Il template mantiene l'estensione reale del file prodotto.
    const outputTemplate = path.join(tmpDir, `${fileName}.%(ext)s`)
    outputPath = path.join(tmpDir, `${fileName}.${isAudio ? 'mp3' : 'mp4'}`)

    if (isAudio) {
      await runCommand(YTDLP, [
        '--no-playlist',
        '--no-progress',
        '-f', 'bestaudio/best',
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '-o', outputTemplate,
        url
      ])
    } else {
      await runCommand(YTDLP, [
        '--no-playlist',
        '--no-progress',
        '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        '--merge-output-format', 'mp4',
        '-o', outputTemplate,
        url
      ])
    }

    // yt-dlp può produrre un'estensione diversa da quella attesa.
    const extensions = isAudio
      ? ['mp3']
      : ['mp4', 'mkv', 'webm']

    const actualFile = extensions
      .map(ext => path.join(tmpDir, `${fileName}.${ext}`))
      .find(file => fs.existsSync(file))

    if (!actualFile) {
      throw new Error('Download completato ma file non trovato.')
    }

    outputPath = actualFile

    if (isAudio) {
      voicePath = path.join(tmpDir, `${fileName}.ogg`)

      await runCommand(FFMPEG, [
        '-hide_banner',
        '-loglevel', 'error',
        '-y',
        '-i', outputPath,
        '-map_metadata', '-1',
        '-vn',
        '-ar', '48000',
        '-ac', '1',
        '-c:a', 'libopus',
        '-b:a', '64k',
        '-application', 'voip',
        '-f', 'ogg',
        voicePath
      ])

      await conn.sendMessage(
        m.chat,
        {
          audio: fs.readFileSync(voicePath),
          mimetype: 'audio/ogg; codecs=opus',
          ptt: true
        },
        { quoted: m }
      )
    } else {
      // WhatsApp richiede un MP4 compatibile; converti altri formati.
      if (path.extname(outputPath).toLowerCase() !== '.mp4') {
        const convertedPath = path.join(tmpDir, `${fileName}_converted.mp4`)

        await runCommand(FFMPEG, [
          '-hide_banner',
          '-loglevel', 'error',
          '-y',
          '-i', outputPath,
          '-c:v', 'libx264',
          '-c:a', 'aac',
          '-movflags', '+faststart',
          convertedPath
        ])

        fs.unlinkSync(outputPath)
        outputPath = convertedPath
      }

      await conn.sendMessage(
        m.chat,
        {
          video: fs.readFileSync(outputPath),
          mimetype: 'video/mp4',
          caption: '✨ *Completato da 𝗥𝗜𝗟𝗘𝗬 𝗕𝗢𝗧*'
        },
        { quoted: m }
      )
    }

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {
    console.error('Riley Downloader Error:', e)

    const err = e.message || ''
    const message = /ENOENT|not found|not recognized/i.test(err)
      ? '⚠️ *yt-dlp o FFmpeg non trovato.* Controlla i percorsi di installazione.'
      : '⚠️ *Download non riuscito.* Il video potrebbe non essere disponibile o il formato non essere supportato.'

    await m.reply(message).catch(() => {})
  } finally {
    for (const file of [outputPath, voicePath]) {
      if (file && fs.existsSync(file)) {
        try {
          fs.unlinkSync(file)
        } catch {}
      }
    }
  }
}

handler.help = ['play', 'playaud', 'playvid']
handler.tags = ['downloader']
handler.command = /^(play|playaud|playvid)$/i

export default handler