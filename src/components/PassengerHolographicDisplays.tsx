/**
 * @fileoverview Holographische 3D-Fahrgastinformationen an Bahnhöfen
 * @author SmartRail-AI System
 * @version 2.0.0
 * 
 * Revolutionäre 3D-Hologramm-Technologie für immersive Fahrgastinformationen
 * mit räumlicher Darstellung von Zugverbindungen, Verspätungen und Navigationshilfen
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
  Cube, 
  Eye, 
  Train, 
  Clock, 
  MapPin, 
  Users, 
  Sparkle,
  ThreeDimensions,
  Globe,
  Navigation,
  Waves,
  Monitor,
  Info,
  ArrowRight,
  Calendar,
  Lightning
} from '@phosphor-icons/react'

interface HologramDisplay {
  id: string
  stationName: string
  position: { x: number; y: number; z: number }
  isActive: boolean
  brightness: number
  resolution: string
  viewers: number
  content: {
    trains: Array<{
      id: string
      destination: string
      platform: string
      delay: number
      capacity: number
    }>
    navigation: Array<{
      from: string
      to: string
      route: string[]
      duration: number
    }>
  }
}

interface HologramContent {
  type: 'train_info' | 'navigation' | 'emergency' | 'advertisement'
  priority: number
  data: any
  displayTime: number
}

const PassengerHolographicDisplays: React.FC = () => {
  const [displays, setDisplays] = useKV<HologramDisplay[]>('hologram-displays', [])
  const [activeContent, setActiveContent] = useKV<HologramContent[]>('hologram-content', [])
  const [systemConfig, setSystemConfig] = useKV('hologram-config', {
    maxBrightness: 100,
    autoAdjustBrightness: true,
    emergencyOverride: true,
    multiLanguageSupport: true,
    accessibilityMode: false
  })

  const [realTimeData, setRealTimeData] = useState({
    totalDisplays: 0,
    activeViewers: 0,
    contentUpdates: 0,
    powerConsumption: 0,
    emergencyAlerts: 0
  })

  // Simulation der Hologramm-Displays
  useEffect(() => {
    if (displays.length === 0) {
      const mockDisplays: HologramDisplay[] = [
        {
          id: 'holo-hauptbahnhof-01',
          stationName: 'Hauptbahnhof - Gleis 1-8',
          position: { x: 0, y: 2.5, z: 0 },
          isActive: true,
          brightness: 85,
          resolution: '4K Volumetrisch',
          viewers: 127,
          content: {
            trains: [
              { id: 'ICE401', destination: 'München Hbf', platform: 'Gleis 7', delay: 0, capacity: 72 },
              { id: 'RE2847', destination: 'Frankfurt(M) Hbf', platform: 'Gleis 3', delay: 5, capacity: 45 },
              { id: 'S1', destination: 'Flughafen', platform: 'Gleis 101', delay: 2, capacity: 89 }
            ],
            navigation: [
              { from: 'Haupthalle', to: 'Gleis 7', route: ['Treppe A', 'Unterführung', 'Aufgang 7'], duration: 4 },
              { from: 'Gleis 3', to: 'Ausgang Nord', route: ['Bahnsteig', 'Haupthalle', 'Nordausgang'], duration: 6 }
            ]
          }
        },
        {
          id: 'holo-zentral-02',
          stationName: 'Bahnhof Zentral - Gleis 9-16',
          position: { x: 10, y: 2.5, z: 5 },
          isActive: true,
          brightness: 92,
          resolution: '8K Volumetrisch',
          viewers: 84,
          content: {
            trains: [
              { id: 'IC2194', destination: 'Berlin Hbf', platform: 'Gleis 12', delay: 0, capacity: 58 },
              { id: 'RB4521', destination: 'Dortmund Hbf', platform: 'Gleis 15', delay: 3, capacity: 67 }
            ],
            navigation: [
              { from: 'Eingang West', to: 'Gleis 12', route: ['Westeingang', 'Unterführung B', 'Aufgang 12'], duration: 5 }
            ]
          }
        },
        {
          id: 'holo-nord-03',
          stationName: 'Nordbahnhof - S-Bahn',
          position: { x: -5, y: 2.5, z: -3 },
          isActive: true,
          brightness: 78,
          resolution: '4K Volumetrisch',
          viewers: 156,
          content: {
            trains: [
              { id: 'S3', destination: 'Messe', platform: 'Gleis S1', delay: 1, capacity: 92 },
              { id: 'S7', destination: 'Vorort-Linie', platform: 'Gleis S2', delay: 0, capacity: 78 }
            ],
            navigation: [
              { from: 'S-Bahn Eingang', to: 'Gleis S1', route: ['Eingangshalle', 'S-Bahn Ebene'], duration: 2 }
            ]
          }
        }
      ]
      setDisplays(mockDisplays)
    }

    // Echtzeit-Daten aktualisieren
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        totalDisplays: displays.length,
        activeViewers: displays.reduce((sum, display) => sum + display.viewers, 0),
        contentUpdates: prev.contentUpdates + Math.floor(Math.random() * 3),
        powerConsumption: displays.reduce((sum, display) => sum + (display.brightness * 0.8), 0),
        emergencyAlerts: Math.floor(Math.random() * 2)
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [displays, setDisplays])

  const updateDisplayContent = async (displayId: string, newContent: HologramContent) => {
    try {
      setActiveContent(currentContent => [
        ...currentContent.filter(c => c.type !== newContent.type),
        newContent
      ])
      
      toast.success(`Hologramm-Inhalt aktualisiert für Display ${displayId}`, {
        description: `Neuer ${newContent.type} Inhalt wurde projiziert`
      })
    } catch (error) {
      toast.error('Fehler beim Aktualisieren des Hologramm-Inhalts')
    }
  }

  const adjustDisplayBrightness = (displayId: string, brightness: number) => {
    setDisplays(currentDisplays => 
      currentDisplays.map(display => 
        display.id === displayId 
          ? { ...display, brightness }
          : display
      )
    )
    toast.info(`Helligkeit für Display ${displayId} auf ${brightness}% angepasst`)
  }

  const toggleEmergencyMode = () => {
    const emergencyContent: HologramContent = {
      type: 'emergency',
      priority: 10,
      data: {
        message: 'NOTFALL: Alle Züge gestoppt. Folgen Sie den Evakuierungsanweisungen.',
        instructions: ['Verlassen Sie ruhig den Bahnsteig', 'Nutzen Sie die Notausgänge', 'Warten Sie auf weitere Anweisungen']
      },
      displayTime: 30000
    }

    setActiveContent([emergencyContent])
    
    // Alle Displays auf maximale Helligkeit setzen
    setDisplays(currentDisplays => 
      currentDisplays.map(display => ({ 
        ...display, 
        brightness: 100 
      }))
    )

    toast.error('Notfall-Modus aktiviert - Alle Hologramm-Displays zeigen Notfallinformationen')
  }

  const simulate3DProjection = (displayId: string) => {
    toast.info('3D-Hologramm-Projektion simuliert', {
      description: `Volumetrische Darstellung für Display ${displayId} wird berechnet...`
    })
    
    setTimeout(() => {
      toast.success('3D-Hologramm erfolgreich projiziert', {
        description: 'Fahrgäste können die 3D-Informationen aus allen Blickwinkeln betrachten'
      })
    }, 2000)
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Cube size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Holographische 3D-Displays</h1>
            <p className="text-muted-foreground">Immersive Fahrgastinformationen an Bahnhöfen</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => updateDisplayContent('all', {
              type: 'train_info',
              priority: 5,
              data: { refresh: true },
              displayTime: 10000
            })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Lightning size={16} className="mr-2" />
            Inhalte Aktualisieren
          </Button>
          <Button 
            onClick={toggleEmergencyMode}
            variant="destructive"
          >
            <Sparkle size={16} className="mr-2" />
            Notfall-Modus
          </Button>
        </div>
      </div>

      {/* System-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aktive Displays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{realTimeData.totalDisplays}</div>
            <p className="text-xs text-muted-foreground">Hologramm-Projektoren</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Live-Betrachter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{realTimeData.activeViewers}</div>
            <p className="text-xs text-muted-foreground">Gleichzeitige Nutzer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Inhalts-Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{realTimeData.contentUpdates}</div>
            <p className="text-xs text-muted-foreground">Letzte Stunde</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Stromverbrauch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{realTimeData.powerConsumption.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">kW/h aktuelle Last</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notfall-Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{realTimeData.emergencyAlerts}</div>
            <p className="text-xs text-muted-foreground">Aktive Alarme</p>
          </CardContent>
        </Card>
      </div>

      {/* Hologramm-Display Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThreeDimensions size={20} />
              Aktive Hologramm-Displays
            </CardTitle>
            <CardDescription>Verwaltung der 3D-Projektionssysteme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {displays.map((display) => (
              <div key={display.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${display.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <h4 className="font-semibold">{display.stationName}</h4>
                      <p className="text-sm text-muted-foreground">{display.resolution} • {display.viewers} Betrachter</p>
                    </div>
                  </div>
                  <Badge variant={display.isActive ? "default" : "secondary"}>
                    {display.isActive ? 'Aktiv' : 'Offline'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Helligkeit</span>
                    <span>{display.brightness}%</span>
                  </div>
                  <Progress value={display.brightness} className="h-2" />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => adjustDisplayBrightness(display.id, Math.max(0, display.brightness - 10))}
                    >
                      -10%
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => adjustDisplayBrightness(display.id, Math.min(100, display.brightness + 10))}
                    >
                      +10%
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => simulate3DProjection(display.id)}
                    >
                      <Eye size={14} className="mr-1" />
                      3D Test
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Position (X,Y,Z)</p>
                    <p className="font-mono">{display.position.x}, {display.position.y}, {display.position.z}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Aktive Züge</p>
                    <p className="font-semibold">{display.content.trains.length}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor size={20} />
              Hologramm-Inhalte
            </CardTitle>
            <CardDescription>Aktuelle 3D-Projektions-Inhalte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {displays.map((display) => (
              <div key={display.id} className="space-y-4">
                <h4 className="font-semibold text-lg">{display.stationName}</h4>
                
                {/* Zug-Informationen */}
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-2">
                    <Train size={16} />
                    Zug-Informationen (3D)
                  </h5>
                  {display.content.trains.map((train) => (
                    <div key={train.id} className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{train.id}</p>
                          <p className="text-sm text-muted-foreground">{train.destination}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={train.delay === 0 ? "default" : "destructive"}>
                            {train.delay === 0 ? 'Pünktlich' : `+${train.delay} Min`}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{train.platform}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Auslastung</span>
                          <span>{train.capacity}%</span>
                        </div>
                        <Progress value={train.capacity} className="h-1 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigations-Hilfen */}
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-2">
                    <Navigation size={16} />
                    3D-Navigation
                  </h5>
                  {display.content.navigation.map((nav, index) => (
                    <div key={index} className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span className="text-sm">{nav.from} → {nav.to}</span>
                        </div>
                        <Badge variant="outline">
                          <Clock size={12} className="mr-1" />
                          {nav.duration} Min
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        {nav.route.map((step, i) => (
                          <React.Fragment key={i}>
                            <span>{step}</span>
                            {i < nav.route.length - 1 && <ArrowRight size={10} />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System-Konfiguration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkle size={20} />
            Hologramm-System Konfiguration
          </CardTitle>
          <CardDescription>Erweiterte Einstellungen für 3D-Displays</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Maximale Helligkeit</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Limit</span>
                  <span>{systemConfig.maxBrightness}%</span>
                </div>
                <Progress value={systemConfig.maxBrightness} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Auto-Anpassung</h4>
              <Badge variant={systemConfig.autoAdjustBrightness ? "default" : "secondary"}>
                {systemConfig.autoAdjustBrightness ? 'Aktiviert' : 'Deaktiviert'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Helligkeit basierend auf Umgebungslicht
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Notfall-Override</h4>
              <Badge variant={systemConfig.emergencyOverride ? "destructive" : "secondary"}>
                {systemConfig.emergencyOverride ? 'Bereit' : 'Deaktiviert'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Sofortige Notfall-Projektionen
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Mehrsprachig</h4>
              <Badge variant={systemConfig.multiLanguageSupport ? "default" : "secondary"}>
                {systemConfig.multiLanguageSupport ? 'Aktiviert' : 'Deaktiviert'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Automatische Spracherkennung
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status & Warnungen */}
      {realTimeData.emergencyAlerts > 0 && (
        <Alert variant="destructive">
          <Sparkle size={16} />
          <AlertDescription>
            {realTimeData.emergencyAlerts} Notfall-Hologramm{realTimeData.emergencyAlerts !== 1 ? 'e' : ''} aktiv. 
            Alle Displays zeigen prioritäre Sicherheitsinformationen.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default PassengerHolographicDisplays