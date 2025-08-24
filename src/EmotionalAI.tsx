import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Smiley, 
  Heart, 
  Brain, 
  Eye, 
  Activity, 
  TrendUp, 
  Users, 
  Gauge, 
  Clock,
  Target,
  Lightning,
  SmileyMeh,
  SmileyWink,
  SmileySad,
  WarningCircle,
  Pulse,
  FaceMask,
  Microphone,
  CameraRotate,
  CaretUp,
  CaretDown
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface PassengerMood {
  id: string
  carriageId: string
  trainId: string
  location: { seat?: string; area: string }
  detectedMood: 'glücklich' | 'neutral' | 'gestresst' | 'unzufrieden' | 'ängstlich' | 'aufgeregt'
  confidence: number
  timestamp: string
  ageGroup: 'kind' | 'jugendlich' | 'erwachsen' | 'senior'
  gender: 'männlich' | 'weiblich' | 'unbestimmt'
  travelGroup: 'allein' | 'paar' | 'familie' | 'gruppe'
  serviceRequests: string[]
  satisfaction: number
}

interface ServiceRecommendation {
  id: string
  type: 'komfort' | 'information' | 'unterhaltung' | 'gastronomie' | 'assistance'
  priority: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
  description: string
  targetPassengers: string[]
  estimatedImpact: number
  cost: number
  implementation: string
}

interface MoodAnalytics {
  totalPassengers: number
  averageSatisfaction: number
  moodDistribution: { [key: string]: number }
  serviceRequests: number
  happinessIndex: number
  stressLevel: number
  proactiveActions: number
}

export default function EmotionalAI() {
  const [passengerMoods, setPassengerMoods] = useKV<PassengerMood[]>('passenger-moods', [
    {
      id: 'pass-001',
      carriageId: 'wagen-2',
      trainId: 'ICE-4501',
      location: { seat: '15A', area: 'Ruhebereich' },
      detectedMood: 'gestresst',
      confidence: 87.3,
      timestamp: new Date(Date.now() - 5000).toISOString(),
      ageGroup: 'erwachsen',
      gender: 'weiblich',
      travelGroup: 'allein',
      serviceRequests: ['Getränk', 'Kopfhörer'],
      satisfaction: 45
    },
    {
      id: 'pass-002',
      carriageId: 'wagen-1',
      trainId: 'ICE-4501',
      location: { seat: '8C', area: 'Familienbereich' },
      detectedMood: 'glücklich',
      confidence: 94.1,
      timestamp: new Date(Date.now() - 12000).toISOString(),
      ageGroup: 'kind',
      gender: 'männlich',
      travelGroup: 'familie',
      serviceRequests: ['Spielzeug'],
      satisfaction: 92
    },
    {
      id: 'pass-003',
      carriageId: 'wagen-3',
      trainId: 'ICE-4501',
      location: { area: 'Bistro' },
      detectedMood: 'unzufrieden',
      confidence: 76.8,
      timestamp: new Date(Date.now() - 8000).toISOString(),
      ageGroup: 'senior',
      gender: 'männlich',
      travelGroup: 'paar',
      serviceRequests: ['Beschwerde', 'Personal'],
      satisfaction: 32
    },
    {
      id: 'pass-004',
      carriageId: 'wagen-2',
      trainId: 'ICE-4501',
      location: { seat: '23B', area: 'Business' },
      detectedMood: 'aufgeregt',
      confidence: 91.5,
      timestamp: new Date(Date.now() - 3000).toISOString(),
      ageGroup: 'erwachsen',
      gender: 'weiblich',
      travelGroup: 'allein',
      serviceRequests: ['WLAN-Premium'],
      satisfaction: 78
    }
  ])

  const [serviceRecommendations, setServiceRecommendations] = useKV<ServiceRecommendation[]>('service-recommendations', [
    {
      id: 'rec-001',
      type: 'komfort',
      priority: 'hoch',
      description: 'Kostenlose Premium-Getränke für gestresste Passagiere in Wagen 2',
      targetPassengers: ['pass-001'],
      estimatedImpact: 85,
      cost: 12,
      implementation: 'Personal benachrichtigen'
    },
    {
      id: 'rec-002',
      type: 'unterhaltung',
      priority: 'mittel',
      description: 'Kinderfilme für Familie in Wagen 1 aktivieren',
      targetPassengers: ['pass-002'],
      estimatedImpact: 75,
      cost: 0,
      implementation: 'Automatisch verfügbar machen'
    },
    {
      id: 'rec-003',
      type: 'assistance',
      priority: 'kritisch',
      description: 'Personal zu unzufriedenem Passagier im Bistro entsenden',
      targetPassengers: ['pass-003'],
      estimatedImpact: 95,
      cost: 25,
      implementation: 'Sofortiges Personal-Dispatch'
    }
  ])

  const [moodAnalytics, setMoodAnalytics] = useKV<MoodAnalytics>('mood-analytics', {
    totalPassengers: 287,
    averageSatisfaction: 73.2,
    moodDistribution: {
      'glücklich': 45,
      'neutral': 32,
      'gestresst': 12,
      'unzufrieden': 8,
      'ängstlich': 2,
      'aufgeregt': 1
    },
    serviceRequests: 47,
    happinessIndex: 78.5,
    stressLevel: 18.3,
    proactiveActions: 23
  })

  const [selectedPassenger, setSelectedPassenger] = useState<string>('pass-001')

  useEffect(() => {
    const interval = setInterval(() => {
      // Simuliere Echtzeit-Updates der Passagier-Stimmungen
      setPassengerMoods(prev => prev.map(passenger => ({
        ...passenger,
        confidence: Math.max(60, Math.min(99, passenger.confidence + (Math.random() - 0.5) * 5)),
        satisfaction: Math.max(0, Math.min(100, passenger.satisfaction + (Math.random() - 0.5) * 8)),
        timestamp: Math.random() < 0.1 ? new Date().toISOString() : passenger.timestamp
      })))

      // Update Analytics
      setMoodAnalytics(prev => ({
        ...prev,
        averageSatisfaction: passengerMoods.reduce((sum, p) => sum + p.satisfaction, 0) / passengerMoods.length,
        happinessIndex: Math.max(70, Math.min(90, prev.happinessIndex + (Math.random() - 0.5) * 3)),
        stressLevel: Math.max(10, Math.min(30, prev.stressLevel + (Math.random() - 0.5) * 2)),
        proactiveActions: prev.proactiveActions + (Math.random() < 0.05 ? 1 : 0)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [passengerMoods])

  const handleServiceAction = (recommendationId: string) => {
    const recommendation = serviceRecommendations.find(r => r.id === recommendationId)
    if (recommendation) {
      // Update betroffene Passagiere
      setPassengerMoods(prev => prev.map(p => 
        recommendation.targetPassengers.includes(p.id)
          ? { ...p, satisfaction: Math.min(100, p.satisfaction + recommendation.estimatedImpact * 0.3) }
          : p
      ))
      
      // Entferne erledigte Empfehlung
      setServiceRecommendations(prev => prev.filter(r => r.id !== recommendationId))
      
      toast.success(`Service-Aktion "${recommendation.description}" ausgeführt`)
    }
  }

  const handleProactiveService = () => {
    // Finde Passagiere mit niedriger Zufriedenheit
    const lowSatisfactionPassengers = passengerMoods.filter(p => p.satisfaction < 60)
    
    if (lowSatisfactionPassengers.length > 0) {
      const newRecommendation: ServiceRecommendation = {
        id: `rec-${Date.now()}`,
        type: 'komfort',
        priority: 'hoch',
        description: `Proaktive Komfort-Maßnahmen für ${lowSatisfactionPassengers.length} Passagiere`,
        targetPassengers: lowSatisfactionPassengers.map(p => p.id),
        estimatedImpact: 70,
        cost: lowSatisfactionPassengers.length * 8,
        implementation: 'Personalisierte Angebote'
      }
      
      setServiceRecommendations(prev => [...prev, newRecommendation])
      setMoodAnalytics(prev => ({ ...prev, proactiveActions: prev.proactiveActions + 1 }))
      toast.success('Proaktive Service-Empfehlungen generiert')
    }
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'glücklich': return <Smiley size={20} className="text-green-500" />
      case 'neutral': return <SmileyMeh size={20} className="text-gray-500" />
      case 'gestresst': return <SmileySad size={20} className="text-orange-500" />
      case 'unzufrieden': return <SmileySad size={20} className="text-red-500" />
      case 'ängstlich': return <WarningCircle size={20} className="text-red-600" />
      case 'aufgeregt': return <SmileyWink size={20} className="text-blue-500" />
      default: return <SmileyMeh size={20} className="text-gray-500" />
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'glücklich': return 'text-green-600 bg-green-50 border-green-200'
      case 'neutral': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'gestresst': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'unzufrieden': return 'text-red-600 bg-red-50 border-red-200'
      case 'ängstlich': return 'text-red-700 bg-red-100 border-red-300'
      case 'aufgeregt': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'kritisch': return 'destructive'
      case 'hoch': return 'default'
      case 'mittel': return 'secondary'
      case 'niedrig': return 'outline'
      default: return 'outline'
    }
  }

  const currentPassenger = passengerMoods.find(p => p.id === selectedPassenger)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
            <Heart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Emotionale KI</h1>
            <p className="text-muted-foreground">Erkennung von Fahrgast-Stimmungen für besseren Service</p>
          </div>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Glücks-Index</p>
                <p className="text-2xl font-bold text-green-600">{moodAnalytics.happinessIndex.toFixed(1)}%</p>
              </div>
              <Smiley size={24} className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Durchschn. Zufriedenheit</p>
                <p className="text-2xl font-bold text-blue-600">{moodAnalytics.averageSatisfaction.toFixed(1)}%</p>
              </div>
              <TrendUp size={24} className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stress-Level</p>
                <p className="text-2xl font-bold text-orange-600">{moodAnalytics.stressLevel.toFixed(1)}%</p>
              </div>
              <Pulse size={24} className="text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Proaktive Aktionen</p>
                <p className="text-2xl font-bold text-purple-600">{moodAnalytics.proactiveActions}</p>
              </div>
              <Lightning size={24} className="text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="passengers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="passengers">Passagier-Stimmungen</TabsTrigger>
          <TabsTrigger value="recommendations">Service-Empfehlungen</TabsTrigger>
          <TabsTrigger value="analytics">Stimmungs-Analyse</TabsTrigger>
          <TabsTrigger value="controls">Steuerung</TabsTrigger>
        </TabsList>

        <TabsContent value="passengers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Passenger List */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold">Erkannte Passagiere</h3>
              {passengerMoods.map(passenger => (
                <Card 
                  key={passenger.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPassenger === passenger.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedPassenger(passenger.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{passenger.location.seat || passenger.location.area}</div>
                      <div className="flex items-center gap-2">
                        {getMoodIcon(passenger.detectedMood)}
                        <Badge variant="outline" className={getMoodColor(passenger.detectedMood)}>
                          {passenger.detectedMood}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>{passenger.trainId} • {passenger.carriageId}</div>
                      <div>Zufriedenheit: {passenger.satisfaction}%</div>
                      <div>Vertrauen: {passenger.confidence.toFixed(0)}%</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Passenger Details */}
            {currentPassenger && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye size={20} />
                      Passagier-Analyse - {currentPassenger.location.seat || currentPassenger.location.area}
                    </CardTitle>
                    <CardDescription>
                      {currentPassenger.trainId} • {currentPassenger.carriageId} • 
                      Letztes Update: {new Date(currentPassenger.timestamp).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stimmung und Metriken */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getMoodIcon(currentPassenger.detectedMood)}
                          <span className="text-sm font-medium">Stimmung</span>
                        </div>
                        <div className="text-2xl font-bold capitalize">
                          {currentPassenger.detectedMood}
                        </div>
                        <Progress value={currentPassenger.confidence} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {currentPassenger.confidence.toFixed(1)}% Vertrauen
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Heart size={16} className="text-red-500" />
                          <span className="text-sm font-medium">Zufriedenheit</span>
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {currentPassenger.satisfaction}%
                        </div>
                        <Progress value={currentPassenger.satisfaction} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {currentPassenger.satisfaction >= 80 ? 'Sehr zufrieden' :
                           currentPassenger.satisfaction >= 60 ? 'Zufrieden' :
                           currentPassenger.satisfaction >= 40 ? 'Neutral' : 'Unzufrieden'}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-blue-500" />
                          <span className="text-sm font-medium">Reisegruppe</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600 capitalize">
                          {currentPassenger.travelGroup}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {currentPassenger.ageGroup} • {currentPassenger.gender}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-green-500" />
                          <span className="text-sm font-medium">Service-Requests</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {currentPassenger.serviceRequests.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Aktive Anfragen
                        </div>
                      </div>
                    </div>

                    {/* Service-Requests */}
                    {currentPassenger.serviceRequests.length > 0 && (
                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target size={16} className="text-primary" />
                          <span className="font-medium">Service-Anfragen</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentPassenger.serviceRequests.map((request, index) => (
                            <Badge key={index} variant="outline">
                              {request}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* KI-Erkennungsdetails */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CameraRotate size={16} className="text-primary" />
                          <span className="font-medium">Visuelle Analyse</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Gesichtsausdruck:</span>
                            <span className="font-medium">{currentPassenger.detectedMood}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Körperhaltung:</span>
                            <span className="font-medium">
                              {currentPassenger.satisfaction > 70 ? 'Entspannt' : 
                               currentPassenger.satisfaction > 40 ? 'Neutral' : 'Angespannt'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Augenkontakt:</span>
                            <span className="font-medium">
                              {currentPassenger.confidence > 80 ? 'Direkt' : 'Vermeidend'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Microphone size={16} className="text-primary" />
                          <span className="font-medium">Audio-Analyse</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Tonlage:</span>
                            <span className="font-medium">
                              {currentPassenger.detectedMood === 'gestresst' ? 'Erhöht' :
                               currentPassenger.detectedMood === 'glücklich' ? 'Freundlich' : 'Normal'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lautstärke:</span>
                            <span className="font-medium">
                              {currentPassenger.detectedMood === 'unzufrieden' ? 'Laut' : 'Moderat'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sprachmuster:</span>
                            <span className="font-medium">
                              {currentPassenger.confidence > 85 ? 'Klar' : 'Unregelmäßig'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">KI-generierte Service-Empfehlungen</h3>
            <Button onClick={handleProactiveService}>
              <Lightning size={16} className="mr-2" />
              Proaktive Analyse
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceRecommendations.map(recommendation => (
              <Card key={recommendation.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{recommendation.id}</CardTitle>
                    <Badge variant={getPriorityColor(recommendation.priority) as any}>
                      {recommendation.priority}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {recommendation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Erwarteter Impact</span>
                      <span className="font-medium text-green-600">{recommendation.estimatedImpact}%</span>
                    </div>
                    <Progress value={recommendation.estimatedImpact} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Betroffene Passagiere</div>
                      <div className="font-medium">{recommendation.targetPassengers.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Kosten</div>
                      <div className="font-medium">{recommendation.cost}€</div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-muted-foreground mb-1">Umsetzung:</div>
                    <div className="font-medium">{recommendation.implementation}</div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleServiceAction(recommendation.id)}
                    variant={recommendation.priority === 'kritisch' ? 'destructive' : 'default'}
                  >
                    Service ausführen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stimmungs-Verteilung & Analyse</CardTitle>
              <CardDescription>
                Echtzeit-Analyse der Passagier-Stimmungen und Zufriedenheit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Stimmungs-Verteilung</h4>
                  {Object.entries(moodAnalytics.moodDistribution).map(([mood, percentage]) => (
                    <div key={mood} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getMoodIcon(mood)}
                          <span className="capitalize">{mood}</span>
                        </div>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Service-Metriken</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Gesamt-Passagiere</span>
                        <span className="font-bold text-lg">{moodAnalytics.totalPassengers}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Service-Anfragen</span>
                        <span className="font-bold text-lg">{moodAnalytics.serviceRequests}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Proaktive Aktionen</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-lg">{moodAnalytics.proactiveActions}</span>
                          <CaretUp size={16} className="text-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Brain size={16} />
                <AlertDescription>
                  Emotionale KI erkennt durchschnittlich {moodAnalytics.happinessIndex.toFixed(1)}% Glücks-Index 
                  bei {moodAnalytics.stressLevel.toFixed(1)}% Stress-Level. 
                  {moodAnalytics.proactiveActions} proaktive Service-Maßnahmen wurden heute initiiert.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>KI-Steuerung</CardTitle>
                <CardDescription>
                  Zentrale Kontrolle der emotionalen KI-Systeme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={handleProactiveService}>
                  <Lightning size={16} className="mr-2" />
                  Proaktive Service-Analyse
                </Button>
                <Button variant="outline" className="w-full">
                  <FaceMask size={16} className="mr-2" />
                  Gesichtserkennung kalibrieren
                </Button>
                <Button variant="outline" className="w-full">
                  <Microphone size={16} className="mr-2" />
                  Audio-Analyse optimieren
                </Button>
                <Button variant="outline" className="w-full">
                  <Gauge size={16} className="mr-2" />
                  System-Diagnostik
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service-Automatisierung</CardTitle>
                <CardDescription>
                  Automatische Reaktionen auf erkannte Stimmungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { trigger: 'Stress erkannt', action: 'Beruhigende Musik', auto: true },
                  { trigger: 'Unzufriedenheit', action: 'Personal-Benachrichtigung', auto: true },
                  { trigger: 'Angst erkannt', action: 'Sicherheitspersonal', auto: false },
                  { trigger: 'Hohe Zufriedenheit', action: 'Loyalty-Punkte vergeben', auto: true }
                ].map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <div className="font-medium">{rule.trigger}</div>
                      <div className="text-sm text-muted-foreground">{rule.action}</div>
                    </div>
                    <Badge variant={rule.auto ? 'default' : 'outline'}>
                      {rule.auto ? 'Auto' : 'Manuell'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}