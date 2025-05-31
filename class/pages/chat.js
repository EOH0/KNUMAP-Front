import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";
import { UserContext } from "../lib/UserContext";

export default function ChatPage() {
  const router = useRouter();
  const { uid: targetUid } = router.query;
  const user = useContext(UserContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetFavorites, setTargetFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 👈 로딩 상태

  const chatId = user && targetUid
    ? [user.uid, targetUid].sort().join("_")
    : null;

  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false); // 👈 메시지 불러오면 로딩 종료
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const fetchTargetFavorites = async () => {
      if (!targetUid) return;
      try {
        const snap = await getDoc(doc(db, "users", targetUid));
        if (snap.exists()) {
          const data = snap.data();
          const favorites = data.favorites || [];
          setTargetFavorites(favorites);
        }
      } catch (err) {
        console.error("상대방 즐겨찾기 불러오기 실패:", err);
      }
    };
    fetchTargetFavorites();
  }, [targetUid]);

  const handleSend = async () => {
    if (!user || !newMessage.trim()) return;
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        sender: user.uid,
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      console.error("메시지 전송 실패:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  if (isLoading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        color: "#d90e15"
      }}>
        <div style={{
          animation: "bounce 1s infinite",
          fontSize: "32px"
        }}>😺 로딩 중...</div>

        <style jsx>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "80px auto", position: "relative" }}>
      <button
        onClick={() => router.back()}
        style={{
          position: "absolute",
          top: "-40px",
          left: "0",
          backgroundColor: "#eee",
          border: "none",
          borderRadius: "8px",
          padding: "6px 10px",
          fontSize: "14px",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
        }}
      >
        ⬅ 뒤로가기
      </button>

      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "24px" }}>💬 채팅</h2>

      <div style={{
        borderRadius: "16px",
        padding: "16px",
        height: "400px",
        overflowY: "auto",
        background: "#fdfcfc",
        border: "1px solid #eee",
        marginBottom: "20px"
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.sender === user?.uid ? "flex-end" : "flex-start",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {msg.sender !== user?.uid && <img src="/knu-default.png" alt="상대" style={{ width: 30, height: 30, borderRadius: "50%" }} />}
              <span style={{
                background: msg.sender === user?.uid ? "#d90e15" : "#eaeaea",
                color: msg.sender === user?.uid ? "white" : "black",
                padding: "10px 14px",
                borderRadius: "16px",
                maxWidth: "65%",
                fontSize: "15px",
                lineHeight: "1.4",
                whiteSpace: "pre-wrap"
              }}>{msg.text}</span>
              {msg.sender === user?.uid && <img src="/knu-default.png" alt="나" style={{ width: 30, height: 30, borderRadius: "50%" }} />}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            fontSize: "16px"
          }}
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#d90e15",
            color: "white",
            fontWeight: "bold"
          }}
        >전송</button>
      </div>

      <div style={{ marginTop: "32px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>상대방 즐겨찾기</h3>
        {Array.isArray(targetFavorites) && targetFavorites.length > 0 ? (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {targetFavorites.map((item, idx) => (
              <li key={idx} style={{ marginBottom: "12px", color: "#333" }}>
                • {item.name || "이름 없음"} ({item.위치 || "?"} / {item.분야 || "?"})<br />
                <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#007bff", fontSize: "14px" }}>
                  🔗 지도 링크 바로가기
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#888" }}>즐겨찾기한 장소가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
