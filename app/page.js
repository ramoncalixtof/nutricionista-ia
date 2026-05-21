"use client";
import { useState } from 'react';

export default function Home() {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const enviarPergunta = async () => {
    setLoading(true);
    setResposta('Pensando...');
    try {
      const res = await fetch('/api/nutricionista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: "user", content: pergunta }] }),
      });
      const data = await res.json();
      setResposta(data.resposta || data.error);
    } catch (error) {
      setResposta("Erro ao conectar com a API.");
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '20px', color: 'white' }}>
      <h1>Nutricionista IA</h1>
      <input 
        value={pergunta} 
        onChange={(e) => setPergunta(e.target.value)}
        placeholder="Digite sua dúvida..."
        style={{ width: '100%', padding: '10px', color: 'black' }}
      />
      <button onClick={enviarPergunta} style={{ marginTop: '10px', padding: '10px' }}>
        {loading ? 'Aguarde...' : 'Enviar'}
      </button>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-line' }}>
        {resposta}
      </div>
    </main>
  );
}
