// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1cqQP4sKZJPPqy8N8BCXqo8t3MxWkFdc",
  authDomain: "knumap-d9e39.firebaseapp.com",
  projectId: "knumap-d9e39",
  appId: "1:896359882509:web:a757cf18391390ac0cda44"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);