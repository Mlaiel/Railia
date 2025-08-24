/**
 * @fileoverview Brain-Computer-Interfaces für direkte Kommunikation mit Zugführern
 * @author SmartRail-AI System
 * @version 2.0.0
 * 
 * Neuronale Schnittstellen für direkte Gedankenkommunikation zwischen 
 * Zugführern und SmartRail-AI System für ultra-schnelle Reaktionszeiten
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
  Brain, 
  Lightning, 
  Activity, 
  User, 
  Pulse,
  Target,
  Waves,
  Eye,
  Heart,
  Clock,
  AlertTriangle,
  CheckCircle,
  Radio,
  Monitor,
  Settings,
  Users,
  Graph,
  Database,
  Warning
} from '@phosphor-icons/react'

interface BCIInterface {
  id: string
  trainOperator: {
    name: string
    id: string
    experience: number
    certificationLevel: 'basic' | 'advanced' | 'expert'
    mentalState: 'focused' | 'alert' | 'tired' | 'stressed' | 'optimal'
  }
  trainId: string
  status: 'connected' | 'calibrating' | 'active' | 'disconnected' | 'emergency'
  signalQuality: number
  brainwaveData: {
    alpha: number
    beta: number
    theta: number
    delta: number
    gamma: number
  }
  thoughtPatterns: {
    focus: number
    reaction: number
    decision: number
    stress: number
    fatigue: number
  }
  communications: Array<{
    timestamp: string
    type: 'thought' | 'command' | 'alert' | 'response'
    content: string
    confidence: number
    responseTime: number
  }>
  emergencyOverride: boolean
}

interface NeuralCommand {
  id: string
  command: 'brake' | 'accelerate' | 'horn' | 'emergency_stop' | 'door_control' | 'communication'
  confidence: number
  timestamp: string
  processed: boolean
}

const BrainComputerInterface: React.FC = () => {
  const [bciInterfaces, setBCIInterfaces] = useKV<BCIInterface[]>('bci-interfaces', [])
  const [neuralCommands, setNeuralCommands] = useKV<NeuralCommand[]>('neural-commands', [])
  const [systemConfig, setSystemConfig] = useKV('bci-config', {
    minConfidenceThreshold: 85,
    emergencyBypassEnabled: true,
    thoughtToActionDelay: 50, // Millisekunden
    brainwaveCalibration: true,
    mentalStateMonitoring: true
  })

  const [realTimeData, setRealTimeData] = useState({
    connectedOperators: 0,
    avgResponseTime: 0,
    commandsProcessed: 0,
    emergencyOverrides: 0,
    avgMentalState: 0,
    neuralAccuracy: 0
  })

  // Simulation der BCI-Schnittstellen
  useEffect(() => {
    if (bciInterfaces.length === 0) {
      const mockBCIInterfaces: BCIInterface[] = [
        {
          id: 'bci-op-001',
          trainOperator: {
            name: 'Thomas Schmidt',
            id: 'OP-4827',
            experience: 15,
            certificationLevel: 'expert',
            mentalState: 'optimal'
          },
          trainId: 'ICE-401',
          status: 'active',
          signalQuality: 94,
          brainwaveData: {
            alpha: 8.5,
            beta: 15.2,
            theta: 4.8,
            delta: 1.2,
            gamma: 35.7
          },
          thoughtPatterns: {
            focus: 92,
            reaction: 88,
            decision: 85,
            stress: 15,
            fatigue: 12
          },
          communications: [
            {
              timestamp: new Date().toISOString(),
              type: 'thought',
              content: 'Geschwindigkeit reduzieren wegen Baustelle',
              confidence: 94,
              responseTime: 47
            },
            {
              timestamp: new Date(Date.now() - 30000).toISOString(),
              type: 'command',
              content: 'Türen schließen Gleis 3',
              confidence: 89,
              responseTime: 52
            }
          ],
          emergencyOverride: false
        },
        {
          id: 'bci-op-002',
          trainOperator: {
            name: 'Maria Müller',
            id: 'OP-3956',
            experience: 8,
            certificationLevel: 'advanced',
            mentalState: 'focused'
          },
          trainId: 'RE-2847',
          status: 'active',
          signalQuality: 87,
          brainwaveData: {
            alpha: 9.1,
            beta: 14.8,
            theta: 5.2,
            delta: 1.5,
            gamma: 32.4
          },
          thoughtPatterns: {
            focus: 85,
            reaction: 82,
            decision: 78,
            stress: 25,
            fatigue: 18
          },
          communications: [
            {
              timestamp: new Date(Date.now() - 10000).toISOString(),
              type: 'alert',
              content: 'Person am Gleis erkannt',
              confidence: 91,
              responseTime: 38
            }
          ],
          emergencyOverride: false
        },
        {
          id: 'bci-op-003',
          trainOperator: {
            name: 'Andreas Weber',
            id: 'OP-5147',
            experience: 22,
            certificationLevel: 'expert',
            mentalState: 'alert'
          },
          trainId: 'S3-8294',
          status: 'calibrating',
          signalQuality: 76,
          brainwaveData: {
            alpha: 7.8,
            beta: 16.5,
            theta: 4.1,
            delta: 1.8,
            gamma: 38.2
          },
          thoughtPatterns: {
            focus: 78,
            reaction: 85,
            decision: 82,
            stress: 32,
            fatigue: 28
          },
          communications: [],
          emergencyOverride: false
        }
      ]
      setBCIInterfaces(mockBCIInterfaces)
    }

    // Echtzeit-Daten aktualisieren
    const interval = setInterval(() => {
      const connectedOps = bciInterfaces.filter(bci => bci.status === 'active').length
      const avgResponse = bciInterfaces.reduce((sum, bci) => {
        const avgCommTime = bci.communications.reduce((s, c) => s + c.responseTime, 0) / Math.max(bci.communications.length, 1)
        return sum + avgCommTime
      }, 0) / Math.max(bciInterfaces.length, 1)

      const avgMental = bciInterfaces.reduce((sum, bci) => sum + bci.thoughtPatterns.focus, 0) / Math.max(bciInterfaces.length, 1)
      const avgAccuracy = bciInterfaces.reduce((sum, bci) => sum + bci.signalQuality, 0) / Math.max(bciInterfaces.length, 1)

      setRealTimeData(prev => ({
        connectedOperators: connectedOps,
        avgResponseTime: avgResponse,
        commandsProcessed: prev.commandsProcessed + Math.floor(Math.random() * 5),
        emergencyOverrides: bciInterfaces.filter(bci => bci.emergencyOverride).length,
        avgMentalState: avgMental,
        neuralAccuracy: avgAccuracy
      }))

      // Simuliere neue neuronale Kommandos
      if (Math.random() < 0.3) {
        const commands = ['brake', 'accelerate', 'horn', 'door_control', 'communication'] as const
        const newCommand: NeuralCommand = {
          id: `cmd-${Date.now()}`,
          command: commands[Math.floor(Math.random() * commands.length)],
          confidence: 80 + Math.random() * 20,
          timestamp: new Date().toISOString(),
          processed: false
        }
        setNeuralCommands(prev => [newCommand, ...prev.slice(0, 19)]) // Keep last 20 commands
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [bciInterfaces, setBCIInterfaces, setNeuralCommands])

  const calibrateBCI = async (bciId: string) => {
    try {
      setBCIInterfaces(current => 
        current.map(bci => 
          bci.id === bciId 
            ? { ...bci, status: 'calibrating' as const }
            : bci
        )
      )

      toast.info('BCI-Kalibrierung gestartet...', {
        description: 'Neuronale Muster werden analysiert'
      })

      // Simuliere Kalibrierung
      setTimeout(() => {
        setBCIInterfaces(current => 
          current.map(bci => 
            bci.id === bciId 
              ? { 
                  ...bci, 
                  status: 'active' as const,
                  signalQuality: Math.min(100, bci.signalQuality + 10)
                }
              : bci
          )
        )
        toast.success('BCI-Kalibrierung abgeschlossen')
      }, 3000)

    } catch (error) {
      toast.error('Fehler bei der BCI-Kalibrierung')
    }
  }

  const processNeuralCommand = async (commandId: string) => {
    try {
      const command = neuralCommands.find(cmd => cmd.id === commandId)
      if (!command) return

      if (command.confidence < systemConfig.minConfidenceThreshold) {
        toast.warning('Kommando-Konfidenz zu niedrig', {
          description: `${command.confidence}% < ${systemConfig.minConfidenceThreshold}% erforderlich`
        })
        return
      }

      setNeuralCommands(current => 
        current.map(cmd => 
          cmd.id === commandId 
            ? { ...cmd, processed: true }
            : cmd
        )
      )

      toast.success(`Neurales Kommando ausgeführt: ${command.command}`, {
        description: `Konfidenz: ${command.confidence}% | Reaktionszeit: ${systemConfig.thoughtToActionDelay}ms`
      })

    } catch (error) {
      toast.error('Fehler beim Verarbeiten des neuralen Kommandos')
    }
  }

  const activateEmergencyOverride = (bciId: string) => {
    setBCIInterfaces(current => 
      current.map(bci => 
        bci.id === bciId 
          ? { ...bci, emergencyOverride: true }
          : bci
      )
    )

    toast.error('Notfall-Override aktiviert', {
      description: 'Direkte neuronale Kontrolle für Notfallsituationen'
    })
  }

  const getMentalStateColor = (state: string) => {
    switch (state) {
      case 'optimal': return 'text-green-600'
      case 'focused': return 'text-blue-600'
      case 'alert': return 'text-yellow-600'
      case 'tired': return 'text-orange-600'
      case 'stressed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'calibrating': return 'bg-yellow-500'
      case 'emergency': return 'bg-red-500'
      case 'disconnected': return 'bg-gray-400'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Brain size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Brain-Computer-Interface</h1>
            <p className="text-muted-foreground">Direkte neuronale Kommunikation mit Zugführern</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => toast.info('Alle BCI-Systeme werden synchronisiert...')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Lightning size={16} className="mr-2" />
            Sync Alle
          </Button>
          <Button 
            onClick={() => toast.warning('Notfall-Protokoll aktiviert')}
            variant="destructive"
          >
            <AlertTriangle size={16} className="mr-2" />
            Notfall-Override
          </Button>
        </div>
      </div>

      {/* System-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Verbundene Operatoren</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{realTimeData.connectedOperators}</div>
            <p className="text-xs text-muted-foreground">Aktive BCI-Links</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ø Reaktionszeit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{realTimeData.avgResponseTime.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Millisekunden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Kommandos Verarbeitet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{realTimeData.commandsProcessed}</div>
            <p className="text-xs text-muted-foreground">Letzte Stunde</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notfall-Overrides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{realTimeData.emergencyOverrides}</div>
            <p className="text-xs text-muted-foreground">Aktiv</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ø Geisteszustand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{realTimeData.avgMentalState.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Fokus-Level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Neurale Genauigkeit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{realTimeData.neuralAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Signal-Qualität</p>
          </CardContent>
        </Card>
      </div>

      {/* BCI-Interface Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Aktive BCI-Verbindungen
            </CardTitle>
            <CardDescription>Neuronale Schnittstellen der Zugführer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bciInterfaces.map((bci) => (
              <div key={bci.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(bci.status)}`}></div>
                    <div>
                      <h4 className="font-semibold">{bci.trainOperator.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {bci.trainOperator.id} • {bci.trainId} • {bci.trainOperator.experience}J Erfahrung
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={bci.trainOperator.certificationLevel === 'expert' ? "default" : "secondary"}>
                      {bci.trainOperator.certificationLevel}
                    </Badge>
                    <p className={`text-sm font-medium ${getMentalStateColor(bci.trainOperator.mentalState)}`}>
                      {bci.trainOperator.mentalState}
                    </p>
                  </div>
                </div>

                {/* Brainwave-Daten */}
                <div className="grid grid-cols-5 gap-3 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Alpha</p>
                    <p className="font-bold text-blue-600">{bci.brainwaveData.alpha}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Beta</p>
                    <p className="font-bold text-green-600">{bci.brainwaveData.beta}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Theta</p>
                    <p className="font-bold text-purple-600">{bci.brainwaveData.theta}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Delta</p>
                    <p className="font-bold text-red-600">{bci.brainwaveData.delta}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Gamma</p>
                    <p className="font-bold text-orange-600">{bci.brainwaveData.gamma}</p>
                  </div>
                </div>

                {/* Gedankenmuster */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Gedankenmuster-Analyse</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fokus</span>
                        <span>{bci.thoughtPatterns.focus}%</span>
                      </div>
                      <Progress value={bci.thoughtPatterns.focus} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Reaktion</span>
                        <span>{bci.thoughtPatterns.reaction}%</span>
                      </div>
                      <Progress value={bci.thoughtPatterns.reaction} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stress</span>
                        <span>{bci.thoughtPatterns.stress}%</span>
                      </div>
                      <Progress value={bci.thoughtPatterns.stress} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Müdigkeit</span>
                        <span>{bci.thoughtPatterns.fatigue}%</span>
                      </div>
                      <Progress value={bci.thoughtPatterns.fatigue} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Signal-Qualität */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>BCI-Signal-Qualität</span>
                    <span>{bci.signalQuality}%</span>
                  </div>
                  <Progress value={bci.signalQuality} className="h-2" />
                </div>

                {/* Aktionen */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => calibrateBCI(bci.id)}
                    disabled={bci.status === 'calibrating'}
                  >
                    <Target size={14} className="mr-1" />
                    Kalibrieren
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={bci.status !== 'active'}
                  >
                    <Pulse size={14} className="mr-1" />
                    Live-Monitor
                  </Button>
                  {!bci.emergencyOverride && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => activateEmergencyOverride(bci.id)}
                    >
                      <AlertTriangle size={14} className="mr-1" />
                      Override
                    </Button>
                  )}
                </div>

                {/* Letzte Kommunikationen */}
                {bci.communications.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Letzte neuronale Kommunikation</h5>
                    <div className="space-y-1">
                      {bci.communications.slice(0, 2).map((comm, index) => (
                        <div key={index} className="text-sm p-2 bg-secondary/50 rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{comm.type}</span>
                            <Badge variant="outline" className="text-xs">
                              {comm.confidence}% • {comm.responseTime}ms
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1">{comm.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightning size={20} />
              Neuronale Kommandos
            </CardTitle>
            <CardDescription>Echtzeit-Gedankenkommandos der Zugführer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {neuralCommands.slice(0, 10).map((command) => (
              <div key={command.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${command.processed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <h4 className="font-semibold capitalize">{command.command.replace('_', ' ')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(command.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={command.confidence >= systemConfig.minConfidenceThreshold ? "default" : "secondary"}>
                      {command.confidence.toFixed(1)}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {command.processed ? 'Verarbeitet' : 'Wartend'}
                    </p>
                  </div>
                </div>
                
                {!command.processed && command.confidence >= systemConfig.minConfidenceThreshold && (
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      onClick={() => processNeuralCommand(command.id)}
                      className="w-full"
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Kommando Ausführen
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {neuralCommands.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Brain size={48} className="mx-auto mb-4 opacity-50" />
                <p>Keine neuralen Kommandos empfangen</p>
                <p className="text-sm">Warten auf Gedankenübertragung...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System-Konfiguration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            BCI-System Konfiguration
          </CardTitle>
          <CardDescription>Neuronale Schnittstellen-Einstellungen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Min. Konfidenz</h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-purple-600">{systemConfig.minConfidenceThreshold}%</p>
                <p className="text-xs text-muted-foreground">Für Kommando-Ausführung</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Reaktionszeit</h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-blue-600">{systemConfig.thoughtToActionDelay}</p>
                <p className="text-xs text-muted-foreground">Millisekunden Delay</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Notfall-Bypass</h4>
              <Badge variant={systemConfig.emergencyBypassEnabled ? "destructive" : "secondary"}>
                {systemConfig.emergencyBypassEnabled ? 'Aktiviert' : 'Deaktiviert'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Sofortiger neuraler Zugriff
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Brainwave-Kalibrierung</h4>
              <Badge variant={systemConfig.brainwaveCalibration ? "default" : "secondary"}>
                {systemConfig.brainwaveCalibration ? 'Auto' : 'Manuell'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Automatische Anpassung
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Mental-Monitoring</h4>
              <Badge variant={systemConfig.mentalStateMonitoring ? "default" : "secondary"}>
                {systemConfig.mentalStateMonitoring ? 'Aktiv' : 'Inaktiv'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Geisteszustand-Überwachung
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status & Warnungen */}
      {realTimeData.emergencyOverrides > 0 && (
        <Alert variant="destructive">
          <AlertTriangle size={16} />
          <AlertDescription>
            {realTimeData.emergencyOverrides} Notfall-Override{realTimeData.emergencyOverrides !== 1 ? 's' : ''} aktiv. 
            Direkte neuronale Kontrolle für kritische Situationen aktiviert.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default BrainComputerInterface