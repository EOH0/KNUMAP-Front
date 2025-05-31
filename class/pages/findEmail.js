// pages/findEmail.js
import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import styles from "../styles/Main.module.css";

export default function FindEmail() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleFindEmail = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("name", "==", name),
        where("phone", "==", phone)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setResult("");
        setError("일치하는 사용자를 찾을 수 없습니다.");
        return;
      }
      const email = snapshot.docs[0].data().email;
      setResult(`📧 가입된 이메일: ${email}`);
      setError("");
    } catch (err) {
      console.error("이메일 찾기 오류:", err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.pageTitle}>이메일 찾기</h2>
      <input
        className={styles.inputBox}
        type="text"
        placeholder="이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className={styles.inputBox}
        type="tel"
        placeholder="전화번호를 입력하세요 (예: 01012345678)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button className={styles.authButton} onClick={handleFindEmail}>
        이메일 찾기
      </button>
      {result && <div style={{ marginTop: "16px", color: "green" }}>{result}</div>}
      {error && <div style={{ marginTop: "16px", color: "red" }}>{error}</div>}
    </div>
  );
}
