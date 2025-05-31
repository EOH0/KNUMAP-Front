import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
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
  const [reviewText, setReviewText] = useState("");
  const [existingReviews, setExistingReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [placeName, setPlaceName] = useState("");

  const formatDateKoreanStyle = (timestamp) => {
    if (!timestamp?.toDate) return "알 수 없음";
    const date = timestamp.toDate();
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short"
    });
  };

  const loadPlaceName = async () => {
    try {
      const res = await fetch("/data/places.json");
      const places = await res.json();
      const match = places.find((p) => p.url === placeId);
      setPlaceName(match ? match.name : "알 수 없는 장소");
    } catch (err) {
      console.error("가게 이름 불러오기 실패:", err);
      setPlaceName("알 수 없는 장소");
    }
  };

  const loadReviews = async () => {
    try {
      const res = await fetch(`/api/loadReviews?placeId=${encodeURIComponent(placeId)}`);
      const data = await res.json();
      const reviews = Array.isArray(data.reviews) ? data.reviews : [];
      const filtered = reviews.sort((a, b) => (a.user === user.email ? -1 : 1));
      setExistingReviews(filtered);

      if (filtered.length) {
        const avg = filtered.reduce((sum, r) => sum + r.rating, 0) / filtered.length;
        setAverageRating(avg.toFixed(1));
      }

      const myReview = filtered.find((r) => r.user === user.email);
      if (myReview) {
        setRating(myReview.rating);
        setReviewText(myReview.text);
        setIsEdit(true);
      } else {
        setRating(0);
        setReviewText("");
        setIsEdit(false);
      }
    } catch (err) {
      console.error("리뷰 로딩 실패:", err);
      setExistingReviews([]);
      setAverageRating(0);
    }
  };

  useEffect(() => {
    if (placeId && user) {
      loadPlaceName();
      loadReviews();
    }
  }, [placeId, user]);

  const handleSubmit = async () => {
  if (!rating || rating < 1 || rating > 5) return alert("1~5 사이의 평점을 선택해주세요.");
  if (!reviewText.trim() || reviewText.length < 10) return alert("리뷰는 최소 10자 이상 입력해주세요.");

  const reviewData = {
    placeId,
    user: user.email,
    rating,
    text: reviewText.trim(),
  };

  try {
    const res = await fetch("/api/saveReview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      await loadReviews(); // 리뷰 페이지 내 새로고침
      router.replace("/"); // ✅ 메인으로 이동 (뒤로가기 없음)
    } else {
      alert("리뷰 저장 실패: " + data.message);
    }
  } catch (err) {
    alert("서버 오류로 리뷰 저장 실패");
    console.error(err);
  }
};

  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  if (!user) return <p style={{ padding: 40 }}>로그인이 필요합니다.</p>;

  return (
    <>
      <Head><title>리뷰 남기기 - {placeName}</title></Head>

      <header className={styles.header}>
        <div className={styles.logo} onClick={() => router.push("/")}>KNUMAP</div>
        <nav className={styles.menu}>
          <button onClick={() => router.push("/partner")}>제휴</button>
          <button onClick={() => router.push("/social")}>소셜</button>
          <button onClick={() => router.push("/favorite")}>즐겨찾기</button>
        </nav>
        <div className={styles.userMenu}>
          <a href="#" onClick={(e) => { e.preventDefault(); router.push("/profile"); }}>내 정보</a>
          <span style={{ margin: "0 6px" }}>|</span>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>로그아웃</a>
        </div>
      </header>

      <main className={styles.main}>
        <div style={{
          textAlign: "center", fontSize: 20, fontWeight: "bold",
          padding: "12px 0", margin: "20px auto 30px", color: "#333",
          background: "rgba(255,255,255,0.85)", borderRadius: 8,
          maxWidth: 500, boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}>
          리뷰 남기기 {placeName ? `- ${placeName}` : ""}
        </div>

        <div style={{ padding: 30, background: "#fff", borderRadius: 12, maxWidth: 600, margin: "0 auto 40px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          {averageRating > 0 && (
            <div style={{ textAlign: "center", marginBottom: 20, fontSize: 18 }}>
              평균 평점: <strong>{averageRating}</strong> / 5.0
            </div>
          )}

          {isEdit && (
            <div style={{ textAlign: "center", marginBottom: 12, fontSize: 14, color: "#3399ff" }}>
              ✏️ 이미 작성한 리뷰를 수정하고 있어요.
            </div>
          )}

          <div style={{ marginBottom: 20, textAlign: "center" }}>
            {[1, 2, 3, 4, 5].map(num => (
              <span
                key={num}
                onClick={() => setRating(num)}
                onMouseEnter={() => setHoverRating(num)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  fontSize: 36,
                  cursor: "pointer",
                  textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  color: (hoverRating || rating) >= num ? "#ffc107" : "#e0e0e0",
                  margin: "0 6px",
                  transition: "transform 0.2s",
                }}
              >★</span>
            ))}
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="리뷰 내용을 입력하세요 (10자 이상, 300자 이하)"
            rows={5}
            maxLength={300}
            style={{ width: "100%", padding: 12, border: "1px solid #ccc", borderRadius: 8, resize: "vertical", fontSize: 14, marginBottom: 10 }}
          />
          <p style={{ fontSize: 12, color: "#999", marginBottom: 20 }}>{reviewText.length} / 300자</p>

          <button
            onClick={handleSubmit}
            style={{ width: "100%", padding: "12px 0", backgroundColor: "#D90E15", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer", fontWeight: "bold" }}
          >
            {isEdit ? "리뷰 수정하기" : "리뷰 제출하기"}
          </button>
        </div>

        {existingReviews.length > 0 && (
          <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", padding: 30, borderRadius: 12, boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
            <h4>📋 사용자 리뷰 목록</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {existingReviews.map((r, idx) => (
                <li
                  key={idx}
                  style={{
                    background: r.user === user.email ? "#e8f4ff" : "#f9f9f9",
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 12,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    border: r.user === user.email ? "1px solid #3399ff" : "none"
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    {r.user === user.email ? "📝 내 리뷰" : r.user} - {r.rating}점
                  </div>
                  <div style={{ fontSize: 14, color: "#555" }}>{r.text}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    작성일: {formatDateKoreanStyle(r.date)}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {r.user === user.email ? (
                      <button
                        onClick={async () => {
                          if (confirm("정말 삭제하시겠어요?")) {
                            await fetch("/api/deleteReview", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ placeId, user: user.email }),
                            });
                            alert("리뷰가 삭제되었습니다.");
                            await loadReviews();
                          }
                        }}
                        style={{ fontSize: 12, color: "#d00", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                      >삭제</button>
                    ) : (
                      <button
                        onClick={async () => {
                          if (confirm("이 리뷰를 정말 신고하시겠어요?")) {
                            await fetch("/api/reportReview", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ placeId, reportedUser: r.user, reason: "사용자 수동 신고" }),
                            });
                            alert("신고가 접수되었습니다.");
                          }
                        }}
                        style={{ fontSize: 12, color: "#999", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                      >신고</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}