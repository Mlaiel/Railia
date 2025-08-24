import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  Atom, 
  Brain, 
  Zap, 
  Target, 
  Activity, 
  Database,
  ChartLine,
  Sparkle,
  Cube,
  Network,
  FlaskConical,
  Gauge,
  Lightning,
  Spiral,
  Timer,
  Crosshair,
  ShieldCheck,
  AlertTriangle,
  ThermometerSimple
} from '@phosphor-icons/react'

interface QuantumNeuromorphicState {
  quantumQubits: number
  neuromorphicNodes: number
  hybridCouplingStrength: number
  energyEfficiency: number
  processingSpeed: number
  coherenceTime: number
  optimizationAccuracy: number
  isActive: boolean
}

interface OptimizationTask {
  id: string
  name: string
  type: 'network' | 'routing' | 'scheduling' | 'resource'
  complexity: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'queued' | 'processing' | 'completed' | 'error'
  quantumAdvantage: number
  neuromorphicAdvantage: number
  hybridBoost: number
  completionTime: number
  accuracy: number
}

interface QuantumNeuromorphicMetrics {
  quantumCoherence: number
  neuromorphicSpikingRate: number
  hybridSynergy: number
  totalComputationalPower: number
  powerConsumption: number
  temperatureStability: number
  errorCorrectionRate: number
  adaptiveLearningRate: number
}

export default function QuantumNeuromorphicHybridSystem() {
  const [systemState, setSystemState] = useKV<QuantumNeuromorphicState>('quantum-neuromorphic-state', {
    quantumQubits: 512,
    neuromorphicNodes: 1048576,
    hybridCouplingStrength: 0.87,
    energyEfficiency: 94.2,
    processingSpeed: 98.7,
    coherenceTime: 145.3,
    optimizationAccuracy: 99.1,
    isActive: true
  })

  const [optimizationTasks, setOptimizationTasks] = useKV<OptimizationTask[]>('hybrid-optimization-tasks', [])
  const [systemMetrics, setSystemMetrics] = useKV<QuantumNeuromorphicMetrics>('hybrid-system-metrics', {
    quantumCoherence: 96.8,
    neuromorphicSpikingRate: 847.2,
    hybridSynergy: 92.4,
    totalComputationalPower: 99.2,
    powerConsumption: 12.4,
    temperatureStability: 98.9,
    errorCorrectionRate: 99.7,
    adaptiveLearningRate: 87.3
  })

  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [isCalibrating, setIsCalibrating] = useState(false)

  // Simulate real-time quantum-neuromorphic interactions
  useEffect(() => {
    const interval = setInterval(() => {
      if (systemState.isActive) {
        setSystemMetrics(current => ({
          ...current,
          quantumCoherence: Math.max(85, current.quantumCoherence + (Math.random() - 0.5) * 2),
          neuromorphicSpikingRate: Math.max(500, current.neuromorphicSpikingRate + (Math.random() - 0.5) * 50),
          hybridSynergy: Math.max(80, current.hybridSynergy + (Math.random() - 0.5) * 3),
          totalComputationalPower: Math.max(90, current.totalComputationalPower + (Math.random() - 0.5) * 1.5),
          powerConsumption: Math.max(8, current.powerConsumption + (Math.random() - 0.5) * 0.8),
          temperatureStability: Math.max(95, current.temperatureStability + (Math.random() - 0.5) * 1),
          errorCorrectionRate: Math.max(95, current.errorCorrectionRate + (Math.random() - 0.5) * 0.5),
          adaptiveLearningRate: Math.max(75, current.adaptiveLearningRate + (Math.random() - 0.5) * 2)
        }))

        // Simulate task processing
        setOptimizationTasks(current => 
          current.map(task => {
            if (task.status === 'processing') {
              const progress = Math.random() * 0.1
              const newAccuracy = Math.min(100, task.accuracy + progress * 5)
              const newCompletionTime = task.completionTime + progress * 10
              
              if (newAccuracy >= 98 || newCompletionTime >= 100) {
                return {
                  ...task,
                  status: 'completed' as const,
                  accuracy: newAccuracy,
                  completionTime: 100
                }
              }
              
              return {
                ...task,
                accuracy: newAccuracy,
                completionTime: newCompletionTime
              }
            }
            return task
          })
        )
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [systemState.isActive, setSystemMetrics, setOptimizationTasks])

  const initiateHybridCalibration = async () => {
    setIsCalibrating(true)
    toast.info('Quantum-Neuromorphic Kalibrierung gestartet...')

    // Simulate calibration process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      if (i === 50) {
        toast.loading('Quantenkohärenz synchronisiert...', { duration: 1000 })
      } else if (i === 80) {
        toast.loading('Neuromorphe Spikes kalibriert...', { duration: 1000 })
      }
    }

    setSystemState(current => ({
      ...current,
      hybridCouplingStrength: Math.min(0.99, current.hybridCouplingStrength + 0.05),
      energyEfficiency: Math.min(99, current.energyEfficiency + 2),
      optimizationAccuracy: Math.min(99.9, current.optimizationAccuracy + 0.3),
      coherenceTime: Math.min(200, current.coherenceTime + 15)
    }))

    setIsCalibrating(false)
    toast.success('Hybrid-System erfolgreich kalibriert!')
  }

  const createOptimizationTask = (type: OptimizationTask['type'], name: string, complexity: number) => {
    const newTask: OptimizationTask = {
      id: `task-${Date.now()}`,
      name,
      type,
      complexity,
      priority: complexity > 80 ? 'critical' : complexity > 60 ? 'high' : complexity > 40 ? 'medium' : 'low',
      status: 'queued',
      quantumAdvantage: Math.random() * 40 + 30,
      neuromorphicAdvantage: Math.random() * 35 + 25,
      hybridBoost: Math.random() * 25 + 15,
      completionTime: 0,
      accuracy: 0
    }

    setOptimizationTasks(current => [...current, newTask])
    toast.success(`Optimierungsaufgabe "${name}" erstellt`)
  }

  const executeTask = (taskId: string) => {
    setOptimizationTasks(current => 
      current.map(task => 
        task.id === taskId ? { ...task, status: 'processing' as const } : task
      )
    )
    toast.info('Quantum-Neuromorphic Verarbeitung gestartet')
  }

  const toggleSystemPower = () => {
    setSystemState(current => ({
      ...current,
      isActive: !current.isActive
    }))
    
    const newState = !systemState.isActive
    toast[newState ? 'success' : 'warning'](
      `Hybrid-System ${newState ? 'aktiviert' : 'deaktiviert'}`
    )
  }

  const getStatusColor = (status: OptimizationTask['status']) => {
    switch (status) {
      case 'queued': return 'bg-blue-500'
      case 'processing': return 'bg-orange-500 animate-pulse'
      case 'completed': return 'bg-green-500'
      case 'error': return 'bg-red-500'
    }
  }

  const getPriorityColor = (priority: OptimizationTask['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-500'
      case 'medium': return 'bg-blue-500'
      case 'high': return 'bg-orange-500'
      case 'critical': return 'bg-red-500'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Atom size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quantum-Neuromorphic Hybrid Computing</h1>
            <p className="text-muted-foreground">Ultra-komplexe Optimierung durch Quantum-Neuromorphic Fusion</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={initiateHybridCalibration}
            disabled={isCalibrating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isCalibrating ? (
              <>
                <Spiral size={16} className="mr-2 animate-spin" />
                Kalibrierung...
              </>
            ) : (
              <>
                <FlaskConical size={16} className="mr-2" />
                Kalibrieren
              </>
            )}
          </Button>
          
          <Button
            onClick={toggleSystemPower}
            variant={systemState.isActive ? "destructive" : "default"}
          >
            <Zap size={16} className="mr-2" />
            {systemState.isActive ? 'Deaktivieren' : 'Aktivieren'}
          </Button>
        </div>
      </div>

      {/* System Status */}
      {!systemState.isActive && (
        <Alert>
          <AlertTriangle size={16} />
          <AlertDescription>
            Quantum-Neuromorphic Hybrid-System ist deaktiviert. Aktivieren Sie es für Optimierungsaufgaben.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="quantum">Quantum</TabsTrigger>
          <TabsTrigger value="neuromorphic">Neuromorphic</TabsTrigger>
          <TabsTrigger value="optimization">Optimierung</TabsTrigger>
          <TabsTrigger value="metrics">Metriken</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quantum Core */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Atom size={18} className="text-purple-600" />
                  <CardTitle className="text-lg">Quantum Core</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{systemState.quantumQubits}</div>
                  <div className="text-sm text-muted-foreground">Aktive Qubits</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Kohärenz</span>
                    <span className="font-medium">{(systemMetrics?.quantumCoherence || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.quantumCoherence} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Kohärenzzeit</span>
                    <span className="font-medium">{(systemState?.coherenceTime || 0).toFixed(1)}μs</span>
                  </div>
                  <Progress value={(systemState.coherenceTime / 200) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Neuromorphic Core */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Brain size={18} className="text-blue-600" />
                  <CardTitle className="text-lg">Neuromorphic Core</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{systemState.neuromorphicNodes.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Neuronale Knoten</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spike Rate</span>
                    <span className="font-medium">{(systemMetrics?.neuromorphicSpikingRate || 0).toFixed(1)} Hz</span>
                  </div>
                  <Progress value={(systemMetrics.neuromorphicSpikingRate / 1000) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lernrate</span>
                    <span className="font-medium">{(systemMetrics?.adaptiveLearningRate || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.adaptiveLearningRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Hybrid Performance */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Network size={18} className="text-green-600" />
                  <CardTitle className="text-lg">Hybrid Performance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{systemMetrics.hybridSynergy.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Synergie-Index</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Kopplungsstärke</span>
                    <span className="font-medium">{(systemState.hybridCouplingStrength * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={systemState.hybridCouplingStrength * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Energieeffizienz</span>
                    <span className="font-medium">{systemState.energyEfficiency.toFixed(1)}%</span>
                  </div>
                  <Progress value={systemState.energyEfficiency} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Optimization Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-primary" />
                  <CardTitle>Aktive Optimierungsaufgaben</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => createOptimizationTask('network', 'Netzwerk-Routing Ultra-Komplex', 95)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Sparkle size={14} className="mr-1" />
                    Neue Aufgabe
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimizationTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                      <div>
                        <div className="font-medium">{task.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Komplexität: {task.complexity}% • 
                          Q-Vorteil: {task.quantumAdvantage.toFixed(1)}% • 
                          N-Vorteil: {task.neuromorphicAdvantage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                      {task.status === 'queued' && (
                        <Button size="sm" onClick={() => executeTask(task.id)}>
                          <Lightning size={14} className="mr-1" />
                          Ausführen
                        </Button>
                      )}
                      {task.status === 'processing' && (
                        <div className="text-sm text-muted-foreground">
                          {task.completionTime.toFixed(1)}% • {task.accuracy.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quantum" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom size={18} />
                  Quantum Processing Unit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{systemState.quantumQubits}</div>
                    <div className="text-sm text-muted-foreground">Qubits</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{systemMetrics.quantumCoherence.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Kohärenz</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fehlerkorrekturrate</span>
                      <span>{systemMetrics.errorCorrectionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={systemMetrics.errorCorrectionRate} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Temperaturstabilität</span>
                      <span>{systemMetrics.temperatureStability.toFixed(1)}%</span>
                    </div>
                    <Progress value={systemMetrics.temperatureStability} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge size={18} />
                  Quantum Advantage Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {(systemMetrics.quantumCoherence * systemMetrics.errorCorrectionRate / 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Quantum Advantage Index</div>
                </div>
                
                <div className="space-y-2">
                  {[
                    { label: 'Superposition Efficiency', value: 94.7 },
                    { label: 'Entanglement Strength', value: 87.3 },
                    { label: 'Gate Fidelity', value: 99.2 },
                    { label: 'Decoherence Resistance', value: 91.8 }
                  ].map(metric => (
                    <div key={metric.label} className="flex justify-between items-center">
                      <span className="text-sm">{metric.label}</span>
                      <span className="text-sm font-medium">{metric.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="neuromorphic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain size={18} />
                  Neuromorphic Processing Unit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{(systemState.neuromorphicNodes / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-muted-foreground">Neuronen</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{systemMetrics.neuromorphicSpikingRate.toFixed(0)}</div>
                    <div className="text-sm text-muted-foreground">Spikes/s</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Adaptive Lernrate</span>
                      <span>{systemMetrics.adaptiveLearningRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={systemMetrics.adaptiveLearningRate} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Synaptische Plastizität</span>
                      <span>89.4%</span>
                    </div>
                    <Progress value={89.4} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={18} />
                  Neuromorphic Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {((systemMetrics.neuromorphicSpikingRate / 1000) * systemMetrics.adaptiveLearningRate / 100).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Efficiency Score</div>
                </div>
                
                <div className="space-y-2">
                  {[
                    { label: 'Spike Timing Precision', value: 96.1 },
                    { label: 'Pattern Recognition', value: 93.7 },
                    { label: 'Adaptation Speed', value: 88.9 },
                    { label: 'Memory Retention', value: 91.5 }
                  ].map(metric => (
                    <div key={metric.label} className="flex justify-between items-center">
                      <span className="text-sm">{metric.label}</span>
                      <span className="text-sm font-medium">{metric.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { type: 'network', name: 'Netzwerk-Optimierung', complexity: 85 },
              { type: 'routing', name: 'Route-Planung', complexity: 75 },
              { type: 'scheduling', name: 'Zeitplan-Optimierung', complexity: 90 },
              { type: 'resource', name: 'Ressourcen-Allokation', complexity: 80 }
            ].map(preset => (
              <Button
                key={preset.type}
                variant="outline"
                className="h-16 flex flex-col items-center gap-1"
                onClick={() => createOptimizationTask(preset.type as OptimizationTask['type'], preset.name, preset.complexity)}
              >
                <Target size={18} />
                <span className="text-xs">{preset.name}</span>
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Optimierungsaufgaben</CardTitle>
              <CardDescription>
                Quantum-Neuromorphic Hybrid Computing für ultra-komplexe Optimierungsprobleme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationTasks.map(task => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                        <span className="font-medium">{task.name}</span>
                        <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.status === 'queued' && (
                          <Button size="sm" onClick={() => executeTask(task.id)}>
                            <Lightning size={14} className="mr-1" />
                            Starten
                          </Button>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {task.status === 'processing' ? `${task.completionTime.toFixed(0)}%` : task.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantum Advantage:</span>
                        <div className="font-medium text-purple-600">{task.quantumAdvantage.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Neuromorphic Advantage:</span>
                        <div className="font-medium text-blue-600">{task.neuromorphicAdvantage.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hybrid Boost:</span>
                        <div className="font-medium text-green-600">{task.hybridBoost.toFixed(1)}%</div>
                      </div>
                    </div>
                    
                    {task.status === 'processing' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Fortschritt</span>
                          <span>{task.completionTime.toFixed(1)}%</span>
                        </div>
                        <Progress value={task.completionTime} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'Computational Power', 
                value: systemMetrics.totalComputationalPower, 
                icon: ChartLine, 
                color: 'text-green-600',
                suffix: '%'
              },
              { 
                title: 'Power Consumption', 
                value: systemMetrics.powerConsumption, 
                icon: Lightning, 
                color: 'text-orange-600',
                suffix: ' kW'
              },
              { 
                title: 'Hybrid Synergy', 
                value: systemMetrics.hybridSynergy, 
                icon: Network, 
                color: 'text-blue-600',
                suffix: '%'
              },
              { 
                title: 'Error Correction', 
                value: systemMetrics.errorCorrectionRate, 
                icon: ShieldCheck, 
                color: 'text-purple-600',
                suffix: '%'
              },
              { 
                title: 'Temperature Stability', 
                value: systemMetrics.temperatureStability, 
                icon: ThermometerSimple, 
                color: 'text-red-600',
                suffix: '%'
              },
              { 
                title: 'Adaptive Learning', 
                value: systemMetrics.adaptiveLearningRate, 
                icon: Brain, 
                color: 'text-indigo-600',
                suffix: '%'
              }
            ].map(metric => (
              <Card key={metric.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <p className={`text-2xl font-bold ${metric.color}`}>
                        {metric.value.toFixed(1)}{metric.suffix}
                      </p>
                    </div>
                    <metric.icon size={24} className={metric.color} />
                  </div>
                  <div className="mt-4">
                    <Progress value={metric.suffix === ' kW' ? (metric.value / 20) * 100 : metric.value} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}