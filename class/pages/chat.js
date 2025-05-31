// pages/chat.js
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
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "80px auto 0 auto",
      position: "relative"
    }}>
      <img
        src="/data/image/cat2.png"
        alt="cat"
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "100px",
          height: "100px",
          opacity: 0.9,
          zIndex: 10,
          animation: "float 3s ease-in-out infinite"
        }}
      />

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "24px" }}>💬 채팅</h2>

      <button
        onClick={() => router.back()}
        style={{
          marginBottom: "16px",
          background: "transparent",
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "6px 12px",
          cursor: "pointer"
        }}
      >
        ← 뒤로가기
      </button>

      <div style={{
        borderRadius: "16px",
        padding: "16px",
        height: "400px",
        overflowY: "auto",
        background: "rgba(255, 255, 255, 0.1)",
        marginBottom: "20px",
        boxShadow: "inset 0 0 12px rgba(0,0,0,0.1)"
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.sender === user?.uid ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <span style={{
              display: "inline-block",
              background: msg.sender === user?.uid ? "rgba(217, 14, 21, 0.8)" : "rgba(255, 255, 255, 0.6)",
              color: msg.sender === user?.uid ? "white" : "black",
              padding: "8px 12px",
              borderRadius: "16px",
              maxWidth: "70%",
              backdropFilter: "blur(8px)"
            }}>{msg.text}</span>
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
            backgroundColor: "rgba(255,255,255,0.6)",
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
        <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>🎯 상대방 즐겨찾기</h3>
        {targetFavorites.length === 0 ? (
          <p style={{ color: "#888" }}>즐겨찾기한 장소가 없습니다.</p>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {targetFavorites.map((item, idx) => (
              <li key={idx} style={{ marginBottom: "8px", color: "#333" }}>• {item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
