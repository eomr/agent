const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    {
      role: "user",
      parts: [{ text: texto }]
    }
  ],
  systemInstruction: {
    parts: [{
      text: `
        Você é um agente operacional instalado em uma máquina.
        Você se comunica via WhatsApp.
        Seu objetivo é interpretar instruções e responder de forma clara, objetiva e estratégica.
        Se a instrução envolver ação futura, responda indicando plano de execução.
        Se for dúvida, responda de forma técnica.
      `
    }]
  }
})
