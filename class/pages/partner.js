import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../lib/UserContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import styles from "../styles/Main.module.css";
import cardStyles from "../styles/partner.module.css"; // 👈 새 CSS 파일 분리 추천

export default function Partner() {
  const user = useContext(UserContext);
  const router = useRouter();
  const [userCollege, setUserCollege] = useState("");
  const [partnerData, setPartnerData] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);

  useEffect(() => {
    const fetchUserCollege = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setUserCollege(data.college || "");
        }
      } catch (err) {
        console.error("사용자 정보 가져오기 실패:", err);
      }
    };
    fetchUserCollege();
  }, [user]);

  useEffect(() => {
    fetch("/data/제휴정보.json")
      .then((res) => res.json())
      .then((data) => setPartnerData(data))
      .catch((err) => console.error("제휴 정보 로딩 실패:", err));
  }, []);

  useEffect(() => {
    if (!userCollege || partnerData.length === 0) return;
    const filtered = partnerData.filter((p) => p.단대 === userCollege);
    setFilteredPartners(filtered);
  }, [userCollege, partnerData]);

  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return <div style={{ padding: 40 }}>로그인이 필요합니다...</div>;
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => router.push("/")}>KNUMAP</div>
        <nav className={styles.menu}>
          <button onClick={() => router.push("/partner")}>제휴</button>
          <button onClick={() => router.push("/social")}>소셜</button>
          <button onClick={() => router.push("/favorite")}>즐겨찾기</button>
        </nav>
        <div className={styles.userMenu}>
          <a href="#" onClick={(e) => { e.preventDefault(); router.push("/profile"); }}>내 정보</a>
        </div> 
      </header>

      <main className={styles.main}>
        <div className={styles.pageTitle}>📢 {userCollege} 제휴 혜택</div>

        {filteredPartners.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>해당 단과대학의 제휴 정보가 없습니다.</p>
        ) : (
          <div className={cardStyles.partnerList}>
            {filteredPartners.map((p, idx) => (
              <div key={idx} className={cardStyles.partnerCard}>
                <div className={cardStyles.cardLeft}>
                  <div className={cardStyles.partnerName}>{p.name}</div>
                  <div className={cardStyles.partnerDetail}>
                    <span>⏰ 기간: {p.period}</span><br />
                    <span>👤 대상: {p.who}</span>
                  </div>
                  <div className={cardStyles.partnerLinks}>
                    <a href={p.url} target="_blank" rel="noreferrer">
                      <img src="/icons/kakao.png" alt="카카오맵" />
                    </a>
                    <a href={p.insta} target="_blank" rel="noreferrer">
                      <img src="/icons/instagram.png" alt="인스타그램" />
                    </a>
                  </div>
                </div>

                <div className={cardStyles.cardRight}>
                  <img
                    src={'/data/partner/images/${p.name.replace(/\s/g, "_")}.jpg'}
                    alt={'${p.name} 썸네일'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/data/image.jpg"; // 기본 이미지로 대체
                    }}
                  />
                </div>
              </div>
          ))}
          </div>
        )}
      </main>
    </>
  );
}