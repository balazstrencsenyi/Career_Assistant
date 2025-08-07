import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBPgaRdLGlY7g4wDa8a3kEG31xYkdMTfUA",
  authDomain: "careerassistant-5f0e4.firebaseapp.com",
  projectId: "careerassistant-5f0e4",
  storageBucket: "careerassistant-5f0e4.firebasestorage.app",
  messagingSenderId: "763262786345",
  appId: "1:763262786345:web:d865d0cca0223edc893538",
  measurementId: "G-K2SE4R21X3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// 👇 add and export Google provider
export const googleProvider = new GoogleAuthProvider();

// (optional) analytics, guarded
let analytics;
if (typeof window !== 'undefined') {
  try {
    isSupported().then((ok) => { if (ok) analytics = getAnalytics(app); });
  } catch {}
}
export { analytics };
