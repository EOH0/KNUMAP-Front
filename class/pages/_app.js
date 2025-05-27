// pages/_app.js
import "@/styles/globals.css";
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export const UserContext = createContext(null);

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}