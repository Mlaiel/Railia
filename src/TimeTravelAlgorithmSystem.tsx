/**
 * @fileoverview Time-Travel-Algorithms: Zeitreise-Simulationen für präkognitive Verspätungsprävention
 * @author SmartRail-AI System
 * @version 2.0.0
 * 
 * Hochentwickelte Temporal-KI für Zeitreise-Simulationen und präkognitive
 * Vorhersagen zur Verhinderung von Verspätungen bevor sie auftreten
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
  Clock, 
  Lightning, 
  Brain, 
  Target, 
  Activity,
  FlowArrow,
  Database,
  Eye,
  Sparkle,
  Graph,
  TrendUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Monitor,
  Pulse,
  Calendar,
  Hourglass,
  Repeat
} from '@phosphor-icons/react'

interface TemporalSimulation {
  id: string
  title: string
  timelineId: string
  simulationType: 'prevention' | 'optimization' | 'prediction' | 'correction' | 'alternative_reality'
  temporalRange: {
    startTime: string
    endTime: string
    iterations: number
  }
  status: 'planning' | 'simulating' | 'analyzing' | 'completed' | 'paradox_detected'
  confidence: number
  quantumStability: number
  outcomes: Array<{
    timeline: string
    probability: number
    impact: 'positive' | 'negative' | 'neutral'
    delayReduction: number // Minuten
    description: string
  }>
  interventions: Array<{
    timestamp: string
    action: string
    temporalCoordinate: string
    success: boolean
  }>
}

interface TemporalAnomaly {
  id: string
  type: 'paradox' | 'causality_loop' | 'timeline_split' | 'quantum_decoherence' | 'butterfly_effect'
  severity: 'minor' | 'moderate' | 'major' | 'catastrophic'
  location: string
  timeCoordinate: string
  description: string
  stabilityImpact: number
  autoCorrection: boolean
  correctionMethod?: string
}

interface PrecognitiveEvent {
  id: string
  predictedEvent: string
  originalTimestamp: string
  preventionWindow: number // Minuten vor Ereignis
  interventionRequired: boolean
  preventionActions: string[]
  confidence: number
  temporalSignature: string
  status: 'predicted' | 'prevented' | 'occurred' | 'timeline_altered'
}

const TimeTravelAlgorithmSystem: React.FC = () => {
  const [temporalSimulations, setTemporalSimulations] = useKV<TemporalSimulation[]>('temporal-simulations', [])
  const [temporalAnomalies, setTemporalAnomalies] = useKV<TemporalAnomaly[]>('temporal-anomalies', [])
  const [precognitiveEvents, setPrecognitiveEvents] = useKV<PrecognitiveEvent[]>('precognitive-events', [])
  const [systemMetrics, setSystemMetrics] = useKV('temporal-metrics', {
    totalTimelines: 0,
    preventedDelays: 0,
    temporalStability: 99.97,
    quantumCoherence: 98.42,
    paradoxesResolved: 0
  })

  const [realTimeData, setRealTimeData] = useState({
    activeSimulations: 0,
    timelineStability: 0,
    preventionSuccess: 0,
    quantumFluctuations: 0,
    paradoxRisk: 0,
    futureAccuracy: 0
  })

  // Simulation der Zeitreise-Algorithmen
  useEffect(() => {
    if (temporalSimulations.length === 0) {
      const mockTemporalSimulations: TemporalSimulation[] = [
        {
          id: 'temp-sim-001',
          title: 'Mega-Verspätungs-Präventions-Simulation',
          timelineId: 'TL-Prime-Alpha',
          simulationType: 'prevention',
          temporalRange: {
            startTime: new Date(Date.now() + 3600000).toISOString(),
            endTime: new Date(Date.now() + 86400000).toISOString(),
            iterations: 10847
          },
          status: 'simulating',
          confidence: 94.7,
          quantumStability: 98.2,
          outcomes: [
            {
              timeline: 'Timeline-A',
              probability: 87.3,
              impact: 'positive',
              delayReduction: 847,
              description: 'Durch präventive Wartung 847 Minuten Verspätung verhindert'
            },
            {
              timeline: 'Timeline-B', 
              probability: 12.7,
              impact: 'negative',
              delayReduction: -234,
              description: 'Intervention verursacht Kaskadeneffekt mit zusätzlichen Verspätungen'
            }
          ],
          interventions: [
            {
              timestamp: new Date(Date.now() + 5400000).toISOString(),
              action: 'Präventive Wartung Weiche 47B',
              temporalCoordinate: 'T+90:00',
              success: true
            },
            {
              timestamp: new Date(Date.now() + 7200000).toISOString(),
              action: 'Umleitung ICE 1247 auf alternative Route',
              temporalCoordinate: 'T+120:00',
              success: true
            }
          ]
        },
        {
          id: 'temp-sim-002',
          title: 'Quantum-Optimierung Netzwerk-Flow',
          timelineId: 'TL-Quantum-Beta',
          simulationType: 'optimization',
          temporalRange: {
            startTime: new Date(Date.now() + 1800000).toISOString(),
            endTime: new Date(Date.now() + 43200000).toISOString(),
            iterations: 156742
          },
          status: 'analyzing',
          confidence: 97.1,
          quantumStability: 95.8,
          outcomes: [
            {
              timeline: 'Optimal-Flow',
              probability: 94.2,
              impact: 'positive',
              delayReduction: 2847,
              description: 'Perfekte Synchronisation aller Züge - 2847 Min Verspätung eliminiert'
            }
          ],
          interventions: []
        },
        {
          id: 'temp-sim-003',
          title: 'Alternative Realität: Streik-Vermeidung',
          timelineId: 'TL-Alt-Gamma',
          simulationType: 'alternative_reality',
          temporalRange: {
            startTime: new Date(Date.now() - 86400000).toISOString(),
            endTime: new Date(Date.now() + 172800000).toISOString(),
            iterations: 42857
          },
          status: 'completed',
          confidence: 89.4,
          quantumStability: 97.6,
          outcomes: [
            {
              timeline: 'No-Strike-Reality',
              probability: 76.8,
              impact: 'positive',
              delayReduction: 15642,
              description: 'Durch präventive Verhandlungen Streik komplett vermieden'
            }
          ],
          interventions: [
            {
              timestamp: new Date(Date.now() - 259200000).toISOString(),
              action: 'Temporal-Nachricht an Gewerkschaftsführung',
              temporalCoordinate: 'T-72:00',
              success: true
            }
          ]
        }
      ]
      setTemporalSimulations(mockTemporalSimulations)

      const mockAnomalies: TemporalAnomaly[] = [
        {
          id: 'anomaly-001',
          type: 'butterfly_effect',
          severity: 'minor',
          location: 'Bahnhof Frankfurt (Main) Hbf',
          timeCoordinate: 'T+47:23',
          description: 'Kleine Änderung in Fahrplan verursacht unerwartete Kaskadeneffekte',
          stabilityImpact: 0.03,
          autoCorrection: true,
          correctionMethod: 'Quantum-Stabilisierung mit minimaler Energiekorrektur'
        },
        {
          id: 'anomaly-002',
          type: 'causality_loop',
          severity: 'moderate',
          location: 'Zeitkorridor Hamburg-Berlin',
          timeCoordinate: 'T+156:42',
          description: 'Präventive Maßnahme verursacht das Problem, das sie verhindern sollte',
          stabilityImpact: 1.47,
          autoCorrection: false,
          correctionMethod: 'Manuelle Temporal-Intervention erforderlich'
        }
      ]
      setTemporalAnomalies(mockAnomalies)

      const mockPrecognitiveEvents: PrecognitiveEvent[] = [
        {
          id: 'precog-001',
          predictedEvent: 'Technischer Defekt ICE 1534 bei km 347.8',
          originalTimestamp: new Date(Date.now() + 14400000).toISOString(),
          preventionWindow: 240,
          interventionRequired: true,
          preventionActions: [
            'Präventive Wartung der betroffenen Komponente',
            'Alternative Zuggarnitur bereithalten',
            'Passagier-Umleitung aktivieren'
          ],
          confidence: 92.7,
          temporalSignature: 'TS-4D7F-92A3',
          status: 'predicted'
        },
        {
          id: 'precog-002',
          predictedEvent: 'Schwerer Sturm blockiert Strecke München-Augsburg',
          originalTimestamp: new Date(Date.now() + 21600000).toISOString(),
          preventionWindow: 360,
          interventionRequired: true,
          preventionActions: [
            'Vorzeitige Streckensperrung',
            'Umleitung aller Züge über alternative Route',
            'Präventive Räumung wetterexponierter Abschnitte'
          ],
          confidence: 87.9,
          temporalSignature: 'TS-9B2E-47C1',
          status: 'prevented'
        }
      ]
      setPrecognitiveEvents(mockPrecognitiveEvents)
    }

    // Echtzeit-Temporal-Metriken aktualisieren
    const interval = setInterval(() => {
      const activeSimulations = temporalSimulations.filter(sim => 
        sim.status === 'simulating' || sim.status === 'analyzing'
      ).length

      const avgStability = temporalSimulations.reduce((sum, sim) => sum + sim.quantumStability, 0) / 
                           Math.max(temporalSimulations.length, 1)

      const preventedEvents = precognitiveEvents.filter(event => event.status === 'prevented').length
      const totalEvents = precognitiveEvents.length

      const paradoxRisk = temporalAnomalies.filter(anomaly => 
        anomaly.type === 'paradox' || anomaly.type === 'causality_loop'
      ).length * 10

      setRealTimeData(prev => ({
        activeSimulations,
        timelineStability: avgStability,
        preventionSuccess: totalEvents > 0 ? (preventedEvents / totalEvents) * 100 : 0,
        quantumFluctuations: 0.1 + Math.random() * 0.3,
        paradoxRisk: Math.min(100, paradoxRisk),
        futureAccuracy: 85 + Math.random() * 15
      }))

      // Simuliere Fortschritt bei aktiven Simulationen
      setTemporalSimulations(currentSims => 
        currentSims.map(sim => {
          if (sim.status === 'simulating') {
            // Zufällige Chance auf Abschluss
            if (Math.random() < 0.1) {
              return { ...sim, status: 'completed' as const }
            }
          }
          return sim
        })
      )

    }, 4000)

    return () => clearInterval(interval)
  }, [temporalSimulations, temporalAnomalies, precognitiveEvents, setTemporalSimulations, setTemporalAnomalies, setPrecognitiveEvents])

  const initiateTemporalIntervention = async (eventId: string) => {
    try {
      const event = precognitiveEvents.find(e => e.id === eventId)
      if (!event) return

      setPrecognitiveEvents(current => 
        current.map(e => 
          e.id === eventId 
            ? { ...e, status: 'timeline_altered' as const }
            : e
        )
      )

      const newSimulation: TemporalSimulation = {
        id: `intervention-${Date.now()}`,
        title: `Temporal-Intervention: ${event.predictedEvent}`,
        timelineId: `TL-Intervention-${eventId}`,
        simulationType: 'prevention',
        temporalRange: {
          startTime: new Date().toISOString(),
          endTime: event.originalTimestamp,
          iterations: Math.floor(Math.random() * 10000) + 1000
        },
        status: 'planning',
        confidence: event.confidence,
        quantumStability: 96 + Math.random() * 4,
        outcomes: [],
        interventions: [{
          timestamp: new Date().toISOString(),
          action: `Präventive Maßnahmen für: ${event.predictedEvent}`,
          temporalCoordinate: 'T-00:00',
          success: false
        }]
      }

      setTemporalSimulations(current => [newSimulation, ...current])

      setTimeout(() => {
        setTemporalSimulations(current => 
          current.map(sim => 
            sim.id === newSimulation.id 
              ? { ...sim, status: 'simulating' as const }
              : sim
          )
        )
        setPrecognitiveEvents(current => 
          current.map(e => 
            e.id === eventId 
              ? { ...e, status: 'prevented' as const }
              : e
          )
        )
      }, 3000)

      toast.success('Temporal-Intervention initiiert', {
        description: `Zeitreise-Algorithmus versucht Ereignis zu verhindern`
      })

    } catch (error) {
      toast.error('Fehler bei der Temporal-Intervention')
    }
  }

  const resolveTemporalAnomaly = async (anomalyId: string) => {
    try {
      const anomaly = temporalAnomalies.find(a => a.id === anomalyId)
      if (!anomaly) return

      toast.info('Temporal-Anomalie wird korrigiert...', {
        description: 'Quantum-Stabilisierung läuft'
      })

      setTimeout(() => {
        setTemporalAnomalies(current => 
          current.filter(a => a.id !== anomalyId)
        )
        toast.success('Temporal-Anomalie erfolgreich korrigiert')
      }, 4000)

    } catch (error) {
      toast.error('Fehler bei der Anomalie-Korrektur')
    }
  }

  const createAlternativeTimeline = async () => {
    try {
      const newTimeline: TemporalSimulation = {
        id: `alt-timeline-${Date.now()}`,
        title: 'Alternative Realität: Optimales Bahnnetz',
        timelineId: `TL-Perfect-${Date.now()}`,
        simulationType: 'alternative_reality',
        temporalRange: {
          startTime: new Date(Date.now() - 86400000).toISOString(),
          endTime: new Date(Date.now() + 604800000).toISOString(),
          iterations: 1000000
        },
        status: 'planning',
        confidence: 95.0,
        quantumStability: 99.0,
        outcomes: [],
        interventions: []
      }

      setTemporalSimulations(current => [newTimeline, ...current])

      setTimeout(() => {
        setTemporalSimulations(current => 
          current.map(sim => 
            sim.id === newTimeline.id 
              ? { ...sim, status: 'simulating' as const }
              : sim
          )
        )
      }, 2000)

      toast.info('Alternative Zeitlinie wird erstellt...', {
        description: 'Berechnung der perfekten Bahn-Realität'
      })

    } catch (error) {
      toast.error('Fehler beim Erstellen der alternativen Zeitlinie')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'simulating': return 'text-blue-600'
      case 'analyzing': return 'text-purple-600'
      case 'planning': return 'text-yellow-600'
      case 'paradox_detected': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'text-green-600'
      case 'moderate': return 'text-yellow-600'
      case 'major': return 'text-orange-600'
      case 'catastrophic': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Clock size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Time-Travel-Algorithms</h1>
            <p className="text-muted-foreground">Zeitreise-Simulationen für präkognitive Verspätungsprävention</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={createAlternativeTimeline}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Sparkle size={16} className="mr-2" />
            Alt. Timeline
          </Button>
          <Button 
            onClick={() => toast.warning('Temporal-Notfall-Protokoll aktiviert')}
            variant="destructive"
          >
            <AlertTriangle size={16} className="mr-2" />
            Temporal-Notfall
          </Button>
        </div>
      </div>

      {/* System-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aktive Simulationen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{realTimeData.activeSimulations}</div>
            <p className="text-xs text-muted-foreground">Zeitlinien parallel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Timeline-Stabilität</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{realTimeData.timelineStability.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Quantum-Kohärenz</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Präventions-Erfolg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{realTimeData.preventionSuccess.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Ereignisse verhindert</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quantum-Fluktuationen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{realTimeData.quantumFluctuations.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Zeitverzerrung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Paradox-Risiko</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{realTimeData.paradoxRisk.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Kausalitäts-Gefahr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Zukunfts-Genauigkeit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{realTimeData.futureAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Vorhersagepräzision</p>
          </CardContent>
        </Card>
      </div>

      {/* Temporal-Simulationen & Präkognitive Ereignisse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Zeitreise-Simulationen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hourglass size={20} />
              Temporal-Simulationen
            </CardTitle>
            <CardDescription>Aktive Zeitreise-Berechnungen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {temporalSimulations.map((simulation) => (
              <div key={simulation.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{simulation.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {simulation.timelineId} • {simulation.simulationType} • 
                      <span className={`ml-1 font-medium ${getStatusColor(simulation.status)}`}>
                        {simulation.status}
                      </span>
                    </p>
                  </div>
                  <Badge variant={simulation.status === 'completed' ? "default" : "secondary"}>
                    {simulation.temporalRange.iterations.toLocaleString()} Iterationen
                  </Badge>
                </div>

                {/* Temporal-Metriken */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Konfidenz</p>
                    <p className="font-bold text-blue-600">{simulation.confidence.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantum-Stabilität</p>
                    <p className="font-bold text-green-600">{simulation.quantumStability.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Zeitbereich */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Temporal-Bereich</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Von</p>
                      <p className="font-mono text-xs">
                        {new Date(simulation.temporalRange.startTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bis</p>
                      <p className="font-mono text-xs">
                        {new Date(simulation.temporalRange.endTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ergebnisse */}
                {simulation.outcomes.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Timeline-Ergebnisse</h5>
                    {simulation.outcomes.slice(0, 2).map((outcome, index) => (
                      <div key={index} className="p-2 bg-secondary/50 rounded text-sm">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${outcome.impact === 'positive' ? 'bg-green-500' : 
                                              outcome.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                            <span className="font-medium">{outcome.timeline}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {outcome.probability.toFixed(1)}%
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{outcome.description}</p>
                        <p className="text-xs font-medium mt-1">
                          Verspätungsreduktion: <span className="text-green-600">{outcome.delayReduction}</span> Min
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interventionen */}
                {simulation.interventions.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Temporal-Interventionen</h5>
                    {simulation.interventions.slice(0, 2).map((intervention, index) => (
                      <div key={index} className="p-2 bg-secondary/30 rounded text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{intervention.action}</span>
                          <Badge variant={intervention.success ? "default" : "destructive"} className="text-xs">
                            {intervention.success ? 'Erfolg' : 'Fehlschlag'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Koordinate: {intervention.temporalCoordinate} | 
                          Zeit: {new Date(intervention.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {simulation.status === 'simulating' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Berechnung läuft...</span>
                      <span>{Math.floor(Math.random() * 100)}%</span>
                    </div>
                    <Progress value={Math.floor(Math.random() * 100)} className="h-1" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Präkognitive Ereignisse */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye size={20} />
                Präkognitive Ereignisse
              </CardTitle>
              <CardDescription>Vorhersagen zukünftiger Probleme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {precognitiveEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{event.predictedEvent}</h4>
                      <p className="text-sm text-muted-foreground">
                        Temporal-Signatur: {event.temporalSignature}
                      </p>
                    </div>
                    <Badge variant={event.status === 'prevented' ? "default" : 
                                   event.status === 'predicted' ? "destructive" : "secondary"}>
                      {event.status === 'predicted' ? 'Vorhersage' :
                       event.status === 'prevented' ? 'Verhindert' :
                       event.status === 'occurred' ? 'Eingetreten' : 'Timeline geändert'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Originalzeit</p>
                      <p className="font-medium">
                        {new Date(event.originalTimestamp).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Präventionsfenster</p>
                      <p className="font-medium">{event.preventionWindow} Min</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Konfidenz</p>
                      <p className="font-bold text-purple-600">{event.confidence.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Intervention</p>
                      <p className="font-medium">{event.interventionRequired ? 'Erforderlich' : 'Optional'}</p>
                    </div>
                  </div>

                  {event.preventionActions.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Präventions-Aktionen</h5>
                      <div className="space-y-1">
                        {event.preventionActions.slice(0, 2).map((action, index) => (
                          <div key={index} className="text-sm p-2 bg-secondary/50 rounded">
                            {action}
                          </div>
                        ))}
                        {event.preventionActions.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{event.preventionActions.length - 2} weitere Aktionen
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {event.status === 'predicted' && event.interventionRequired && (
                    <Button 
                      size="sm" 
                      onClick={() => initiateTemporalIntervention(event.id)}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      <Lightning size={14} className="mr-1" />
                      Temporal-Intervention Starten
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Temporal-Anomalien */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle size={20} />
                Temporal-Anomalien
              </CardTitle>
              <CardDescription>Zeitlinien-Störungen und Paradoxe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {temporalAnomalies.map((anomaly) => (
                <div key={anomaly.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{anomaly.type.replace('_', ' ')}</h4>
                      <p className="text-sm text-muted-foreground">{anomaly.location}</p>
                    </div>
                    <Badge variant={anomaly.severity === 'catastrophic' ? "destructive" : 
                                   anomaly.severity === 'major' ? "default" : "secondary"}>
                      {anomaly.severity}
                    </Badge>
                  </div>

                  <p className="text-sm">{anomaly.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Zeit-Koordinate</p>
                      <p className="font-mono">{anomaly.timeCoordinate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stabilitäts-Impact</p>
                      <p className={`font-semibold ${getSeverityColor(anomaly.severity)}`}>
                        -{anomaly.stabilityImpact.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {anomaly.correctionMethod && (
                    <div className="p-2 bg-secondary/50 rounded text-sm">
                      <p className="font-medium">Korrektur-Methode:</p>
                      <p className="text-muted-foreground">{anomaly.correctionMethod}</p>
                    </div>
                  )}

                  {!anomaly.autoCorrection && (
                    <Button 
                      size="sm" 
                      onClick={() => resolveTemporalAnomaly(anomaly.id)}
                      variant="destructive"
                      className="w-full"
                    >
                      <Repeat size={14} className="mr-1" />
                      Manuelle Korrektur
                    </Button>
                  )}
                </div>
              ))}

              {temporalAnomalies.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Keine Temporal-Anomalien</p>
                  <p className="text-sm">Alle Zeitlinien stabil</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System-Konfiguration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Temporal-System Konfiguration
          </CardTitle>
          <CardDescription>Einstellungen für Zeitreise-Algorithmen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Temporal-Sicherheit</h4>
              <Badge variant="default" className="text-lg px-4 py-2">
                Maximum
              </Badge>
              <p className="text-xs text-muted-foreground">
                Paradox-Verhinderung aktiv
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Quantum-Kohärenz</h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-blue-600">98.42%</p>
                <p className="text-xs text-muted-foreground">Zeitlinien-Stabilität</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Präkognitions-Reichweite</h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-purple-600">7</p>
                <p className="text-xs text-muted-foreground">Tage in die Zukunft</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Temporal-Override</h4>
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Bereit
              </Badge>
              <p className="text-xs text-muted-foreground">
                Notfall-Zeitsprung möglich
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnungen */}
      {realTimeData.paradoxRisk > 50 && (
        <Alert variant="destructive">
          <AlertTriangle size={16} />
          <AlertDescription>
            Hohes Paradox-Risiko erkannt! Temporal-Interventionen können unvorhersehbare 
            Kaskadeneffekte in der Zeitlinie verursachen. Vorsicht geboten.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default TimeTravelAlgorithmSystem