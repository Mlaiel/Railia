/**
 * SmartRail-AI - Intelligente Echtzeit-Kapazitätsvorhersage
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  TrendingUp,
  Clock,
  MapPin,
  Gauge,
  Activity,
  AlertTriangle,
  Train,
  ArrowUp,
  ArrowDown,
  Minus,
  BarChart3,
  Eye,
  Zap,
  Target,
  Calendar,
  Timer,
  CheckCircle,
  XCircle,
  Warning,
  Info,
  Crosshair,
  Lightning
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CapacityPrediction {
  id: string
  trainId: string
  route: string
  currentCapacity: number
  predictedCapacity: number
  timeHorizon: number
  confidence: number
  factors: string[]
  recommendations: string[]
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
}

interface StationLoad {
  stationName: string
  currentLoad: number
  predictedLoad: number
  peakTime: string
  bottleneckRisk: number
  alternativeRoutes: string[]
}

interface CapacityMetrics {
  averageUtilization: number
  peakUtilization: number
  overcrowdingIncidents: number
  capacityOptimization: number
  predictiveAccuracy: number
  passengersRerouted: number
}

const RealTimeCapacityPredictor = () => {
  const [activeTab, setActiveTab] = useState('predictions')
  const [timeHorizon, setTimeHorizon] = useState('30')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const [capacityPredictions, setCapacityPredictions] = useKV<CapacityPrediction[]>('capacity-predictions', [
    {
      id: 'cap-1',
      trainId: 'ICE 571',
      route: 'Hamburg → München',
      currentCapacity: 78,
      predictedCapacity: 95,
      timeHorizon: 25,
      confidence: 89.4,
      factors: ['Rush Hour', 'Event in München', 'Wetter'],
      recommendations: ['Zusatzwagen bereitstellen', 'Fahrgäste umleiten', 'Frühwarnung senden'],
      criticalityLevel: 'high',
      timestamp: new Date().toISOString()
    },
    {
      id: 'cap-2',
      trainId: 'RE 4234',
      route: 'Berlin → Frankfurt',
      currentCapacity: 45,
      predictedCapacity: 62,
      timeHorizon: 18,
      confidence: 82.7,
      factors: ['Geschäftsverkehr', 'Anschlussverbindung'],
      recommendations: ['Monitoring verstärken', 'Alternative kommunizieren'],
      criticalityLevel: 'medium',
      timestamp: new Date().toISOString()
    }
  ])

  const [stationLoads, setStationLoads] = useKV<StationLoad[]>('station-loads', [
    {
      stationName: 'Frankfurt Hbf',
      currentLoad: 82,
      predictedLoad: 96,
      peakTime: '17:45',
      bottleneckRisk: 85,
      alternativeRoutes: ['Frankfurt Süd', 'Offenbach']
    },
    {
      stationName: 'München Hbf',
      currentLoad: 67,
      predictedLoad: 89,
      peakTime: '18:15',
      bottleneckRisk: 72,
      alternativeRoutes: ['München Ost', 'München Pasing']
    },
    {
      stationName: 'Berlin Hbf',
      currentLoad: 91,
      predictedLoad: 98,
      peakTime: '17:30',
      bottleneckRisk: 94,
      alternativeRoutes: ['Berlin Ostbahnhof', 'Berlin Gesundbrunnen']
    }
  ])

  const [capacityMetrics, setCapacityMetrics] = useKV<CapacityMetrics>('capacity-metrics', {
    averageUtilization: 73.2,
    peakUtilization: 94.8,
    overcrowdingIncidents: 12,
    capacityOptimization: 87.4,
    predictiveAccuracy: 91.3,
    passengersRerouted: 2847
  })

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getCapacityColor = (capacity: number) => {
    if (capacity < 60) return 'text-green-600'
    if (capacity < 80) return 'text-yellow-600'
    if (capacity < 95) return 'text-orange-600'
    return 'text-red-600'
  }

  const getTrendIcon = (current: number, predicted: number) => {
    const diff = predicted - current
    if (diff > 5) return <ArrowUp size={16} className="text-red-500" />
    if (diff < -5) return <ArrowDown size={16} className="text-green-500" />
    return <Minus size={16} className="text-gray-500" />
  }

  const analyzeCapacity = async () => {
    setIsAnalyzing(true)
    
    try {
      const prompt = spark.llmPrompt`
        Analysiere Kapazitätsauslastung im deutschen Bahnnetz:
        - Vorhersage Fahrgastaufkommen
        - Identifiziere Überlastungsrisiken
        - Berechne Waggon-Auslastung
        - Optimiere Kapazitätsverteilung
        - Empfehle Umleitung von Fahrgästen
        Zeitraum: ${timeHorizon} Minuten
      `
      
      await spark.llm(prompt)
      
      // Generiere neue Kapazitätsvorhersage
      const trainIds = ['ICE 847', 'RE 2841', 'IC 1205', 'RB 3456', 'S3', 'S7']
      const routes = [
        'Hamburg → München', 
        'Berlin → Frankfurt', 
        'Köln → Dresden', 
        'Stuttgart → Bremen',
        'München → Nürnberg',
        'Frankfurt → Kassel'
      ]
      
      const newPrediction: CapacityPrediction = {
        id: `cap-${Date.now()}`,
        trainId: trainIds[Math.floor(Math.random() * trainIds.length)],
        route: routes[Math.floor(Math.random() * routes.length)],
        currentCapacity: Math.floor(Math.random() * 40) + 40,
        predictedCapacity: Math.floor(Math.random() * 30) + 70,
        timeHorizon: parseInt(timeHorizon),
        confidence: Math.round((Math.random() * 20 + 75) * 10) / 10,
        factors: [
          'Rush Hour', 
          'Event-Verkehr', 
          'Wetterbedingt', 
          'Anschlussverbindungen',
          'Feiertag',
          'Bauarbeiten'
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        recommendations: [
          'Zusatzkapazität bereitstellen',
          'Fahrgäste über Alternativen informieren',
          'Dynamische Preisgestaltung aktivieren',
          'Reservierungssystem anpassen'
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        criticalityLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        timestamp: new Date().toISOString()
      }
      
      setCapacityPredictions(current => [newPrediction, ...current.slice(0, 9)])
      
      // Update metrics
      setCapacityMetrics(current => ({
        ...current,
        averageUtilization: Math.max(50, Math.min(95, current.averageUtilization + (Math.random() - 0.5) * 5)),
        peakUtilization: Math.max(80, Math.min(99, current.peakUtilization + (Math.random() - 0.5) * 3)),
        predictiveAccuracy: Math.min(99.9, current.predictiveAccuracy + (Math.random() - 0.5))
      }))
      
      toast.success('Kapazitätsanalyse aktualisiert', {
        description: `${newPrediction.trainId}: ${newPrediction.predictedCapacity}% Auslastung vorhergesagt`
      })
      
    } catch (error) {
      toast.error('Fehler bei der Kapazitätsanalyse')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const optimizeCapacity = async (predictionId: string) => {
    const prediction = capacityPredictions.find(p => p.id === predictionId)
    if (!prediction) return

    try {
      const prompt = spark.llmPrompt`
        Optimiere Kapazität für ${prediction.trainId}:
        Aktuelle Auslastung: ${prediction.currentCapacity}%
        Vorhersage: ${prediction.predictedCapacity}%
        Maßnahmen: ${prediction.recommendations.join(', ')}
      `
      
      await spark.llm(prompt)
      
      // Entferne Vorhersage (simuliert erfolgreiche Optimierung)
      setCapacityPredictions(current => 
        current.filter(p => p.id !== predictionId)
      )
      
      setCapacityMetrics(current => ({
        ...current,
        capacityOptimization: Math.min(99.9, current.capacityOptimization + 0.5),
        passengersRerouted: current.passengersRerouted + Math.floor(Math.random() * 100) + 50
      }))
      
      toast.success('Kapazität optimiert', {
        description: `${prediction.trainId} erfolgreich entlastet`
      })
      
    } catch (error) {
      toast.error('Fehler bei der Optimierung')
    }
  }

  // Auto-refresh alle 15 Sekunden
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnalyzing && Math.random() > 0.6) {
        analyzeCapacity()
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [isAnalyzing, timeHorizon])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Echtzeit-Kapazitätsvorhersage
          </h1>
          <p className="text-muted-foreground">
            KI-gestützte Analyse und Optimierung der Fahrgastauslastung
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
          >
            <option value="15">15 Min</option>
            <option value="30">30 Min</option>
            <option value="60">1 Stunde</option>
            <option value="120">2 Stunden</option>
          </select>
          
          <Button 
            onClick={analyzeCapacity}
            disabled={isAnalyzing}
            className="bg-primary hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <Gauge size={16} className="mr-2 animate-pulse" />
                Analysiere...
              </>
            ) : (
              <>
                <Gauge size={16} className="mr-2" />
                Kapazität analysieren
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {capacityPredictions.some(p => p.criticalityLevel === 'critical') && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            Kritische Überlastung vorhergesagt! {capacityPredictions.filter(p => p.criticalityLevel === 'critical').length} Züge benötigen sofortige Maßnahmen.
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ø Auslastung</p>
                <p className="text-2xl font-bold text-blue-600">{capacityMetrics.averageUtilization.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Peak: {capacityMetrics.peakUtilization.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Gauge size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Optimierung</p>
                <p className="text-2xl font-bold text-green-600">{capacityMetrics.capacityOptimization.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">{capacityMetrics.passengersRerouted} umgeleitet</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Überlastungen</p>
                <p className="text-2xl font-bold text-orange-600">{capacityMetrics.overcrowdingIncidents}</p>
                <p className="text-xs text-muted-foreground">Diese Woche</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Warning size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vorhersagegenauigkeit</p>
                <p className="text-2xl font-bold text-purple-600">{capacityMetrics.predictiveAccuracy.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">ML-Qualität</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Crosshair size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Vorhersagen</TabsTrigger>
          <TabsTrigger value="stations">Bahnhöfe</TabsTrigger>
          <TabsTrigger value="analytics">Analytik</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train size={20} className="text-primary" />
                Kapazitätsvorhersagen Züge
              </CardTitle>
              <CardDescription>
                Real-time Prognosen für Fahrgastauslastung in den nächsten {timeHorizon} Minuten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {capacityPredictions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Keine kritischen Kapazitätsprognosen</p>
                  </div>
                ) : (
                  capacityPredictions.map((prediction) => (
                    <div 
                      key={prediction.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground text-lg">{prediction.trainId}</h4>
                          <p className="text-sm text-muted-foreground">{prediction.route}</p>
                          <p className="text-xs text-muted-foreground">
                            Vorhersage für +{prediction.timeHorizon} Min
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCriticalityColor(prediction.criticalityLevel)}>
                            {prediction.criticalityLevel === 'low' && 'Niedrig'}
                            {prediction.criticalityLevel === 'medium' && 'Mittel'}
                            {prediction.criticalityLevel === 'high' && 'Hoch'}
                            {prediction.criticalityLevel === 'critical' && 'Kritisch'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {prediction.confidence}% sicher
                          </Badge>
                        </div>
                      </div>

                      {/* Capacity Comparison */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Aktuell</p>
                          <p className={`text-lg font-bold ${getCapacityColor(prediction.currentCapacity)}`}>
                            {prediction.currentCapacity}%
                          </p>
                        </div>
                        <div className="flex items-center justify-center">
                          {getTrendIcon(prediction.currentCapacity, prediction.predictedCapacity)}
                        </div>
                        <div className="text-center p-3 bg-destructive/10 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Prognose</p>
                          <p className={`text-lg font-bold ${getCapacityColor(prediction.predictedCapacity)}`}>
                            {prediction.predictedCapacity}%
                          </p>
                        </div>
                      </div>

                      {/* Visual Progress */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Kapazitätsentwicklung</span>
                          <span className="font-medium">
                            {prediction.predictedCapacity > prediction.currentCapacity ? '+' : ''}
                            {prediction.predictedCapacity - prediction.currentCapacity}%
                          </span>
                        </div>
                        <Progress value={prediction.predictedCapacity} className="h-3" />
                      </div>

                      {/* Factors */}
                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-medium text-muted-foreground">Einflussfaktoren:</p>
                        <div className="flex flex-wrap gap-1">
                          {prediction.factors.map((factor, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      {prediction.recommendations.length > 0 && (
                        <div className="space-y-3 pt-3 border-t border-border">
                          <p className="text-sm font-medium text-muted-foreground">Empfohlene Maßnahmen:</p>
                          <div className="space-y-1">
                            {prediction.recommendations.map((rec, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => optimizeCapacity(prediction.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Zap size={14} className="mr-2" />
                              Optimieren
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Eye size={14} className="mr-2" />
                              Details
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stations" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Bahnhofs-Auslastung
              </CardTitle>
              <CardDescription>
                Überwachung der Kapazitätsbelastung in Hauptbahnhöfen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stationLoads.map((station, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{station.stationName}</h4>
                        <p className="text-sm text-muted-foreground">Peak erwartet um {station.peakTime}</p>
                      </div>
                      <Badge className={station.bottleneckRisk > 80 ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>
                        {station.bottleneckRisk}% Engpass-Risiko
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Aktuelle Auslastung</span>
                          <span className="font-medium">{station.currentLoad}%</span>
                        </div>
                        <Progress value={station.currentLoad} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Prognose</span>
                          <span className="font-medium">{station.predictedLoad}%</span>
                        </div>
                        <Progress value={station.predictedLoad} className="h-2" />
                      </div>
                    </div>

                    {station.alternativeRoutes.length > 0 && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Alternative Bahnhöfe:</p>
                        <div className="flex flex-wrap gap-1">
                          {station.alternativeRoutes.map((alt, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {alt}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} className="text-primary" />
                  Kapazitätstrends
                </CardTitle>
                <CardDescription>
                  Historische Analyse und Musternerkennung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { time: '06:00-09:00', load: 87, trend: 'up' },
                    { time: '09:00-12:00', load: 52, trend: 'down' },
                    { time: '12:00-15:00', load: 64, trend: 'up' },
                    { time: '15:00-18:00', load: 91, trend: 'up' },
                    { time: '18:00-21:00', load: 78, trend: 'down' }
                  ].map((period) => (
                    <div key={period.time} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{period.time}</span>
                          {period.trend === 'up' ? (
                            <TrendingUp size={12} className="text-red-500" />
                          ) : (
                            <ArrowDown size={12} className="text-green-500" />
                          )}
                        </div>
                        <span className={`text-sm font-bold ${getCapacityColor(period.load)}`}>
                          {period.load}%
                        </span>
                      </div>
                      <Progress value={period.load} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightning size={20} className="text-primary" />
                  Optimierungsmaßnahmen
                </CardTitle>
                <CardDescription>
                  Automatische und manuelle Interventionen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { action: 'Zusatzwaggons eingefügt', impact: '+15% Kapazität', status: 'aktiv' },
                    { action: 'Fahrgäste umgeleitet', impact: '89 Personen', status: 'abgeschlossen' },
                    { action: 'Preisanpassung aktiviert', impact: '-12% Nachfrage', status: 'aktiv' },
                    { action: 'Expressverbindung gestartet', impact: '156 Personen', status: 'geplant' }
                  ].map((measure, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        measure.status === 'aktiv' ? 'bg-green-500' :
                        measure.status === 'abgeschlossen' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{measure.action}</p>
                        <p className="text-xs text-muted-foreground">{measure.impact}</p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {measure.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RealTimeCapacityPredictor