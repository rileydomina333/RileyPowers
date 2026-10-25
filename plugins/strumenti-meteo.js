let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`Esempio: ${usedPrefix + command} Palermo`)

  let city = args.join(" ")
  
  try {
    // geocoding gratis
    let geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=it&format=json`).then(v => v.json())
    
    if (!geo.results || !geo.results[0]) return m.reply(`❌ Città non trovata: ${city}`)

    let { latitude, longitude, name, country, admin1 } = geo.results[0]

    let weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`).then(v => v.json())

    let c = weather.current
    let d = weather.daily

    let codes = {
      0: 'Sereno ☀️', 1: 'Quasi sereno 🌤️', 2: 'Parzialmente nuvoloso ⛅', 3: 'Nuvoloso ☁️',
      45: 'Nebbia 🌫️', 51: 'Pioviggine leggera 🌦️', 61: 'Pioggia leggera 🌧️',
      63: 'Pioggia moderata 🌧️', 65: 'Pioggia forte 🌧️', 71: 'Neve leggera ❄️',
      80: 'Rovesci leggeri 🌦️', 95: 'Temporale ⛈️'
    }

    let desc = codes[c.weather_code] || `Codice ${c.weather_code}`

    let txt = `*🌤️ METEO - ${name}*
📍 ${admin1 || ''}, ${country}
🗺️ ${latitude.toFixed(2)}, ${longitude.toFixed(2)}

*Oggi:* ${desc}
🌡️ Temperatura: ${c.temperature_2m}°C
🤔 Percepita: ${c.apparent_temperature}°C
💧 Umidità: ${c.relative_humidity_2m}%
💨 Vento: ${c.wind_speed_10m} km/h

📊 Min: ${d.temperature_2m_min[0]}°C | Max: ${d.temperature_2m_max[0]}°C
`

    await conn.sendMessage(m.chat, { text: txt }, { quoted: m })

  } catch (e) {
    console.log(e)
    m.reply('❌ Errore nel recupero meteo, riprova più tardi.')
  }
}

handler.help = ['meteo <città>']
handler.tags = ['info']
handler.command = /^(meteo|weather)$/i

export default handler