// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "mern-blog-90ae7.firebaseapp.com",
  projectId: "mern-blog-90ae7",
  storageBucket: "mern-blog-90ae7.appspot.com",
  messagingSenderId: "1026106857748",
  appId: "1:1026106857748:web:5889a889e912133b860a01"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);