import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Cpu, 
  Zap, 
  Atom, 
  Activity, 
  TrendUp, 
  Database, 
  Gauge, 
  Clock,
  Target,
  Layers,
  Brain,
  Lightning,
  Thermometer,
  WaveSquare,
  ChartLine
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface QuantumProcessor {
  id: string
  trainId: string
  carriage: number
  status: 'aktiv' | 'kalibrierung' | 'wartung' | 'offline'
  qubits: number
  coherenceTime: number
  fidelity: number
  temperature: number
  processedOperations: number
  currentTask: string
  energyEfficiency: number
}

interface QuantumTask {
  id: string
  type: 'optimierung' | 'simulation' | 'analyse' | 'vorhersage'
  priority: 'kritisch' | 'hoch' | 'mittel' | 'niedrig'
  description: string
  progress: number
  estimatedCompletion: string
  quantumAdvantage: number
}

export default function EdgeQuantumComputing() {
  const [quantumProcessors, setQuantumProcessors] = useKV<QuantumProcessor[]>('quantum-processors', [
    {
      id: 'qpu-001',
      trainId: 'ICE-4501',
      carriage: 2,
      status: 'aktiv',
      qubits: 127,
      coherenceTime: 1.2,
      fidelity: 99.8,
      temperature: 0.015,
      processedOperations: 45230,
      currentTask: 'Routenoptimierung',
      energyEfficiency: 94.5
    },
    {
      id: 'qpu-002',
      trainId: 'ICE-3201',
      carriage: 1,
      status: 'aktiv',
      qubits: 433,
      coherenceTime: 2.1,
      fidelity: 99.9,
      temperature: 0.012,
      processedOperations: 78940,
      currentTask: 'Fahrgast-Flow-Simulation',
      energyEfficiency: 96.2
    },
    {
      id: 'qpu-003',
      trainId: 'ICE-2801',
      carriage: 3,
      status: 'kalibrierung',
      qubits: 1121,
      coherenceTime: 3.8,
      fidelity: 99.95,
      temperature: 0.008,
      processedOperations: 125600,
      currentTask: 'Quantenfehlerkorrektur',
      energyEfficiency: 98.1
    }
  ])

  const [quantumTasks, setQuantumTasks] = useKV<QuantumTask[]>('quantum-tasks', [
    {
      id: 'qt-001',
      type: 'optimierung',
      priority: 'kritisch',
      description: 'Echtzeit-Fahrplanoptimierung für 347 Züge',
      progress: 78,
      estimatedCompletion: '00:02:15',
      quantumAdvantage: 15.6
    },
    {
      id: 'qt-002',
      type: 'simulation',
      priority: 'hoch',
      description: 'Monte-Carlo-Simulation für Wettereinflussprognose',
      progress: 45,
      estimatedCompletion: '00:05:42',
      quantumAdvantage: 8.3
    },
    {
      id: 'qt-003',
      type: 'analyse',
      priority: 'mittel',
      description: 'Quantenalgorithmus für Anomalieerkennung',
      progress: 92,
      estimatedCompletion: '00:00:33',
      quantumAdvantage: 22.1
    }
  ])

  const [systemMetrics, setSystemMetrics] = useKV('quantum-system-metrics', {
    totalQubits: 1681,
    activeProcessors: 3,
    quantumAdvantageAvg: 15.3,
    uptime: 99.7,
    totalOperationsToday: 249770,
    energySaved: 47.2
  })

  const [selectedProcessor, setSelectedProcessor] = useState<string>('qpu-001')

  useEffect(() => {
    const interval = setInterval(() => {
      // Simuliere Echtzeit-Updates der Quantenprozessoren
      setQuantumProcessors(prev => prev.map(processor => ({
        ...processor,
        processedOperations: processor.processedOperations + Math.floor(Math.random() * 50),
        fidelity: Math.min(99.99, processor.fidelity + (Math.random() - 0.5) * 0.1),
        coherenceTime: Math.max(0.5, processor.coherenceTime + (Math.random() - 0.5) * 0.2),
        temperature: Math.max(0.005, processor.temperature + (Math.random() - 0.5) * 0.003)
      })))

      // Update Task-Progress
      setQuantumTasks(prev => prev.map(task => ({
        ...task,
        progress: Math.min(100, task.progress + Math.floor(Math.random() * 3))
      })))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleQuantumCalibration = (processorId: string) => {
    setQuantumProcessors(prev => prev.map(p => 
      p.id === processorId 
        ? { ...p, status: 'kalibrierung', fidelity: 99.99, coherenceTime: p.coherenceTime * 1.1 }
        : p
    ))
    toast.success(`Quantum-Kalibrierung für ${processorId} gestartet`)
  }

  const handleQuantumOptimization = () => {
    const newTask: QuantumTask = {
      id: `qt-${Date.now()}`,
      type: 'optimierung',
      priority: 'hoch',
      description: 'Netzwerk-weite Quantenoptimierung initiiert',
      progress: 0,
      estimatedCompletion: '00:08:30',
      quantumAdvantage: 18.7
    }
    setQuantumTasks(prev => [...prev, newTask])
    toast.success('Quantum-Optimierung gestartet')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktiv': return 'bg-green-500'
      case 'kalibrierung': return 'bg-yellow-500'
      case 'wartung': return 'bg-blue-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'kritisch': return 'destructive'
      case 'hoch': return 'default'
      case 'mittel': return 'secondary'
      case 'niedrig': return 'outline'
      default: return 'outline'
    }
  }

  const currentProcessor = quantumProcessors.find(p => p.id === selectedProcessor)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Atom size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edge-Quantum-Computing</h1>
            <p className="text-muted-foreground">Mini-Quantenprozessoren in Zügen für Ultra-Performance</p>
          </div>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gesamt-Qubits</p>
                <p className="text-2xl font-bold text-purple-600">{systemMetrics.totalQubits}</p>
              </div>
              <Cpu size={24} className="text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktive Prozessoren</p>
                <p className="text-2xl font-bold text-blue-600">{systemMetrics.activeProcessors}</p>
              </div>
              <Activity size={24} className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quantum-Vorteil</p>
                <p className="text-2xl font-bold text-green-600">{systemMetrics.quantumAdvantageAvg}x</p>
              </div>
              <Lightning size={24} className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Energie gespart</p>
                <p className="text-2xl font-bold text-orange-600">{systemMetrics.energySaved}%</p>
              </div>
              <Zap size={24} className="text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="processors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="processors">Quantum-Prozessoren</TabsTrigger>
          <TabsTrigger value="tasks">Aktive Tasks</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="controls">Steuerung</TabsTrigger>
        </TabsList>

        <TabsContent value="processors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Processor List */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold">Quantum-Prozessoren</h3>
              {quantumProcessors.map(processor => (
                <Card 
                  key={processor.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedProcessor === processor.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedProcessor(processor.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{processor.id}</div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(processor.status)}`}></div>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Zug: {processor.trainId}</div>
                      <div>Wagen: {processor.carriage}</div>
                      <div>{processor.qubits} Qubits</div>
                      <Badge variant="outline" className="text-xs">
                        {processor.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Processor Details */}
            {currentProcessor && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu size={20} />
                      {currentProcessor.id} - Details
                    </CardTitle>
                    <CardDescription>
                      Zug {currentProcessor.trainId}, Wagen {currentProcessor.carriage}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status und Metriken */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Target size={16} className="text-blue-500" />
                          <span className="text-sm font-medium">Fidelity</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {currentProcessor.fidelity.toFixed(2)}%
                        </div>
                        <Progress value={currentProcessor.fidelity} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-green-500" />
                          <span className="text-sm font-medium">Kohärenz</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {currentProcessor.coherenceTime.toFixed(1)}μs
                        </div>
                        <Progress value={(currentProcessor.coherenceTime / 5) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Thermometer size={16} className="text-purple-500" />
                          <span className="text-sm font-medium">Temperatur</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {(currentProcessor.temperature * 1000).toFixed(0)}mK
                        </div>
                        <Progress value={100 - (currentProcessor.temperature * 5000)} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap size={16} className="text-orange-500" />
                          <span className="text-sm font-medium">Effizienz</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                          {currentProcessor.energyEfficiency.toFixed(1)}%
                        </div>
                        <Progress value={currentProcessor.energyEfficiency} className="h-2" />
                      </div>
                    </div>

                    {/* Aktuelle Aufgabe */}
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain size={16} className="text-primary" />
                        <span className="font-medium">Aktuelle Aufgabe</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {currentProcessor.currentTask}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Operationen heute: {currentProcessor.processedOperations.toLocaleString()}</span>
                        <Badge variant="outline">{currentProcessor.qubits} Qubits</Badge>
                      </div>
                    </div>

                    {/* Steuerung */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleQuantumCalibration(currentProcessor.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        <WaveSquare size={16} className="mr-2" />
                        Kalibrierung
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1"
                      >
                        <Gauge size={16} className="mr-2" />
                        Diagnostik
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Aktive Quantum-Tasks</h3>
            <Button onClick={handleQuantumOptimization}>
              <Lightning size={16} className="mr-2" />
              Neue Optimierung
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quantumTasks.map(task => (
              <Card key={task.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{task.id}</CardTitle>
                    <Badge variant={getPriorityColor(task.priority) as any}>
                      {task.priority}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fortschritt</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Verbleibend</div>
                      <div className="font-medium">{task.estimatedCompletion}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Q-Vorteil</div>
                      <div className="font-medium text-green-600">{task.quantumAdvantage}x</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full ${
                      task.type === 'optimierung' ? 'bg-blue-500' :
                      task.type === 'simulation' ? 'bg-green-500' :
                      task.type === 'analyse' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <span className="capitalize">{task.type}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quantum-Performance-Metriken</CardTitle>
              <CardDescription>
                Echtzeit-Überwachung der Quantenprozessor-Leistung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">System-Uptime</h4>
                  <div className="text-3xl font-bold text-green-600">
                    {systemMetrics.uptime}%
                  </div>
                  <Progress value={systemMetrics.uptime} className="h-3" />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Operationen heute</h4>
                  <div className="text-3xl font-bold text-blue-600">
                    {systemMetrics.totalOperationsToday.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    +15% vs. gestern
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Durchschnittlicher Q-Vorteil</h4>
                  <div className="text-3xl font-bold text-purple-600">
                    {systemMetrics.quantumAdvantageAvg}x
                  </div>
                  <div className="text-sm text-green-600">
                    +2.3x vs. klassisch
                  </div>
                </div>
              </div>

              <Alert>
                <ChartLine size={16} />
                <AlertDescription>
                  Quantum-Computing reduziert Rechenzeit für komplexe Optimierungen um durchschnittlich 
                  {systemMetrics.quantumAdvantageAvg}x und spart {systemMetrics.energySaved}% Energie.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System-Steuerung</CardTitle>
                <CardDescription>
                  Zentrale Kontrolle aller Quantum-Prozessoren
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={handleQuantumOptimization}>
                  <Lightning size={16} className="mr-2" />
                  Globale Quantum-Optimierung
                </Button>
                <Button variant="outline" className="w-full">
                  <WaveSquare size={16} className="mr-2" />
                  Alle QPUs kalibrieren
                </Button>
                <Button variant="outline" className="w-full">
                  <Gauge size={16} className="mr-2" />
                  System-Diagnostik
                </Button>
                <Button variant="destructive" className="w-full">
                  <Database size={16} className="mr-2" />
                  Notfall-Herunterfahren
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quantum-Algorithmen</CardTitle>
                <CardDescription>
                  Verfügbare Quantum-Algorithmen für Bahnoptimierung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'QAOA Routing', description: 'Optimale Routenfindung', complexity: 'O(log n)' },
                  { name: 'Grover Search', description: 'Anomalie-Suche', complexity: 'O(√n)' },
                  { name: 'VQE Scheduling', description: 'Fahrplanoptimierung', complexity: 'O(n²)' },
                  { name: 'Quantum SVM', description: 'Mustererkennung', complexity: 'O(log mn)' }
                ].map((algo, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <div className="font-medium">{algo.name}</div>
                      <div className="text-sm text-muted-foreground">{algo.description}</div>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {algo.complexity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}