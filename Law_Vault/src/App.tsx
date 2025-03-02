import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import Vault from './pages/vault';
import Advisor from './pages/advisor';
import Home from './pages/home';

function App() {
  const [user, setUser] = useState<any>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Sign in function
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign-in", error);
    }
  };

  // Sign out function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} handleGoogleSignIn={handleGoogleSignIn} handleSignOut={handleSignOut} />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/advisor" element={<Advisor />} />
      </Routes>
    </Router>
  );
}

export default App;