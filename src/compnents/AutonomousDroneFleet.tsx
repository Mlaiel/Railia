import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import {
  Drone,
  MapPin,
  Battery,
  Eye,
  Warning,
  CheckCircle,
  Clock,
  Wind,
  ThermometerSimple,
  Navigation,
  Activity,
  ChartLine,
  Wrench,
  Play,
  Pause,
  Square,
  Path,
  VideoCamera,
  RecordFill,
  Broadcast,
  Monitor,
  SpeakerHigh,
  MicrophoneFill,
  DownloadSimple,
  ShareNetwork,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Record,
  Stop
} from '@phosphor-icons/react'

interface DroneUnit {
  id: string
  name: string
  status: 'aktiv' | 'wartung' | 'offline' | 'mission'
  battery: number
  position: { lat: number; lng: number; altitude: number }
  currentMission?: string
  lastInspection: string
  sensors: {
    camera: boolean
    lidar: boolean
    thermal: boolean
    weather: boolean
  }
  performance: {
    flightHours: number
    inspectionsCompleted: number
    accuracy: number
    maintenanceScore: number
  }
}

interface FleetMission {
  id: string
  type: 'inspektion' | 'überwachung' | 'wartung' | 'notfall'
  priority: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
  assignedDrones: string[]
  status: 'geplant' | 'aktiv' | 'abgeschlossen' | 'pausiert'
  route: { lat: number; lng: number }[]
  progress: number
  estimatedCompletion: string
  findings: Array<{
    type: 'defekt' | 'anomalie' | 'wartung_erforderlich' | 'normal'
    description: string
    severity: 'niedrig' | 'mittel' | 'hoch'
    location: { lat: number; lng: number }
    timestamp: string
    media?: string[]
  }>
}

interface FleetStats {
  totalDrones: number
  activeDrones: number
  maintenanceDrones: number
  offlineDrones: number
  missionsToday: number
  inspectionsCompleted: number
  maintenanceScheduled: number
  averageAccuracy: number
  coverageToday: number
  fuelEfficiency: number
  criticalFindings: number
}

function AutonomousDroneFleet() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null)
  const [isFleetMode, setIsFleetMode] = useState(false)

  // Drohnen-Flotte State
  const [droneFleet, setDroneFleet] = useKV<DroneUnit[]>('autonomous-drone-fleet', [
    {
      id: 'D001',
      name: 'Inspektor Alpha',
      status: 'aktiv',
      battery: 87,
      position: { lat: 52.5200, lng: 13.4050, altitude: 120 },
      currentMission: 'M001',
      lastInspection: '2024-01-15 14:30',
      sensors: { camera: true, lidar: true, thermal: true, weather: false },
      performance: { flightHours: 247, inspectionsCompleted: 89, accuracy: 94.2, maintenanceScore: 8.5 }
    },
    {
      id: 'D002',
      name: 'Scanner Beta',
      status: 'mission',
      battery: 65,
      position: { lat: 52.5100, lng: 13.3900, altitude: 95 },
      currentMission: 'M002',
      lastInspection: '2024-01-15 12:15',
      sensors: { camera: true, lidar: false, thermal: true, weather: true },
      performance: { flightHours: 198, inspectionsCompleted: 67, accuracy: 91.8, maintenanceScore: 7.9 }
    },
    {
      id: 'D003',
      name: 'Wächter Gamma',
      status: 'wartung',
      battery: 23,
      position: { lat: 52.4950, lng: 13.4150, altitude: 0 },
      lastInspection: '2024-01-15 08:45',
      sensors: { camera: true, lidar: true, thermal: false, weather: true },
      performance: { flightHours: 312, inspectionsCompleted: 124, accuracy: 96.1, maintenanceScore: 6.2 }
    },
    {
      id: 'D004',
      name: 'Patrol Delta',
      status: 'aktiv',
      battery: 92,
      position: { lat: 52.5300, lng: 13.3800, altitude: 110 },
      currentMission: 'M003',
      lastInspection: '2024-01-15 16:20',
      sensors: { camera: true, lidar: true, thermal: true, weather: true },
      performance: { flightHours: 156, inspectionsCompleted: 52, accuracy: 89.4, maintenanceScore: 9.1 }
    },
    {
      id: 'D005',
      name: 'Monitor Epsilon',
      status: 'offline',
      battery: 0,
      position: { lat: 52.5050, lng: 13.4200, altitude: 0 },
      lastInspection: '2024-01-14 19:30',
      sensors: { camera: false, lidar: false, thermal: false, weather: false },
      performance: { flightHours: 78, inspectionsCompleted: 28, accuracy: 87.3, maintenanceScore: 4.5 }
    }
  ])

  // Aktive Missionen State
  const [activeMissions, setActiveMissions] = useKV<FleetMission[]>('fleet-missions', [
    {
      id: 'M001',
      type: 'inspektion',
      priority: 'hoch',
      assignedDrones: ['D001'],
      status: 'aktiv',
      route: [
        { lat: 52.5200, lng: 13.4050 },
        { lat: 52.5250, lng: 13.4100 },
        { lat: 52.5300, lng: 13.4150 }
      ],
      progress: 67,
      estimatedCompletion: '15:45',
      findings: [
        {
          type: 'anomalie',
          description: 'Ungewöhnliche Vibration an Gleis-Kilometer 47.2',
          severity: 'mittel',
          location: { lat: 52.5225, lng: 13.4075 },
          timestamp: '14:32',
          media: ['thermal_scan_001.jpg', 'vibration_data_001.csv']
        }
      ]
    },
    {
      id: 'M002',
      type: 'überwachung',
      priority: 'mittel',
      assignedDrones: ['D002'],
      status: 'aktiv',
      route: [
        { lat: 52.5100, lng: 13.3900 },
        { lat: 52.5150, lng: 13.3950 }
      ],
      progress: 23,
      estimatedCompletion: '16:20',
      findings: []
    },
    {
      id: 'M003',
      type: 'wartung',
      priority: 'niedrig',
      assignedDrones: ['D004'],
      status: 'geplant',
      route: [
        { lat: 52.5300, lng: 13.3800 },
        { lat: 52.5350, lng: 13.3850 }
      ],
      progress: 0,
      estimatedCompletion: '17:00',
      findings: []
    }
  ])

  // Flotten-Statistiken
  const [fleetStats, setFleetStats] = useKV<FleetStats>('fleet-stats', {
    totalDrones: 5,
    activeDrones: 2,
    maintenanceDrones: 1,
    offlineDrones: 1,
    missionsToday: 12,
    inspectionsCompleted: 8,
    maintenanceScheduled: 3,
    averageAccuracy: 91.8,
    coverageToday: 78.4,
    fuelEfficiency: 94.2,
    criticalFindings: 2
  })

  // Automatische Updates der Flotten-Statistiken
  useEffect(() => {
    const updateFleetStats = () => {
      const activeDrones = droneFleet.filter(d => d.status === 'aktiv' || d.status === 'mission').length
      const maintenanceDrones = droneFleet.filter(d => d.status === 'wartung').length
      const offlineDrones = droneFleet.filter(d => d.status === 'offline').length
      const averageAccuracy = droneFleet.reduce((sum, d) => sum + d.performance.accuracy, 0) / droneFleet.length

      setFleetStats(prev => ({
        ...prev,
        totalDrones: droneFleet.length,
        activeDrones,
        maintenanceDrones,
        offlineDrones,
        averageAccuracy: parseFloat(averageAccuracy.toFixed(1))
      }))
    }

    updateFleetStats()
  }, [droneFleet, setFleetStats])

  const startMission = (droneId: string, missionType: string) => {
    setDroneFleet(prev => prev.map(drone => 
      drone.id === droneId 
        ? { ...drone, status: 'mission' as const, currentMission: `M${Date.now()}` }
        : drone
    ))
    
    toast.success(`Mission für ${droneFleet.find(d => d.id === droneId)?.name} gestartet`)
  }

  const recallDrone = (droneId: string) => {
    setDroneFleet(prev => prev.map(drone => 
      drone.id === droneId 
        ? { ...drone, status: 'aktiv' as const, currentMission: undefined }
        : drone
    ))
    
    toast.info(`${droneFleet.find(d => d.id === droneId)?.name} zurückgerufen`)
  }

  const emergencyLanding = (droneId: string) => {
    setDroneFleet(prev => prev.map(drone => 
      drone.id === droneId 
        ? { ...drone, status: 'offline' as const, currentMission: undefined }
        : drone
    ))
    
    toast.error(`Notlandung für ${droneFleet.find(d => d.id === droneId)?.name} eingeleitet`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktiv': return 'bg-green-500'
      case 'mission': return 'bg-blue-500'
      case 'wartung': return 'bg-yellow-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'kritisch': return 'bg-red-500'
      case 'hoch': return 'bg-orange-500'
      case 'mittel': return 'bg-yellow-500'
      case 'niedrig': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const averageBattery = Math.round(
    droneFleet.reduce((sum, drone) => sum + drone.battery, 0) / droneFleet.length
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Drone size={20} className="text-primary" />
            </div>
            Autonome Drohnen-Flotte
          </h1>
          <p className="text-muted-foreground mt-1">
            KI-gesteuerte Infrastruktur-Inspektion und Echtzeit-Überwachung
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={isFleetMode ? "default" : "outline"}
            onClick={() => setIsFleetMode(!isFleetMode)}
            className="flex items-center gap-2"
          >
            <Navigation size={16} />
            {isFleetMode ? 'Flotten-Modus' : 'Einzelsteuerung'}
          </Button>
        </div>
      </div>

      {/* Kritische Alerts */}
      {fleetStats.criticalFindings > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <Warning className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{fleetStats.criticalFindings} kritische Befunde</strong> erfordern sofortige Aufmerksamkeit. 
            Prüfen Sie die Missionsberichte im Detail.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Übersicht</TabsTrigger>
          <TabsTrigger value="fleet">Flotte</TabsTrigger>
          <TabsTrigger value="missions">Missionen</TabsTrigger>
          <TabsTrigger value="analytics">Analytik</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Flotten-Status Übersicht */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Aktive Drohnen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{fleetStats.activeDrones}</div>
                <p className="text-xs text-muted-foreground">von {fleetStats.totalDrones} verfügbar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Heutige Missionen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{fleetStats.missionsToday}</div>
                <p className="text-xs text-muted-foreground">{fleetStats.inspectionsCompleted} abgeschlossen</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Durchschnittsbatterie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{averageBattery}%</div>
                <p className="text-xs text-muted-foreground">Flottendurchschnitt</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Systemgenauigkeit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{fleetStats.averageAccuracy}%</div>
                <p className="text-xs text-muted-foreground">KI-Erkennungsrate</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Drohnen Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={20} />
                Live Drohnen-Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {droneFleet.map((drone) => (
                  <div key={drone.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(drone.status)}`}></div>
                        {drone.status === 'aktiv' && (
                          <div className={`absolute inset-0 w-3 h-3 rounded-full ${getStatusColor(drone.status)} animate-ping`}></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{drone.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {drone.status.charAt(0).toUpperCase() + drone.status.slice(1)} • 
                          Höhe: {drone.position.altitude}m
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Battery size={16} />
                          <span className="font-medium">{drone.battery}%</span>
                        </div>
                        {drone.currentMission && (
                          <p className="text-xs text-muted-foreground">Mission: {drone.currentMission}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {drone.status === 'aktiv' && (
                          <Button size="sm" variant="outline" onClick={() => startMission(drone.id, 'inspektion')}>
                            <Play size={14} />
                          </Button>
                        )}
                        {drone.status === 'mission' && (
                          <Button size="sm" variant="outline" onClick={() => recallDrone(drone.id)}>
                            <Square size={14} />
                          </Button>
                        )}
                        {(drone.status === 'aktiv' || drone.status === 'mission') && (
                          <Button size="sm" variant="destructive" onClick={() => emergencyLanding(drone.id)}>
                            <Warning size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-6">
          {/* Detaillierte Drohnen-Verwaltung */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {droneFleet.map((drone) => (
              <Card key={drone.id} className={`${selectedDrone === drone.id ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Drone size={20} />
                      {drone.name}
                    </CardTitle>
                    <Badge className={`${getStatusColor(drone.status)} text-white`}>
                      {drone.status.charAt(0).toUpperCase() + drone.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>ID: {drone.id} • Letzter Check: {drone.lastInspection}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Batterie und Position */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Battery size={16} />
                        <span className="text-sm font-medium">Batterie</span>
                      </div>
                      <Progress value={drone.battery} className="h-2" />
                      <p className="text-xs text-muted-foreground">{drone.battery}%</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="text-sm font-medium">Position</span>
                      </div>
                      <p className="text-xs">
                        {drone.position.lat.toFixed(4)}, {drone.position.lng.toFixed(4)}
                      </p>
                      <p className="text-xs text-muted-foreground">Höhe: {drone.position.altitude}m</p>
                    </div>
                  </div>

                  {/* Sensoren Status */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Sensoren</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(drone.sensors).map(([sensor, active]) => (
                        <div key={sensor} className="flex items-center gap-2 p-2 border rounded">
                          {active ? (
                            <CheckCircle size={14} className="text-green-500" />
                          ) : (
                            <Warning size={14} className="text-red-500" />
                          )}
                          <span className="text-xs capitalize">{sensor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Metriken */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Performance</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Flugstunden: <span className="font-medium">{drone.performance.flightHours}</span></div>
                      <div>Inspektionen: <span className="font-medium">{drone.performance.inspectionsCompleted}</span></div>
                      <div>Genauigkeit: <span className="font-medium">{drone.performance.accuracy}%</span></div>
                      <div>Wartungsscore: <span className="font-medium">{drone.performance.maintenanceScore}/10</span></div>
                    </div>
                  </div>

                  {/* Steuerungsbuttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedDrone(drone.id === selectedDrone ? null : drone.id)}
                    >
                      <Eye size={14} className="mr-1" />
                      Details
                    </Button>
                    {drone.status === 'aktiv' && (
                      <Button size="sm" onClick={() => startMission(drone.id, 'inspektion')}>
                        <Play size={14} className="mr-1" />
                        Mission
                      </Button>
                    )}
                    {drone.status === 'mission' && (
                      <Button size="sm" variant="outline" onClick={() => recallDrone(drone.id)}>
                        <Pause size={14} className="mr-1" />
                        Stopp
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="missions" className="space-y-6">
          {/* Aktive Missionen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Path size={20} />
                Aktive Missionen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeMissions.map((mission) => (
                  <div key={mission.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={`${getPriorityColor(mission.priority)} text-white`}>
                          {mission.priority.charAt(0).toUpperCase() + mission.priority.slice(1)}
                        </Badge>
                        <div>
                          <h4 className="font-medium">Mission {mission.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {mission.type.charAt(0).toUpperCase() + mission.type.slice(1)} • 
                            {mission.assignedDrones.length} Drohne(n)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{mission.progress}%</p>
                        <p className="text-sm text-muted-foreground">ETA: {mission.estimatedCompletion}</p>
                      </div>
                    </div>

                    <Progress value={mission.progress} className="h-2" />

                    {/* Befunde */}
                    {mission.findings.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Befunde</h5>
                        {mission.findings.map((finding, index) => (
                          <div key={index} className="p-3 bg-secondary/20 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className={
                                finding.severity === 'hoch' ? 'border-red-200 text-red-700' :
                                finding.severity === 'mittel' ? 'border-yellow-200 text-yellow-700' :
                                'border-green-200 text-green-700'
                              }>
                                {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{finding.timestamp}</span>
                            </div>
                            <p className="text-sm">{finding.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Position: {finding.location.lat.toFixed(4)}, {finding.location.lng.toFixed(4)}
                            </p>
                            {finding.media && finding.media.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {finding.media.map((media, mediaIndex) => (
                                  <Badge key={mediaIndex} variant="outline" className="text-xs">
                                    {media}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytik und Berichte */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Flotten-Effizienz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Missionserfolgsrate</span>
                  <span className="font-bold text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Durchschnittliche Flugzeit</span>
                  <span className="font-bold">2.4h</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Kraftstoffeffizienz</span>
                    <span>{fleetStats.fuelEfficiency}%</span>
                  </div>
                  <Progress value={fleetStats.fuelEfficiency} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Wartungseffizienz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Geplante Wartungen</span>
                  <span className="font-bold">{fleetStats.maintenanceScheduled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Durchschnittliche Genauigkeit</span>
                  <span className="font-bold text-green-600">{fleetStats.averageAccuracy}%</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Tagesabdeckung</span>
                    <span>{fleetStats.coverageToday}%</span>
                  </div>
                  <Progress value={fleetStats.coverageToday} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Systemperformance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Drohnen online</span>
                    <Badge variant="outline">
                      {droneFleet.filter(d => d.status !== 'offline').length}/{droneFleet.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Durchschnittsbatterie</span>
                    <Badge variant="outline">{averageBattery}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aktive Missionen</span>
                    <Badge variant="outline">{activeMissions.filter(m => m.status === 'aktiv').length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AutonomousDroneFleet;