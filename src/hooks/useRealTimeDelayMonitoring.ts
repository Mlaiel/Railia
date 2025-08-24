/**
 * SmartRail-AI - KI-gestützte Lösung zur Reduzierung von Zugverspätungen
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */

import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'

export interface DelayEvent {
  id: string
  trainNumber: string
  route: string
  currentDelay: number
  predictedDelay: number
  cause: string
  severity: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
  affectedPassengers: number
  timestamp: string
  confidence: number
  notificationSent: boolean
}

export function useRealTimeDelayMonitoring() {
  const [delayEvents, setDelayEvents] = useKV<DelayEvent[]>('real-time-delays', [])
  const [isMonitoring, setIsMonitoring] = useState(false)

  // Simulate real-time delay detection
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      // Simulate random delay events
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const routes = [
          'Hamburg → München',
          'Berlin → Dresden',
          'Frankfurt → Köln',
          'Stuttgart → Mannheim',
          'Hannover → Bremen'
        ]

        const causes = [
          'Signalstörung',
          'Wetterbedingungen',
          'Technischer Defekt',
          'Personenschaden',
          'Streckensperrung',
          'Überfüllung'
        ]

        const trainNumbers = ['ICE 123', 'RE 456', 'RB 789', 'IC 321', 'S1', 'S3']

        const newEvent: DelayEvent = {
          id: Date.now().toString(),
          trainNumber: trainNumbers[Math.floor(Math.random() * trainNumbers.length)],
          route: routes[Math.floor(Math.random() * routes.length)],
          currentDelay: Math.floor(Math.random() * 5),
          predictedDelay: Math.floor(Math.random() * 25) + 5,
          cause: causes[Math.floor(Math.random() * causes.length)],
          severity: Math.random() > 0.8 ? 'hoch' : Math.random() > 0.5 ? 'mittel' : 'niedrig',
          affectedPassengers: Math.floor(Math.random() * 800) + 100,
          timestamp: new Date().toISOString(),
          confidence: Math.floor(Math.random() * 20) + 80,
          notificationSent: false
        }

        setDelayEvents(prev => [newEvent, ...prev.slice(0, 19)]) // Keep last 20 events
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [isMonitoring, setDelayEvents])

  const startMonitoring = () => setIsMonitoring(true)
  const stopMonitoring = () => setIsMonitoring(false)

  const markNotificationSent = (eventId: string) => {
    setDelayEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, notificationSent: true }
        : event
    ))
  }

  const clearEvents = () => setDelayEvents([])

  return {
    delayEvents,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    markNotificationSent,
    clearEvents
  }
}

export async function generateSmartNotificationContent(
  delayEvent: DelayEvent,
  targetAudience: 'commuters' | 'leisure' | 'business' | 'all',
  language: string = 'de'
): Promise<{
  shortMessage: string // For SMS/Push
  detailedMessage: string // For App/Email
  audioMessage: string // For announcements
  alternatives: string[] // Alternative routes/trains
}> {
  try {
    const prompt = spark.llmPrompt`
      Erstelle intelligente Fahrgastinformationen für diese Verspätung:
      
      Zug: ${delayEvent.trainNumber}
      Route: ${delayEvent.route}
      Aktuelle Verspätung: ${delayEvent.currentDelay} Min
      Vorhergesagte Verspätung: ${delayEvent.predictedDelay} Min
      Grund: ${delayEvent.cause}
      Betroffene Fahrgäste: ${delayEvent.affectedPassengers}
      Schweregrad: ${delayEvent.severity}
      Zielgruppe: ${targetAudience}
      
      Erstelle 4 Versionen:
      1. Kurznachricht (max 140 Zeichen für SMS)
      2. Detaillierte Nachricht (für App/Email)
      3. Durchsage (natürlich sprechbar)
      4. 2-3 alternative Verbindungen/Empfehlungen
      
      Ton: professionell, entschuldigend, hilfreich
      Sprache: ${language}
      
      Format als JSON:
      {
        "shortMessage": "...",
        "detailedMessage": "...",
        "audioMessage": "...",
        "alternatives": ["...", "..."]
      }
    `

    const result = await spark.llm(prompt, 'gpt-4o', true)
    return JSON.parse(result)
  } catch (error) {
    console.error('Error generating notification content:', error)
    
    // Fallback content
    return {
      shortMessage: `${delayEvent.trainNumber} verspätet sich um ${delayEvent.predictedDelay} Min. Grund: ${delayEvent.cause}`,
      detailedMessage: `Sehr geehrte Fahrgäste, der ${delayEvent.trainNumber} auf der Strecke ${delayEvent.route} verspätet sich um ${delayEvent.predictedDelay} Minuten aufgrund von ${delayEvent.cause}. Wir entschuldigen uns für die Unannehmlichkeiten.`,
      audioMessage: `Achtung, der ${delayEvent.trainNumber} nach ${delayEvent.route.split(' → ')[1]} verspätet sich um ${delayEvent.predictedDelay} Minuten.`,
      alternatives: ['Prüfen Sie alternative Verbindungen in der App', 'Nächster Zug in 30 Minuten']
    }
  }
}

export function calculateNotificationPriority(delayEvent: DelayEvent): {
  priority: number // 1-10 scale
  urgency: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
  shouldAutoSend: boolean
  recommendedChannels: string[]
} {
  let priority = 1
  
  // Delay factor (0-4 points)
  if (delayEvent.predictedDelay >= 30) priority += 4
  else if (delayEvent.predictedDelay >= 15) priority += 3
  else if (delayEvent.predictedDelay >= 10) priority += 2
  else if (delayEvent.predictedDelay >= 5) priority += 1

  // Affected passengers factor (0-3 points)
  if (delayEvent.affectedPassengers >= 500) priority += 3
  else if (delayEvent.affectedPassengers >= 200) priority += 2
  else if (delayEvent.affectedPassengers >= 100) priority += 1

  // Cause factor (0-2 points)
  const highImpactCauses = ['personenschaden', 'unfall', 'evakuierung', 'brand']
  const mediumImpactCauses = ['signalstörung', 'streckensperrung', 'technischer defekt']
  
  if (highImpactCauses.some(cause => delayEvent.cause.toLowerCase().includes(cause))) {
    priority += 2
  } else if (mediumImpactCauses.some(cause => delayEvent.cause.toLowerCase().includes(cause))) {
    priority += 1
  }

  // Confidence factor (0-1 points)
  if (delayEvent.confidence >= 90) priority += 1

  // Determine urgency and actions
  let urgency: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
  let shouldAutoSend = false
  let recommendedChannels: string[] = ['app']

  if (priority >= 8) {
    urgency = 'kritisch'
    shouldAutoSend = true
    recommendedChannels = ['app', 'display', 'audio', 'sms']
  } else if (priority >= 6) {
    urgency = 'hoch'
    shouldAutoSend = true
    recommendedChannels = ['app', 'display', 'sms']
  } else if (priority >= 4) {
    urgency = 'mittel'
    shouldAutoSend = true
    recommendedChannels = ['app', 'display']
  } else {
    urgency = 'niedrig'
    shouldAutoSend = false
    recommendedChannels = ['app']
  }

  return {
    priority: Math.min(priority, 10),
    urgency,
    shouldAutoSend,
    recommendedChannels
  }
}