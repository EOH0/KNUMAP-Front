import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import styles from "../styles/Main.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공!");
      router.push("/");
    } catch (err) {
      alert("로그인 실패: " + err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.pageTitle}>로그인</h2>
      <input
        className={styles.inputBox}
        type="email"
        placeholder="이메일을 입력하세요"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={styles.inputBox}
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleLogin();
        }}
      />
      <button className={styles.authButton} onClick={handleLogin}>
        로그인
      </button>
      <div style={{ marginTop: "12px", textAlign: "center", fontSize: "14px" }}>
        <a href="#" onClick={(e) => {
          e.preventDefault();
          router.push("/findEmail");
        }} style={{ color: "#007bff", textDecoration: "underline" }}>
          이메일(아이디)을 잊으셨나요?
        </a>
      </div>
      <div style={{ marginTop: "16px", textAlign: "center", fontSize: "14px" }}>
        <a href="#" onClick={(e) => {
          e.preventDefault();
          router.push("/resetPassword");
        }} style={{ color: "#007bff", textDecoration: "underline" }}>
          비밀번호를 잊으셨나요?
        </a>
      </div>
    </div>
  );
}