import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../lib/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import mainStyles from "../styles/Main.module.css";
import styles from "../styles/favorite.module.css";

export default function Favorite() {
  const router = useRouter();
  const user = useContext(UserContext);
  const favoritesKey = user ? `favorites_${user.uid}` : "favorites_guest";
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (router.query.data) {
      try {
        setFavorites(JSON.parse(decodeURIComponent(router.query.data)));
      } catch {
        setFavorites([]);
      }
    } else {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(favoritesKey);
        setFavorites(saved ? JSON.parse(saved) : []);
      }
    }
  }, [router.query.data, favoritesKey]);

  const removeFavorite = (placeId) => {
    const updated = favorites.filter((f) => f.id !== placeId);
    setFavorites(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(favoritesKey, JSON.stringify(updated));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <main className={styles.main}>
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
                <img
                  src={place.logoUrl || "/school.png"}
                  alt="장소 로고"
                  className={styles.placeLogo}
                />
                <div>
                  <div className={styles.placeName}>{place.name}</div>
                  <div className={styles.placeType}>{place.type}</div>
                </div>
                <button
                  className={styles.starBtn}
                  style={{ color: "#D90E15", transition: "color 0.2s" }}
                  onClick={() => removeFavorite(place.id)}
                  aria-label="즐겨찾기 해제"
                >
                  ★
                </button>
              </div>
              <div className={styles.placeInfo}>
                <div>
                  영업시간{" "}
                  <span className={styles.infoNum}>{place.openingHours}</span>
                </div>
                <div>
                  리뷰{" "}
                  <span className={styles.infoNum}>{place.reviewCount}명</span>
                </div>
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
