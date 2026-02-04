// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useLoading } from './LoadingContext.jsx'; 

const AuthContext = createContext();

/**
 * Custom hook to access auth state (user and loading status)
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Provider that manages the Firebase User and Firestore Role
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); 
  const { showLoading, hideLoading } = useLoading(); 

  useEffect(() => {
    // 1. Show global spinner while we verify the user session
    showLoading('Checking authentication...'); 

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 2. Fetch the user document from Firestore to get their 'role' (admin/user)
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // 3. Merge Auth details with Firestore custom data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              ...userData, // Spreads role, username, and createdAt
            });
          } else {
            // User exists in Auth but record is missing in Firestore
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
          setUser(null);
        }
      } else {
        // No user is logged in
        setUser(null);
      }

      // 4. Verification complete: Stop spinners and update state
      setAuthLoading(false);
      hideLoading();
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [showLoading, hideLoading]);

  return (
    <AuthContext.Provider value={{ user, authLoading }}>
      {/* We prevent the app from rendering while authLoading is true 
          to avoid showing protected routes/pages before the role is confirmed.
      */}
      {!authLoading && children}
    </AuthContext.Provider>
  );
};