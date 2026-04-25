const fetch = require('node-fetch')

async function callGroq(prompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  if (!data.choices || data.choices.length === 0) {
    throw new Error('Groq API error: ' + JSON.stringify(data))
  }
  return data.choices[0].message.content
}

module.exports = { callGroq }
