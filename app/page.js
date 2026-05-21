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
        body: JSON.stringify({ messages: [{ content: pergunta }] }),
      });
      const data = await res.json();
      setResposta(data.resposta || "Erro: " + data.error);
    } catch (e) { setResposta("Erro crítico na conexão."); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#00e676' }}>Nutri IA</h1>
      <textarea 
        value={pergunta} onChange={(e) => setPergunta(e.target.value)}
        placeholder="O que vou comer hoje?"
        style={{ width: '100%', height: '120px', padding: '15px', borderRadius: '10px', border: 'none', fontSize: '16px' }}
      />
      <button 
        onClick={enviarPergunta} 
        disabled={loading}
        style={{ width: '100%', padding: '15px', marginTop: '10px', backgroundColor: '#00e676', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px' }}
      >
        {loading ? 'Consultando...' : 'Enviar Consulta'}
      </button>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1e1e1e', borderRadius: '10px', whiteSpace: 'pre-line' }}>
        {resposta || "Aguardando sua dúvida..."}
      </div>
    </div>
  );
}
