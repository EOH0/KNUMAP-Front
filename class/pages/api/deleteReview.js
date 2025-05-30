import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않은 요청입니다." });
  }

  const { placeId, user } = req.body;
  if (!placeId || !user) {
    return res.status(400).json({ message: "요청 데이터가 누락되었습니다." });
  }

  const reviewsPath = path.join(process.cwd(), "public/data/reviews.json");
  const statsPath = path.join(process.cwd(), "public/data/reviewStats.json");

  if (!fs.existsSync(reviewsPath)) return res.status(404).json({ message: "리뷰 데이터 없음" });

  let reviews = JSON.parse(fs.readFileSync(reviewsPath, "utf8"));
  const reviewIndex = reviews.findIndex((r) => r.placeId === placeId && r.user === user);

  if (reviewIndex === -1) {
    return res.status(404).json({ message: "해당 리뷰가 없습니다." });
  }

  const deleted = reviews.splice(reviewIndex, 1)[0];
  fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));

  // 통계 업데이트
  let stats = {};
  if (fs.existsSync(statsPath)) {
    stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
  }

  if (stats[placeId]) {
    stats[placeId].totalRating -= deleted.rating;
    stats[placeId].reviewCount -= 1;

    if (stats[placeId].reviewCount === 0) {
      delete stats[placeId];
    }
  }

  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

  return res.status(200).json({ message: "리뷰 삭제 완료" });
}
