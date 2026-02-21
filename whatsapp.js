require('dotenv').config()
const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const axios = require('axios')

const client = new Client({
  authStrategy: new LocalAuth()
})

client.on('qr', (qr) => {
  console.log('Escaneie o QR abaixo:')
  qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
  console.log('WhatsApp conectado!')
})

client.on('message', async (message) => {
  console.log('Mensagem recebida:', message.body)

  // Ignora grupos por enquanto
  if (message.from.includes('@g.us')) return

  const texto = message.body

  // Aqui você pode integrar seu modelo
  const resposta = await gerarResposta(texto)

  message.reply(resposta)
})

async function gerarResposta(texto) {
  // MVP simples (substituir depois pelo seu agente real)
  return `Recebi: ${texto}`
}

client.initialize()
