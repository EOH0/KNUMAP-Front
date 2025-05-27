// pages/profile.js
import { useContext } from "react";
import { UserContext } from "./_app";
import { useRouter } from "next/router";

export default function Profile() {
  const user = useContext(UserContext);
  const router = useRouter();

  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return <div>로그인이 필요합니다...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>내 정보</h2>
      <p><strong>이메일:</strong> {user.email}</p>
      <p><strong>UID:</strong> {user.uid}</p>
    </div>
  );
}