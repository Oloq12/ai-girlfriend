import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCharacterById } from "../data/characters";

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const character = getCharacterById(id);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // первый бот-месседж
  useEffect(() => {
    if (!character) return;
    if (messages.length === 0) {
      setMessages([
        {
          from: "bot",
          text: character.introMessage || "Привет! Давай пообщаемся 😊",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  if (!character) {
    return (
      <div style={{ padding: "16px" }}>
        <h2>Персонаж не найден</h2>
        <button onClick={() => navigate("/")} style={{ marginTop: 8 }}>
          Назад
        </button>
      </div>
    );
  }

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userText = trimmed;

    // сразу добавляем сообщение пользователя
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: id,
          message: userText,
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text:
              data?.error ||
              "У меня небольшие проблемы, попробуй ещё раз позже 🥺",
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Ошибка сети, попробуй ещё раз позже 🥺",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Хедер */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "none",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ← Назад
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{character.emoji}</span>
          <span style={{ fontWeight: 600 }}>{character.name}</span>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Сообщения */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.from === "user" ? "#3b82f6" : "#e5e7eb",
              color: msg.from === "user" ? "white" : "#111827",
              borderRadius: 16,
              padding: "8px 12px",
              maxWidth: "75%",
              fontSize: 14,
            }}
          >
            {msg.text}
          </div>
        ))}

        {isLoading && (
          <div
            style={{
              alignSelf: "flex-start",
              fontSize: 13,
              color: "#6b7280",
              marginTop: 4,
            }}
          >
            {character.name} печатает…
          </div>
        )}
      </div>

      {/* Инпут */}
      <div
        style={{
          padding: 8,
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "white",
          display: "flex",
          gap: 8,
        }}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напиши что-нибудь…"
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            borderRadius: 12,
            border: "1px solid #d1d5db",
            padding: "8px 10px",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "0 16px",
            backgroundColor: isLoading ? "#9ca3af" : "#3b82f6",
            color: "white",
            fontSize: 14,
            cursor: isLoading ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;