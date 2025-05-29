import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Main.module.css";

export default function Favorite() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (router.query.data) {
      try {
        setFavorites(JSON.parse(decodeURIComponent(router.query.data)));
      } catch {
        setFavorites([]);
      }
    }
  }, [router.query.data]);

  return (
    <main className={styles.main}>s
      <div className={styles.pageTitle}>⭐ 즐겨찾기</div>
      <section className={styles.leftPanel}>
        {favorites.length === 0 ? (
          <div style={{ color: "#bbb", marginTop: 20, textAlign: "center" }}>
            즐겨찾기한 장소가 없습니다.
          </div>
        ) : (
          favorites.map((place) => (
            <div className={styles.placeCard} key={place.id}>
              <div className={styles.placeHeader}>
                <img src={place.logoUrl || "/school.png"} alt="장소 로고" className={styles.placeLogo} />
                <div>
                  <div className={styles.placeName}>{place.name}</div>
                  <div className={styles.placeType}>{place.type}</div>
                </div>
                <span className={styles.starBtn} style={{ color: "#D90E15" }}>★</span>
              </div>
              <div className={styles.placeInfo}>
                <div>영업시간 <span className={styles.infoNum}>{place.openingHours}</span></div>
                <div>리뷰 <span className={styles.infoNum}>{place.reviewCount}명</span></div>
              </div>
              <div className={styles.placeFooter}>
                <button className={styles.linkBtn}>홈페이지</button>
                <button className={styles.linkBtn}>지도 리뷰</button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}