import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { auth } from '../firebase/config';

// Firebase-based storage implementation for persistent cloud storage
// Falls back to localStorage when user is not authenticated

class StorageAPI {
  constructor() {
    this.prefix = 'training-tracker-';
  }

  // Get user ID for Firestore path
  getUserId() {
    return auth.currentUser?.uid || 'anonymous';
  }

  async set(key, value) {
    try {
      const userId = this.getUserId();
      
      // If user is authenticated, save to Firestore
      if (auth.currentUser) {
        const docRef = doc(db, 'users', userId, 'data', key);
        await setDoc(docRef, { value, updatedAt: new Date().toISOString() });
      } else {
        // Fallback to localStorage if not authenticated
        const serialized = JSON.stringify(value);
        localStorage.setItem(this.prefix + key, serialized);
      }
      
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      throw new Error('Fehler beim Speichern der Daten');
    }
  }

  async get(key) {
    try {
      const userId = this.getUserId();
      
      // If user is authenticated, get from Firestore
      if (auth.currentUser) {
        const docRef = doc(db, 'users', userId, 'data', key);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return docSnap.data().value;
        }
        return null;
      } else {
        // Fallback to localStorage if not authenticated
        const serialized = localStorage.getItem(this.prefix + key);
        if (serialized === null) {
          return null;
        }
        return JSON.parse(serialized);
      }
    } catch (error) {
      console.error('Storage get error:', error);
      throw new Error('Fehler beim Laden der Daten');
    }
  }

  async remove(key) {
    try {
      const userId = this.getUserId();
      
      // If user is authenticated, remove from Firestore
      if (auth.currentUser) {
        const docRef = doc(db, 'users', userId, 'data', key);
        await setDoc(docRef, { value: null, updatedAt: new Date().toISOString() });
      } else {
        // Fallback to localStorage if not authenticated
        localStorage.removeItem(this.prefix + key);
      }
      
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      throw new Error('Fehler beim Löschen der Daten');
    }
  }
}

// Initialize storage API - use custom namespace to avoid conflicts
const storageAPI = new StorageAPI();

// Also expose as window.storage for compatibility with the requirement
if (!window.storage) {
  window.storage = storageAPI;
}

export default storageAPI;
