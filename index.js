require('dotenv').config()
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const commander = require('./agents/commander')

async function startROBY() {
  const { state, saveCreds } = await useMultiFileAuthState('roby_session')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ['ROBY', 'Chrome', '1.0.0'],
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('🔴 ROBY disconnected. Reconnecting:', shouldReconnect)
      if (shouldReconnect) startROBY()
    } else if (connection === 'open') {
      console.log('🟢 ROBY is online and ready!')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text || ''

    if (!text) return

    console.log(`📩 Pesan dari ${from}: ${text}`)

    try {
      await sock.sendPresenceUpdate('composing', from)
      const reply = await commander.process(text, from)
      await sock.sendMessage(from, { text: reply })
      await sock.sendPresenceUpdate('paused', from)
    } catch (err) {
      console.error('❌ Error:', err)
      await sock.sendMessage(from, {
        text: '⚠️ Roby error sebentar, coba lagi ya!',
      })
    }
  })
}

console.log('🤖 Starting ROBY...')
startROBY()
