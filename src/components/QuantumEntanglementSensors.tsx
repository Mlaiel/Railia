/**
 * SmartRail-AI - Quantum-Entanglement-Sensoren für Bewusstseinsfeld-Kartierung
 * 
 * Autor: Fahed Mlaiel
 * Copyright (c) 2024 SmartRail-AI
 * Namensnennung erforderlich bei jeder Nutzung
 */

import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  Atom, 
  Brain, 
  Users, 
  Sparkle, 
  MapPin, 
  Activity, 
  Waves, 
  Target,
  Eye,
  AlertTriangle,
  Cpu,
  Network,
  FlaskConical,
  Circle,
  Settings,
  Zap
} from '@phosphor-icons/react'

interface QuantumSensor {
  id: string
  bahnsteigId: string
  position: { x: number; y: number; z: number }
  entanglementStrength: number
  bewusstseinsIntensitaet: number
  quantenStabilität: number
  letzteKalibrierung: string
  status: 'online' | 'kalibrierung' | 'störung' | 'offline'
}

interface BewusstseinsCluster {
  id: string
  zentrum: { x: number; y: number }
  radius: number
  intensitaet: number
  personenAnzahl: number
  emotionalerZustand: 'entspannt' | 'gestresst' | 'aufgeregt' | 'ängstlich' | 'neutral'
  kohärenzLevel: number
  zeitstempel: string
}

interface QuantumField {
  feldstärke: number
  kohärenz: number
  entropie: number
  resonanzFrequenz: number
  bewusstseinsVerteilung: number[][]
  interferenzMuster: number[][]
}

const QuantumEntanglementSensors = () => {
  const [sensoren, setSensoren] = useKV<QuantumSensor[]>('quantum-entanglement-sensoren', [])
  const [bewusstseinsCluster, setBewusstseinsCluster] = useKV<BewusstseinsCluster[]>('bewusstseins-cluster', [])
  const [quantenfeld, setQuantenfeld] = useKV<QuantumField>('quantum-feld', {
    feldstärke: 0,
    kohärenz: 0,
    entropie: 0,
    resonanzFrequenz: 0,
    bewusstseinsVerteilung: [],
    interferenzMuster: []
  })

  const [aktiverModus, setAktiverModus] = useState<'überwachung' | 'kalibrierung' | 'analyse' | 'intervention'>('überwachung')
  const [selectedSensor, setSelectedSensor] = useState<string>('')
  const [kalibrierungLäuft, setKalibrierungLäuft] = useState(false)
  const [quantenStörungen, setQuantenStörungen] = useState<string[]>([])

  // Quantum-Entanglement-Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      simuliereQuantenSensoren()
      analysiereKollektivbewusstsein()
      überwacheQuantenKohärenz()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const simuliereQuantenSensoren = () => {
    const baseSensoren: QuantumSensor[] = [
      {
        id: 'qe-gleis-1-ost',
        bahnsteigId: 'Gleis 1 Ost',
        position: { x: 50, y: 100, z: 2 },
        entanglementStrength: 85 + Math.random() * 15,
        bewusstseinsIntensitaet: 70 + Math.random() * 30,
        quantenStabilität: 92 + Math.random() * 8,
        letzteKalibrierung: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        status: Math.random() > 0.1 ? 'online' : 'kalibrierung'
      },
      {
        id: 'qe-gleis-1-west',
        bahnsteigId: 'Gleis 1 West',
        position: { x: 250, y: 100, z: 2 },
        entanglementStrength: 78 + Math.random() * 22,
        bewusstseinsIntensitaet: 65 + Math.random() * 35,
        quantenStabilität: 88 + Math.random() * 12,
        letzteKalibrierung: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        status: Math.random() > 0.15 ? 'online' : 'störung'
      },
      {
        id: 'qe-gleis-2-zentral',
        bahnsteigId: 'Gleis 2 Zentral',
        position: { x: 150, y: 200, z: 2 },
        entanglementStrength: 91 + Math.random() * 9,
        bewusstseinsIntensitaet: 82 + Math.random() * 18,
        quantenStabilität: 95 + Math.random() * 5,
        letzteKalibrierung: new Date(Date.now() - Math.random() * 1800000).toISOString(),
        status: 'online'
      },
      {
        id: 'qe-haupthalle-nord',
        bahnsteigId: 'Haupthalle Nord',
        position: { x: 100, y: 50, z: 3 },
        entanglementStrength: 73 + Math.random() * 27,
        bewusstseinsIntensitaet: 55 + Math.random() * 45,
        quantenStabilität: 83 + Math.random() * 17,
        letzteKalibrierung: new Date(Date.now() - Math.random() * 7200000).toISOString(),
        status: Math.random() > 0.2 ? 'online' : 'kalibrierung'
      },
      {
        id: 'qe-haupthalle-süd',
        bahnsteigId: 'Haupthalle Süd',
        position: { x: 200, y: 50, z: 3 },
        entanglementStrength: 80 + Math.random() * 20,
        bewusstseinsIntensitaet: 75 + Math.random() * 25,
        quantenStabilität: 90 + Math.random() * 10,
        letzteKalibrierung: new Date(Date.now() - Math.random() * 5400000).toISOString(),
        status: 'online'
      }
    ]

    setSensoren(baseSensoren)
  }

  const analysiereKollektivbewusstsein = () => {
    const cluster: BewusstseinsCluster[] = [
      {
        id: 'cluster-wartezone-1',
        zentrum: { x: 120, y: 80 },
        radius: 25,
        intensitaet: 78 + Math.random() * 22,
        personenAnzahl: Math.floor(8 + Math.random() * 20),
        emotionalerZustand: ['entspannt', 'gestresst', 'neutral', 'aufgeregt'][Math.floor(Math.random() * 4)] as any,
        kohärenzLevel: 65 + Math.random() * 35,
        zeitstempel: new Date().toISOString()
      },
      {
        id: 'cluster-durchgang-2',
        zentrum: { x: 180, y: 150 },
        radius: 35,
        intensitaet: 85 + Math.random() * 15,
        personenAnzahl: Math.floor(15 + Math.random() * 35),
        emotionalerZustand: ['gestresst', 'aufgeregt', 'neutral'][Math.floor(Math.random() * 3)] as any,
        kohärenzLevel: 70 + Math.random() * 30,
        zeitstempel: new Date().toISOString()
      },
      {
        id: 'cluster-eingang-3',
        zentrum: { x: 80, y: 40 },
        radius: 20,
        intensitaet: 62 + Math.random() * 38,
        personenAnzahl: Math.floor(5 + Math.random() * 15),
        emotionalerZustand: ['neutral', 'entspannt', 'aufgeregt'][Math.floor(Math.random() * 3)] as any,
        kohärenzLevel: 55 + Math.random() * 45,
        zeitstempel: new Date().toISOString()
      }
    ]

    setBewusstseinsCluster(cluster)
  }

  const überwacheQuantenKohärenz = () => {
    const neuesFeld: QuantumField = {
      feldstärke: 75 + Math.random() * 25,
      kohärenz: 80 + Math.random() * 20,
      entropie: 0.3 + Math.random() * 0.4,
      resonanzFrequenz: 432 + Math.random() * 100,
      bewusstseinsVerteilung: Array(10).fill(null).map(() => 
        Array(10).fill(null).map(() => Math.random() * 100)
      ),
      interferenzMuster: Array(8).fill(null).map(() => 
        Array(8).fill(null).map(() => Math.random() * 50)
      )
    }

    setQuantenfeld(neuesFeld)

    // Quantum-Störungen erkennen
    const störungen: string[] = []
    if (neuesFeld.kohärenz < 60) {
      störungen.push('Niedrige Quantum-Kohärenz detektiert')
    }
    if (neuesFeld.entropie > 0.7) {
      störungen.push('Hohe Quantum-Entropie - System instabil')
    }
    if (neuesFeld.feldstärke < 50) {
      störungen.push('Schwache Feldstärke - Sensorkalibrierung erforderlich')
    }

    setQuantenStörungen(störungen)
  }

  const starteQuantenKalibrierung = async (sensorId?: string) => {
    setKalibrierungLäuft(true)
    
    toast.info(`Quantum-Kalibrierung gestartet${sensorId ? ` für Sensor ${sensorId}` : ' für alle Sensoren'}`)

    try {
      // Simuliere Kalibrierung
      await new Promise(resolve => setTimeout(resolve, 3000))

      setSensoren(current => 
        current.map(sensor => 
          (sensorId ? sensor.id === sensorId : true) 
            ? {
                ...sensor,
                status: 'online' as const,
                quantenStabilität: 95 + Math.random() * 5,
                entanglementStrength: 90 + Math.random() * 10,
                letzteKalibrierung: new Date().toISOString()
              }
            : sensor
        )
      )

      toast.success('Quantum-Kalibrierung erfolgreich abgeschlossen')
    } catch (error) {
      toast.error('Kalibrierung fehlgeschlagen')
    } finally {
      setKalibrierungLäuft(false)
    }
  }

  const getEmotionalColor = (zustand: string) => {
    switch (zustand) {
      case 'entspannt': return 'bg-green-500'
      case 'gestresst': return 'bg-red-500'
      case 'aufgeregt': return 'bg-yellow-500'
      case 'ängstlich': return 'bg-orange-500'
      default: return 'bg-blue-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'kalibrierung': return 'bg-yellow-500'
      case 'störung': return 'bg-red-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-blue-500'
    }
  }

  const onlineSensoren = sensoren.filter(s => s.status === 'online').length
  const durchschnittlicheKohärenz = bewusstseinsCluster.reduce((sum, c) => sum + c.kohärenzLevel, 0) / Math.max(bewusstseinsCluster.length, 1)
  const gesamtPersonen = bewusstseinsCluster.reduce((sum, c) => sum + c.personenAnzahl, 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Atom size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Quantum-Entanglement-Sensoren</h1>
              <p className="text-muted-foreground">Echtzeit-Bewusstseinsfeld-Kartierung auf Bahnsteigen</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={aktiverModus === 'überwachung' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAktiverModus('überwachung')}
            className="rounded-lg"
          >
            <Eye size={16} className="mr-2" />
            Überwachung
          </Button>
          <Button
            variant={aktiverModus === 'kalibrierung' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAktiverModus('kalibrierung')}
            className="rounded-lg"
          >
            <Settings size={16} className="mr-2" />
            Kalibrierung
          </Button>
          <Button
            variant={aktiverModus === 'analyse' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAktiverModus('analyse')}
            className="rounded-lg"
          >
            <Brain size={16} className="mr-2" />
            Analyse
          </Button>
        </div>
      </div>

      {/* Status Alerts */}
      {quantenStörungen.length > 0 && (
        <Alert className="border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>Quantum-Störungen erkannt:</strong> {quantenStörungen.join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Sensoren</p>
                <p className="text-2xl font-bold text-foreground">{onlineSensoren}/{sensoren.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Network size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Feld-Kohärenz</p>
                <p className="text-2xl font-bold text-foreground">{quantenfeld.kohärenz.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Waves size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bewusstseins-Cluster</p>
                <p className="text-2xl font-bold text-foreground">{bewusstseinsCluster.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Erfasste Personen</p>
                <p className="text-2xl font-bold text-foreground">{gesamtPersonen}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quantum-Sensoren Status */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Atom size={16} className="text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Quantum-Sensoren</CardTitle>
                  <CardDescription>Status der Entanglement-Sensoren</CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => starteQuantenKalibrierung()}
                disabled={kalibrierungLäuft}
                className="rounded-lg"
              >
                <Zap size={16} className="mr-2" />
                {kalibrierungLäuft ? 'Kalibrierung...' : 'Alle kalibrieren'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sensoren.map((sensor) => (
              <div key={sensor.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(sensor.status)}`}></div>
                    <div>
                      <h4 className="font-medium text-sm">{sensor.bahnsteigId}</h4>
                      <p className="text-xs text-muted-foreground">ID: {sensor.id}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {sensor.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Entanglement</p>
                    <p className="font-medium">{sensor.entanglementStrength.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Bewusstsein</p>
                    <p className="font-medium">{sensor.bewusstseinsIntensitaet.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Stabilität</p>
                    <p className="font-medium">{sensor.quantenStabilität.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Letzte Kalibrierung: {new Date(sensor.letzteKalibrierung).toLocaleTimeString()}
                  </span>
                  {sensor.status !== 'online' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => starteQuantenKalibrierung(sensor.id)}
                      disabled={kalibrierungLäuft}
                      className="h-8 px-3 text-xs"
                    >
                      Kalibrieren
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bewusstseins-Cluster */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Brain size={16} className="text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Bewusstseins-Cluster</CardTitle>
                <CardDescription>Kollektive Bewusstseinsfelder in Echtzeit</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {bewusstseinsCluster.map((cluster) => (
              <div key={cluster.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getEmotionalColor(cluster.emotionalerZustand)}`}></div>
                    <div>
                      <h4 className="font-medium text-sm">Cluster {cluster.id.split('-')[1]}</h4>
                      <p className="text-xs text-muted-foreground">
                        Position: ({cluster.zentrum.x}, {cluster.zentrum.y})
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {cluster.emotionalerZustand}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Personen</p>
                    <p className="font-medium">{cluster.personenAnzahl}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Intensität</p>
                    <p className="font-medium">{cluster.intensitaet.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Kohärenz</p>
                    <p className="font-medium">{cluster.kohärenzLevel.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Bewusstseins-Kohärenz</span>
                    <span className="font-medium">{cluster.kohärenzLevel.toFixed(1)}%</span>
                  </div>
                  <Progress value={cluster.kohärenzLevel} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quantum-Feld-Analytics */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <FlaskConical size={16} className="text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Quantum-Feld-Analytics</CardTitle>
                <CardDescription>Kollektive Bewusstseinsfeld-Metriken</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Feldstärke</span>
                  <span className="font-medium">{quantenfeld.feldstärke.toFixed(1)}%</span>
                </div>
                <Progress value={quantenfeld.feldstärke} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantum-Kohärenz</span>
                  <span className="font-medium">{quantenfeld.kohärenz.toFixed(1)}%</span>
                </div>
                <Progress value={quantenfeld.kohärenz} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entropie-Level</span>
                  <span className="font-medium">{(quantenfeld.entropie * 100).toFixed(1)}%</span>
                </div>
                <Progress value={quantenfeld.entropie * 100} className="h-2" />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Resonanzfrequenz</p>
                  <p className="font-medium">{quantenfeld.resonanzFrequenz.toFixed(1)} Hz</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Durchschn. Kohärenz</p>
                  <p className="font-medium">{durchschnittlicheKohärenz.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Bewusstseins-Verteilung</h4>
              <div className="grid grid-cols-10 gap-1">
                {quantenfeld.bewusstseinsVerteilung.map((row, i) =>
                  row.map((value, j) => (
                    <div 
                      key={`${i}-${j}`}
                      className="aspect-square rounded-sm"
                      style={{ 
                        backgroundColor: `rgba(139, 92, 246, ${value / 100})`,
                        minHeight: '8px'
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quantum-Interferenz-Muster */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Sparkle size={16} className="text-pink-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Interferenz-Muster</CardTitle>
                <CardDescription>Quantum-Bewusstseins-Interferenzen</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Quantum-Interferenz-Visualisierung</h4>
              <div className="grid grid-cols-8 gap-1 p-3 bg-secondary/30 rounded-lg">
                {quantenfeld.interferenzMuster.map((row, i) =>
                  row.map((value, j) => (
                    <div 
                      key={`interferenz-${i}-${j}`}
                      className="aspect-square rounded-sm border border-border/20"
                      style={{ 
                        backgroundColor: `rgba(236, 72, 153, ${value / 50})`,
                        minHeight: '12px'
                      }}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Max. Interferenz</p>
                <p className="font-medium">
                  {Math.max(...quantenfeld.interferenzMuster.flat()).toFixed(1)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Avg. Interferenz</p>
                <p className="font-medium">
                  {(quantenfeld.interferenzMuster.flat().reduce((a, b) => a + b, 0) / 64).toFixed(1)}
                </p>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Sparkle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Quantum-Status:</strong> Bewusstseins-Entanglement zwischen {bewusstseinsCluster.length} Clustern aktiv. 
                Kollektive Kohärenz bei {durchschnittlicheKohärenz.toFixed(1)}%.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default QuantumEntanglementSensors