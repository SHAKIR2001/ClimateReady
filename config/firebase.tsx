// Import only what you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyB1Yq0-F-7marx8W17lfUm2fTr2E3q3_xo",
  authDomain: "climatereadyapp.firebaseapp.com",
  projectId: "climatereadyapp",
  storageBucket: "climatereadyapp.appspot.com",
  messagingSenderId: "272661054338",
  appId: "1:272661054338:web:e7cd8b613eb1c7e602059b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Auth instance for login/signup
export const auth = getAuth(app);
