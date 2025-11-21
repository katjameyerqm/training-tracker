# Training Tracker 🏋️

Eine React-basierte Trainingsplanungs-Anwendung für effektives Workout-Management.

🌐 **Live Demo:** [https://katjameyerqm.github.io/training-tracker/](https://katjameyerqm.github.io/training-tracker/)

## Features

### Übungs-Backlog 📋
- Übungen erstellen, bearbeiten und löschen
- Muskelgruppen zuweisen (Brust, Rücken, Beine, Schultern, Arme, Bauch, Ganzkörper)
- Equipment auswählen (Körpergewicht, Kurzhanteln, Langhanteln, Resistance Band, etc.)
- Suchfunktion nach Übungsname oder Muskelgruppe
- Notizen zu Übungen hinzufügen

### Trainingsplanung 📅
- Wochenkalender-Ansicht
- Trainings für bestimmte Daten erstellen
- Übungen aus dem Backlog hinzufügen
- Anzahl der Sätze und Ziel-Wiederholungen pro Übung definieren
- Trainings bearbeiten und löschen
- Status-Übersicht (Geplant, Läuft, Abgeschlossen)

### Training durchführen 💪
- Training starten und Fortschritt verfolgen
- Tatsächliche Wiederholungen pro Satz eintragen
- Gewicht optional dokumentieren
- Equipment-Notizen pro Satz
- Sätze als abgeschlossen markieren
- Notizen zum gesamten Training
- Visueller Fortschrittsbalken

## Technischer Stack

- **React 19** mit Hooks (useState, useEffect)
- **Vite** als Build-Tool
- **Tailwind CSS v4** für responsives Design
- **LocalStorage** für Datenpersistenz (mit window.storage API Mock)

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Für Produktion bauen
npm run build

# Code linting
npm run lint
```

## Projekt-Struktur

```
src/
├── components/          # React Komponenten
│   ├── ExerciseBacklog.jsx
│   ├── TrainingPlan.jsx
│   └── ActiveTraining.jsx
├── hooks/              # Custom React Hooks
│   ├── useExercises.js
│   └── useTrainingSessions.js
├── utils/              # Utility Funktionen
│   ├── storage.js
│   └── dateUtils.js
├── App.jsx            # Haupt-App-Komponente
└── main.jsx           # Entry Point
```

## Datenpersistenz

Die App verwendet einen Mock der `window.storage` API, der auf `localStorage` aufbaut:
- `exercises` - Übungs-Backlog
- `training-sessions` - Alle Trainings

Daten bleiben auch nach Browser-Neustart erhalten.

## Mobile-First Design

- Responsive Layout optimiert für Smartphones
- Touch-freundliche Buttons (mindestens 44x44px)
- Bottom Navigation für einfache Bedienung
- Große, klare UI-Elemente

## Browser-Kompatibilität

Moderne Browser mit ES6+ Support:
- Chrome/Edge (aktuell)
- Firefox (aktuell)
- Safari (aktuell)
