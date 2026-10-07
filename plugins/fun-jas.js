let handler = async (m, { conn }) => {

  const testo = `*Jas sta mongola è la mia flamerina del mio cuore,su tiktok mi flamma ma la minaccio di ban e la smette di flammarmi per paura del ban,ci scanniamo sempre ma in fondo gli voglio bene a sta flammer down*`;

  await conn.sendMessage(
    m.chat,
    {
      text: testo
    },
    { quoted: m }
  );
};

handler.help = ['jas'];
handler.tags = ['giochi'];
handler.command = ['jas'];

export default handler;