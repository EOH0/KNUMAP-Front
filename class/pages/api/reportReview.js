import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않은 요청입니다." });
  }

  const { placeId, reportedUser, reason, timestamp } = req.body;

  if (!placeId || !reportedUser) {
    return res.status(400).json({ message: "필수 정보가 누락되었습니다." });
  }

  const reportsPath = path.join(process.cwd(), "public/data/reports.json");

  let reports = [];
  if (fs.existsSync(reportsPath)) {
    reports = JSON.parse(fs.readFileSync(reportsPath, "utf8"));
  }

  reports.push({ placeId, reportedUser, reason, timestamp });

  fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2));

  return res.status(200).json({ message: "신고 완료" });
}
