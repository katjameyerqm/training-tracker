import { useState } from 'react';

export default function ExerciseBacklog({ exercises, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    muscleGroups: [],
    equipment: '',
    notes: ''
  });

  const muscleGroupOptions = ['Brust', 'Rücken', 'Beine', 'Schultern', 'Arme', 'Bauch', 'Ganzkörper'];
  const equipmentOptions = ['Körpergewicht', 'Kurzhanteln', 'Langhanteln', 'Resistance Band', 'Kettlebell', 'Maschine'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await onEdit(editingId, formData);
      } else {
        await onAdd(formData);
      }
      resetForm();
    } catch (error) {
      alert('Fehler beim Speichern: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', muscleGroups: [], equipment: '', notes: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (exercise) => {
    setFormData({
      name: exercise.name,
      muscleGroups: exercise.muscleGroups || [],
      equipment: exercise.equipment || '',
      notes: exercise.notes || ''
    });
    setEditingId(exercise.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Übung wirklich löschen?')) {
      try {
        await onDelete(id);
      } catch (error) {
        alert('Fehler beim Löschen: ' + error.message);
      }
    }
  };

  const toggleMuscleGroup = (group) => {
    setFormData(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(group)
        ? prev.muscleGroups.filter(g => g !== group)
        : [...prev.muscleGroups, group]
    }));
  };

  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.muscleGroups?.some(mg => mg.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Übung oder Muskelgruppe suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full mb-4 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-blue-700 active:bg-blue-800 min-h-[44px]"
        >
          {showForm ? 'Abbrechen' : '+ Neue Übung'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">
              {editingId ? 'Übung bearbeiten' : 'Neue Übung'}
            </h3>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Muskelgruppen *</label>
              <div className="flex flex-wrap gap-2">
                {muscleGroupOptions.map(group => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => toggleMuscleGroup(group)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium min-h-[44px] ${
                      formData.muscleGroups.includes(group)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Equipment</label>
              <select
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Auswählen...</option>
                {equipmentOptions.map(eq => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Notizen</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!formData.name || formData.muscleGroups.length === 0}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed min-h-[44px]"
              >
                {editingId ? 'Speichern' : 'Hinzufügen'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 min-h-[44px]"
              >
                Abbrechen
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Keine Übungen gefunden' : 'Noch keine Übungen vorhanden'}
            </div>
          ) : (
            filteredExercises.map(exercise => (
              <div key={exercise.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{exercise.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(exercise)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 min-h-[44px] min-w-[44px]"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(exercise.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 min-h-[44px] min-w-[44px]"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {exercise.muscleGroups?.map(group => (
                    <span key={group} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {group}
                    </span>
                  ))}
                </div>
                {exercise.equipment && (
                  <p className="text-sm text-gray-600">🏋️ {exercise.equipment}</p>
                )}
                {exercise.notes && (
                  <p className="text-sm text-gray-600 mt-2">{exercise.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
