import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = "AIzaSyCW2klqfS70q9vvwCuCLRPtNPn6Hre8LF8";
    
    // Usando a estrutura de URL direta sem v1beta
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Você é um nutricionista especialista. Paciente diabético tipo 1. Responda: " + body.messages[0].content }] }]
      }),
    });

    const data = await response.json();
    
    if (data.error) {
        return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ resposta: data.candidates[0].content.parts[0].text });
  } catch (error) {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
