import { useState } from 'react';
import { useExercises } from './hooks/useExercises';
import { useTrainingSessions } from './hooks/useTrainingSessions';
import ExerciseBacklog from './components/ExerciseBacklog';
import TrainingPlan from './components/TrainingPlan';
import ActiveTraining from './components/ActiveTraining';

function App() {
  const [activeTab, setActiveTab] = useState('plan'); // 'backlog', 'plan', 'active'
  
  const {
    exercises,
    loading: exercisesLoading,
    error: exercisesError,
    addExercise,
    updateExercise,
    deleteExercise,
  } = useExercises();

  const {
    sessions,
    loading: sessionsLoading,
    error: sessionsError,
    addSession,
    updateSession,
    deleteSession,
    getActiveSession,
  } = useTrainingSessions();

  const activeSession = getActiveSession();

  const handleStartSession = async (sessionId) => {
    try {
      await updateSession(sessionId, { status: 'in-progress' });
      setActiveTab('active');
    } catch (error) {
      alert('Fehler beim Starten: ' + error.message);
    }
  };

  if (exercisesLoading || sessionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-2">⏳</div>
          <div className="text-gray-600">Lade Daten...</div>
        </div>
      </div>
    );
  }

  if (exercisesError || sessionsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <div className="text-4xl mb-2">⚠️</div>
          <div>Fehler beim Laden der Daten</div>
          <div className="text-sm mt-2">{exercisesError || sessionsError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">🏋️ Training Tracker</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-140px)]">
        {activeTab === 'backlog' && (
          <ExerciseBacklog
            exercises={exercises}
            onAdd={addExercise}
            onEdit={updateExercise}
            onDelete={deleteExercise}
          />
        )}

        {activeTab === 'plan' && (
          <TrainingPlan
            sessions={sessions}
            exercises={exercises}
            onAddSession={addSession}
            onUpdateSession={updateSession}
            onDeleteSession={deleteSession}
            onStartSession={handleStartSession}
          />
        )}

        {activeTab === 'active' && (
          <ActiveTraining
            session={activeSession}
            exercises={exercises}
            onUpdateSession={updateSession}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button
            onClick={() => setActiveTab('backlog')}
            className={`flex-1 py-3 px-4 text-center min-h-[60px] ${
              activeTab === 'backlog'
                ? 'bg-blue-50 text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            <div className="text-2xl">📋</div>
            <div className="text-xs font-medium mt-1">Übungen</div>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`flex-1 py-3 px-4 text-center min-h-[60px] ${
              activeTab === 'plan'
                ? 'bg-blue-50 text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            <div className="text-2xl">📅</div>
            <div className="text-xs font-medium mt-1">Trainingsplan</div>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 px-4 text-center min-h-[60px] relative ${
              activeTab === 'active'
                ? 'bg-blue-50 text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            {activeSession && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
            <div className="text-2xl">💪</div>
            <div className="text-xs font-medium mt-1">Training</div>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
