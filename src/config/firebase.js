
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-e-commerce-2025.firebaseapp.com",
    projectId: "mern-e-commerce-2025",
    storageBucket: "mern-e-commerce-2025.firebasestorage.app",
    messagingSenderId: "362566914077",
    appId: "1:362566914077:web:1af1cf91f2fd81a737f6f4"
};


export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);