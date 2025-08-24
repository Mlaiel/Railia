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

export interface SocialMediaMetrics {
  platform: string
  followers: number
  engagement: number
  reach: number
  clicks: number
  shares: number
  comments: number
  impressions: number
  cost: number
}

export interface HashtagAnalysis {
  tag: string
  frequency: number
  engagement: number
  reach: number
  sentiment: 'positive' | 'neutral' | 'negative'
  trendingScore: number
}

export interface SocialMediaStrategy {
  platform: string
  optimalPostTime: string[]
  recommendedHashtags: string[]
  contentFormat: string
  audienceSize: number
  expectedEngagement: number
}

// Platform-specific character limits and best practices
export const platformLimits = {
  twitter: {
    maxChars: 280,
    optimalChars: 250,
    maxHashtags: 2,
    bestTimes: ['08:00', '12:00', '17:00', '19:00']
  },
  facebook: {
    maxChars: 63206,
    optimalChars: 400,
    maxHashtags: 5,
    bestTimes: ['09:00', '13:00', '15:00']
  },
  instagram: {
    maxChars: 2200,
    optimalChars: 150,
    maxHashtags: 10,
    bestTimes: ['11:00', '14:00', '17:00', '20:00']
  },
  telegram: {
    maxChars: 4096,
    optimalChars: 500,
    maxHashtags: 3,
    bestTimes: ['08:00', '12:00', '18:00', '20:00']
  },
  linkedin: {
    maxChars: 3000,
    optimalChars: 600,
    maxHashtags: 5,
    bestTimes: ['08:00', '12:00', '17:00']
  },
  whatsapp: {
    maxChars: 4096,
    optimalChars: 300,
    maxHashtags: 0,
    bestTimes: ['09:00', '13:00', '18:00', '21:00']
  }
}

// Railway-specific hashtag recommendations
export const railwayHashtags = {
  general: ['#BahnInfo', '#SmartRail', '#ÖPNVUpdate', '#Zugverkehr'],
  delay: ['#Zugverspätung', '#Störung', '#Verkehrsinfo', '#Reiseinfo'],
  emergency: ['#Notfall', '#Sicherheit', '#Evakuierung', '#Wichtig'],
  weather: ['#Unwetter', '#Wetterlage', '#Sicherheit', '#Vorsicht'],
  maintenance: ['#Wartung', '#Bauarbeiten', '#Umleitung', '#Planung'],
  positive: ['#Pünktlich', '#Service', '#Komfort', '#Digitalisierung']
}

export async function generateSocialMediaContent(
  trainInfo: {
    trainNumber?: string
    route?: string
    delay?: number
    cause?: string
    severity?: string
  },
  platform: string,
  urgency: 'normal' | 'urgent' | 'critical' = 'normal',
  includeMedia: boolean = false
): Promise<{
  content: string
  hashtags: string[]
  mentions: string[]
  mediaType?: 'image' | 'video' | 'gif'
  estimatedReach: number
  expectedEngagement: number
}> {
  try {
    const limits = platformLimits[platform as keyof typeof platformLimits] || platformLimits.twitter
    const urgencyEmoji = urgency === 'critical' ? '🚨' : urgency === 'urgent' ? '⚠️' : '🚆'
    
    const prompt = spark.llmPrompt`
      Erstelle einen ${platform} Post für deutsche Bahnkunden:
      
      Informationen:
      - Zug: ${trainInfo.trainNumber || 'Mehrere Züge'}
      - Route: ${trainInfo.route || 'Verschiedene Strecken'}
      - Verspätung: ${trainInfo.delay || 0} Minuten
      - Ursache: ${trainInfo.cause || 'Betriebsstörung'}
      - Dringlichkeit: ${urgency}
      - Plattform: ${platform}
      
      Anforderungen:
      - Maximal ${limits.optimalChars} Zeichen
      - Höflich und professionell
      - Plattform-spezifischer Ton
      - Bei Verspätungen: Entschuldigung und alternative Lösungen
      - Emoji sparsam verwenden: ${urgencyEmoji}
      
      Antworte nur mit dem Post-Text, ohne Hashtags oder Erklärungen.
    `
    
    const content = await spark.llm(prompt)
    
    // Select appropriate hashtags based on content and urgency
    let hashtags: string[] = []
    if (urgency === 'critical') {
      hashtags = [...railwayHashtags.emergency, ...railwayHashtags.general].slice(0, limits.maxHashtags)
    } else if (trainInfo.delay && trainInfo.delay > 0) {
      hashtags = [...railwayHashtags.delay, ...railwayHashtags.general].slice(0, limits.maxHashtags)
    } else {
      hashtags = railwayHashtags.general.slice(0, limits.maxHashtags)
    }
    
    // Platform-specific engagement estimation
    const baseEngagement = {
      twitter: 1.5,
      facebook: 0.8,
      instagram: 3.2,
      telegram: 4.5,
      linkedin: 0.6,
      whatsapp: 8.2
    }[platform] || 1.0
    
    const urgencyMultiplier = urgency === 'critical' ? 2.5 : urgency === 'urgent' ? 1.8 : 1.0
    const expectedEngagement = baseEngagement * urgencyMultiplier
    
    return {
      content: content.trim(),
      hashtags,
      mentions: [], // Could be expanded to mention relevant accounts
      mediaType: includeMedia ? (urgency === 'critical' ? 'video' : 'image') : undefined,
      estimatedReach: Math.floor(Math.random() * 5000) + 1000,
      expectedEngagement: Math.round(expectedEngagement * 100) / 100
    }
  } catch (error) {
    console.error('Fehler bei Social Media Content-Generierung:', error)
    return {
      content: `${urgency === 'critical' ? '🚨' : '🚆'} Verkehrsinformation: ${trainInfo.trainNumber || 'Züge'} ${trainInfo.delay ? `+${trainInfo.delay} Min` : 'Störung'}. Grund: ${trainInfo.cause || 'Betriebsstörung'}. Entschuldigung!`,
      hashtags: railwayHashtags.general.slice(0, 2),
      mentions: [],
      estimatedReach: 1000,
      expectedEngagement: 1.5
    }
  }
}

export async function analyzeSocialMediaPerformance(
  posts: Array<{
    platform: string
    content: string
    timestamp: string
    metrics: {
      views: number
      likes: number
      shares: number
      comments: number
      clicks: number
      reach: number
    }
  }>
): Promise<{
  overallPerformance: number
  platformPerformance: Record<string, number>
  bestPerformingContent: string[]
  recommendations: string[]
  optimalPostTimes: Record<string, string[]>
}> {
  try {
    const dataString = JSON.stringify(posts.slice(0, 20), null, 2)
    
    const prompt = spark.llmPrompt`
      Analysiere die Performance dieser Social Media Posts für Bahnkommunikation:
      
      ${dataString}
      
      Bewerte:
      1. Gesamtleistung (0-100%)
      2. Leistung nach Plattformen
      3. Beste Content-Arten
      4. Konkrete Verbesserungsempfehlungen
      5. Optimale Posting-Zeiten
      
      Antworte in folgendem JSON-Format:
      {
        "overallPerformance": 78.5,
        "platformPerformance": {
          "twitter": 82.1,
          "telegram": 89.3,
          "facebook": 65.7
        },
        "bestPerformingContent": [
          "Verspätungsinfo mit Alternativen",
          "Kurze, prägnante Updates",
          "Proaktive Wetterinfos"
        ],
        "recommendations": [
          "Mehr visuelle Inhalte verwenden",
          "Hashtags optimieren",
          "Posting-Zeiten anpassen"
        ],
        "optimalPostTimes": {
          "twitter": ["08:00", "12:00", "17:00"],
          "telegram": ["07:30", "12:30", "18:00"]
        }
      }
    `
    
    const result = await spark.llm(prompt, 'gpt-4o', true)
    return JSON.parse(result)
  } catch (error) {
    console.error('Fehler bei Social Media Performance-Analyse:', error)
    return {
      overallPerformance: 75.0,
      platformPerformance: { twitter: 78, telegram: 82, facebook: 68 },
      bestPerformingContent: [
        'Kurze Verspätungsinfos mit Grund',
        'Proaktive Wetterwarnungen',
        'Alternative Verbindungen'
      ],
      recommendations: [
        'Mehr Emojis für bessere Sichtbarkeit',
        'Hashtags strategischer einsetzen',
        'Regelmäßigere Updates bei Störungen'
      ],
      optimalPostTimes: {
        twitter: ['08:00', '12:00', '17:00'],
        telegram: ['07:30', '12:30', '18:00'],
        facebook: ['09:00', '13:00', '15:00']
      }
    }
  }
}

export function calculateSocialMediaROI(
  campaign: {
    platform: string
    cost: number
    reach: number
    engagement: number
    clicks: number
    conversions: number
  }
): {
  roi: number
  costPerReach: number
  costPerEngagement: number
  costPerClick: number
  costPerConversion: number
  effectiveness: 'niedrig' | 'mittel' | 'hoch' | 'exzellent'
} {
  const roi = campaign.conversions > 0 ? ((campaign.conversions * 5) - campaign.cost) / campaign.cost * 100 : -100
  const costPerReach = campaign.reach > 0 ? campaign.cost / campaign.reach : 0
  const costPerEngagement = campaign.engagement > 0 ? campaign.cost / campaign.engagement : 0
  const costPerClick = campaign.clicks > 0 ? campaign.cost / campaign.clicks : 0
  const costPerConversion = campaign.conversions > 0 ? campaign.cost / campaign.conversions : 0
  
  let effectiveness: 'niedrig' | 'mittel' | 'hoch' | 'exzellent'
  if (roi > 200) effectiveness = 'exzellent'
  else if (roi > 100) effectiveness = 'hoch'
  else if (roi > 0) effectiveness = 'mittel'
  else effectiveness = 'niedrig'
  
  return {
    roi: Math.round(roi * 100) / 100,
    costPerReach: Math.round(costPerReach * 1000) / 1000,
    costPerEngagement: Math.round(costPerEngagement * 100) / 100,
    costPerClick: Math.round(costPerClick * 100) / 100,
    costPerConversion: Math.round(costPerConversion * 100) / 100,
    effectiveness
  }
}

export function generateHashtagRecommendations(
  content: string,
  platform: string,
  urgency: 'normal' | 'urgent' | 'critical' = 'normal'
): string[] {
  const limits = platformLimits[platform as keyof typeof platformLimits] || platformLimits.twitter
  const maxHashtags = limits.maxHashtags
  
  // Analyze content for relevant hashtags
  const contentLower = content.toLowerCase()
  let relevantHashtags: string[] = []
  
  if (urgency === 'critical') {
    relevantHashtags.push(...railwayHashtags.emergency)
  } else if (contentLower.includes('verspätung') || contentLower.includes('verzögerung')) {
    relevantHashtags.push(...railwayHashtags.delay)
  } else if (contentLower.includes('wetter') || contentLower.includes('sturm')) {
    relevantHashtags.push(...railwayHashtags.weather)
  } else if (contentLower.includes('wartung') || contentLower.includes('bauarbeiten')) {
    relevantHashtags.push(...railwayHashtags.maintenance)
  } else if (contentLower.includes('pünktlich') || contentLower.includes('service')) {
    relevantHashtags.push(...railwayHashtags.positive)
  }
  
  // Always include general railway hashtags
  relevantHashtags.push(...railwayHashtags.general)
  
  // Remove duplicates and limit to platform maximum
  return [...new Set(relevantHashtags)].slice(0, maxHashtags)
}

export function optimizePostingSchedule(
  platform: string,
  timezone: string = 'Europe/Berlin'
): {
  optimalTimes: string[]
  weekdayPreference: number[]
  description: string
} {
  const schedules = {
    twitter: {
      optimalTimes: ['08:00', '12:00', '17:00', '19:00'],
      weekdayPreference: [0.9, 0.9, 0.9, 0.9, 0.9, 0.6, 0.5], // Mo-So
      description: 'Twitter ist besonders während Pendlerzeiten und Mittagspausen aktiv'
    },
    facebook: {
      optimalTimes: ['09:00', '13:00', '15:00'],
      weekdayPreference: [0.8, 0.8, 0.8, 0.8, 0.7, 0.9, 0.9],
      description: 'Facebook hat starke Wochenend-Aktivität und Mittagszeiten'
    },
    instagram: {
      optimalTimes: ['11:00', '14:00', '17:00', '20:00'],
      weekdayPreference: [0.7, 0.7, 0.8, 0.8, 0.6, 0.9, 0.9],
      description: 'Instagram bevorzugt visuelle Inhalte zu Freizeitzeiten'
    },
    telegram: {
      optimalTimes: ['08:00', '12:00', '18:00', '20:00'],
      weekdayPreference: [0.9, 0.9, 0.9, 0.9, 0.8, 0.7, 0.6],
      description: 'Telegram ist ideal für zeitkritische Updates während Arbeitszeiten'
    },
    linkedin: {
      optimalTimes: ['08:00', '12:00', '17:00'],
      weekdayPreference: [0.9, 0.9, 0.9, 0.9, 0.8, 0.3, 0.2],
      description: 'LinkedIn funktioniert am besten an Werktagen während Geschäftszeiten'
    },
    whatsapp: {
      optimalTimes: ['09:00', '13:00', '18:00', '21:00'],
      weekdayPreference: [0.8, 0.8, 0.8, 0.8, 0.8, 0.9, 0.9],
      description: 'WhatsApp hat konstante Aktivität mit Spitzen am Abend'
    }
  }
  
  return schedules[platform as keyof typeof schedules] || schedules.twitter
}

export async function generateCrisisCommsPlan(
  crisis: {
    type: 'severe_delay' | 'accident' | 'weather' | 'technical' | 'security'
    scope: 'local' | 'regional' | 'national'
    severity: 'low' | 'medium' | 'high' | 'critical'
    affectedRoutes: string[]
    estimatedDuration: number
  }
): Promise<{
  platforms: string[]
  messagingStrategy: string
  updateFrequency: number
  keyMessages: string[]
  hashtagStrategy: string[]
  estimatedReach: number
}> {
  try {
    const prompt = spark.llmPrompt`
      Erstelle einen Krisen-Kommunikationsplan für Social Media:
      
      Krise:
      - Typ: ${crisis.type}
      - Umfang: ${crisis.scope}
      - Schweregrad: ${crisis.severity}
      - Betroffene Strecken: ${crisis.affectedRoutes.join(', ')}
      - Geschätzte Dauer: ${crisis.estimatedDuration} Stunden
      
      Plane:
      1. Welche Plattformen prioritär nutzen
      2. Messaging-Strategie
      3. Update-Frequenz (Minuten)
      4. Kern-Botschaften
      5. Hashtag-Strategie
      6. Geschätzte Reichweite
      
      Antworte in folgendem JSON-Format:
      {
        "platforms": ["twitter", "telegram", "facebook"],
        "messagingStrategy": "Transparente, regelmäßige Updates mit Empathie",
        "updateFrequency": 15,
        "keyMessages": [
          "Wir arbeiten an einer schnellen Lösung",
          "Alternative Verbindungen verfügbar",
          "Entschuldigung für Unannehmlichkeiten"
        ],
        "hashtagStrategy": ["#NotfallInfo", "#BahnStörung", "#Updates"],
        "estimatedReach": 50000
      }
    `
    
    const result = await spark.llm(prompt, 'gpt-4o', true)
    return JSON.parse(result)
  } catch (error) {
    console.error('Fehler bei Krisen-Kommunikationsplan:', error)
    return {
      platforms: ['twitter', 'telegram', 'facebook'],
      messagingStrategy: 'Regelmäßige, transparente Updates mit Empathie und Lösungsvorschlägen',
      updateFrequency: crisis.severity === 'critical' ? 10 : 30,
      keyMessages: [
        'Wir arbeiten mit Hochdruck an einer Lösung',
        'Alternative Verbindungen werden geprüft',
        'Weitere Updates folgen in Kürze'
      ],
      hashtagStrategy: ['#NotfallInfo', '#BahnUpdate', '#Service'],
      estimatedReach: crisis.scope === 'national' ? 100000 : 25000
    }
  }
}