const { callGroq } = require('../utils/groq')
const critic = require('./critic')

async function process(userMessage) {
  console.log('📋 Planner membuat rencana...')

  const plannerPrompt = `Kamu adalah ROBY Planner, ahli manajemen waktu berbahasa Indonesia.
User meminta: "${userMessage}"
Buatkan rencana/jadwal yang detail, realistis, dan terstruktur dengan emoji.

Format:
📅 RENCANA ROBY
================
[isi rencana]

Catatan: [tips tambahan]`

  const draft = await callGroq(plannerPrompt)
  console.log('✏️ Draft selesai, mengirim ke Critic...')

  return await critic.review(draft, userMessage)
}

module.exports = { process }
