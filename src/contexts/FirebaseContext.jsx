import React, { createContext, useContext, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase config
const firebaseConfig = { 
  apiKey: "AIzaSyC20URsFPYhlsOeHCIHP556tAwj5cZv-LI", 
  authDomain: "dental-ffc44.firebaseapp.com", 
  projectId: "dental-ffc44", 
  storageBucket: "dental-ffc44.firebasestorage.app", 
  messagingSenderId: "374518547185", 
  appId: "1:374518547185:web:56f816df7f222898e15f50", 
  measurementId: "G-MZQDCPKFDV" 
};

// Initialize Firebase + Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firebase Context
const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [firebaseData, setFirebaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Read data
  const getData = async (collectionName) => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFirebaseData(data);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Write data
  const setData = async (collectionName, data) => {
    try {
      setLoading(true);
      await addDoc(collection(db, collectionName), data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return (
    <FirebaseContext.Provider value={{ firebaseData, loading, error, getData, setData }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook
export const useFirebase = () => useContext(FirebaseContext);
