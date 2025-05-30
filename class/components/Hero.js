// components/Hero.js
import styles from "../styles/Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <img src="/data/image/cat.png" alt="귀여운 고양이" className={styles.image} />
      <h1 className={styles.title}>경북대 장소 검색</h1>
      <p className={styles.subtitle}>내 주변의 맛집과 시설을 한 눈에!</p>
    </div>
  );
}
