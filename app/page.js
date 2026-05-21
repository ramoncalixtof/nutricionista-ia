"use client";
import { useState } from 'react';

export default function Home() {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const enviarPergunta = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/nutricionista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: pergunta }),
      });
      const data = await res.json();
      setResposta(data.resposta);
    } catch (error) {
      setResposta("Erro ao buscar resposta.");
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Nutricionista IA</h1>
      <textarea 
        value={pergunta} 
        onChange={(e) => setPergunta(e.target.value)}
        placeholder="Pergunte sobre sua dieta..."
        style={{ width: '100%', height: '100px', margin: '10px 0' }}
      />
      <button onClick={enviarPergunta} disabled={loading}>
        {loading ? 'Pensando...' : 'Enviar'}
      </button>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-line' }}>
        {resposta}
      </div>
    </main>
  );
}
