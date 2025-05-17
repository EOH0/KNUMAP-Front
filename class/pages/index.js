import Head from "next/head";
import styles from "../styles/Main.module.css";

export default function Home() {
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
        <div className={styles.logo}>KNUMAP</div>
        <nav className={styles.menu}>
          <button>제휴</button>
          <button>소셜</button>
          <button>즐겨찾기</button>
        </nav>
        <div className={styles.userMenu}>
          <a href="#">로그인</a> | <a href="#">회원가입</a>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className={styles.main}>
        <div className={styles.pageTitle}>장소검색</div>
        <div className={styles.filterRow}>
          <input className={styles.searchInput} placeholder="찾으실려는 장소를 입력해주세요." />
          <button className={styles.searchBtn}>🔍</button>
          <select className={styles.filterSelect}><option>음식</option></select>
          <select className={styles.filterSelect}><option>문화</option></select>
          <select className={styles.filterSelect}><option>힐링</option></select>
          <select className={styles.filterSelect}><option>놀거리</option></select>
          <select className={styles.filterSelect}><option>공용공간</option></select>
          <select className={styles.filterSelect}><option>제휴</option></select>
          <select className={styles.filterSelect}><option>맛집</option></select>
          <button className={styles.applyBtn}>적용</button>
        </div>
        <div className={styles.contentRow}>
          {/* 왼쪽: 리스트 */}
          <section className={styles.leftPanel}>
            <div className={styles.tabRow}>
              <button className={styles.tabActive}>인기</button>
              <button>관심</button>
              <span className={styles.yearInfo}>기준 년도 : 2025</span>
            </div>
            <div className={styles.placeCard}>
              <div className={styles.placeHeader}>
                <img src="/school.png" alt="장소 로고" className={styles.placeLogo} />
                <div>
                  <div className={styles.placeName}>음식점1</div>
                  <div className={styles.placeType}>스시</div>
                </div>
                <button className={styles.starBtn}>★</button>
              </div>
              <div className={styles.placeInfo}>
                <div>영업시간 <span className={styles.infoNum}>오전 9:00 ~ 오후 8:00</span></div>
                <div>리뷰 <span className={styles.infoNum}>4,840명</span></div>
              </div>
              <div className={styles.placeFooter}>
                <button className={styles.linkBtn}>홈페이지</button>
                <button className={styles.linkBtn}>지도 리뷰</button>
              </div>
            </div>
            {/* ...여러 카드 반복 */}
          </section>
          {/* 오른쪽: 지도 */}
          <section className={styles.mapPanel}>
            <div className={styles.mapArea}>
              {/* 실제 지도 API로 교체 가능 */}
              <span style={{ color: "#bbb" }}>지도 영역</span>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
