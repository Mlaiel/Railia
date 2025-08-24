/**
 * SmartRail-AI - Krisenkommuikation mit KI-gesteuerten Eskalationsprotokollen
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
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Siren, 
  Brain, 
  Users, 
  Phone, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Megaphone,
  Target,
  Activity,
  TrendUp,
  Zap,
  Shield
} from '@phosphor-icons/react'

interface CrisisEvent {
  id: string
  type: 'severe_delay' | 'technical_failure' | 'safety_incident' | 'weather_emergency' | 'medical_emergency'
  severity: 1 | 2 | 3 | 4 | 5 // 1: minor, 5: critical
  title: string
  description: string
  location: string
  timestamp: string
  status: 'active' | 'escalating' | 'resolving' | 'resolved'
  aiRecommendation: string
  escalationLevel: number
  affectedPassengers: number
  estimatedDuration: number // minutes
  communicationChannels: string[]
  keyStakeholders: string[]
}

interface EscalationProtocol {
  level: number
  name: string
  triggerConditions: string[]
  actions: string[]
  stakeholders: string[]
  timeframe: number // minutes
  channels: string[]
}

const CrisisCommunication = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false)
  
  const [crisisEvents, setCrisisEvents] = useKV<CrisisEvent[]>('crisis-events', [
    {
      id: 'crisis-001',
      type: 'technical_failure',
      severity: 4,
      title: 'Stellwerks-Ausfall München Hauptbahnhof',
      description: 'Vollständiger Ausfall der Stellwerkstechnik, alle Fernverkehrszüge betroffen',
      location: 'München Hbf',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      status: 'escalating',
      aiRecommendation: 'Sofortige Aktivierung Ersatzfahrplan und Busnotverkehr. Fahrgäste über alle Kanäle informieren.',
      escalationLevel: 3,
      affectedPassengers: 15000,
      estimatedDuration: 180,
      communicationChannels: ['app', 'website', 'social_media', 'station_announcements', 'media'],
      keyStakeholders: ['DB_Operations', 'Transport_Ministry', 'Emergency_Services', 'Media_Relations']
    },
    {
      id: 'crisis-002',
      type: 'weather_emergency',
      severity: 3,
      title: 'Sturm "Ylenia" - Streckensperrungen',
      description: 'Umgestürzte Bäume blockieren mehrere Streckenabschnitte in Norddeutschland',
      location: 'Hamburg-Bremen Strecke',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      status: 'active',
      aiRecommendation: 'Umleitung über Hannover aktivieren. Proaktive Fahrgastinformation über Verspätungen.',
      escalationLevel: 2,
      affectedPassengers: 8500,
      estimatedDuration: 240,
      communicationChannels: ['app', 'website', 'social_media'],
      keyStakeholders: ['DB_Operations', 'Weather_Service', 'Maintenance_Teams']
    }
  ])

  const [escalationProtocols] = useKV<EscalationProtocol[]>('escalation-protocols', [
    {
      level: 1,
      name: 'Standard-Information',
      triggerConditions: ['Verspätung > 15 Min', 'Betroffene Fahrgäste < 1000'],
      actions: ['App-Benachrichtigung', 'Website-Update', 'Automatische Ansagen'],
      stakeholders: ['Fahrdienstleiter', 'Kundenservice'],
      timeframe: 5,
      channels: ['app', 'website', 'station_announcements']
    },
    {
      level: 2,
      name: 'Erweiterte Kommunikation',
      triggerConditions: ['Verspätung > 30 Min', 'Betroffene Fahrgäste 1000-5000'],
      actions: ['Social Media Posts', 'Pressemitteilung vorbereiten', 'Ersatzverkehr prüfen'],
      stakeholders: ['Regionalleitung', 'PR-Team', 'Ersatzverkehr'],
      timeframe: 15,
      channels: ['app', 'website', 'social_media', 'station_announcements']
    },
    {
      level: 3,
      name: 'Krisen-Management',
      triggerConditions: ['Verspätung > 60 Min', 'Betroffene Fahrgäste > 5000', 'Sicherheitsrelevant'],
      actions: ['Krisenstab aktivieren', 'Medien informieren', 'Ersatzverkehr aktivieren'],
      stakeholders: ['Geschäftsführung', 'Behörden', 'Medien', 'Krisenstab'],
      timeframe: 30,
      channels: ['app', 'website', 'social_media', 'station_announcements', 'media', 'authorities']
    },
    {
      level: 4,
      name: 'Notfall-Protokoll',
      triggerConditions: ['Personenschaden', 'Infrastruktur-Katastrophe', 'Betroffene > 10000'],
      actions: ['Rettungsdienste', 'Bundesweite Medien', 'Ministerium informieren'],
      stakeholders: ['Rettungsdienste', 'Bundesbehörden', 'Krisenmanagement', 'Nationale Medien'],
      timeframe: 10,
      channels: ['all', 'emergency_services', 'government', 'national_media']
    }
  ])

  const [communicationStats, setCommunicationStats] = useKV('communication-stats', {
    messagesProcessed: 1247,
    avgResponseTime: 3.2,
    escalationAccuracy: 94,
    passengerSatisfaction: 4.2,
    channelEffectiveness: {
      app: 96,
      website: 89,
      social_media: 91,
      station_announcements: 87,
      media: 85
    }
  })

  const runAIAnalysis = async (eventId: string) => {
    setIsAIAnalyzing(true)
    
    try {
      const event = crisisEvents.find(e => e.id === eventId)
      if (!event) return

      const prompt = spark.llmPrompt`
        Analysiere diese Krisensituation für automatische Eskalation:
        
        Ereignis: ${event.title}
        Beschreibung: ${event.description}
        Schweregrad: ${event.severity}/5
        Betroffene Fahrgäste: ${event.affectedPassengers}
        Geschätzte Dauer: ${event.estimatedDuration} Minuten
        
        Bewerte:
        1. Optimalen Eskalationslevel (1-4)
        2. Kommunikationsstrategie für nächste 60 Minuten
        3. Prioritäre Zielgruppen
        4. Empfohlene Kanäle
        5. Kritische Nachrichten-Inhalte
        
        Format: JSON mit klaren Handlungsempfehlungen
      `
      
      const result = await spark.llm(prompt, 'gpt-4o', true)
      const analysis = JSON.parse(result)
      
      // Update event with AI recommendation
      setCrisisEvents(current => 
        current.map(e => 
          e.id === eventId 
            ? { 
                ...e, 
                aiRecommendation: analysis.communicationStrategy,
                escalationLevel: analysis.escalationLevel 
              }
            : e
        )
      )
      
      toast.success('KI-Analyse abgeschlossen', {
        description: `Eskalationslevel ${analysis.escalationLevel} empfohlen`
      })
      
    } catch (error) {
      toast.error('KI-Analyse fehlgeschlagen', {
        description: 'Fallback auf Standard-Protokolle'
      })
    } finally {
      setIsAIAnalyzing(false)
    }
  }

  const executeEscalation = (eventId: string, level: number) => {
    const protocol = escalationProtocols.find(p => p.level === level)
    if (!protocol) return

    setCrisisEvents(current =>
      current.map(e =>
        e.id === eventId
          ? { ...e, escalationLevel: level, status: 'escalating' as const }
          : e
      )
    )

    toast.success(`Eskalation Level ${level} aktiviert`, {
      description: `${protocol.name} wird ausgeführt`
    })

    // Simulate protocol execution
    setTimeout(() => {
      toast.info('Kommunikation gestartet', {
        description: `${protocol.channels.length} Kanäle aktiviert`
      })
    }, 2000)
  }

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 1: return 'bg-green-100 text-green-800 border-green-200'
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200'
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 4: return 'bg-orange-100 text-orange-800 border-orange-200'
      case 5: return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'escalating': return 'bg-orange-100 text-orange-800'
      case 'resolving': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Siren size={18} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Krisen-Kommunikation</h2>
            <p className="text-sm text-muted-foreground">KI-gesteuerte Eskalationsprotokolle</p>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nachrichten verarbeitet</p>
                <p className="text-lg font-semibold">{communicationStats.messagesProcessed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ø Reaktionszeit</p>
                <p className="text-lg font-semibold">{communicationStats.avgResponseTime} Min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eskalations-Genauigkeit</p>
                <p className="text-lg font-semibold">{communicationStats.escalationAccuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users size={16} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fahrgast-Zufriedenheit</p>
                <p className="text-lg font-semibold">{communicationStats.passengerSatisfaction}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Übersicht</TabsTrigger>
          <TabsTrigger value="active-crisis">Aktive Krisen</TabsTrigger>
          <TabsTrigger value="protocols">Protokolle</TabsTrigger>
          <TabsTrigger value="analytics">Analytik</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Active Crisis Alert */}
          {crisisEvents.filter(e => e.status === 'active' || e.status === 'escalating').length > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>{crisisEvents.filter(e => e.status === 'active' || e.status === 'escalating').length} aktive Krisenereignisse</strong> erfordern Aufmerksamkeit
              </AlertDescription>
            </Alert>
          )}

          {/* Recent Crisis Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={18} />
                Aktuelle Ereignisse
              </CardTitle>
              <CardDescription>Krisenereignisse der letzten 24 Stunden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crisisEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge className={getSeverityColor(event.severity)}>
                          Level {event.severity}
                        </Badge>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📍 {event.location}</span>
                        <span>👥 {event.affectedPassengers.toLocaleString()} Fahrgäste</span>
                        <span>⏱️ {event.estimatedDuration} Min</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => runAIAnalysis(event.id)}
                        disabled={isAIAnalyzing}
                        className="text-xs"
                      >
                        <Brain size={14} className="mr-1" />
                        KI-Analyse
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executeEscalation(event.id, event.escalationLevel + 1)}
                        className="text-xs"
                      >
                        <TrendUp size={14} className="mr-1" />
                        Eskalieren
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-crisis" className="space-y-6">
          {crisisEvents.filter(e => e.status === 'active' || e.status === 'escalating').map(event => (
            <Card key={event.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      {event.title}
                      <Badge className={getSeverityColor(event.severity)}>
                        Stufe {event.severity}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Crisis Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Standort</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Betroffene Fahrgäste</p>
                    <p className="text-sm text-muted-foreground">{event.affectedPassengers.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Geschätzte Dauer</p>
                    <p className="text-sm text-muted-foreground">{event.estimatedDuration} Minuten</p>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Brain size={16} className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">KI-Empfehlung</p>
                      <p className="text-sm text-blue-700">{event.aiRecommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Current Escalation Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aktueller Eskalationslevel</span>
                    <Badge variant="outline">{event.escalationLevel}/4</Badge>
                  </div>
                  <Progress value={(event.escalationLevel / 4) * 100} className="h-2" />
                </div>

                {/* Communication Channels */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Aktive Kommunikationskanäle</p>
                  <div className="flex flex-wrap gap-2">
                    {event.communicationChannels.map(channel => (
                      <Badge key={channel} variant="secondary" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => runAIAnalysis(event.id)}
                    disabled={isAIAnalyzing}
                  >
                    <Brain size={14} className="mr-2" />
                    {isAIAnalyzing ? 'Analysiere...' : 'KI-Analyse'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => executeEscalation(event.id, Math.min(event.escalationLevel + 1, 4))}
                    disabled={event.escalationLevel >= 4}
                  >
                    <TrendUp size={14} className="mr-2" />
                    Eskalieren
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCrisisEvents(current =>
                        current.map(e =>
                          e.id === event.id
                            ? { ...e, status: 'resolved' as const }
                            : e
                        )
                      )
                      toast.success('Krise als gelöst markiert')
                    }}
                  >
                    <CheckCircle size={14} className="mr-2" />
                    Als gelöst markieren
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {crisisEvents.filter(e => e.status === 'active' || e.status === 'escalating').length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Keine aktiven Krisen</h3>
                <p className="text-muted-foreground">Alle Systeme laufen normal</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="protocols" className="space-y-6">
          <div className="grid gap-6">
            {escalationProtocols.map(protocol => (
              <Card key={protocol.level}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        protocol.level === 1 ? 'bg-green-100' :
                        protocol.level === 2 ? 'bg-blue-100' :
                        protocol.level === 3 ? 'bg-orange-100' :
                        'bg-red-100'
                      }`}>
                        <span className={`font-bold text-sm ${
                          protocol.level === 1 ? 'text-green-600' :
                          protocol.level === 2 ? 'text-blue-600' :
                          protocol.level === 3 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {protocol.level}
                        </span>
                      </div>
                      {protocol.name}
                    </CardTitle>
                    <Badge variant="outline">
                      {protocol.timeframe} Min Reaktionszeit
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Auslöser-Bedingungen</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {protocol.triggerConditions.map((condition, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Maßnahmen</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {protocol.actions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Beteiligte Stakeholder</h4>
                    <div className="flex flex-wrap gap-2">
                      {protocol.stakeholders.map(stakeholder => (
                        <Badge key={stakeholder} variant="secondary" className="text-xs">
                          {stakeholder}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Kommunikationskanäle</h4>
                    <div className="flex flex-wrap gap-2">
                      {protocol.channels.map(channel => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Channel Effectiveness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp size={18} />
                Kanal-Effektivität
              </CardTitle>
              <CardDescription>Leistung der verschiedenen Kommunikationskanäle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(communicationStats.channelEffectiveness).map(([channel, effectiveness]) => (
                  <div key={channel} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{channel.replace('_', ' ')}</span>
                      <span className="text-sm text-muted-foreground">{effectiveness}%</span>
                    </div>
                    <Progress value={effectiveness} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap size={18} />
                  Reaktionszeiten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Level 1 Protokoll</span>
                    <span className="text-sm font-medium">2.1 Min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Level 2 Protokoll</span>
                    <span className="text-sm font-medium">4.3 Min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Level 3 Protokoll</span>
                    <span className="text-sm font-medium">8.7 Min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Level 4 Protokoll</span>
                    <span className="text-sm font-medium">3.2 Min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={18} />
                  KI-Leistung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Eskalations-Genauigkeit</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Falsch-Positive Rate</span>
                    <span className="text-sm font-medium">3.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verarbeitungszeit</span>
                    <span className="text-sm font-medium">1.8 Sek</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vertrauen Schwellwert</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CrisisCommunication