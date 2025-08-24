import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Drone,
  Network,
  MapPin,
  Clock,
  Activity,
  Warning,
  CheckCircle,
  Play,
  Pause,
  Stop,
  Path,
  ShareNetwork,
  Users,
  Crosshair,
  ArrowsOutCardinal,
  Broadcast,
  Timer,
  Calendar,
  Strategy,
  Target,
  Eye,
  Navigation,
  Signal,
  Lightning,
  Grid,
  Shuffle,
  Radar,
  CircleDot,
  Plus,
  Minus
} from '@phosphor-icons/react'

interface CoordinatedDrone {
  id: string
  name: string
  position: { lat: number; lng: number; altitude: number }
  status: 'bereit' | 'koordiniert' | 'inspiziert' | 'wartung' | 'offline'
  battery: number
  inspectionCapabilities: string[]
  communicationRange: number
  currentFormation?: string
  assignedSegment?: string
  syncStatus: 'synchronisiert' | 'verbindung' | 'getrennt'
  dataCollected: number
  lastSync: string
}

interface InspectionFormation {
  id: string
  name: string
  description: string
  droneCount: number
  coverage: 'linear' | 'grid' | 'circle' | 'adaptive'
  efficiency: number
  inspectionTypes: string[]
  coordinationComplexity: 'niedrig' | 'mittel' | 'hoch'
  recommendedFor: string[]
}

interface CoordinatedMission {
  id: string
  name: string
  formation: string
  assignedDrones: string[]
  targetArea: {
    name: string
    coordinates: Array<{ lat: number; lng: number }>
    priority: 'niedrig' | 'normal' | 'hoch' | 'kritisch'
    inspectionType: string[]
  }
  coordination: {
    masterDrone: string
    communicationProtocol: 'mesh' | 'star' | 'chain'
    syncInterval: number
    dataSharingMode: 'echtzeit' | 'batch' | 'adaptiv'
    redundancyLevel: number
  }
  progress: {
    segmentsTotal: number
    segmentsCompleted: number
    dataQuality: number
    coordinationStability: number
    averageSpeed: number
  }
  status: 'vorbereitung' | 'aktiv' | 'pausiert' | 'abgeschlossen'
  startTime?: string
  estimatedDuration: number
  criticalFindings: number
}

interface SynchronizationData {
  timestamp: string
  droneId: string
  position: { lat: number; lng: number; altitude: number }
  sensorData: {
    thermalReading: number
    visualAnalysis: number
    structuralIntegrity: number
    obstacleDetection: number
  }
  communicationStatus: {
    signalStrength: number
    latency: number
    dataPacketsLost: number
    neighbors: string[]
  }
  inspectionResults: Array<{
    id: string
    type: string
    severity: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
    confidence: number
    requiresFollowUp: boolean
  }>
}

function MultiDroneCoordination() {
  const [coordinatedDrones, setCoordinatedDrones] = useKV<CoordinatedDrone[]>('coordinated-drones', [
    {
      id: 'CD-ALPHA',
      name: 'Koordinator Alpha',
      position: { lat: 52.5200, lng: 13.4050, altitude: 150 },
      status: 'bereit',
      battery: 92,
      inspectionCapabilities: ['thermal', 'visual', 'structural'],
      communicationRange: 2000,
      syncStatus: 'synchronisiert',
      dataCollected: 0,
      lastSync: new Date().toISOString()
    },
    {
      id: 'CD-BETA',
      name: 'Scout Beta',
      position: { lat: 52.5210, lng: 13.4070, altitude: 140 },
      status: 'koordiniert',
      battery: 88,
      inspectionCapabilities: ['visual', 'obstacle', 'precision'],
      communicationRange: 1800,
      currentFormation: 'LINEAR-SYNC',
      assignedSegment: 'Segment-A1',
      syncStatus: 'synchronisiert',
      dataCollected: 247,
      lastSync: new Date(Date.now() - 30000).toISOString()
    },
    {
      id: 'CD-GAMMA',
      name: 'Precision Gamma',
      position: { lat: 52.5220, lng: 13.4090, altitude: 160 },
      status: 'inspiziert',
      battery: 84,
      inspectionCapabilities: ['thermal', 'precision', 'structural'],
      communicationRange: 2200,
      currentFormation: 'LINEAR-SYNC',
      assignedSegment: 'Segment-A2',
      syncStatus: 'synchronisiert',
      dataCollected: 189,
      lastSync: new Date(Date.now() - 45000).toISOString()
    },
    {
      id: 'CD-DELTA',
      name: 'Guardian Delta',
      position: { lat: 52.5190, lng: 13.4030, altitude: 130 },
      status: 'bereit',
      battery: 95,
      inspectionCapabilities: ['structural', 'emergency', 'communication'],
      communicationRange: 2500,
      syncStatus: 'synchronisiert',
      dataCollected: 0,
      lastSync: new Date().toISOString()
    },
    {
      id: 'CD-EPSILON',
      name: 'Relay Epsilon',
      position: { lat: 52.5240, lng: 13.4110, altitude: 180 },
      status: 'koordiniert',
      battery: 76,
      inspectionCapabilities: ['communication', 'relay', 'emergency'],
      communicationRange: 3000,
      currentFormation: 'GRID-SWEEP',
      syncStatus: 'verbindung',
      dataCollected: 98,
      lastSync: new Date(Date.now() - 120000).toISOString()
    }
  ])

  const [formations, setFormations] = useKV<InspectionFormation[]>('inspection-formations', [
    {
      id: 'LINEAR-SYNC',
      name: 'Lineare Synchronisation',
      description: 'Drohnen inspizieren parallel in Linie für maximale Geschwindigkeit',
      droneCount: 3,
      coverage: 'linear',
      efficiency: 92,
      inspectionTypes: ['schiene', 'oberleitung', 'signale'],
      coordinationComplexity: 'niedrig',
      recommendedFor: ['Routine-Inspektion', 'Große Streckenabschnitte']
    },
    {
      id: 'GRID-SWEEP',
      name: 'Gitter-Durchsuchung',
      description: 'Systematische Rasterabdeckung für vollständige Analyse',
      droneCount: 4,
      coverage: 'grid',
      efficiency: 89,
      inspectionTypes: ['weichen', 'bruecken', 'tunnel'],
      coordinationComplexity: 'mittel',
      recommendedFor: ['Präzisions-Analyse', 'Komplexe Infrastruktur']
    },
    {
      id: 'CIRCLE-FOCUS',
      name: 'Kreisfokus-Koordination',
      description: 'Konzentrische Kreise um kritische Punkte',
      droneCount: 5,
      coverage: 'circle',
      efficiency: 95,
      inspectionTypes: ['notfall', 'kritische-bereiche', 'defekt-analyse'],
      coordinationComplexity: 'hoch',
      recommendedFor: ['Notfall-Inspektion', 'Störungsbehebung']
    },
    {
      id: 'ADAPTIVE-SWARM',
      name: 'Adaptiver Schwarm',
      description: 'KI-gesteuerte Formationsanpassung basierend auf Befunden',
      droneCount: 6,
      coverage: 'adaptive',
      efficiency: 97,
      inspectionTypes: ['adaptiv', 'multi-spektral', 'predictive'],
      coordinationComplexity: 'hoch',
      recommendedFor: ['Unbekannte Situationen', 'Forschung']
    }
  ])

  const [activeMissions, setActiveMissions] = useKV<CoordinatedMission[]>('coordinated-missions', [
    {
      id: 'COORD-001',
      name: 'Synchrone Oberleitung-Inspektion',
      formation: 'LINEAR-SYNC',
      assignedDrones: ['CD-BETA', 'CD-GAMMA'],
      targetArea: {
        name: 'Oberleitung Sektor A',
        coordinates: [
          { lat: 52.5200, lng: 13.4050 },
          { lat: 52.5230, lng: 13.4100 }
        ],
        priority: 'hoch',
        inspectionType: ['oberleitung', 'isolation', 'aufhaengung']
      },
      coordination: {
        masterDrone: 'CD-BETA',
        communicationProtocol: 'mesh',
        syncInterval: 5000,
        dataSharingMode: 'echtzeit',
        redundancyLevel: 2
      },
      progress: {
        segmentsTotal: 12,
        segmentsCompleted: 8,
        dataQuality: 94,
        coordinationStability: 91,
        averageSpeed: 15.2
      },
      status: 'aktiv',
      startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      estimatedDuration: 90,
      criticalFindings: 2
    }
  ])

  const [synchronizationData, setSynchronizationData] = useKV<SynchronizationData[]>('sync-data', [])

  // Koordinations-Statistiken
  const [coordinationStats] = useKV('coordination-stats', {
    totalCoordinatedMissions: 247,
    averageEfficiency: 93.2,
    dataRedundancy: 95.8,
    communicationUptime: 98.7,
    swarmIntelligenceScore: 91.4,
    adaptiveFormationChanges: 156
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bereit': return 'bg-blue-500'
      case 'koordiniert': return 'bg-green-500'
      case 'inspiziert': return 'bg-yellow-500'
      case 'wartung': return 'bg-orange-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synchronisiert': return 'bg-green-500'
      case 'verbindung': return 'bg-yellow-500'
      case 'getrennt': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getFormationEfficiency = (formationId: string) => {
    const formation = formations.find(f => f.id === formationId)
    return formation?.efficiency || 0
  }

  const startCoordinatedMission = (formationId: string, droneIds: string[], targetArea: string) => {
    if (droneIds.length < 2) {
      toast.error('Mindestens 2 Drohnen für koordinierte Mission erforderlich')
      return
    }

    const formation = formations.find(f => f.id === formationId)
    if (!formation) {
      toast.error('Formation nicht gefunden')
      return
    }

    const newMission: CoordinatedMission = {
      id: `COORD-${Date.now()}`,
      name: `${formation.name} - ${targetArea}`,
      formation: formationId,
      assignedDrones: droneIds,
      targetArea: {
        name: targetArea,
        coordinates: [
          { lat: 52.5200, lng: 13.4050 },
          { lat: 52.5250, lng: 13.4150 }
        ],
        priority: 'normal',
        inspectionType: formation.inspectionTypes
      },
      coordination: {
        masterDrone: droneIds[0],
        communicationProtocol: 'mesh',
        syncInterval: 3000,
        dataSharingMode: 'echtzeit',
        redundancyLevel: Math.min(droneIds.length - 1, 3)
      },
      progress: {
        segmentsTotal: 15,
        segmentsCompleted: 0,
        dataQuality: 0,
        coordinationStability: 100,
        averageSpeed: 0
      },
      status: 'vorbereitung',
      estimatedDuration: 120,
      criticalFindings: 0
    }

    setActiveMissions(prev => [...prev, newMission])

    // Drohnen-Status aktualisieren
    setCoordinatedDrones(prev => prev.map(drone => 
      droneIds.includes(drone.id) 
        ? { 
            ...drone, 
            status: 'koordiniert' as const,
            currentFormation: formationId 
          }
        : drone
    ))

    toast.success(`Koordinierte Mission gestartet: ${formation.name}`)
  }

  const stopCoordinatedMission = (missionId: string) => {
    const mission = activeMissions.find(m => m.id === missionId)
    if (!mission) return

    // Mission Status aktualisieren
    setActiveMissions(prev => prev.map(m => 
      m.id === missionId 
        ? { ...m, status: 'abgeschlossen' as const }
        : m
    ))

    // Drohnen freigeben
    setCoordinatedDrones(prev => prev.map(drone => 
      mission.assignedDrones.includes(drone.id)
        ? { 
            ...drone, 
            status: 'bereit' as const,
            currentFormation: undefined,
            assignedSegment: undefined
          }
        : drone
    ))

    toast.info(`Mission beendet: ${mission.name}`)
  }

  const deployEmergencySwarm = () => {
    const availableDrones = coordinatedDrones.filter(d => 
      d.status === 'bereit' && d.battery > 60
    )

    if (availableDrones.length < 3) {
      toast.error('Nicht genügend Drohnen für Notfall-Schwarm verfügbar')
      return
    }

    const swarmMission: CoordinatedMission = {
      id: `EMERG-${Date.now()}`,
      name: 'NOTFALL-SCHWARM: Kritische Infrastruktur',
      formation: 'CIRCLE-FOCUS',
      assignedDrones: availableDrones.slice(0, 5).map(d => d.id),
      targetArea: {
        name: 'Notfall-Bereich Km 47.8',
        coordinates: [
          { lat: 52.5300, lng: 13.4200 },
          { lat: 52.5320, lng: 13.4250 }
        ],
        priority: 'kritisch',
        inspectionType: ['notfall', 'strukturell', 'sicherheit']
      },
      coordination: {
        masterDrone: availableDrones[0].id,
        communicationProtocol: 'star',
        syncInterval: 1000,
        dataSharingMode: 'echtzeit',
        redundancyLevel: 3
      },
      progress: {
        segmentsTotal: 8,
        segmentsCompleted: 0,
        dataQuality: 0,
        coordinationStability: 100,
        averageSpeed: 0
      },
      status: 'aktiv',
      startTime: new Date().toISOString(),
      estimatedDuration: 30,
      criticalFindings: 0
    }

    setActiveMissions(prev => [...prev, swarmMission])
    toast.success('NOTFALL-SCHWARM aktiviert!')
  }

  const optimizeFormation = (missionId: string) => {
    const mission = activeMissions.find(m => m.id === missionId)
    if (!mission) return

    // KI-basierte Formations-Optimierung simulieren
    setActiveMissions(prev => prev.map(m => 
      m.id === missionId 
        ? {
            ...m,
            progress: {
              ...m.progress,
              coordinationStability: Math.min(m.progress.coordinationStability + 5, 100),
              averageSpeed: m.progress.averageSpeed + 2.5
            }
          }
        : m
    ))

    toast.success('Formation KI-optimiert')
  }

  const adjustSyncInterval = (missionId: string, newInterval: number) => {
    setActiveMissions(prev => prev.map(m => 
      m.id === missionId 
        ? {
            ...m,
            coordination: {
              ...m.coordination,
              syncInterval: newInterval
            }
          }
        : m
    ))

    toast.info(`Sync-Interval angepasst: ${newInterval}ms`)
  }

  const activeDrones = coordinatedDrones.filter(d => d.status !== 'offline' && d.status !== 'wartung').length
  const coordinatedCount = coordinatedDrones.filter(d => d.status === 'koordiniert' || d.status === 'inspiziert').length
  const averageSync = coordinatedDrones.filter(d => d.syncStatus === 'synchronisiert').length / coordinatedDrones.length * 100

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Multi-Drohnen-Koordination</h1>
          <p className="text-muted-foreground">
            Synchronisierte Infrastruktur-Inspektionen mit KI-gesteuerter Schwarm-Intelligenz
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={deployEmergencySwarm} variant="destructive" size="sm">
            <Warning size={16} className="mr-2" />
            Notfall-Schwarm
          </Button>
          <Button 
            onClick={() => startCoordinatedMission('LINEAR-SYNC', ['CD-ALPHA', 'CD-DELTA'], 'Routine-Sektor')} 
            size="sm"
          >
            <Network size={16} className="mr-2" />
            Mission starten
          </Button>
        </div>
      </div>

      {/* Koordinations-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{coordinatedCount}/{activeDrones}</p>
                <p className="text-sm text-muted-foreground">Koordinierte Drohnen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Network size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageSync.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Synchronisation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Activity size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeMissions.filter(m => m.status === 'aktiv').length}</p>
                <p className="text-sm text-muted-foreground">Aktive Missionen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Strategy size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{coordinationStats.averageEfficiency}%</p>
                <p className="text-sm text-muted-foreground">Koordinations-Effizienz</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Lightning size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{coordinationStats.swarmIntelligenceScore}</p>
                <p className="text-sm text-muted-foreground">Schwarm-IQ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="coordination" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="coordination">Koordinations-Status</TabsTrigger>
          <TabsTrigger value="formations">Formationen</TabsTrigger>
          <TabsTrigger value="missions">Aktive Missionen</TabsTrigger>
          <TabsTrigger value="synchronization">Synchronisation</TabsTrigger>
          <TabsTrigger value="analytics">Schwarm-Analytik</TabsTrigger>
        </TabsList>

        <TabsContent value="coordination" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {coordinatedDrones.map((drone) => (
              <Card key={drone.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(drone.status)}`}></div>
                      <div>
                        <CardTitle className="text-lg">{drone.name}</CardTitle>
                        <CardDescription className="capitalize">{drone.status}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {drone.id}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getSyncStatusColor(drone.syncStatus)}`} title={drone.syncStatus}></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Batterie und Position */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Batterie</span>
                        <span className="font-mono">{drone.battery}%</span>
                      </div>
                      <Progress value={drone.battery} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Kommunikations-Range</span>
                        <span className="font-mono">{drone.communicationRange}m</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Signal size={14} />
                        <span>Daten: {drone.dataCollected} MB</span>
                      </div>
                    </div>
                  </div>

                  {/* Position und Sync Status */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>Position</span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {drone.position.lat.toFixed(4)}, {drone.position.lng.toFixed(4)}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        Höhe: {drone.position.altitude}m
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Network size={14} />
                        <span>Synchronisation</span>
                      </div>
                      <Badge variant={drone.syncStatus === 'synchronisiert' ? 'default' : 'secondary'} className="text-xs capitalize">
                        {drone.syncStatus}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Letzte Sync: {new Date(drone.lastSync).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Fähigkeiten */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Inspektions-Fähigkeiten</h4>
                    <div className="flex flex-wrap gap-1">
                      {drone.inspectionCapabilities.map((capability) => (
                        <Badge key={capability} variant="outline" className="text-xs capitalize">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Aktuelle Formation und Segment */}
                  {drone.currentFormation && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Koordinations-Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Formation:</span>
                          <p className="font-mono text-xs">{drone.currentFormation}</p>
                        </div>
                        {drone.assignedSegment && (
                          <div>
                            <span className="text-muted-foreground">Segment:</span>
                            <p className="font-mono text-xs">{drone.assignedSegment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Koordinations-Aktionen */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={drone.status === 'koordiniert'}
                      className="text-xs"
                    >
                      <ShareNetwork size={12} className="mr-1" />
                      Koordinieren
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={drone.syncStatus !== 'getrennt'}
                      className="text-xs"
                    >
                      <Radar size={12} className="mr-1" />
                      Sync
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={drone.status === 'offline'}
                      className="text-xs"
                    >
                      <Navigation size={12} className="mr-1" />
                      Position
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="formations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {formations.map((formation) => (
              <Card key={formation.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{formation.name}</CardTitle>
                      <CardDescription>{formation.description}</CardDescription>
                    </div>
                    <Badge variant={formation.coordinationComplexity === 'hoch' ? 'destructive' : formation.coordinationComplexity === 'mittel' ? 'default' : 'secondary'}>
                      {formation.coordinationComplexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Formation Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Drohnen erforderlich:</span>
                      <p className="font-bold">{formation.droneCount}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Effizienz:</span>
                      <p className="font-bold text-green-600">{formation.efficiency}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Abdeckungstyp:</span>
                      <p className="font-mono capitalize">{formation.coverage}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Komplexität:</span>
                      <p className="capitalize">{formation.coordinationComplexity}</p>
                    </div>
                  </div>

                  {/* Inspektionstypen */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Inspektionstypen</h4>
                    <div className="flex flex-wrap gap-1">
                      {formation.inspectionTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Empfohlene Anwendungen */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Empfohlen für</h4>
                    <div className="text-sm text-muted-foreground">
                      {formation.recommendedFor.join(' • ')}
                    </div>
                  </div>

                  {/* Formation Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        const availableDrones = coordinatedDrones
                          .filter(d => d.status === 'bereit' && d.battery > 60)
                          .slice(0, formation.droneCount)
                          .map(d => d.id)
                        
                        if (availableDrones.length >= formation.droneCount) {
                          startCoordinatedMission(formation.id, availableDrones, `${formation.name}-Mission`)
                        } else {
                          toast.error(`Nicht genügend Drohnen verfügbar (${availableDrones.length}/${formation.droneCount})`)
                        }
                      }}
                      disabled={coordinatedDrones.filter(d => d.status === 'bereit' && d.battery > 60).length < formation.droneCount}
                    >
                      <Play size={14} className="mr-1" />
                      Formation starten
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye size={14} className="mr-1" />
                      Vorschau
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="missions" className="space-y-4">
          {activeMissions.map((mission) => (
            <Card key={mission.id} className={mission.targetArea.priority === 'kritisch' ? 'border-destructive' : ''}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{mission.name}</CardTitle>
                    <CardDescription>
                      Formation: {mission.formation} • {mission.assignedDrones.length} Drohnen • {mission.targetArea.name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={mission.targetArea.priority === 'kritisch' ? 'destructive' : mission.targetArea.priority === 'hoch' ? 'default' : 'secondary'}>
                      {mission.targetArea.priority}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {mission.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mission Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fortschritt</span>
                    <span>{mission.progress.segmentsCompleted}/{mission.progress.segmentsTotal} Segmente</span>
                  </div>
                  <Progress 
                    value={(mission.progress.segmentsCompleted / mission.progress.segmentsTotal) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Koordinations-Metriken */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Datenqualität</p>
                    <p className="font-bold text-green-600">{mission.progress.dataQuality}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Koordinations-Stabilität</p>
                    <p className="font-bold">{mission.progress.coordinationStability}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Durchschnittsgeschwindigkeit</p>
                    <p className="font-bold">{mission.progress.averageSpeed} km/h</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kritische Befunde</p>
                    <p className="font-bold text-yellow-600">{mission.criticalFindings}</p>
                  </div>
                </div>

                {/* Koordinations-Details */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Koordinations-Konfiguration</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Master-Drohne:</span>
                      <p className="font-mono text-xs">{mission.coordination.masterDrone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Protokoll:</span>
                      <p className="uppercase text-xs">{mission.coordination.communicationProtocol}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sync-Interval:</span>
                      <p className="font-mono text-xs">{mission.coordination.syncInterval}ms</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Redundanz:</span>
                      <p className="text-xs">{mission.coordination.redundancyLevel}x</p>
                    </div>
                  </div>
                </div>

                {/* Zugewiesene Drohnen */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Zugewiesene Drohnen</h4>
                  <div className="flex flex-wrap gap-1">
                    {mission.assignedDrones.map((droneId) => {
                      const drone = coordinatedDrones.find(d => d.id === droneId)
                      return (
                        <Badge 
                          key={droneId} 
                          variant={drone?.syncStatus === 'synchronisiert' ? 'default' : 'secondary'}
                          className="text-xs font-mono"
                        >
                          {droneId}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                {/* Mission Controls */}
                <div className="flex gap-2 pt-2">
                  {mission.status === 'aktiv' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => optimizeFormation(mission.id)}
                      >
                        <Strategy size={14} className="mr-1" />
                        KI-Optimierung
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => adjustSyncInterval(mission.id, Math.max(mission.coordination.syncInterval - 1000, 1000))}
                      >
                        <Minus size={14} className="mr-1" />
                        Sync -
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => adjustSyncInterval(mission.id, Math.min(mission.coordination.syncInterval + 1000, 10000))}
                      >
                        <Plus size={14} className="mr-1" />
                        Sync +
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => stopCoordinatedMission(mission.id)}
                        className="ml-auto"
                      >
                        <Pause size={14} className="mr-1" />
                        Pausieren
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => stopCoordinatedMission(mission.id)}
                  >
                    <Stop size={14} className="mr-1" />
                    Mission beenden
                  </Button>
                </div>

                {mission.targetArea.priority === 'kritisch' && (
                  <Alert className="border-destructive bg-destructive/5">
                    <Warning className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-sm text-destructive">
                      <strong>KRITISCHE MISSION:</strong> Erhöhte Koordinations-Präzision und Redundanz aktiv.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}

          {activeMissions.length === 0 && (
            <div className="text-center py-12">
              <Network size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Keine aktiven koordinierten Missionen
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Starten Sie eine neue koordinierte Mission mit verfügbaren Drohnen
              </p>
              <Button 
                onClick={() => {
                  const availableDrones = coordinatedDrones
                    .filter(d => d.status === 'bereit' && d.battery > 60)
                    .slice(0, 3)
                    .map(d => d.id)
                  
                  if (availableDrones.length >= 2) {
                    startCoordinatedMission('LINEAR-SYNC', availableDrones, 'Schnell-Inspektion')
                  }
                }}
                disabled={coordinatedDrones.filter(d => d.status === 'bereit' && d.battery > 60).length < 2}
              >
                <Play size={16} className="mr-2" />
                Mission starten
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="synchronization" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sync-Status Übersicht */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Synchronisations-Matrix</CardTitle>
                <CardDescription>Echtzeit-Kommunikationsstatus zwischen allen Drohnen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coordinatedDrones.map((drone) => (
                    <div key={drone.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getSyncStatusColor(drone.syncStatus)}`}></div>
                        <div>
                          <p className="font-medium text-sm">{drone.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{drone.id}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-mono">{(Date.now() - new Date(drone.lastSync).getTime()) / 1000}s ago</p>
                        <p className="text-xs text-muted-foreground">Range: {drone.communicationRange}m</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Datenqualität */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daten-Synchronisation</CardTitle>
                <CardDescription>Qualität und Konsistenz der geteilten Inspektionsdaten</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      {coordinationStats.dataRedundancy}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Daten-Redundanz
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {coordinationStats.communicationUptime}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Kommunikations-Uptime
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Datenverteilung pro Drohne</h4>
                  {coordinatedDrones.map((drone) => (
                    <div key={drone.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{drone.name}</span>
                        <span className="font-mono">{drone.dataCollected} MB</span>
                      </div>
                      <Progress 
                        value={Math.min((drone.dataCollected / 500) * 100, 100)} 
                        className="h-1"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kommunikations-Protokoll Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Protokoll-Konfiguration</CardTitle>
              <CardDescription>Optimierung der Drohnen-zu-Drohnen Kommunikation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Mesh-Netzwerk</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Vollvermaschte Kommunikation</p>
                    <p>• Automatische Routen-Optimierung</p>
                    <p>• Hohe Redundanz und Ausfallsicherheit</p>
                  </div>
                  <Badge variant="default" className="text-xs">Empfohlen für große Schwärme</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Stern-Topologie</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Zentrale Master-Drohne Koordination</p>
                    <p>• Einfache Fehlerdiagnose</p>
                    <p>• Niedrige Latenz bei kleinen Gruppen</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Ideal für Notfall-Missionen</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Ketten-Kommunikation</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Sequenzielle Datenweiterleitung</p>
                    <p>• Energieeffizient für große Entfernungen</p>
                    <p>• Optimiert für lineare Inspektionen</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Für Langstrecken-Überwachung</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Koordinations-Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Abgeschlossene Missionen</span>
                  <span className="font-bold">{coordinationStats.totalCoordinatedMissions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Durchschnittliche Effizienz</span>
                  <span className="font-bold text-green-600">{coordinationStats.averageEfficiency}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Adaptive Formationsänderungen</span>
                  <span className="font-bold text-blue-600">{coordinationStats.adaptiveFormationChanges}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Schwarm-Intelligenz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Schwarm-IQ Score</span>
                    <span>{coordinationStats.swarmIntelligenceScore}</span>
                  </div>
                  <Progress 
                    value={coordinationStats.swarmIntelligenceScore} 
                    className="h-2"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kollektive Entscheidungen</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Automatische Optimierungen</span>
                  <span className="font-bold text-purple-600">89</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Kommunikations-Qualität</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Netzwerk-Uptime</span>
                    <span>{coordinationStats.communicationUptime}%</span>
                  </div>
                  <Progress 
                    value={coordinationStats.communicationUptime} 
                    className="h-2"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Daten-Redundanz</span>
                  <span className="font-bold text-green-600">{coordinationStats.dataRedundancy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sync-Erfolgsrate</span>
                  <span className="font-bold">99.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formations-Effizienz Vergleich */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formations-Effizienz Analyse</CardTitle>
              <CardDescription>Vergleich der Leistung verschiedener Koordinations-Formationen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formations.map((formation) => (
                  <div key={formation.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-sm">{formation.name}</h4>
                        <Badge variant="outline" className="text-xs capitalize">
                          {formation.coverage}
                        </Badge>
                      </div>
                      <span className="text-sm font-bold">{formation.efficiency}%</span>
                    </div>
                    <Progress value={formation.efficiency} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {formation.droneCount} Drohnen • {formation.coordinationComplexity} Komplexität
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

export default MultiDroneCoordination