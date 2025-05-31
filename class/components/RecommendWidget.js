import { useState } from "react";

export default function RecommendWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "안녕하세요! 어떤 장소를 추천받고 싶으신가요?" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preference: input }),
      });
      const data = await res.json();
      const aiMessage = { role: "ai", content: data.result || "⚠️ 추천 결과를 가져올 수 없습니다." };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", content: "❌ 추천 실패: 서버 오류" }]);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          borderRadius: "50%",
          width: 56,
          height: 56,
          background: "#D90E15",
          color: "#fff",
          fontSize: 24,
          border: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          cursor: "pointer"
        }}
      >🍽️</button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 320,
            maxHeight: 420,
            background: "white",
            borderRadius: 12,
            padding: 12,
            boxShadow: "0 0 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >
          <div style={{ flex: 1, overflowY: "auto", marginBottom: 8 }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  background: msg.role === "ai" ? "#f6f6f6" : "#eaf7ff",
                  padding: "8px 10px",
                  marginBottom: 6,
                  borderRadius: 8,
                  fontSize: "14px",
                  lineHeight: 1.4,
                  color: "#333",
                }}
              >
                <strong>{msg.role === "ai" ? "AI" : "나"}</strong>: {msg.content}
              </div>
            ))}
            {loading && <div style={{ fontSize: 13, color: "#999" }}>추천 중...</div>}
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="먹고 싶은 음식이나 장소 입력"
              style={{
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: "6px 8px",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleAsk}
              style={{
                padding: "6px 12px",
                background: "#D90E15",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: "14px",
                cursor: "pointer"
              }}
            >전송</button>
          </div>
        </div>
      )}
    </>
  );
}
