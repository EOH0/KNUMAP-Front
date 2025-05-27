import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Main.module.css";

// export default function Home() {
//   // 장소 리스트 상태
//   const [places, setPlaces] = useState([]);

//   // 예시: 백엔드에서 장소 데이터 받아오기
//   useEffect(() => {
//     // 실제 배포 시, 아래 URL을 백엔드 API 주소로 변경하세요!
//     fetch("http://localhost:8080/api/places")
//       .then((res) => res.json())
//       .then((data) => setPlaces(data))
//       .catch((err) => {
//         console.error("장소 데이터 불러오기 실패:", err);
//         setPlaces([]);
//       });
//   }, []);

export default function Home() {
  const router = useRouter();
  
  const [places, setPlaces] = useState([
    {
      id: 1,
      name: "경북대학교",
      type: "대학교",
      openingHours: "09:00~18:00",
      reviewCount: 10,
      logoUrl: "/school.png"
    },
    {
      id: 2,
      name: "맛집카페",
      type: "카페",
      openingHours: "10:00~22:00",
      reviewCount: 5,
      logoUrl: ""
    }
  ]);

  // 1. localStorage에서 즐겨찾기 불러오기
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 2. 즐겨찾기 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

   // 즐겨찾기 토글 함수
  const toggleFavorite = (place) => {
    if (favorites.find(f => f.id === place.id)) {
      setFavorites(favorites.filter(f => f.id !== place.id));
    } else {
      setFavorites([...favorites, place]);
    }
  };

  // 별표 색상 체크 함수
  const isFavorite = (placeId) => favorites.some(f => f.id === placeId);

  // 즐겨찾기 페이지로 이동하며 데이터 전달
  const goToFavorite = () => {
    router.push({
      pathname: "/favorite",
      query: { data: encodeURIComponent(JSON.stringify(favorites)) }
    });
  };

  return (
    <>
      <Head>
        <title>KNUMAP</title>
        <meta name="description" content="KNUMAP 메인화면" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 상단 네비게이션 */}
      <header className={styles.header}>
        <div
          className={styles.logo}
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          KNUMAP
        </div>
        <nav className={styles.menu}>
          <button onClick={() => router.push("/partner")}>제휴</button>
          <button onClick={() => router.push("/social")}>소셜</button>
          <button onClick={goToFavorite}>즐겨찾기</button>
        </nav>
        <div className={styles.userMenu}>
          <a href="#" onClick={e => {e.preventDefault(); router.push("/login");}}>로그인</a> |{" "}
          <a href="#" onClick={e => {e.preventDefault(); router.push("/signup");}}>회원가입</a>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className={styles.main}>
        <div className={styles.pageTitle}>경북대학교 장소검색</div>
        <div className={styles.filterRow}>
          <input className={styles.searchInput} placeholder="찾으실려는 장소를 입력해주세요." />
          <button className={styles.searchBtn}>🔍</button>
          <button className={styles.searchBtn}>🔦</button>
        </div>
        <div
          className={styles.contentRow}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 24,
          }}
        >
          {/* 리스트를 가운데 크게 */}
          <section
            className={styles.leftPanel}
            style={{
              width: "600px",
              minWidth: "320px",
              maxWidth: "90vw",
            }}
          >
            <div className={styles.tabRow}>
              <button>인기</button>
              <button>관심</button>
              <span className={styles.yearInfo} style={{ marginLeft: "auto" }}>기준 년도 : 2025</span>
            </div>
            {/* 장소 리스트 */}
            {places.length === 0 ? (
              <div style={{ color: "#bbb", marginTop: 40, textAlign: "center" }}>장소 데이터가 없습니다.</div>
            ) : (
              places.map((place) => (
                <div className={styles.placeCard} key={place.id}>
                  <div className={styles.placeHeader}>
                    <img src={place.logoUrl || "/school.png"} alt="장소 로고" className={styles.placeLogo} />
                    <div>
                      <div className={styles.placeName}>{place.name}</div>
                      <div className={styles.placeType}>{place.type}</div>
                    </div>
                    <button
                      className={styles.starBtn}
                      style={{
                        color: isFavorite(place.id) ? "#D90E15" : "#ccc",
                        transition: "color 0.2s"
                      }}
                      onClick={() => toggleFavorite(place)}
                      aria-label="즐겨찾기"
                    >
                      ★
                    </button>
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
        </div>
      </main>
    </>
  );
}
