const { callGroq } = require('../utils/groq')

async function execute(task, result) {
  const prompt = `Kamu adalah ROBY Executor.
Tugas: "${task}"
Hasil: "${result}"
Berikan konfirmasi singkat dan semangat bahwa tugasnya selesai. Gunakan ✅. Maksimal 2 kalimat.`
  return await callGroq(prompt)
}

module.exports = { execute }
