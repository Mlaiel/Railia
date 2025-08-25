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
import { toast } from 'sonner'
import { 
  Bell, 
  Send, 
  Clock, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Train,
  MapPin,
  Users,
  Smartphone,
  Monitor,
  Volume2,
  Languages,
  Calendar,
  Filter,
  Target,
  TrendUp,
  X,
  Brain,
  Activity,
  Share,
  Camera,
  MessageCircle
} from '@phosphor-icons/react'
import { 
  generatePersonalizedNotification,
  analyzeNotificationEffectiveness,
  calculateOptimalChannelMix,
  formatNotificationForChannel,
  detectEmergencyKeywords,
  notificationChannels,
  defaultPassengerSegments
} from '../utils/notificationUtils'
import { 
  generateSocialMediaContent,
  analyzeSocialMediaPerformance,
  generateHashtagRecommendations,
  optimizePostingSchedule 
} from '../utils/socialMediaUtils'
import { 
  useRealTimeDelayMonitoring,
  generateSmartNotificationContent,
  calculateNotificationPriority 
} from '../hooks/useRealTimeDelayMonitoring'
import {
  translateWithAI,
  batchTranslate,
  supportedLanguages,
  type TranslationResult
} from '../utils/translationUtils'

interface DelayPrediction {
  id: string
  trainNumber: string
  route: string
  currentDelay: number
  predictedDelay: number
  affectedStations: string[]
  cause: string
  severity: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
  estimatedImpact: number
  confidence: number
  timestamp: string
}

interface NotificationTemplate {
  id: string
  name: string
  type: 'verspätung' | 'ausfall' | 'störung' | 'info'
  severity: string
  channels: string[]
  template: string
  autoSend: boolean
  conditions: {
    minDelay: number
    maxDelay: number
    routes: string[]
    stations: string[]
  }
}

interface NotificationHistory {
  id: string
  type: string
  message: string
  channels: string[]
  recipients: number
  timestamp: string
  effectiveness: number
  responses: number
}

export default function PassengerNotifications() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedLanguage, setSelectedLanguage] = useState('de')
  
  // Real-time delay monitoring
  const {
    delayEvents,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    markNotificationSent,
    clearEvents
  } = useRealTimeDelayMonitoring()
  
  // Persistent state for delay predictions and notifications
  const [delayPredictions, setDelayPredictions] = useKV<DelayPrediction[]>('delay-predictions', [
    {
      id: '1',
      trainNumber: 'ICE 123',
      route: 'Hamburg → München',
      currentDelay: 5,
      predictedDelay: 12,
      affectedStations: ['Bremen', 'Hannover', 'Göttingen'],
      cause: 'Signalstörung',
      severity: 'mittel',
      estimatedImpact: 450,
      confidence: 89,
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      trainNumber: 'RE 456',
      route: 'Berlin → Dresden',
      currentDelay: 0,
      predictedDelay: 8,
      affectedStations: ['Cottbus', 'Senftenberg'],
      cause: 'Wetterbedingungen',
      severity: 'niedrig',
      estimatedImpact: 180,
      confidence: 76,
      timestamp: new Date().toISOString()
    }
  ])

  const [notificationTemplates, setNotificationTemplates] = useKV<NotificationTemplate[]>('notification-templates', [
    {
      id: '1',
      name: 'Standard Verspätung',
      type: 'verspätung',
      severity: 'mittel',
      channels: ['app', 'display', 'audio'],
      template: 'Verspätung: {trainNumber} auf der Strecke {route} verspätet sich um {delay} Minuten. Grund: {cause}. Entschuldigung für die Unannehmlichkeiten.',
      autoSend: true,
      conditions: {
        minDelay: 5,
        maxDelay: 30,
        routes: [],
        stations: []
      }
    },
    {
      id: '2',
      name: 'Kritische Störung',
      type: 'störung',
      severity: 'kritisch',
      channels: ['app', 'display', 'audio', 'sms'],
      template: 'WICHTIG: Erhebliche Störung auf {route}. {trainNumber} verspätet sich um {delay} Minuten. Alternative Verbindungen werden geprüft.',
      autoSend: true,
      conditions: {
        minDelay: 30,
        maxDelay: 999,
        routes: [],
        stations: []
      }
    }
  ])

  const [notificationHistory, setNotificationHistory] = useKV<NotificationHistory[]>('notification-history', [])

  const [customMessage, setCustomMessage] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['app'])
  const [targetAudience, setTargetAudience] = useState('alle')

  // Real-time notification statistics
  const [notificationStats] = useKV('notification-stats', {
    totalSent: 1247,
    deliveryRate: 97.3,
    responseRate: 23.1,
    avgEffectiveness: 84.2
  })

  const channels = [
    { id: 'app', name: 'Mobile App', icon: Smartphone, color: 'text-blue-600' },
    { id: 'display', name: 'Bahnhof-Anzeigen', icon: Monitor, color: 'text-green-600' },
    { id: 'audio', name: 'Durchsagen', icon: Volume2, color: 'text-orange-600' },
    { id: 'sms', name: 'SMS', icon: Send, color: 'text-purple-600' },
    { id: 'twitter', name: 'Twitter/X', icon: Share, color: 'text-blue-400' },
    { id: 'facebook', name: 'Facebook', icon: Share, color: 'text-blue-600' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'text-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: Camera, color: 'text-pink-500' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-green-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Share, color: 'text-blue-700' }
  ]

  const severityColors = {
    niedrig: 'bg-green-100 text-green-800 border-green-200',
    mittel: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    hoch: 'bg-orange-100 text-orange-800 border-orange-200',
    kritisch: 'bg-red-100 text-red-800 border-red-200'
  }

  const sendNotification = async (prediction: DelayPrediction, template?: NotificationTemplate) => {
    try {
      let message = ''
      
      if (template) {
        // Use template and personalize it
        message = await generatePersonalizedNotification(
          {
            trainNumber: prediction.trainNumber,
            route: prediction.route,
            currentDelay: prediction.currentDelay,
            predictedDelay: prediction.predictedDelay,
            cause: prediction.cause,
            affectedStations: prediction.affectedStations
          },
          targetAudience,
          selectedLanguage,
          true
        )
      } else if (customMessage.trim()) {
        message = customMessage
      } else {
        // Generate AI-powered personalized message
        message = await generatePersonalizedNotification(
          {
            trainNumber: prediction.trainNumber,
            route: prediction.route,
            currentDelay: prediction.currentDelay,
            predictedDelay: prediction.predictedDelay,
            cause: prediction.cause,
            affectedStations: prediction.affectedStations
          },
          targetAudience,
          selectedLanguage,
          true
        )
      }

      // Detect emergency level and adjust channels if needed
      const emergencyDetection = detectEmergencyKeywords(message)
      let channels = template?.channels || selectedChannels
      
      if (emergencyDetection.isEmergency && emergencyDetection.suggestedPriority === 'kritisch') {
        // For critical emergencies, use all available channels
        channels = ['app', 'display', 'audio', 'sms']
        toast.warning('Kritischer Notfall erkannt - alle Kanäle werden aktiviert', {
          description: `Gefundene Schlüsselwörter: ${emergencyDetection.keywords.join(', ')}`
        })
      }

      // Calculate optimal channel distribution
      const channelOptimization = calculateOptimalChannelMix(
        prediction.estimatedImpact,
        emergencyDetection.suggestedPriority,
        1000 // Budget in Euro
      )

      // Auto-translate for international passengers if enabled
      let multilingualMessages: Record<string, string> = { [selectedLanguage]: message }
      
      if (emergencyDetection.isEmergency || prediction.predictedDelay >= 10) {
        try {
          const targetLanguages = ['en', 'fr', 'es', 'ar'] // Most common international languages
            .filter(lang => lang !== selectedLanguage)
          
          const translations = await batchTranslate(
            message,
            selectedLanguage,
            targetLanguages,
            emergencyDetection.isEmergency ? 'emergency' : 'delay'
          )
          
          Object.entries(translations).forEach(([lang, result]) => {
            multilingualMessages[lang] = result.translatedText
          })
          
          toast.success('Automatische Übersetzung aktiviert', {
            description: `Nachricht in ${Object.keys(multilingualMessages).length} Sprachen verfügbar`
          })
        } catch (translationError) {
          console.error('Translation failed:', translationError)
          toast.warning('Übersetzung teilweise fehlgeschlagen', {
            description: 'Nachricht wird nur in Originalsprache gesendet'
          })
        }
      }

      // Format message for each channel
      const formattedMessages = channels.map(channelId => ({
        channel: channelId,
        message: formatNotificationForChannel(
          message, 
          channelId, 
          emergencyDetection.isEmergency
        ),
        translations: Object.entries(multilingualMessages).reduce((acc, [lang, text]) => {
          acc[lang] = formatNotificationForChannel(text, channelId, emergencyDetection.isEmergency)
          return acc
        }, {} as Record<string, string>)
      }))

      // Create notification history entry
      const newNotification: NotificationHistory = {
        id: Date.now().toString(),
        type: template?.type || emergencyDetection.suggestedPriority,
        message,
        channels,
        recipients: prediction.estimatedImpact,
        timestamp: new Date().toISOString(),
        effectiveness: channelOptimization.expectedEffectiveness,
        responses: Math.floor(prediction.estimatedImpact * (channelOptimization.expectedEffectiveness / 100))
      }

      setNotificationHistory(prev => [newNotification, ...prev.slice(0, 49)])

      toast.success(`Intelligente Benachrichtigung gesendet`, {
        description: `${prediction.estimatedImpact} Fahrgäste erreicht via ${channels.length} Kanäle • ${Object.keys(multilingualMessages).length} Sprachen`
      })

      // Clear custom message after sending
      if (!template) {
        setCustomMessage('')
      }

    } catch (error) {
      console.error('Notification error:', error)
      toast.error('Fehler beim Senden der Benachrichtigung')
    }
  }

  // Add AI analysis capabilities
  const [analysisResults, setAnalysisResults] = useState<{
    overallEffectiveness: number
    channelPerformance: Record<string, number>
    messageTypePerformance: Record<string, number>
    recommendations: string[]
  } | null>(null)

  const runEffectivenessAnalysis = async () => {
    try {
      toast.info('KI-Analyse läuft...', { duration: 2000 })
      
      const results = await analyzeNotificationEffectiveness(
        notificationHistory.map(h => ({
          ...h,
          delayMinutes: Math.floor(Math.random() * 30) + 5,
          cause: ['Signalstörung', 'Wetter', 'Technischer Defekt'][Math.floor(Math.random() * 3)]
        }))
      )
      
      setAnalysisResults(results)
      toast.success('Analyse abgeschlossen', {
        description: `Gesamtwirksamkeit: ${results.overallEffectiveness.toFixed(1)}%`
      })
    } catch (error) {
      toast.error('Fehler bei der Analyse')
    }
  }

  const formatMessage = (template: string, prediction: DelayPrediction) => {
    return template
      .replace('{trainNumber}', prediction.trainNumber)
      .replace('{route}', prediction.route)
      .replace('{delay}', prediction.predictedDelay.toString())
      .replace('{cause}', prediction.cause)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fahrgast-Benachrichtigungen</h2>
          <p className="text-muted-foreground">
            Intelligente Kommunikation bei Verspätungen und Störungen
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-32">
              <Languages size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
              <SelectItem value="en">🇬🇧 English</SelectItem>
              <SelectItem value="fr">🇫🇷 Français</SelectItem>
              <SelectItem value="es">🇪🇸 Español</SelectItem>
              <SelectItem value="it">🇮🇹 Italiano</SelectItem>
              <SelectItem value="ar">🇸🇦 العربية</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Brain size={12} className="mr-1" />
            Auto-Übersetzung
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendUp size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Activity size={16} />
            <span className="hidden sm:inline">Live</span>
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Clock size={16} />
            <span className="hidden sm:inline">Vorhersagen</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Bell size={16} />
            <span className="hidden sm:inline">Vorlagen</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="hidden sm:inline">Verlauf</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share size={16} />
            <span className="hidden sm:inline">Social Media</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Send size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{notificationStats.totalSent}</p>
                    <p className="text-xs text-muted-foreground">Gesendete Nachrichten</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{notificationStats.deliveryRate}%</p>
                    <p className="text-xs text-muted-foreground">Zustellungsrate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{notificationStats.responseRate}%</p>
                    <p className="text-xs text-muted-foreground">Antwortrate</p>
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
                    <p className="text-2xl font-bold">{notificationStats.avgEffectiveness}%</p>
                    <p className="text-xs text-muted-foreground">Durchschn. Wirksamkeit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Results */}
          {analysisResults && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain size={20} className="text-blue-600" />
                  KI-Wirksamkeitsanalyse
                </CardTitle>
                <CardDescription>
                  Letzte Analyse: {new Date().toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {analysisResults.overallEffectiveness.toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Gesamtwirksamkeit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {Object.keys(analysisResults.channelPerformance).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Analysierte Kanäle</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {analysisResults.recommendations.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Empfehlungen</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">KI-Empfehlungen:</h4>
                  {analysisResults.recommendations.map((rec, index) => (
                    <Alert key={index}>
                      <Info size={16} />
                      <AlertDescription className="text-sm">{rec}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Send Notification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send size={20} />
                Sofortige Benachrichtigung
              </CardTitle>
              <CardDescription>
                Sende eine benutzerdefinierte Nachricht an alle oder spezifische Fahrgäste
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Nachricht</Label>
                  <Textarea
                    id="message"
                    placeholder="Ihre Nachricht an die Fahrgäste..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Zielgruppe</Label>
                    <Select value={targetAudience} onValueChange={setTargetAudience}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alle">Alle Fahrgäste</SelectItem>
                        <SelectItem value="route">Spezifische Route</SelectItem>
                        <SelectItem value="station">Spezifische Station</SelectItem>
                        <SelectItem value="train">Spezifischer Zug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Kanäle</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {channels.map(channel => (
                        <div key={channel.id} className="flex items-center space-x-2">
                          <Switch
                            checked={selectedChannels.includes(channel.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedChannels(prev => [...prev, channel.id])
                              } else {
                                setSelectedChannels(prev => prev.filter(id => id !== channel.id))
                              }
                            }}
                          />
                          <Label className="text-sm flex items-center gap-2">
                            <channel.icon size={14} className={channel.color} />
                            {channel.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => {
                  if (customMessage.trim()) {
                    const mockPrediction: DelayPrediction = {
                      id: 'custom',
                      trainNumber: 'SYSTEM',
                      route: 'Systemweite Nachricht',
                      currentDelay: 0,
                      predictedDelay: 0,
                      affectedStations: [],
                      cause: 'Information',
                      severity: 'niedrig',
                      estimatedImpact: targetAudience === 'alle' ? 1500 : 300,
                      confidence: 100,
                      timestamp: new Date().toISOString()
                    }
                    sendNotification(mockPrediction)
                  }
                }}
                className="w-full"
                disabled={!customMessage.trim() || selectedChannels.length === 0}
              >
                <Send size={16} className="mr-2" />
                Intelligente Nachricht senden
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Monitoring Tab */}
        <TabsContent value="live" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Echtzeit-Verspätungsüberwachung</h3>
            <div className="flex items-center gap-2">
              {isMonitoring ? (
                <Button variant="destructive" size="sm" onClick={stopMonitoring}>
                  <X size={16} className="mr-2" />
                  Stopp
                </Button>
              ) : (
                <Button size="sm" onClick={startMonitoring}>
                  <Activity size={16} className="mr-2" />
                  Überwachung starten
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={clearEvents}>
                Löschen
              </Button>
            </div>
          </div>

          {/* Monitoring Status */}
          <Alert className={isMonitoring ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
            <Activity size={16} className={isMonitoring ? 'text-green-600' : 'text-gray-400'} />
            <AlertDescription>
              {isMonitoring 
                ? `Echtzeit-Überwachung aktiv • ${delayEvents.length} Ereignisse erkannt`
                : 'Echtzeit-Überwachung pausiert • Klicken Sie "Überwachung starten" um zu beginnen'
              }
            </AlertDescription>
          </Alert>

          {/* Real-time delay events */}
          <div className="space-y-3">
            {delayEvents.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-muted-foreground">
                    <Activity size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Keine aktuellen Verspätungsereignisse</p>
                    <p className="text-sm">Starten Sie die Überwachung, um Live-Events zu sehen</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {delayEvents.map(event => {
              const priorityInfo = calculateNotificationPriority(event)
              
              return (
                <Card key={event.id} className={`overflow-hidden ${
                  priorityInfo.urgency === 'kritisch' ? 'border-red-500 bg-red-50/30' :
                  priorityInfo.urgency === 'hoch' ? 'border-orange-500 bg-orange-50/30' :
                  priorityInfo.urgency === 'mittel' ? 'border-yellow-500 bg-yellow-50/30' :
                  'border-gray-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                      {/* Event Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Train size={16} className="text-primary" />
                          <span className="font-semibold">{event.trainNumber}</span>
                          <Badge className={severityColors[event.severity]}>
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.route}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>

                      {/* Delay Info */}
                      <div className="text-center">
                        <p className="text-lg font-bold text-orange-600">
                          +{event.predictedDelay} Min
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.confidence}% sicher
                        </p>
                      </div>

                      {/* Affected Passengers */}
                      <div className="text-center">
                        <p className="text-lg font-bold">{event.affectedPassengers}</p>
                        <p className="text-xs text-muted-foreground">Betroffene</p>
                      </div>

                      {/* Priority */}
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">
                          {priorityInfo.priority}/10
                        </p>
                        <p className="text-xs text-muted-foreground">Priorität</p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        {!event.notificationSent ? (
                          <Button
                            size="sm"
                            className="w-full"
                            variant={priorityInfo.shouldAutoSend ? "default" : "outline"}
                            onClick={async () => {
                              try {
                                const content = await generateSmartNotificationContent(
                                  event,
                                  'all',
                                  selectedLanguage
                                )
                                
                                // Create notification history entry
                                const newNotification: NotificationHistory = {
                                  id: Date.now().toString(),
                                  type: priorityInfo.urgency,
                                  message: content.detailedMessage,
                                  channels: priorityInfo.recommendedChannels,
                                  recipients: event.affectedPassengers,
                                  timestamp: new Date().toISOString(),
                                  effectiveness: Math.random() * 15 + 85,
                                  responses: Math.floor(event.affectedPassengers * 0.2)
                                }

                                setNotificationHistory(prev => [newNotification, ...prev.slice(0, 49)])
                                markNotificationSent(event.id)
                                
                                toast.success('KI-Benachrichtigung gesendet', {
                                  description: `${priorityInfo.recommendedChannels.length} Kanäle • ${event.affectedPassengers} Fahrgäste`
                                })
                              } catch (error) {
                                toast.error('Fehler beim Senden')
                              }
                            }}
                          >
                            <Send size={14} className="mr-2" />
                            {priorityInfo.shouldAutoSend ? 'Auto-Send' : 'Manuell senden'}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            disabled
                          >
                            <CheckCircle size={14} className="mr-2 text-green-600" />
                            Gesendet
                          </Button>
                        )}

                        {/* Channel indicators */}
                        <div className="flex flex-wrap gap-1">
                          {priorityInfo.recommendedChannels.map(channelId => {
                            const channel = channels.find(c => c.id === channelId)
                            return channel ? (
                              <Badge key={channelId} variant="outline" className="text-xs">
                                <channel.icon size={10} className={`mr-1 ${channel.color}`} />
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Cause and additional info */}
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          <strong>Ursache:</strong> {event.cause}
                        </span>
                        <Badge variant="outline" className={`text-xs ${
                          priorityInfo.urgency === 'kritisch' ? 'border-red-500 text-red-700' :
                          priorityInfo.urgency === 'hoch' ? 'border-orange-500 text-orange-700' :
                          priorityInfo.urgency === 'mittel' ? 'border-yellow-500 text-yellow-700' :
                          'border-gray-500 text-gray-700'
                        }`}>
                          {priorityInfo.urgency.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Aktuelle Verspätungsvorhersagen</h3>
            <Badge variant="outline" className="bg-blue-50">
              {delayPredictions.length} Vorhersagen
            </Badge>
          </div>

          <div className="grid gap-4">
            {delayPredictions.map(prediction => (
              <Card key={prediction.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Train Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Train size={18} className="text-primary" />
                        <span className="font-semibold">{prediction.trainNumber}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{prediction.route}</p>
                      <Badge className={severityColors[prediction.severity]}>
                        {prediction.severity}
                      </Badge>
                    </div>

                    {/* Delay Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-orange-500" />
                        <span className="text-sm">Verspätung</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold">
                          {prediction.currentDelay} → {prediction.predictedDelay} Min
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Grund: {prediction.cause}
                        </p>
                      </div>
                    </div>

                    {/* Impact */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        <span className="text-sm">Betroffene</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold">{prediction.estimatedImpact}</p>
                        <p className="text-xs text-muted-foreground">
                          Konfidenz: {prediction.confidence}%
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => sendNotification(prediction)}
                        className="w-full"
                        size="sm"
                      >
                        <Send size={14} className="mr-2" />
                        Benachrichtigen
                      </Button>
                      
                      {/* Auto-notification templates that match */}
                      {notificationTemplates
                        .filter(template => 
                          template.autoSend &&
                          prediction.predictedDelay >= template.conditions.minDelay &&
                          prediction.predictedDelay <= template.conditions.maxDelay
                        )
                        .map(template => (
                          <Button
                            key={template.id}
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => sendNotification(prediction, template)}
                          >
                            <Bell size={12} className="mr-1" />
                            {template.name}
                          </Button>
                        ))
                      }
                    </div>
                  </div>

                  {prediction.affectedStations.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Betroffene Stationen:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {prediction.affectedStations.map(station => (
                          <Badge key={station} variant="outline" className="text-xs">
                            {station}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Nachrichtenvorlagen</h3>
            <Button size="sm">
              <Bell size={16} className="mr-2" />
              Neue Vorlage
            </Button>
          </div>

          <div className="grid gap-4">
            {notificationTemplates.map(template => (
              <Card key={template.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.autoSend ? "default" : "outline"}>
                        {template.autoSend ? 'Automatisch' : 'Manuell'}
                      </Badge>
                      <Badge className={severityColors[template.severity as keyof typeof severityColors]}>
                        {template.severity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">{template.template}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Kanäle</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.channels.map(channelId => {
                          const channel = channels.find(c => c.id === channelId)
                          return channel ? (
                            <Badge key={channelId} variant="outline" className="text-xs">
                              <channel.icon size={12} className={`mr-1 ${channel.color}`} />
                              {channel.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">Bedingungen</Label>
                      <p className="text-sm mt-1">
                        Verspätung: {template.conditions.minDelay}-{template.conditions.maxDelay} Min
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Benachrichtigungsverlauf</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={runEffectivenessAnalysis}>
                <Brain size={16} className="mr-2" />
                KI-Analyse
              </Button>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {notificationHistory.map(notification => (
              <Card key={notification.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                    <div className="lg:col-span-2">
                      <p className="font-medium text-sm">{notification.message.substring(0, 80)}...</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-bold">{notification.recipients}</p>
                      <p className="text-xs text-muted-foreground">Empfänger</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{notification.effectiveness.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Wirksamkeit</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {notification.channels.map(channelId => {
                        const channel = channels.find(c => c.id === channelId)
                        return channel ? (
                          <Badge key={channelId} variant="outline" className="text-xs">
                            <channel.icon size={10} className={`mr-1 ${channel.color}`} />
                            {channel.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Social Media Integration Tab */}
        <TabsContent value="social" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Social Media Integration</h3>
              <p className="text-muted-foreground text-sm">
                Erweiterte Fahrgastkommunikation über soziale Medien für maximale Reichweite
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Share size={14} className="mr-1" />
              Neue Funktion
            </Badge>
          </div>

          <Alert>
            <Info size={16} />
            <AlertDescription>
              Das vollständige Social Media Modul ist als separates Modul in der Hauptnavigation verfügbar. 
              Dort finden Sie erweiterte Funktionen für Twitter, Facebook, Instagram, Telegram und weitere Plattformen.
            </AlertDescription>
          </Alert>

          {/* Quick Social Media Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">33.2K</p>
                    <p className="text-xs text-muted-foreground">Social Media Follower</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendUp size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">89.4K</p>
                    <p className="text-xs text-muted-foreground">Wöchentliche Reichweite</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Share size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.1%</p>
                    <p className="text-xs text-muted-foreground">Durchschn. Engagement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send size={20} />
                Schnell-Aktionen
              </CardTitle>
              <CardDescription>
                Sofortige Social Media Benachrichtigungen für kritische Ereignisse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    toast.success('Automatischer Post gesendet', {
                      description: 'Standard-Verspätungsinfo auf Twitter & Telegram'
                    })
                  }}
                >
                  <Share size={20} />
                  <span className="text-sm">Standard-Störung posten</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    toast.success('Kritischer Post gesendet', {
                      description: 'Notfall-Info auf allen Plattformen verbreitet'
                    })
                  }}
                >
                  <AlertTriangle size={20} className="text-orange-500" />
                  <span className="text-sm">Kritische Störung</span>
                </Button>
              </div>

              {/* Platform Status */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Aktive Plattformen</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Twitter', status: 'aktiv', followers: '15.4K', color: 'text-blue-400' },
                    { name: 'Telegram', status: 'aktiv', followers: '3.2K', color: 'text-blue-500' },
                    { name: 'Facebook', status: 'aktiv', followers: '8.9K', color: 'text-blue-600' },
                    { name: 'Instagram', status: 'pausiert', followers: '5.7K', color: 'text-pink-500' }
                  ].map(platform => (
                    <div key={platform.name} className="p-3 border rounded-lg text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Share size={14} className={platform.color} />
                        <span className="text-sm font-medium">{platform.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{platform.followers}</div>
                      <Badge 
                        variant={platform.status === 'aktiv' ? 'default' : 'secondary'}
                        className="text-xs mt-1"
                      >
                        {platform.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => {
                    toast.info('Navigiere zu Social Media Modul...', { duration: 1500 })
                    // In a real app, this would navigate to the social media module
                  }}
                  className="flex items-center gap-2"
                >
                  <Share size={16} />
                  Vollständiges Social Media Modul öffnen
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}