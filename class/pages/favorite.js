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
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(favoritesKey);
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [favoritesKey]);

  useEffect(() => {
    fetch("/data/reviews.json")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => setReviews([]));
  }, []);

  const removeFavorite = (placeUrl) => {
    const updated = favorites.filter((f) => f.url !== placeUrl);
    setFavorites(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(favoritesKey, JSON.stringify(updated));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  const getImagePath = (name) => {
    return `/data/image/${name.replace(/\s/g, "_").replace(/\//g, "_")}.jpg`;
  };

  const getAverageRating = (placeId) => {
    const ratings = reviews.filter(r => r.placeId === placeId).map(r => r.rating);
    if (ratings.length === 0) return 0;
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  };

  return (
    <>
      <header className={mainStyles.header}>
        <div
          className={mainStyles.logo}
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          KNUMAP
        </div>
        <nav className={mainStyles.menu}>
          <button onClick={() => router.push("/partner")}>제휴</button>
          <button onClick={() => router.push("/social")}>소셜</button>
          <button onClick={() => router.push("/favorite")}>즐겨찾기</button>
        </nav>
        <div className={mainStyles.userMenu}>
          {user ? (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); router.push("/profile"); }}>내 정보</a>
              <span style={{ margin: "0 6px" }}>|</span>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>로그아웃</a>
            </>
          ) : (
            <>
              <a href="#" onClick={e => {e.preventDefault(); router.push("/login");}}>로그인</a>
              <span style={{ margin: "0 6px" }}>|</span>
              <a href="#" onClick={e => {e.preventDefault(); router.push("/signup");}}>회원가입</a>
            </>
          )}
        </div>
      </header>

      <main className={mainStyles.main}>
        <div className={mainStyles.pageTitle}>즐겨찾기</div>
        <div className={styles.favoriteGrid}>
          {favorites.length === 0 ? (
            <div style={{ color: "#bbb", marginTop: 20, textAlign: "center", gridColumn: "1/-1" }}>
              즐겨찾기한 장소가 없습니다.
            </div>
          ) : (
            favorites.map((place) => {
              const avgRating = getAverageRating(place.url);
              return (
                <div className={styles.placeCard} key={place.url}>
                  <div className={styles.placeHeader}>
                    <img
                      src={getImagePath(place.name)}
                      alt="장소 로고"
                      className={styles.placeLogo}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/data/image.jpg"; }}
                    />
                    <div>
                      <div className={styles.placeName}>{place.name}</div>
                      {place.phone ? (
                        <div style={{ marginTop: 4, fontSize: 14, color: "#555" }}>
                          📞 {place.phone}
                        </div>
                      ) : (
                        <div style={{ marginTop: 4, fontSize: 14, color: "#999" }}>
                          전화번호 없음
                        </div>
                      )}
                      <div className={styles.placeType}>{place.type}</div>
                    </div>
                    <button
                      className={styles.starBtn}
                      style={{ color: "#D90E15", transition: "color 0.2s" }}
                      onClick={() => removeFavorite(place.url)}
                      aria-label="즐겨찾기 해제"
                    >
                      ★
                    </button>
                  </div>
                  <div className={styles.placeInfo}>
                    <div>
                      리뷰 수 <span className={styles.infoNum}>{reviews.filter(r => r.placeId === place.url).length}명</span>
                    </div>
                    <div>
                      평균 평점 <span className={styles.infoNum}>
                        {[1, 2, 3, 4, 5].map(num => (
                          <span key={num} style={{ color: avgRating >= num ? "#D90E15" : "#ccc", fontSize: 18 }}>★</span>
                        ))}
                      </span>
                    </div>
                  </div>
                  <div className={styles.placeFooter}>
                    <button className={styles.linkBtn} onClick={() => window.open(place.url, "_blank")}>홈페이지</button>
                    <button className={styles.linkBtn} onClick={() => router.push({ pathname: "/review", query: { placeId: place.url } })}>지도 리뷰</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
