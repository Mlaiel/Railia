/**
 * SmartRail-AI - KI-gestützte Übersetzungsdienstleistungen für internationale Fahrgäste
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */

export interface SupportedLanguage {
  code: string
  name: string
  nativeName: string
  flag: string
  rtl: boolean
  priority: number // Higher numbers for more commonly requested languages
}

export interface TranslationRequest {
  id: string
  originalText: string
  sourceLanguage: string
  targetLanguages: string[]
  context: 'delay' | 'emergency' | 'information' | 'announcement' | 'instruction'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
}

export interface TranslationResult {
  language: string
  translatedText: string
  confidence: number
  alternatives?: string[]
  culturalAdaptations?: string[]
}

export interface PassengerLanguageProfile {
  userId?: string
  preferredLanguages: string[]
  location?: string
  travelPatterns: {
    frequentRoutes: string[]
    timePreferences: string[]
  }
  accessibilityNeeds?: {
    visualImpairment?: boolean
    hearingImpairment?: boolean
    cognitiveSupport?: boolean
  }
}

// Comprehensive list of supported languages with priority ranking
export const supportedLanguages: SupportedLanguage[] = [
  // High Priority - Most common international languages
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false, priority: 100 },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', rtl: false, priority: 95 },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false, priority: 90 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false, priority: 85 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false, priority: 80 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false, priority: 75 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false, priority: 70 },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false, priority: 85 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false, priority: 75 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false, priority: 70 },
  
  // Medium Priority - European languages
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', rtl: false, priority: 65 },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', rtl: false, priority: 60 },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', rtl: false, priority: 55 },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', rtl: false, priority: 50 },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', rtl: false, priority: 45 },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', rtl: false, priority: 45 },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', rtl: false, priority: 40 },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', rtl: false, priority: 35 },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', rtl: false, priority: 30 },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', rtl: false, priority: 25 },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', rtl: false, priority: 25 },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', rtl: false, priority: 20 },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', rtl: false, priority: 20 },
  
  // Lower Priority - Other important languages
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true, priority: 60 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false, priority: 55 },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false, priority: 50 },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', rtl: false, priority: 35 },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', rtl: false, priority: 30 },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true, priority: 25 },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', rtl: true, priority: 20 },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true, priority: 15 },
]

// Rail-specific terminology dictionary for context-aware translation
export const railwayTerminology = {
  de: {
    'delay': 'Verspätung',
    'cancellation': 'Ausfall', 
    'platform': 'Gleis',
    'track': 'Gleis',
    'train': 'Zug',
    'departure': 'Abfahrt',
    'arrival': 'Ankunft',
    'connection': 'Anschluss',
    'ticket': 'Fahrkarte',
    'conductor': 'Schaffner',
    'station': 'Bahnhof',
    'emergency': 'Notfall',
    'evacuation': 'Evakuierung',
    'substitute': 'Ersatz',
    'bus_service': 'Busersatzverkehr',
    'first_class': '1. Klasse',
    'second_class': '2. Klasse',
    'reserved_seat': 'Reservierter Platz',
    'unreserved': 'Nicht reserviert'
  },
  en: {
    'delay': 'delay',
    'cancellation': 'cancellation',
    'platform': 'platform',
    'track': 'track',
    'train': 'train',
    'departure': 'departure',
    'arrival': 'arrival',
    'connection': 'connection',
    'ticket': 'ticket',
    'conductor': 'conductor',
    'station': 'station',
    'emergency': 'emergency',
    'evacuation': 'evacuation',
    'substitute': 'substitute',
    'bus_service': 'replacement bus service',
    'first_class': 'first class',
    'second_class': 'second class',
    'reserved_seat': 'reserved seat',
    'unreserved': 'unreserved'
  },
  fr: {
    'delay': 'retard',
    'cancellation': 'suppression',
    'platform': 'quai',
    'track': 'voie',
    'train': 'train',
    'departure': 'départ',
    'arrival': 'arrivée',
    'connection': 'correspondance',
    'ticket': 'billet',
    'conductor': 'contrôleur',
    'station': 'gare',
    'emergency': 'urgence',
    'evacuation': 'évacuation',
    'substitute': 'substitution',
    'bus_service': 'service de bus de remplacement',
    'first_class': 'première classe',
    'second_class': 'seconde classe',
    'reserved_seat': 'place réservée',
    'unreserved': 'non réservé'
  },
  es: {
    'delay': 'retraso',
    'cancellation': 'cancelación',
    'platform': 'andén',
    'track': 'vía',
    'train': 'tren',
    'departure': 'salida',
    'arrival': 'llegada',
    'connection': 'conexión',
    'ticket': 'billete',
    'conductor': 'revisor',
    'station': 'estación',
    'emergency': 'emergencia',
    'evacuation': 'evacuación',
    'substitute': 'sustituto',
    'bus_service': 'servicio de autobús de sustitución',
    'first_class': 'primera clase',
    'second_class': 'segunda clase',
    'reserved_seat': 'asiento reservado',
    'unreserved': 'sin reservar'
  },
  it: {
    'delay': 'ritardo',
    'cancellation': 'cancellazione',
    'platform': 'binario',
    'track': 'binario',
    'train': 'treno',
    'departure': 'partenza',
    'arrival': 'arrivo',
    'connection': 'coincidenza',
    'ticket': 'biglietto',
    'conductor': 'controllore',
    'station': 'stazione',
    'emergency': 'emergenza',
    'evacuation': 'evacuazione',
    'substitute': 'sostitutivo',
    'bus_service': 'servizio autobus sostitutivo',
    'first_class': 'prima classe',
    'second_class': 'seconda classe',
    'reserved_seat': 'posto riservato',
    'unreserved': 'non prenotato'
  }
}

// Context-aware message templates for different languages
export const messageTemplates = {
  delay: {
    de: "Verspätung: {trainNumber} auf der Strecke {route} verspätet sich um {minutes} Minuten. Grund: {reason}.",
    en: "Delay: {trainNumber} on route {route} is delayed by {minutes} minutes. Reason: {reason}.",
    fr: "Retard : {trainNumber} sur la ligne {route} a {minutes} minutes de retard. Raison : {reason}.",
    es: "Retraso: {trainNumber} en la ruta {route} se retrasa {minutes} minutos. Motivo: {reason}.",
    it: "Ritardo: {trainNumber} sulla tratta {route} è in ritardo di {minutes} minuti. Motivo: {reason}.",
    ru: "Задержка: {trainNumber} по маршруту {route} опаздывает на {minutes} минут. Причина: {reason}.",
    zh: "延误：{trainNumber} 在 {route} 路线上延误 {minutes} 分钟。原因：{reason}。",
    ja: "遅延：{route}の{trainNumber}が{minutes}分遅れています。理由：{reason}。",
    ar: "تأخير: {trainNumber} على الخط {route} متأخر {minutes} دقيقة. السبب: {reason}.",
    tr: "Gecikme: {route} hattındaki {trainNumber} {minutes} dakika gecikmeli. Sebep: {reason}."
  },
  emergency: {
    de: "NOTFALL: {description} an {location}. Bitte befolgen Sie die Anweisungen des Personals.",
    en: "EMERGENCY: {description} at {location}. Please follow staff instructions.",
    fr: "URGENCE : {description} à {location}. Veuillez suivre les instructions du personnel.",
    es: "EMERGENCIA: {description} en {location}. Por favor, siga las instrucciones del personal.",
    it: "EMERGENZA: {description} a {location}. Si prega di seguire le istruzioni del personale.",
    ru: "ЭКСТРЕННАЯ СИТУАЦИЯ: {description} в {location}. Пожалуйста, следуйте инструкциям персонала.",
    zh: "紧急情况：{location} {description}。请遵循工作人员的指示。",
    ja: "緊急事態：{location}で{description}。係員の指示に従ってください。",
    ar: "طوارئ: {description} في {location}. يرجى اتباع تعليمات الموظفين.",
    tr: "ACİL DURUM: {location}'da {description}. Lütfen personel talimatlarını takip edin."
  },
  evacuation: {
    de: "EVAKUIERUNG: Verlassen Sie sofort den Zug/Bahnhof {location}. Folgen Sie den grünen Notausgangszeichen.",
    en: "EVACUATION: Immediately leave train/station {location}. Follow green emergency exit signs.",
    fr: "ÉVACUATION : Quittez immédiatement le train/la gare {location}. Suivez les panneaux de sortie de secours verts.",
    es: "EVACUACIÓN: Abandone inmediatamente el tren/estación {location}. Siga las señales verdes de salida de emergencia.",
    it: "EVACUAZIONE: Uscite immediatamente dal treno/stazione {location}. Seguite i cartelli verdi di uscita di emergenza.",
    ru: "ЭВАКУАЦИЯ: Немедленно покиньте поезд/станцию {location}. Следуйте зеленым знакам аварийного выхода.",
    zh: "疏散：立即离开列车/车站 {location}。请遵循绿色紧急出口标志。",
    ja: "避難：列車/駅{location}をすぐに離れてください。緑の非常口標識に従ってください。",
    ar: "إخلاء: اتركوا فوراً القطار/المحطة {location}. اتبعوا علامات المخرج الطارئ الخضراء.",
    tr: "TAHLİYE: Derhal tren/istasyon {location}'dan çıkın. Yeşil acil çıkış işaretlerini takip edin."
  },
  platform_change: {
    de: "Gleisänderung: {trainNumber} fährt von Gleis {newPlatform} ab (vorher Gleis {oldPlatform}).",
    en: "Platform change: {trainNumber} departs from platform {newPlatform} (previously platform {oldPlatform}).",
    fr: "Changement de quai : {trainNumber} part du quai {newPlatform} (précédemment quai {oldPlatform}).",
    es: "Cambio de andén: {trainNumber} sale del andén {newPlatform} (anteriormente andén {oldPlatform}).",
    it: "Cambio binario: {trainNumber} parte dal binario {newPlatform} (precedentemente binario {oldPlatform}).",
    ru: "Смена платформы: {trainNumber} отправляется с платформы {newPlatform} (ранее платформа {oldPlatform}).",
    zh: "站台变更：{trainNumber} 从 {newPlatform} 站台出发（之前是 {oldPlatform} 站台）。",
    ja: "ホーム変更：{trainNumber}は{newPlatform}番ホームから出発します（以前は{oldPlatform}番ホーム）。",
    ar: "تغيير الرصيف: {trainNumber} يغادر من الرصيف {newPlatform} (كان سابقاً الرصيف {oldPlatform}).",
    tr: "Peron değişikliği: {trainNumber} {newPlatform} peronundan kalkıyor (önceden {oldPlatform} peronu)."
  }
}

/**
 * AI-powered translation using Spark LLM with railway context
 */
export async function translateWithAI(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  context: 'delay' | 'emergency' | 'information' | 'announcement' | 'instruction' = 'information',
  useTemplate: boolean = false
): Promise<TranslationResult> {
  try {
    const sourceLang = supportedLanguages.find(l => l.code === sourceLanguage)
    const targetLang = supportedLanguages.find(l => l.code === targetLanguage)
    
    if (!sourceLang || !targetLang) {
      throw new Error('Unsupported language')
    }

    // Use templates for common railway messages if available
    if (useTemplate && messageTemplates[context as keyof typeof messageTemplates]) {
      const templates = messageTemplates[context as keyof typeof messageTemplates]
      if (templates[targetLanguage as keyof typeof templates]) {
        return {
          language: targetLanguage,
          translatedText: templates[targetLanguage as keyof typeof templates],
          confidence: 98,
          alternatives: [],
          culturalAdaptations: []
        }
      }
    }

    // Build specialized railway context for AI translation
    const railwayContext = [
      `Source text: "${text}"`,
      `Context: Railway ${context} message`,
      `Source language: ${sourceLang.nativeName} (${sourceLang.name})`,
      `Target language: ${targetLang.nativeName} (${targetLang.name})`,
      `Writing direction: ${targetLang.rtl ? 'right-to-left' : 'left-to-right'}`,
      '',
      'Railway terminology to consider:',
      Object.entries(railwayTerminology[sourceLanguage] || {})
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n'),
      '',
      'Cultural adaptation requirements:',
      '- Use formal, respectful tone appropriate for public transportation',
      '- Prioritize clarity and urgency for safety messages',
      '- Consider local cultural norms for emergency communication',
      '- Maintain technical accuracy of railway terms',
      '- Use time formats and numbering conventions of target culture'
    ].join('\n')

    const prompt = spark.llmPrompt`
You are a specialized railway communication translator with expertise in international passenger transportation.

${railwayContext}

Please provide a translation that:
1. Maintains technical accuracy of railway terminology
2. Uses appropriate formal tone for public announcements
3. Considers cultural communication norms
4. Prioritizes clarity and safety
5. Uses correct time/date formats for the target culture

Respond with a JSON object containing:
{
  "translatedText": "the main translation",
  "confidence": number (0-100),
  "alternatives": ["alternative translation 1", "alternative translation 2"],
  "culturalAdaptations": ["adaptation note 1", "adaptation note 2"]
}
`

    const response = await spark.llm(prompt, 'gpt-4o', true)
    const result = JSON.parse(response)

    return {
      language: targetLanguage,
      translatedText: result.translatedText,
      confidence: result.confidence || 85,
      alternatives: result.alternatives || [],
      culturalAdaptations: result.culturalAdaptations || []
    }

  } catch (error) {
    console.error('Translation error:', error)
    
    // Fallback to template if available
    if (messageTemplates[context as keyof typeof messageTemplates]) {
      const templates = messageTemplates[context as keyof typeof messageTemplates]
      if (templates[targetLanguage as keyof typeof templates]) {
        return {
          language: targetLanguage,
          translatedText: templates[targetLanguage as keyof typeof templates],
          confidence: 70,
          alternatives: [],
          culturalAdaptations: ['Fallback template used - manual review recommended']
        }
      }
    }
    
    throw error
  }
}

/**
 * Batch translate to multiple languages efficiently
 */
export async function batchTranslate(
  text: string,
  sourceLanguage: string,
  targetLanguages: string[],
  context: 'delay' | 'emergency' | 'information' | 'announcement' | 'instruction' = 'information'
): Promise<Record<string, TranslationResult>> {
  const results: Record<string, TranslationResult> = {}
  
  // Process translations in parallel for efficiency
  const translations = await Promise.allSettled(
    targetLanguages.map(async (lang) => {
      const result = await translateWithAI(text, sourceLanguage, lang, context)
      return { lang, result }
    })
  )

  translations.forEach((translation) => {
    if (translation.status === 'fulfilled') {
      results[translation.value.lang] = translation.value.result
    } else {
      console.error(`Translation failed for ${translation}:`, translation.reason)
    }
  })

  return results
}

/**
 * Detect passenger language preferences based on device/location/history
 */
export function detectPassengerLanguages(
  browserLanguages: string[],
  location?: string,
  travelHistory?: string[]
): string[] {
  const detectedLanguages = new Set<string>()
  
  // Primary: Browser language preferences
  browserLanguages.forEach(lang => {
    const langCode = lang.split('-')[0].toLowerCase()
    if (supportedLanguages.some(sl => sl.code === langCode)) {
      detectedLanguages.add(langCode)
    }
  })
  
  // Secondary: Location-based inference
  if (location) {
    const locationLanguageMap: Record<string, string[]> = {
      'UK': ['en'],
      'FR': ['fr'],
      'ES': ['es'],
      'IT': ['it'],
      'CH': ['de', 'fr', 'it'],
      'AT': ['de'],
      'NL': ['nl'],
      'BE': ['nl', 'fr'],
      'PL': ['pl'],
      'CZ': ['cs'],
      'RU': ['ru'],
      'CN': ['zh'],
      'JP': ['ja'],
      'KR': ['ko'],
      'IN': ['hi', 'en'],
      'SA': ['ar'],
      'TR': ['tr']
    }
    
    const locLangs = locationLanguageMap[location.toUpperCase()]
    if (locLangs) {
      locLangs.forEach(lang => detectedLanguages.add(lang))
    }
  }
  
  // Tertiary: Common international languages as fallback
  if (detectedLanguages.size === 0) {
    ['en', 'de', 'fr', 'es'].forEach(lang => detectedLanguages.add(lang))
  }
  
  // Sort by language priority
  return Array.from(detectedLanguages).sort((a, b) => {
    const aPriority = supportedLanguages.find(sl => sl.code === a)?.priority || 0
    const bPriority = supportedLanguages.find(sl => sl.code === b)?.priority || 0
    return bPriority - aPriority
  })
}

/**
 * Generate multilingual emergency announcements
 */
export async function generateMultilingualEmergencyAnnouncement(
  emergencyType: 'evacuation' | 'delay' | 'platform_change' | 'technical_issue',
  details: Record<string, any>,
  targetLanguages: string[] = ['de', 'en', 'fr', 'es', 'ar']
): Promise<Record<string, string>> {
  const announcements: Record<string, string> = {}
  
  // Generate base message in German
  let baseMessage = ''
  switch (emergencyType) {
    case 'evacuation':
      baseMessage = `NOTFALL: Sofortige Evakuierung erforderlich in ${details.location}. Folgen Sie den Notausgangsschildern.`
      break
    case 'delay':
      baseMessage = `Verspätung: ${details.trainNumber} verspätet sich um ${details.minutes} Minuten. Grund: ${details.reason}.`
      break
    case 'platform_change':
      baseMessage = `Gleisänderung: ${details.trainNumber} fährt von Gleis ${details.newPlatform} ab.`
      break
    case 'technical_issue':
      baseMessage = `Technische Störung: ${details.description}. Voraussichtliche Lösung in ${details.estimatedTime} Minuten.`
      break
  }
  
  // Translate to all target languages
  const translations = await batchTranslate(
    baseMessage,
    'de',
    targetLanguages.filter(lang => lang !== 'de'),
    emergencyType === 'evacuation' ? 'emergency' : 'information'
  )
  
  announcements['de'] = baseMessage
  Object.entries(translations).forEach(([lang, result]) => {
    announcements[lang] = result.translatedText
  })
  
  return announcements
}

/**
 * Format message for accessibility (screen readers, visual impairments)
 */
export function formatForAccessibility(
  text: string,
  language: string,
  accessibilityNeeds?: {
    visualImpairment?: boolean
    hearingImpairment?: boolean
    cognitiveSupport?: boolean
  }
): string {
  let formattedText = text
  
  if (accessibilityNeeds?.visualImpairment) {
    // Add pronunciation guides for numbers and technical terms
    formattedText = formattedText.replace(/(\d+)/g, ' $1 ')
    formattedText = formattedText.replace(/\s+/g, ' ')
  }
  
  if (accessibilityNeeds?.cognitiveSupport) {
    // Simplify complex sentences and add structure
    const lang = supportedLanguages.find(l => l.code === language)
    if (lang) {
      // Add clear separators and structure indicators
      formattedText = formattedText.replace(/[.:;]/g, '. ')
      formattedText = `[${lang.nativeName}] ${formattedText}`
    }
  }
  
  return formattedText.trim()
}

export default {
  supportedLanguages,
  railwayTerminology,
  messageTemplates,
  translateWithAI,
  batchTranslate,
  detectPassengerLanguages,
  generateMultilingualEmergencyAnnouncement,
  formatForAccessibility
}