const { callGroq } = require('../utils/groq')
const planner = require('./planner')

async function process(userMessage, userId) {
  console.log('🎯 Commander memproses:', userMessage)

  const intentPrompt = `Kamu adalah ROBY Commander, AI assistant cerdas berbahasa Indonesia.
Tugasmu: analisis pesan user dan tentukan aksi yang tepat.

Pesan user: "${userMessage}"

Tentukan kategori:
- JADWAL: kalau user minta buat jadwal, planning, atau manajemen waktu
- TUGAS: kalau user minta breakdown tugas atau project
- RISET: kalau user minta cari info atau rangkuman
- CHAT: kalau user hanya ngobrol biasa atau tanya jawab umum

Balas HANYA dengan satu kata kategori tersebut.`

  const intent = await callGroq(intentPrompt)
  const category = intent.trim().toUpperCase()
  console.log('📊 Intent terdeteksi:', category)

  if (category === 'JADWAL' || category === 'TUGAS') {
    return await planner.process(userMessage)
  } else if (category === 'RISET') {
    return await handleRiset(userMessage)
  } else {
    return await handleChat(userMessage)
  }
}

async function handleRiset(message) {
  const prompt = `Kamu adalah ROBY, AI assistant cerdas berbahasa Indonesia.
User meminta informasi tentang: "${message}"
Berikan jawaban informatif, terstruktur, dengan emoji. Maksimal 500 kata.`
  return await callGroq(prompt)
}

async function handleChat(message) {
  const prompt = `Kamu adalah ROBY, AI assistant cerdas dan friendly berbahasa Indonesia.
Kepribadianmu: hangat, helpful, sedikit humoris, selalu semangat membantu.
Pesan user: "${message}"
Balas dengan natural dan friendly. Gunakan emoji secukupnya. Maksimal 300 kata.`
  return await callGroq(prompt)
}

module.exports = { process }
