import { useState, useEffect } from "react";
import { createContext } from "react";
import { UserContext } from "../lib/UserContext";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}