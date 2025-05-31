import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import styles from "../styles/Main.module.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !phone) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        phone,
        uid,
        createdAt: new Date()
      });

      alert("회원가입 성공!");
      router.push("/login");
    } catch (err) {
      alert("회원가입 실패: " + err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.pageTitle}>회원가입</h2>

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
      />
      <input
        className={styles.inputBox}
        type="tel"
        placeholder="전화번호를 입력하세요 (예: 01012345678)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button className={styles.authButton} onClick={handleSignup}>
        회원가입
      </button>
    </div>
  );
}
