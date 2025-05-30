// /pages/api/saveReview.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const newReview = req.body;

    const reviewsPath = path.join(process.cwd(), "public/data/reviews.json");
    const statsPath = path.join(process.cwd(), "public/data/reviewStats.json");

    // 기존 리뷰 목록 불러오기
    let reviews = [];
    if (fs.existsSync(reviewsPath)) {
      reviews = JSON.parse(fs.readFileSync(reviewsPath, "utf8"));
    }

    // 이미 리뷰한 사용자면 막기
    const duplicate = reviews.find(
      (r) => r.placeId === newReview.placeId && r.user === newReview.user
    );
    if (duplicate) {
      return res.status(400).json({ message: "이미 리뷰를 작성하셨습니다." });
    }

    // 리뷰 추가
    reviews.push(newReview);
    fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));

    // 기존 통계 데이터 불러오기
    let stats = {};
    if (fs.existsSync(statsPath)) {
      stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
    }

    // 해당 placeId에 대한 리뷰 총합 및 개수 갱신
    const { placeId, rating } = newReview;
    if (!stats[placeId]) {
      stats[placeId] = { totalRating: 0, reviewCount: 0 };
    }
    stats[placeId].totalRating += rating;
    stats[placeId].reviewCount += 1;

    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

    return res.status(200).json({ message: "리뷰 저장 성공" });
  }

  return res.status(405).json({ message: "허용되지 않은 요청입니다." });
}
