// pages/resetPassword.js
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import styles from "../styles/Main.module.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("📨 비밀번호 재설정 메일을 전송했습니다!");
    } catch (err) {
      setStatus("❌ 오류: " + err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.pageTitle}>비밀번호 재설정</h2>
      <input
        className={styles.inputBox}
        type="email"
        placeholder="가입한 이메일 주소 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className={styles.authButton} onClick={handleReset}>
        재설정 메일 보내기
      </button>
      <div style={{ marginTop: "12px", color: "#555" }}>{status}</div>
    </div>
  );
}
