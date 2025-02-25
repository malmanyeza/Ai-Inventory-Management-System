// config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAsB1Jj1JOyM-gS1CoSoeOdL9sX5fOK7NA",
    authDomain: "hit400-99fd8.firebaseapp.com",
    projectId: "hit400-99fd8",
    storageBucket: "hit400-99fd8.firebasestorage.app",
    messagingSenderId: "62075672949",
    appId: "1:62075672949:web:e11a15b770be2d653fdb3c"
};

const app = initializeApp(firebaseConfig);

// Firestore Emulator
const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);

// Auth Emulator
const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");

export { db, auth };