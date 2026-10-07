const BAN_API = 'https://banchek-by-awais.kesug.com/bancheck.php?numero=';
const IMG_BANNED_PERMA = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4LzXyMmrB3dRgThZk0-iWhLYEcCk11UdzSSmz7_YOoI1-mEo8Wh7NDR8&s=10';
const IMG_ATTIVO = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ02Zu33YkwMxUTIyO7t_qw_bywcv8LmeJ2wfFVQDbKbQ&s=10';

async function banCheck(numero) {
  const url = BAN_API + numero;
  const r1 = await fetch(url);
  const html = await r1.text();
  const m = html.match(/toNumbers\("([0-9a-f]+)"\),\s*b\s*=\s*toNumbers\("([0-9a-f]+)"\),\s*c\s*=\s*toNumbers\("([0-9a-f]+)"\)/);
  if (!m) { try { return JSON.parse(html); } catch (e) { return { __raw: html }; } }
  const aHex = m[1], bHex = m[2], cHex = m[3];
  const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(aHex, 'hex'), Buffer.from(bHex, 'hex'));
  decipher.setAutoPadding(false);
  const cookie = Buffer.concat([decipher.update(Buffer.from(cHex, 'hex')), decipher.final()]).toString('hex');
  const r2 = await fetch(url + (url.includes('?') ? '&' : '?') + 'i=1', { headers: { Cookie: '__test=' + cookie } });
  const testo = await r2.text();
  try { return JSON.parse(testo); } catch (e) { return { __raw: testo }; }
}

const PREFISSI_BAN = {
  '1':['US','USA/Canada'],'7':['RU','Russia'],'20':['EG','Egitto'],'27':['ZA','Sudafrica'],'30':['GR','Grecia'],'31':['NL','Paesi Bassi'],
  '32':['BE','Belgio'],'33':['FR','Francia'],'34':['ES','Spagna'],'36':['HU','Ungheria'],'39':['IT','Italia'],'40':['RO','Romania'],
  '41':['CH','Svizzera'],'43':['AT','Austria'],'44':['GB','Regno Unito'],'45':['DK','Danimarca'],'46':['SE','Svezia'],'47':['NO','Norvegia'],
  '48':['PL','Polonia'],'49':['DE','Germania'],'51':['PE','Perù'],'52':['MX','Messico'],'54':['AR','Argentina'],'55':['BR','Brasile'],
  '56':['CL','Cile'],'57':['CO','Colombia'],'58':['VE','Venezuela'],'60':['MY','Malesia'],'61':['AU','Australia'],'62':['ID','Indonesia'],
  '63':['PH','Filippine'],'64':['NZ','Nuova Zelanda'],'65':['SG','Singapore'],'66':['TH','Thailandia'],'81':['JP','Giappone'],
  '82':['KR','Corea del Sud'],'84':['VN','Vietnam'],'86':['CN','Cina'],'90':['TR','Turchia'],'91':['IN','India'],'92':['PK','Pakistan'],
  '93':['AF','Afghanistan'],'94':['LK','Sri Lanka'],'95':['MM','Myanmar'],'98':['IR','Iran'],'212':['MA','Marocco'],
  '213':['DZ','Algeria'],'216':['TN','Tunisia'],'218':['LY','Libia'],'221':['SN','Senegal'],'233':['GH','Ghana'],
  '234':['NG','Nigeria'],'237':['CM','Camerun'],'251':['ET','Etiopia'],'254':['KE','Kenya'],'255':['TZ','Tanzania'],
  '256':['UG','Uganda'],'351':['PT','Portogallo'],'352':['LU','Lussemburgo'],'353':['IE','Irlanda'],'355':['AL','Albania'],
  '358':['FI','Finlandia'],'359':['BG','Bulgaria'],'380':['UA','Ucraina'],'381':['RS','Serbia'],'385':['HR','Croazia'],
  '386':['SI','Slovenia'],'420':['CZ','Repubblica Ceca'],'421':['SK','Slovacchia'],'961':['LB','Libano'],
  '962':['JO','Giordania'],'966':['SA','Arabia Saudita'],'971':['AE','Emirati Arabi'],'972':['IL','Israele'],
  '973':['BH','Bahrein'],'974':['QA','Qatar']
};
function paeseDaNumero(numero) {
  for (const len of [3, 2, 1]) {
    const v = PREFISSI_BAN[numero.slice(0, len)];
    if (v) return v[0].split('').map(function(c){ return String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65); }).join('') + ' ' + v[1];
  }
  return '🌐 Sconosciuto';
}

function formattaBan(numero, d) {
  const banned = d.banned === true;
  const reason = d.reason !== undefined ? d.reason : (d.details && d.details.reason);
  const violazione = d.details && d.details.violation_type;
  const puoAppello = (d.details && (d.details.in_app_ban_appeal === 1 || d.details.in_app_ban_appeal === true));
  const ora = new Date().toLocaleString('it-IT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const img = banned ? IMG_BANNED_PERMA : IMG_ATTIVO;
  const L = [];
  L.push('╭━━━━━━━━━━━━━━━━━━━━━━╮');
  L.push('┃  🚫 *BAN CHECKER*');
  L.push('┃  _Analisi del ban di WhatsApp_');
  L.push('╰━━━━━━━━━━━━━━━━━━━━━━╯');
  L.push('');
  L.push('╭─❀ 📱 *NUMERO*');
  L.push('│ ☎️ Telefono: +' + numero);
  L.push('│ 🌍 Paese: ' + paeseDaNumero(numero));
  L.push('╰──────────────');
  L.push('');
  L.push('╭─❀ 🔎 *ESITO*');
  if (!banned) {
    L.push('│ 🟢 Stato: *NON BANNATO*');
    L.push('│ 💬 Il numero non risulta bannato da WhatsApp.');
  } else {
    L.push('│ 🔴 Stato: *BANNATO*');
    if (violazione) L.push('│ ⚠️ Violazione: ' + violazione);
    if (reason) L.push('│ 📝 Motivo: ' + reason);
    L.push('│ ✉️ Appello possibile: ' + (puoAppello ? "SÌ (dall'app)" : 'NO'));
  }
  L.push('│ 🕒 Controllato il: ' + ora);
  L.push('╰──────────────');
  return { img: img, testo: L.join('\n') };
}

const { EventEmitter } = require('events');
const _cbOnOriginale = EventEmitter.prototype.on;
EventEmitter.prototype.on = function(ev, fn) {
  if (ev === 'messages.upsert' && !this.__checkbanAgganciato) {
    this.__checkbanAgganciato = true;
    const sockQui = this;
    const fnAvvolto = async function(data) {
      try {
        const msg = data && data.messages && data.messages[0];
        if (msg && msg.message && !msg.key.fromMe) {
          const testo = (msg.message.conversation || (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || '').trim();
          if (testo.toLowerCase().startsWith('.checkban')) {
            const mittente = msg.key.remoteJid;
            const parti = testo.split(/\s+/);
            const numero = (parti[1] || '').replace(/\D/g, '');
            if (!numero) {
              await sockQui.sendMessage(mittente, { text: '⚠️ Usa: .checkban <numero con prefisso>\nEsempio: .checkban 393331234567' });
            } else {
              try {
                const d = await banCheck(numero);
                if (d.__raw) {
                  await sockQui.sendMessage(mittente, { text: '📄 Risposta grezza per +' + numero + ':\n\n' + d.__raw.slice(0, 1000) });
                } else {
                  const r = formattaBan(numero, d);
                  try { await sockQui.sendMessage(mittente, { image: { url: r.img }, caption: r.testo }); }
                  catch (e) { await sockQui.sendMessage(mittente, { text: r.testo }); }
                }
              } catch (e) {
                await sockQui.sendMessage(mittente, { text: "❌ Non sono riuscito a contattare l'API.\n" + e.message });
              }
            }
            return;
          }
        }
      } catch (e) { console.log('checkban hook:', e.message); }
      return fn(data);
    };
    return _cbOnOriginale.call(this, ev, fnAvvolto);
  }
  return _cbOnOriginale.call(this, ev, fn);
};