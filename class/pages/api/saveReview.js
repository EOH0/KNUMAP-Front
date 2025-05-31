// /pages/api/saveReview.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않은 요청입니다." });
  }

  const newReview = req.body;
  const { placeId, rating, user, text } = newReview;

  // 기본 검증
  if (!placeId || !user || !rating || !text || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "리뷰 정보가 유효하지 않습니다." });
  }

  const reviewsPath = path.join(process.cwd(), "public/data/reviews.json");
  const statsPath = path.join(process.cwd(), "public/data/reviewStats.json");

  // 기존 리뷰 로드
  let reviews = [];
  if (fs.existsSync(reviewsPath)) {
    reviews = JSON.parse(fs.readFileSync(reviewsPath, "utf8"));
  }

  // 기존 통계 로드
  let stats = {};
  if (fs.existsSync(statsPath)) {
    stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
  }

  if (!stats[placeId]) {
    stats[placeId] = { totalRating: 0, reviewCount: 0 };
  }

  const now = new Date().toISOString();
  newReview.date = now;

  // 유저가 해당 장소에 이미 작성한 리뷰가 있는지 확인
  const existingIndex = reviews.findIndex(
    (r) => r.placeId === placeId && r.user === user
  );

  if (existingIndex >= 0) {
    // 덮어쓰기 (수정)
    const oldRating = reviews[existingIndex].rating;
    reviews[existingIndex] = newReview;

    stats[placeId].totalRating = stats[placeId].totalRating - oldRating + rating;
    // reviewCount는 유지
  } else {
    // 새 리뷰 추가
    reviews.push(newReview);
    stats[placeId].totalRating += rating;
    stats[placeId].reviewCount += 1;
  }

  // 저장
  fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2), "utf8");
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf8");

  return res.status(200).json({
    message: existingIndex >= 0 ? "리뷰가 수정되었습니다." : "리뷰가 저장되었습니다.",
  });
}
