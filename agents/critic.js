const { callGroq } = require('../utils/groq')

async function review(draft, originalRequest) {
  console.log('🔍 Critic mereview rencana...')

  const criticPrompt = `Kamu adalah ROBY Critic, ahli evaluasi rencana yang kritis tapi konstruktif.

Request asli user: "${originalRequest}"

Draft dari Planner:
${draft}

Tugasmu: evaluasi, perbaiki, dan sempurnakan rencana ini.
- Tambahkan ✅ di bagian yang sudah baik
- Tambahkan 💡 untuk saran tambahan  
- Akhiri dengan motivasi singkat
- Output langsung rencana final yang sudah disempurnakan`

  const improved = await callGroq(criticPrompt)
  console.log('✅ Critic selesai!')
  return improved
}

module.exports = { review }
