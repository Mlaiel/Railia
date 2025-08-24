# SmartRail-AI Überwachung & Benachrichtigung - Setup Guide

**© 2024 Fahed Mlaiel - Lizenz-Überwachungssystem**

## 🎯 Zweck der Überwachung

Dieses System stellt sicher, dass:
- 📧 **Fahed Mlaiel automatisch über jede Repository-Aktivität informiert wird**
- 🔒 **Lizenz-Compliance überwacht wird**
- ⚠️ **Verdächtige kommerzielle Nutzung erkannt wird**
- 📊 **Nutzungsstatistiken dokumentiert werden**

## ⚙️ GitHub Actions Setup

### 1. Workflow-Konfiguration

Die Datei `.github/workflows/license-monitoring.yml` überwacht:

```yaml
on:
  push:                # Code-Änderungen
  pull_request:        # Pull Requests
  fork:               # Repository-Forks
  watch:              # Repository-Stars
```

### 2. Erforderliche GitHub Secrets

Für E-Mail-Versand konfigurieren Sie folgende Secrets in GitHub:

```bash
SMARTRAIL_SMTP_USER=your-email@gmail.com
SMARTRAIL_SMTP_PASSWORD=your-app-password
```

**Setup-Schritte:**
1. GitHub Repository → Settings → Secrets and variables → Actions
2. "New repository secret" klicken
3. Secrets hinzufügen:
   - `SMARTRAIL_SMTP_USER`: Gmail-Adresse für Versand
   - `SMARTRAIL_SMTP_PASSWORD`: Gmail App-Passwort

### 3. Gmail App-Passwort erstellen

1. **Google Account** → Sicherheit
2. **2-Faktor-Authentifizierung** aktivieren
3. **App-Passwörter** → "App-Passwort generieren"
4. **Name:** "SmartRail-AI Monitoring"
5. **Passwort kopieren** und als `SMARTRAIL_SMTP_PASSWORD` speichern

## 📧 E-Mail-Benachrichtigungen

### Automatische Benachrichtigungen bei:

#### 1. 📤 Code-Push
```
Betreff: 🚂 SmartRail-AI Lizenzüberwachung - Code-Push
Inhalt: Benutzer [username] hat Code ins Repository gepusht
```

#### 2. 🔀 Pull Request
```
Betreff: 🚂 SmartRail-AI Lizenzüberwachung - Pull Request
Inhalt: Pull Request wurde erstellt oder aktualisiert
```

#### 3. 🍴 Repository Fork
```
Betreff: 🚂 SmartRail-AI Lizenzüberwachung - Repository Fork
Inhalt: Repository wurde geforkt - Lizenz-Compliance prüfen
```

#### 4. ⭐ Repository Star
```
Betreff: 🚂 SmartRail-AI Lizenzüberwachung - Repository Star
Inhalt: Repository wurde mit Stern markiert
```

### E-Mail-Inhalt Template

Jede E-Mail enthält:
- **Aktivitäts-Details** (Benutzer, Zeit, Repository)
- **Lizenz-Erinnerung** (Non-Open-Source-Status)
- **Compliance-Hinweise** (Attribution-Pflicht)
- **Kontakt-Informationen** für Lizenz-Anfragen

## 🚨 Sicherheitswarnungen

### Verdächtige Aktivitäten

Das System erkennt automatisch:

```bash
# Bot-Aktivitäten
if [[ "${{ github.actor }}" == *"bot"* ]]

# Häufige Forks von Firmen-Accounts
if [[ "${{ github.event_name }}" == "fork" ]]

# Ungewöhnliche Push-Muster
if [[ frequent_pushes_detected ]]
```

### Erweiterte Sicherheits-E-Mail

Bei verdächtigen Aktivitäten:
```
Betreff: 🚨 SmartRail-AI SICHERHEITSWARNUNG - Verdächtige Aktivität
Inhalt: Detaillierte Analyse der Aktivität mit Handlungsempfehlungen
```

## 📊 Monitoring Dashboard

### Log-Format
```
Zeitstempel | Aktivitätstyp | Benutzer | Repository | Commit-SHA
2024-12-20 15:30:22 UTC | Code-Push | username | smartrail-ai | abc123def
```

### Metriken-Erfassung
- **Tägliche Aktivitäten** pro Repository
- **Benutzer-Aktivitäten** nach Typ
- **Fork-Statistiken** (potenzielle kommerzielle Nutzung)
- **Lizenz-Compliance-Rate**

## 🔍 Lizenz-Compliance-Prüfung

### Automatische Code-Prüfung

Das System überprüft:

```bash
# Lizenz-Header in Code-Dateien
find src -name "*.tsx" -o -name "*.ts" | while read file; do
  if ! grep -q "SmartRail-AI.*Fahed Mlaiel" "$file"; then
    echo "❌ Fehlender Lizenz-Header: $file"
  fi
done
```

### README Lizenz-Prüfung

```bash
# Attribution-Prüfung
if ! grep -q "Fahed Mlaiel" README.md; then
  echo "❌ Fehlende Attribution in README"
fi

# Non-Open-Source-Warnung
if ! grep -q "NICHT Open Source" README.md; then
  echo "❌ Fehlende Non-OS-Warnung"
fi
```

## 🛠️ Erweiterte Monitoring-Features

### 1. Webhook-Integration (Optional)

```javascript
// Webhook für externe Monitoring-Systeme
const webhook_url = "https://monitoring.smartrail-ai.com/webhook"

fetch(webhook_url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'repository_activity',
    user: github.actor,
    timestamp: new Date().toISOString(),
    repository: github.repository
  })
})
```

### 2. Slack-Integration (Optional)

```yaml
- name: Slack-Benachrichtigung
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        text: "🚂 SmartRail-AI: Neue Aktivität von ${{ github.actor }}",
        attachments: [{
          color: 'warning',
          fields: [{
            title: 'Repository',
            value: '${{ github.repository }}',
            short: true
          }]
        }]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 3. Database Logging (Enterprise)

```sql
-- Aktivitäts-Log Tabelle
CREATE TABLE smartrail_activity_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_type VARCHAR(50) NOT NULL,
    github_user VARCHAR(100) NOT NULL,
    repository VARCHAR(200) NOT NULL,
    commit_sha VARCHAR(40),
    ip_address INET,
    user_agent TEXT,
    suspicious BOOLEAN DEFAULT FALSE
);
```

## 📋 Monitoring-Checkliste

### Tägliche Überprüfung
- [ ] E-Mail-Benachrichtigungen erhalten
- [ ] Aktivitäts-Logs überprüfen
- [ ] Verdächtige Nutzer-Profile analysieren
- [ ] Fork-Aktivitäten bewerten

### Wöchentliche Überprüfung
- [ ] Lizenz-Compliance-Rate bewerten
- [ ] Neue kommerzielle Anfragen bearbeiten
- [ ] Monitoring-System-Gesundheit prüfen
- [ ] Backup der Logs erstellen

### Monatliche Überprüfung
- [ ] Aktivitäts-Trends analysieren
- [ ] Monitoring-Verbesserungen implementieren
- [ ] Lizenz-Verletzungen rechtlich bewerten
- [ ] System-Performance optimieren

## 🔧 Troubleshooting

### Häufige Probleme

#### 1. E-Mails kommen nicht an
```bash
# Prüfen: Gmail App-Passwort korrekt?
# Prüfen: GitHub Secrets gesetzt?
# Prüfen: Gmail 2FA aktiviert?
```

#### 2. Workflow schlägt fehl
```bash
# GitHub Actions Logs prüfen
# SMTP-Konfiguration validieren
# Berechtigungen überprüfen
```

#### 3. Falsche Lizenz-Header-Erkennung
```bash
# Regex-Pattern in Workflow anpassen
# Header-Template in Dateien korrigieren
# Ausnahmen für bestimmte Dateien definieren
```

## 📞 Support & Wartung

### Kontakt für technische Probleme
- **E-Mail:** mlaiel@live.de
- **Betreff:** "SmartRail-AI Monitoring - [Problem]"

### Wartungsplan
- **Wöchentlich:** System-Health-Check
- **Monatlich:** Security-Updates
- **Quartalsweise:** Feature-Verbesserungen

---

**© 2024 SmartRail-AI Monitoring System by Fahed Mlaiel**  
*Automatische Lizenz- und Compliance-Überwachung für geistiges Eigentum*