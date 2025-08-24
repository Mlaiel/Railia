import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Atom,
  Lightning,
  Brain,
  Gauge,
  Sparkle,
  Activity,
  Target,
  Network,
  TrendUp,
  Zap,
  Cpu,
  Shield,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw
} from '@phosphor-icons/react'

interface QuantumAlgorithm {
  id: string
  name: string
  type: 'QAOA' | 'VQE' | 'QML' | 'QSVM' | 'QNN'
  description: string
  complexity: 'Niedrig' | 'Mittel' | 'Hoch' | 'Extrem'
  qubits: number
  gates: number
  depth: number
  fidelity: number
  coherenceTime: number
  executionTime: number
  status: 'bereit' | 'läuft' | 'abgeschlossen' | 'fehler'
  result?: any
}

interface QuantumOptimizationProblem {
  id: string
  name: string
  description: string
  variables: number
  constraints: number
  complexity: number
  quantumAdvantage: number
  classicalTime: number
  quantumTime: number
  improvement: number
  status: 'wartend' | 'optimierend' | 'abgeschlossen'
}

interface QuantumState {
  amplitude: number
  phase: number
  probability: number
}

export default function QuantumMachineLearning() {
  const [isRunning, setIsRunning] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('qaoa')
  const [quantumCircuitDepth, setQuantumCircuitDepth] = useState(8)
  const [coherenceTime, setCoherenceTime] = useState(100)

  const [algorithms, setAlgorithms] = useKV<QuantumAlgorithm[]>('quantum-algorithms', [
    {
      id: 'qaoa',
      name: 'Quantum Approximate Optimization Algorithm',
      type: 'QAOA',
      description: 'Optimiert komplexe Zugplanungs-Kombinatorikprobleme',
      complexity: 'Hoch',
      qubits: 16,
      gates: 256,
      depth: 8,
      fidelity: 98.5,
      coherenceTime: 100,
      executionTime: 0.85,
      status: 'bereit'
    },
    {
      id: 'vqe',
      name: 'Variational Quantum Eigensolver',
      type: 'VQE',
      description: 'Findet optimale Energie-Zustände für Netzwerk-Routing',
      complexity: 'Extrem',
      qubits: 20,
      gates: 512,
      depth: 12,
      fidelity: 97.2,
      coherenceTime: 85,
      executionTime: 1.2,
      status: 'läuft'
    },
    {
      id: 'qml',
      name: 'Quantum Machine Learning',
      type: 'QML',
      description: 'Lernt komplexe Muster in Fahrgast-Verhalten',
      complexity: 'Hoch',
      qubits: 12,
      gates: 192,
      depth: 6,
      fidelity: 96.8,
      coherenceTime: 120,
      executionTime: 0.65,
      status: 'abgeschlossen'
    },
    {
      id: 'qsvm',
      name: 'Quantum Support Vector Machine',
      type: 'QSVM',
      description: 'Klassifiziert Verspätungs-Szenarien exponentiell schneller',
      complexity: 'Mittel',
      qubits: 8,
      gates: 128,
      depth: 4,
      fidelity: 99.1,
      coherenceTime: 150,
      executionTime: 0.35,
      status: 'bereit'
    },
    {
      id: 'qnn',
      name: 'Quantum Neural Network',
      type: 'QNN',
      description: 'Neuronales Netz mit Quanten-Verarbeitung für Vorhersagen',
      complexity: 'Extrem',
      qubits: 24,
      gates: 768,
      depth: 16,
      fidelity: 95.5,
      coherenceTime: 75,
      executionTime: 2.1,
      status: 'fehler'
    }
  ])

  const [optimizationProblems, setOptimizationProblems] = useKV<QuantumOptimizationProblem[]>('quantum-problems', [
    {
      id: 'scheduling',
      name: 'Globale Zugplanung',
      description: 'Optimierung des gesamten nationalen Fahrplans',
      variables: 50000,
      constraints: 125000,
      complexity: 95,
      quantumAdvantage: 1000,
      classicalTime: 48,
      quantumTime: 0.048,
      improvement: 99952,
      status: 'abgeschlossen'
    },
    {
      id: 'routing',
      name: 'Dynamisches Routing',
      description: 'Echtzeit-Umleitung bei Störungen',
      variables: 25000,
      constraints: 75000,
      complexity: 88,
      quantumAdvantage: 500,
      classicalTime: 12,
      quantumTime: 0.024,
      improvement: 49976,
      status: 'optimierend'
    },
    {
      id: 'resource',
      name: 'Ressourcen-Allokation',
      description: 'Optimale Verteilung von Zügen und Personal',
      variables: 15000,
      constraints: 45000,
      complexity: 76,
      quantumAdvantage: 250,
      classicalTime: 6,
      quantumTime: 0.024,
      improvement: 24976,
      status: 'wartend'
    }
  ])

  const [quantumMetrics, setQuantumMetrics] = useKV('quantum-metrics', {
    totalQubits: 80,
    activeQubits: 52,
    quantumVolume: 128,
    errorRate: 0.015,
    gateTime: 0.02,
    readoutFidelity: 98.7,
    crossTalk: 0.008,
    thermalPopulation: 0.002
  })

  const [quantumStates, setQuantumStates] = useState<QuantumState[]>([
    { amplitude: 0.707, phase: 0, probability: 0.5 },
    { amplitude: 0.707, phase: Math.PI, probability: 0.5 },
    { amplitude: 0.5, phase: Math.PI/2, probability: 0.25 },
    { amplitude: 0.866, phase: Math.PI/4, probability: 0.75 }
  ])

  // Simulate quantum algorithm execution
  const executeQuantumAlgorithm = async (algorithmId: string) => {
    const algorithm = algorithms.find(a => a.id === algorithmId)
    if (!algorithm) return

    setAlgorithms(prev => prev.map(a => 
      a.id === algorithmId 
        ? { ...a, status: 'läuft' as const }
        : a
    ))

    toast.info(`Quanten-Algorithmus ${algorithm.name} gestartet`, {
      description: `${algorithm.qubits} Qubits, ${algorithm.gates} Gates`
    })

    // Simulate quantum computation with realistic timing
    await new Promise(resolve => setTimeout(resolve, algorithm.executionTime * 1000))

    // Generate quantum results
    const result = {
      convergenceRate: 0.95 + Math.random() * 0.04,
      solutionQuality: 0.92 + Math.random() * 0.07,
      quantumAdvantage: 100 + Math.random() * 900,
      energyLevels: Array.from({ length: 8 }, () => -5 + Math.random() * 10),
      probabilityDistribution: Array.from({ length: 16 }, () => Math.random()).map(v => v / 16)
    }

    setAlgorithms(prev => prev.map(a => 
      a.id === algorithmId 
        ? { ...a, status: 'abgeschlossen' as const, result }
        : a
    ))

    toast.success(`Quanten-Algorithmus abgeschlossen`, {
      description: `Konvergenz: ${(result.convergenceRate * 100).toFixed(1)}%, Vorteil: ${result.quantumAdvantage.toFixed(0)}x`
    })
  }

  // Quantum error correction simulation
  const runErrorCorrection = () => {
    setQuantumMetrics(prev => ({
      ...prev,
      errorRate: Math.max(0.001, prev.errorRate * 0.8),
      readoutFidelity: Math.min(99.9, prev.readoutFidelity + 0.2)
    }))

    toast.success('Quanten-Fehlerkorrektur durchgeführt', {
      description: 'Systemstabilität verbessert'
    })
  }

  // Update quantum states periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumStates(prev => prev.map(state => ({
        ...state,
        phase: (state.phase + 0.1) % (2 * Math.PI),
        amplitude: 0.3 + Math.random() * 0.7,
        probability: Math.pow(0.3 + Math.random() * 0.7, 2)
      })))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Niedrig': return 'bg-green-100 text-green-800'
      case 'Mittel': return 'bg-yellow-100 text-yellow-800'
      case 'Hoch': return 'bg-orange-100 text-orange-800'
      case 'Extrem': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bereit': return 'bg-blue-100 text-blue-800'
      case 'läuft': return 'bg-yellow-100 text-yellow-800'
      case 'abgeschlossen': return 'bg-green-100 text-green-800'
      case 'fehler': return 'bg-red-100 text-red-800'
      case 'optimierend': return 'bg-purple-100 text-purple-800'
      case 'wartend': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
            <Atom size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quantum Machine Learning</h1>
            <p className="text-muted-foreground">Quanten-Algorithmen für komplexeste Optimierungsprobleme</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={runErrorCorrection}
            variant="outline"
            className="gap-2"
          >
            <Shield size={16} />
            Fehlerkorrektur
          </Button>
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
            {quantumMetrics.activeQubits}/{quantumMetrics.totalQubits} Qubits
          </Badge>
        </div>
      </div>

      {/* Quantum System Status */}
      <Alert className="border-purple-200 bg-purple-50">
        <Atom className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          Quanten-System operational • {quantumMetrics.activeQubits} aktive Qubits • 
          Fehlerrate: {(quantumMetrics.errorRate * 100).toFixed(3)}% • 
          Quanten-Volumen: {quantumMetrics.quantumVolume}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="algorithms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="algorithms">Algorithmen</TabsTrigger>
          <TabsTrigger value="optimization">Optimierung</TabsTrigger>
          <TabsTrigger value="quantum-state">Quanten-Zustand</TabsTrigger>
          <TabsTrigger value="metrics">Metriken</TabsTrigger>
        </TabsList>

        {/* Quantum Algorithms */}
        <TabsContent value="algorithms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {algorithms.map((algorithm) => (
              <Card key={algorithm.id} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Brain size={18} className="text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{algorithm.name}</CardTitle>
                        <CardDescription className="text-sm">{algorithm.type}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getComplexityColor(algorithm.complexity)}>
                        {algorithm.complexity}
                      </Badge>
                      <Badge className={getStatusColor(algorithm.status)}>
                        {algorithm.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{algorithm.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Qubits:</span>
                        <span className="font-medium">{algorithm.qubits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gates:</span>
                        <span className="font-medium">{algorithm.gates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiefe:</span>
                        <span className="font-medium">{algorithm.depth}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fidelity:</span>
                        <span className="font-medium text-green-600">{algorithm.fidelity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kohärenz:</span>
                        <span className="font-medium">{algorithm.coherenceTime}μs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Laufzeit:</span>
                        <span className="font-medium">{algorithm.executionTime}s</span>
                      </div>
                    </div>
                  </div>

                  {algorithm.result && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                      <h4 className="font-medium text-green-800">Ergebnis:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Konvergenz: {(algorithm.result.convergenceRate * 100).toFixed(1)}%</div>
                        <div>Qualität: {(algorithm.result.solutionQuality * 100).toFixed(1)}%</div>
                        <div>Vorteil: {algorithm.result.quantumAdvantage.toFixed(0)}x</div>
                        <div>Energie: {algorithm.result.energyLevels[0].toFixed(2)}</div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => executeQuantumAlgorithm(algorithm.id)}
                    disabled={algorithm.status === 'läuft'}
                    className="w-full gap-2"
                    variant={algorithm.status === 'abgeschlossen' ? 'outline' : 'default'}
                  >
                    {algorithm.status === 'läuft' ? (
                      <>
                        <Pause size={16} />
                        Läuft...
                      </>
                    ) : algorithm.status === 'abgeschlossen' ? (
                      <>
                        <RotateCcw size={16} />
                        Erneut ausführen
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Algorithmus starten
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Optimization Problems */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="space-y-4">
            {optimizationProblems.map((problem) => (
              <Card key={problem.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Target size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{problem.name}</h3>
                        <p className="text-sm text-muted-foreground">{problem.description}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(problem.status)}>
                      {problem.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{problem.variables.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Variablen</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{problem.constraints.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Constraints</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{problem.quantumAdvantage}x</div>
                      <div className="text-xs text-muted-foreground">Quanten-Vorteil</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{problem.improvement.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Verbesserung</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Komplexität</span>
                      <span className="text-sm">{problem.complexity}%</span>
                    </div>
                    <Progress value={problem.complexity} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Klassisch:</span>
                        <span className="font-medium">{problem.classicalTime}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantum:</span>
                        <span className="font-medium text-green-600">{problem.quantumTime}h</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quantum State Visualization */}
        <TabsContent value="quantum-state" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkle size={18} />
                  Quanten-Zustände
                </CardTitle>
                <CardDescription>Live-Visualisierung der Quantensystem-Zustände</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quantumStates.map((state, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Zustand |{index}⟩</span>
                      <span className="text-sm text-muted-foreground">
                        P = {state.probability.toFixed(3)}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={state.probability * 100} className="h-3" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          φ = {state.phase.toFixed(2)}π
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Amplitude: {state.amplitude.toFixed(3)}</span>
                      <span>Phase: {(state.phase / Math.PI).toFixed(2)}π</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={18} />
                  Quantum Circuit
                </CardTitle>
                <CardDescription>Aktueller Quanten-Schaltkreis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Circuit Depth</span>
                    <span className="text-sm">{quantumCircuitDepth}</span>
                  </div>
                  <Progress value={(quantumCircuitDepth / 16) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Kohärenzzeit</span>
                    <span className="text-sm">{coherenceTime}μs</span>
                  </div>
                  <Progress value={(coherenceTime / 200) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {quantumMetrics.quantumVolume}
                    </div>
                    <div className="text-xs text-blue-600">Quantum Volume</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {(quantumMetrics.gateTime * 1000).toFixed(1)}ns
                    </div>
                    <div className="text-xs text-purple-600">Gate Time</div>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Quanten-Verschränkung aktiv • {quantumStates.length} verschränkte Zustände
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quantum Metrics */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Cpu size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {quantumMetrics.activeQubits}/{quantumMetrics.totalQubits}
                </div>
                <div className="text-sm text-muted-foreground">Aktive Qubits</div>
                <Progress value={(quantumMetrics.activeQubits / quantumMetrics.totalQubits) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {quantumMetrics.readoutFidelity.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Auslesefidelity</div>
                <Progress value={quantumMetrics.readoutFidelity} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {(quantumMetrics.errorRate * 100).toFixed(3)}%
                </div>
                <div className="text-sm text-muted-foreground">Fehlerrate</div>
                <Progress value={quantumMetrics.errorRate * 6667} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Lightning size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {quantumMetrics.quantumVolume}
                </div>
                <div className="text-sm text-muted-foreground">Quantum Volume</div>
                <Progress value={(quantumMetrics.quantumVolume / 512) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge size={18} />
                Detaillierte Quanten-Metriken
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cross-Talk</span>
                    <span className="text-sm">{(quantumMetrics.crossTalk * 100).toFixed(3)}%</span>
                  </div>
                  <Progress value={quantumMetrics.crossTalk * 12500} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Thermale Population</span>
                    <span className="text-sm">{(quantumMetrics.thermalPopulation * 100).toFixed(3)}%</span>
                  </div>
                  <Progress value={quantumMetrics.thermalPopulation * 50000} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Gate-Zeit</span>
                    <span className="text-sm">{(quantumMetrics.gateTime * 1000).toFixed(1)}ns</span>
                  </div>
                  <Progress value={(quantumMetrics.gateTime / 0.1) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Quanten-Effizienz</span>
                    <span className="text-sm">
                      {((1 - quantumMetrics.errorRate) * quantumMetrics.readoutFidelity / 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={((1 - quantumMetrics.errorRate) * quantumMetrics.readoutFidelity)} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}