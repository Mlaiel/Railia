/**
 * @fileoverview Space-Based-Monitoring: Überwachung aus dem Weltraum
 * @author SmartRail-AI System
 * @version 2.0.0
 * 
 * Satellitengestützte Überwachungssysteme mit Hochauflösungs-Imaging,
 * Radar und KI-basierter Analyse für globale Bahninfrastruktur-Überwachung
 */

import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Satellite, 
  Globe, 
  Eye, 
  Target, 
  Activity,
  Radar,
  Camera,
  MapPin,
  Clock,
  Lightning,
  Database,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Settings,
  TrendUp,
  Graph,
  Radio,
  Telescope
} from '@phosphor-icons/react'

interface SpaceSatellite {
  id: string
  name: string
  type: 'imaging' | 'radar' | 'communication' | 'weather' | 'surveillance'
  orbit: {
    altitude: number // km
    inclination: number // Grad
    period: number // Minuten
  }
  position: {
    latitude: number
    longitude: number
    altitude: number
  }
  status: 'active' | 'standby' | 'maintenance' | 'lost_signal' | 'critical'
  resolution: number // Meter pro Pixel
  coverageArea: number // km²
  powerLevel: number // Prozent
  dataTransmissionRate: number // Mbps
  lastUpdate: string
  sensors: Array<{
    type: string
    status: 'online' | 'offline' | 'degraded'
    accuracy: number
  }>
}

interface MonitoringMission {
  id: string
  title: string
  type: 'infrastructure_scan' | 'weather_monitoring' | 'emergency_response' | 'traffic_analysis' | 'security_patrol'
  priority: 'routine' | 'high' | 'urgent' | 'critical'
  targetArea: {
    name: string
    coordinates: { lat: number; lng: number }
    radius: number // km
  }
  assignedSatellites: string[]
  status: 'planning' | 'active' | 'completed' | 'paused' | 'failed'
  startTime: string
  estimatedDuration: number // Minuten
  dataCollected: number // GB
  findings: Array<{
    type: 'anomaly' | 'damage' | 'obstruction' | 'weather_event' | 'normal'
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    coordinates: { lat: number; lng: number }
    timestamp: string
  }>
}

const SpaceBasedMonitoringSystem: React.FC = () => {
  const [satellites, setSatellites] = useKV<SpaceSatellite[]>('space-satellites', [])
  const [missions, setMissions] = useKV<MonitoringMission[]>('space-missions', [])
  const [systemMetrics, setSystemMetrics] = useKV('space-metrics', {
    totalCoverage: 0, // km²
    activeScans: 0,
    dataCollected: 0, // TB
    anomaliesDetected: 0,
    orbitalHealth: 98.5
  })

  const [realTimeData, setRealTimeData] = useState({
    activeSatellites: 0,
    globalCoverage: 0,
    currentScans: 0,
    dataDownlink: 0,
    alertsGenerated: 0,
    systemEfficiency: 0
  })

  // Simulation der Weltraum-Überwachungssatelliten
  useEffect(() => {
    if (satellites.length === 0) {
      const mockSatellites: SpaceSatellite[] = [
        {
          id: 'sat-railwatch-01',
          name: 'RailWatch-1 (Hochauflösung)',
          type: 'imaging',
          orbit: {
            altitude: 650,
            inclination: 98.2,
            period: 97.8
          },
          position: {
            latitude: 52.5200,
            longitude: 13.4050,
            altitude: 650
          },
          status: 'active',
          resolution: 0.3, // 30cm pro Pixel
          coverageArea: 2500,
          powerLevel: 89,
          dataTransmissionRate: 1200,
          lastUpdate: new Date().toISOString(),
          sensors: [
            { type: 'Optical Imaging', status: 'online', accuracy: 98.7 },
            { type: 'Multispectral', status: 'online', accuracy: 96.4 },
            { type: 'Thermal IR', status: 'online', accuracy: 94.2 }
          ]
        },
        {
          id: 'sat-radarnet-02',
          name: 'RadarNet-2 (SAR)',
          type: 'radar',
          orbit: {
            altitude: 693,
            inclination: 98.1,
            period: 98.9
          },
          position: {
            latitude: 48.1351,
            longitude: 11.5820,
            altitude: 693
          },
          status: 'active',
          resolution: 1.0, // 1m Radarauflösung
          coverageArea: 5000,
          powerLevel: 92,
          dataTransmissionRate: 800,
          lastUpdate: new Date().toISOString(),
          sensors: [
            { type: 'SAR X-Band', status: 'online', accuracy: 99.1 },
            { type: 'SAR C-Band', status: 'online', accuracy: 97.8 },
            { type: 'Interferometry', status: 'online', accuracy: 95.6 }
          ]
        },
        {
          id: 'sat-skyguard-03',
          name: 'SkyGuard-3 (Überwachung)',
          type: 'surveillance',
          orbit: {
            altitude: 580,
            inclination: 97.4,
            period: 96.1
          },
          position: {
            latitude: 50.1109,
            longitude: 8.6821,
            altitude: 580
          },
          status: 'active',
          resolution: 0.5,
          coverageArea: 3200,
          powerLevel: 87,
          dataTransmissionRate: 950,
          lastUpdate: new Date().toISOString(),
          sensors: [
            { type: 'Pan-chromatic', status: 'online', accuracy: 97.3 },
            { type: 'Change Detection', status: 'online', accuracy: 95.9 },
            { type: 'Motion Analysis', status: 'online', accuracy: 93.7 }
          ]
        },
        {
          id: 'sat-weathereye-04',
          name: 'WeatherEye-4 (Meteorologie)',
          type: 'weather',
          orbit: {
            altitude: 35786,
            inclination: 0.0,
            period: 1436
          },
          position: {
            latitude: 0.0,
            longitude: 9.0,
            altitude: 35786
          },
          status: 'active',
          resolution: 1000, // 1km für Wetter
          coverageArea: 150000000,
          powerLevel: 94,
          dataTransmissionRate: 400,
          lastUpdate: new Date().toISOString(),
          sensors: [
            { type: 'Weather Radar', status: 'online', accuracy: 98.9 },
            { type: 'Atmospheric Sounder', status: 'online', accuracy: 97.1 },
            { type: 'Lightning Detector', status: 'online', accuracy: 96.8 }
          ]
        },
        {
          id: 'sat-comlink-05',
          name: 'ComLink-5 (Kommunikation)',
          type: 'communication',
          orbit: {
            altitude: 1200,
            inclination: 88.5,
            period: 108.2
          },
          position: {
            latitude: 53.5511,
            longitude: 9.9937,
            altitude: 1200
          },
          status: 'maintenance',
          resolution: 50, // Für Kommunikation irrelevant
          coverageArea: 8000,
          powerLevel: 67,
          dataTransmissionRate: 2500,
          lastUpdate: new Date(Date.now() - 3600000).toISOString(),
          sensors: [
            { type: 'Ka-Band Transponder', status: 'degraded', accuracy: 89.2 },
            { type: 'X-Band Backup', status: 'online', accuracy: 94.5 },
            { type: 'Quantum Receiver', status: 'offline', accuracy: 0 }
          ]
        }
      ]
      setSatellites(mockSatellites)

      const mockMissions: MonitoringMission[] = [
        {
          id: 'mission-infrastructure-001',
          title: 'Deutsche Bahn Vollnetz-Inspektion',
          type: 'infrastructure_scan',
          priority: 'routine',
          targetArea: {
            name: 'Deutschland Gesamt',
            coordinates: { lat: 51.1657, lng: 10.4515 },
            radius: 500
          },
          assignedSatellites: ['sat-railwatch-01', 'sat-radarnet-02'],
          status: 'active',
          startTime: new Date(Date.now() - 7200000).toISOString(),
          estimatedDuration: 720,
          dataCollected: 847.3,
          findings: [
            {
              type: 'anomaly',
              severity: 'medium',
              description: 'Ungewöhnliche Gleisverformung bei km 234.7',
              coordinates: { lat: 52.2297, lng: 10.5267 },
              timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
              type: 'obstruction',
              severity: 'low',
              description: 'Vegetation wächst zu nah an Gleisen',
              coordinates: { lat: 50.7753, lng: 6.0839 },
              timestamp: new Date(Date.now() - 1800000).toISOString()
            }
          ]
        },
        {
          id: 'mission-weather-002',
          title: 'Sturmsystem-Tracking Norddeutschland',
          type: 'weather_monitoring',
          priority: 'urgent',
          targetArea: {
            name: 'Norddeutschland',
            coordinates: { lat: 53.8654, lng: 10.6865 },
            radius: 300
          },
          assignedSatellites: ['sat-weathereye-04'],
          status: 'active',
          startTime: new Date(Date.now() - 1800000).toISOString(),
          estimatedDuration: 360,
          dataCollected: 156.8,
          findings: [
            {
              type: 'weather_event',
              severity: 'high',
              description: 'Schweres Gewitter mit Hagelgefahr',
              coordinates: { lat: 53.5511, lng: 9.9937 },
              timestamp: new Date(Date.now() - 900000).toISOString()
            }
          ]
        },
        {
          id: 'mission-emergency-003',
          title: 'Notfall-Scan Gleisschaden ICE-Strecke',
          type: 'emergency_response',
          priority: 'critical',
          targetArea: {
            name: 'ICE-Strecke Hannover-Würzburg',
            coordinates: { lat: 51.0504, lng: 9.9145 },
            radius: 50
          },
          assignedSatellites: ['sat-railwatch-01', 'sat-skyguard-03'],
          status: 'completed',
          startTime: new Date(Date.now() - 5400000).toISOString(),
          estimatedDuration: 45,
          dataCollected: 23.7,
          findings: [
            {
              type: 'damage',
              severity: 'critical',
              description: 'Brücken-Strukturschaden bestätigt',
              coordinates: { lat: 51.0504, lng: 9.9145 },
              timestamp: new Date(Date.now() - 4500000).toISOString()
            }
          ]
        }
      ]
      setMissions(mockMissions)
    }

    // Echtzeit-Daten aktualisieren
    const interval = setInterval(() => {
      const activeSats = satellites.filter(sat => sat.status === 'active').length
      const totalCoverage = satellites.reduce((sum, sat) => sum + sat.coverageArea, 0)
      const activeMissions = missions.filter(m => m.status === 'active').length
      const totalDataRate = satellites.reduce((sum, sat) => sum + sat.dataTransmissionRate, 0)

      setRealTimeData(prev => ({
        activeSatellites: activeSats,
        globalCoverage: totalCoverage / 1000000, // In Millionen km²
        currentScans: activeMissions,
        dataDownlink: totalDataRate / 1000, // In Gbps
        alertsGenerated: prev.alertsGenerated + Math.floor(Math.random() * 3),
        systemEfficiency: (activeSats / satellites.length) * 100
      }))

      // Simuliere Satelliten-Positionsänderungen
      setSatellites(currentSats => 
        currentSats.map(sat => {
          if (sat.status === 'active') {
            // Simuliere Orbital-Bewegung
            const deltaTime = 3 // Sekunden
            const orbitSpeed = 360 / (sat.orbit.period * 60) // Grad pro Sekunde
            const newLng = sat.position.longitude + (orbitSpeed * deltaTime)
            
            return {
              ...sat,
              position: {
                ...sat.position,
                longitude: newLng > 180 ? newLng - 360 : newLng
              },
              lastUpdate: new Date().toISOString()
            }
          }
          return sat
        })
      )

    }, 3000)

    return () => clearInterval(interval)
  }, [satellites, missions, setSatellites, setMissions])

  const initiateScan = async (satelliteId: string, targetArea: string) => {
    try {
      const satellite = satellites.find(sat => sat.id === satelliteId)
      if (!satellite) return

      const newMission: MonitoringMission = {
        id: `scan-${Date.now()}`,
        title: `Adhoc-Scan: ${targetArea}`,
        type: 'infrastructure_scan',
        priority: 'high',
        targetArea: {
          name: targetArea,
          coordinates: { lat: 51.0 + Math.random() * 4, lng: 7.0 + Math.random() * 8 },
          radius: 25
        },
        assignedSatellites: [satelliteId],
        status: 'planning',
        startTime: new Date().toISOString(),
        estimatedDuration: 30,
        dataCollected: 0,
        findings: []
      }

      setMissions(current => [newMission, ...current])

      setTimeout(() => {
        setMissions(current => 
          current.map(m => 
            m.id === newMission.id 
              ? { ...m, status: 'active' as const }
              : m
          )
        )
      }, 2000)

      toast.success(`Satelliten-Scan initiiert: ${satellite.name}`, {
        description: `Zielgebiet: ${targetArea}`
      })

    } catch (error) {
      toast.error('Fehler beim Initiieren des Satelliten-Scans')
    }
  }

  const recalibrateSatellite = async (satelliteId: string) => {
    try {
      const satellite = satellites.find(sat => sat.id === satelliteId)
      if (!satellite) return

      setSatellites(current => 
        current.map(sat => 
          sat.id === satelliteId 
            ? { ...sat, status: 'maintenance' as const }
            : sat
        )
      )

      toast.info(`${satellite.name} wird rekalibriert...`, {
        description: 'Sensor-Kalibrierung und Orbital-Anpassung'
      })

      setTimeout(() => {
        setSatellites(current => 
          current.map(sat => 
            sat.id === satelliteId 
              ? { 
                  ...sat, 
                  status: 'active' as const,
                  powerLevel: Math.min(100, sat.powerLevel + 5),
                  sensors: sat.sensors.map(sensor => ({
                    ...sensor,
                    accuracy: Math.min(100, sensor.accuracy + Math.random() * 3)
                  }))
                }
              : sat
          )
        )
        toast.success('Satelliten-Rekalibrierung abgeschlossen')
      }, 5000)

    } catch (error) {
      toast.error('Fehler bei der Satelliten-Rekalibrierung')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'standby': return 'text-blue-600'
      case 'maintenance': return 'text-yellow-600'
      case 'lost_signal': return 'text-orange-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSatelliteTypeColor = (type: SpaceSatellite['type']) => {
    switch (type) {
      case 'imaging': return 'bg-blue-500'
      case 'radar': return 'bg-green-500'
      case 'surveillance': return 'bg-purple-500'
      case 'weather': return 'bg-orange-500'
      case 'communication': return 'bg-pink-500'
      default: return 'bg-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-700'
      case 'urgent': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'routine': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Satellite size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Space-Based-Monitoring</h1>
            <p className="text-muted-foreground">Weltraum-gestützte Überwachung der Bahninfrastruktur</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => toast.info('Satelliten-Konstellation wird optimiert...')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Globe size={16} className="mr-2" />
            Konstellation Sync
          </Button>
          <Button 
            onClick={() => initiateScan('sat-railwatch-01', 'Notfall-Gebiet')}
            variant="destructive"
          >
            <AlertTriangle size={16} className="mr-2" />
            Notfall-Scan
          </Button>
        </div>
      </div>

      {/* System-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aktive Satelliten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{realTimeData.activeSatellites}</div>
            <p className="text-xs text-muted-foreground">Im Orbit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Globale Abdeckung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{realTimeData.globalCoverage.toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">km² überwacht</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aktive Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{realTimeData.currentScans}</div>
            <p className="text-xs text-muted-foreground">Laufende Missionen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Daten-Downlink</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{realTimeData.dataDownlink.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Gbps gesamt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Alerts Generiert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{realTimeData.alertsGenerated}</div>
            <p className="text-xs text-muted-foreground">24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">System-Effizienz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{realTimeData.systemEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Satelliten & Missionen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Satelliten-Fleet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Telescope size={20} />
              Satelliten-Fleet
            </CardTitle>
            <CardDescription>Weltraum-gestützte Überwachungssatelliten</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {satellites.map((satellite) => (
              <div key={satellite.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getSatelliteTypeColor(satellite.type)}`}></div>
                    <div>
                      <h4 className="font-semibold">{satellite.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {satellite.type} • Höhe: {satellite.orbit.altitude}km • 
                        <span className={`ml-1 font-medium ${getStatusColor(satellite.status)}`}>
                          {satellite.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Badge variant={satellite.status === 'active' ? "default" : "secondary"}>
                    {satellite.resolution < 1 ? `${(satellite.resolution * 100).toFixed(0)}cm` : `${satellite.resolution.toFixed(1)}m`} Auflösung
                  </Badge>
                </div>

                {/* Orbital-Daten */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Bahnneigung</p>
                    <p className="font-semibold">{satellite.orbit.inclination.toFixed(1)}°</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Umlaufzeit</p>
                    <p className="font-semibold">{satellite.orbit.period.toFixed(1)}min</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Abdeckung</p>
                    <p className="font-semibold">{(satellite.coverageArea / 1000).toFixed(0)}k km²</p>
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Aktuelle Position</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Koordinaten</p>
                      <p className="font-mono text-xs">
                        {satellite.position.latitude.toFixed(3)}°N, {satellite.position.longitude.toFixed(3)}°E
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Datenrate</p>
                      <p className="font-semibold">{satellite.dataTransmissionRate} Mbps</p>
                    </div>
                  </div>
                </div>

                {/* Energie & Sensoren */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Energielevel</span>
                      <span>{satellite.powerLevel}%</span>
                    </div>
                    <Progress value={satellite.powerLevel} className="h-2" />
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2">Sensor-Status</h5>
                    {satellite.sensors.map((sensor, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${sensor.status === 'online' ? 'bg-green-500' : 
                                            sensor.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                          <span>{sensor.type}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {sensor.accuracy.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aktionen */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => initiateScan(satellite.id, 'Test-Gebiet')}
                    disabled={satellite.status !== 'active'}
                  >
                    <Eye size={14} className="mr-1" />
                    Scan Starten
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => recalibrateSatellite(satellite.id)}
                    disabled={satellite.status === 'maintenance'}
                  >
                    <Target size={14} className="mr-1" />
                    Kalibrieren
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Überwachungs-Missionen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor size={20} />
              Überwachungs-Missionen
            </CardTitle>
            <CardDescription>Aktive und geplante Satelliten-Missionen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {missions.map((mission) => (
              <div key={mission.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{mission.title}</h4>
                    <p className="text-sm text-muted-foreground">{mission.targetArea.name}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={mission.priority === 'critical' ? "destructive" : 
                                   mission.priority === 'urgent' ? "default" : "secondary"}>
                      {mission.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mission.assignedSatellites.length} Satellit{mission.assignedSatellites.length !== 1 ? 'en' : ''}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge variant={mission.status === 'active' ? "default" : 
                                 mission.status === 'completed' ? "outline" : "secondary"}>
                    {mission.status === 'active' ? 'Aktiv' : 
                     mission.status === 'completed' ? 'Abgeschlossen' :
                     mission.status === 'planning' ? 'Geplant' : mission.status}
                  </Badge>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Gestartet</p>
                      <p className="font-medium">
                        {new Date(mission.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dauer</p>
                      <p className="font-medium">{mission.estimatedDuration} Min</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Daten gesammelt</p>
                      <p className="font-medium">{mission.dataCollected.toFixed(1)} GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Radius</p>
                      <p className="font-medium">{mission.targetArea.radius} km</p>
                    </div>
                  </div>
                </div>

                {/* Erkenntnisse */}
                {mission.findings.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Erkenntnisse ({mission.findings.length})</h5>
                    {mission.findings.slice(0, 2).map((finding, index) => (
                      <div key={index} className="p-2 bg-secondary/50 rounded text-sm">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${finding.severity === 'critical' ? 'bg-red-500' : 
                                              finding.severity === 'high' ? 'bg-orange-500' : 
                                              finding.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                            <span className="font-medium">{finding.type.replace('_', ' ')}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {finding.severity}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{finding.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(finding.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System-Konfiguration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Weltraum-System Konfiguration
          </CardTitle>
          <CardDescription>Einstellungen für satellitengestützte Überwachung</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Orbit-Optimierung</h4>
              <Badge variant="default">
                Automatisch
              </Badge>
              <p className="text-xs text-muted-foreground">
                KI-gesteuerte Bahnkorrektur
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Scan-Auflösung</h4>
              <Badge variant="default">
                Ultra-Hoch
              </Badge>
              <p className="text-xs text-muted-foreground">
                Bis zu 30cm Bodenauflösung
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Real-Time-Processing</h4>
              <Badge variant="default">
                Aktiviert
              </Badge>
              <p className="text-xs text-muted-foreground">
                Live-Auswertung im Weltraum
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Notfall-Override</h4>
              <Badge variant="destructive">
                Bereit
              </Badge>
              <p className="text-xs text-muted-foreground">
                Sofortige Prioritäts-Scans
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnungen */}
      {satellites.filter(s => s.status === 'lost_signal' || s.status === 'critical').length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle size={16} />
          <AlertDescription>
            {satellites.filter(s => s.status === 'lost_signal' || s.status === 'critical').length} 
            Satellit{satellites.filter(s => s.status === 'lost_signal' || s.status === 'critical').length !== 1 ? 'en' : ''} 
            haben kritische Probleme. Sofortige Aufmerksamkeit erforderlich.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default SpaceBasedMonitoringSystem