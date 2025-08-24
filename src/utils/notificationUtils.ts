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

export interface DelayNotificationSettings {
  minDelayThreshold: number
  maxDelayThreshold: number
  channels: string[]
  languages: string[]
  personalizedMessages: boolean
  weatherIntegration: boolean
  eventAwareness: boolean
}

export interface NotificationChannel {
  id: string
  name: string
  deliveryRate: number
  responseRate: number
  costPerMessage: number
  maxRecipients: number
}

export interface PassengerSegment {
  id: string
  name: string
  criteria: {
    routePatterns: string[]
    timePreferences: string[]
    notificationPreferences: string[]
  }
  size: number
}

export const notificationChannels: NotificationChannel[] = [
  {
    id: 'app',
    name: 'Mobile App',
    deliveryRate: 98.5,
    responseRate: 45.2,
    costPerMessage: 0.02,
    maxRecipients: 50000
  },
  {
    id: 'display',
    name: 'Bahnhof-Anzeigen',
    deliveryRate: 100,
    responseRate: 12.8,
    costPerMessage: 0.01,
    maxRecipients: 100000
  },
  {
    id: 'audio',
    name: 'Durchsagen',
    deliveryRate: 95.0,
    responseRate: 8.5,
    costPerMessage: 0.15,
    maxRecipients: 25000
  },
  {
    id: 'sms',
    name: 'SMS',
    deliveryRate: 99.2,
    responseRate: 23.7,
    costPerMessage: 0.05,
    maxRecipients: 10000
  },
  {
    id: 'email',
    name: 'E-Mail',
    deliveryRate: 97.8,
    responseRate: 18.3,
    costPerMessage: 0.01,
    maxRecipients: 75000
  },
  // Social Media Kanäle
  {
    id: 'twitter',
    name: 'Twitter/X',
    deliveryRate: 99.5,
    responseRate: 15.2,
    costPerMessage: 0.001,
    maxRecipients: 200000
  },
  {
    id: 'facebook',
    name: 'Facebook',
    deliveryRate: 96.8,
    responseRate: 12.5,
    costPerMessage: 0.002,
    maxRecipients: 150000
  },
  {
    id: 'telegram',
    name: 'Telegram',
    deliveryRate: 99.8,
    responseRate: 28.4,
    costPerMessage: 0.001,
    maxRecipients: 75000
  },
  {
    id: 'instagram',
    name: 'Instagram',
    deliveryRate: 94.2,
    responseRate: 18.7,
    costPerMessage: 0.003,
    maxRecipients: 100000
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    deliveryRate: 99.9,
    responseRate: 42.8,
    costPerMessage: 0.04,
    maxRecipients: 50000
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    deliveryRate: 97.2,
    responseRate: 8.9,
    costPerMessage: 0.008,
    maxRecipients: 25000
  }
]

export const defaultPassengerSegments: PassengerSegment[] = [
  {
    id: 'commuters',
    name: 'Berufspendler',
    criteria: {
      routePatterns: ['Stadtverkehr', 'Regionalverkehr'],
      timePreferences: ['06:00-09:00', '17:00-20:00'],
      notificationPreferences: ['app', 'sms', 'telegram']
    },
    size: 45000
  },
  {
    id: 'leisure',
    name: 'Freizeitreisende',
    criteria: {
      routePatterns: ['Fernverkehr', 'Regionalverkehr'],
      timePreferences: ['10:00-16:00', 'Wochenende'],
      notificationPreferences: ['app', 'display', 'twitter', 'instagram']
    },
    size: 28000
  },
  {
    id: 'business',
    name: 'Geschäftsreisende',
    criteria: {
      routePatterns: ['Fernverkehr', 'ICE'],
      timePreferences: ['ganztägig'],
      notificationPreferences: ['app', 'sms', 'email', 'linkedin']
    },
    size: 12000
  },
  {
    id: 'students',
    name: 'Studierende',
    criteria: {
      routePatterns: ['Regionalverkehr', 'Stadtverkehr'],
      timePreferences: ['07:00-18:00'],
      notificationPreferences: ['telegram', 'instagram', 'whatsapp']
    },
    size: 18000
  },
  {
    id: 'seniors',
    name: 'Senioren',
    criteria: {
      routePatterns: ['Regionalverkehr', 'Stadtverkehr'],
      timePreferences: ['09:00-16:00'],
      notificationPreferences: ['sms', 'email', 'facebook']
    },
    size: 15000
  }
]

export async function generatePersonalizedNotification(
  delayInfo: {
    trainNumber: string
    route: string
    currentDelay: number
    predictedDelay: number
    cause: string
    affectedStations: string[]
  },
  passengerSegment: string,
  language: string = 'de',
  includeAlternatives: boolean = true
): Promise<string> {
  try {
    const prompt = spark.llmPrompt`
      Erstelle eine personalisierte deutsche Fahrgastinformation für ${passengerSegment}:
      
      Zugdaten:
      - Zug: ${delayInfo.trainNumber}
      - Route: ${delayInfo.route}
      - Aktuelle Verspätung: ${delayInfo.currentDelay} Minuten
      - Vorhergesagte Verspätung: ${delayInfo.predictedDelay} Minuten
      - Grund: ${delayInfo.cause}
      - Betroffene Stationen: ${delayInfo.affectedStations.join(', ')}
      
      Zielgruppe: ${passengerSegment}
      Sprache: ${language}
      Alternative Verbindungen einbeziehen: ${includeAlternatives ? 'Ja' : 'Nein'}
      
      Die Nachricht soll:
      - Höflich und professionell sein
      - Spezifisch für die Zielgruppe formuliert werden
      - Entschuldigung enthalten
      - Konkrete Informationen liefern
      - Bei größeren Verspätungen Alternativen vorschlagen
      - Maximal 160 Zeichen für SMS, länger für andere Kanäle
      
      Format: Nur die Nachricht, ohne Anführungszeichen oder Erklärungen.
    `

    return await spark.llm(prompt)
  } catch (error) {
    console.error('Fehler bei der Nachrichtengenerierung:', error)
    return `Verspätung ${delayInfo.trainNumber}: +${delayInfo.predictedDelay} Min. Grund: ${delayInfo.cause}. Entschuldigung für die Unannehmlichkeiten.`
  }
}

export async function analyzeNotificationEffectiveness(
  notificationHistory: Array<{
    id: string
    message: string
    channels: string[]
    recipients: number
    responses: number
    timestamp: string
    delayMinutes: number
    cause: string
  }>
): Promise<{
  overallEffectiveness: number
  channelPerformance: Record<string, number>
  messageTypePerformance: Record<string, number>
  recommendations: string[]
}> {
  try {
    const dataString = JSON.stringify(notificationHistory.slice(0, 20), null, 2)
    
    const prompt = spark.llmPrompt`
      Analysiere die Wirksamkeit dieser Fahrgast-Benachrichtigungen:
      
      ${dataString}
      
      Berechne:
      1. Gesamtwirksamkeit (0-100%)
      2. Leistung nach Kanälen
      3. Leistung nach Nachrichtentypen
      4. Empfehlungen zur Verbesserung
      
      Antworte in folgendem JSON-Format:
      {
        "overallEffectiveness": 85.5,
        "channelPerformance": {
          "app": 87.2,
          "sms": 78.9,
          "display": 45.3
        },
        "messageTypePerformance": {
          "verspätung": 82.1,
          "störung": 91.5,
          "info": 65.8
        },
        "recommendations": [
          "Konkrete Empfehlung 1",
          "Konkrete Empfehlung 2",
          "Konkrete Empfehlung 3"
        ]
      }
    `

    const result = await spark.llm(prompt, 'gpt-4o', true)
    return JSON.parse(result)
  } catch (error) {
    console.error('Fehler bei der Analyse:', error)
    return {
      overallEffectiveness: 75.0,
      channelPerformance: { app: 80, sms: 75, display: 60 },
      messageTypePerformance: { verspätung: 78, störung: 85, info: 65 },
      recommendations: [
        'Nachrichten kürzer und prägnanter formulieren',
        'Mehr personalisierte Inhalte verwenden',
        'Alternative Verbindungen proaktiv vorschlagen'
      ]
    }
  }
}

export function calculateOptimalChannelMix(
  targetAudience: number,
  urgency: 'niedrig' | 'mittel' | 'hoch' | 'kritisch',
  budget: number
): {
  channels: Array<{
    id: string
    percentage: number
    estimatedRecipients: number
    estimatedCost: number
  }>
  totalCost: number
  totalReach: number
  expectedEffectiveness: number
} {
  const urgencyWeights = {
    niedrig: { speed: 0.3, cost: 0.7, reach: 0.5 },
    mittel: { speed: 0.5, cost: 0.4, reach: 0.6 },
    hoch: { speed: 0.7, cost: 0.3, reach: 0.8 },
    kritisch: { speed: 0.9, cost: 0.1, reach: 1.0 }
  }

  const weights = urgencyWeights[urgency]
  
  // Calculate channel scores based on urgency
  const channelScores = notificationChannels.map(channel => {
    const speedScore = channel.deliveryRate / 100
    const costScore = 1 - (channel.costPerMessage / 0.15) // Normalize against max cost
    const reachScore = Math.min(channel.maxRecipients / targetAudience, 1)
    
    const totalScore = 
      speedScore * weights.speed + 
      costScore * weights.cost + 
      reachScore * weights.reach
    
    return { ...channel, score: totalScore }
  })

  // Sort by score and allocate based on budget and capacity
  channelScores.sort((a, b) => b.score - a.score)
  
  const allocation = []
  let remainingAudience = targetAudience
  let remainingBudget = budget
  
  for (const channel of channelScores) {
    if (remainingAudience <= 0 || remainingBudget <= 0) break
    
    const maxByCapacity = Math.min(channel.maxRecipients, remainingAudience)
    const maxByBudget = Math.floor(remainingBudget / channel.costPerMessage)
    const allocated = Math.min(maxByCapacity, maxByBudget)
    
    if (allocated > 0) {
      const percentage = (allocated / targetAudience) * 100
      const cost = allocated * channel.costPerMessage
      
      allocation.push({
        id: channel.id,
        percentage: Math.round(percentage * 10) / 10,
        estimatedRecipients: allocated,
        estimatedCost: Math.round(cost * 100) / 100
      })
      
      remainingAudience -= allocated
      remainingBudget -= cost
    }
  }

  const totalCost = allocation.reduce((sum, ch) => sum + ch.estimatedCost, 0)
  const totalReach = allocation.reduce((sum, ch) => sum + ch.estimatedRecipients, 0)
  const avgResponseRate = allocation.reduce((sum, ch) => {
    const channel = notificationChannels.find(nc => nc.id === ch.id)!
    return sum + (channel.responseRate * ch.estimatedRecipients)
  }, 0) / totalReach

  return {
    channels: allocation,
    totalCost,
    totalReach,
    expectedEffectiveness: avgResponseRate
  }
}

export function formatNotificationForChannel(
  message: string,
  channelId: string,
  includeUrgencyIndicator: boolean = false
): string {
  switch (channelId) {
    case 'sms':
      // SMS: Limit to 160 characters
      let smsMessage = message.substring(0, 155)
      if (includeUrgencyIndicator) {
        smsMessage = '🚨 ' + smsMessage.substring(0, 152)
      }
      return smsMessage + (message.length > 155 ? '...' : '')
    
    case 'display':
      // Display: All caps, shorter format
      return message.toUpperCase().substring(0, 100)
    
    case 'audio':
      // Audio: Add pronunciation guide and pacing
      return message
        .replace(/ICE/g, 'I-C-E')
        .replace(/RE/g, 'R-E')
        .replace(/\d+/g, (match) => match.split('').join('-'))
    
    case 'twitter':
      // Twitter: Limit to 280 characters, add hashtags
      let twitterMessage = message.substring(0, 250)
      if (includeUrgencyIndicator) {
        twitterMessage = '🚨 ' + twitterMessage
      }
      return twitterMessage + ' #BahnInfo #SmartRail'
    
    case 'facebook':
      // Facebook: Full message with engaging format
      if (includeUrgencyIndicator) {
        return `🚨 WICHTIGE INFORMATION 🚨\n\n${message}\n\n#BahnInfo #ÖPNVUpdate`
      }
      return `${message}\n\n#BahnInfo #SmartRail`
    
    case 'telegram':
      // Telegram: Rich formatting with emojis
      if (includeUrgencyIndicator) {
        return `🚨 <b>WICHTIG</b> 🚨\n\n${message}\n\n#BahnInfo #Verspätung`
      }
      return `🚆 ${message}\n\n#BahnInfo`
    
    case 'instagram':
      // Instagram: Story-friendly with hashtags
      return message + '\n\n#BahnInfo #SmartRail #ÖPNVUpdate #Reisen'
    
    case 'whatsapp':
      // WhatsApp: Personal, direct tone
      if (includeUrgencyIndicator) {
        return `🚨 *WICHTIGE MITTEILUNG* 🚨\n\n${message}`
      }
      return `🚆 ${message}`
    
    case 'linkedin':
      // LinkedIn: Professional tone
      return `Verkehrsinformation: ${message}\n\n#ÖffentlicherVerkehr #SmartRail #Mobilität`
    
    case 'app':
    case 'email':
    default:
      // App/Email: Full message with potential for rich formatting
      return message
  }
}

export function detectEmergencyKeywords(message: string): {
  isEmergency: boolean
  keywords: string[]
  suggestedPriority: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
} {
  const emergencyKeywords = {
    kritisch: ['notfall', 'evakuierung', 'unfall', 'brand', 'gefahr', 'sofort'],
    hoch: ['störung', 'ausfall', 'problem', 'verzögerung', 'einstellung'],
    mittel: ['verspätung', 'umleitung', 'änderung', 'information'],
    niedrig: ['hinweis', 'service', 'wartung', 'planmäßig']
  }

  const lowerMessage = message.toLowerCase()
  const foundKeywords: string[] = []
  let suggestedPriority: 'niedrig' | 'mittel' | 'hoch' | 'kritisch' = 'niedrig'

  for (const [priority, keywords] of Object.entries(emergencyKeywords)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        foundKeywords.push(keyword)
        if (priority === 'kritisch' || 
           (priority === 'hoch' && suggestedPriority !== 'kritisch') ||
           (priority === 'mittel' && !['kritisch', 'hoch'].includes(suggestedPriority))) {
          suggestedPriority = priority as any
        }
      }
    }
  }

  return {
    isEmergency: foundKeywords.length > 0 && ['hoch', 'kritisch'].includes(suggestedPriority),
    keywords: foundKeywords,
    suggestedPriority
  }
}