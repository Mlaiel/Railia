import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Satellite, 
  CloudRain, 
  Lightning, 
  Wind,
  Tree,
  ThermometerSimple,
  Eye,
  MapPin,
  Clock,
  Activity,
  AlertTriangle,
  Camera,
  Globe,
  Crosshair,
  Download,
  PlayCircle,
  PauseCircle,
  FastForward,
  Rewind,
  Calendar,
  Settings,
  Target,
  Lightbulb,
  Pulse
} from '@phosphor-icons/react'

interface SatelliteImage {
  id: string
  timestamp: string
  location: {
    lat: number
    lng: number
    name: string
  }
  imageType: 'visible' | 'infrared' | 'radar' | 'thermal' | 'multispectral'
  resolution: number // meters per pixel
  cloudCover: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  size: string
  analysisStatus: 'pending' | 'processing' | 'complete' | 'failed'
  weatherData: {
    temperature: number
    humidity: number
    pressure: number
    windSpeed: number
    precipitationIntensity: number
  }
  detectedThreats: WeatherThreat[]
}

interface WeatherThreat {
  type: 'storm' | 'flood' | 'ice' | 'wind' | 'landslide' | 'fire' | 'snow' | 'fog'
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  location: string
  estimatedTime: string
  affectedArea: number // km²
  railwayImpact: 'none' | 'minor' | 'moderate' | 'severe'
}

interface SatelliteProvider {
  name: string
  type: 'government' | 'commercial' | 'research'
  updateFrequency: number // minutes
  coverage: string[]
  status: 'online' | 'offline' | 'maintenance'
  lastUpdate: string
  imageCount: number
}

interface AnalysisAlert {
  id: string
  priority: 'info' | 'warning' | 'critical'
  title: string
  description: string
  location: string
  timestamp: string
  actionRequired: boolean
  estimatedImpact: string
}

export default function SatelliteImagerySystem() {
  const [satelliteImages, setSatelliteImages] = useKV<SatelliteImage[]>('satellite-images', [])
  const [providers, setProviders] = useKV<SatelliteProvider[]>('satellite-providers', [])
  const [analysisAlerts, setAnalysisAlerts] = useKV<AnalysisAlert[]>('analysis-alerts', [])
  const [systemStats, setSystemStats] = useKV('satellite-stats', {
    imagesProcessed: 1247,
    threatsDetected: 23,
    accuracyRate: 96.8,
    avgProcessingTime: 2.4,
    dataVolume: 12.7,
    activeSatellites: 8
  })

  const [selectedImageType, setSelectedImageType] = useState<string>('all')
  const [playbackMode, setPlaybackMode] = useState<'live' | 'historical'>('live')
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>('all')

  useEffect(() => {
    if (satelliteImages.length === 0) {
      const mockImages: SatelliteImage[] = [
        {
          id: 'SAT001',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          location: { lat: 52.5200, lng: 13.4050, name: 'Berlin-Brandenburg Corridor' },
          imageType: 'radar',
          resolution: 10,
          cloudCover: 15,
          quality: 'excellent',
          size: '45.2 MB',
          analysisStatus: 'complete',
          weatherData: {
            temperature: 12,
            humidity: 78,
            pressure: 1013,
            windSpeed: 25,
            precipitationIntensity: 8.5
          },
          detectedThreats: [
            {
              type: 'storm',
              severity: 'high',
              confidence: 89,
              location: 'Northern approach',
              estimatedTime: '45 minutes',
              affectedArea: 125,
              railwayImpact: 'moderate'
            }
          ]
        },
        {
          id: 'SAT002',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          location: { lat: 48.1351, lng: 11.5820, name: 'Munich Alpine Route' },
          imageType: 'visible',
          resolution: 5,
          cloudCover: 45,
          quality: 'good',
          size: '38.7 MB',
          analysisStatus: 'complete',
          weatherData: {
            temperature: 8,
            humidity: 85,
            pressure: 995,
            windSpeed: 45,
            precipitationIntensity: 12.3
          },
          detectedThreats: [
            {
              type: 'wind',
              severity: 'critical',
              confidence: 94,
              location: 'Mountain pass sections',
              estimatedTime: '15 minutes',
              affectedArea: 89,
              railwayImpact: 'severe'
            },
            {
              type: 'landslide',
              severity: 'medium',
              confidence: 67,
              location: 'Steep gradient zone',
              estimatedTime: '2 hours',
              affectedArea: 15,
              railwayImpact: 'minor'
            }
          ]
        },
        {
          id: 'SAT003',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          location: { lat: 53.5511, lng: 9.9937, name: 'Hamburg Coastal Line' },
          imageType: 'infrared',
          resolution: 15,
          cloudCover: 25,
          quality: 'excellent',
          size: '52.1 MB',
          analysisStatus: 'processing',
          weatherData: {
            temperature: 15,
            humidity: 82,
            pressure: 1008,
            windSpeed: 32,
            precipitationIntensity: 5.2
          },
          detectedThreats: [
            {
              type: 'flood',
              severity: 'medium',
              confidence: 76,
              location: 'Low-lying sections',
              estimatedTime: '3 hours',
              affectedArea: 67,
              railwayImpact: 'moderate'
            }
          ]
        }
      ]
      setSatelliteImages(mockImages)
    }

    if (providers.length === 0) {
      const mockProviders: SatelliteProvider[] = [
        {
          name: 'Sentinel-2 (ESA)',
          type: 'government',
          updateFrequency: 30,
          coverage: ['Europe', 'Germany'],
          status: 'online',
          lastUpdate: new Date(Date.now() - 240000).toISOString(),
          imageCount: 156
        },
        {
          name: 'Landsat-9 (NASA)',
          type: 'government', 
          updateFrequency: 45,
          coverage: ['Global'],
          status: 'online',
          lastUpdate: new Date(Date.now() - 180000).toISOString(),
          imageCount: 89
        },
        {
          name: 'Planet Labs',
          type: 'commercial',
          updateFrequency: 15,
          coverage: ['Europe', 'Major Rail Corridors'],
          status: 'online',
          lastUpdate: new Date(Date.now() - 120000).toISOString(),
          imageCount: 312
        },
        {
          name: 'EUMETSAT',
          type: 'government',
          updateFrequency: 10,
          coverage: ['Europe', 'Weather Systems'],
          status: 'online',
          lastUpdate: new Date(Date.now() - 300000).toISOString(),
          imageCount: 234
        },
        {
          name: 'COSMO-SkyMed',
          type: 'government',
          updateFrequency: 60,
          coverage: ['Europe', 'Infrastructure'],
          status: 'maintenance',
          lastUpdate: new Date(Date.now() - 7200000).toISOString(),
          imageCount: 67
        }
      ]
      setProviders(mockProviders)
    }

    if (analysisAlerts.length === 0) {
      const mockAlerts: AnalysisAlert[] = [
        {
          id: 'ALERT001',
          priority: 'critical',
          title: 'Schwerwiegende Sturmfront erkannt',
          description: 'Satellitenbilder zeigen eine intensive Sturmfront mit Windgeschwindigkeiten über 80 km/h, die in 45 Minuten die Berliner Strecke erreichen wird.',
          location: 'Berlin-Brandenburg Corridor',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          actionRequired: true,
          estimatedImpact: 'Streckenschließung 2-4 Stunden'
        },
        {
          id: 'ALERT002',
          priority: 'warning',
          title: 'Erhöhtes Erdrutschrisiko',
          description: 'Infrarotaufnahmen zeigen Bodensättigung in Hanglagen. Überwachung der Steilstrecken empfohlen.',
          location: 'Munich Alpine Route',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          actionRequired: true,
          estimatedImpact: 'Geschwindigkeitsbegrenzung möglich'
        },
        {
          id: 'ALERT003',
          priority: 'info',
          title: 'Verbesserte Sichtbedingungen',
          description: 'Aktuelle Satellitenbilder zeigen auflösende Wolkendecke, Normalbetrieb kann wiederaufgenommen werden.',
          location: 'Hamburg Coastal Line',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          actionRequired: false,
          estimatedImpact: 'Betriebsoptimierung möglich'
        }
      ]
      setAnalysisAlerts(mockAlerts)
    }
  }, [satelliteImages, setSatelliteImages, providers, setProviders, analysisAlerts, setAnalysisAlerts])

  const getImageTypeIcon = (type: string) => {
    switch (type) {
      case 'visible': return <Eye size={16} className="text-blue-500" />
      case 'infrared': return <ThermometerSimple size={16} className="text-red-500" />
      case 'radar': return <Pulse size={16} className="text-green-500" />
      case 'thermal': return <ThermometerSimple size={16} className="text-orange-500" />
      case 'multispectral': return <Lightbulb size={16} className="text-purple-500" />
      default: return <Camera size={16} />
    }
  }

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'storm': return <Lightning size={16} className="text-purple-600" />
      case 'flood': return <CloudRain size={16} className="text-blue-600" />
      case 'wind': return <Wind size={16} className="text-gray-600" />
      case 'landslide': return <Tree size={16} className="text-amber-600" />
      case 'fire': return <ThermometerSimple size={16} className="text-red-600" />
      default: return <AlertTriangle size={16} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'default'
      case 'medium': return 'secondary'
      case 'high': return 'destructive'
      case 'critical': return 'destructive'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'info': return 'default'
      case 'warning': return 'secondary'
      case 'critical': return 'destructive'
      default: return 'default'
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'fair': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* System Overview Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Camera size={20} className="text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{systemStats.imagesProcessed}</p>
                <p className="text-sm text-muted-foreground">Bilder analysiert</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={20} className="text-destructive" />
              <div>
                <p className="text-2xl font-bold">{systemStats.threatsDetected}</p>
                <p className="text-sm text-muted-foreground">Bedrohungen erkannt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">{systemStats.accuracyRate}%</p>
                <p className="text-sm text-muted-foreground">Genauigkeitsrate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{systemStats.avgProcessingTime}s</p>
                <p className="text-sm text-muted-foreground">Ø Verarbeitung</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download size={20} className="text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{systemStats.dataVolume} TB</p>
                <p className="text-sm text-muted-foreground">Datenvolumen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Satellite size={20} className="text-cyan-600" />
              <div>
                <p className="text-2xl font-bold">{systemStats.activeSatellites}</p>
                <p className="text-sm text-muted-foreground">Aktive Satelliten</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Analysis Alerts */}
      {analysisAlerts.some(a => a.priority === 'critical') && (
        <Alert className="border-destructive bg-destructive/10">
          <Lightning className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            KRITISCHE WETTERANALYSE: {analysisAlerts.find(a => a.priority === 'critical')?.title} - Sofortige Maßnahmen erforderlich
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="live-analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live-analysis">Live-Analyse</TabsTrigger>
          <TabsTrigger value="satellite-feeds">Satelliten-Feeds</TabsTrigger>
          <TabsTrigger value="threat-detection">Bedrohungserkennung</TabsTrigger>
          <TabsTrigger value="providers">Provider-Status</TabsTrigger>
        </TabsList>

        <TabsContent value="live-analysis" className="space-y-6">
          {/* Real-time Image Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Echtzeit-Satellitenanalyse</CardTitle>
                  <CardDescription>Aktuelle Aufnahmen und KI-gestützte Wetteranalyse</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                    {isPlaying ? 'Pausieren' : 'Live-Modus'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings size={16} className="mr-2" />
                    Einstellungen
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {satelliteImages.slice(0, 3).map(image => (
                  <div key={image.id} className="border rounded-lg overflow-hidden">
                    {/* Simulated satellite image placeholder */}
                    <div className="h-48 bg-gradient-to-br from-blue-900 via-blue-700 to-green-600 relative">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {getImageTypeIcon(image.imageType)}
                          <span className="ml-1 capitalize">{image.imageType}</span>
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getQualityColor(image.quality)}`}>
                          {image.quality}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="text-xs">
                          {image.resolution}m/px
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/60 backdrop-blur rounded p-2 text-white text-xs">
                          <div className="flex items-center justify-between">
                            <span>{image.location.name}</span>
                            <span>{new Date(image.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Weather Data */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temperatur:</span>
                          <span className="font-medium">{image.weatherData.temperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Wind:</span>
                          <span className="font-medium">{image.weatherData.windSpeed} km/h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Niederschlag:</span>
                          <span className="font-medium">{image.weatherData.precipitationIntensity} mm/h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bewölkung:</span>
                          <span className="font-medium">{image.cloudCover}%</span>
                        </div>
                      </div>

                      {/* Detected Threats */}
                      {image.detectedThreats.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground">Erkannte Bedrohungen:</h5>
                          {image.detectedThreats.map((threat, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                              <div className="flex items-center gap-2">
                                {getThreatIcon(threat.type)}
                                <span className="text-sm capitalize">{threat.type}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={getSeverityColor(threat.severity)} className="text-xs">
                                  {threat.confidence}%
                                </Badge>
                                <span className="text-xs text-muted-foreground">{threat.estimatedTime}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Analysis Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            image.analysisStatus === 'complete' ? 'bg-green-500' :
                            image.analysisStatus === 'processing' ? 'bg-yellow-500 animate-pulse' :
                            image.analysisStatus === 'pending' ? 'bg-gray-400' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm capitalize">{image.analysisStatus}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{image.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse-Alarme</CardTitle>
              <CardDescription>Automatisch generierte Warnungen aus der Satellitenbildanalyse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisAlerts.map(alert => (
                  <div key={alert.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={getPriorityColor(alert.priority)}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <h4 className="font-medium">{alert.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={14} />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{alert.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-muted-foreground" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle size={14} className="text-muted-foreground" />
                          <span>{alert.estimatedImpact}</span>
                        </div>
                      </div>
                      {alert.actionRequired && (
                        <Button size="sm" variant="outline">
                          Maßnahme einleiten
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satellite-feeds" className="space-y-6">
          {/* Satellite Provider Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map(provider => (
              <Card key={provider.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    <Badge variant={provider.status === 'online' ? 'default' : 'destructive'} className="text-xs">
                      {provider.status}
                    </Badge>
                  </div>
                  <CardDescription className="capitalize">{provider.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Update-Frequenz:</span>
                      <span className="font-medium">{provider.updateFrequency}min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bilder heute:</span>
                      <span className="font-medium">{provider.imageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Letztes Update:</span>
                      <span className="font-medium">{new Date(provider.lastUpdate).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Abdeckung:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.coverage.map(area => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings size={14} className="mr-2" />
                      Konfigurieren
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threat-detection" className="space-y-6">
          {/* Threat Detection Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Bedrohungserkennungs-Leistung</CardTitle>
              <CardDescription>KI-Modell Genauigkeit nach Bedrohungstyp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { threat: 'Sturmsysteme', accuracy: 96.8, detections: 156, color: 'bg-purple-500' },
                  { threat: 'Überschwemmungen', accuracy: 94.2, detections: 89, color: 'bg-blue-500' },
                  { threat: 'Erdrutsche', accuracy: 89.5, detections: 23, color: 'bg-amber-500' },
                  { threat: 'Starke Winde', accuracy: 92.1, detections: 134, color: 'bg-gray-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{item.threat}</h4>
                      <span className="text-lg font-bold text-primary">{item.accuracy}%</span>
                    </div>
                    
                    <Progress value={item.accuracy} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.detections} Erkennungen</span>
                      <span>Letzte 30 Tage</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Threat Detections */}
          <Card>
            <CardHeader>
              <CardTitle>Aktuelle Bedrohungserkennungen</CardTitle>
              <CardDescription>Automatisch erkannte Wetterereignisse aus Satellitenbildern</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {satelliteImages.flatMap(image => 
                  image.detectedThreats.map(threat => (
                    <div key={`${image.id}-${threat.type}`} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getThreatIcon(threat.type)}
                          <div>
                            <h4 className="font-medium capitalize">{threat.type}</h4>
                            <p className="text-sm text-muted-foreground">{threat.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getSeverityColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{threat.confidence}% Sicherheit</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Geschätzte Zeit:</p>
                          <p className="font-medium">{threat.estimatedTime}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Betroffenes Gebiet:</p>
                          <p className="font-medium">{threat.affectedArea} km²</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Bahnauswirkung:</p>
                          <p className="font-medium capitalize">{threat.railwayImpact}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          Erkannt von: {image.location.name} | {new Date(image.timestamp).toLocaleString()}
                        </span>
                        <Button size="sm" variant="outline">
                          Details anzeigen
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          {/* Detailed Provider Information */}
          <Card>
            <CardHeader>
              <CardTitle>Satelliten-Provider Übersicht</CardTitle>
              <CardDescription>Detaillierte Informationen zu allen verfügbaren Datenquellen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map(provider => (
                  <div key={provider.name} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Satellite size={20} className="text-blue-600" />
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{provider.type} Provider</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          provider.status === 'online' ? 'bg-green-500' :
                          provider.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium capitalize">{provider.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Update-Intervall:</p>
                        <p className="font-medium">{provider.updateFrequency} Minuten</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bilder heute:</p>
                        <p className="font-medium">{provider.imageCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Letztes Update:</p>
                        <p className="font-medium">{new Date(provider.lastUpdate).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Verfügbarkeit:</p>
                        <p className="font-medium">
                          {provider.status === 'online' ? '99.8%' : 
                           provider.status === 'maintenance' ? '85.2%' : '12.4%'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Geografische Abdeckung:</p>
                      <div className="flex flex-wrap gap-2">
                        {provider.coverage.map(area => (
                          <Badge key={area} variant="outline" className="text-xs">
                            <Globe size={12} className="mr-1" />
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Activity size={14} className="mr-2" />
                        Statistiken
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings size={14} className="mr-2" />
                        Konfiguration
                      </Button>
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