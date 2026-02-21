import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2Pwwm3t_72qQtwdShXGBLf8PN52Rw_Ow",
  authDomain: "fluxfit-e978f.firebaseapp.com",
  projectId: "fluxfit-e978f",
  storageBucket: "fluxfit-e978f.firebasestorage.app",
  messagingSenderId: "493754153945",
  appId: "1:493754153945:web:639f24a61177a84784f7c8"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();