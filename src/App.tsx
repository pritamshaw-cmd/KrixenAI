import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';
import { auth } from './lib/firebase';

import Splash from './components/Splash';
import Login from './components/Login';
import BottomNav from './components/BottomNav';
import ImageStudio from './components/ImageStudio';
import VideoStudio from './components/VideoStudio';
import VoiceStudio from './components/VoiceStudio';
import Profile from './components/Profile';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Handle Splash Screen timeout
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    // Handle Auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      clearTimeout(splashTimer);
      unsubscribe();
    };
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-base text-white">
        <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base pb-24">
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/image" element={<ImageStudio />} />
          <Route path="/video" element={<VideoStudio />} />
          <Route path="/voice" element={<VoiceStudio />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Navigate to="/image" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
