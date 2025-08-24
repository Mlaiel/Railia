import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  Clock, 
  Brain, 
  Zap, 
  Eye, 
  Sparkle,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  Activity,
  Target,
  Atom,
  Waves
} from '@phosphor-icons/react'

interface TimelineEvent {
  id: string
  timestamp: number
  type: 'verspätung' | 'störung' | 'notfall' | 'wartung'
  location: string
  severity: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
  description: string
  probability: number
  preventable: boolean
  timelineId: string
}

interface ConsciousnessField {
  id: string
  name: string
  coherence: number
  entanglement: number
  temporalRange: number
  activeConnections: number
  quantumState: 'superposition' | 'collapsed' | 'entangled'
}

interface PrecognitivePrediction {
  eventId: string
  timeToEvent: number
  preventionProbability: number
  interventionCost: number
  impactSeverity: number
  recommendedAction: string
  quantumCertainty: number
}

export default function ConsciousnessTimeTravel() {
  const [isActive, setIsActive] = useKV('consciousness-time-travel-active', false)
  const [temporalRange, setTemporalRange] = useKV('temporal-range-hours', 24)
  const [consciousnessFields, setConsciousnessFields] = useKV<ConsciousnessField[]>('consciousness-fields', [])
  const [timelineEvents, setTimelineEvents] = useKV<TimelineEvent[]>('timeline-events', [])
  const [predictions, setPredictions] = useKV<PrecognitivePrediction[]>('precognitive-predictions', [])
  const [quantumCoherence, setQuantumCoherence] = useKV('quantum-coherence', 0)
  const [temporalStability, setTemporalStability] = useKV('temporal-stability', 100)
  const [timeTravelSessions, setTimeTravelSessions] = useKV('time-travel-sessions', 0)

  // Simulate consciousness field generation
  useEffect(() => {
    if (isActive && consciousnessFields.length === 0) {
      const defaultFields: ConsciousnessField[] = [
        {
          id: 'hauptbahnhof-berlin',
          name: 'Hauptbahnhof Berlin',
          coherence: 85,
          entanglement: 72,
          temporalRange: 48,
          activeConnections: 247,
          quantumState: 'entangled'
        },
        {
          id: 'münchen-zentral',
          name: 'München Zentral',
          coherence: 78,
          entanglement: 68,
          temporalRange: 36,
          activeConnections: 189,
          quantumState: 'superposition'
        },
        {
          id: 'hamburg-hbf',
          name: 'Hamburg Hauptbahnhof',
          coherence: 82,
          entanglement: 74,
          temporalRange: 42,
          activeConnections: 203,
          quantumState: 'entangled'
        },
        {
          id: 'köln-hbf',
          name: 'Köln Hauptbahnhof',
          coherence: 76,
          entanglement: 65,
          temporalRange: 30,
          activeConnections: 156,
          quantumState: 'collapsed'
        }
      ]
      setConsciousnessFields(defaultFields)
    }
  }, [isActive, consciousnessFields, setConsciousnessFields])

  // Simulate precognitive event detection
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        // Generate quantum coherence fluctuations
        const newCoherence = Math.max(0, Math.min(100, 
          quantumCoherence + (Math.random() - 0.5) * 10
        ))
        setQuantumCoherence(newCoherence)

        // Generate temporal stability variations
        const newStability = Math.max(60, Math.min(100,
          temporalStability + (Math.random() - 0.5) * 5
        ))
        setTemporalStability(newStability)

        // Generate precognitive predictions
        if (Math.random() < 0.3) {
          const newPrediction: PrecognitivePrediction = {
            eventId: `pred-${Date.now()}`,
            timeToEvent: Math.floor(Math.random() * temporalRange * 60), // minutes
            preventionProbability: Math.floor(Math.random() * 100),
            interventionCost: Math.floor(Math.random() * 50000),
            impactSeverity: Math.floor(Math.random() * 100),
            recommendedAction: [
              'Präventive Gleisinspektion',
              'Bewusstseins-Resonanz erhöhen',
              'Temporale Stabilisierung',
              'Quantenkohärenz-Justierung',
              'Zeitlinien-Korrektur initiieren'
            ][Math.floor(Math.random() * 5)],
            quantumCertainty: Math.floor(Math.random() * 100)
          }

          setPredictions(prev => [...prev.slice(-4), newPrediction])
        }

        // Generate timeline events
        if (Math.random() < 0.2) {
          const newEvent: TimelineEvent = {
            id: `event-${Date.now()}`,
            timestamp: Date.now() + Math.random() * temporalRange * 3600000,
            type: ['verspätung', 'störung', 'notfall', 'wartung'][Math.floor(Math.random() * 4)] as any,
            location: `Strecke ${Math.floor(Math.random() * 999)}`,
            severity: ['niedrig', 'mittel', 'hoch', 'kritisch'][Math.floor(Math.random() * 4)] as any,
            description: [
              'Bewusstseins-Interferenz detektiert',
              'Temporale Anomalie vorhergesagt',
              'Quantenfeld-Instabilität prognostiziert',
              'Zeitlinien-Divergenz erkannt'
            ][Math.floor(Math.random() * 4)],
            probability: Math.floor(Math.random() * 100),
            preventable: Math.random() > 0.3,
            timelineId: `timeline-${Math.floor(Math.random() * 100)}`
          }

          setTimelineEvents(prev => [...prev.slice(-9), newEvent])
        }
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isActive, temporalRange, quantumCoherence, temporalStability, setQuantumCoherence, setTemporalStability, setPredictions, setTimelineEvents])

  const initiateTimeTravel = async () => {
    if (!isActive) {
      setIsActive(true)
      setTimeTravelSessions(prev => prev + 1)
      toast.success('Bewusstseins-Zeitreise aktiviert', {
        description: 'Temporale Quantenfelder werden synchronisiert...'
      })
    } else {
      setIsActive(false)
      toast.info('Zeitreise-Session beendet', {
        description: 'Rückkehr zur linearen Zeitlinie...'
      })
    }
  }

  const performTemporalCorrection = (eventId: string) => {
    setTimelineEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, preventable: true, probability: Math.max(0, event.probability - 30) }
          : event
      )
    )
    
    toast.success('Temporale Korrektur durchgeführt', {
      description: 'Zeitlinie wurde erfolgreich angepasst'
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'niedrig': return 'text-green-600 bg-green-50 border-green-200'
      case 'mittel': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'hoch': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'kritisch': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getQuantumStateColor = (state: string) => {
    switch (state) {
      case 'superposition': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'entangled': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'collapsed': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
            Bewusstseins-Zeitreise
          </h1>
          <p className="text-muted-foreground mt-2">
            Präkognitive Verspätungsprävention durch Quantenbewusstsein
          </p>
        </div>
        
        <Button
          onClick={initiateTimeTravel}
          variant={isActive ? "destructive" : "default"}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          {isActive ? (
            <>
              <Pause size={20} className="mr-2" />
              Zeitreise Stoppen
            </>
          ) : (
            <>
              <Play size={20} className="mr-2" />
              Zeitreise Starten
            </>
          )}
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Brain size={16} />
              Quantenkohärenz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 mb-2">{quantumCoherence.toFixed(1)}%</div>
            <Progress value={quantumCoherence} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-pink-700 flex items-center gap-2">
              <Waves size={16} />
              Temporale Stabilität
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-800 mb-2">{temporalStability.toFixed(1)}%</div>
            <Progress value={temporalStability} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Eye size={16} />
              Zeitreise-Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 mb-2">{timeTravelSessions}</div>
            <div className="text-xs text-blue-600">Gesamt durchgeführt</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Target size={16} />
              Zeitbereich
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 mb-2">{temporalRange}h</div>
            <div className="text-xs text-green-600">Präkognitive Reichweite</div>
          </CardContent>
        </Card>
      </div>

      {/* Consciousness Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Atom size={20} className="text-purple-600" />
            Bewusstseinsfelder
          </CardTitle>
          <CardDescription>
            Quantenverschränkte Bewusstseinsknoten im Bahnnetzwerk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consciousnessFields.map(field => (
              <Card key={field.id} className="border-purple-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{field.name}</CardTitle>
                    <Badge className={getQuantumStateColor(field.quantumState)}>
                      {field.quantumState}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Kohärenz</div>
                      <div className="font-semibold">{field.coherence}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Verschränkung</div>
                      <div className="font-semibold">{field.entanglement}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Zeitbereich</div>
                      <div className="font-semibold">{field.temporalRange}h</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Verbindungen</div>
                      <div className="font-semibold">{field.activeConnections}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Feldstärke</span>
                      <span>{field.coherence}%</span>
                    </div>
                    <Progress value={field.coherence} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Precognitive Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkle size={20} className="text-pink-600" />
            Präkognitive Vorhersagen
          </CardTitle>
          <CardDescription>
            Zukünftige Ereignisse durch Bewusstseins-Zeitreise erkannt
          </CardDescription>
        </CardHeader>
        <CardContent>
          {predictions.length === 0 ? (
            <Alert>
              <Eye className="h-4 w-4" />
              <AlertDescription>
                Keine präkognitiven Vorhersagen verfügbar. Starten Sie eine Zeitreise-Session.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {predictions.map(prediction => (
                <Card key={prediction.eventId} className="border-pink-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Zap size={16} className="text-pink-600" />
                        </div>
                        <div>
                          <div className="font-semibold">Ereignis in {Math.floor(prediction.timeToEvent / 60)}h {prediction.timeToEvent % 60}min</div>
                          <div className="text-sm text-muted-foreground">{prediction.recommendedAction}</div>
                        </div>
                      </div>
                      <Badge className="bg-pink-50 text-pink-700 border-pink-200">
                        {prediction.quantumCertainty}% Gewissheit
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <div className="text-muted-foreground">Präventionswahrscheinlichkeit</div>
                        <div className="font-semibold text-green-600">{prediction.preventionProbability}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Interventionskosten</div>
                        <div className="font-semibold">€{prediction.interventionCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Impact-Schwere</div>
                        <div className="font-semibold text-orange-600">{prediction.impactSeverity}%</div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => performTemporalCorrection(prediction.eventId)}
                      size="sm"
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      <RotateCcw size={16} className="mr-2" />
                      Zeitlinien-Korrektur
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Temporale Ereignisse
          </CardTitle>
          <CardDescription>
            Durch Bewusstseins-Zeitreise identifizierte zukünftige Störungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {timelineEvents.length === 0 ? (
            <Alert>
              <Activity className="h-4 w-4" />
              <AlertDescription>
                Keine temporalen Ereignisse erkannt. Das System überwacht kontinuierlich die Zeitlinien.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {timelineEvents.map(event => (
                <Card key={event.id} className="border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {event.location}
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{event.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                        <div className="text-xs text-blue-600">
                          {event.probability}% Wahrscheinlichkeit
                        </div>
                      </div>
                    </div>
                    
                    {event.preventable && (
                      <Button 
                        onClick={() => performTemporalCorrection(event.id)}
                        size="sm"
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <RotateCcw size={16} className="mr-2" />
                        Präventive Intervention
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isActive && (
        <Alert className="border-purple-200 bg-purple-50">
          <Brain className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-700">
            Das Bewusstseins-Zeitreise-System ist deaktiviert. Aktivieren Sie es, um präkognitive Verspätungsprävention zu ermöglichen.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}