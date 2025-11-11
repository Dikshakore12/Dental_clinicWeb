// Test Firestore connection and operations
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
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

// Initialize Firebase + Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    
    // Test 1: Basic connection by getting a document
    const testDocRef = doc(db, 'test', 'connection-test');
    const testDocSnap = await getDoc(testDocRef);
    
    if (testDocSnap.exists()) {
      console.log('✅ Firestore connection test: Document exists');
    } else {
      console.log('ℹ️ Firestore connection test: Document does not exist (connection is working)');
    }
    
    // Test 2: Write operation
    const testData = {
      message: 'Test connection from testFirestore.js',
      timestamp: new Date().toISOString(),
      testId: Date.now()
    };
    
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('✅ Firestore write test: Document written with ID:', docRef.id);
    
    // Test 3: Read operation
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Firestore read test: Retrieved', querySnapshot.size, 'documents');
    
    return {
      success: true,
      message: 'Firestore connection successful',
      documentsCount: querySnapshot.size
    };
    
  } catch (error) {
    console.error('❌ Firestore connection error:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

export const testFirestoreOperations = async () => {
  try {
    console.log('Testing Firestore operations...');
    
    // Test collection operations
    const testCollection = collection(db, 'appointments');
    
    // Test read
    const snapshot = await getDocs(testCollection);
    console.log('✅ Firestore appointments read: Found', snapshot.size, 'appointments');
    
    return {
      success: true,
      appointmentsCount: snapshot.size
    };
    
  } catch (error) {
    console.error('❌ Firestore operations error:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};