import React, { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Eye, 
  Speaker, 
  Activity, 
  Database, 
  Zap, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  TrendUp,
  AlertTriangle,
  CheckCircle,
  Circle,
  Target,
  Waves,
  Camera,
  Cpu,
  Network,
  BarChart3,
  LineChart
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SensorData {
  visual: {
    cameraFeeds: number
    objectDetection: number
    motionTracking: number
    lightConditions: string
  }
  acoustic: {
    noiseLevel: number
    voiceDetection: boolean
    emergencyAlerts: number
    trainSounds: number
  }
  sensor: {
    temperature: number
    humidity: number
    vibration: number
    pressure: number
    proximity: number
  }
}

interface ModalityWeight {
  visual: number
  acoustic: number
  sensor: number
}

interface RewardMetrics {
  visual: number
  acoustic: number
  sensor: number
  combined: number
}

interface TrainingState {
  episode: number
  totalReward: number
  averageReward: number
  learningRate: number
  explorationRate: number
  convergence: number
}

const MultiModalReinforcementLearning: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState(0)
  const [selectedModality, setSelectedModality] = useState<'visual' | 'acoustic' | 'sensor' | 'fusion'>('fusion')
  
  const [sensorData, setSensorData] = useKV<SensorData>('multimodal-sensor-data', {
    visual: {
      cameraFeeds: 24,
      objectDetection: 95,
      motionTracking: 88,
      lightConditions: 'optimal'
    },
    acoustic: {
      noiseLevel: 65,
      voiceDetection: false,
      emergencyAlerts: 0,
      trainSounds: 3
    },
    sensor: {
      temperature: 22.5,
      humidity: 45,
      vibration: 12,
      pressure: 1013.25,
      proximity: 85
    }
  })

  const [modalityWeights, setModalityWeights] = useKV<ModalityWeight>('modality-weights', {
    visual: 0.4,
    acoustic: 0.3,
    sensor: 0.3
  })

  const [trainingState, setTrainingState] = useKV<TrainingState>('multimodal-training-state', {
    episode: 0,
    totalReward: 0,
    averageReward: 0,
    learningRate: 0.001,
    explorationRate: 0.1,
    convergence: 0
  })

  const [rewardHistory, setRewardHistory] = useKV<RewardMetrics[]>('reward-history', [])
  const [modalityPerformance, setModalityPerformance] = useKV('modality-performance', {
    visual: { accuracy: 92, latency: 45, confidence: 0.88 },
    acoustic: { accuracy: 87, latency: 23, confidence: 0.82 },
    sensor: { accuracy: 94, latency: 12, confidence: 0.91 }
  })

  const trainingInterval = useRef<NodeJS.Timeout | null>(null)

  // Simuliere Multi-Modal RL Training
  const simulateTraining = () => {
    if (!isTraining) return

    // Generiere realistische Sensor-Eingaben
    const newSensorData: SensorData = {
      visual: {
        cameraFeeds: Math.max(20, Math.min(32, sensorData.visual.cameraFeeds + Math.floor(Math.random() * 3) - 1)),
        objectDetection: Math.max(80, Math.min(100, sensorData.visual.objectDetection + Math.floor(Math.random() * 6) - 3)),
        motionTracking: Math.max(70, Math.min(100, sensorData.visual.motionTracking + Math.floor(Math.random() * 8) - 4)),
        lightConditions: ['optimal', 'good', 'poor', 'critical'][Math.floor(Math.random() * 4)]
      },
      acoustic: {
        noiseLevel: Math.max(30, Math.min(90, sensorData.acoustic.noiseLevel + Math.floor(Math.random() * 10) - 5)),
        voiceDetection: Math.random() > 0.8,
        emergencyAlerts: Math.max(0, sensorData.acoustic.emergencyAlerts + (Math.random() > 0.95 ? 1 : 0)),
        trainSounds: Math.max(0, Math.min(10, sensorData.acoustic.trainSounds + Math.floor(Math.random() * 3) - 1))
      },
      sensor: {
        temperature: Math.max(15, Math.min(35, sensorData.sensor.temperature + (Math.random() * 2) - 1)),
        humidity: Math.max(20, Math.min(80, sensorData.sensor.humidity + Math.floor(Math.random() * 6) - 3)),
        vibration: Math.max(5, Math.min(50, sensorData.sensor.vibration + Math.floor(Math.random() * 8) - 4)),
        pressure: Math.max(980, Math.min(1040, sensorData.sensor.pressure + (Math.random() * 4) - 2)),
        proximity: Math.max(0, Math.min(100, sensorData.sensor.proximity + Math.floor(Math.random() * 10) - 5))
      }
    }

    // Berechne Belohnungen für jede Modalität
    const visualReward = calculateVisualReward(newSensorData.visual)
    const acousticReward = calculateAcousticReward(newSensorData.acoustic)
    const sensorReward = calculateSensorReward(newSensorData.sensor)
    
    // Gewichtete Kombination der Modalitäten
    const combinedReward = 
      visualReward * modalityWeights.visual +
      acousticReward * modalityWeights.acoustic +
      sensorReward * modalityWeights.sensor

    // Update Training State
    const newEpisode = trainingState.episode + 1
    const newTotalReward = trainingState.totalReward + combinedReward
    const newAverageReward = newTotalReward / newEpisode
    
    // Adaptive Lernrate und Exploration
    const newLearningRate = Math.max(0.0001, trainingState.learningRate * 0.9995)
    const newExplorationRate = Math.max(0.01, trainingState.explorationRate * 0.999)
    
    // Konvergenz-Metrik
    const convergence = Math.min(100, (newAverageReward / 100) * 100)

    const newTrainingState: TrainingState = {
      episode: newEpisode,
      totalReward: newTotalReward,
      averageReward: newAverageReward,
      learningRate: newLearningRate,
      explorationRate: newExplorationRate,
      convergence
    }

    // Update Belohnungshistorie
    const newReward: RewardMetrics = {
      visual: visualReward,
      acoustic: acousticReward,
      sensor: sensorReward,
      combined: combinedReward
    }

    setSensorData(newSensorData)
    setTrainingState(newTrainingState)
    setRewardHistory(prev => [...prev.slice(-49), newReward]) // Behalte nur die letzten 50 Episoden
    setCurrentEpisode(newEpisode)

    // Update Modalitäts-Performance basierend auf Belohnungen
    setModalityPerformance(prev => ({
      visual: {
        accuracy: Math.max(70, Math.min(100, prev.visual.accuracy + (visualReward > 70 ? 1 : -0.5))),
        latency: Math.max(20, Math.min(100, prev.visual.latency + Math.floor(Math.random() * 6) - 3)),
        confidence: Math.max(0.5, Math.min(1, prev.visual.confidence + (visualReward > 70 ? 0.01 : -0.005)))
      },
      acoustic: {
        accuracy: Math.max(70, Math.min(100, prev.acoustic.accuracy + (acousticReward > 70 ? 1 : -0.5))),
        latency: Math.max(10, Math.min(50, prev.acoustic.latency + Math.floor(Math.random() * 4) - 2)),
        confidence: Math.max(0.5, Math.min(1, prev.acoustic.confidence + (acousticReward > 70 ? 0.01 : -0.005)))
      },
      sensor: {
        accuracy: Math.max(70, Math.min(100, prev.sensor.accuracy + (sensorReward > 70 ? 1 : -0.5))),
        latency: Math.max(5, Math.min(30, prev.sensor.latency + Math.floor(Math.random() * 3) - 1)),
        confidence: Math.max(0.5, Math.min(1, prev.sensor.confidence + (sensorReward > 70 ? 0.01 : -0.005)))
      }
    }))
  }

  // Belohnungsfunktionen für verschiedene Modalitäten
  const calculateVisualReward = (visual: SensorData['visual']): number => {
    let reward = 0
    reward += visual.objectDetection * 0.4
    reward += visual.motionTracking * 0.3
    reward += visual.cameraFeeds * 1.5
    reward += visual.lightConditions === 'optimal' ? 20 : 
              visual.lightConditions === 'good' ? 10 : 
              visual.lightConditions === 'poor' ? 5 : 0
    return Math.max(0, Math.min(100, reward))
  }

  const calculateAcousticReward = (acoustic: SensorData['acoustic']): number => {
    let reward = 50 // Basis-Belohnung
    reward += acoustic.voiceDetection ? 15 : 0
    reward += acoustic.trainSounds * 5
    reward -= acoustic.emergencyAlerts * 20
    reward -= Math.max(0, acoustic.noiseLevel - 70) * 0.5 // Bestrafung für hohen Lärm
    return Math.max(0, Math.min(100, reward))
  }

  const calculateSensorReward = (sensor: SensorData['sensor']): number => {
    let reward = 50 // Basis-Belohnung
    
    // Temperatur (optimal zwischen 18-25°C)
    const tempDiff = Math.abs(sensor.temperature - 21.5)
    reward -= tempDiff * 2
    
    // Luftfeuchtigkeit (optimal zwischen 40-60%)
    const humidityDiff = Math.abs(sensor.humidity - 50)
    reward -= Math.max(0, humidityDiff - 10) * 0.5
    
    // Vibration (niedriger ist besser)
    reward -= sensor.vibration * 0.8
    
    // Proximity (höher ist besser für Sicherheit)
    reward += sensor.proximity * 0.3
    
    return Math.max(0, Math.min(100, reward))
  }

  // Training starten/stoppen
  const toggleTraining = () => {
    if (isTraining) {
      if (trainingInterval.current) {
        clearInterval(trainingInterval.current)
        trainingInterval.current = null
      }
      setIsTraining(false)
      toast.success('Multi-Modal RL Training gestoppt')
    } else {
      setIsTraining(true)
      trainingInterval.current = setInterval(simulateTraining, 500)
      toast.success('Multi-Modal RL Training gestartet')
    }
  }

  // Training zurücksetzen
  const resetTraining = () => {
    if (trainingInterval.current) {
      clearInterval(trainingInterval.current)
      trainingInterval.current = null
    }
    setIsTraining(false)
    setCurrentEpisode(0)
    setTrainingState({
      episode: 0,
      totalReward: 0,
      averageReward: 0,
      learningRate: 0.001,
      explorationRate: 0.1,
      convergence: 0
    })
    setRewardHistory([])
    toast.info('Training zurückgesetzt')
  }

  // Modalitäts-Gewichte anpassen
  const adjustModalityWeight = (modality: keyof ModalityWeight, delta: number) => {
    const newWeights = { ...modalityWeights }
    newWeights[modality] = Math.max(0.1, Math.min(0.8, newWeights[modality] + delta))
    
    // Normalisiere Gewichte zu 1.0
    const total = newWeights.visual + newWeights.acoustic + newWeights.sensor
    newWeights.visual /= total
    newWeights.acoustic /= total
    newWeights.sensor /= total
    
    setModalityWeights(newWeights)
    toast.success(`${modality} Gewichtung angepasst auf ${(newWeights[modality] * 100).toFixed(1)}%`)
  }

  useEffect(() => {
    if (isTraining) {
      trainingInterval.current = setInterval(simulateTraining, 500)
    }

    return () => {
      if (trainingInterval.current) {
        clearInterval(trainingInterval.current)
      }
    }
  }, [isTraining, sensorData, modalityWeights, trainingState])

  const getModalityStatus = (modality: keyof typeof modalityPerformance) => {
    const perf = modalityPerformance[modality]
    if (perf.accuracy >= 90 && perf.confidence >= 0.85) return 'optimal'
    if (perf.accuracy >= 80 && perf.confidence >= 0.75) return 'good'
    if (perf.accuracy >= 70 && perf.confidence >= 0.65) return 'warning'
    return 'critical'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-50 border-green-200'
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Multi-Modal Reinforcement Learning</h1>
            <p className="text-muted-foreground">KI-System mit visuellen, akustischen und Sensor-Eingaben</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={toggleTraining}
            variant={isTraining ? "destructive" : "default"}
            className="gap-2"
          >
            {isTraining ? <Pause size={16} /> : <Play size={16} />}
            {isTraining ? 'Training stoppen' : 'Training starten'}
          </Button>
          <Button onClick={resetTraining} variant="outline" className="gap-2">
            <RotateCcw size={16} />
            Zurücksetzen
          </Button>
        </div>
      </div>

      {/* Training Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendUp size={20} />
              Training Status
            </CardTitle>
            <Badge variant={isTraining ? "default" : "secondary"}>
              {isTraining ? 'Aktiv' : 'Gestoppt'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Episode</p>
              <p className="text-2xl font-bold text-primary">{trainingState.episode.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Durchschnittliche Belohnung</p>
              <p className="text-2xl font-bold text-green-600">{trainingState.averageReward.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Lernrate</p>
              <p className="text-lg font-bold text-blue-600">{trainingState.learningRate.toFixed(6)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Konvergenz</p>
              <div className="space-y-1">
                <p className="text-lg font-bold text-purple-600">{trainingState.convergence.toFixed(1)}%</p>
                <Progress value={trainingState.convergence} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modalitäts-Übersicht */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visuelle Modalität */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye size={18} />
              Visuelle Eingaben
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Gewichtung</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => adjustModalityWeight('visual', -0.05)}>-</Button>
                <span className="font-bold">{(modalityWeights.visual * 100).toFixed(0)}%</span>
                <Button size="sm" variant="outline" onClick={() => adjustModalityWeight('visual', 0.05)}>+</Button>
              </div>
            </div>
            <Progress value={modalityWeights.visual * 100} className="h-2" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Kamera-Feeds</span>
                <Badge variant="outline">{sensorData.visual.cameraFeeds}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Objekterkennung</span>
                <Badge variant="outline">{sensorData.visual.objectDetection}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bewegungserkennung</span>
                <Badge variant="outline">{sensorData.visual.motionTracking}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Lichtverhältnisse</span>
                <Badge className={getStatusColor(sensorData.visual.lightConditions)}>
                  {sensorData.visual.lightConditions}
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm">Status</span>
                <Badge className={getStatusColor(getModalityStatus('visual'))}>
                  {getModalityStatus('visual')}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Genauigkeit: {modalityPerformance.visual.accuracy.toFixed(1)}% | 
                Latenz: {modalityPerformance.visual.latency}ms
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Akustische Modalität */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Speaker size={18} />
              Akustische Eingaben
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Gewichtung</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => adjustModalityWeight('acoustic', -0.05)}>-</Button>
                <span className="font-bold">{(modalityWeights.acoustic * 100).toFixed(0)}%</span>
                <Button size="sm" variant="outline" onClick={() => adjustModalityWeight('acoustic', 0.05)}>+</Button>
              </div>
            </div>
            <Progress value={modalityWeights.acoustic * 100} className="h-2" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Lärmpegel</span>
                <Badge variant="outline">{sensorData.acoustic.noiseLevel} dB</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Spracherkennung</span>
                <Badge variant={sensorData.acoustic.voiceDetection ? "default" : "secondary"}>
                  {sensorData.acoustic.voiceDetection ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Notfall-Alarme</span>
                <Badge variant={sensorData.acoustic.emergencyAlerts > 0 ? "destructive" : "outline"}>
                  {sensorData.acoustic.emergencyAlerts}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Zug-Geräusche</span>
                <Badge variant="outline">{sensorData.acoustic.trainSounds}</Badge>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm">Status</span>
                <Badge className={getStatusColor(getModalityStatus('acoustic'))}>
                  {getModalityStatus('acoustic')}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Genauigkeit: {modalityPerformance.acoustic.accuracy.toFixed(1)}% | 
                Latenz: {modalityPerformance.acoustic.latency}ms
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor-Modalität */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} />
              Sensor-Eingaben
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Gewichtung</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => adjustModalityWeight('sensor', -0.05)}>-</Button>
                <span className="font-bold">{(modalityWeights.sensor * 100).toFixed(0)}%</span>
                <Button size="sm" variant="outline" onClick={() => adjustModalityWeight('sensor', 0.05)}>+</Button>
              </div>
            </div>
            <Progress value={modalityWeights.sensor * 100} className="h-2" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Temperatur</span>
                <Badge variant="outline">{sensorData.sensor.temperature.toFixed(1)}°C</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Luftfeuchtigkeit</span>
                <Badge variant="outline">{sensorData.sensor.humidity}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Vibration</span>
                <Badge variant="outline">{sensorData.sensor.vibration.toFixed(1)} Hz</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Näherung</span>
                <Badge variant="outline">{sensorData.sensor.proximity}%</Badge>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm">Status</span>
                <Badge className={getStatusColor(getModalityStatus('sensor'))}>
                  {getModalityStatus('sensor')}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Genauigkeit: {modalityPerformance.sensor.accuracy.toFixed(1)}% | 
                Latenz: {modalityPerformance.sensor.latency}ms
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Belohnungshistorie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            Belohnungshistorie
          </CardTitle>
          <CardDescription>
            Belohnungen der letzten {Math.min(rewardHistory.length, 50)} Episoden pro Modalität
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rewardHistory.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Visuell (Ø)</p>
                  <p className="text-lg font-bold text-blue-600">
                    {(rewardHistory.reduce((sum, r) => sum + r.visual, 0) / rewardHistory.length).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Akustisch (Ø)</p>
                  <p className="text-lg font-bold text-purple-600">
                    {(rewardHistory.reduce((sum, r) => sum + r.acoustic, 0) / rewardHistory.length).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sensor (Ø)</p>
                  <p className="text-lg font-bold text-orange-600">
                    {(rewardHistory.reduce((sum, r) => sum + r.sensor, 0) / rewardHistory.length).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kombiniert (Ø)</p>
                  <p className="text-lg font-bold text-green-600">
                    {(rewardHistory.reduce((sum, r) => sum + r.combined, 0) / rewardHistory.length).toFixed(1)}
                  </p>
                </div>
              </div>
              
              {/* Einfache Visualisierung der letzten 10 Belohnungen */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Letzte 10 Episoden</p>
                <div className="flex gap-1 h-20 items-end">
                  {rewardHistory.slice(-10).map((reward, index) => (
                    <div key={index} className="flex-1 space-y-1">
                      <div 
                        className="bg-blue-500 rounded-t"
                        style={{ height: `${(reward.visual / 100) * 100}%`, minHeight: '2px' }}
                      />
                      <div 
                        className="bg-purple-500"
                        style={{ height: `${(reward.acoustic / 100) * 100}%`, minHeight: '2px' }}
                      />
                      <div 
                        className="bg-orange-500"
                        style={{ height: `${(reward.sensor / 100) * 100}%`, minHeight: '2px' }}
                      />
                      <div 
                        className="bg-green-500 rounded-b"
                        style={{ height: `${(reward.combined / 100) * 100}%`, minHeight: '2px' }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    Visuell
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded" />
                    Akustisch
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded" />
                    Sensor
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    Kombiniert
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Starten Sie das Training, um Belohnungshistorie zu sehen
            </div>
          )}
        </CardContent>
      </Card>

      {/* System-Metriken */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu size={20} />
              Fusion-Algorithmus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Attention-Mechanismus</span>
                <Badge variant="default">Transformer</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fusion-Strategie</span>
                <Badge variant="outline">Gewichtete Summe</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Optimierer</span>
                <Badge variant="outline">Adam</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Exploration</span>
                <Badge variant="outline">ε-greedy ({(trainingState.explorationRate * 100).toFixed(1)}%)</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Modalitäts-Balance</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye size={14} />
                  <Progress value={modalityWeights.visual * 100} className="flex-1 h-2" />
                  <span className="text-xs w-12">{(modalityWeights.visual * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Speaker size={14} />
                  <Progress value={modalityWeights.acoustic * 100} className="flex-1 h-2" />
                  <span className="text-xs w-12">{(modalityWeights.acoustic * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity size={14} />
                  <Progress value={modalityWeights.sensor * 100} className="flex-1 h-2" />
                  <span className="text-xs w-12">{(modalityWeights.sensor * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network size={20} />
              Netzwerk-Architektur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Encoder-Dimensionen</span>
                <Badge variant="outline">512 → 256 → 128</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fusion-Layer</span>
                <Badge variant="outline">128 → 64</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Aktion-Output</span>
                <Badge variant="outline">64 → 32 → 16</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Aktivierung</span>
                <Badge variant="outline">ReLU + Dropout(0.2)</Badge>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <p className="text-sm font-medium">Parameter</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Gesamt-Parameter:</span>
                  <p className="font-bold">2.4M</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trainierbare:</span>
                  <p className="font-bold">2.1M</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Speicher:</span>
                  <p className="font-bold">9.6 MB</p>
                </div>
                <div>
                  <span className="text-muted-foreground">FLOPs:</span>
                  <p className="font-bold">1.8G</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Information */}
      {trainingState.convergence > 90 && (
        <Alert>
          <CheckCircle size={16} />
          <AlertDescription>
            Das Multi-Modal RL System hat eine hohe Konvergenz erreicht ({trainingState.convergence.toFixed(1)}%). 
            Das Modell ist bereit für den produktiven Einsatz.
          </AlertDescription>
        </Alert>
      )}

      {trainingState.averageReward > 0 && trainingState.averageReward < 30 && (
        <Alert variant="destructive">
          <AlertTriangle size={16} />
          <AlertDescription>
            Niedrige durchschnittliche Belohnung ({trainingState.averageReward.toFixed(1)}). 
            Überprüfen Sie die Modalitäts-Gewichtungen und Sensor-Eingaben.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default MultiModalReinforcementLearning