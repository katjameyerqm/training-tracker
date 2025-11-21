// Mock implementation of window.storage API for persistent cloud storage
// In production, this would be replaced with actual cloud storage implementation

class StorageAPI {
  constructor() {
    this.prefix = 'training-tracker-';
  }

  async set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      throw new Error('Fehler beim Speichern der Daten');
    }
  }

  async get(key) {
    try {
      const serialized = localStorage.getItem(this.prefix + key);
      if (serialized === null) {
        return null;
      }
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Storage get error:', error);
      throw new Error('Fehler beim Laden der Daten');
    }
  }

  async remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
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
