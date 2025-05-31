// pages/api/deleteReview.js
import { db } from "../../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { placeId, user } = req.body;

  if (!placeId || !user) {
    return res.status(400).json({ message: "필수 정보 누락" });
  }

  try {
    // Firestore에 저장한 문서 ID와 동일한 방식으로 안전하게 인코딩
    const docId = encodeURIComponent(`${placeId}_${user}`);

    await deleteDoc(doc(db, "reviews", docId));
    res.status(200).json({ message: "리뷰 삭제 완료" });
  } catch (err) {
    console.error("리뷰 삭제 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
}