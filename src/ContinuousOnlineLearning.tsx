import React, { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  Brain, 
  Activity, 
  Eye, 
  Speaker, 
  Thermometer, 
  Target,
  TrendUp,
  Settings,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  Layers,
  Network
} from '@phosphor-icons/react'

// Modalitäts-Gewichtungs-System für Online-Learning
interface ModalityWeight {
  modality: string
  weight: number
  confidence: number
  performance: number
  adaptationRate: number
  lastUpdate: number
}

interface EnvironmentCondition {
  lighting: number // 0-100 (dunkel-hell)
  noise: number // 0-100 (still-laut)
  weather: string // 'clear' | 'rain' | 'fog' | 'snow'
  crowdDensity: number // 0-100 (leer-überfüllt)
  temperature: number // -20 bis 50°C
  humidity: number // 0-100%
  timeOfDay: 'dawn' | 'morning' | 'noon' | 'evening' | 'night'
  season: 'spring' | 'summer' | 'autumn' | 'winter'
}

interface LearningMetrics {
  totalSamples: number
  accuracyTrend: number[]
  adaptationSpeed: number
  convergenceRate: number
  modalityContributions: { [key: string]: number }
  environmentalAdaptations: number
}

interface OnlineLearningSession {
  id: string
  startTime: number
  duration: number
  samplesProcessed: number
  adaptationsCount: number
  averageAccuracy: number
  modalityWeights: ModalityWeight[]
  environmentConditions: EnvironmentCondition[]
}

export default function ContinuousOnlineLearning() {
  const [isLearning, setIsLearning] = useState(false)
  const [currentSession, setCurrentSession] = useKV<OnlineLearningSession | null>('current-learning-session', null)
  const [modalityWeights, setModalityWeights] = useKV<ModalityWeight[]>('modality-weights', [
    { modality: 'Visual', weight: 0.4, confidence: 0.8, performance: 0.85, adaptationRate: 0.1, lastUpdate: Date.now() },
    { modality: 'Audio', weight: 0.3, confidence: 0.7, performance: 0.78, adaptationRate: 0.15, lastUpdate: Date.now() },
    { modality: 'Thermal', weight: 0.2, confidence: 0.6, performance: 0.72, adaptationRate: 0.2, lastUpdate: Date.now() },
    { modality: 'Motion', weight: 0.1, confidence: 0.9, performance: 0.88, adaptationRate: 0.05, lastUpdate: Date.now() }
  ])
  const [environmentConditions, setEnvironmentConditions] = useKV<EnvironmentCondition>('current-environment', {
    lighting: 75,
    noise: 45,
    weather: 'clear',
    crowdDensity: 60,
    temperature: 18,
    humidity: 65,
    timeOfDay: 'morning',
    season: 'autumn'
  })
  const [learningMetrics, setLearningMetrics] = useKV<LearningMetrics>('learning-metrics', {
    totalSamples: 0,
    accuracyTrend: [0.82, 0.84, 0.85, 0.87, 0.89],
    adaptationSpeed: 0.75,
    convergenceRate: 0.68,
    modalityContributions: {},
    environmentalAdaptations: 0
  })
  const [recentAdaptations, setRecentAdaptations] = useKV<Array<{
    timestamp: number
    modality: string
    oldWeight: number
    newWeight: number
    reason: string
    environmentTrigger: string
  }>>('recent-adaptations', [])

  const learningIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const environmentUpdateRef = useRef<NodeJS.Timeout | null>(null)

  // Kontinuierliches Online-Learning starten/stoppen
  const toggleLearning = () => {
    if (isLearning) {
      stopLearning()
    } else {
      startLearning()
    }
  }

  const startLearning = () => {
    const session: OnlineLearningSession = {
      id: `session-${Date.now()}`,
      startTime: Date.now(),
      duration: 0,
      samplesProcessed: 0,
      adaptationsCount: 0,
      averageAccuracy: 0,
      modalityWeights: [...modalityWeights],
      environmentConditions: [environmentConditions]
    }
    
    setCurrentSession(session)
    setIsLearning(true)
    
    // Kontinuierliche Gewichtungs-Anpassung alle 2 Sekunden
    learningIntervalRef.current = setInterval(() => {
      adaptModalityWeights()
      updateLearningMetrics()
    }, 2000)

    // Umgebungsänderungen simulieren alle 5 Sekunden
    environmentUpdateRef.current = setInterval(() => {
      simulateEnvironmentChange()
    }, 5000)

    toast.success('Online-Learning gestartet', {
      description: 'Adaptive Modalitäts-Gewichtung ist jetzt aktiv'
    })
  }

  const stopLearning = () => {
    if (learningIntervalRef.current) {
      clearInterval(learningIntervalRef.current)
      learningIntervalRef.current = null
    }
    if (environmentUpdateRef.current) {
      clearInterval(environmentUpdateRef.current)
      environmentUpdateRef.current = null
    }
    
    setIsLearning(false)
    
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        duration: Date.now() - currentSession.startTime
      }
      setCurrentSession(updatedSession)
    }

    toast.info('Online-Learning gestoppt', {
      description: 'Gewichtungen werden beibehalten'
    })
  }

  // Adaptive Modalitäts-Gewichtung basierend auf Umgebungsbedingungen
  const adaptModalityWeights = () => {
    const updatedWeights = modalityWeights.map(weight => {
      let newWeight = weight.weight
      let adaptationReason = ''
      let environmentTrigger = ''

      // Visuelle Modalität: Anpassung an Lichtbedingungen
      if (weight.modality === 'Visual') {
        if (environmentConditions.lighting < 30) {
          newWeight *= 0.7 // Reduziere visuelle Gewichtung bei schlechtem Licht
          adaptationReason = 'Schlechte Lichtverhältnisse'
          environmentTrigger = `Licht: ${environmentConditions.lighting}%`
        } else if (environmentConditions.lighting > 80) {
          newWeight *= 1.1 // Erhöhe bei gutem Licht
          adaptationReason = 'Optimale Lichtverhältnisse'
          environmentTrigger = `Licht: ${environmentConditions.lighting}%`
        }
      }

      // Audio-Modalität: Anpassung an Lärmumgebung
      if (weight.modality === 'Audio') {
        if (environmentConditions.noise > 70) {
          newWeight *= 0.6 // Reduziere Audio-Gewichtung bei hohem Lärm
          adaptationReason = 'Hoher Umgebungslärm'
          environmentTrigger = `Lärm: ${environmentConditions.noise}%`
        } else if (environmentConditions.noise < 20) {
          newWeight *= 1.2 // Erhöhe bei ruhiger Umgebung
          adaptationReason = 'Ruhige Umgebung'
          environmentTrigger = `Lärm: ${environmentConditions.noise}%`
        }
      }

      // Thermal-Modalität: Anpassung an Wetterbedingungen
      if (weight.modality === 'Thermal') {
        if (environmentConditions.weather === 'fog' || environmentConditions.weather === 'snow') {
          newWeight *= 1.3 // Erhöhe thermale Gewichtung bei schlechter Sicht
          adaptationReason = 'Eingeschränkte Sichtbedingungen'
          environmentTrigger = `Wetter: ${environmentConditions.weather}`
        }
        if (environmentConditions.temperature < 0 || environmentConditions.temperature > 35) {
          newWeight *= 1.1 // Erhöhe bei extremen Temperaturen
          adaptationReason = 'Extreme Temperaturen'
          environmentTrigger = `Temp: ${environmentConditions.temperature}°C`
        }
      }

      // Motion-Modalität: Anpassung an Menschendichte
      if (weight.modality === 'Motion') {
        if (environmentConditions.crowdDensity > 80) {
          newWeight *= 1.4 // Erhöhe Bewegungserkennung bei hoher Menschendichte
          adaptationReason = 'Hohe Personendichte'
          environmentTrigger = `Dichte: ${environmentConditions.crowdDensity}%`
        }
      }

      // Begrenze Gewichtungen zwischen 0.05 und 0.7
      newWeight = Math.max(0.05, Math.min(0.7, newWeight))

      // Führe Änderung mit Lernrate durch
      const adaptedWeight = weight.weight + (newWeight - weight.weight) * weight.adaptationRate

      // Protokolliere signifikante Änderungen
      if (Math.abs(adaptedWeight - weight.weight) > 0.01) {
        const adaptation = {
          timestamp: Date.now(),
          modality: weight.modality,
          oldWeight: weight.weight,
          newWeight: adaptedWeight,
          reason: adaptationReason,
          environmentTrigger: environmentTrigger
        }
        
        setRecentAdaptations(prev => [adaptation, ...prev.slice(0, 9)])
      }

      return {
        ...weight,
        weight: adaptedWeight,
        confidence: Math.min(1.0, weight.confidence + 0.01),
        performance: 0.7 + Math.random() * 0.25, // Simuliere Performance-Messung
        lastUpdate: Date.now()
      }
    })

    // Normalisiere Gewichtungen (Summe = 1.0)
    const totalWeight = updatedWeights.reduce((sum, w) => sum + w.weight, 0)
    const normalizedWeights = updatedWeights.map(w => ({
      ...w,
      weight: w.weight / totalWeight
    }))

    setModalityWeights(normalizedWeights)

    // Aktualisiere aktuelle Session
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        samplesProcessed: prev.samplesProcessed + 1,
        adaptationsCount: prev.adaptationsCount + (normalizedWeights.some((w, i) => 
          Math.abs(w.weight - modalityWeights[i].weight) > 0.01) ? 1 : 0)
      } : null)
    }
  }

  // Umgebungsänderungen simulieren
  const simulateEnvironmentChange = () => {
    const timeOfDaySequence: EnvironmentCondition['timeOfDay'][] = ['dawn', 'morning', 'noon', 'evening', 'night']
    const weatherOptions: EnvironmentCondition['weather'][] = ['clear', 'rain', 'fog', 'snow']
    
    const newConditions: EnvironmentCondition = {
      ...environmentConditions,
      lighting: Math.max(10, Math.min(100, environmentConditions.lighting + (Math.random() - 0.5) * 20)),
      noise: Math.max(0, Math.min(100, environmentConditions.noise + (Math.random() - 0.5) * 15)),
      crowdDensity: Math.max(0, Math.min(100, environmentConditions.crowdDensity + (Math.random() - 0.5) * 25)),
      temperature: Math.max(-20, Math.min(50, environmentConditions.temperature + (Math.random() - 0.5) * 4)),
      humidity: Math.max(0, Math.min(100, environmentConditions.humidity + (Math.random() - 0.5) * 10)),
      weather: Math.random() < 0.1 ? weatherOptions[Math.floor(Math.random() * weatherOptions.length)] : environmentConditions.weather,
      timeOfDay: Math.random() < 0.05 ? timeOfDaySequence[Math.floor(Math.random() * timeOfDaySequence.length)] : environmentConditions.timeOfDay
    }

    setEnvironmentConditions(newConditions)

    // Umgebungsanpassungen zählen
    setLearningMetrics(prev => ({
      ...prev,
      environmentalAdaptations: prev.environmentalAdaptations + 1
    }))
  }

  // Learning-Metriken aktualisieren
  const updateLearningMetrics = () => {
    setLearningMetrics(prev => {
      const newAccuracy = 0.75 + Math.random() * 0.2
      const newTrend = [...prev.accuracyTrend.slice(1), newAccuracy]
      
      const modalityContributions: { [key: string]: number } = {}
      modalityWeights.forEach(w => {
        modalityContributions[w.modality] = w.weight * w.performance
      })

      return {
        ...prev,
        totalSamples: prev.totalSamples + 1,
        accuracyTrend: newTrend,
        adaptationSpeed: Math.min(1.0, prev.adaptationSpeed + 0.001),
        convergenceRate: Math.min(1.0, prev.convergenceRate + 0.002),
        modalityContributions
      }
    })
  }

  // System zurücksetzen
  const resetSystem = () => {
    stopLearning()
    setModalityWeights([
      { modality: 'Visual', weight: 0.4, confidence: 0.8, performance: 0.85, adaptationRate: 0.1, lastUpdate: Date.now() },
      { modality: 'Audio', weight: 0.3, confidence: 0.7, performance: 0.78, adaptationRate: 0.15, lastUpdate: Date.now() },
      { modality: 'Thermal', weight: 0.2, confidence: 0.6, performance: 0.72, adaptationRate: 0.2, lastUpdate: Date.now() },
      { modality: 'Motion', weight: 0.1, confidence: 0.9, performance: 0.88, adaptationRate: 0.05, lastUpdate: Date.now() }
    ])
    setLearningMetrics({
      totalSamples: 0,
      accuracyTrend: [0.82, 0.84, 0.85, 0.87, 0.89],
      adaptationSpeed: 0.75,
      convergenceRate: 0.68,
      modalityContributions: {},
      environmentalAdaptations: 0
    })
    setRecentAdaptations([])
    setCurrentSession(null)
    
    toast.info('System zurückgesetzt', {
      description: 'Alle Gewichtungen auf Standardwerte zurückgesetzt'
    })
  }

  // Cleanup bei Component Unmount
  useEffect(() => {
    return () => {
      if (learningIntervalRef.current) clearInterval(learningIntervalRef.current)
      if (environmentUpdateRef.current) clearInterval(environmentUpdateRef.current)
    }
  }, [])

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'Visual': return Eye
      case 'Audio': return Speaker
      case 'Thermal': return Thermometer
      case 'Motion': return Target
      default: return Activity
    }
  }

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'rain': return '🌧️'
      case 'fog': return '🌫️'
      case 'snow': return '❄️'
      default: return '☀️'
    }
  }

  const currentAccuracy = learningMetrics.accuracyTrend[learningMetrics.accuracyTrend.length - 1]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Kontinuierliches Online-Learning</h2>
            <p className="text-muted-foreground">Adaptive Modalitäts-Gewichtung basierend auf Umgebungsbedingungen</p>
          </div>
        </div>
      </div>

      {/* Hauptsteuerung */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network size={20} />
                Learning-Kontrolle
              </CardTitle>
              <CardDescription>
                Kontinuierliche Anpassung der Modalitäts-Gewichtungen in Echtzeit
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={toggleLearning} className={isLearning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}>
                {isLearning ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                {isLearning ? 'Stoppen' : 'Starten'}
              </Button>
              <Button variant="outline" onClick={resetSystem}>
                <RotateCcw size={16} className="mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={isLearning ? "default" : "secondary"} className="gap-1">
                  <div className={`w-2 h-2 rounded-full ${isLearning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  {isLearning ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>
              {currentSession && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Samples verarbeitet:</span>
                    <span className="font-mono">{currentSession.samplesProcessed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Anpassungen:</span>
                    <span className="font-mono">{currentSession.adaptationsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dauer:</span>
                    <span className="font-mono">
                      {Math.floor((Date.now() - currentSession.startTime) / 1000)}s
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Aktuelle Genauigkeit */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span className="text-sm font-medium">Aktuelle Genauigkeit</span>
              </div>
              <div className="text-3xl font-bold text-primary">
                {(currentAccuracy * 100).toFixed(1)}%
              </div>
              <Progress value={currentAccuracy * 100} className="h-2" />
            </div>

            {/* Anpassungsgeschwindigkeit */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap size={16} />
                <span className="text-sm font-medium">Anpassungsgeschwindigkeit</span>
              </div>
              <div className="text-3xl font-bold text-accent">
                {(learningMetrics.adaptationSpeed * 100).toFixed(0)}%
              </div>
              <Progress value={learningMetrics.adaptationSpeed * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktuelle Modalitäts-Gewichtungen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers size={20} />
              Modalitäts-Gewichtungen
            </CardTitle>
            <CardDescription>Dynamisch angepasste Gewichte für verschiedene Sensoren</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modalityWeights.map((weight, index) => {
                const IconComponent = getModalityIcon(weight.modality)
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent size={16} />
                        <span className="font-medium">{weight.modality}</span>
                        <Badge variant="outline" className="text-xs">
                          {(weight.performance * 100).toFixed(0)}% Performance
                        </Badge>
                      </div>
                      <div className="text-lg font-bold">
                        {(weight.weight * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={weight.weight * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Vertrauen: {(weight.confidence * 100).toFixed(0)}%</span>
                        <span>Anpassungsrate: {(weight.adaptationRate * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Umgebungsbedingungen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              Umgebungsbedingungen
            </CardTitle>
            <CardDescription>Aktuelle Umgebungsparameter die das Learning beeinflussen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye size={14} />
                  <span className="text-sm">Licht</span>
                </div>
                <div className="text-xl font-bold">{environmentConditions.lighting}%</div>
                <Progress value={environmentConditions.lighting} className="h-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Speaker size={14} />
                  <span className="text-sm">Lärm</span>
                </div>
                <div className="text-xl font-bold">{environmentConditions.noise}%</div>
                <Progress value={environmentConditions.noise} className="h-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getWeatherIcon(environmentConditions.weather)}</span>
                  <span className="text-sm">Wetter</span>
                </div>
                <div className="text-lg font-medium capitalize">{environmentConditions.weather}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target size={14} />
                  <span className="text-sm">Dichte</span>
                </div>
                <div className="text-xl font-bold">{environmentConditions.crowdDensity}%</div>
                <Progress value={environmentConditions.crowdDensity} className="h-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Thermometer size={14} />
                  <span className="text-sm">Temperatur</span>
                </div>
                <div className="text-xl font-bold">{environmentConditions.temperature}°C</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span className="text-sm">Tageszeit</span>
                </div>
                <div className="text-lg font-medium capitalize">{environmentConditions.timeOfDay}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kürzliche Anpassungen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendUp size={20} />
            Kürzliche Anpassungen
          </CardTitle>
          <CardDescription>Letzte automatische Gewichtungsänderungen</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAdaptations.length > 0 ? (
            <div className="space-y-3">
              {recentAdaptations.slice(0, 5).map((adaptation, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      {React.createElement(getModalityIcon(adaptation.modality), { size: 16 })}
                    </div>
                    <div>
                      <div className="font-medium">{adaptation.modality}</div>
                      <div className="text-sm text-muted-foreground">{adaptation.reason}</div>
                      <div className="text-xs text-muted-foreground">{adaptation.environmentTrigger}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">
                      {(adaptation.oldWeight * 100).toFixed(1)}% → {(adaptation.newWeight * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(adaptation.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle size={24} className="mx-auto mb-2 opacity-50" />
              <p>Noch keine Anpassungen durchgeführt</p>
              <p className="text-sm">Starten Sie das Online-Learning um automatische Anpassungen zu sehen</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning-Statistiken */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            Learning-Statistiken
          </CardTitle>
          <CardDescription>Gesamtleistung und Trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">{learningMetrics.totalSamples}</div>
              <div className="text-sm text-muted-foreground">Samples gesamt</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {(learningMetrics.convergenceRate * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Konvergenzrate</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">{learningMetrics.environmentalAdaptations}</div>
              <div className="text-sm text-muted-foreground">Umgebungsanpassungen</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {(learningMetrics.adaptationSpeed * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Anpassungsgeschwindigkeit</div>
            </div>
          </div>

          {/* Modalitätsbeiträge */}
          <div className="mt-6 space-y-3">
            <h4 className="font-medium">Modalitätsbeiträge zur Gesamtleistung</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(learningMetrics.modalityContributions).map(([modality, contribution]) => (
                <div key={modality} className="text-center p-3 bg-secondary/30 rounded-lg">
                  <div className="text-lg font-bold">{(contribution * 100).toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">{modality}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System-Status */}
      <Alert>
        <CheckCircle size={16} />
        <AlertDescription>
          Online-Learning-System läuft stabil. Modalitäts-Gewichtungen werden automatisch an Umgebungsbedingungen angepasst. 
          Aktuelle Systemleistung: <strong>{(currentAccuracy * 100).toFixed(1)}%</strong>
        </AlertDescription>
      </Alert>
    </div>
  )
}