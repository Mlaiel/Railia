import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Satellite, 
  Globe, 
  Network, 
  Signal, 
  Activity, 
  TrendUp, 
  Database, 
  Gauge, 
  Clock,
  Target,
  Brain,
  Lightning,
  Router,
  WaveSquare,
  Broadcast,
  PlanetRing,
  GraphicsCard,
  Radar
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SatelliteNode {
  id: string
  name: string
  orbit: 'LEO' | 'MEO' | 'GEO'
  altitude: number
  status: 'aktiv' | 'backup' | 'wartung' | 'offline'
  coverage: number
  latency: number
  bandwidth: number
  connectedStations: number
  dataLoad: number
  beamCount: number
  position: { latitude: number; longitude: number }
}

interface MeshConnection {
  id: string
  from: string
  to: string
  type: 'satellite-to-satellite' | 'satellite-to-ground' | 'ground-to-ground'
  status: 'aktiv' | 'backup' | 'störung' | 'offline'
  latency: number
  bandwidth: number
  reliability: number
  packetLoss: number
}

interface RedundancyMetrics {
  totalSatellites: number
  activePaths: number
  redundancyFactor: number
  networkResilience: number
  globalCoverage: number
  averageLatency: number
  dataReplication: number
}

export default function SatelliteMeshNetwork() {
  const [satellites, setSatellites] = useKV<SatelliteNode[]>('satellite-nodes', [
    {
      id: 'sat-leo-001',
      name: 'SmartRail LEO-1',
      orbit: 'LEO',
      altitude: 550,
      status: 'aktiv',
      coverage: 94.2,
      latency: 20,
      bandwidth: 50000,
      connectedStations: 12,
      dataLoad: 67.3,
      beamCount: 48,
      position: { latitude: 52.5, longitude: 13.4 }
    },
    {
      id: 'sat-leo-002',
      name: 'SmartRail LEO-2',
      orbit: 'LEO',
      altitude: 580,
      status: 'aktiv',
      coverage: 96.8,
      latency: 22,
      bandwidth: 55000,
      connectedStations: 15,
      dataLoad: 71.8,
      beamCount: 64,
      position: { latitude: 48.1, longitude: 11.6 }
    },
    {
      id: 'sat-meo-001',
      name: 'SmartRail MEO-1',
      orbit: 'MEO',
      altitude: 20200,
      status: 'backup',
      coverage: 98.5,
      latency: 150,
      bandwidth: 25000,
      connectedStations: 8,
      dataLoad: 34.2,
      beamCount: 32,
      position: { latitude: 50.1, longitude: 8.7 }
    },
    {
      id: 'sat-geo-001',
      name: 'SmartRail GEO-1',
      orbit: 'GEO',
      altitude: 35786,
      status: 'aktiv',
      coverage: 99.9,
      latency: 600,
      bandwidth: 15000,
      connectedStations: 25,
      dataLoad: 89.4,
      beamCount: 16,
      position: { latitude: 0, longitude: 10.0 }
    }
  ])

  const [meshConnections, setMeshConnections] = useKV<MeshConnection[]>('mesh-connections', [
    {
      id: 'conn-001',
      from: 'sat-leo-001',
      to: 'sat-leo-002',
      type: 'satellite-to-satellite',
      status: 'aktiv',
      latency: 5.2,
      bandwidth: 100000,
      reliability: 99.8,
      packetLoss: 0.01
    },
    {
      id: 'conn-002',
      from: 'sat-leo-001',
      to: 'ground-berlin',
      type: 'satellite-to-ground',
      status: 'aktiv',
      latency: 12.3,
      bandwidth: 75000,
      reliability: 99.5,
      packetLoss: 0.02
    },
    {
      id: 'conn-003',
      from: 'sat-meo-001',
      to: 'sat-geo-001',
      type: 'satellite-to-satellite',
      status: 'backup',
      latency: 8.7,
      bandwidth: 45000,
      reliability: 99.2,
      packetLoss: 0.05
    },
    {
      id: 'conn-004',
      from: 'ground-munich',
      to: 'ground-frankfurt',
      type: 'ground-to-ground',
      status: 'aktiv',
      latency: 3.1,
      bandwidth: 120000,
      reliability: 99.9,
      packetLoss: 0.001
    }
  ])

  const [redundancyMetrics, setRedundancyMetrics] = useKV<RedundancyMetrics>('mesh-redundancy-metrics', {
    totalSatellites: 4,
    activePaths: 12,
    redundancyFactor: 3.2,
    networkResilience: 97.8,
    globalCoverage: 96.1,
    averageLatency: 47.3,
    dataReplication: 99.7
  })

  const [selectedSatellite, setSelectedSatellite] = useState<string>('sat-leo-001')

  useEffect(() => {
    const interval = setInterval(() => {
      // Simuliere Echtzeit-Updates der Satelliten
      setSatellites(prev => prev.map(sat => ({
        ...sat,
        latency: Math.max(
          sat.orbit === 'LEO' ? 15 : sat.orbit === 'MEO' ? 120 : 550,
          sat.latency + (Math.random() - 0.5) * 10
        ),
        dataLoad: Math.max(0, Math.min(100, sat.dataLoad + (Math.random() - 0.5) * 5)),
        connectedStations: Math.max(0, sat.connectedStations + Math.floor((Math.random() - 0.5) * 2)),
        coverage: Math.max(90, Math.min(100, sat.coverage + (Math.random() - 0.5) * 2))
      })))

      // Update Mesh-Verbindungen
      setMeshConnections(prev => prev.map(conn => ({
        ...conn,
        latency: Math.max(1, conn.latency + (Math.random() - 0.5) * 2),
        reliability: Math.max(95, Math.min(100, conn.reliability + (Math.random() - 0.5) * 0.5)),
        packetLoss: Math.max(0, Math.min(1, conn.packetLoss + (Math.random() - 0.5) * 0.01))
      })))

      // Update Redundancy-Metriken
      setRedundancyMetrics(prev => ({
        ...prev,
        averageLatency: satellites.reduce((sum, sat) => sum + sat.latency, 0) / satellites.length,
        networkResilience: Math.max(95, Math.min(100, prev.networkResilience + (Math.random() - 0.5) * 1))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [satellites])

  const handleSatelliteHandover = (satelliteId: string) => {
    setSatellites(prev => prev.map(s => 
      s.id === satelliteId 
        ? { ...s, status: 'backup', dataLoad: s.dataLoad * 0.5 }
        : s.status === 'backup' && s.orbit === 'LEO'
        ? { ...s, status: 'aktiv', dataLoad: s.dataLoad * 1.5 }
        : s
    ))
    toast.success(`Satellite Handover für ${satelliteId} durchgeführt`)
  }

  const handleEmergencyResilience = () => {
    setSatellites(prev => prev.map(s => ({
      ...s,
      status: s.status === 'offline' ? 'backup' : s.status,
      redundancyFactor: 4.0,
      beamCount: s.beamCount * 1.2
    })))
    setRedundancyMetrics(prev => ({
      ...prev,
      redundancyFactor: 4.0,
      networkResilience: 99.5,
      dataReplication: 99.9
    }))
    toast.success('Notfall-Redundanz aktiviert - Maximale Ausfallsicherheit')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktiv': return 'bg-green-500'
      case 'backup': return 'bg-blue-500'
      case 'wartung': return 'bg-yellow-500'
      case 'offline': return 'bg-red-500'
      case 'störung': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getOrbitColor = (orbit: string) => {
    switch (orbit) {
      case 'LEO': return 'text-blue-600'
      case 'MEO': return 'text-green-600'
      case 'GEO': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'satellite-to-satellite': return 'text-purple-600'
      case 'satellite-to-ground': return 'text-blue-600'
      case 'ground-to-ground': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const currentSatellite = satellites.find(s => s.id === selectedSatellite)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Satellite size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Satellite-Mesh-Network</h1>
            <p className="text-muted-foreground">Redundante Kommunikation über Satelliten</p>
          </div>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktive Satelliten</p>
                <p className="text-2xl font-bold text-blue-600">{redundancyMetrics.totalSatellites}</p>
              </div>
              <Satellite size={24} className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Redundanz-Faktor</p>
                <p className="text-2xl font-bold text-green-600">{redundancyMetrics.redundancyFactor.toFixed(1)}x</p>
              </div>
              <Network size={24} className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ausfallsicherheit</p>
                <p className="text-2xl font-bold text-purple-600">{redundancyMetrics.networkResilience.toFixed(1)}%</p>
              </div>
              <Globe size={24} className="text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daten-Replikation</p>
                <p className="text-2xl font-bold text-orange-600">{redundancyMetrics.dataReplication.toFixed(1)}%</p>
              </div>
              <Database size={24} className="text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="satellites" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="satellites">Satelliten</TabsTrigger>
          <TabsTrigger value="mesh">Mesh-Verbindungen</TabsTrigger>
          <TabsTrigger value="redundancy">Redundanz</TabsTrigger>
          <TabsTrigger value="controls">Steuerung</TabsTrigger>
        </TabsList>

        <TabsContent value="satellites" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Satellite List */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold">Satelliten-Konstellation</h3>
              {satellites.map(satellite => (
                <Card 
                  key={satellite.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedSatellite === satellite.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedSatellite(satellite.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{satellite.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getOrbitColor(satellite.orbit)}>
                          {satellite.orbit}
                        </Badge>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(satellite.status)}`}></div>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Höhe: {satellite.altitude.toLocaleString()}km</div>
                      <div>Latenz: {satellite.latency.toFixed(0)}ms</div>
                      <div>Last: {satellite.dataLoad.toFixed(0)}%</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Satellite Details */}
            {currentSatellite && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlanetRing size={20} />
                      {currentSatellite.name} - Details
                    </CardTitle>
                    <CardDescription>
                      {currentSatellite.orbit}-Orbit • {currentSatellite.altitude.toLocaleString()}km Höhe
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status und Metriken */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Signal size={16} className="text-blue-500" />
                          <span className="text-sm font-medium">Abdeckung</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {currentSatellite.coverage.toFixed(1)}%
                        </div>
                        <Progress value={currentSatellite.coverage} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-green-500" />
                          <span className="text-sm font-medium">Latenz</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {currentSatellite.latency.toFixed(0)}ms
                        </div>
                        <Progress value={100 - (currentSatellite.latency / 10)} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendUp size={16} className="text-purple-500" />
                          <span className="text-sm font-medium">Bandbreite</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {(currentSatellite.bandwidth / 1000).toFixed(0)}Gbps
                        </div>
                        <Progress value={(currentSatellite.bandwidth / 100000) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-orange-500" />
                          <span className="text-sm font-medium">Auslastung</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                          {currentSatellite.dataLoad.toFixed(0)}%
                        </div>
                        <Progress value={currentSatellite.dataLoad} className="h-2" />
                      </div>
                    </div>

                    {/* Erweiterte Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Radar size={16} className="text-primary" />
                          <span className="font-medium">Beam-Management</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Aktive Beams:</span>
                            <span className="font-medium">{currentSatellite.beamCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Verbundene Stationen:</span>
                            <span className="font-medium">{currentSatellite.connectedStations}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Position:</span>
                            <span className="font-medium text-green-600">
                              {currentSatellite.position.latitude.toFixed(1)}°, {currentSatellite.position.longitude.toFixed(1)}°
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <GraphicsCard size={16} className="text-primary" />
                          <span className="font-medium">Orbit-Parameter</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Orbit-Typ:</span>
                            <Badge variant="outline" className={getOrbitColor(currentSatellite.orbit)}>
                              {currentSatellite.orbit}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Geschwindigkeit:</span>
                            <span className="font-medium">
                              {currentSatellite.orbit === 'LEO' ? '27.400' : 
                               currentSatellite.orbit === 'MEO' ? '14.000' : '11.000'}km/h
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Umlaufzeit:</span>
                            <span className="font-medium">
                              {currentSatellite.orbit === 'LEO' ? '90min' : 
                               currentSatellite.orbit === 'MEO' ? '12h' : '24h'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Steuerung */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleSatelliteHandover(currentSatellite.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Router size={16} className="mr-2" />
                        Handover
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1"
                      >
                        <Gauge size={16} className="mr-2" />
                        Diagnostik
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="mesh" className="space-y-6">
          <h3 className="text-lg font-semibold">Mesh-Netzwerk-Verbindungen</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meshConnections.map(connection => (
              <Card key={connection.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{connection.id}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(connection.status)}`}></div>
                  </div>
                  <CardDescription className="text-sm">
                    {connection.from} ↔ {connection.to}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      connection.type === 'satellite-to-satellite' ? 'bg-purple-500' :
                      connection.type === 'satellite-to-ground' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <span className={getConnectionTypeColor(connection.type)}>
                      {connection.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Zuverlässigkeit</span>
                        <span className="font-medium text-green-600">{connection.reliability.toFixed(1)}%</span>
                      </div>
                      <Progress value={connection.reliability} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Latenz</div>
                        <div className="font-medium">{connection.latency.toFixed(1)}ms</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Bandbreite</div>
                        <div className="font-medium">{(connection.bandwidth / 1000).toFixed(0)}Gbps</div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paketverlust:</span>
                        <span className={connection.packetLoss < 0.01 ? 'text-green-600' : 'text-orange-600'}>
                          {(connection.packetLoss * 100).toFixed(3)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="redundancy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Netzwerk-Redundanz & Ausfallsicherheit</CardTitle>
              <CardDescription>
                Überwachung der Ausfallsicherheit und Datenreplikation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Aktive Pfade</h4>
                  <div className="text-3xl font-bold text-blue-600">
                    {redundancyMetrics.activePaths}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mehrfach redundante Verbindungen
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Globale Abdeckung</h4>
                  <div className="text-3xl font-bold text-green-600">
                    {redundancyMetrics.globalCoverage.toFixed(1)}%
                  </div>
                  <Progress value={redundancyMetrics.globalCoverage} className="h-3" />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Durchschnittliche Latenz</h4>
                  <div className="text-3xl font-bold text-purple-600">
                    {redundancyMetrics.averageLatency.toFixed(0)}ms
                  </div>
                  <div className="text-sm text-green-600">
                    -23% vs. terrestrisch
                  </div>
                </div>
              </div>

              <Alert>
                <Network size={16} />
                <AlertDescription>
                  Das Satellite-Mesh-Network gewährleistet {redundancyMetrics.redundancyFactor.toFixed(1)}x Redundanz 
                  mit {redundancyMetrics.networkResilience.toFixed(1)}% Ausfallsicherheit. 
                  Datenreplikation erreicht {redundancyMetrics.dataReplication.toFixed(1)}% über alle Knoten.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Netzwerk-Steuerung</CardTitle>
                <CardDescription>
                  Zentrale Kontrolle der Satelliten-Konstellation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={handleEmergencyResilience}>
                  <Lightning size={16} className="mr-2" />
                  Notfall-Redundanz aktivieren
                </Button>
                <Button variant="outline" className="w-full">
                  <Router size={16} className="mr-2" />
                  Optimaler Routing-Pfad
                </Button>
                <Button variant="outline" className="w-full">
                  <WaveSquare size={16} className="mr-2" />
                  Alle Satelliten kalibrieren
                </Button>
                <Button variant="outline" className="w-full">
                  <Gauge size={16} className="mr-2" />
                  System-Diagnostik
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ausfallsicherheits-Modi</CardTitle>
                <CardDescription>
                  Automatische Anpassung bei Netzwerk-Störungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Standard-Betrieb', redundancy: '3.2x', description: 'Normale Kommunikation' },
                  { name: 'Hohe Verfügbarkeit', redundancy: '4.5x', description: 'Kritische Operationen' },
                  { name: 'Notfall-Modus', redundancy: '6.0x', description: 'Maximale Ausfallsicherheit' },
                  { name: 'Wartungs-Modus', redundancy: '2.1x', description: 'Satelliten-Wartung' }
                ].map((mode, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <div className="font-medium">{mode.name}</div>
                      <div className="text-sm text-muted-foreground">{mode.description}</div>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {mode.redundancy}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}