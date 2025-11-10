import React, { createContext, useContext, useState } from 'react';
import { initializeApp } from "firebase/app"; 

const firebaseConfig = { 
  apiKey: "AIzaSyC20URsFPYhlsOeHCIHP556tAwj5cZv-LI", 
  authDomain: "dental-ffc44.firebaseapp.com", 
  projectId: "dental-ffc44", 
  storageBucket: "dental-ffc44.firebasestorage.app", 
  messagingSenderId: "374518547185", 
  appId: "1:374518547185:web:56f816df7f222898e15f50", 
  measurementId: "G-MZQDCPKFDV" 
}; 

// Initialize Firebase without assigning to variable
initializeApp(firebaseConfig);

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [firebaseData, setFirebaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async (path) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setFirebaseData({ message: 'Firebase data loaded' });
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const setData = async (path, data) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setFirebaseData(data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const value = { firebaseData, loading, error, getData, setData };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirebase must be used within a FirebaseProvider');
  return context;
};
