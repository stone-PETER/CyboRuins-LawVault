
// src/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDacr-xxWHfuhlhneER__kzQv0qIqrvMRc",
    authDomain: "law-vault.firebaseapp.com",
    projectId: "law-vault",
    storageBucket: "law-vault.firebasestorage.app",
    messagingSenderId: "874070294000",
    appId: "1:874070294000:web:3a571c477e76f0f8537135",
    measurementId: "G-DTPD8Q74DL"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
