import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  Brain, 
  Users, 
  Activity, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Sparkle,
  Target,
  BarChart,
  Zap,
  Atom,
  Eye,
  Wave
} from '@phosphor-icons/react'

interface BehavioralPattern {
  id: string
  patternType: 'boarding' | 'waiting' | 'movement' | 'gathering'
  confidence: number
  platformArea: string
  timeOfDay: string
  predictedFlow: number
  quantumCoherence: number
  emergentBehavior: string
}

interface ConsciousnessMetric {
  collectiveAwareness: number
  decisionSynchronicity: number
  groupIntelligence: number
  behavioralEntanglement: number
  cognitiveResonance: number
}

interface PlatformZone {
  id: string
  name: string
  crowdDensity: number
  behavioralComplexity: number
  quantumState: 'coherent' | 'superposition' | 'entangled' | 'collapsed'
  predictions: string[]
}

export default function QuantumConsciousnessSimulation() {
  const [simulationActive, setSimulationActive] = useKV('quantum-consciousness-active', false)
  const [behavioralPatterns, setBehavioralPatterns] = useKV<BehavioralPattern[]>('behavioral-patterns', [])
  const [consciousnessMetrics, setConsciousnessMetrics] = useKV<ConsciousnessMetric>('consciousness-metrics', {
    collectiveAwareness: 0,
    decisionSynchronicity: 0,
    groupIntelligence: 0,
    behavioralEntanglement: 0,
    cognitiveResonance: 0
  })
  const [platformZones, setPlatformZones] = useKV<PlatformZone[]>('platform-zones', [])
  const [quantumProcessing, setQuantumProcessing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Simuliere Quantenbewusstsein-Algorithmen für Verhaltensvorhersage
  const runQuantumSimulation = async () => {
    if (quantumProcessing) return
    
    setQuantumProcessing(true)
    toast.info('Starte Quantenbewusstsein-Simulation...', { duration: 2000 })

    try {
      // Simuliere komplexe Quantenberechnungen für Verhaltensanalyse
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generiere neue Verhaltensmuster
      const newPatterns: BehavioralPattern[] = [
        {
          id: `pattern-${Date.now()}-1`,
          patternType: 'boarding',
          confidence: 0.87 + Math.random() * 0.1,
          platformArea: 'Gleis 1 - Vorderbereich',
          timeOfDay: new Date().toLocaleTimeString(),
          predictedFlow: 45 + Math.random() * 30,
          quantumCoherence: 0.73 + Math.random() * 0.2,
          emergentBehavior: 'Kollektive Warteformation mit optimaler Einsteigerstrategie'
        },
        {
          id: `pattern-${Date.now()}-2`,
          patternType: 'waiting',
          confidence: 0.91 + Math.random() * 0.08,
          platformArea: 'Gleis 2 - Mittelbereich',
          timeOfDay: new Date().toLocaleTimeString(),
          predictedFlow: 62 + Math.random() * 25,
          quantumCoherence: 0.89 + Math.random() * 0.1,
          emergentBehavior: 'Spontane Gruppenbildung nach Zielbahnhof-Affinität'
        },
        {
          id: `pattern-${Date.now()}-3`,
          patternType: 'movement',
          confidence: 0.78 + Math.random() * 0.15,
          platformArea: 'Gleis 3 - Hinterbereich',
          timeOfDay: new Date().toLocaleTimeString(),
          predictedFlow: 38 + Math.random() * 20,
          quantumCoherence: 0.65 + Math.random() * 0.25,
          emergentBehavior: 'Wellenförmige Bewegungsmuster bei Zugannäherung'
        }
      ]

      setBehavioralPatterns(prev => [...newPatterns, ...prev].slice(0, 10))

      // Aktualisiere Bewusstseins-Metriken
      setConsciousnessMetrics({
        collectiveAwareness: Math.min(95, consciousnessMetrics.collectiveAwareness + Math.random() * 10),
        decisionSynchronicity: Math.min(92, consciousnessMetrics.decisionSynchronicity + Math.random() * 8),
        groupIntelligence: Math.min(88, consciousnessMetrics.groupIntelligence + Math.random() * 12),
        behavioralEntanglement: Math.min(96, consciousnessMetrics.behavioralEntanglement + Math.random() * 6),
        cognitiveResonance: Math.min(90, consciousnessMetrics.cognitiveResonance + Math.random() * 9)
      })

      // Aktualisiere Bahnsteig-Zonen
      const newZones: PlatformZone[] = [
        {
          id: 'zone-1',
          name: 'Eingangsbereich',
          crowdDensity: 65 + Math.random() * 30,
          behavioralComplexity: 78 + Math.random() * 20,
          quantumState: Math.random() > 0.7 ? 'entangled' : 'coherent',
          predictions: [
            'Erhöhte Aktivität in 5-7 Minuten',
            'Optimale Durchgangszeit: 2.3 Minuten',
            'Kollektive Bewegung Richtung Gleis 2'
          ]
        },
        {
          id: 'zone-2',
          name: 'Wartebereich',
          crowdDensity: 45 + Math.random() * 25,
          behavioralComplexity: 82 + Math.random() * 15,
          quantumState: Math.random() > 0.6 ? 'superposition' : 'coherent',
          predictions: [
            'Gruppenbildung erkannt',
            'Verhaltens-Synchronisation bei 89%',
            'Erwartete Boarding-Effizienz: +23%'
          ]
        },
        {
          id: 'zone-3',
          name: 'Abfahrtsbereich',
          crowdDensity: 72 + Math.random() * 20,
          behavioralComplexity: 91 + Math.random() * 8,
          quantumState: Math.random() > 0.5 ? 'entangled' : 'superposition',
          predictions: [
            'Kritische Dichte erreicht',
            'Emergente Ordnungsstrukturen aktiv',
            'Optimierungspotential: +31%'
          ]
        }
      ]

      setPlatformZones(newZones)
      setLastUpdate(new Date())

      toast.success('Quantenbewusstsein-Simulation abgeschlossen', { 
        duration: 2000,
        description: `${newPatterns.length} neue Verhaltensmuster erkannt`
      })

    } catch (error) {
      toast.error('Fehler bei Quantensimulation')
      console.error('Quantum simulation error:', error)
    } finally {
      setQuantumProcessing(false)
    }
  }

  // Automatische Simulation alle 30 Sekunden wenn aktiv
  useEffect(() => {
    if (!simulationActive) return

    const interval = setInterval(() => {
      runQuantumSimulation()
    }, 30000)

    return () => clearInterval(interval)
  }, [simulationActive])

  const getQuantumStateColor = (state: string) => {
    switch (state) {
      case 'coherent': return 'bg-green-100 text-green-800 border-green-200'
      case 'superposition': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'entangled': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'collapsed': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPatternTypeIcon = (type: string) => {
    switch (type) {
      case 'boarding': return <Users size={16} />
      case 'waiting': return <Clock size={16} />
      case 'movement': return <Activity size={16} />
      case 'gathering': return <MapPin size={16} />
      default: return <Brain size={16} />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Quantenbewusstsein-Simulation</h2>
          </div>
          <p className="text-muted-foreground">
            Vorhersage anonymisierter Verhaltensweisen durch Quantenalgorithmen
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setSimulationActive(!simulationActive)}
            variant={simulationActive ? "destructive" : "default"}
            className="rounded-lg"
          >
            {simulationActive ? (
              <>
                <Wave size={16} className="mr-2" />
                Simulation stoppen
              </>
            ) : (
              <>
                <Sparkle size={16} className="mr-2" />
                Simulation starten
              </>
            )}
          </Button>
          
          <Button
            onClick={runQuantumSimulation}
            disabled={quantumProcessing}
            variant="outline"
            className="rounded-lg"
          >
            {quantumProcessing ? (
              <>
                <Atom size={16} className="mr-2 animate-spin" />
                Verarbeitung...
              </>
            ) : (
              <>
                <Zap size={16} className="mr-2" />
                Jetzt scannen
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {simulationActive && (
        <Alert className="border-purple-200 bg-purple-50">
          <Atom className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            Quantenbewusstsein-Simulation aktiv • Anonymisierte Verhaltensanalyse läuft • 
            Letzte Aktualisierung: {lastUpdate.toLocaleTimeString()}
          </AlertDescription>
        </Alert>
      )}

      {/* Bewusstseins-Metriken */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { name: 'Kollektives Bewusstsein', value: consciousnessMetrics.collectiveAwareness, icon: Brain, color: 'purple' },
          { name: 'Entscheidungs-Synchronität', value: consciousnessMetrics.decisionSynchronicity, icon: Target, color: 'blue' },
          { name: 'Gruppenintelligenz', value: consciousnessMetrics.groupIntelligence, icon: Users, color: 'green' },
          { name: 'Verhaltens-Verschränkung', value: consciousnessMetrics.behavioralEntanglement, icon: Atom, color: 'orange' },
          { name: 'Kognitive Resonanz', value: consciousnessMetrics.cognitiveResonance, icon: Wave, color: 'indigo' }
        ].map((metric) => (
          <Card key={metric.name} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                  <metric.icon size={16} className={`text-${metric.color}-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{metric.name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-foreground">
                    {metric.value.toFixed(1)}%
                  </span>
                  <Badge variant="outline" className={`bg-${metric.color}-50 text-${metric.color}-700 border-${metric.color}-200`}>
                    {metric.value >= 80 ? 'Optimal' : metric.value >= 60 ? 'Gut' : 'Niedrig'}
                  </Badge>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verhaltensmuster */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart size={16} className="text-blue-600" />
              </div>
              <CardTitle>Erkannte Verhaltensmuster</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {behavioralPatterns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain size={48} className="mx-auto mb-3 opacity-50" />
                <p>Keine Verhaltensmuster erkannt</p>
                <p className="text-sm">Starten Sie die Simulation um Daten zu erfassen</p>
              </div>
            ) : (
              behavioralPatterns.slice(0, 5).map((pattern) => (
                <div key={pattern.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPatternTypeIcon(pattern.patternType)}
                      <span className="font-medium capitalize">{pattern.patternType}</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {(pattern.confidence * 100).toFixed(0)}% Sicherheit
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bereich:</span>
                      <span className="font-medium">{pattern.platformArea}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantum-Kohärenz:</span>
                      <span className="font-medium">{(pattern.quantumCoherence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vorhersage-Flow:</span>
                      <span className="font-medium">{pattern.predictedFlow.toFixed(0)} Personen/min</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-foreground font-medium">Emergentes Verhalten:</p>
                    <p className="text-xs text-muted-foreground mt-1">{pattern.emergentBehavior}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Bahnsteig-Zonen */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin size={16} className="text-purple-600" />
              </div>
              <CardTitle>Bahnsteig-Zonen Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformZones.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin size={48} className="mx-auto mb-3 opacity-50" />
                <p>Keine Zonendaten verfügbar</p>
                <p className="text-sm">Simulation wird Zonendaten erfassen</p>
              </div>
            ) : (
              platformZones.map((zone) => (
                <div key={zone.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{zone.name}</h4>
                    <Badge className={`${getQuantumStateColor(zone.quantumState)} capitalize`}>
                      {zone.quantumState}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Menschendichte</span>
                      <div className="flex items-center gap-2">
                        <Progress value={zone.crowdDensity} className="h-1.5 flex-1" />
                        <span className="text-sm font-medium">{zone.crowdDensity.toFixed(0)}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Verhaltens-Komplexität</span>
                      <div className="flex items-center gap-2">
                        <Progress value={zone.behavioralComplexity} className="h-1.5 flex-1" />
                        <span className="text-sm font-medium">{zone.behavioralComplexity.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-foreground">Quantum-Vorhersagen:</h5>
                    <div className="space-y-1">
                      {zone.predictions.map((prediction, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          <span className="text-muted-foreground">{prediction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ethik & Datenschutz Hinweis */}
      <Alert className="border-blue-200 bg-blue-50">
        <Eye className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Datenschutz garantiert:</strong> Alle Analysen erfolgen vollständig anonymisiert. 
          Es werden keine persönlichen Daten erfasst oder gespeichert. 
          Die Quantensimulation arbeitet ausschließlich mit aggregierten, abstrakten Verhaltensmustern.
        </AlertDescription>
      </Alert>
    </div>
  )
}