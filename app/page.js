"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const userInput = input;
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }),
    });
    const data = await res.json();

    if (data.reply) {
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="h-96 overflow-y-auto border p-2 rounded mb-3">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "text-blue-600" : "text-green-600"}>
            <strong>{m.role}:</strong> {m.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
