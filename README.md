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

- **React 19** mit Hooks (useState, useEffect, useContext)
- **Vite** als Build-Tool
- **Tailwind CSS v4** für responsives Design
- **Firebase** (Spark Plan) für:
  - Authentication (Email/Password & Google Sign-In)
  - Firestore Database für Cloud-Datenspeicherung
  - Echtzeit-Synchronisation zwischen Geräten

## Installation

```bash
# Dependencies installieren
npm install

# Firebase konfigurieren
# 1. Erstelle ein Firebase Projekt in der Firebase Console
# 2. Kopiere .env.example zu .env
cp .env.example .env
# 3. Füge deine Firebase Konfiguration in .env ein

# Development Server starten
npm run dev

# Für Produktion bauen
npm run build

# Code linting
npm run lint
```

## Firebase Setup

1. **Firebase Projekt erstellen**:
   - Gehe zu [Firebase Console](https://console.firebase.google.com/)
   - Erstelle ein neues Projekt
   - Wähle den Spark Plan (kostenlos)

2. **Authentication aktivieren**:
   - Gehe zu Authentication > Sign-in method
   - Aktiviere "Email/Password"
   - Aktiviere "Google" (optional)

3. **Firestore Database erstellen**:
   - Gehe zu Firestore Database
   - Erstelle eine Datenbank im Test-Modus (für Entwicklung)
   - Später: Produktions-Sicherheitsregeln einrichten

4. **Konfiguration in .env**:
   - Gehe zu Project Settings > General
   - Kopiere die Firebase SDK Configuration
   - Füge die Werte in deine `.env` Datei ein

### Firestore Sicherheitsregeln (Produktion)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/data/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Projekt-Struktur

```
src/
├── components/          # React Komponenten
│   ├── ExerciseBacklog.jsx
│   ├── TrainingPlan.jsx
│   ├── ActiveTraining.jsx
│   └── Login.jsx       # Login/Registrierung
├── contexts/           # React Contexts
│   └── AuthContext.jsx # Authentication State
├── firebase/           # Firebase Konfiguration
│   └── config.js       # Firebase Initialisierung
├── hooks/              # Custom React Hooks
│   ├── useExercises.js
│   └── useTrainingSessions.js
├── utils/              # Utility Funktionen
│   ├── storage.js      # Firebase Firestore Storage
│   └── dateUtils.js
├── App.jsx            # Haupt-App-Komponente
└── main.jsx           # Entry Point
```

## Datenpersistenz

Die App verwendet Firebase Firestore für Cloud-basierte Datenpersistenz:
- **Authentifizierte Benutzer**: Daten werden in Firestore gespeichert und über alle Geräte synchronisiert
- **Nicht authentifizierte Benutzer**: Fallback auf localStorage
- Datenstruktur:
  - `exercises` - Übungs-Backlog
  - `training-sessions` - Alle Trainings

Jeder Benutzer hat seine eigenen Daten unter `/users/{userId}/data/`.

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
