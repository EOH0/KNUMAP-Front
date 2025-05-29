// /pages/review.js
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../lib/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import styles from "../styles/Main.module.css";

export default function Review() {
  const router = useRouter();
  const { placeId } = router.query;
  const user = useContext(UserContext);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating || rating < 1 || rating > 5) {
      alert("1~5 사이의 평점을 선택해주세요.");
      return;
    }

    const reviewData = {
      placeId,
      user: user.email,
      rating,
    };

    const res = await fetch("/api/saveReview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("리뷰가 저장되었습니다.");
      setSubmitted(true);
      router.push("/");
    } else {
      alert("리뷰 저장 실패: " + data.message);
    }
  };

  if (!user) {
    return <p style={{ padding: 40 }}>로그인이 필요합니다.</p>;
  }

  return (
    <>
      <Head>
        <title>리뷰 남기기</title>
        <meta name="description" content="장소 리뷰 작성" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* 상단 네비게이션 */}
      <header className={styles.header}>
        <div
          className={styles.logo}
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          KNUMAP
        </div>
        <nav className={styles.menu}>
          <button onClick={() => router.push("/partner")}>제휴</button>
          <button onClick={() => router.push("/social")}>소셜</button>
          <button onClick={() => router.push("/favorite")}>즐겨찾기</button>
        </nav>
        <div className={styles.userMenu}>
          {user ? (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); router.push("/profile"); }}>내 정보</a>
              <span style={{ margin: "0 6px" }}>|</span>
              <a href="#" onClick={(e) => { e.preventDefault(); signOut(auth); alert("로그아웃 되었습니다."); router.push("/"); }}>로그아웃</a>
            </>
          ) : (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); router.push("/login"); }}>로그인</a>
              <span style={{ margin: "0 6px" }}>|</span>
              <a href="#" onClick={(e) => { e.preventDefault(); router.push("/signup"); }}>회원가입</a>
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageTitle}>⭐ 리뷰 남기기</div>
        <div
          style={{
            padding: 40,
            background: "#fff",
            borderRadius: 12,
            maxWidth: 600,
            margin: "0 auto",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>
            장소 ID: <span style={{ color: "#555" }}>{placeId}</span>
          </h3>
          <div style={{ margin: "20px 0" }}>
            <p style={{ fontSize: 18 }}>평점을 선택하세요:</p>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                onClick={() => setRating(num)}
                onMouseEnter={() => setHoverRating(num)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  fontSize: 40,
                  cursor: "pointer",
                  color: (hoverRating || rating) >= num ? "#FFD700" : "#ccc",
                  marginRight: 8,
                  transition: "color 0.2s",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitted}
            style={{
              padding: "10px 20px",
              backgroundColor: "#D90E15",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {submitted ? "제출 완료" : "리뷰 제출"}
          </button>
        </div>
      </main>
    </>
  );
}