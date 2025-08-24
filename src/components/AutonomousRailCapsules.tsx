import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Rocket,
  Route,
  Users,
  Battery,
  Wind,
  Target,
  Activity,
  Settings,
  MapPin,
  Clock,
  Gauge,
  Zap,
  Globe,
  Magnet,
  ArrowUp,
  ArrowDown,
  Circle,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Navigation,
  TrendUp,
  Layers,
  Atom
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Capsule {
  id: string
  name: string
  status: 'aktiv' | 'wartung' | 'transit' | 'bereit' | 'notfall'
  passengers: number
  maxCapacity: number
  currentRoute: string
  destination: string
  currentPosition: { x: number; y: number; z: number }
  speed: number
  batteryLevel: number
  magneticLevitation: {
    height: number
    stability: number
    power: number
  }
  autonomyLevel: number
  routeOptimization: number
}

interface Route {
  id: string
  name: string
  waypoints: Array<{ x: number; y: number; z: number; station: string }>
  distance: number
  estimatedTime: number
  difficulty: 'einfach' | 'mittel' | 'komplex'
  capsuleCount: number
}

interface MagneticSystemStatus {
  fieldStrength: number
  levitationHeight: number
  powerConsumption: number
  stability: number
  temperatur: number
  resonanzFrequenz: number
}

const AutonomousRailCapsules: React.FC = () => {
  const [capsules, setCapsules] = useKV<Capsule[]>('rail-capsules', [])
  const [routes, setRoutes] = useKV<Route[]>('capsule-routes', [])
  const [magneticSystem, setMagneticSystem] = useKV<MagneticSystemStatus>('magnetic-system', {
    fieldStrength: 98.5,
    levitationHeight: 12.7,
    powerConsumption: 78.2,
    stability: 99.1,
    temperatur: 24.3,
    resonanzFrequenz: 50.0
  })
  
  const [selectedCapsule, setSelectedCapsule] = useState<string>('')
  const [isSystemActive, setIsSystemActive] = useKV('capsule-system-active', true)
  const [systemMode, setSystemMode] = useKV('capsule-system-mode', 'automatisch')

  // Initialisiere Demo-Daten
  useEffect(() => {
    if (capsules.length === 0) {
      const demoCapsules: Capsule[] = [
        {
          id: 'cap-001',
          name: 'Magneto Alpha',
          status: 'aktiv',
          passengers: 8,
          maxCapacity: 12,
          currentRoute: 'route-hauptstrecke',
          destination: 'Berlin Hauptbahnhof',
          currentPosition: { x: 45.2, y: 120.8, z: 12.7 },
          speed: 185.4,
          batteryLevel: 92,
          magneticLevitation: {
            height: 12.7,
            stability: 99.2,
            power: 78.5
          },
          autonomyLevel: 96,
          routeOptimization: 88
        },
        {
          id: 'cap-002',
          name: 'Levitas Beta',
          status: 'transit',
          passengers: 4,
          maxCapacity: 8,
          currentRoute: 'route-express',
          destination: 'München Zentral',
          currentPosition: { x: 78.9, y: 245.1, z: 11.9 },
          speed: 210.7,
          batteryLevel: 87,
          magneticLevitation: {
            height: 11.9,
            stability: 98.8,
            power: 82.1
          },
          autonomyLevel: 94,
          routeOptimization: 92
        },
        {
          id: 'cap-003',
          name: 'Quantum Gamma',
          status: 'bereit',
          passengers: 0,
          maxCapacity: 16,
          currentRoute: '',
          destination: '',
          currentPosition: { x: 12.4, y: 56.7, z: 0.0 },
          speed: 0,
          batteryLevel: 100,
          magneticLevitation: {
            height: 0.0,
            stability: 100,
            power: 0
          },
          autonomyLevel: 98,
          routeOptimization: 95
        }
      ]
      setCapsules(demoCapsules)
    }

    if (routes.length === 0) {
      const demoRoutes: Route[] = [
        {
          id: 'route-hauptstrecke',
          name: 'Hauptstrecke Nord-Süd',
          waypoints: [
            { x: 0, y: 0, z: 12, station: 'Hamburg Zentral' },
            { x: 45, y: 120, z: 12, station: 'Hannover Magneto' },
            { x: 89, y: 280, z: 13, station: 'Berlin Hauptbahnhof' }
          ],
          distance: 485.7,
          estimatedTime: 98,
          difficulty: 'mittel',
          capsuleCount: 3
        },
        {
          id: 'route-express',
          name: 'Süddeutschland Express',
          waypoints: [
            { x: 89, y: 280, z: 13, station: 'Berlin Hauptbahnhof' },
            { x: 78, y: 245, z: 12, station: 'Nürnberg Magneto' },
            { x: 67, y: 189, z: 11, station: 'München Zentral' }
          ],
          distance: 358.2,
          estimatedTime: 76,
          difficulty: 'komplex',
          capsuleCount: 2
        }
      ]
      setRoutes(demoRoutes)
    }
  }, [capsules, routes, setCapsules, setRoutes])

  // Echtzeit-Simulationen
  useEffect(() => {
    const interval = setInterval(() => {
      // Aktualisiere Capsule-Status
      setCapsules(prevCapsules => 
        prevCapsules.map(capsule => {
          if (capsule.status === 'aktiv' || capsule.status === 'transit') {
            return {
              ...capsule,
              speed: capsule.speed + (Math.random() - 0.5) * 5,
              batteryLevel: Math.max(0, capsule.batteryLevel - 0.1),
              magneticLevitation: {
                ...capsule.magneticLevitation,
                height: capsule.magneticLevitation.height + (Math.random() - 0.5) * 0.2,
                stability: Math.min(100, capsule.magneticLevitation.stability + (Math.random() - 0.5) * 0.5)
              },
              currentPosition: {
                x: capsule.currentPosition.x + (Math.random() - 0.5) * 2,
                y: capsule.currentPosition.y + (Math.random() - 0.5) * 2,
                z: capsule.currentPosition.z + (Math.random() - 0.5) * 0.1
              }
            }
          }
          return capsule
        })
      )

      // Aktualisiere Magnetfeld-System
      setMagneticSystem(prev => ({
        ...prev,
        fieldStrength: prev.fieldStrength + (Math.random() - 0.5) * 0.5,
        powerConsumption: Math.max(0, prev.powerConsumption + (Math.random() - 0.5) * 2),
        stability: Math.min(100, prev.stability + (Math.random() - 0.5) * 0.2),
        temperatur: prev.temperatur + (Math.random() - 0.5) * 0.3
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [setCapsules, setMagneticSystem])

  const startCapsule = (capsuleId: string) => {
    setCapsules(prev => 
      prev.map(cap => 
        cap.id === capsuleId 
          ? { ...cap, status: 'aktiv' as const, speed: 150 }
          : cap
      )
    )
    toast.success(`Capsule ${capsuleId} gestartet`)
  }

  const stopCapsule = (capsuleId: string) => {
    setCapsules(prev => 
      prev.map(cap => 
        cap.id === capsuleId 
          ? { ...cap, status: 'bereit' as const, speed: 0 }
          : cap
      )
    )
    toast.info(`Capsule ${capsuleId} gestoppt`)
  }

  const emergencyStop = () => {
    setCapsules(prev => 
      prev.map(cap => ({ ...cap, status: 'notfall' as const, speed: 0 }))
    )
    setIsSystemActive(false)
    toast.error('Notfall-Stopp aktiviert!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktiv': return 'bg-green-500'
      case 'transit': return 'bg-blue-500'
      case 'wartung': return 'bg-yellow-500'
      case 'bereit': return 'bg-gray-500'
      case 'notfall': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aktiv': return 'Aktiv'
      case 'transit': return 'In Transit'
      case 'wartung': return 'Wartung'
      case 'bereit': return 'Bereit'
      case 'notfall': return 'Notfall'
      default: return 'Unbekannt'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Rocket size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Autonome Bahn-Capsules</h1>
            <p className="text-muted-foreground">Magnet-Schwebesystem mit individueller Routenführung</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={isSystemActive ? "default" : "destructive"} className="px-3 py-1">
            {isSystemActive ? 'System Aktiv' : 'System Gestoppt'}
          </Badge>
          <Button 
            variant="destructive" 
            onClick={emergencyStop}
            className="gap-2"
          >
            <AlertTriangle size={16} />
            Notfall-Stopp
          </Button>
        </div>
      </div>

      {/* System-Status-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Magnet size={20} className="text-primary" />
              <CardTitle className="text-lg">Magnetfeld-System</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Feldstärke</span>
              <span className="font-mono text-primary">{magneticSystem.fieldStrength.toFixed(1)}%</span>
            </div>
            <Progress value={magneticSystem.fieldStrength} className="h-2" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Schwebehöhe:</span>
                <span className="font-mono">{magneticSystem.levitationHeight.toFixed(1)}m</span>
              </div>
              <div className="flex justify-between">
                <span>Stabilität:</span>
                <span className="font-mono">{magneticSystem.stability.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Temperatur:</span>
                <span className="font-mono">{magneticSystem.temperatur.toFixed(1)}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-blue-500" />
              <CardTitle className="text-lg">Capsule-Fleet</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">{capsules.length}</span>
                <span className="text-sm text-muted-foreground">Gesamt</span>
              </div>
              <div className="space-y-2">
                {['aktiv', 'transit', 'bereit', 'wartung', 'notfall'].map(status => {
                  const count = capsules.filter(c => c.status === status).length
                  return (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                        <span className="capitalize">{getStatusText(status)}</span>
                      </div>
                      <span className="font-mono">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Route size={20} className="text-green-500" />
              <CardTitle className="text-lg">Routen-Netzwerk</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">{routes.length}</span>
                <span className="text-sm text-muted-foreground">Aktive Routen</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Gesamtdistanz:</span>
                  <span className="font-mono">{routes.reduce((sum, r) => sum + r.distance, 0).toFixed(1)}km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ø Reisezeit:</span>
                  <span className="font-mono">{Math.round(routes.reduce((sum, r) => sum + r.estimatedTime, 0) / routes.length)}min</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" />
              <CardTitle className="text-lg">Energie-System</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Stromverbrauch</span>
                <span className="font-mono text-primary">{magneticSystem.powerConsumption.toFixed(1)}kW</span>
              </div>
              <Progress value={magneticSystem.powerConsumption} className="h-2" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Effizienz:</span>
                  <span className="font-mono">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Regeneration:</span>
                  <span className="font-mono">23.1kW</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Haupt-Tabs */}
      <Tabs defaultValue="capsules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="capsules">Capsule-Flotte</TabsTrigger>
          <TabsTrigger value="routes">Routen-System</TabsTrigger>
          <TabsTrigger value="magnetic">Magnet-Schwebesystem</TabsTrigger>
          <TabsTrigger value="analytics">Echtzeit-Analytik</TabsTrigger>
        </TabsList>

        {/* Capsule-Flotte */}
        <TabsContent value="capsules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {capsules.map(capsule => (
              <Card key={capsule.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(capsule.status)}`}></div>
                      <CardTitle className="text-lg">{capsule.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {getStatusText(capsule.status)}
                    </Badge>
                  </div>
                  <CardDescription>ID: {capsule.id}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Passagiere */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Passagiere</span>
                      <span className="font-mono">{capsule.passengers}/{capsule.maxCapacity}</span>
                    </div>
                    <Progress 
                      value={(capsule.passengers / capsule.maxCapacity) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Geschwindigkeit */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge size={16} className="text-blue-500" />
                      <span className="text-sm">Geschwindigkeit</span>
                    </div>
                    <span className="font-mono text-primary">{capsule.speed.toFixed(1)} km/h</span>
                  </div>

                  {/* Magnet-Schwebesystem */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ArrowUp size={16} className="text-purple-500" />
                      <span className="text-sm">Schwebehöhe</span>
                      <span className="font-mono ml-auto">{capsule.magneticLevitation.height.toFixed(1)}m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Stabilität:</span>
                      <span className="font-mono">{capsule.magneticLevitation.stability.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Batterie */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Batterie</span>
                      <span className="font-mono">{capsule.batteryLevel}%</span>
                    </div>
                    <Progress value={capsule.batteryLevel} className="h-2" />
                  </div>

                  {/* Ziel */}
                  {capsule.destination && (
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-green-500" />
                      <span className="text-sm">{capsule.destination}</span>
                    </div>
                  )}

                  {/* Steuerung */}
                  <div className="flex gap-2 pt-2">
                    {capsule.status === 'bereit' ? (
                      <Button 
                        size="sm" 
                        onClick={() => startCapsule(capsule.id)}
                        className="flex-1 gap-2"
                      >
                        <Play size={14} />
                        Start
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => stopCapsule(capsule.id)}
                        className="flex-1 gap-2"
                      >
                        <Pause size={14} />
                        Stopp
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="gap-2">
                      <Settings size={14} />
                      Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Routen-System */}
        <TabsContent value="routes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {routes.map(route => (
              <Card key={route.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                    <Badge variant={route.difficulty === 'komplex' ? 'destructive' : route.difficulty === 'mittel' ? 'default' : 'secondary'}>
                      {route.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>Route ID: {route.id}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-primary">{route.distance.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">km Distanz</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-blue-500">{route.estimatedTime}</div>
                      <div className="text-xs text-muted-foreground">min Fahrzeit</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-green-500" />
                      <span className="text-sm font-medium">Waypoints</span>
                    </div>
                    <div className="space-y-1">
                      {route.waypoints.map((waypoint, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm pl-6">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>{waypoint.station}</span>
                          <span className="text-muted-foreground ml-auto font-mono">
                            ({waypoint.x.toFixed(1)}, {waypoint.y.toFixed(1)}, {waypoint.z.toFixed(1)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-blue-500" />
                      <span className="text-sm">{route.capsuleCount} Capsules aktiv</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Route optimieren
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Magnet-Schwebesystem */}
        <TabsContent value="magnetic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom size={20} className="text-purple-500" />
                  Magnetfeld-Parameter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Feldstärke</Label>
                      <span className="font-mono text-primary">{magneticSystem.fieldStrength.toFixed(1)}%</span>
                    </div>
                    <Progress value={magneticSystem.fieldStrength} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Schwebehöhe</Label>
                      <span className="font-mono text-blue-500">{magneticSystem.levitationHeight.toFixed(1)}m</span>
                    </div>
                    <Progress value={(magneticSystem.levitationHeight / 20) * 100} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Systemstabilität</Label>
                      <span className="font-mono text-green-500">{magneticSystem.stability.toFixed(1)}%</span>
                    </div>
                    <Progress value={magneticSystem.stability} className="h-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center space-y-1">
                    <div className="text-sm text-muted-foreground">Resonanzfrequenz</div>
                    <div className="font-mono text-lg">{magneticSystem.resonanzFrequenz.toFixed(1)} Hz</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-sm text-muted-foreground">Betriebstemperatur</div>
                    <div className="font-mono text-lg">{magneticSystem.temperatur.toFixed(1)}°C</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap size={20} className="text-yellow-500" />
                  Energie-Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Battery size={16} className="text-green-500" />
                      <span className="text-sm">Stromverbrauch</span>
                    </div>
                    <span className="font-mono text-primary">{magneticSystem.powerConsumption.toFixed(1)} kW</span>
                  </div>

                  <div className="space-y-2">
                    <Progress value={(magneticSystem.powerConsumption / 100) * 100} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 kW</span>
                      <span>100 kW Maximum</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Energieeffizienz</div>
                    <div className="text-xl font-bold text-green-500">94.2%</div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Rückspeisung</div>
                    <div className="text-xl font-bold text-blue-500">23.1 kW</div>
                    <Progress value={23.1} className="h-2" />
                  </div>
                </div>

                <Alert>
                  <CheckCircle size={16} />
                  <AlertDescription>
                    Magnet-Schwebesystem arbeitet optimal. Alle Parameter im grünen Bereich.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Echtzeit-Analytik */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance-Metriken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Durchschnittsgeschwindigkeit</span>
                    <span className="font-mono text-primary">
                      {(capsules.reduce((sum, c) => sum + c.speed, 0) / capsules.length).toFixed(1)} km/h
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Flottenauslastung</span>
                    <span className="font-mono text-blue-500">
                      {((capsules.reduce((sum, c) => sum + c.passengers, 0) / 
                         capsules.reduce((sum, c) => sum + c.maxCapacity, 0)) * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Autonomie-Level</span>
                    <span className="font-mono text-green-500">
                      {(capsules.reduce((sum, c) => sum + c.autonomyLevel, 0) / capsules.length).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Routen-Optimierung</span>
                    <span className="font-mono text-purple-500">
                      {(capsules.reduce((sum, c) => sum + c.routeOptimization, 0) / capsules.length).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sicherheits-Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Kollisionsvermeidung</span>
                    </div>
                    <span className="text-xs font-mono">Aktiv</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Notfall-Systeme</span>
                    </div>
                    <span className="text-xs font-mono">Bereit</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Magnet-Backup</span>
                    </div>
                    <span className="text-xs font-mono">Online</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Kommunikation</span>
                    </div>
                    <span className="text-xs font-mono">Stabil</span>
                  </div>
                </div>

                <Alert>
                  <CheckCircle size={16} />
                  <AlertDescription>
                    Alle Sicherheitssysteme funktionsfähig
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Netzwerk-Topologie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aktive Verbindungen</span>
                    <span className="font-mono text-primary">{routes.length * 3}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Netzwerk-Redundanz</span>
                    <span className="font-mono text-green-500">98.7%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Latenz (durchschnitt)</span>
                    <span className="font-mono text-blue-500">1.2ms</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Datenübertragung</span>
                    <span className="font-mono text-purple-500">847 MB/s</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {capsules.filter(c => c.status === 'aktiv' || c.status === 'transit').length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Capsules in Bewegung
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AutonomousRailCapsules