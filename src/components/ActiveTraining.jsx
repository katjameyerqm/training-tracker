import { useState } from 'react';
import { formatDate } from '../utils/dateUtils';

export default function ActiveTraining({ session, exercises, onUpdateSession }) {
  const [notes, setNotes] = useState('');

  const workingSession = session ? JSON.parse(JSON.stringify(session)) : null;

  if (!session || !workingSession) {
    return (
      <div className="p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏋️</div>
            <h2 className="text-2xl font-semibold mb-2">Kein aktives Training</h2>
            <p className="text-gray-600">
              Starte ein Training im Trainingsplan
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getExercise = (exerciseId) => {
    return exercises.find(e => e.id === exerciseId);
  };

  const handleSetComplete = (exerciseIndex, setIndex, completed) => {
    const updated = { ...workingSession };
    updated.exercises[exerciseIndex].sets[setIndex].completed = completed;
    onUpdateSession(session.id, updated);
  };

  const handleSetUpdate = (exerciseIndex, setIndex, field, value) => {
    const updated = { ...workingSession };
    updated.exercises[exerciseIndex].sets[setIndex][field] = 
      field === 'actualReps' || field === 'weight' ? parseInt(value) || 0 : value;
    onUpdateSession(session.id, updated);
  };

  const handleCompleteTraining = async () => {
    const allCompleted = workingSession.exercises.every(ex =>
      ex.sets.every(set => set.completed)
    );

    if (!allCompleted) {
      if (!window.confirm('Nicht alle Sätze sind abgeschlossen. Trotzdem beenden?')) {
        return;
      }
    }

    const updated = {
      ...workingSession,
      status: 'completed',
      notes
    };
    
    try {
      await onUpdateSession(session.id, updated);
      alert('Training abgeschlossen! 💪');
    } catch (error) {
      alert('Fehler beim Abschließen: ' + error.message);
    }
  };

  const getProgress = () => {
    const totalSets = workingSession.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = workingSession.exercises.reduce((sum, ex) => 
      sum + ex.sets.filter(s => s.completed).length, 0
    );
    return { completed: completedSets, total: totalSets };
  };

  const progress = getProgress();
  const progressPercent = progress.total > 0 ? (progress.completed / progress.total * 100) : 0;

  return (
    <div className="p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">
            Training vom {formatDate(session.date)}
          </h2>
          
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Fortschritt</span>
              <span>{progress.completed} / {progress.total} Sätze</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {workingSession.exercises.map((exerciseData, exerciseIndex) => {
            const exercise = getExercise(exerciseData.exerciseId);
            if (!exercise) return null;

            return (
              <div key={exerciseIndex} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">{exercise.name}</h3>
                
                {exerciseData.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className={`border rounded-lg p-3 mb-2 ${
                      set.completed ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Satz {setIndex + 1}</span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={set.completed}
                          onChange={(e) => handleSetComplete(exerciseIndex, setIndex, e.target.checked)}
                          className="w-6 h-6 cursor-pointer"
                        />
                        <span className="text-sm">Fertig</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Ziel: {set.targetReps} Wdh.
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={set.actualReps}
                            onChange={(e) => handleSetUpdate(exerciseIndex, setIndex, 'actualReps', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Wiederholungen"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Gewicht (kg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={set.weight}
                          onChange={(e) => handleSetUpdate(exerciseIndex, setIndex, 'weight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        Equipment (optional)
                      </label>
                      <input
                        type="text"
                        value={set.equipment || ''}
                        onChange={(e) => handleSetUpdate(exerciseIndex, setIndex, 'equipment', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="z.B. Kurzhanteln, Band..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-4 border border-gray-200">
          <label className="block text-sm font-medium mb-2">Notizen zum Training</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Wie lief das Training? Besonderheiten?"
          />
        </div>

        {/* Complete Button */}
        <button
          onClick={handleCompleteTraining}
          className="w-full mt-4 bg-green-600 text-white py-4 px-4 rounded-lg font-semibold text-lg hover:bg-green-700 active:bg-green-800 min-h-[44px]"
        >
          Training abschließen
        </button>
      </div>
    </div>
  );
}
