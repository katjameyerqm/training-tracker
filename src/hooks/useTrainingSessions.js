import { useState, useEffect } from 'react';
import storage from '../utils/storage';

const SESSIONS_KEY = 'training-sessions';

export function useTrainingSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load sessions from storage
  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        const data = await storage.get(SESSIONS_KEY);
        setSessions(data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading sessions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  // Save sessions to storage
  const saveSessions = async (newSessions) => {
    try {
      await storage.set(SESSIONS_KEY, newSessions);
      setSessions(newSessions);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving sessions:', err);
      throw err;
    }
  };

  // Add a new session
  const addSession = async (session) => {
    const newSession = {
      ...session,
      id: crypto.randomUUID(),
      status: 'planned',
    };
    await saveSessions([...sessions, newSession]);
    return newSession;
  };

  // Update a session
  const updateSession = async (id, updates) => {
    const updated = sessions.map(session => 
      session.id === id ? { ...session, ...updates } : session
    );
    await saveSessions(updated);
  };

  // Delete a session
  const deleteSession = async (id) => {
    const filtered = sessions.filter(session => session.id !== id);
    await saveSessions(filtered);
  };

  // Get sessions by date
  const getSessionsByDate = (date) => {
    return sessions.filter(session => session.date === date);
  };

  // Get active session (in-progress)
  const getActiveSession = () => {
    return sessions.find(session => session.status === 'in-progress');
  };

  return {
    sessions,
    loading,
    error,
    addSession,
    updateSession,
    deleteSession,
    getSessionsByDate,
    getActiveSession,
  };
}
