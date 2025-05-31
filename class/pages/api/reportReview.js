import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { placeId, reportedUser, reason } = req.body;
  if (!placeId || !reportedUser || !reason) {
    return res.status(400).json({ message: "정보 부족" });
  }

  try {
    await addDoc(collection(db, "reviewReports"), {
      placeId,
      reportedUser,
      reason,
      reportedAt: serverTimestamp()
    });
    res.status(200).json({ message: "신고 접수 완료" });
  } catch (err) {
    console.error("신고 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
}