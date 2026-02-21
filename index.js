require('dotenv').config()
const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

const client = new Client({
  authStrategy: new LocalAuth()
})

const conversas = {}

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
  console.log('Agente conectado ao WhatsApp.')
})

client.on('message', async (msg) => {

  const user = msg.from

  if (!conversas[user]) {
    conversas[user] = []
  }

  conversas[user].push({
    role: "user",
    parts: [{ text: msg.body }]
  })

  try {
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      systemInstruction: {
        parts: [{
          text: `
            Você é um agente operacional instalado em uma máquina física. Você recebe comandos via WhatsApp.

            INFORMAÇÃO OBRIGATÓRIA: A data e dia da semana atuais são: ${dataAtual}. Use sempre esta data quando precisar de referência temporal. Não invente datas.

            Comportamento:
            - Responda de forma objetiva e calma, sem exagerar entusiasmo
            - Não incentive novas perguntas ao final de cada resposta
            - Se a tarefa envolver ação futura, explique o plano de execução de forma direta
            - Se for apenas pergunta, responda diretamente e encerre
            - Seja útil sem ser insistente ou prolixo`
        }]
      },
      contents: conversas[user]
    })

    const textoResposta = response.text

    conversas[user].push({
      role: "model",
      parts: [{ text: textoResposta }]
    })

    await msg.reply(textoResposta)

  } catch (err) {
    console.error(err)
    await msg.reply("Erro ao processar sua solicitação.")
  }

})

client.initialize()
