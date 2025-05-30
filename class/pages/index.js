import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Main.module.css";
import { UserContext } from "../lib/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import Hero from "../components/Hero";

export default function Home() {
  const router = useRouter();
  const user = useContext(UserContext);

  const [places, setPlaces] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [showNavbar, setShowNavbar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // 처음엔 전체 표시
    setFilteredPlaces(places);
  }, [places]);
  
  const normalize = (str) =>
  str.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9가-힣]/gi, "");

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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // 검색어 없으면 필터만 적용
      const filtered = places.filter((p) =>
        (!selectedLocation || p.위치 === selectedLocation) &&
        (!selectedCategory || p.분야 === selectedCategory)
      );
      return setFilteredPlaces(filtered);
    }

    const results = fuse.search(searchQuery).map(r => r.item);
    const filtered = results.filter((p) =>
      (!selectedLocation || p.위치 === selectedLocation) &&
      (!selectedCategory || p.분야 === selectedCategory)
    );
    setFilteredPlaces(filtered);
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <Head>
        <title>KNUMAP</title>
        <meta name="description" content="KNUMAP 메인화면" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 🧷 고정 상단 */}
      <header className={`${styles.header} ${showNavbar ? styles.headerVisible : styles.headerHidden}`}>
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

      {/* Hero Section */}
      <Hero />
      
      {/* 나머지 장소 리스트 메인 콘텐츠 */}
      <main className={styles.main}>
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.searchInput}
            placeholder="찾으실려는 장소를 입력해주세요."
            style={{
              padding: "10px 16px",
              borderRadius: "24px",
              border: "1px solid #ccc",
              width: "280px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#D90E15";
              e.target.style.boxShadow = "0 0 5px rgba(217, 14, 21, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#ccc";
              e.target.style.boxShadow = "none";
            }}
          />

          <button
            onClick={handleSearch}
            className={styles.searchBtn}
            style={{
              marginLeft: "8px",
              border: "none",
              background: "none",
              fontSize: "20px",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🔍
          </button>

          <button
            className={styles.searchBtn}
            style={{
              marginLeft: "4px",
              border: "none",
              background: "none",
              fontSize: "20px",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onClick={() => setShowFilters(!showFilters)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(20deg)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0deg)")}
          >
            🔦
        </button>
        </div>

        {showFilters && (
          <div
            style={{
              margin: "12px auto",
              padding: "20px",
              width: "320px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
              border: "1px solid #eee",
              transition: "all 0.3s ease-in-out",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              zIndex: 999,
            }}
          >
            <div>
              <label style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "6px", display: "block" }}>
                🧭 위치 필터
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  border: "1px solid #ddd",
                  backgroundColor: "#fff",
                  fontSize: "15px",
                  transition: "border-color 0.2s ease-in-out",
                  outline: "none",
                }}
                onMouseEnter={(e) => e.target.style.borderColor = "#D90E15"}
                onMouseLeave={(e) => e.target.style.borderColor = "#ddd"}
              >
                <option value="">전체 위치</option>
                {["정문", "쪽문", "서문", "북문", "농장문", "텍문", "동문", "교내"].map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "6px", display: "block" }}>
                🍽️ 분야 필터
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  border: "1px solid #ddd",
                  backgroundColor: "#fff",
                  fontSize: "15px",
                  transition: "border-color 0.2s ease-in-out",
                  outline: "none",
                }}
                onMouseEnter={(e) => e.target.style.borderColor = "#D90E15"}
                onMouseLeave={(e) => e.target.style.borderColor = "#ddd"}
              >
                <option value="">전체 분야</option>
                {["카페", "음식점", "편의점"].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        )}


        <div className={styles.contentRow}>
          <section className={styles.leftPanel}>
            <div className={styles.tabRow}>
            </div>

            {filteredPlaces.length === 0 ? (
              <div style={{ color: "#bbb", marginTop: 40, textAlign: "center" }}>검색 결과가 없습니다.</div>
            ) : (
              filteredPlaces.map((place) => {
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