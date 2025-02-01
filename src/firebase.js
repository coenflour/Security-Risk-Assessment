
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore, getDocs, onSnapshot} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFtaQhpZlQUSUv3DhzCET0gNKwlf3CIBo",
  authDomain: "form-assessment.firebaseapp.com",
  projectId: "form-assessment",
  storageBucket: "form-assessment.firebasestorage.app",
  messagingSenderId: "115642419215",
  appId: "1:115642419215:web:6a183e69661f1022d1bb7a",
  measurementId: "G-F4V0FBMC3S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password)=> {
    try{
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "user"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,

        })
    } catch (error) {
        console.error("Error saat sign up:", error);
        if (error.code === "auth/email-already-in-use") {
            alert("Email sudah terdaftar! Silakan login.");
        } else {
            alert(error.message);
        }
    }
}
const login = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login Success:", res.user);  // Pastikan login berhasil
    } catch (error) {
        console.log("Login Failed:", error);  // Cek error yang terjadi
        alert("Login failed: " + error.message);
    }
};

const logout = ()=> {
    signOut(auth);
}


export {auth, db, login, signup, logout, collection, getAuth, app, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onSnapshot, addDoc}