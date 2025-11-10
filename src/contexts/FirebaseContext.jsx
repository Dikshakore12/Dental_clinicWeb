import React, { createContext, useContext, useState } from 'react';
import { initializeApp } from "firebase/app"; 
// import { getAnalytics } from "firebase/analytics"; // Removed since unused

// TODO: Add SDKs for Firebase products that you want to use 
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration 
// For Firebase JS SDK v7.20.0 and later, measurementId is optional 
const firebaseConfig = { 
  apiKey: "AIzaSyC20URsFPYhlsOeHCIHP556tAwj5cZv-LI", 
  authDomain: "dental-ffc44.firebaseapp.com", 
  projectId: "dental-ffc44", 
  storageBucket: "dental-ffc44.firebasestorage.app", 
  messagingSenderId: "374518547185", 
  appId: "1:374518547185:web:56f816df7f222898e15f50", 
  measurementId: "G-MZQDCPKFDV" 
}; 

// Initialize Firebase 
const app = initializeApp(firebaseConfig); 
// const analytics = getAnalytics(app); // Commented out since unused

// Create the Firebase Context
const FirebaseContext = createContext();

// Firebase Provider Component
export const FirebaseProvider = ({ children }) => {
  const [firebaseData, setFirebaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder Firebase functions - these would be replaced with actual Firebase calls
  const getData = async (path) => {
    try {
      setLoading(true);
      // Simulate API call
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
      // Simulate API call
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

  const value = {
    firebaseData,
    loading,
    error,
    getData,
    setData
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to use Firebase Context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
