// pages/social.js
import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Main.module.css";
import { UserContext } from "../lib/UserContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

export default function SocialPage() {
  const router = useRouter();
  const user = useContext(UserContext);

  const [allUsers, setAllUsers] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        setAllUsers(users);
      } catch (err) {
        console.error("전체 사용자 불러오기 실패:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMyFriends = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          const friendUids = data.friends || [];
          const friendsData = await Promise.all(
            friendUids.map(async (fuid) => {
              const fSnap = await getDoc(doc(db, "users", fuid));
              return fSnap.exists() ? { uid: fuid, ...fSnap.data() } : null;
            })
          );
          setMyFriends(friendsData.filter(Boolean));
        }
      } catch (err) {
        console.error("친구 목록 불러오기 실패:", err);
      }
    };

    fetchMyFriends();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        setAllUsers(users);
      } catch (err) {
        console.error("전체 사용자 불러오기 실패:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMyFriends = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          const friendUids = data.friends || [];
          const friendsData = await Promise.all(
            friendUids.map(async (fuid) => {
              const fSnap = await getDoc(doc(db, "users", fuid));
              return fSnap.exists() ? { uid: fuid, ...fSnap.data() } : null;
            })
          );
          setMyFriends(friendsData.filter(Boolean));
        }
      } catch (err) {
        console.error("친구 목록 불러오기 실패:", err);
      } finally {
        setLoadingFriends(false);
      }
    };
    fetchMyFriends();
  }, [user]);


  const handleAddFriend = async (target) => {
    if (!user) return alert("로그인 후 이용 가능합니다.");
    if (!target) return alert("대상을 선택해주세요.");
    if (target.uid === user.uid) return alert("자기 자신은 추가할 수 없습니다.");
    if (myFriends.some(f => f.uid === target.uid)) return alert("이미 친구입니다.");

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        friends: arrayUnion(target.uid)
      });
      alert("친구 추가 완료");
      setFriendName("");
      setSuggestions([]);
      setMyFriends(prev => [...prev, target]);
    } catch (err) {
      console.error("친구 추가 실패:", err);
      alert("추가 중 오류 발생");
    }
  };

  const handleRemoveFriend = async (uidToRemove) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        friends: arrayRemove(uidToRemove)
      });
      setMyFriends(prev => prev.filter(f => f.uid !== uidToRemove));
    } catch (err) {
      console.error("친구 삭제 실패:", err);
    }
  };

  const handleNameChange = (e) => {
    const input = e.target.value;
    setFriendName(input);
    if (input.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = allUsers.filter(u => u.name && u.name.includes(input.trim()) && u.uid !== user?.uid);
      setSuggestions(filtered.slice(0, 5));
    }
  };

  return (
    <>
      <Head>
        <title>KNUMAP 소셜</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.logo} onClick={() => router.push("/")}>KNUMAP</div>
        <nav className={styles.menu}>
          <button onClick={() => router.push("/partner")}>제휴</button>
          <button onClick={() => router.push("/social")}>소셜</button>
          <button onClick={() => router.push("/favorite")}>즐겨찾기</button>
        </nav>
        <div className={styles.userMenu}>
          {user ? (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); router.push("/profile"); }}>내 정보</a>
              <span style={{ margin: "0 6px" }}>|</span>
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  await signOut(auth);
                  alert("로그아웃 되었습니다.");
                  router.push("/");
                }}
              >로그아웃</a>
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
        <section style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px", background: "#fff", padding: "32px", borderRadius: "16px", boxShadow: "0 0 16px rgba(0,0,0,0.05)", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>👥 친구 추가 (이름 자동완성)</h2>
          <input
            type="text"
            placeholder="상대방 이름을 입력하세요"
            value={friendName}
            onChange={handleNameChange}
            style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #ccc", width: "70%", fontSize: "16px" }}
          />
          <ul style={{ listStyle: "none", marginTop: "10px", padding: 0, width: "100%" }}>
            {suggestions.map((s) => (
              <li key={s.uid} style={{ marginTop: "6px", fontSize: "14px", color: "#555", cursor: "pointer", textAlign: "center" }} onClick={() => handleAddFriend(s)}>
                {s.name} ({s.uid}) 친구로 추가하기
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: "40px", textAlign: "center", background: "#fff", padding: "32px", borderRadius: "16px", boxShadow: "0 0 16px rgba(0,0,0,0.05)", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>📋 내 친구 목록</h2>
          {(loadingUsers || loadingFriends) && (
            <div style={{ textAlign: "center", marginTop: "120px" }}>
              <img
                src="/loading-cat.png"
                alt="로딩 중"
                style={{
                  width: "120px",
                  marginBottom: "20px",
                  animation: "bounce 1.5s infinite"
                }}
              />
              <p style={{ fontSize: "18px", color: "#666" }}>😺 로딩 중이에요... 잠시만요!</p>

              <style jsx>{`
                @keyframes bounce {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-10px); }
                }
              `}</style>
            </div>
          )}
          {myFriends.length === 0 ? (
            <p style={{ color: "#999" }}>아직 친구가 없습니다.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {myFriends.map((friend) => (
                <li key={friend.uid} style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "12px 0", fontSize: "16px", gap: "10px" }}>
                  <strong style={{ cursor: "pointer", color: "#D90E15" }} onClick={() => router.push(`/profile?uid=${friend.uid}`)}>
                    {friend.name || "이름 없음"}
                  </strong>
                  <span style={{ color: "#666" }}>({friend.uid})</span>
                  <button
                    onClick={() => router.push(`/chat?uid=${friend.uid}`)}
                    style={{ padding: "6px 12px", borderRadius: "8px", backgroundColor: "#007bff", color: "white", border: "none" }}
                  >채팅</button>
                  <button
                    onClick={() => handleRemoveFriend(friend.uid)}
                    style={{ padding: "6px 12px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9", cursor: "pointer" }}
                  >삭제</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
