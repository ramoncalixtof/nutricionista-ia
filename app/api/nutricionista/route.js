import { NextResponse } from 'next/server';

const PERFIL = {
  peso: 75,
  altura: 1.83,
  imc: (75 / (1.83 * 1.83)).toFixed(1),
  condicao: "Diabetes Tipo 1",
  horario_trabalho: "08:00 às 18:00",
  horario_almoco: "13:00",
};

const SYSTEM_PROMPT = `Você é um nutricionista clínico especializado em diabetes tipo 1. 
Seu paciente tem o seguinte perfil:
- Peso: ${PERFIL.peso}kg | Altura: ${PERFIL.altura}m | IMC: ${PERFIL.imc}
- Condição: ${PERFIL.condicao}
- Horário de trabalho: ${PERFIL.horario_trabalho}
- Horário de almoço: ${PERFIL.horario_almoco}
- Dificuldade em comer pela manhã
- Muita fome no período do almoço (13:20–13:30)
- Restrição alimentar: não come cebola e vegetais similares

Responda sempre em português do Brasil, de forma clara, prática e empática.
Use emojis moderadamente para tornar a leitura mais agradável.
Quando for gerar o plano alimentar completo, organize por refeições com horários, alimentos e quantidades.
Sempre considere o controle glicêmico, índice glicêmico dos alimentos e a rotina do paciente.`;

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY, 
        "anthropic-version": "2023-06-01" 
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620", 
        max_tokens: 1500, 
        system: SYSTEM_PROMPT,
        messages: body.messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Erro da Anthropic:", data);
        return NextResponse.json({ error: "Erro ao comunicar com a IA." }, { status: response.status });
    }

    const resposta = data.content?.[0]?.text || "Desculpe, ocorreu um erro na resposta.";

    return NextResponse.json({ resposta });

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
