/**
 * SmartRail-AI - Automatische Übersetzungsintegrationen für internationale Fahrgäste
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */

import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Languages, 
  Globe, 
  Mic, 
  Volume2, 
  Users, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Brain,
  Send,
  Settings,
  TrendUp,
  Activity,
  Monitor,
  Smartphone,
  MessageCircle,
  Zap,
  Target,
  Eye,
  Ear,
  Heart,
  Copy,
  Download,
  Share,
  BarChart3,
  MapPin,
  Train
} from '@phosphor-icons/react'

import {
  supportedLanguages,
  translateWithAI,
  batchTranslate,
  detectPassengerLanguages,
  generateMultilingualEmergencyAnnouncement,
  formatForAccessibility,
  type SupportedLanguage,
  type TranslationRequest,
  type TranslationResult,
  type PassengerLanguageProfile
} from '../utils/translationUtils'

interface TranslationStats {
  totalTranslations: number
  languagesSupported: number
  avgTranslationTime: number
  accuracyRate: number
  passengerReach: number
  emergencyTranslations: number
}

interface ActiveTranslation {
  id: string
  originalText: string
  sourceLanguage: string
  targetLanguages: string[]
  context: string
  status: 'translating' | 'completed' | 'failed'
  results: Record<string, TranslationResult>
  timestamp: string
}

interface LanguagePreference {
  code: string
  confidence: number
  source: 'device' | 'location' | 'manual' | 'travel_history'
}

const InternationalTranslation = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isTranslating, setIsTranslating] = useState(false)
  
  // Translation content states
  const [sourceText, setSourceText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('de')
  const [selectedTargetLanguages, setSelectedTargetLanguages] = useState<string[]>(['en', 'fr', 'es'])
  const [translationContext, setTranslationContext] = useState<'delay' | 'emergency' | 'information' | 'announcement' | 'instruction'>('information')
  
  // Persistent state
  const [translationHistory, setTranslationHistory] = useKV<ActiveTranslation[]>('translation-history', [])
  const [passengerProfiles, setPassengerProfiles] = useKV<PassengerLanguageProfile[]>('passenger-language-profiles', [])
  const [autoTranslationSettings, setAutoTranslationSettings] = useKV('auto-translation-settings', {
    enabled: true,
    emergencyLanguages: ['en', 'fr', 'es', 'ar', 'zh'],
    delayThreshold: 5, // minutes
    confidenceThreshold: 80,
    enableVoiceOutput: true,
    enableAccessibilityFormats: true
  })
  
  // Stats
  const [translationStats] = useKV<TranslationStats>('translation-stats', {
    totalTranslations: 2847,
    languagesSupported: supportedLanguages.length,
    avgTranslationTime: 1.2,
    accuracyRate: 94.7,
    passengerReach: 15420,
    emergencyTranslations: 89
  })

  // Real-time language detection
  const [detectedLanguages, setDetectedLanguages] = useState<LanguagePreference[]>([])

  useEffect(() => {
    // Simulate language detection based on browser/device
    const browserLangs = navigator.languages || [navigator.language]
    const detected = detectPassengerLanguages(browserLangs)
    
    setDetectedLanguages(detected.map((code, index) => ({
      code,
      confidence: Math.max(90 - index * 10, 60),
      source: index === 0 ? 'device' : 'location'
    })))
  }, [])

  // Perform translation
  const performTranslation = async () => {
    if (!sourceText.trim()) {
      toast.error('Bitte geben Sie einen Text ein')
      return
    }

    if (selectedTargetLanguages.length === 0) {
      toast.error('Bitte wählen Sie mindestens eine Zielsprache')
      return
    }

    setIsTranslating(true)
    
    try {
      const translationId = Date.now().toString()
      
      // Create translation entry
      const newTranslation: ActiveTranslation = {
        id: translationId,
        originalText: sourceText,
        sourceLanguage,
        targetLanguages: selectedTargetLanguages,
        context: translationContext,
        status: 'translating',
        results: {},
        timestamp: new Date().toISOString()
      }
      
      setTranslationHistory(prev => [newTranslation, ...prev.slice(0, 49)])
      
      toast.info('KI-Übersetzung gestartet...', {
        description: `${selectedTargetLanguages.length} Sprachen werden verarbeitet`
      })

      // Perform batch translation
      const results = await batchTranslate(
        sourceText,
        sourceLanguage,
        selectedTargetLanguages,
        translationContext
      )

      // Update translation with results
      setTranslationHistory(prev => 
        prev.map(trans => 
          trans.id === translationId 
            ? { ...trans, status: 'completed', results }
            : trans
        )
      )

      toast.success('Übersetzung abgeschlossen!', {
        description: `${Object.keys(results).length} Sprachen erfolgreich übersetzt`
      })

      // Clear source text after successful translation
      setSourceText('')

    } catch (error) {
      console.error('Translation error:', error)
      toast.error('Übersetzungsfehler')
      
      // Update status to failed
      setTranslationHistory(prev => 
        prev.map(trans => 
          trans.id === translationHistory[0]?.id 
            ? { ...trans, status: 'failed' }
            : trans
        )
      )
    } finally {
      setIsTranslating(false)
    }
  }

  // Generate emergency announcement
  const generateEmergencyAnnouncement = async (type: 'evacuation' | 'delay' | 'platform_change' | 'technical_issue') => {
    setIsTranslating(true)
    
    try {
      const details = {
        location: 'Hauptbahnhof München',
        trainNumber: 'ICE 123',
        minutes: 15,
        reason: 'Signalstörung',
        newPlatform: '7',
        oldPlatform: '3',
        description: 'Stellwerksausfall',
        estimatedTime: 30
      }

      const announcements = await generateMultilingualEmergencyAnnouncement(
        type,
        details,
        autoTranslationSettings.emergencyLanguages
      )

      // Create translation history entry
      const newTranslation: ActiveTranslation = {
        id: Date.now().toString(),
        originalText: `${type.toUpperCase()}: ${Object.values(details).join(', ')}`,
        sourceLanguage: 'de',
        targetLanguages: autoTranslationSettings.emergencyLanguages,
        context: type === 'evacuation' ? 'emergency' : 'announcement',
        status: 'completed',
        results: Object.entries(announcements).reduce((acc, [lang, text]) => {
          acc[lang] = {
            language: lang,
            translatedText: text,
            confidence: 95,
            alternatives: [],
            culturalAdaptations: []
          }
          return acc
        }, {} as Record<string, TranslationResult>),
        timestamp: new Date().toISOString()
      }

      setTranslationHistory(prev => [newTranslation, ...prev.slice(0, 49)])

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)}-Ansage generiert`, {
        description: `${autoTranslationSettings.emergencyLanguages.length} Sprachen verfügbar`
      })

    } catch (error) {
      console.error('Emergency announcement error:', error)
      toast.error('Fehler bei der Notfall-Ansage')
    } finally {
      setIsTranslating(false)
    }
  }

  const copyTranslation = async (text: string, language: string) => {
    try {
      await navigator.clipboard.writeText(text)
      const lang = supportedLanguages.find(l => l.code === language)
      toast.success(`${lang?.nativeName || language} Text kopiert`)
    } catch (error) {
      toast.error('Fehler beim Kopieren')
    }
  }

  const toggleTargetLanguage = (languageCode: string) => {
    setSelectedTargetLanguages(prev => 
      prev.includes(languageCode)
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode]
    )
  }

  const getLanguageFlag = (code: string) => {
    return supportedLanguages.find(l => l.code === code)?.flag || '🌐'
  }

  const getLanguageName = (code: string) => {
    return supportedLanguages.find(l => l.code === code)?.nativeName || code
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Internationale Übersetzungen</h2>
          <p className="text-muted-foreground">
            KI-gestützte Mehrsprachkommunikation für internationale Fahrgäste
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Languages size={14} className="mr-1" />
            {supportedLanguages.length} Sprachen
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Brain size={14} className="mr-1" />
            KI-Powered
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendUp size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="translate" className="flex items-center gap-2">
            <Languages size={16} />
            <span className="hidden sm:inline">Übersetzen</span>
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span className="hidden sm:inline">Notfall</span>
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock size={16} />
            <span className="hidden sm:inline">Verlauf</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            <span className="hidden sm:inline">Einstellungen</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Languages size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{translationStats.totalTranslations}</p>
                    <p className="text-xs text-muted-foreground">Übersetzungen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Globe size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{translationStats.languagesSupported}</p>
                    <p className="text-xs text-muted-foreground">Sprachen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{translationStats.avgTranslationTime}s</p>
                    <p className="text-xs text-muted-foreground">Ø Übersetzungszeit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{translationStats.accuracyRate}%</p>
                    <p className="text-xs text-muted-foreground">Genauigkeit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users size={16} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{translationStats.passengerReach}</p>
                    <p className="text-xs text-muted-foreground">Erreichte Fahrgäste</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{translationStats.emergencyTranslations}</p>
                    <p className="text-xs text-muted-foreground">Notfall-Übersetzungen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Language Detection Card */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain size={20} className="text-blue-600" />
                Erkannte Fahrgast-Sprachen
              </CardTitle>
              <CardDescription>
                Automatische Erkennung basierend auf Gerät, Standort und Reiseverhalten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {detectedLanguages.map((lang, index) => {
                  const languageInfo = supportedLanguages.find(l => l.code === lang.code)
                  return (
                    <div key={lang.code} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{languageInfo?.flag}</span>
                        <div>
                          <p className="font-medium">{languageInfo?.nativeName}</p>
                          <p className="text-xs text-muted-foreground">{languageInfo?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">{lang.confidence}%</p>
                        <Badge variant="outline" className="text-xs">
                          {lang.source}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Emergency Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} />
                Schnell-Aktionen
              </CardTitle>
              <CardDescription>
                Sofortige mehrsprachige Notfall-Ansagen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => generateEmergencyAnnouncement('delay')}
                  disabled={isTranslating}
                >
                  <Clock size={20} />
                  <span className="text-sm">Verspätung</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => generateEmergencyAnnouncement('platform_change')}
                  disabled={isTranslating}
                >
                  <Train size={20} />
                  <span className="text-sm">Gleisänderung</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => generateEmergencyAnnouncement('technical_issue')}
                  disabled={isTranslating}
                >
                  <Settings size={20} />
                  <span className="text-sm">Techn. Störung</span>
                </Button>

                <Button 
                  variant="destructive" 
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => generateEmergencyAnnouncement('evacuation')}
                  disabled={isTranslating}
                >
                  <AlertTriangle size={20} />
                  <span className="text-sm">Evakuierung</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Translations */}
          {translationHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Letzte Übersetzungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {translationHistory.slice(0, 3).map(translation => (
                    <div key={translation.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">
                          {translation.originalText.substring(0, 50)}...
                        </p>
                        <Badge 
                          variant={translation.status === 'completed' ? 'default' : 
                                   translation.status === 'failed' ? 'destructive' : 'secondary'}
                        >
                          {translation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{getLanguageFlag(translation.sourceLanguage)} → </span>
                        <div className="flex gap-1">
                          {translation.targetLanguages.map(lang => (
                            <span key={lang}>{getLanguageFlag(lang)}</span>
                          ))}
                        </div>
                        <span>• {new Date(translation.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Translation Tab */}
        <TabsContent value="translate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages size={20} />
                KI-Übersetzung
              </CardTitle>
              <CardDescription>
                Übersetzen Sie Nachrichten in mehrere Sprachen gleichzeitig
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Source Text Input */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quellsprache</Label>
                    <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedLanguages.map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.nativeName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Kontext</Label>
                    <Select value={translationContext} onValueChange={setTranslationContext}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="information">Information</SelectItem>
                        <SelectItem value="delay">Verspätung</SelectItem>
                        <SelectItem value="emergency">Notfall</SelectItem>
                        <SelectItem value="announcement">Ansage</SelectItem>
                        <SelectItem value="instruction">Anweisung</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Zu übersetzender Text</Label>
                  <Textarea
                    placeholder="Geben Sie hier Ihre Nachricht ein..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Target Languages Selection */}
              <div className="space-y-3">
                <Label>Zielsprachen ({selectedTargetLanguages.length} ausgewählt)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {supportedLanguages
                    .filter(lang => lang.code !== sourceLanguage)
                    .sort((a, b) => b.priority - a.priority)
                    .map(lang => (
                      <div
                        key={lang.code}
                        className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                          selectedTargetLanguages.includes(lang.code)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => toggleTargetLanguage(lang.code)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{lang.nativeName}</p>
                            <p className="text-xs text-muted-foreground truncate">{lang.name}</p>
                          </div>
                          {selectedTargetLanguages.includes(lang.code) && (
                            <CheckCircle size={16} className="text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={performTranslation}
                  disabled={isTranslating || !sourceText.trim() || selectedTargetLanguages.length === 0}
                  className="flex-1"
                >
                  {isTranslating ? (
                    <Activity size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Languages size={16} className="mr-2" />
                  )}
                  {isTranslating ? 'Übersetze...' : 'KI-Übersetzung starten'}
                </Button>

                <Button variant="outline" onClick={() => setSourceText('')}>
                  Löschen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Translation Results */}
          {translationHistory.length > 0 && translationHistory[0].status === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  Übersetzungsergebnisse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(translationHistory[0].results).map(([langCode, result]) => {
                    const lang = supportedLanguages.find(l => l.code === langCode)
                    return (
                      <div key={langCode} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{lang?.flag}</span>
                            <div>
                              <p className="font-medium">{lang?.nativeName}</p>
                              <p className="text-xs text-muted-foreground">
                                Konfidenz: {result.confidence}%
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyTranslation(result.translatedText, langCode)}
                            >
                              <Copy size={14} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Volume2 size={14} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed p-3 bg-muted/50 rounded">
                          {result.translatedText}
                        </p>
                        {result.culturalAdaptations && result.culturalAdaptations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Kulturelle Anpassungen:</p>
                            <div className="space-y-1">
                              {result.culturalAdaptations.map((adaptation, index) => (
                                <p key={index} className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                  {adaptation}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Emergency Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle size={16} className="text-red-600" />
            <AlertDescription>
              Notfall-Übersetzungen werden automatisch in die {autoTranslationSettings.emergencyLanguages.length} wichtigsten Sprachen übersetzt und sofort verbreitet.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Notfall-Kategorien</CardTitle>
                <CardDescription>
                  Vorgefertigte mehrsprachige Notfall-Ansagen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: 'evacuation', icon: AlertTriangle, label: 'Sofortige Evakuierung', color: 'text-red-600' },
                  { type: 'delay', icon: Clock, label: 'Schwere Verspätung', color: 'text-orange-600' },
                  { type: 'platform_change', icon: Train, label: 'Gleisänderung', color: 'text-blue-600' },
                  { type: 'technical_issue', icon: Settings, label: 'Technische Störung', color: 'text-purple-600' }
                ].map((emergency) => (
                  <Button
                    key={emergency.type}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => generateEmergencyAnnouncement(emergency.type as any)}
                    disabled={isTranslating}
                  >
                    <emergency.icon size={20} className={`mr-3 ${emergency.color}`} />
                    <div className="text-left">
                      <p className="font-medium">{emergency.label}</p>
                      <p className="text-xs text-muted-foreground">
                        Automatische Übersetzung in {autoTranslationSettings.emergencyLanguages.length} Sprachen
                      </p>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Notfall-Sprachen</CardTitle>
                <CardDescription>
                  Sprachen für automatische Notfall-Übersetzungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {autoTranslationSettings.emergencyLanguages.map(langCode => {
                    const lang = supportedLanguages.find(l => l.code === langCode)
                    return (
                      <div key={langCode} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lang?.flag}</span>
                          <div>
                            <p className="font-medium">{lang?.nativeName}</p>
                            <p className="text-xs text-muted-foreground">{lang?.name}</p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-red-100 text-red-800 border-red-200">
                          Notfall
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Translation History Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Übersetzungsverlauf</h3>
            <Badge variant="outline">
              {translationHistory.length} Einträge
            </Badge>
          </div>

          <div className="space-y-3">
            {translationHistory.map(translation => (
              <Card key={translation.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                    <div className="lg:col-span-2">
                      <p className="font-medium text-sm mb-2">
                        {translation.originalText.substring(0, 100)}
                        {translation.originalText.length > 100 ? '...' : ''}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{getLanguageFlag(translation.sourceLanguage)} {getLanguageName(translation.sourceLanguage)}</span>
                        <span>→</span>
                        <div className="flex gap-1">
                          {translation.targetLanguages.map(lang => (
                            <span key={lang} title={getLanguageName(lang)}>
                              {getLanguageFlag(lang)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Badge 
                        variant={translation.status === 'completed' ? 'default' : 
                                translation.status === 'failed' ? 'destructive' : 'secondary'}
                        className="mb-2"
                      >
                        {translation.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {translation.context}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(translation.timestamp).toLocaleString()}
                      </p>
                      {translation.status === 'completed' && (
                        <p className="text-xs text-green-600">
                          {Object.keys(translation.results).length} Sprachen
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Show translation results if expanded */}
                  {translation.status === 'completed' && Object.keys(translation.results).length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(translation.results).slice(0, 3).map(([langCode, result]) => (
                          <div key={langCode} className="p-2 bg-muted/30 rounded text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <span>{getLanguageFlag(langCode)}</span>
                              <span className="font-medium">{getLanguageName(langCode)}</span>
                            </div>
                            <p className="line-clamp-2">{result.translatedText}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automatische Übersetzung</CardTitle>
              <CardDescription>
                Konfiguration der automatischen Übersetzungsdienste
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Automatische Übersetzung aktivieren</p>
                  <p className="text-sm text-muted-foreground">
                    Automatische Übersetzung bei Verspätungen und Störungen
                  </p>
                </div>
                <Switch 
                  checked={autoTranslationSettings.enabled}
                  onCheckedChange={(checked) =>
                    setAutoTranslationSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Sprach-Ausgabe aktivieren</p>
                  <p className="text-sm text-muted-foreground">
                    Text-zu-Sprache für Durchsagen
                  </p>
                </div>
                <Switch 
                  checked={autoTranslationSettings.enableVoiceOutput}
                  onCheckedChange={(checked) =>
                    setAutoTranslationSettings(prev => ({ ...prev, enableVoiceOutput: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Barrierefreiheits-Formate</p>
                  <p className="text-sm text-muted-foreground">
                    Spezielle Formate für Seh- und Hörbehinderungen
                  </p>
                </div>
                <Switch 
                  checked={autoTranslationSettings.enableAccessibilityFormats}
                  onCheckedChange={(checked) =>
                    setAutoTranslationSettings(prev => ({ ...prev, enableAccessibilityFormats: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Verspätungs-Schwellenwert (Minuten)</Label>
                  <Input
                    type="number"
                    value={autoTranslationSettings.delayThreshold}
                    onChange={(e) =>
                      setAutoTranslationSettings(prev => ({ 
                        ...prev, 
                        delayThreshold: parseInt(e.target.value) || 5 
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Konfidenz-Schwellenwert (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={autoTranslationSettings.confidenceThreshold}
                    onChange={(e) =>
                      setAutoTranslationSettings(prev => ({ 
                        ...prev, 
                        confidenceThreshold: parseInt(e.target.value) || 80 
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Priority Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Sprach-Prioritäten</CardTitle>
              <CardDescription>
                Reihenfolge der Sprachen nach Passagier-Aufkommen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supportedLanguages
                  .sort((a, b) => b.priority - a.priority)
                  .slice(0, 10)
                  .map((lang, index) => (
                    <div key={lang.code} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-xl">{lang.flag}</span>
                        <div>
                          <p className="font-medium">{lang.nativeName}</p>
                          <p className="text-xs text-muted-foreground">{lang.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">Priorität {lang.priority}</p>
                        <p className="text-xs text-muted-foreground">
                          {lang.rtl ? 'Rechts-nach-Links' : 'Links-nach-Rechts'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InternationalTranslation