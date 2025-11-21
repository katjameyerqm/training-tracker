import { useState, useEffect } from 'react';
import storage from '../utils/storage';

const EXERCISES_KEY = 'exercises';

export function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load exercises from storage
  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true);
        const data = await storage.get(EXERCISES_KEY);
        setExercises(data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading exercises:', err);
      } finally {
        setLoading(false);
      }
    }
    loadExercises();
  }, []);

  // Save exercises to storage
  const saveExercises = async (newExercises) => {
    try {
      await storage.set(EXERCISES_KEY, newExercises);
      setExercises(newExercises);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving exercises:', err);
      throw err;
    }
  };

  // Add a new exercise
  const addExercise = async (exercise) => {
    const newExercise = {
      ...exercise,
      id: crypto.randomUUID(),
    };
    await saveExercises([...exercises, newExercise]);
    return newExercise;
  };

  // Update an exercise
  const updateExercise = async (id, updates) => {
    const updated = exercises.map(ex => 
      ex.id === id ? { ...ex, ...updates } : ex
    );
    await saveExercises(updated);
  };

  // Delete an exercise
  const deleteExercise = async (id) => {
    const filtered = exercises.filter(ex => ex.id !== id);
    await saveExercises(filtered);
  };

  return {
    exercises,
    loading,
    error,
    addExercise,
    updateExercise,
    deleteExercise,
  };
}
