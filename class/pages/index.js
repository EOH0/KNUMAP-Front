import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Main.module.css";
import { UserContext } from "../lib/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import Hero from "../components/Hero";
import Fuse from "fuse.js";

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

  const fuse = new Fuse(places, {
    keys: ["name", "위치", "분야"], // 검색 대상 필드 지정
    threshold: 0.3, // 정확도 (낮을수록 엄격)
  });

  const [sortOption, setSortOption] = useState(""); // "찜순" | "리뷰순"

  const sortPlaces = (places) => {
    const sorted = [...places];
    if (sortOption === "찜순") {
      sorted.sort((a, b) =>
        favorites.filter(f => f.url === b.url).length - favorites.filter(f => f.url === a.url).length
      );
    } else if (sortOption === "리뷰순") {
      sorted.sort((a, b) =>
        reviews.filter(r => r.placeId === b.url).length - reviews.filter(r => r.placeId === a.url).length
      );
    } else if (sortOption === "평점순") {
      sorted.sort((a, b) =>
        getAverageRating(b.url) - getAverageRating(a.url)
      );
    } else if (sortOption === "이름순") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko', { sensitivity: 'base' }));
    } else if (sortOption === "최신순") {
      sorted.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    return sorted;
  };

  

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
    const filtered = places.filter((p) =>
      (!selectedLocation || p.위치 === selectedLocation) &&
      (!selectedCategory || p.분야 === selectedCategory)
    );
    const sorted = sortPlaces(filtered);
    setFilteredPlaces(sorted);
  }, [places, sortOption, selectedLocation, selectedCategory]);


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
      const filtered = places.filter((p) =>
        (!selectedLocation || p.위치 === selectedLocation) &&
        (!selectedCategory || p.분야 === selectedCategory)
      );
      setFilteredPlaces(filtered);
      return;
    }

    const fuse = new Fuse(places, {
      keys: ["name", "위치", "분야"],
      threshold: 0.3,
    });

    const results = fuse.search(searchQuery).map(r => r.item);
    const filtered = results.filter((p) =>
      (!selectedLocation || p.위치 === selectedLocation) &&
      (!selectedCategory || p.분야 === selectedCategory)
    );
    setFilteredPlaces(filtered);
  };

  const isRecent = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffInDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7; // 최근 7일이면 "NEW"
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

        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              fontSize: "14px"
            }}
          >
            <option value="">정렬 없음</option>
            <option value="찜순">찜 많은 순</option>
            <option value="리뷰순">리뷰 많은 순</option>
<option value="평점순">평점 높은 순</option>
<option value="이름순">이름순</option>
<option value="최신순">최신 등록순</option>
          </select>
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
                const ratingClass =
                  avgRating >= 4.5 ? styles.highRating :
                  avgRating < 3 ? styles.lowRating :
                  "";
                
                return (
                  <div className={`${styles.placeCard} ${ratingClass}`} key={`${place.name}_${place.위치}`}>
                    <div className={styles.placeHeader}>
                      <img
                        src={`/data/image/${place.name.replace(/\s/g, "_")}.jpg`}
                        alt="장소 이미지"
                        className={styles.placeLogo}
                        onError={(e) => { e.target.onerror = null; e.target.src = "/data/image.jpg"; }}
                      />
                      <div>
                        <div className={styles.placeName}>{place.name}</div>
                          {place.name}
                          {place.createdAt && isRecent(place.createdAt) && (
                            <span className={styles.newBadge}>NEW</span>
                          )}
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
                        className={`${styles.starBtn} ${isFavorite(place.url) ? styles.favOn : ""}`}
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
                          if (!user) {
                            alert("로그인이 필요합니다.");
                            return;
                          }

                          if (hasUserReviewed(place.url)) {
                            const proceed = confirm("이미 리뷰를 작성하셨습니다. 수정하시겠습니까?");
                            if (!proceed) return;
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