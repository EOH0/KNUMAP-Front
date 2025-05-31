// pages/api/saveReview.js
import { db } from "../../lib/firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { placeId, user, rating, text } = req.body;

  // 유효성 검사
  if (!placeId || !user || !rating || !text) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  }

  try {
    // 🔐 Firestore-safe ID 생성 (URL 포함한 문자열 안전하게 인코딩)
    const safeDocId = encodeURIComponent(`${placeId}_${user}`);

    // 🔒 정확한 경로에 저장: /reviews/{safeDocId}
    await setDoc(doc(db, "reviews", safeDocId), {
      placeId,
      user,
      rating,
      text,
      date: serverTimestamp(),
    });

    res.status(200).json({ message: "리뷰가 저장되었습니다." });
  } catch (err) {
    console.error("Firestore 저장 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
}