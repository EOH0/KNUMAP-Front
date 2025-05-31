// pages/api/loadReviews.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  const { placeId } = req.query;

  try {
    let reviewsQuery;

    if (placeId) {
      // 특정 가게의 리뷰만
      reviewsQuery = query(
        collection(db, "reviews"),
        where("placeId", "==", placeId)
      );
    } else {
      // 전체 리뷰
      reviewsQuery = collection(db, "reviews");
    }

    const snap = await getDocs(reviewsQuery);
    const reviews = snap.docs.map(doc => doc.data());

    res.status(200).json({ reviews });
  } catch (err) {
    console.error("[loadReviews API]", err);
    res.status(500).json({ message: "리뷰 불러오기 실패" });
  }
}