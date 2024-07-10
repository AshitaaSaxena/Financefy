// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore, doc, setDoc } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANZp0V35Ug7tFRYIkG3hIWNppYme6QPfk",
  authDomain: "financify-63168.firebaseapp.com",
  projectId: "financify-63168",
  storageBucket: "financify-63168.appspot.com",
  messagingSenderId: "1031024475277",
  appId: "1:1031024475277:web:c29d40ff9fd757f271f6c4",
  measurementId: "G-WTF09MN8MC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export{ db, auth, provider, doc, setDoc};