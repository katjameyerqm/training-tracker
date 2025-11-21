import { useState } from 'react';
import { getWeekDates, formatDate, getDayName, isToday, getWeekRange } from '../utils/dateUtils';

export default function TrainingPlan({ 
  sessions, 
  exercises, 
  onAddSession, 
  onDeleteSession,
  onStartSession 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const weekDates = getWeekDates(currentDate);
  const weekRange = getWeekRange(currentDate);

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleAddExercise = (exerciseId) => {
    if (!selectedExercises.find(e => e.exerciseId === exerciseId)) {
      setSelectedExercises([...selectedExercises, {
        exerciseId,
        sets: [{ targetReps: 10, actualReps: 0, weight: 0, completed: false }]
      }]);
    }
  };

  const handleRemoveExercise = (exerciseId) => {
    setSelectedExercises(selectedExercises.filter(e => e.exerciseId !== exerciseId));
  };

  const handleUpdateSets = (exerciseId, setCount) => {
    setSelectedExercises(selectedExercises.map(e => {
      if (e.exerciseId === exerciseId) {
        const newSets = Array.from({ length: setCount }, (_, i) => 
          e.sets[i] || { targetReps: 10, actualReps: 0, weight: 0, completed: false }
        );
        return { ...e, sets: newSets };
      }
      return e;
    }));
  };

  const handleUpdateTargetReps = (exerciseId, setIndex, targetReps) => {
    setSelectedExercises(selectedExercises.map(e => {
      if (e.exerciseId === exerciseId) {
        const newSets = [...e.sets];
        newSets[setIndex] = { ...newSets[setIndex], targetReps: parseInt(targetReps) || 0 };
        return { ...e, sets: newSets };
      }
      return e;
    }));
  };

  const handleSaveSession = async () => {
    if (!selectedDate || selectedExercises.length === 0) {
      alert('Bitte wähle ein Datum und füge mindestens eine Übung hinzu');
      return;
    }

    try {
      await onAddSession({
        date: selectedDate,
        exercises: selectedExercises,
        notes: '',
        status: 'planned'
      });
      resetForm();
    } catch (error) {
      alert('Fehler beim Speichern: ' + error.message);
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedExercises([]);
    setShowForm(false);
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Training wirklich löschen?')) {
      try {
        await onDeleteSession(sessionId);
      } catch (error) {
        alert('Fehler beim Löschen: ' + error.message);
      }
    }
  };

  const getExerciseName = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    return exercise ? exercise.name : 'Unbekannte Übung';
  };

  return (
    <div className="p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={previousWeek}
            className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 min-h-[44px] min-w-[44px]"
          >
            ◀
          </button>
          <div className="text-center">
            <div className="font-semibold text-lg">
              {weekRange.start} - {weekRange.end}
            </div>
          </div>
          <button
            onClick={nextWeek}
            className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 min-h-[44px] min-w-[44px]"
          >
            ▶
          </button>
        </div>

        {/* Week Calendar */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDates.map(date => {
            const daySessions = sessions.filter(s => s.date === date);
            const today = isToday(date);
            
            return (
              <div key={date} className="text-center">
                <div className="text-xs font-medium mb-1">{getDayName(date)}</div>
                <button
                  onClick={() => handleDateClick(date)}
                  className={`w-full p-2 rounded-lg border-2 min-h-[60px] ${
                    today 
                      ? 'border-primary bg-peach/20'
                      : 'border-gray-200 bg-white'
                  } hover:bg-gray-50`}
                >
                  <div className="font-semibold">{new Date(date).getDate()}</div>
                  {daySessions.length > 0 && (
                    <div className="text-xs mt-1">
                      {daySessions.map(s => (
                        <div
                          key={s.id}
                          className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                            s.status === 'completed' ? 'bg-coral' :
                            s.status === 'in-progress' ? 'bg-peach' :
                            'bg-secondary'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Session Form */}
        {showForm && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">
              Training für {formatDate(selectedDate)}
            </h3>

            {/* Exercise Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Übung hinzufügen</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddExercise(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="">Übung auswählen...</option>
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            </div>

            {/* Selected Exercises */}
            <div className="space-y-3 mb-4">
              {selectedExercises.map(({ exerciseId, sets }) => (
                <div key={exerciseId} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{getExerciseName(exerciseId)}</h4>
                    <button
                      onClick={() => handleRemoveExercise(exerciseId)}
                      className="text-red-600 hover:text-red-700 min-h-[44px] min-w-[44px]"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="flex gap-2 items-center mb-2">
                    <label className="text-sm">Anzahl Sätze:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={sets.length}
                      onChange={(e) => handleUpdateSets(exerciseId, parseInt(e.target.value) || 1)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>

                  {sets.map((set, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-1">
                      <span className="text-sm w-12">Satz {idx + 1}:</span>
                      <input
                        type="number"
                        min="1"
                        value={set.targetReps}
                        onChange={(e) => handleUpdateTargetReps(exerciseId, idx, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                      />
                      <span className="text-sm">Wdh.</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveSession}
                disabled={selectedExercises.length === 0}
                className="flex-1 bg-coral text-white py-3 px-4 rounded-lg font-semibold hover:bg-coral-dark active:bg-coral-dark disabled:bg-gray-300 disabled:cursor-not-allowed min-h-[44px]"
              >
                Training speichern
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 min-h-[44px]"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-3">
          {sessions.filter(s => weekDates.includes(s.date)).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Keine Trainings in dieser Woche
            </div>
          ) : (
            sessions
              .filter(s => weekDates.includes(s.date))
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(session => (
                <div key={session.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{formatDate(session.date)}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        session.status === 'completed' ? 'bg-coral/20 text-coral-dark' :
                        session.status === 'in-progress' ? 'bg-peach/30 text-secondary-dark' :
                        'bg-secondary/20 text-secondary-dark'
                      }`}>
                        {session.status === 'completed' ? 'Abgeschlossen' :
                         session.status === 'in-progress' ? 'Läuft' :
                         'Geplant'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {session.status === 'planned' && (
                        <button
                          onClick={() => onStartSession(session.id)}
                          className="px-3 py-1 bg-coral/20 text-coral-dark rounded hover:bg-coral/30 min-h-[44px]"
                        >
                          ▶ Start
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 min-h-[44px] min-w-[44px]"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {session.exercises.length} Übung(en)
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
