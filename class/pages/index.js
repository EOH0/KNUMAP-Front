import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Main.module.css";
import { UserContext } from "../lib/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Home() {
  const router = useRouter();
  const user = useContext(UserContext);

  const [places, setPlaces] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    fetch("/data/places.json")
      .then((res) => res.json())
      .then((data) => setPlaces(data))
      .catch((err) => {
        console.error("장소 데이터 불러오기 실패:", err);
        setPlaces([]);
      });

    fetch("/data/reviews.json")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => {
        console.error("리뷰 데이터 불러오기 실패:", err);
        setReviews([]);
      });
  }, []);

  useEffect(() => {
    if (user) {
      const userEmail = user.email;
      const userSubmittedReviews = reviews.filter(r => r.user === userEmail);
      setUserReviews(userSubmittedReviews);
    }
  }, [reviews, user]);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const key = `favorites_${user.uid}`;
      const saved = localStorage.getItem(key);
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);


  const toggleFavorite = (place) => {
  if (!user) {
    alert("즐겨찾기는 로그인한 사용자만 이용할 수 있습니다.");
    return;
  }

  const key = `favorites_${user.uid}`;
  const isFav = favorites.find(f => f.url === place.url);
  const updated = isFav
    ? favorites.filter(f => f.url !== place.url)
    : [...favorites, place];

  setFavorites(updated);
  localStorage.setItem(key, JSON.stringify(updated));
};

  const isFavorite = (placeUrl) => {
    return favorites.some(f => f.url === placeUrl);
  };

  const goToFavorite = () => {
    router.push({
      pathname: "/favorite",
      query: { data: encodeURIComponent(JSON.stringify(favorites)) }
    });
  };

  const getAverageRating = (placeId) => {
    const ratings = reviews.filter(r => r.placeId === placeId).map(r => r.rating);
    if (ratings.length === 0) return 0;
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return avg;
  };

  const hasUserReviewed = (placeId) => {
    if (!user) return false;
    return userReviews.some(r => r.placeId === placeId);
  };

  return (
    <>
      <Head>
        <title>KNUMAP</title>
        <meta name="description" content="KNUMAP 메인화면" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo} onClick={() => router.push("/")}>KNUMAP</div>
        <nav className={styles.menu}>
          <button onClick={() => router.push("/partner")}>제휴</button>
          <button onClick={() => router.push("/social")}>소셜</button>
          <button onClick={goToFavorite}>즐겨찾기</button>
        </nav>
        <div className={styles.userMenu}>
          {user ? (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); router.push("/profile"); }}>내 정보</a>
              <span style={{ margin: "0 6px" }}>|</span>
              <a
                href="#"
                onClick={async (e) => {
                  localStorage.removeItem(`favorites_${user.uid}`);
                  
                  e.preventDefault();
                  await signOut(auth);
                  setFavorites([]); // ✅ 로그아웃하면 즐겨찾기 비움
                  alert("로그아웃 되었습니다.");
                  router.push("/");
                }}
              >
                로그아웃
              </a>
            </>

          ) : (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); router.push("/login"); }}>로그인</a>
              <span style={{ margin: "0 6px" }}>|</span>
              <a href="#" onClick={(e) => { e.preventDefault(); router.push("/signup"); }}>회원가입</a>
              
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageTitle}>경북대학교 장소검색</div>
        <div className={styles.filterRow}>
          <input className={styles.searchInput} placeholder="찾으실려는 장소를 입력해주세요." />
          <button className={styles.searchBtn}>🔍</button>
          <button className={styles.searchBtn}>🔦</button>
        </div>

        <div className={styles.contentRow}>
          <section className={styles.leftPanel}>
            <div className={styles.tabRow}>
              <button>인기</button>
              <button>관심</button>
              <span className={styles.yearInfo}>기준 년도 : 2025</span>
            </div>

            {places.length === 0 ? (
              <div style={{ color: "#bbb", marginTop: 40, textAlign: "center" }}>장소 데이터가 없습니다.</div>
            ) : (
              places.map((place) => {
                const avgRating = getAverageRating(place.url);
                return (
                  <div className={styles.placeCard} key={place.url}>
                    <div className={styles.placeHeader}>
                      <img
                        src={`/data/image/${place.name.replace(/\s/g, "_").replace(/\//g, "_")}.jpg`}
                        alt="장소 이미지"
                        className={styles.placeLogo}
                        onError={(e) => { e.target.onerror = null; e.target.src = "/data/image.jpg"; }}
                      />
                      <div>
                        <div className={styles.placeName}>{place.name}</div>
                        {/* ✅ 여기: 전화번호 추가 */}
                        <div style={{ marginTop: 4 }}>
                          {place.phone ? (
                            <a
                              href={`tel:${place.phone}`}
                              style={{ color: "#555", fontSize: "14px", textDecoration: "none" }}
                            >
                              📞 {place.phone}
                            </a>
                          ) : (
                            <span style={{ color: "#999", fontSize: "14px" }}>전화번호 없음</span>
                          )}
                        </div>
                        <div className={styles.placeType}>{place.type}</div>
                      </div>
                      <button
                        className={styles.starBtn}
                        style={{ color: isFavorite(place.url) ? "#D90E15" : "#ccc" }}
                        onClick={() => toggleFavorite(place)}
                      >★</button>
                    </div>
                    <div className={styles.placeInfo}>
                      <div>리뷰 수 <span className={styles.infoNum}>{reviews.filter(r => r.placeId === place.url).length}명</span></div>
                      <div>
                        평균 평점 <span className={styles.infoNum}>
                        {avgRating.toFixed(1)} / 5{" "}
                        {[1, 2, 3, 4, 5].map(num => (
                          <span
                            key={num}
                            style={{
                              color: avgRating >= num ? "#D90E15" : "#ccc",
                              fontSize: 18
                            }}
                          >★</span>
                        ))}
                      </span>
                    </div>
                    </div>
                    <div className={styles.placeFooter}>
                      <button className={styles.linkBtn} onClick={() => window.open(place.url, "_blank")}>홈페이지</button>
                      <button
                        className={styles.linkBtn}
                        onClick={() => {
                          if (!user) {
                            alert("로그인이 필요합니다.");
                            return;
                          }
                          if (hasUserReviewed(place.url)) {
                            alert("이미 이 장소에 리뷰를 남기셨습니다.");
                            return;
                          }
                          router.push({ pathname: "/review", query: { placeId: place.url } });
                        }}
                      >지도 리뷰</button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </div>
      </main>
    </>
  );
}