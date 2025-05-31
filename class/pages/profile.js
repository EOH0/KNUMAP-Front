// pages/profile.js
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { UserContext } from "../lib/UserContext";
import { auth, db } from "../lib/firebase";
import styles from "../styles/Main.module.css";

export default function Profile() {
  const user = useContext(UserContext);
  const router = useRouter();
  const { uid: targetUid } = router.query;
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState("/knu-default.png");
  const [hovered, setHovered] = useState(false);

  const [name, setName] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const collegeDepartments = {
    "사회과학대": [
      "정치외교학과", "지리학과", "사회학과", "심리학과",
      "미디어커뮤니케이션학과", "사회과학대학 자율전공학부", "사회복지학부"
    ],
    "치과대": ["치과대학"],
    "인문대": [
      "영어영문학과", "독어독문학과", "사학과", "국어국문학과", "고고인류학과",
      "불어불문학과", "일어일문학과", "노어노문학과", "중어중문학과", "철학과", "한문학과"
    ],
    "IT대": ["전기공학과", "컴퓨터학부", "전자공학부", "전자공학부 인공지능"],
    "행정대": ["행정학부"],
    "생활과학대": ["식품영양학과", "의류학과", "아동학부"]
  };
  const collegeOptions = Object.keys(collegeDepartments);

  useEffect(() => {
    const loadUserProfile = async () => {
      const uid = targetUid || user?.uid;
      if (!uid) return;
      try {
        const docSnap = await getDoc(doc(db, "users", uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setSelectedCollege(data.college || "");
          setSelectedDepartment(data.department || "");
          if (data.profileImgUrl) setProfileImg(data.profileImgUrl);
        }
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
      }
    };
    loadUserProfile();
  }, [user, targetUid]);

  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      try {
        await uploadString(storageRef, base64, "data_url");
        const url = await getDownloadURL(storageRef);
        setProfileImg(url);
        await setDoc(doc(db, "users", user.uid), {
          name,
          college: selectedCollege,
          department: selectedDepartment,
          email: user.email,
          profileImgUrl: url,
          updatedAt: new Date()
        });
        setSaveStatus("✅ 이미지 저장 완료!");
      } catch (err) {
        console.error("이미지 업로드 실패:", err);
        setSaveStatus("❌ 이미지 저장 실패");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), {
        name,
        college: selectedCollege,
        department: selectedDepartment,
        email: user.email,
        profileImgUrl: profileImg,
        updatedAt: new Date()
      });
      setSaveStatus("✅ 저장 완료!");
    } catch (error) {
      console.error("저장 실패:", error);
      setSaveStatus("❌ 저장 실패");
    }
  };

  if (!user && !targetUid) {
    if (typeof window !== "undefined") router.push("/login");
    return <div style={{ padding: 40 }}>로그인이 필요합니다...</div>;
  }

  const isMyProfile = !targetUid || targetUid === user?.uid;

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
          <span style={{ margin: "0 6px" }}>|</span>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>로그아웃</a>
        </div>
      </header>

      <main className={styles.main}>
        <div style={{
          padding: "40px",
          background: "#fff",
          borderRadius: "16px",
          maxWidth: "600px",
          margin: "40px auto",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}>
          {/* 프로필 이미지 */}
          <div
            style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto", marginBottom: "24px" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => isMyProfile && fileInputRef.current.click()}
          >
            <img
              src={profileImg}
              alt="프로필 이미지"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "2px solid #ccc",
                objectFit: "cover",
                cursor: isMyProfile ? "pointer" : "default",
              }}
              onError={(e) => { e.target.onerror = null; e.target.src = "/knu-default.png"; }}
            />
            {hovered && isMyProfile && (
              <div style={{
                position: "absolute",
                top: 0, left: 0, width: "100%", height: "100%",
                backgroundColor: "rgba(0,0,0,0.4)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "24px",
                fontWeight: "bold",
                pointerEvents: "none"
              }}>
                ✏️
              </div>
            )}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} />
          </div>

          {/* 이름, 단대, 학과 */}
          <div style={{ fontSize: "18px", lineHeight: "2.2", textAlign: "left", marginBottom: "20px" }}>
            <div>
              <label style={{ fontWeight: "bold" }}>이름</label><br />
              {isMyProfile && user?.uid && (
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#777" }}>
                  내 UID: <code>{user.uid}</code>
                </div>
              )}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                disabled={!isMyProfile}
                style={{
                  width: "100%", padding: "10px", fontSize: "16px",
                  borderRadius: "8px", border: "1px solid #ccc", marginTop: "4px",
                  backgroundColor: isMyProfile ? "#fff" : "#eee"
                }}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ fontWeight: "bold" }}>단과대학</label><br />
              <select
                value={selectedCollege}
                onChange={(e) => {
                  setSelectedCollege(e.target.value);
                  setSelectedDepartment("");
                }}
                disabled={!isMyProfile}
                style={{
                  width: "100%", padding: "10px", fontSize: "16px",
                  borderRadius: "8px", border: "1px solid #ccc", marginTop: "4px",
                  backgroundColor: isMyProfile ? "#fff" : "#eee"
                }}
              >
                <option value="">선택하세요</option>
                {collegeOptions.map((college) => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>

            {selectedCollege && (
              <div style={{ marginTop: "16px" }}>
                <label style={{ fontWeight: "bold" }}>학과</label><br />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  disabled={!isMyProfile}
                  style={{
                    width: "100%", padding: "10px", fontSize: "16px",
                    borderRadius: "8px", border: "1px solid #ccc", marginTop: "4px",
                    backgroundColor: isMyProfile ? "#fff" : "#eee"
                  }}
                >
                  <option value="">선택하세요</option>
                  {collegeDepartments[selectedCollege].map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 저장 버튼 */}
          {isMyProfile && (
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <button
                onClick={handleSaveProfile}
                style={{
                  padding: "10px 20px", backgroundColor: "#28a745",
                  color: "#fff", border: "none", borderRadius: "8px",
                  fontWeight: "bold", cursor: "pointer",
                }}
              >
                저장
              </button>
              <div style={{ marginTop: 10, color: "#555" }}>{saveStatus}</div>
            </div>
          )}

          {/* 로그아웃 버튼 */}
          {isMyProfile && (
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 20px", backgroundColor: "#D90E15",
                  color: "#fff", border: "none", borderRadius: "8px",
                  fontWeight: "bold", cursor: "pointer",
                }}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}