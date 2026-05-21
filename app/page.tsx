"use client";

import { useState, useEffect, useRef } from "react";

export default function NutricionistaIA() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dietaGerada, setDietaGerada] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Olá! Sou seu nutricionista virtual 🥗\n\nJá tenho seu perfil completo:\n\n📋 **Seus dados:**\n• Peso: 75kg | Altura: 1,83m | IMC: 22.4\n• Diabetes Tipo 1\n• Trabalha das 08h às 18h (almoço às 13h)\n• Dificuldade de comer pela manhã\n• Muita fome no horário do almoço\n• Não come cebola e similares\n\nClique em **"Gerar Meu Plano Alimentar"** para receber sua dieta personalizada, ou me faça qualquer pergunta sobre alimentação! 💪`,
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const gerarDieta = async () => {
    const pergunta = "Crie um plano alimentar semanal completo e detalhado para mim, considerando todo o meu perfil. Inclua horários, alimentos, quantidades, dicas para controle glicêmico e estratégias para lidar com a dificuldade de comer pela manhã e a fome no almoço.";
    await enviarMensagem(pergunta, true);
    setDietaGerada(true);
  };

  const enviarMensagem = async (textoOverride = null, isDieta = false) => {
    const texto = textoOverride || input.trim();
    if (!texto || loading) return;
    if (!textoOverride) setInput("");

    const novaMensagem = { role: "user", content: texto };
    const novasMessages = [...messages, novaMensagem];
    setMessages(novasMessages);
    setLoading(true);

    try {
      const apiMessages = novasMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/nutricionista", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Erro na API");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.resposta }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Erro ao conectar. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  const sugestoes = [
    "Quais alimentos devo evitar com diabetes tipo 1?",
    "O que comer antes de dormir para não ter hipoglicemia?",
    "Como montar meu almoço em 10 minutos?",
    "Lanches rápidos para comer no trabalho?",
  ];

  const renderMensagem = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} style={{ fontWeight: 700, margin: "8px 0 2px", color: "#1a472a" }}>{line.replace(/\*\*/g, "")}</p>;
      }
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return <p key={i} style={{ margin: "2px 0", paddingLeft: 8 }}>{line}</p>;
      }
      if (line.startsWith("#")) {
        return <p key={i} style={{ fontWeight: 800, fontSize: 15, margin: "10px 0 4px", color: "#1a472a" }}>{line.replace(/#/g, "").trim()}</p>;
      }
      if (line === "") return <br key={i} />;
      return <p key={i} style={{ margin: "2px 0" }}>{line}</p>;
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear
