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
  Crosshair,
  Shield,
  AlertTriangle,
  Activity,
  MapPin,
  Clock,
  Eye,
  Radar,
  Target,
  Lightning,
  Cpu,
  Database,
  CloudArrowDown,
  Timer,
  Gauge,
  Warning,
  CheckCircle,
  XCircle,
  Cube,
  Pulse,
  Brain,
  Network,
  Scan,
  Globe
} from '@phosphor-icons/react'

interface LidarDataPoint {
  id: string
  timestamp: string
  coordinates: {
    x: number
    y: number
    z: number
    intensity: number
  }
  classification: 'ground' | 'vegetation' | 'building' | 'vehicle' | 'railway' | 'obstacle' | 'unknown'
  confidence: number
  source: string
}

interface CollisionThreat {
  id: string
  type: 'train-obstacle' | 'infrastructure-damage' | 'vegetation-overgrowth' | 'landslide' | 'debris' | 'vehicle-intrusion'
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  location: {
    lat: number
    lng: number
    trackKm: number
    section: string
  }
  estimatedImpact: string
  timeToCollision: number // seconds
  detectionSource: 'lidar' | 'satellite' | 'fusion'
  objectDimensions: {
    width: number
    height: number
    length: number
  }
  velocity: {
    speed: number // km/h
    direction: number // degrees
  }
  mitigationActions: string[]
  status: 'detected' | 'confirmed' | 'resolved' | 'false-positive'
}

interface LidarSensor {
  id: string
  name: string
  location: {
    lat: number
    lng: number
    altitude: number
  }
  range: number // meters
  accuracy: number // cm
  scanRate: number // Hz
  status: 'online' | 'offline' | 'maintenance' | 'calibrating'
  lastUpdate: string
  dataVolume: number // MB/hour
  pointsPerSecond: number
  coverage: string[]
}

interface FusionAnalysis {
  id: string
  timestamp: string
  satelliteImageId: string
  lidarScanId: string
  correlationScore: number
  threatsIdentified: number
  processingTime: number // ms
  aiModelVersion: string
  confidenceLevel: number
  alertsGenerated: CollisionThreat[]
}

export default function SatelliteLidarCollisionSystem() {
  const [collisionThreats, setCollisionThreats] = useKV<CollisionThreat[]>('collision-threats', [])
  const [lidarSensors, setLidarSensors] = useKV<LidarSensor[]>('lidar-sensors', [])
  const [fusionAnalyses, setFusionAnalyses] = useKV<FusionAnalysis[]>('fusion-analyses', [])
  const [systemMetrics, setSystemMetrics] = useKV('lidar-collision-metrics', {
    threatsDetected: 47,
    falsePositiveRate: 2.3,
    averageDetectionTime: 1.2,
    systemAccuracy: 98.7,
    activeSensors: 24,
    dataProcessedToday: 847.2,
    collisionsAvoided: 12,
    systemUptime: 99.1
  })

  const [activeView, setActiveView] = useState<'realtime' | '3d-visualization' | 'threat-analysis'>('realtime')
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null)
  const [alertsEnabled, setAlertsEnabled] = useState(true)

  useEffect(() => {
    if (collisionThreats.length === 0) {
      const mockThreats: CollisionThreat[] = [
        {
          id: 'THREAT001',
          type: 'train-obstacle',
          severity: 'critical',
          confidence: 96.8,
          location: {
            lat: 52.5200,
            lng: 13.4050,
            trackKm: 127.8,
            section: 'Berlin-Brandenburg Hauptstrecke'
          },
          estimatedImpact: 'Zugentgleisung möglich',
          timeToCollision: 145,
          detectionSource: 'fusion',
          objectDimensions: {
            width: 2.1,
            height: 1.8,
            length: 4.5
          },
          velocity: {
            speed: 0,
            direction: 0
          },
          mitigationActions: [
            'Sofortige Streckensperrung',
            'Räumfahrzeug entsenden',
            'Zugverkehr umleiten'
          ],
          status: 'confirmed'
        },
        {
          id: 'THREAT002',
          type: 'vegetation-overgrowth',
          severity: 'medium',
          confidence: 84.2,
          location: {
            lat: 48.1351,
            lng: 11.5820,
            trackKm: 89.3,
            section: 'München-Augsburg Strecke'
          },
          estimatedImpact: 'Sichtbehinderung für Lokführer',
          timeToCollision: 3600,
          detectionSource: 'satellite',
          objectDimensions: {
            width: 15.0,
            height: 4.2,
            length: 25.0
          },
          velocity: {
            speed: 0,
            direction: 0
          },
          mitigationActions: [
            'Vegetation beschneiden',
            'Wartungsteam planen',
            'Geschwindigkeitsbegrenzung prüfen'
          ],
          status: 'detected'
        },
        {
          id: 'THREAT003',
          type: 'infrastructure-damage',
          severity: 'high',
          confidence: 91.5,
          location: {
            lat: 53.5511,
            lng: 9.9937,
            trackKm: 156.7,
            section: 'Hamburg-Bremen Verbindung'
          },
          estimatedImpact: 'Schienenschaden durch Erosion',
          timeToCollision: 7200,
          detectionSource: 'lidar',
          objectDimensions: {
            width: 3.0,
            height: 0.5,
            length: 8.0
          },
          velocity: {
            speed: 0,
            direction: 0
          },
          mitigationActions: [
            'Sofortige Inspektion',
            'Notfall-Reparatur',
            'Geschwindigkeitsreduzierung'
          ],
          status: 'confirmed'
        }
      ]
      setCollisionThreats(mockThreats)
    }

    if (lidarSensors.length === 0) {
      const mockSensors: LidarSensor[] = [
        {
          id: 'LIDAR001',
          name: 'Berlin Hauptbahnhof Nord',
          location: { lat: 52.5251, lng: 13.3694, altitude: 45 },
          range: 1000,
          accuracy: 2,
          scanRate: 20,
          status: 'online',
          lastUpdate: new Date(Date.now() - 120000).toISOString(),
          dataVolume: 156.7,
          pointsPerSecond: 150000,
          coverage: ['Hauptstrecke', 'Weichenbereich', 'Bahnsteige']
        },
        {
          id: 'LIDAR002',
          name: 'München Alpenpass Monitor',
          location: { lat: 48.1351, lng: 11.5820, altitude: 520 },
          range: 1500,
          accuracy: 1.5,
          scanRate: 25,
          status: 'online',
          lastUpdate: new Date(Date.now() - 180000).toISOString(),
          dataVolume: 203.4,
          pointsPerSecond: 200000,
          coverage: ['Bergstrecke', 'Tunneleingang', 'Hangüberwachung']
        },
        {
          id: 'LIDAR003',
          name: 'Hamburg Küstenüberwachung',
          location: { lat: 53.5511, lng: 9.9937, altitude: 15 },
          range: 800,
          accuracy: 3,
          scanRate: 15,
          status: 'maintenance',
          lastUpdate: new Date(Date.now() - 3600000).toISOString(),
          dataVolume: 89.2,
          pointsPerSecond: 120000,
          coverage: ['Küstenstrecke', 'Deichüberwachung']
        },
        {
          id: 'LIDAR004',
          name: 'Frankfurt Knotenpunkt',
          location: { lat: 50.1109, lng: 8.6821, altitude: 112 },
          range: 1200,
          accuracy: 2.5,
          scanRate: 30,
          status: 'online',
          lastUpdate: new Date(Date.now() - 90000).toISOString(),
          dataVolume: 278.9,
          pointsPerSecond: 250000,
          coverage: ['Hauptknotenpunkt', 'Rangierbereich', 'ICE-Strecken']
        }
      ]
      setLidarSensors(mockSensors)
    }

    if (fusionAnalyses.length === 0) {
      const mockAnalyses: FusionAnalysis[] = [
        {
          id: 'FUSION001',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          satelliteImageId: 'SAT001',
          lidarScanId: 'SCAN001',
          correlationScore: 94.6,
          threatsIdentified: 2,
          processingTime: 1847,
          aiModelVersion: 'CollisionAI-v3.2.1',
          confidenceLevel: 96.8,
          alertsGenerated: [collisionThreats[0] || {} as CollisionThreat]
        },
        {
          id: 'FUSION002',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          satelliteImageId: 'SAT002',
          lidarScanId: 'SCAN002',
          correlationScore: 87.3,
          threatsIdentified: 1,
          processingTime: 2134,
          aiModelVersion: 'CollisionAI-v3.2.1',
          confidenceLevel: 91.5,
          alertsGenerated: [collisionThreats[1] || {} as CollisionThreat]
        }
      ]
      setFusionAnalyses(mockAnalyses)
    }
  }, [collisionThreats, setCollisionThreats, lidarSensors, setLidarSensors, fusionAnalyses, setFusionAnalyses])

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'train-obstacle': return <AlertTriangle size={16} className="text-red-600" />
      case 'infrastructure-damage': return <Warning size={16} className="text-orange-600" />
      case 'vegetation-overgrowth': return <Activity size={16} className="text-green-600" />
      case 'landslide': return <Lightning size={16} className="text-amber-600" />
      case 'debris': return <XCircle size={16} className="text-gray-600" />
      case 'vehicle-intrusion': return <Target size={16} className="text-purple-600" />
      default: return <Scan size={16} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-red-500'
      case 'maintenance': return 'bg-yellow-500'
      case 'calibrating': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const formatTimeToCollision = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}min`
  }

  return (
    <div className="space-y-6">
      {/* Critical Threat Alert */}
      {collisionThreats.some(t => t.severity === 'critical') && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            KRITISCHE KOLLISIONSGEFAHR ERKANNT: Sofortige Intervention erforderlich - 
            {collisionThreats.filter(t => t.severity === 'critical').length} aktive Bedrohung(en)
          </AlertDescription>
        </Alert>
      )}

      {/* System Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-red-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.threatsDetected}</p>
                <p className="text-sm text-muted-foreground">Bedrohungen</p>
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
              <Timer size={20} className="text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.averageDetectionTime}s</p>
                <p className="text-sm text-muted-foreground">Ø Erkennung</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle size={20} className="text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.falsePositiveRate}%</p>
                <p className="text-sm text-muted-foreground">Fehlalarme</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Radar size={20} className="text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.activeSensors}</p>
                <p className="text-sm text-muted-foreground">LiDAR Sensoren</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database size={20} className="text-cyan-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.dataProcessedToday} GB</p>
                <p className="text-sm text-muted-foreground">Daten heute</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.collisionsAvoided}</p>
                <p className="text-sm text-muted-foreground">Kollisionen verhindert</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gauge size={20} className="text-indigo-600" />
              <div>
                <p className="text-2xl font-bold">{systemMetrics.systemUptime}%</p>
                <p className="text-sm text-muted-foreground">Verfügbarkeit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="collision-threats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collision-threats">Kollisionsbedrohungen</TabsTrigger>
          <TabsTrigger value="lidar-network">LiDAR-Netzwerk</TabsTrigger>
          <TabsTrigger value="fusion-analysis">Daten-Fusion</TabsTrigger>
          <TabsTrigger value="3d-monitoring">3D-Überwachung</TabsTrigger>
        </TabsList>

        <TabsContent value="collision-threats" className="space-y-6">
          {/* Active Collision Threats */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Aktive Kollisionsbedrohungen</CardTitle>
                  <CardDescription>KI-gestützte Echtzeit-Kollisionserkennung durch Satelliten-LiDAR-Fusion</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={collisionThreats.filter(t => t.severity === 'critical').length > 0 ? 'destructive' : 'default'}>
                    {collisionThreats.filter(t => t.status !== 'resolved').length} Aktive Bedrohungen
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye size={16} className="mr-2" />
                    Live-Ansicht
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collisionThreats.filter(t => t.status !== 'resolved').map(threat => (
                  <div key={threat.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getThreatIcon(threat.type)}
                        <div>
                          <h4 className="font-medium">{threat.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                          <p className="text-sm text-muted-foreground">{threat.location.section}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {threat.confidence}% Sicherheit
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Zeit bis Kollision:</p>
                        <p className="font-bold text-red-600">{formatTimeToCollision(threat.timeToCollision)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Strecken-Km:</p>
                        <p className="font-medium">{threat.location.trackKm}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Objektgröße:</p>
                        <p className="font-medium">{threat.objectDimensions.length}×{threat.objectDimensions.width}m</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Erkennungsquelle:</p>
                        <p className="font-medium capitalize">{threat.detectionSource}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Geschätzte Auswirkung:</p>
                      <p className="text-sm">{threat.estimatedImpact}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Empfohlene Maßnahmen:</p>
                      <div className="flex flex-wrap gap-2">
                        {threat.mitigationActions.map((action, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          threat.status === 'confirmed' ? 'bg-red-500' :
                          threat.status === 'detected' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-sm capitalize">{threat.status}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MapPin size={14} className="mr-1" />
                          Karte
                        </Button>
                        <Button size="sm" variant="outline">
                          <Target size={14} className="mr-1" />
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant={threat.severity === 'critical' ? 'destructive' : 'default'}
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

          {/* Collision Prevention Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Kollisionspräventions-Statistiken</CardTitle>
              <CardDescription>Systemleistung und verhinderte Unfälle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Erkennungsrate</span>
                    <span className="text-lg font-bold text-green-600">{systemMetrics.systemAccuracy}%</span>
                  </div>
                  <Progress value={systemMetrics.systemAccuracy} className="h-2" />
                  <p className="text-xs text-muted-foreground">Letzte 30 Tage</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Falsch-Positiv Rate</span>
                    <span className="text-lg font-bold text-orange-600">{systemMetrics.falsePositiveRate}%</span>
                  </div>
                  <Progress value={100 - systemMetrics.falsePositiveRate} className="h-2" />
                  <p className="text-xs text-muted-foreground">Zielwert: &lt;5%</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System-Verfügbarkeit</span>
                    <span className="text-lg font-bold text-blue-600">{systemMetrics.systemUptime}%</span>
                  </div>
                  <Progress value={systemMetrics.systemUptime} className="h-2" />
                  <p className="text-xs text-muted-foreground">99.5% SLA-Ziel</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lidar-network" className="space-y-6">
          {/* LiDAR Sensor Network */}
          <Card>
            <CardHeader>
              <CardTitle>LiDAR-Sensornetzwerk</CardTitle>
              <CardDescription>Hochpräzise 3D-Punktwolkendaten für Kollisionserkennung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lidarSensors.map(sensor => (
                  <div key={sensor.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Radar size={20} className="text-purple-600" />
                        <div>
                          <h4 className="font-medium">{sensor.name}</h4>
                          <p className="text-sm text-muted-foreground">{sensor.coverage.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(sensor.status)}`}></div>
                        <span className="text-sm font-medium capitalize">{sensor.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Reichweite:</p>
                        <p className="font-medium">{sensor.range}m</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Genauigkeit:</p>
                        <p className="font-medium">{sensor.accuracy}cm</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Scan-Rate:</p>
                        <p className="font-medium">{sensor.scanRate} Hz</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Punkte/Sek:</p>
                        <p className="font-medium">{sensor.pointsPerSecond.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Datenvolumen/Stunde:</span>
                        <span className="font-medium">{sensor.dataVolume} MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Letztes Update:</span>
                        <span className="font-medium">{new Date(sensor.lastUpdate).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Activity size={14} className="mr-2" />
                        Live-Daten
                      </Button>
                      <Button variant="outline" size="sm">
                        <Cpu size={14} className="mr-2" />
                        Kalibrierung
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Network Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Netzwerk-Performance</CardTitle>
              <CardDescription>Gesamtleistung des LiDAR-Sensornetzwerks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {lidarSensors.filter(s => s.status === 'online').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Online Sensoren</div>
                  <div className="text-xs text-muted-foreground">
                    von {lidarSensors.length} gesamt
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(lidarSensors.reduce((acc, s) => acc + s.dataVolume, 0))} MB
                  </div>
                  <div className="text-sm text-muted-foreground">Daten/Stunde</div>
                  <div className="text-xs text-muted-foreground">gesamt</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(lidarSensors.reduce((acc, s) => acc + s.pointsPerSecond, 0) / 1000)}K
                  </div>
                  <div className="text-sm text-muted-foreground">Punkte/Sek</div>
                  <div className="text-xs text-muted-foreground">kombiniert</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(lidarSensors.filter(s => s.status === 'online').length / lidarSensors.length * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Verfügbarkeit</div>
                  <div className="text-xs text-muted-foreground">aktuell</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fusion-analysis" className="space-y-6">
          {/* Data Fusion Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Satelliten-LiDAR Daten-Fusion</CardTitle>
              <CardDescription>KI-gestützte Korrelation von Satelliten- und LiDAR-Daten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fusionAnalyses.map(analysis => (
                  <div key={analysis.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Brain size={20} className="text-indigo-600" />
                        <div>
                          <h4 className="font-medium">Fusion-Analyse #{analysis.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(analysis.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          {analysis.correlationScore}% Korrelation
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {analysis.aiModelVersion}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Satellitenbild:</p>
                        <p className="font-medium">{analysis.satelliteImageId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">LiDAR-Scan:</p>
                        <p className="font-medium">{analysis.lidarScanId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Verarbeitungszeit:</p>
                        <p className="font-medium">{analysis.processingTime}ms</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bedrohungen:</p>
                        <p className="font-medium">{analysis.threatsIdentified}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Vertrauen in Analyse</span>
                        <span className="text-sm font-bold">{analysis.confidenceLevel}%</span>
                      </div>
                      <Progress value={analysis.confidenceLevel} className="h-2" />
                    </div>

                    {analysis.alertsGenerated.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Generierte Alarme:</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.alertsGenerated.map((alert, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {alert.type?.replace('-', ' ') || 'Unbekannt'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Cube size={14} className="mr-2" />
                        3D-Ansicht
                      </Button>
                      <Button variant="outline" size="sm">
                        <CloudArrowDown size={14} className="mr-2" />
                        Rohdaten
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fusion Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Fusion-Performance</CardTitle>
              <CardDescription>Leistungskennzahlen der Datenkorrelation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Durchschn. Korrelation</span>
                    <span className="text-lg font-bold text-indigo-600">91.7%</span>
                  </div>
                  <Progress value={91.7} className="h-2" />
                  <p className="text-xs text-muted-foreground">Zielwert: &gt;85%</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Verarbeitungszeit</span>
                    <span className="text-lg font-bold text-green-600">1.8s</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">Ziel: &lt;3s</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Modell-Konfidenz</span>
                    <span className="text-lg font-bold text-purple-600">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                  <p className="text-xs text-muted-foreground">Mindest: 90%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="3d-monitoring" className="space-y-6">
          {/* 3D Monitoring Interface */}
          <Card>
            <CardHeader>
              <CardTitle>3D-Echtzeit-Überwachung</CardTitle>
              <CardDescription>Räumliche Visualisierung von LiDAR-Punktwolken und Satellitendaten</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 3D Visualization Placeholder */}
              <div className="h-96 bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Simulated 3D interface */}
                <div className="absolute top-4 left-4 space-y-2">
                  <Badge variant="default" className="bg-black/60 backdrop-blur">
                    <Globe size={12} className="mr-1" />
                    3D-Ansicht aktiv
                  </Badge>
                  <Badge variant="outline" className="bg-black/60 backdrop-blur text-white border-white/30">
                    <Pulse size={12} className="mr-1" />
                    24 LiDAR-Sensoren
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 space-y-2">
                  <div className="bg-black/60 backdrop-blur rounded p-2 text-white text-xs space-y-1">
                    <div>Punktwolken: 2.4M Punkte/Sek</div>
                    <div>Auflösung: 2cm Genauigkeit</div>
                    <div>Update-Rate: 20 Hz</div>
                  </div>
                </div>

                {/* Simulated threat markers */}
                <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-red-500 rounded-full animate-pulse">
                  <div className="absolute -top-6 -left-8 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    KRITISCH
                  </div>
                </div>

                <div className="absolute bottom-1/2 right-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse">
                  <div className="absolute -top-6 -left-6 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    WARNUNG
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur rounded p-3 text-white">
                    <div className="flex items-center justify-between text-sm">
                      <span>Live 3D-Punktwolkenanalyse</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Aktive Überwachung</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <Button variant="outline" className="h-12">
                  <Eye size={16} className="mr-2" />
                  Ansicht wechseln
                </Button>
                <Button variant="outline" className="h-12">
                  <Target size={16} className="mr-2" />
                  Bedrohung fokussieren
                </Button>
                <Button variant="outline" className="h-12">
                  <Network size={16} className="mr-2" />
                  Sensornetz
                </Button>
                <Button variant="outline" className="h-12">
                  <Cube size={16} className="mr-2" />
                  Vollbild
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Point Cloud Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Punktwolken-Statistiken</CardTitle>
              <CardDescription>Datenqualität und Verarbeitungsmetriken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center space-y-2 p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">2.4M</div>
                  <div className="text-xs text-muted-foreground">Punkte/Sek</div>
                </div>
                <div className="text-center space-y-2 p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-green-600">2cm</div>
                  <div className="text-xs text-muted-foreground">Genauigkeit</div>
                </div>
                <div className="text-center space-y-2 p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">360°</div>
                  <div className="text-xs text-muted-foreground">Erfassung</div>
                </div>
                <div className="text-center space-y-2 p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">1.5km</div>
                  <div className="text-xs text-muted-foreground">Max. Reichweite</div>
                </div>
                <div className="text-center space-y-2 p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-red-600">20Hz</div>
                  <div className="text-xs text-muted-foreground">Update-Rate</div>
                </div>
                <div className="text-center space-y-2 p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-cyan-600">99.2%</div>
                  <div className="text-xs text-muted-foreground">Datenqualität</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}