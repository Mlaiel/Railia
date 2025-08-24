# SmartRail-AI Projekt-Struktur & Setup-Anleitung

**© 2024 Fahed Mlaiel - Alle Rechte vorbehalten**

## 📁 Projekt-Struktur

```
SmartRail-AI/
├── 📋 README.md                    # Hauptdokumentation (Deutsch)
├── 📋 README_EN.md                 # Internationale Dokumentation (Englisch)
├── 📄 LICENSE.md                   # Lizenzbestimmungen
├── ⚙️ .github/
│   └── workflows/
│       └── license-monitoring.yml  # Automatische Lizenzüberwachung
├── 📱 src/
│   ├── 🏠 App.tsx                  # Hauptanwendung
│   ├── 🖥️ components/
│   │   ├── 🧠 NetworkDashboard.tsx     # Netzwerk-Kontrolle
│   │   ├── 📍 RealTimeTracking.tsx     # Echtzeit-Verfolgung
│   │   ├── 🚨 EmergencyCoordination.tsx # Notfall-Koordination
│   │   ├── 🥽 VRTraining.tsx           # VR-Training System
│   │   ├── 🚪 DoorAnalytics.tsx        # Tür-Intelligenz
│   │   ├── 👁️ TrackSurveillance.tsx     # Gleis-Überwachung
│   │   ├── 🌧️ WeatherForecasting.tsx    # Wetter-Vorhersage
│   │   ├── ❤️ MedicalMonitoring.tsx    # Medizin-Überwachung
│   │   └── ⚙️ SystemSettings.tsx       # System-Einstellungen
│   ├── 🔧 hooks/                   # Custom React Hooks
│   ├── 🛠️ utils/                   # Hilfsfunktionen
│   └── 🎨 index.css               # Styling & Theming
├── 📦 package.json                # Projekt-Abhängigkeiten
└── ⚙️ vite.config.ts              # Build-Konfiguration
```

## 🔒 Lizenz & Nutzungshinweise

### ⚠️ WICHTIG: Kein Open Source
Dieses Projekt ist **NICHT Open Source**. Die öffentliche Sichtbarkeit dient nur zu Demonstrationszwecken.

### ✅ Erlaubte kostenlose Nutzung:
- 🎓 **Bildungseinrichtungen** (Universitäten, Schulen)
- 🤝 **NGOs** (Gemeinnützige Organisationen)
- 🔬 **Forschungseinrichtungen**

### ❌ Verbotene Nutzung:
- 💼 Kommerzielle Anwendungen jeder Art
- 🏢 Private Bahnunternehmen
- 💰 Verkauf oder Weiterverkauf
- 🔧 Integration in kommerzielle Produkte

### 💼 Kommerzielle Lizenzierung:
Für alle kommerziellen Anwendungen kontaktieren Sie:
**Fahed Mlaiel:** mlaiel@live.de

## 🛠️ Technische Setup-Anleitung

### Voraussetzungen
```bash
Node.js 18+
npm oder yarn
React Development Environment
TypeScript
```

### Installation (Nur für berechtigte Nutzer)
```bash
# Repository klonen
git clone [repository-url]
cd smartrail-ai

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build
```

### Umgebungsvariablen
```bash
# .env.local erstellen
VITE_API_BASE_URL=your_api_base_url
VITE_ENVIRONMENT=development
```

## 🧠 KI-Module Übersicht

### 1. 🚪 Tür-Intelligenz (DoorAnalytics)
- **Funktion:** Videoanalyse der Türbereiche
- **KI:** Computer Vision, Echtzeit-Personenerkennung
- **Ziel:** Optimale Türschließzeiten

### 2. 👁️ Gleis-Überwachung (TrackSurveillance)
- **Funktion:** Anomalieerkennung auf Gleisen
- **KI:** Anomaly Detection, Suizidprävention
- **Ziel:** Sicherheit und Unfallvermeidung

### 3. 🌧️ Wetter-Vorhersage (WeatherForecasting)
- **Funktion:** Naturkatastrophen-Prognose
- **KI:** Predictive Analytics, Satellitendaten
- **Ziel:** Proaktive Wetterrisiko-Minimierung

### 4. ❤️ Medizin-Überwachung (MedicalMonitoring)
- **Funktion:** Gesundheitsnotfälle erkennen
- **KI:** Verhaltensanalyse, Notfall-Detection
- **Ziel:** Schnelle medizinische Hilfe

### 5. 🧠 Netzwerk-Optimierung (NetworkDashboard)
- **Funktion:** Gesamtnetz-Koordination
- **KI:** Reinforcement Learning, Simulation
- **Ziel:** Minimierung von Domino-Effekten

### 6. 📍 Echtzeit-Tracking (RealTimeTracking)
- **Funktion:** Live GPS-Verfolgung
- **KI:** Route Optimization, Delay Prediction
- **Ziel:** Präzise Fahrgastinformation

### 7. 🚨 Notfall-Koordination (EmergencyCoordination)
- **Funktion:** Krisenmanagement
- **KI:** Decision Support, Resource Allocation
- **Ziel:** Schnelle Notfall-Response

### 8. 🥽 VR-Training (VRTraining)
- **Funktion:** Immersive Schulungen
- **KI:** Adaptive Learning, Real-time Coaching
- **Ziel:** Bessere Mitarbeiter-Vorbereitung

## 🔍 Überwachung & Compliance

### Automatische Lizenz-Überwachung
- **GitHub Actions** überwacht alle Repository-Aktivitäten
- **E-Mail-Benachrichtigungen** an mlaiel@live.de bei jeder Aktion
- **Compliance-Checks** für Lizenz-Header in Code-Dateien
- **Sicherheitswarnungen** bei verdächtigen Aktivitäten

### Logs & Monitoring
```bash
# Beispiel Monitoring-Log
2024-12-20 15:30:22 UTC | Code-Push | User: username | Repo: smartrail-ai | SHA: abc123
2024-12-20 15:35:15 UTC | Fork | User: company-bot | Repo: smartrail-ai | SHA: def456
```

## 🔧 Entwicklung & Beitrag

### Für Bildungspartner
- 🎓 Studentenprojekte willkommen
- 📚 Forschungskooperationen möglich
- 📖 Abschlussarbeiten unterstützt

### Code-Standards
- **TypeScript** für alle neuen Dateien
- **Lizenz-Header** in jeder Datei verpflichtend
- **Deutsche Kommentare** für Dokumentation
- **Englische Variablen/Funktionen** für Code

### Lizenz-Header Template
```typescript
/**
 * SmartRail-AI - [Komponenten-Beschreibung]
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */
```

## 📞 Kontakt & Support

### Projekt-Owner
**Fahed Mlaiel**
- **E-Mail:** mlaiel@live.de
- **Projekt:** SmartRail-AI
- **Spezialisierung:** KI, Bahntechnik, Gesellschaftlicher Nutzen

### Support-Kanäle
- **Lizenzfragen:** mlaiel@live.de
- **Technische Probleme:** GitHub Issues (für berechtigte Nutzer)
- **Kooperationsanfragen:** mlaiel@live.de
- **Forschungspartnerschaften:** mlaiel@live.de

### Antwortzeiten
- **Lizenzanfragen:** 24-48 Stunden
- **Bildungskooperationen:** 2-5 Werktage
- **Kommerzielle Anfragen:** 1-3 Werktage

---

**© 2024 SmartRail-AI by Fahed Mlaiel**  
*KI für eine bessere, pünktlichere und sicherere Bahnzukunft*