import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SatelliteImageViewer from './SatelliteImageViewer.tsx'
import { 
  Satellite, 
  CloudRain, 
  Lightning, 
  Wind,
  ThermometerSimple,
  Eye,
  MapPin,
  Clock,
  Activity,
  AlertTriangle,
  Camera,
  Target,
  Brain,
  TrendUp,
  Database,
  Globe,
  Pulse,
  Crosshair,
  Settings
} from '@phosphor-icons/react'

interface WeatherPredictionModel {
  id: string
  name: string
  type: 'neural_network' | 'ensemble' | 'deep_learning' | 'hybrid'
  accuracy: number
  lastTrained: string
  dataPoints: number
  predictionRange: string
  status: 'active' | 'training' | 'inactive'
  satelliteIntegration: boolean
}

interface RealTimeWeatherEvent {
  id: string
  timestamp: string
  eventType: 'storm' | 'precipitation' | 'wind' | 'temperature_anomaly' | 'pressure_change'
  location: {
    lat: number
    lng: number
    name: string
  }
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  satelliteConfirmed: boolean
  predictedDuration: number // minutes
  affectedArea: number // km²
  railwayImpact: {
    lines: string[]
    expectedDelay: number
    operationalStatus: 'normal' | 'reduced' | 'suspended'
  }
  aiPrediction: {
    model: string
    nextUpdate: string
    trends: string[]
  }
}

interface SatelliteAnalysisResult {
  id: string
  satelliteName: string
  analysisTime: string
  coverageArea: string
  detectedAnomalies: number
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
  weatherPatterns: Array<{
    type: string
    intensity: number
    movement: string
    estimatedArrival: string
  }>
  recommendations: string[]
}

export default function RealTimeWeatherAnalysis() {
  const [predictionModels, setPredictionModels] = useKV<WeatherPredictionModel[]>('prediction-models', [])
  const [activeEvents, setActiveEvents] = useKV<RealTimeWeatherEvent[]>('weather-events', [])
  const [analysisResults, setAnalysisResults] = useKV<SatelliteAnalysisResult[]>('satellite-analysis', [])
  const [systemMetrics, setSystemMetrics] = useKV('weather-analysis-metrics', {
    totalPredictions: 2847,
    accuracyImprovement: 12.4,
    satelliteDataPoints: 156789,
    processingSpeed: 2.3,
    activeSensors: 234,
    coverageArea: 89.7
  })

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '6h' | '24h' | '7d'>('6h')
  const [selectedModel, setSelectedModel] = useState<string>('all')

  useEffect(() => {
    if (predictionModels.length === 0) {
      const mockModels: WeatherPredictionModel[] = [
        {
          id: 'model-001',
          name: 'DeepWeather Neural Network',
          type: 'deep_learning',
          accuracy: 96.8,
          lastTrained: new Date(Date.now() - 3600000).toISOString(),
          dataPoints: 1500000,
          predictionRange: '0-48 Stunden',
          status: 'active',
          satelliteIntegration: true
        },
        {
          id: 'model-002', 
          name: 'Ensemble Storm Predictor',
          type: 'ensemble',
          accuracy: 94.2,
          lastTrained: new Date(Date.now() - 7200000).toISOString(),
          dataPoints: 890000,
          predictionRange: '1-72 Stunden',
          status: 'active',
          satelliteIntegration: true
        },
        {
          id: 'model-003',
          name: 'Hybrid Weather Fusion',
          type: 'hybrid',
          accuracy: 92.1,
          lastTrained: new Date(Date.now() - 1800000).toISOString(),
          dataPoints: 2100000,
          predictionRange: '0-24 Stunden',
          status: 'training',
          satelliteIntegration: true
        },
        {
          id: 'model-004',
          name: 'RailWeather Specialized',
          type: 'neural_network',
          accuracy: 89.7,
          lastTrained: new Date(Date.now() - 5400000).toISOString(),
          dataPoints: 567000,
          predictionRange: '0-12 Stunden',
          status: 'active',
          satelliteIntegration: false
        }
      ]
      setPredictionModels(mockModels)
    }

    if (activeEvents.length === 0) {
      const mockEvents: RealTimeWeatherEvent[] = [
        {
          id: 'event-001',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          eventType: 'storm',
          location: { lat: 52.5200, lng: 13.4050, name: 'Berlin Central' },
          severity: 'high',
          confidence: 94,
          satelliteConfirmed: true,
          predictedDuration: 180,
          affectedArea: 125,
          railwayImpact: {
            lines: ['RE45', 'IC78', 'RB23'],
            expectedDelay: 25,
            operationalStatus: 'reduced'
          },
          aiPrediction: {
            model: 'DeepWeather Neural Network',
            nextUpdate: new Date(Date.now() + 300000).toISOString(),
            trends: ['Intensification expected', 'Movement eastward', 'Peak in 45 min']
          }
        },
        {
          id: 'event-002',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          eventType: 'wind',
          location: { lat: 48.1351, lng: 11.5820, name: 'Munich Alpine' },
          severity: 'critical',
          confidence: 98,
          satelliteConfirmed: true,
          predictedDuration: 240,
          affectedArea: 89,
          railwayImpact: {
            lines: ['RB34', 'RE67'],
            expectedDelay: 45,
            operationalStatus: 'suspended'
          },
          aiPrediction: {
            model: 'Ensemble Storm Predictor',
            nextUpdate: new Date(Date.now() + 600000).toISOString(),
            trends: ['Wind speed increasing', 'Tree fall risk critical', 'Duration extended']
          }
        },
        {
          id: 'event-003',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          eventType: 'precipitation',
          location: { lat: 53.5511, lng: 9.9937, name: 'Hamburg Coastal' },
          severity: 'medium',
          confidence: 87,
          satelliteConfirmed: true,
          predictedDuration: 90,
          affectedArea: 67,
          railwayImpact: {
            lines: ['IC12', 'RE89'],
            expectedDelay: 12,
            operationalStatus: 'normal'
          },
          aiPrediction: {
            model: 'Hybrid Weather Fusion',
            nextUpdate: new Date(Date.now() + 180000).toISOString(),
            trends: ['Weakening expected', 'Moving inland', 'Clear by evening']
          }
        }
      ]
      setActiveEvents(mockEvents)
    }

    if (analysisResults.length === 0) {
      const mockResults: SatelliteAnalysisResult[] = [
        {
          id: 'analysis-001',
          satelliteName: 'Sentinel-2A',
          analysisTime: new Date(Date.now() - 300000).toISOString(),
          coverageArea: 'Central Europe Railway Corridor',
          detectedAnomalies: 7,
          threatLevel: 'high',
          weatherPatterns: [
            {
              type: 'Cumulonimbus Formation',
              intensity: 85,
              movement: 'Northeast at 35 km/h',
              estimatedArrival: '42 minutes'
            },
            {
              type: 'Strong Wind Shear',
              intensity: 92,
              movement: 'East-Southeast at 45 km/h',
              estimatedArrival: '18 minutes'
            }
          ],
          recommendations: [
            'Implement immediate speed restrictions on exposed sections',
            'Deploy emergency response teams to high-risk areas',
            'Activate passenger notification systems'
          ]
        },
        {
          id: 'analysis-002',
          satelliteName: 'EUMETSAT-MSG',
          analysisTime: new Date(Date.now() - 600000).toISOString(),
          coverageArea: 'Southern Germany Alpine Region',
          detectedAnomalies: 12,
          threatLevel: 'critical',
          weatherPatterns: [
            {
              type: 'Orographic Precipitation',
              intensity: 78,
              movement: 'Stationary over mountains',
              estimatedArrival: 'Currently active'
            },
            {
              type: 'Föhn Wind Effects',
              intensity: 95,
              movement: 'Valley channeling effects',
              estimatedArrival: 'Currently active'
            }
          ],
          recommendations: [
            'Close mountain pass sections immediately',
            'Reroute traffic via alternate lowland routes',
            'Position clearing equipment for tree removal'
          ]
        }
      ]
      setAnalysisResults(mockResults)
    }
  }, [predictionModels, setPredictionModels, activeEvents, setActiveEvents, analysisResults, setAnalysisResults])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'default'
      case 'medium': return 'secondary'
      case 'high': return 'destructive'
      case 'critical': return 'destructive'
      default: return 'default'
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'storm': return <Lightning size={16} className="text-purple-600" />
      case 'precipitation': return <CloudRain size={16} className="text-blue-600" />
      case 'wind': return <Wind size={16} className="text-gray-600" />
      case 'temperature_anomaly': return <ThermometerSimple size={16} className="text-red-600" />
      case 'pressure_change': return <Activity size={16} className="text-green-600" />
      default: return <AlertTriangle size={16} />
    }
  }

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'neural_network': return <Brain size={16} className="text-blue-600" />
      case 'ensemble': return <Target size={16} className="text-green-600" />
      case 'deep_learning': return <Eye size={16} className="text-purple-600" />
      case 'hybrid': return <Activity size={16} className="text-orange-600" />
      default: return <Database size={16} />
    }
  }

  const getOperationalStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600'
      case 'reduced': return 'text-yellow-600'
      case 'suspended': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* System Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain size={20} className="text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.totalPredictions}</p>
                <p className="text-sm text-muted-foreground">KI-Vorhersagen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendUp size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">+{systemMetrics.accuracyImprovement}%</p>
                <p className="text-sm text-muted-foreground">Genauigkeit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Satellite size={20} className="text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.satelliteDataPoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Datenpunkte</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Pulse size={20} className="text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.processingSpeed}s</p>
                <p className="text-sm text-muted-foreground">Verarbeitung</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity size={20} className="text-cyan-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.activeSensors}</p>
                <p className="text-sm text-muted-foreground">Aktive Sensoren</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe size={20} className="text-teal-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.coverageArea}%</p>
                <p className="text-sm text-muted-foreground">Abdeckung</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Weather Alert */}
      {activeEvents.some(e => e.severity === 'critical') && (
        <Alert className="border-destructive bg-destructive/10">
          <Lightning className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            KRITISCHE WETTERLAGE: {activeEvents.find(e => e.severity === 'critical')?.location.name} - 
            Satellitengestützte KI-Analyse bestätigt extreme Wetterbedingungen - Sofortige Maßnahmen erforderlich
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="real-time-events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="real-time-events">Echtzeit-Ereignisse</TabsTrigger>
          <TabsTrigger value="prediction-models">KI-Modelle</TabsTrigger>
          <TabsTrigger value="satellite-analysis">Satelliten-Analyse</TabsTrigger>
          <TabsTrigger value="performance-metrics">Leistungsmetriken</TabsTrigger>
        </TabsList>

        <TabsContent value="real-time-events" className="space-y-6">
          {/* Active Weather Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Aktive Wetter-Ereignisse</CardTitle>
                  <CardDescription>KI-gestützte Echtzeit-Wetteranalyse mit Satelliten-Verifikation</CardDescription>
                </div>
                <div className="flex gap-2">
                  {['1h', '6h', '24h', '7d'].map(timeframe => (
                    <Button
                      key={timeframe}
                      variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeframe(timeframe as any)}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeEvents.map(event => (
                  <div key={event.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getEventTypeIcon(event.eventType)}
                        <div>
                          <h4 className="font-medium capitalize">{event.eventType.replace('_', ' ')}</h4>
                          <p className="text-sm text-muted-foreground">{event.location.name}</p>
                        </div>
                        {event.satelliteConfirmed && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <Satellite size={12} className="mr-1" />
                            Satelliten-bestätigt
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant={getSeverityColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{event.confidence}% Sicherheit</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Voraussichtliche Dauer:</p>
                        <p className="font-medium">{event.predictedDuration} Minuten</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Betroffenes Gebiet:</p>
                        <p className="font-medium">{event.affectedArea} km²</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Erwartete Verspätung:</p>
                        <p className="font-medium">{event.railwayImpact.expectedDelay} Minuten</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Betroffene Linien:</p>
                        <div className="flex flex-wrap gap-2">
                          {event.railwayImpact.lines.map(line => (
                            <Badge key={line} variant="outline" className="text-xs">
                              {line}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Betriebsstatus:</p>
                        <span className={`text-sm font-medium capitalize ${getOperationalStatusColor(event.railwayImpact.operationalStatus)}`}>
                          {event.railwayImpact.operationalStatus}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t bg-blue-50/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700">KI-Vorhersage ({event.aiPrediction.model}):</span>
                        <span className="text-xs text-blue-600">
                          Nächstes Update: {new Date(event.aiPrediction.nextUpdate).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {event.aiPrediction.trends.map((trend, idx) => (
                          <p key={idx} className="text-sm text-blue-600">• {trend}</p>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Eye size={14} className="mr-2" />
                        Details anzeigen
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin size={14} className="mr-2" />
                        Auf Karte
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction-models" className="space-y-6">
          {/* AI Prediction Models */}
          <Card>
            <CardHeader>
              <CardTitle>KI-Vorhersagemodelle</CardTitle>
              <CardDescription>Übersicht der aktiven Machine Learning Modelle für Wettervorhersagen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {predictionModels.map(model => (
                  <div key={model.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getModelTypeIcon(model.type)}
                        <div>
                          <h4 className="font-medium">{model.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{model.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          model.status === 'active' ? 'bg-green-500' :
                          model.status === 'training' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-sm capitalize">{model.status}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Genauigkeit:</span>
                          <span className="font-bold text-primary">{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Datenpunkte:</p>
                          <p className="font-medium">{model.dataPoints.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Vorhersagebereich:</p>
                          <p className="font-medium">{model.predictionRange}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Letztes Training:</span>
                        <span>{new Date(model.lastTrained).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {model.satelliteIntegration && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              <Satellite size={12} className="mr-1" />
                              Satelliten-Integration
                            </Badge>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings size={14} className="mr-2" />
                          Konfigurieren
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satellite-analysis" className="space-y-6">
          {/* Satellite Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle>Satelliten-Analyseergebnisse</CardTitle>
              <CardDescription>Automatisierte Auswertung von Satellitenbildern für Wettervorhersagen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysisResults.map(result => (
                  <div key={result.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Satellite size={20} className="text-blue-600" />
                        <div>
                          <h4 className="font-medium">{result.satelliteName}</h4>
                          <p className="text-sm text-muted-foreground">{result.coverageArea}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getSeverityColor(result.threatLevel)}>
                          {result.threatLevel.toUpperCase()} BEDROHUNG
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.detectedAnomalies} Anomalien erkannt
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-sm mb-3">Erkannte Wettermuster:</h5>
                        <div className="space-y-3">
                          {result.weatherPatterns.map((pattern, idx) => (
                            <div key={idx} className="p-3 bg-secondary/30 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">{pattern.type}</span>
                                <span className="text-sm text-primary font-bold">{pattern.intensity}%</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                <div>
                                  <span>Bewegung: </span>
                                  <span className="font-medium">{pattern.movement}</span>
                                </div>
                                <div>
                                  <span>Ankunft: </span>
                                  <span className="font-medium">{pattern.estimatedArrival}</span>
                                </div>
                              </div>
                              <Progress value={pattern.intensity} className="h-1 mt-2" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-3">KI-Empfehlungen:</h5>
                        <div className="space-y-2">
                          {result.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
                      <span>Analyse-Zeit: {new Date(result.analysisTime).toLocaleString()}</span>
                      <Button variant="outline" size="sm">
                        <Camera size={14} className="mr-2" />
                        Bilder anzeigen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance-metrics" className="space-y-6">
          {/* Performance Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Modell-Leistung</CardTitle>
                <CardDescription>Genauigkeit der verschiedenen KI-Modelle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictionModels.map(model => (
                    <div key={model.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{model.name}</span>
                        <span className="font-bold">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{model.type.replace('_', ' ')}</span>
                        <span>{model.satelliteIntegration ? 'Mit Satelliten' : 'Ohne Satelliten'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verbesserung durch Satellitendaten</CardTitle>
                <CardDescription>Genauigkeitssteigerung mit Satelliten-Integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Sturmerkennung', improvement: 15.2, baseline: 81.6 },
                    { category: 'Niederschlagsvorhersage', improvement: 12.8, baseline: 83.4 },
                    { category: 'Windgeschwindigkeit', improvement: 18.5, baseline: 79.2 },
                    { category: 'Temperaturtrends', improvement: 8.9, baseline: 91.1 }
                  ].map((metric, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{metric.category}</span>
                        <span className="font-bold text-green-600">+{metric.improvement}%</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Progress value={metric.baseline} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">Basis: {metric.baseline}%</p>
                        </div>
                        <div className="flex-1">
                          <Progress value={metric.baseline + metric.improvement} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">Mit Satelliten: {(metric.baseline + metric.improvement).toFixed(1)}%</p>
                        </div>
                      </div>
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