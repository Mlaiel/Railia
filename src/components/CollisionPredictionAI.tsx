import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain,
  Shield,
  AlertTriangle,
  Target,
  Activity,
  Clock,
  Lightning,
  Gauge,
  Cpu,
  Network,
  Pulse,
  Eye,
  Crosshair,
  Timer,
  CheckCircle,
  XCircle,
  Warning,
  Lightbulb,
  Database,
  Radar,
  Globe
} from '@phosphor-icons/react'

interface CollisionPrediction {
  id: string
  timestamp: string
  predictedTime: number // seconds until collision
  confidence: number // percentage
  severity: 'low' | 'medium' | 'high' | 'critical'
  collisionType: 'head-on' | 'rear-end' | 'side-impact' | 'infrastructure' | 'debris' | 'animal'
  primaryObject: {
    type: 'train' | 'vehicle' | 'obstacle' | 'infrastructure'
    id: string
    velocity: number // km/h
    trajectory: string
    mass: number // tons
  }
  secondaryObject: {
    type: 'train' | 'vehicle' | 'obstacle' | 'infrastructure'
    id: string
    velocity: number // km/h
    trajectory: string
    mass: number // tons
  }
  impactLocation: {
    lat: number
    lng: number
    trackKm: number
    section: string
  }
  riskFactors: string[]
  mitigationStrategies: string[]
  algorithmUsed: string
  processingTime: number // milliseconds
  status: 'active' | 'resolved' | 'avoided' | 'false-positive'
}

interface PredictionAlgorithm {
  id: string
  name: string
  type: 'neural-network' | 'physics-based' | 'hybrid' | 'machine-learning'
  accuracy: number
  falsePositiveRate: number
  averageProcessingTime: number
  predictionsToday: number
  confidenceThreshold: number
  isActive: boolean
  lastUpdate: string
  version: string
  specialization: string[]
}

interface TrajectoryAnalysis {
  id: string
  objectId: string
  currentPosition: { x: number; y: number; z: number }
  velocity: { x: number; y: number; z: number }
  acceleration: { x: number; y: number; z: number }
  predictedPath: Array<{ x: number; y: number; z: number; timestamp: number }>
  uncertaintyRadius: number
  timeHorizon: number // seconds
  pathConfidence: number
  anomalyScore: number
}

export default function CollisionPredictionAI() {
  const [predictions, setPredictions] = useKV<CollisionPrediction[]>('collision-predictions', [])
  const [algorithms, setAlgorithms] = useKV<PredictionAlgorithm[]>('prediction-algorithms', [])
  const [trajectories, setTrajectories] = useKV<TrajectoryAnalysis[]>('trajectory-analyses', [])
  const [systemMetrics, setSystemMetrics] = useKV('prediction-ai-metrics', {
    totalPredictions: 2847,
    accuratelyPredicted: 2731,
    falsePositives: 47,
    collisionsAvoided: 23,
    averageWarningTime: 127.5,
    systemAccuracy: 96.1,
    processingLatency: 0.23,
    algorithmsActive: 6
  })

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('all')
  const [timeHorizon, setTimeHorizon] = useState<number>(300) // 5 minutes
  const [showOnlyCritical, setShowOnlyCritical] = useState(false)

  useEffect(() => {
    if (predictions.length === 0) {
      const mockPredictions: CollisionPrediction[] = [
        {
          id: 'PRED001',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          predictedTime: 147,
          confidence: 97.3,
          severity: 'critical',
          collisionType: 'head-on',
          primaryObject: {
            type: 'train',
            id: 'ICE4047',
            velocity: 85,
            trajectory: 'Northbound Track 1',
            mass: 450
          },
          secondaryObject: {
            type: 'obstacle',
            id: 'OBJ-Berlin-001',
            velocity: 0,
            trajectory: 'Stationary',
            mass: 2.5
          },
          impactLocation: {
            lat: 52.5200,
            lng: 13.4050,
            trackKm: 127.8,
            section: 'Berlin-Brandenburg Hauptstrecke'
          },
          riskFactors: [
            'Hohes Zugtempo',
            'Großes Hindernis',
            'Schlechte Sichtverhältnisse',
            'Starker Regen'
          ],
          mitigationStrategies: [
            'Sofortige Notbremsung',
            'Notfall-Signalgebung',
            'Evakuierung Bahnsteig',
            'Rettungskräfte alarmieren'
          ],
          algorithmUsed: 'NeuralNet-TrajectoryPredictor-v3.2',
          processingTime: 18.7,
          status: 'active'
        },
        {
          id: 'PRED002',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          predictedTime: 289,
          confidence: 84.6,
          severity: 'high',
          collisionType: 'infrastructure',
          primaryObject: {
            type: 'train',
            id: 'RE4823',
            velocity: 45,
            trajectory: 'Eastbound Track 2',
            mass: 280
          },
          secondaryObject: {
            type: 'infrastructure',
            id: 'Bridge-HH-092',
            velocity: 0,
            trajectory: 'Fixed Structure',
            mass: 15000
          },
          impactLocation: {
            lat: 53.5511,
            lng: 9.9937,
            trackKm: 156.7,
            section: 'Hamburg-Bremen Verbindung'
          },
          riskFactors: [
            'Struktureller Schaden erkannt',
            'Metallermüdung',
            'Überlastungsrisiko'
          ],
          mitigationStrategies: [
            'Geschwindigkeitsreduzierung',
            'Gewichtsbeschränkung',
            'Strukturelle Inspektion',
            'Alternative Route'
          ],
          algorithmUsed: 'PhysicsEngine-StructuralAnalysis-v2.1',
          processingTime: 245.3,
          status: 'active'
        },
        {
          id: 'PRED003',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          predictedTime: 0,
          confidence: 92.1,
          severity: 'medium',
          collisionType: 'side-impact',
          primaryObject: {
            type: 'train',
            id: 'S-Bahn-147',
            velocity: 35,
            trajectory: 'Platform Approach',
            mass: 120
          },
          secondaryObject: {
            type: 'vehicle',
            id: 'CAR-MUC-445',
            velocity: 50,
            trajectory: 'Level Crossing',
            mass: 1.8
          },
          impactLocation: {
            lat: 48.1351,
            lng: 11.5820,
            trackKm: 89.3,
            section: 'München Stadtbereich'
          },
          riskFactors: [
            'Bahnübergang ohne Schranke',
            'Fahrzeug missachtet Signale'
          ],
          mitigationStrategies: [
            'Warnsignal aktiviert',
            'Bahnübergang gesperrt',
            'Polizei informiert'
          ],
          algorithmUsed: 'ML-VehicleDetection-v4.0',
          processingTime: 12.4,
          status: 'avoided'
        }
      ]
      setPredictions(mockPredictions)
    }

    if (algorithms.length === 0) {
      const mockAlgorithms: PredictionAlgorithm[] = [
        {
          id: 'ALG001',
          name: 'Neural Trajectory Predictor',
          type: 'neural-network',
          accuracy: 97.3,
          falsePositiveRate: 1.8,
          averageProcessingTime: 15.2,
          predictionsToday: 247,
          confidenceThreshold: 85,
          isActive: true,
          lastUpdate: new Date(Date.now() - 120000).toISOString(),
          version: 'v3.2.1',
          specialization: ['Fahrzeug-Kollisionen', 'Trajektorien-Analyse']
        },
        {
          id: 'ALG002',
          name: 'Physics-Based Collision Model',
          type: 'physics-based',
          accuracy: 94.7,
          falsePositiveRate: 3.2,
          averageProcessingTime: 245.6,
          predictionsToday: 156,
          confidenceThreshold: 90,
          isActive: true,
          lastUpdate: new Date(Date.now() - 180000).toISOString(),
          version: 'v2.1.0',
          specialization: ['Strukturelle Kollisionen', 'Massenkollisionen']
        },
        {
          id: 'ALG003',
          name: 'Hybrid Multi-Modal Predictor',
          type: 'hybrid',
          accuracy: 95.8,
          falsePositiveRate: 2.1,
          averageProcessingTime: 67.3,
          predictionsToday: 189,
          confidenceThreshold: 88,
          isActive: true,
          lastUpdate: new Date(Date.now() - 90000).toISOString(),
          version: 'v1.8.2',
          specialization: ['Multi-Objekt-Szenarien', 'Umwelt-Faktoren']
        },
        {
          id: 'ALG004',
          name: 'ML Object Detection Engine',
          type: 'machine-learning',
          accuracy: 92.4,
          falsePositiveRate: 4.6,
          averageProcessingTime: 8.9,
          predictionsToday: 412,
          confidenceThreshold: 75,
          isActive: true,
          lastUpdate: new Date(Date.now() - 60000).toISOString(),
          version: 'v4.0.3',
          specialization: ['Objekt-Erkennung', 'Verhaltens-Analyse']
        },
        {
          id: 'ALG005',
          name: 'Environmental Risk Assessor',
          type: 'hybrid',
          accuracy: 89.2,
          falsePositiveRate: 6.1,
          averageProcessingTime: 124.7,
          predictionsToday: 78,
          confidenceThreshold: 80,
          isActive: false,
          lastUpdate: new Date(Date.now() - 3600000).toISOString(),
          version: 'v2.0.1',
          specialization: ['Wetter-Einflüsse', 'Infrastruktur-Risiken']
        },
        {
          id: 'ALG006',
          name: 'Real-Time Anomaly Detector',
          type: 'neural-network',
          accuracy: 96.5,
          falsePositiveRate: 2.8,
          averageProcessingTime: 3.4,
          predictionsToday: 834,
          confidenceThreshold: 70,
          isActive: true,
          lastUpdate: new Date(Date.now() - 30000).toISOString(),
          version: 'v5.1.0',
          specialization: ['Anomalie-Erkennung', 'Echtzeit-Analyse']
        }
      ]
      setAlgorithms(mockAlgorithms)
    }

    if (trajectories.length === 0) {
      const mockTrajectories: TrajectoryAnalysis[] = [
        {
          id: 'TRAJ001',
          objectId: 'ICE4047',
          currentPosition: { x: 1250.4, y: 847.2, z: 12.5 },
          velocity: { x: 23.6, y: 0.8, z: 0.0 },
          acceleration: { x: -0.5, y: 0.0, z: 0.0 },
          predictedPath: [
            { x: 1250.4, y: 847.2, z: 12.5, timestamp: Date.now() },
            { x: 1274.0, y: 848.0, z: 12.5, timestamp: Date.now() + 1000 },
            { x: 1297.1, y: 848.8, z: 12.5, timestamp: Date.now() + 2000 }
          ],
          uncertaintyRadius: 2.3,
          timeHorizon: 300,
          pathConfidence: 97.3,
          anomalyScore: 0.12
        },
        {
          id: 'TRAJ002',
          objectId: 'OBJ-Berlin-001',
          currentPosition: { x: 1420.7, y: 847.8, z: 12.5 },
          velocity: { x: 0.0, y: 0.0, z: 0.0 },
          acceleration: { x: 0.0, y: 0.0, z: 0.0 },
          predictedPath: [
            { x: 1420.7, y: 847.8, z: 12.5, timestamp: Date.now() },
            { x: 1420.7, y: 847.8, z: 12.5, timestamp: Date.now() + 60000 }
          ],
          uncertaintyRadius: 0.1,
          timeHorizon: 3600,
          pathConfidence: 99.9,
          anomalyScore: 8.47
        }
      ]
      setTrajectories(mockTrajectories)
    }
  }, [predictions, setPredictions, algorithms, setAlgorithms, trajectories, setTrajectories])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAlgorithmTypeIcon = (type: string) => {
    switch (type) {
      case 'neural-network': return <Brain size={16} className="text-purple-600" />
      case 'physics-based': return <Cpu size={16} className="text-blue-600" />
      case 'hybrid': return <Network size={16} className="text-green-600" />
      case 'machine-learning': return <Lightbulb size={16} className="text-orange-600" />
      default: return <Activity size={16} />
    }
  }

  const getCollisionTypeIcon = (type: string) => {
    switch (type) {
      case 'head-on': return <AlertTriangle size={16} className="text-red-600" />
      case 'rear-end': return <Target size={16} className="text-orange-600" />
      case 'side-impact': return <Crosshair size={16} className="text-yellow-600" />
      case 'infrastructure': return <Warning size={16} className="text-blue-600" />
      case 'debris': return <XCircle size={16} className="text-gray-600" />
      case 'animal': return <Eye size={16} className="text-green-600" />
      default: return <AlertTriangle size={16} />
    }
  }

  const formatTimeToCollision = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}min`
  }

  const filteredPredictions = predictions.filter(p => {
    if (showOnlyCritical && p.severity !== 'critical') return false
    if (selectedAlgorithm !== 'all' && !p.algorithmUsed.includes(selectedAlgorithm)) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Critical Prediction Alert */}
      {predictions.some(p => p.severity === 'critical' && p.status === 'active') && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            KRITISCHE KOLLISIONSVORHERSAGE: Hochrisiko-Kollision in {
              formatTimeToCollision(Math.min(...predictions.filter(p => p.severity === 'critical' && p.status === 'active').map(p => p.predictedTime)))
            } vorhergesagt - Sofortige Intervention erforderlich
          </AlertDescription>
        </Alert>
      )}

      {/* System Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target size={20} className="text-red-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.totalPredictions}</p>
                <p className="text-sm text-muted-foreground">Vorhersagen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.systemAccuracy}%</p>
                <p className="text-sm text-muted-foreground">Genauigkeit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.collisionsAvoided}</p>
                <p className="text-sm text-muted-foreground">Verhindert</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Timer size={20} className="text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.averageWarningTime}s</p>
                <p className="text-sm text-muted-foreground">Ø Warnzeit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle size={20} className="text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.falsePositives}</p>
                <p className="text-sm text-muted-foreground">Fehlalarme</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightning size={20} className="text-cyan-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.processingLatency}s</p>
                <p className="text-sm text-muted-foreground">Latenz</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain size={20} className="text-indigo-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.algorithmsActive}</p>
                <p className="text-sm text-muted-foreground">KI-Modelle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gauge size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round((systemMetrics.accuratelyPredicted / systemMetrics.totalPredictions) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Erfolgsrate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active-predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active-predictions">Aktive Vorhersagen</TabsTrigger>
          <TabsTrigger value="algorithms">KI-Algorithmen</TabsTrigger>
          <TabsTrigger value="trajectory-analysis">Trajektorien-Analyse</TabsTrigger>
          <TabsTrigger value="performance-metrics">Performance-Metriken</TabsTrigger>
        </TabsList>

        <TabsContent value="active-predictions" className="space-y-6">
          {/* Filter Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kollisionsvorhersagen</CardTitle>
                  <CardDescription>KI-gestützte Echtzeit-Kollisionsanalyse und -vorhersage</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={showOnlyCritical ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowOnlyCritical(!showOnlyCritical)}
                  >
                    <AlertTriangle size={16} className="mr-2" />
                    Nur kritische
                  </Button>
                  <Badge variant="outline">
                    {filteredPredictions.filter(p => p.status === 'active').length} Aktive Vorhersagen
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPredictions.filter(p => p.status === 'active').map(prediction => (
                  <div key={prediction.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getCollisionTypeIcon(prediction.collisionType)}
                        <div>
                          <h4 className="font-medium">
                            {prediction.collisionType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Kollision
                          </h4>
                          <p className="text-sm text-muted-foreground">{prediction.impactLocation.section}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(prediction.severity)}>
                          {prediction.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {prediction.confidence}% Sicherheit
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Zeit bis Kollision:</p>
                        <p className="font-bold text-red-600">{formatTimeToCollision(prediction.predictedTime)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Primärobjekt:</p>
                        <p className="font-medium">{prediction.primaryObject.id} ({prediction.primaryObject.velocity} km/h)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sekundärobjekt:</p>
                        <p className="font-medium">{prediction.secondaryObject.id} ({prediction.secondaryObject.velocity} km/h)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Algorithmus:</p>
                        <p className="font-medium text-xs">{prediction.algorithmUsed.split('-')[0]}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Risikofaktoren:</p>
                        <div className="flex flex-wrap gap-1">
                          {prediction.riskFactors.map((factor, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Empfohlene Maßnahmen:</p>
                        <div className="flex flex-wrap gap-1">
                          {prediction.mitigationStrategies.map((strategy, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {strategy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>Erstellt: {new Date(prediction.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Cpu size={14} />
                          <span>Verarbeitung: {prediction.processingTime}ms</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye size={14} className="mr-1" />
                          Trajektorie
                        </Button>
                        <Button 
                          size="sm" 
                          variant={prediction.severity === 'critical' ? 'destructive' : 'default'}
                        >
                          <Shield size={14} className="mr-1" />
                          Maßnahme
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithms" className="space-y-6">
          {/* AI Algorithms Overview */}
          <Card>
            <CardHeader>
              <CardTitle>KI-Vorhersage-Algorithmen</CardTitle>
              <CardDescription>Spezialisierte Algorithmen für verschiedene Kollisionsarten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {algorithms.map(algorithm => (
                  <div key={algorithm.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getAlgorithmTypeIcon(algorithm.type)}
                        <div>
                          <h4 className="font-medium">{algorithm.name}</h4>
                          <p className="text-sm text-muted-foreground">{algorithm.version} • {algorithm.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${algorithm.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm font-medium">{algorithm.isActive ? 'Aktiv' : 'Inaktiv'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Genauigkeit:</p>
                        <p className="font-bold text-green-600">{algorithm.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fehlalarme:</p>
                        <p className="font-bold text-red-600">{algorithm.falsePositiveRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Verarbeitungszeit:</p>
                        <p className="font-medium">{algorithm.averageProcessingTime}ms</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Vorhersagen heute:</p>
                        <p className="font-medium">{algorithm.predictionsToday}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Konfidenz-Schwelle</span>
                        <span className="text-sm font-bold">{algorithm.confidenceThreshold}%</span>
                      </div>
                      <Progress value={algorithm.confidenceThreshold} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Spezialisierung:</p>
                      <div className="flex flex-wrap gap-1">
                        {algorithm.specialization.map((spec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        Letztes Update: {new Date(algorithm.lastUpdate).toLocaleTimeString()}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Activity size={14} className="mr-1" />
                          Statistiken
                        </Button>
                        <Button variant="outline" size="sm">
                          <Cpu size={14} className="mr-1" />
                          Konfiguration
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trajectory-analysis" className="space-y-6">
          {/* Trajectory Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Trajektorien-Analyse</CardTitle>
              <CardDescription>Bewegungsmuster und Vorhersagen für verfolgte Objekte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trajectories.map(trajectory => (
                  <div key={trajectory.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Radar size={20} className="text-blue-600" />
                        <div>
                          <h4 className="font-medium">Objekt: {trajectory.objectId}</h4>
                          <p className="text-sm text-muted-foreground">
                            Zeitfenster: {trajectory.timeHorizon}s | Konfidenz: {trajectory.pathConfidence}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={trajectory.anomalyScore > 5 ? 'destructive' : 'default'} className="text-xs">
                          Anomalie: {trajectory.anomalyScore.toFixed(2)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ±{trajectory.uncertaintyRadius}m
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Position (X,Y,Z):</p>
                        <p className="font-medium">
                          {trajectory.currentPosition.x.toFixed(1)}, {trajectory.currentPosition.y.toFixed(1)}, {trajectory.currentPosition.z.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Geschwindigkeit:</p>
                        <p className="font-medium">
                          {Math.sqrt(
                            trajectory.velocity.x ** 2 + 
                            trajectory.velocity.y ** 2 + 
                            trajectory.velocity.z ** 2
                          ).toFixed(1)} m/s
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Beschleunigung:</p>
                        <p className="font-medium">
                          {Math.sqrt(
                            trajectory.acceleration.x ** 2 + 
                            trajectory.acceleration.y ** 2 + 
                            trajectory.acceleration.z ** 2
                          ).toFixed(2)} m/s²
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Pfad-Konfidenz</span>
                        <span className="text-sm font-bold">{trajectory.pathConfidence}%</span>
                      </div>
                      <Progress value={trajectory.pathConfidence} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Vorhergesagter Pfad ({trajectory.predictedPath.length} Punkte):
                      </p>
                      <div className="bg-secondary/30 rounded p-2 text-xs font-mono">
                        {trajectory.predictedPath.slice(0, 3).map((point, idx) => (
                          <div key={idx}>
                            t+{idx}s: ({point.x.toFixed(1)}, {point.y.toFixed(1)}, {point.z.toFixed(1)})
                          </div>
                        ))}
                        {trajectory.predictedPath.length > 3 && <div>... weitere {trajectory.predictedPath.length - 3} Punkte</div>}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Globe size={14} className="mr-1" />
                        3D-Ansicht
                      </Button>
                      <Button variant="outline" size="sm">
                        <Database size={14} className="mr-1" />
                        Rohdaten
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance-metrics" className="space-y-6">
          {/* Algorithm Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Algorithmus-Performance Vergleich</CardTitle>
              <CardDescription>Leistungsvergleich aller aktiven KI-Modelle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {algorithms.filter(a => a.isActive).map(algorithm => (
                  <div key={algorithm.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAlgorithmTypeIcon(algorithm.type)}
                        <span className="font-medium">{algorithm.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {algorithm.predictionsToday} Vorhersagen heute
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Genauigkeit</span>
                          <span className="text-sm font-bold text-green-600">{algorithm.accuracy}%</span>
                        </div>
                        <Progress value={algorithm.accuracy} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Fehlalarm-Rate</span>
                          <span className="text-sm font-bold text-red-600">{algorithm.falsePositiveRate}%</span>
                        </div>
                        <Progress value={100 - algorithm.falsePositiveRate} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Geschwindigkeit</span>
                          <span className="text-sm font-bold text-blue-600">
                            {algorithm.averageProcessingTime < 100 ? 'Sehr schnell' :
                             algorithm.averageProcessingTime < 500 ? 'Schnell' : 'Normal'}
                          </span>
                        </div>
                        <Progress 
                          value={Math.max(0, 100 - (algorithm.averageProcessingTime / 10))} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall System Performance */}
          <Card>
            <CardHeader>
              <CardTitle>System-Gesamtleistung</CardTitle>
              <CardDescription>Kombinierte Metriken aller Vorhersage-Algorithmen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Durchschn. Genauigkeit</span>
                    <span className="text-lg font-bold text-green-600">{systemMetrics.systemAccuracy}%</span>
                  </div>
                  <Progress value={systemMetrics.systemAccuracy} className="h-2" />
                  <p className="text-xs text-muted-foreground">Zielwert: &gt;95%</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Durchschn. Warnzeit</span>
                    <span className="text-lg font-bold text-blue-600">{systemMetrics.averageWarningTime}s</span>
                  </div>
                  <Progress value={(systemMetrics.averageWarningTime / 300) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">Ziel: &gt;120s</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Erfolgsrate</span>
                    <span className="text-lg font-bold text-purple-600">
                      {Math.round((systemMetrics.accuratelyPredicted / systemMetrics.totalPredictions) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(systemMetrics.accuratelyPredicted / systemMetrics.totalPredictions) * 100} 
                    className="h-2" 
                  />
                  <p className="text-xs text-muted-foreground">
                    {systemMetrics.accuratelyPredicted} von {systemMetrics.totalPredictions}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System-Latenz</span>
                    <span className="text-lg font-bold text-cyan-600">{systemMetrics.processingLatency}s</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (systemMetrics.processingLatency / 2) * 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Ziel: &lt;0.5s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}