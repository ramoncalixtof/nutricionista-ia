import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Você é um nutricionista clínico especializado em diabetes tipo 1. 
Seu paciente tem: 75kg, 1.83m, IMC 22.4, Diabetes Tipo 1.
Rotina: Trabalha das 08:00 às 18:00, almoça às 13:00.
Dificuldades: Não gosta de comer pela manhã, tem muita fome no almoço (13:20–13:30).
Restrições: Não come cebola e vegetais similares.
Responda sempre em português do Brasil, de forma clara, prática e empática.
Use emojis moderadamente. Organize por refeições, horários, alimentos e quantidades.
Considere sempre o controle glicêmico e a rotina do paciente.`;

export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = "AIzaSyCW2klqfS70q9vvwCuCLRPtNPn6Hre8LF8";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\nPaciente: " + JSON.stringify(body.messages) }] }]
      }),
    });

    const data = await response.json();
    
    // Verificando se a resposta do Gemini está correta
    if (!data.candidates) {
        throw new Error("Erro na resposta do Gemini");
    }

    const resposta = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ resposta });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao comunicar com o Gemini" }, { status: 500 });
  }
}
