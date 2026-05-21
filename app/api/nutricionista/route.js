import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const apiKey = "AIzaSyCW2klqfS70q9vvwCuCLRPtNPn6Hre8LF8";
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Você é um nutricionista. Responda: " + messages[0].content }] }]
      }),
    });

    const data = await response.json();
    if (!data.candidates) return NextResponse.json({ error: JSON.stringify(data) }, { status: 500 });
    
    return NextResponse.json({ resposta: data.candidates[0].content.parts[0].text });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
