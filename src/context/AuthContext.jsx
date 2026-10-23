import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase/config';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('voltcraft_guest') === 'true';
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false);
        localStorage.removeItem('voltcraft_guest');
        // Sync user profile to Firestore
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          await setDoc(userRef, {
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'Maker',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            createdAt: new Date().toISOString(),
          }, { merge: true });
        } catch (err) {
          console.warn('Error syncing user profile to Firestore:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setIsGuest(false);
      localStorage.removeItem('voltcraft_guest');
      setLoginModalOpen(false);
      toast.success(`Welcome, ${result.user.displayName || 'Maker'}!`);
      return result.user;
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(`Sign in error: ${error.message || 'Could not authenticate'}`);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsGuest(false);
      localStorage.removeItem('voltcraft_guest');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('voltcraft_guest', 'true');
    setLoginModalOpen(false);
    toast('Browsing as Guest. You can sign in anytime to save to cloud.', {
      icon: '👤',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        loginModalOpen,
        setLoginModalOpen,
        loginWithGoogle,
        logout,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
