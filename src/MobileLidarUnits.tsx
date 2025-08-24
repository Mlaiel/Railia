import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  MapPin, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Play,
  Pause,
  Settings,
  Radar,
  Train,
  Route,
  Battery,
  Wifi,
  Signal,
  Target,
  Eye,
  Clock,
  Navigation,
  Shield,
  Scan,
  ChartBar,
  Wrench,
  Car,
  CircuitBoard,
  Truck
} from '@phosphor-icons/react'

interface LidarUnit {
  id: string
  name: string
  type: 'handheld' | 'vehicle' | 'rail-cart' | 'backpack'
  status: 'active' | 'standby' | 'maintenance' | 'offline'
  location: {
    trackSection: string
    coordinates: { lat: number, lng: number }
    elevation: number
  }
  battery: number
  signal: number
  scanRadius: number
  accuracy: number
  currentTask: string
  dataPoints: number
  anomaliesDetected: number
  lastUpdate: string
}

interface ScanData {
  timestamp: string
  unitId: string
  trackSection: string
  objectsDetected: Array<{
    type: 'obstruction' | 'debris' | 'damage' | 'vegetation' | 'animal'
    position: { x: number, y: number, z: number }
    size: { width: number, height: number, depth: number }
    confidence: number
    severity: 'low' | 'medium' | 'high' | 'critical'
  }>
  trackCondition: {
    alignment: number
    surface: number
    clearance: number
  }
}

function MobileLidarUnits() {
  const [lidarUnits, setLidarUnits] = useKV<LidarUnit[]>('mobile-lidar-units', [
    {
      id: 'mlu-001',
      name: 'Mobile-LiDAR Alpha',
      type: 'vehicle',
      status: 'active',
      location: {
        trackSection: 'Abschnitt A-12',
        coordinates: { lat: 52.5200, lng: 13.4050 },
        elevation: 34
      },
      battery: 85,
      signal: 92,
      scanRadius: 50,
      accuracy: 98.5,
      currentTask: 'Routineinspektion Km 15-18',
      dataPoints: 125847,
      anomaliesDetected: 3,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'mlu-002',
      name: 'Handheld-Scanner Beta',
      type: 'handheld',
      status: 'standby',
      location: {
        trackSection: 'Abschnitt B-07',
        coordinates: { lat: 52.5100, lng: 13.3950 },
        elevation: 28
      },
      battery: 67,
      signal: 88,
      scanRadius: 25,
      accuracy: 96.2,
      currentTask: 'Bereitschaft',
      dataPoints: 89234,
      anomaliesDetected: 1,
      lastUpdate: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: 'mlu-003',
      name: 'Schienenfahrzeug Gamma',
      type: 'rail-cart',
      status: 'active',
      location: {
        trackSection: 'Abschnitt C-15',
        coordinates: { lat: 52.4950, lng: 13.4150 },
        elevation: 42
      },
      battery: 91,
      signal: 95,
      scanRadius: 75,
      accuracy: 99.1,
      currentTask: 'Notfall-Inspektion Weiche 47',
      dataPoints: 203465,
      anomaliesDetected: 7,
      lastUpdate: new Date(Date.now() - 120000).toISOString()
    },
    {
      id: 'mlu-004',
      name: 'Rucksack-LiDAR Delta',
      type: 'backpack',
      status: 'maintenance',
      location: {
        trackSection: 'Depot Hauptbahnhof',
        coordinates: { lat: 52.5250, lng: 13.3950 },
        elevation: 36
      },
      battery: 45,
      signal: 76,
      scanRadius: 30,
      accuracy: 94.8,
      currentTask: 'Wartung und Kalibrierung',
      dataPoints: 56789,
      anomaliesDetected: 0,
      lastUpdate: new Date(Date.now() - 1800000).toISOString()
    }
  ])

  const [scanData, setScanData] = useKV<ScanData[]>('lidar-scan-data', [])
  const [selectedUnit, setSelectedUnit] = useState<string>('')
  const [deploymentMode, setDeploymentMode] = useState<'manual' | 'auto'>('auto')
  const [realTimeMode, setRealTimeMode] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeMode) return

    const interval = setInterval(() => {
      setLidarUnits(currentUnits => 
        currentUnits.map(unit => {
          if (unit.status === 'active') {
            return {
              ...unit,
              dataPoints: unit.dataPoints + Math.floor(Math.random() * 50 + 10),
              battery: Math.max(unit.battery - 0.1, 0),
              anomaliesDetected: unit.anomaliesDetected + (Math.random() > 0.95 ? 1 : 0),
              lastUpdate: new Date().toISOString()
            }
          }
          return unit
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [realTimeMode, setLidarUnits])

  const getUnitTypeIcon = (type: LidarUnit['type']) => {
    switch (type) {
      case 'handheld': return <Scan size={20} />
      case 'vehicle': return <Car size={20} />
      case 'rail-cart': return <Train size={20} />
      case 'backpack': return <CircuitBoard size={20} />
      default: return <Radar size={20} />
    }
  }

  const getUnitTypeLabel = (type: LidarUnit['type']) => {
    switch (type) {
      case 'handheld': return 'Handscanner'
      case 'vehicle': return 'Fahrzeug-LiDAR'
      case 'rail-cart': return 'Schienenfahrzeug'
      case 'backpack': return 'Rucksack-System'
      default: return 'Unbekannt'
    }
  }

  const getStatusColor = (status: LidarUnit['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'standby': return 'bg-yellow-500'
      case 'maintenance': return 'bg-blue-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: LidarUnit['status']) => {
    switch (status) {
      case 'active': return 'Aktiv'
      case 'standby': return 'Bereitschaft'
      case 'maintenance': return 'Wartung'
      case 'offline': return 'Offline'
      default: return 'Unbekannt'
    }
  }

  const deployUnit = (unitId: string, trackSection: string) => {
    setLidarUnits(currentUnits =>
      currentUnits.map(unit =>
        unit.id === unitId
          ? {
              ...unit,
              status: 'active' as const,
              location: {
                ...unit.location,
                trackSection
              },
              currentTask: `Einsatz in ${trackSection}`,
              lastUpdate: new Date().toISOString()
            }
          : unit
      )
    )

    toast.success(`Einheit ${unitId} erfolgreich zu ${trackSection} entsandt`)
  }

  const recallUnit = (unitId: string) => {
    setLidarUnits(currentUnits =>
      currentUnits.map(unit =>
        unit.id === unitId
          ? {
              ...unit,
              status: 'standby' as const,
              currentTask: 'Rückkehr zur Basis',
              lastUpdate: new Date().toISOString()
            }
          : unit
      )
    )

    toast.info(`Einheit ${unitId} wird zurückgerufen`)
  }

  const startMaintenance = (unitId: string) => {
    setLidarUnits(currentUnits =>
      currentUnits.map(unit =>
        unit.id === unitId
          ? {
              ...unit,
              status: 'maintenance' as const,
              currentTask: 'Planmäßige Wartung',
              lastUpdate: new Date().toISOString()
            }
          : unit
      )
    )

    toast.info(`Wartung für Einheit ${unitId} gestartet`)
  }

  const activeUnits = lidarUnits.filter(unit => unit.status === 'active').length
  const totalDataPoints = lidarUnits.reduce((sum, unit) => sum + unit.dataPoints, 0)
  const totalAnomalies = lidarUnits.reduce((sum, unit) => sum + unit.anomaliesDetected, 0)
  const averageAccuracy = lidarUnits.reduce((sum, unit) => sum + unit.accuracy, 0) / lidarUnits.length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mobile LiDAR-Einheiten</h1>
          <p className="text-muted-foreground">Flexible Gleisüberwachung mit mobilen LiDAR-Systemen</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="realtime-mode" className="text-sm">Echtzeit</Label>
            <Switch
              id="realtime-mode"
              checked={realTimeMode}
              onCheckedChange={setRealTimeMode}
            />
          </div>
          <Select value={deploymentMode} onValueChange={(value: 'manual' | 'auto') => setDeploymentMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto-Einsatz</SelectItem>
              <SelectItem value="manual">Manuell</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{activeUnits}</p>
                <p className="text-sm text-muted-foreground">Aktive Einheiten</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ChartBar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalDataPoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Datenpunkte</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{totalAnomalies}</p>
                <p className="text-sm text-muted-foreground">Anomalien erkannt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{averageAccuracy.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Durchschn. Genauigkeit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fleet" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fleet">Flotten-Übersicht</TabsTrigger>
          <TabsTrigger value="deployment">Einsatz-Planung</TabsTrigger>
          <TabsTrigger value="monitoring">Live-Überwachung</TabsTrigger>
          <TabsTrigger value="analytics">Scan-Analysen</TabsTrigger>
        </TabsList>

        <TabsContent value="fleet" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lidarUnits.map((unit) => (
              <Card key={unit.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getUnitTypeIcon(unit.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{unit.name}</CardTitle>
                        <CardDescription>{getUnitTypeLabel(unit.type)}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(unit.status)}`}></div>
                      <Badge variant="outline">{getStatusLabel(unit.status)}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Battery size={14} />
                          Batterie
                        </span>
                        <span className="text-sm font-medium">{unit.battery}%</span>
                      </div>
                      <Progress value={unit.battery} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Signal size={14} />
                          Signal
                        </span>
                        <span className="text-sm font-medium">{unit.signal}%</span>
                      </div>
                      <Progress value={unit.signal} className="h-2" />
                    </div>
                  </div>

                  {/* Location & Task */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span className="text-sm">{unit.location.trackSection}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Route size={16} className="text-muted-foreground" />
                      <span className="text-sm">{unit.currentTask}</span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{unit.dataPoints.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Datenpunkte</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600">{unit.anomaliesDetected}</p>
                      <p className="text-xs text-muted-foreground">Anomalien</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{unit.accuracy}%</p>
                      <p className="text-xs text-muted-foreground">Genauigkeit</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {unit.status === 'standby' && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => deployUnit(unit.id, 'Abschnitt A-15')}
                      >
                        <Play size={14} className="mr-1" />
                        Einsetzen
                      </Button>
                    )}
                    {unit.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => recallUnit(unit.id)}
                      >
                        <Pause size={14} className="mr-1" />
                        Zurückrufen
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startMaintenance(unit.id)}
                    >
                      <Wrench size={14} className="mr-1" />
                      Wartung
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Einsatz-Planung</CardTitle>
              <CardDescription>Koordination mobiler LiDAR-Einheiten für flexible Gleisüberwachung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Einheit auswählen</Label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="LiDAR-Einheit wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {lidarUnits.filter(unit => unit.status === 'standby').map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} ({getUnitTypeLabel(unit.type)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label>Ziel-Gleisabschnitt</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Abschnitt wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a-12">Abschnitt A-12 (Hauptstrecke)</SelectItem>
                      <SelectItem value="b-07">Abschnitt B-07 (Nebenstrecke)</SelectItem>
                      <SelectItem value="c-15">Abschnitt C-15 (Bahnhof)</SelectItem>
                      <SelectItem value="d-03">Abschnitt D-03 (Weichenbereich)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Scan-Parameter</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scan-radius">Scan-Radius (m)</Label>
                    <Input id="scan-radius" type="number" defaultValue="50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resolution">Auflösung</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Auflösung..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Hoch (&lt; 1cm)</SelectItem>
                        <SelectItem value="medium">Mittel (1-5cm)</SelectItem>
                        <SelectItem value="low">Niedrig (5-10cm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scan-speed">Scan-Geschwindigkeit</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Geschwindigkeit..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast">Schnell (20 km/h)</SelectItem>
                        <SelectItem value="medium">Mittel (10 km/h)</SelectItem>
                        <SelectItem value="slow">Langsam (5 km/h)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Hochauflösende Scans bei niedrigerer Geschwindigkeit liefern präzisere Ergebnisse, 
                  benötigen aber mehr Zeit und Batteriekapazität.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button className="flex-1" disabled={!selectedUnit}>
                  <Navigation size={16} className="mr-2" />
                  Einsatz starten
                </Button>
                <Button variant="outline">
                  <Settings size={16} className="mr-2" />
                  Erweiterte Einstellungen
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {lidarUnits.filter(unit => unit.status === 'active').map((unit) => (
              <Card key={unit.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <CardDescription>Live-Überwachung • {unit.location.trackSection}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Aktuelle Position</span>
                      <span className="text-sm font-mono">
                        {unit.location.coordinates.lat.toFixed(4)}, {unit.location.coordinates.lng.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Höhe</span>
                      <span className="text-sm font-mono">{unit.location.elevation}m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Scan-Radius</span>
                      <span className="text-sm font-mono">{unit.scanRadius}m</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Datenerfassung</span>
                      <span className="text-sm font-bold text-primary">
                        +{Math.floor(Math.random() * 50 + 10)}/min
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{unit.accuracy}%</p>
                      <p className="text-xs text-green-700">Genauigkeit</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                      <p className="text-lg font-bold text-orange-600">{unit.anomaliesDetected}</p>
                      <p className="text-xs text-orange-700">Anomalien</p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Eye size={14} className="mr-2" />
                    Live-Stream anzeigen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {lidarUnits.filter(unit => unit.status === 'active').length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Radar size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Keine aktiven Einheiten</h3>
                <p className="text-muted-foreground mb-4">
                  Derzeit sind keine LiDAR-Einheiten im Einsatz. Starten Sie eine Einheit über die Einsatz-Planung.
                </p>
                <Button>
                  <Play size={16} className="mr-2" />
                  Einheit einsetzen
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan-Analysen und Erkenntnisse</CardTitle>
              <CardDescription>Zusammenfassung der LiDAR-Scan-Ergebnisse und erkannten Anomalien</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">12</p>
                        <p className="text-sm text-muted-foreground">Kritische Befunde</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle size={16} className="text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">28</p>
                        <p className="text-sm text-muted-foreground">Mittlere Befunde</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">95.2%</p>
                        <p className="text-sm text-muted-foreground">Strecken-Integrität</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Letzte Scan-Ergebnisse</h3>
                <div className="space-y-3">
                  {[
                    {
                      time: '14:25',
                      unit: 'Mobile-LiDAR Alpha',
                      section: 'Abschnitt A-12',
                      finding: 'Vegetation im Lichtraumprofil erkannt',
                      severity: 'medium'
                    },
                    {
                      time: '14:18',
                      unit: 'Schienenfahrzeug Gamma',
                      section: 'Abschnitt C-15',
                      finding: 'Schienenverschleiß über Grenzwert',
                      severity: 'high'
                    },
                    {
                      time: '14:12',
                      unit: 'Mobile-LiDAR Alpha',
                      section: 'Abschnitt A-11',
                      finding: 'Kleine Steinansammlung neben Gleis',
                      severity: 'low'
                    }
                  ].map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-muted-foreground" />
                          <span className="text-sm font-mono">{result.time}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{result.unit}</span>
                          <span className="text-muted-foreground"> • {result.section}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">{result.finding}</span>
                        <Badge 
                          variant={result.severity === 'high' ? 'destructive' : result.severity === 'medium' ? 'default' : 'secondary'}
                        >
                          {result.severity === 'high' ? 'Hoch' : result.severity === 'medium' ? 'Mittel' : 'Niedrig'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MobileLidarUnits