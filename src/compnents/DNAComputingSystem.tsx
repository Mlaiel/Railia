import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { 
  Dna,
  Atom,
  FlaskConical,
  Microscope,
  Activity,
  TrendUp,
  Warning,
  CheckCircle,
  Circle,
  Brain,
  Target,
  Database,
  Timer,
  Cpu,
  Zap,
  Leaf,
  ArrowRight,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Shuffle,
  BarChart3,
  Cube,
  Molecule,
  GraphicsCard,
  Lightning,
  Gear,
  TrendDown,
  ArrowsClockwise,
  MagnifyingGlass,
  Function,
  ChartLine
} from '@phosphor-icons/react'

interface DNASequence {
  id: string
  sequence: string
  type: 'input' | 'processing' | 'output'
  status: 'active' | 'processing' | 'completed' | 'error'
  timestamp: string
  processingTime: number
  organism: string
  complexity: number
}

interface BiologicalProcessor {
  id: string
  name: string
  organism: string
  type: 'bacteria' | 'yeast' | 'virus' | 'synthetic'
  capacity: number
  currentLoad: number
  status: 'healthy' | 'stressed' | 'optimal' | 'maintenance'
  temperature: number
  ph: number
  nutrients: number
  efficiency: number
  lastUpdate: string
}

interface ComputationTask {
  id: string
  name: string
  description: string
  inputData: string
  expectedOutput: string
  actualOutput?: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedTime: number
  actualTime?: number
  assignedProcessor?: string
  errorRate: number
}

interface ProteinStructure {
  id: string
  name: string
  sequence: string
  foldingType: 'alpha-helix' | 'beta-sheet' | 'random-coil' | 'hybrid'
  complexity: number
  stability: number
  computationalCapacity: number
  status: 'folding' | 'stable' | 'unfolding' | 'error' | 'optimized'
  foldingTime: number
  energyLevel: number
  interactions: number
  createdAt: string
}

interface ProteinFoldingTask {
  id: string
  proteinId: string
  algorithm: 'AlphaFold' | 'DeepFold' | 'BioFold-AI' | 'QuantumFold' | 'HybridFold'
  inputSequence: string
  targetStructure?: string
  currentProgress: number
  estimatedTime: number
  complexity: 'low' | 'medium' | 'high' | 'extreme'
  status: 'initializing' | 'folding' | 'validating' | 'completed' | 'failed'
  energyMinimization: number
  conformationalSampling: number
  createdAt: string
  completedAt?: string
}

interface FoldingMetrics {
  totalProteins: number
  activelyFolding: number
  successfulFolds: number
  averageFoldingTime: number
  averageStability: number
  computationalThroughput: number
  energyEfficiency: number
  algorithmAccuracy: number
}

interface PerformanceMetrics {
  totalProcessors: number
  activeProcessors: number
  averageEfficiency: number
  totalComputations: number
  successRate: number
  energyEfficiency: number
  parallelOperations: number
  biologicalStability: number
}

const DNAComputingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isSystemActive, setIsSystemActive] = useState(false)
  const [selectedProcessor, setSelectedProcessor] = useState<string | null>(null)
  const [selectedProtein, setSelectedProtein] = useState<string | null>(null)
  
  // KV Storage für persistente Daten
  const [processors, setProcessors] = useKV<BiologicalProcessor[]>('dna-processors', [
    {
      id: 'proc-001',
      name: 'E.coli Cluster Alpha',
      organism: 'Escherichia coli',
      type: 'bacteria',
      capacity: 1000,
      currentLoad: 750,
      status: 'optimal',
      temperature: 37.2,
      ph: 7.1,
      nutrients: 85,
      efficiency: 94.3,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'proc-002',
      name: 'Bacillus Subtilis Array',
      organism: 'Bacillus subtilis',
      type: 'bacteria',
      capacity: 850,
      currentLoad: 320,
      status: 'healthy',
      temperature: 30.5,
      ph: 8.2,
      nutrients: 92,
      efficiency: 87.6,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'proc-003',
      name: 'Synthetischer Bio-Chip',
      organism: 'Synthetic DNA',
      type: 'synthetic',
      capacity: 2000,
      currentLoad: 1200,
      status: 'optimal',
      temperature: 25.0,
      ph: 7.0,
      nutrients: 88,
      efficiency: 98.1,
      lastUpdate: new Date().toISOString()
    }
  ])

  const [computationTasks, setComputationTasks] = useKV<ComputationTask[]>('dna-computation-tasks', [
    {
      id: 'task-001',
      name: 'Zugverspätung Optimierung',
      description: 'Berechnung optimaler Routen bei Störungen',
      inputData: 'Route_A->B, Delay_15min, Alternative_Routes[C,D,E]',
      expectedOutput: 'Optimal_Route_C, ETA_Update',
      actualOutput: 'Route_C_confirmed, ETA_12:45',
      status: 'completed',
      priority: 'high',
      estimatedTime: 45,
      actualTime: 38,
      assignedProcessor: 'proc-001',
      errorRate: 0.02
    },
    {
      id: 'task-002',
      name: 'Passagier-Verhalten Analyse',
      description: 'Vorhersage von Passagierströmen',
      inputData: 'Historical_Data, Weather_Conditions, Events',
      expectedOutput: 'Passenger_Flow_Prediction',
      status: 'processing',
      priority: 'medium',
      estimatedTime: 120,
      assignedProcessor: 'proc-002',
      errorRate: 0.01
    }
  ])

  const [sequences, setSequences] = useKV<DNASequence[]>('dna-sequences', [])
  
  // Protein Folding Data
  const [proteinStructures, setProteinStructures] = useKV<ProteinStructure[]>('protein-structures', [
    {
      id: 'protein-001',
      name: 'RailOptim-Enzyme-Alpha',
      sequence: 'MKQLEDKVEELLSKNYHLENEVARLKKLVGER',
      foldingType: 'alpha-helix',
      complexity: 87.5,
      stability: 94.2,
      computationalCapacity: 1500,
      status: 'stable',
      foldingTime: 23.4,
      energyLevel: -125.6,
      interactions: 47,
      createdAt: new Date().toISOString()
    },
    {
      id: 'protein-002',
      name: 'TrafficFlow-Beta-Sheet',
      sequence: 'AIESVLEVGGQTNKAKKILGKVIQRVDGKIRLR',
      foldingType: 'beta-sheet',
      complexity: 92.8,
      stability: 89.7,
      computationalCapacity: 2100,
      status: 'folding',
      foldingTime: 45.2,
      energyLevel: -98.4,
      interactions: 63,
      createdAt: new Date().toISOString()
    },
    {
      id: 'protein-003',
      name: 'DelayPredict-Hybrid-Complex',
      sequence: 'MGSSHHHHHHSSGLVPRGSHMKLVSKGEELFT',
      foldingType: 'hybrid',
      complexity: 96.3,
      stability: 91.5,
      computationalCapacity: 2800,
      status: 'optimized',
      foldingTime: 67.8,
      energyLevel: -156.9,
      interactions: 84,
      createdAt: new Date().toISOString()
    }
  ])

  const [foldingTasks, setFoldingTasks] = useKV<ProteinFoldingTask[]>('folding-tasks', [
    {
      id: 'fold-001',
      proteinId: 'protein-001',
      algorithm: 'AlphaFold',
      inputSequence: 'MKQLEDKVEELLSKNYHLENEVARLKKLVGER',
      targetStructure: 'alpha-helix dominant',
      currentProgress: 100,
      estimatedTime: 25,
      complexity: 'high',
      status: 'completed',
      energyMinimization: 98.5,
      conformationalSampling: 94.2,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'fold-002',
      proteinId: 'protein-002',
      algorithm: 'QuantumFold',
      inputSequence: 'AIESVLEVGGQTNKAKKILGKVIQRVDGKIRLR',
      currentProgress: 73,
      estimatedTime: 50,
      complexity: 'extreme',
      status: 'folding',
      energyMinimization: 87.3,
      conformationalSampling: 79.6,
      createdAt: new Date(Date.now() - 1800000).toISOString()
    }
  ])

  const [foldingMetrics, setFoldingMetrics] = useKV<FoldingMetrics>('folding-metrics', {
    totalProteins: 3,
    activelyFolding: 1,
    successfulFolds: 15,
    averageFoldingTime: 45.5,
    averageStability: 91.8,
    computationalThroughput: 2133,
    energyEfficiency: 94.7,
    algorithmAccuracy: 96.2
  })

  const [performanceMetrics, setPerformanceMetrics] = useKV<PerformanceMetrics>('dna-performance', {
    totalProcessors: 3,
    activeProcessors: 3,
    averageEfficiency: 93.3,
    totalComputations: 1247,
    successRate: 97.8,
    energyEfficiency: 99.2,
    parallelOperations: 8,
    biologicalStability: 96.5
  })

  // Simulation der DNA-Berechnung und Protein-Faltung
  const simulateDNAComputation = () => {
    if (!isSystemActive) return
    
    // Safety check for required data
    if (!processors || !proteinStructures || !foldingTasks || !performanceMetrics || !foldingMetrics) {
      return
    }

    // Simuliere neue DNA-Sequenz-Verarbeitung
    const newSequence: DNASequence = {
      id: `seq-${Date.now()}`,
      sequence: generateRandomDNASequence(),
      type: 'processing',
      status: 'processing',
      timestamp: new Date().toISOString(),
      processingTime: Math.random() * 60 + 10,
      organism: (processors && processors.length > 0) 
        ? processors[Math.floor(Math.random() * processors.length)]?.organism || 'E.coli'
        : 'E.coli',
      complexity: Math.random() * 100
    }

    setSequences(current => [...current, newSequence].slice(-20)) // Nur letzte 20 behalten

    // Simuliere Protein-Faltung Updates
    setProteinStructures(current => current.map(protein => ({
      ...protein,
      stability: Math.max(75, Math.min(100, protein.stability + (Math.random() - 0.5) * 3)),
      energyLevel: protein.energyLevel + (Math.random() - 0.5) * 10,
      interactions: Math.max(20, protein.interactions + Math.floor((Math.random() - 0.5) * 6))
    })))

    // Update Folding Tasks
    setFoldingTasks(current => current.map(task => {
      if (task.status === 'folding') {
        const newProgress = Math.min(100, task.currentProgress + Math.random() * 5)
        return {
          ...task,
          currentProgress: newProgress,
          energyMinimization: Math.max(70, Math.min(100, task.energyMinimization + (Math.random() - 0.5) * 2)),
          conformationalSampling: Math.max(60, Math.min(100, task.conformationalSampling + (Math.random() - 0.5) * 3)),
          status: newProgress >= 100 ? 'completed' : 'folding',
          completedAt: newProgress >= 100 ? new Date().toISOString() : undefined
        }
      }
      return task
    }))

    // Simuliere Prozessor-Updates
    setProcessors(current => current.map(proc => ({
      ...proc,
      currentLoad: Math.max(0, Math.min(proc.capacity, proc.currentLoad + (Math.random() - 0.5) * 100)),
      efficiency: Math.max(70, Math.min(100, proc.efficiency + (Math.random() - 0.5) * 5)),
      temperature: proc.temperature + (Math.random() - 0.5) * 2,
      ph: Math.max(6, Math.min(8.5, proc.ph + (Math.random() - 0.5) * 0.5)),
      nutrients: Math.max(0, Math.min(100, proc.nutrients + (Math.random() - 0.5) * 10)),
      lastUpdate: new Date().toISOString()
    })))

    // Update Performance Metrics
    setPerformanceMetrics(current => ({
      ...current,
      parallelOperations: Math.floor(Math.random() * 12) + 4,
      biologicalStability: Math.max(85, Math.min(100, current.biologicalStability + (Math.random() - 0.5) * 3)),
      totalComputations: current.totalComputations + 1,
      averageEfficiency: processors && processors.length > 0 
        ? processors.reduce((sum, p) => sum + (p.efficiency || 0), 0) / processors.length 
        : 0
    }))

    // Update Folding Metrics
    const activelyFolding = foldingTasks.filter(t => t.status === 'folding').length
    const avgStability = proteinStructures && proteinStructures.length > 0 
      ? proteinStructures.reduce((sum, p) => sum + (p.stability || 0), 0) / proteinStructures.length 
      : 0
    const avgThroughput = sequences && sequences.length > 0 
      ? sequences.slice(-10).reduce((sum, s) => sum + (s.complexity || 0), 0) / Math.min(10, sequences.length)
      : 0
    
    setFoldingMetrics(current => ({
      ...current,
      activelyFolding,
      averageStability: avgStability,
      computationalThroughput: avgThroughput,
      algorithmAccuracy: Math.max(90, Math.min(100, current.algorithmAccuracy + (Math.random() - 0.5) * 2))
    }))
  }

  const generateRandomDNASequence = (): string => {
    const bases = ['A', 'T', 'G', 'C']
    return Array.from({ length: 20 }, () => bases[Math.floor(Math.random() * 4)]).join('')
  }

  const startNewComputation = () => {
    const newTask: ComputationTask = {
      id: `task-${Date.now()}`,
      name: 'Neue Berechnung',
      description: 'Automatisch generierte Aufgabe',
      inputData: 'Sample_Input_' + Math.random().toString(36).substr(2, 9),
      expectedOutput: 'Expected_Result',
      status: 'queued',
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      estimatedTime: Math.floor(Math.random() * 180) + 30,
      errorRate: Math.random() * 0.05
    }

    setComputationTasks(current => [...current, newTask])
    toast.success('Neue DNA-Berechnung gestartet', {
      description: `Aufgabe ${newTask.id} wurde der Warteschlange hinzugefügt`
    })
  }

  const startNewProteinFolding = () => {
    const aminoAcids = ['A', 'R', 'N', 'D', 'C', 'E', 'Q', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V']
    const randomSequence = Array.from({ length: Math.floor(Math.random() * 20) + 15 }, 
      () => aminoAcids[Math.floor(Math.random() * aminoAcids.length)]).join('')

    const algorithms: ProteinFoldingTask['algorithm'][] = ['AlphaFold', 'DeepFold', 'BioFold-AI', 'QuantumFold', 'HybridFold']
    const complexities: ProteinFoldingTask['complexity'][] = ['low', 'medium', 'high', 'extreme']

    const newFoldingTask: ProteinFoldingTask = {
      id: `fold-${Date.now()}`,
      proteinId: `protein-${Date.now()}`,
      algorithm: algorithms[Math.floor(Math.random() * algorithms.length)],
      inputSequence: randomSequence,
      currentProgress: 0,
      estimatedTime: Math.floor(Math.random() * 120) + 30,
      complexity: complexities[Math.floor(Math.random() * complexities.length)],
      status: 'initializing',
      energyMinimization: 0,
      conformationalSampling: 0,
      createdAt: new Date().toISOString()
    }

    // Create corresponding protein structure
    const foldingTypes: ProteinStructure['foldingType'][] = ['alpha-helix', 'beta-sheet', 'random-coil', 'hybrid']
    const newProtein: ProteinStructure = {
      id: newFoldingTask.proteinId,
      name: `Auto-Generated-${Date.now()}`,
      sequence: randomSequence,
      foldingType: foldingTypes[Math.floor(Math.random() * foldingTypes.length)],
      complexity: Math.random() * 30 + 70,
      stability: 0,
      computationalCapacity: Math.floor(Math.random() * 1000) + 1000,
      status: 'folding',
      foldingTime: 0,
      energyLevel: 0,
      interactions: 0,
      createdAt: new Date().toISOString()
    }

    setFoldingTasks(current => [...current, newFoldingTask])
    setProteinStructures(current => [...current, newProtein])
    setFoldingMetrics(current => ({
      ...current,
      totalProteins: current.totalProteins + 1,
      activelyFolding: current.activelyFolding + 1
    }))

    toast.success('Protein-Faltung initiiert', {
      description: `${newFoldingTask.algorithm} Algorithmus für ${randomSequence.slice(0, 8)}... gestartet`
    })
  }

  const optimizeProteinFolding = () => {
    setProteinStructures(current => current.map(protein => ({
      ...protein,
      status: 'optimized' as const,
      stability: Math.min(100, protein.stability + 10),
      energyLevel: protein.energyLevel - 20,
      computationalCapacity: Math.floor(protein.computationalCapacity * 1.2)
    })))

    setFoldingTasks(current => current.map(task => ({
      ...task,
      energyMinimization: Math.min(100, task.energyMinimization + 8),
      conformationalSampling: Math.min(100, task.conformationalSampling + 6)
    })))

    toast.success('Protein-Faltung optimiert', {
      description: 'Alle Proteinstrukturen wurden für maximale Rechenleistung optimiert'
    })
  }

  const optimizeBiologicalConditions = () => {
    setProcessors(current => current.map(proc => ({
      ...proc,
      status: 'optimal' as const,
      temperature: proc.type === 'bacteria' ? 37.0 : 25.0,
      ph: 7.2,
      nutrients: 95,
      efficiency: Math.min(100, proc.efficiency + 5)
    })))

    toast.success('Biologische Bedingungen optimiert', {
      description: 'Alle Prozessoren arbeiten jetzt unter optimalen Bedingungen'
    })
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSystemActive) {
      interval = setInterval(simulateDNAComputation, 3000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSystemActive, processors.length, proteinStructures.length, foldingTasks.length])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': case 'optimized': case 'stable': return <CheckCircle className="text-green-500" size={16} />
      case 'healthy': case 'completed': return <Circle className="text-blue-500" size={16} />
      case 'stressed': case 'folding': case 'processing': return <Warning className="text-yellow-500" size={16} />
      case 'maintenance': case 'error': case 'failed': return <Warning className="text-red-500" size={16} />
      case 'unfolding': return <TrendDown className="text-orange-500" size={16} />
      default: return <Circle className="text-gray-500" size={16} />
    }
  }

  const getProteinStatusColor = (status: ProteinStructure['status']) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800 border-green-200'
      case 'optimized': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'folding': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'unfolding': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getFoldingTypeIcon = (type: ProteinStructure['foldingType']) => {
    switch (type) {
      case 'alpha-helix': return <ArrowsClockwise className="text-blue-600" size={16} />
      case 'beta-sheet': return <Cube className="text-green-600" size={16} />
      case 'random-coil': return <Shuffle className="text-orange-600" size={16} />
      case 'hybrid': return <Molecule className="text-purple-600" size={16} />
      default: return <Circle className="text-gray-600" size={16} />
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50/50 to-green-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Dna size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">DNA-Computing System</h1>
              <p className="text-sm lg:text-base text-gray-600">Biologische Datenverarbeitung mit Protein-Folding-Algorithmen</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setIsSystemActive(!isSystemActive)}
            variant={isSystemActive ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isSystemActive ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
            {isSystemActive ? 'System Pausieren' : 'System Starten'}
          </Button>
          
          <Button 
            onClick={startNewComputation}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Zap size={16} />
            Neue Berechnung
          </Button>

          <Button 
            onClick={startNewProteinFolding}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Molecule size={16} />
            Protein Falten
          </Button>

          <Button 
            onClick={optimizeBiologicalConditions}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Leaf size={16} />
            Bio-Optimierung
          </Button>

          <Button 
            onClick={optimizeProteinFolding}
            variant="outline"
            className="flex items-center gap-2"
          >
            <GraphicsCard size={16} />
            Protein-Optimierung
          </Button>
        </div>
      </div>

      {/* System Status Banner */}
      <Alert className={`border-l-4 ${isSystemActive ? 'border-l-green-500 bg-green-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
        <Activity size={16} />
        <AlertDescription className="flex items-center justify-between">
          <span>
            DNA-Computing System ist <strong>{isSystemActive ? 'AKTIV' : 'PAUSIERT'}</strong> - 
            {performanceMetrics?.activeProcessors || 0} von {performanceMetrics?.totalProcessors || 0} Prozessoren online, 
            {foldingMetrics?.activelyFolding || 0} Proteine aktiv faltend
          </span>
          <div className="flex items-center gap-2">
            <Badge variant={isSystemActive ? "default" : "secondary"}>
              {(performanceMetrics?.averageEfficiency || 0).toFixed(1)}% DNA-Effizienz
            </Badge>
            <Badge variant={isSystemActive ? "default" : "secondary"}>
              {(foldingMetrics?.algorithmAccuracy || 0).toFixed(1)}% Faltungsgenauigkeit
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 px-3 py-2">
            <BarChart3 size={16} />
            <span className="hidden sm:inline">Übersicht</span>
          </TabsTrigger>
          <TabsTrigger value="processors" className="flex items-center gap-2 px-3 py-2">
            <Microscope size={16} />
            <span className="hidden sm:inline">Prozessoren</span>
          </TabsTrigger>
          <TabsTrigger value="proteins" className="flex items-center gap-2 px-3 py-2">
            <Molecule size={16} />
            <span className="hidden sm:inline">Proteine</span>
          </TabsTrigger>
          <TabsTrigger value="computations" className="flex items-center gap-2 px-3 py-2">
            <Cpu size={16} />
            <span className="hidden sm:inline">Berechnungen</span>
          </TabsTrigger>
          <TabsTrigger value="sequences" className="flex items-center gap-2 px-3 py-2">
            <Database size={16} />
            <span className="hidden sm:inline">DNA-Sequenzen</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 px-3 py-2">
            <TrendUp size={16} />
            <span className="hidden sm:inline">Analytik</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Aktive Prozessoren</p>
                    <p className="text-3xl font-bold">{performanceMetrics?.activeProcessors || 0}</p>
                    <p className="text-blue-100 text-xs">von {performanceMetrics?.totalProcessors || 0} verfügbar</p>
                  </div>
                  <Microscope size={32} className="text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Durchschn. Effizienz</p>
                    <p className="text-3xl font-bold">{(performanceMetrics?.averageEfficiency || 0).toFixed(1)}%</p>
                    <p className="text-green-100 text-xs">biologische Leistung</p>
                  </div>
                  <TrendUp size={32} className="text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Berechnungen</p>
                    <p className="text-3xl font-bold">{performanceMetrics?.totalComputations || 0}</p>
                    <p className="text-purple-100 text-xs">{(performanceMetrics?.successRate || 0).toFixed(1)}% Erfolgsrate</p>
                  </div>
                  <Cpu size={32} className="text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Energieeffizienz</p>
                    <p className="text-3xl font-bold">{(performanceMetrics?.energyEfficiency || 0).toFixed(1)}%</p>
                    <p className="text-orange-100 text-xs">vs. konventionelle CPUs</p>
                  </div>
                  <Zap size={32} className="text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Systemgesundheit
                </CardTitle>
                <CardDescription>
                  Überwachung der biologischen Prozessoren
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(processors || []).slice(0, 3).map((processor) => (
                  <div key={processor.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(processor.status)}
                      <div>
                        <p className="font-medium text-sm">{processor.name}</p>
                        <p className="text-xs text-muted-foreground">{processor.organism}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{(processor?.efficiency || 0).toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">
                        {processor?.currentLoad || 0}/{processor?.capacity || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer size={20} />
                  Aktuelle Berechnungen
                </CardTitle>
                <CardDescription>
                  Laufende DNA-Computing Aufgaben
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(computationTasks || []).filter(task => task.status === 'processing' || task.status === 'queued').slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{task.name}</p>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                        {task.priority}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {task.estimatedTime}min geschätzt
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Processors Tab */}
        <TabsContent value="processors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {(processors || []).map((processor) => (
              <Card key={processor.id} className={`cursor-pointer transition-all duration-200 ${selectedProcessor === processor.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`} onClick={() => setSelectedProcessor(processor.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{processor.name}</CardTitle>
                    {getStatusIcon(processor.status)}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <FlaskConical size={14} />
                    {processor.organism} ({processor.type})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Auslastung */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Auslastung</span>
                      <span>{((processor.currentLoad / processor.capacity) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(processor.currentLoad / processor.capacity) * 100} className="h-2" />
                  </div>

                  {/* Effizienz */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Effizienz</span>
                      <span>{processor.efficiency.toFixed(1)}%</span>
                    </div>
                    <Progress value={processor.efficiency} className="h-2" />
                  </div>

                  {/* Biologische Parameter */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Temperatur</p>
                      <p className="font-medium">{processor.temperature.toFixed(1)}°C</p>
                    </div>
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">pH-Wert</p>
                      <p className="font-medium">{processor.ph.toFixed(1)}</p>
                    </div>
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Nährstoffe</p>
                      <p className="font-medium">{processor.nutrients}%</p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    Letztes Update: {new Date(processor.lastUpdate).toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Proteins Tab */}
        <TabsContent value="proteins" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(proteinStructures || []).map((protein) => (
              <Card key={protein.id} className={`cursor-pointer transition-all duration-200 ${selectedProtein === protein.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`} onClick={() => setSelectedProtein(protein.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getFoldingTypeIcon(protein.foldingType)}
                      {protein.name}
                    </CardTitle>
                    <Badge className={getProteinStatusColor(protein.status)}>
                      {protein.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Dna size={14} />
                    {protein.sequence.slice(0, 20)}... ({protein.sequence.length} Aminosäuren)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stabilität */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stabilität</span>
                      <span>{protein.stability.toFixed(1)}%</span>
                    </div>
                    <Progress value={protein.stability} className="h-2" />
                  </div>

                  {/* Rechenkapazität */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rechenkapazität</span>
                      <span>{protein.computationalCapacity.toLocaleString()} Ops/sec</span>
                    </div>
                    <Progress value={(protein.computationalCapacity / 3000) * 100} className="h-2" />
                  </div>

                  {/* Protein Parameter */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Komplexität</p>
                      <p className="font-medium">{protein.complexity.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Energie</p>
                      <p className="font-medium">{protein.energyLevel.toFixed(1)} kJ</p>
                    </div>
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Interaktionen</p>
                      <p className="font-medium">{protein.interactions}</p>
                    </div>
                  </div>

                  {/* Faltungstyp Details */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getFoldingTypeIcon(protein.foldingType)}
                      <span className="text-sm font-medium">{protein.foldingType}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {protein.foldingType === 'alpha-helix' && 'Spiralförmige Struktur für sequentielle Berechnungen'}
                      {protein.foldingType === 'beta-sheet' && 'Schichtstruktur für parallele Datenverarbeitung'}
                      {protein.foldingType === 'random-coil' && 'Flexible Struktur für adaptive Algorithmen'}
                      {protein.foldingType === 'hybrid' && 'Kombinierte Struktur für komplexe Berechnungen'}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    Erstellt: {new Date(protein.createdAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Protein Folding Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Function size={20} />
                Protein-Faltungsaufgaben
              </CardTitle>
              <CardDescription>
                Aktive und abgeschlossene Faltungsalgorithmen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {(foldingTasks || []).map((task) => (
                    <div key={task.id} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={
                            task.status === 'completed' ? 'default' :
                            task.status === 'folding' ? 'secondary' :
                            task.status === 'failed' ? 'destructive' : 'outline'
                          }>
                            {task.status}
                          </Badge>
                          <h4 className="font-medium flex items-center gap-2">
                            <GraphicsCard size={16} />
                            {task.algorithm}
                          </h4>
                        </div>
                        <Badge variant={task.complexity === 'extreme' ? 'destructive' : task.complexity === 'high' ? 'default' : 'secondary'}>
                          {task.complexity}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Input-Sequenz:</p>
                          <p className="font-mono bg-secondary/30 p-2 rounded text-xs break-all">{task.inputSequence}</p>
                        </div>
                        {task.targetStructure && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Zielstruktur:</p>
                            <p className="bg-secondary/30 p-2 rounded text-xs">{task.targetStructure}</p>
                          </div>
                        )}
                      </div>

                      {/* Progress Bars */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Gesamtfortschritt</span>
                            <span>{task.currentProgress.toFixed(1)}%</span>
                          </div>
                          <Progress value={task.currentProgress} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Energieminimierung</span>
                            <span>{task.energyMinimization.toFixed(1)}%</span>
                          </div>
                          <Progress value={task.energyMinimization} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Konformations-Sampling</span>
                            <span>{task.conformationalSampling.toFixed(1)}%</span>
                          </div>
                          <Progress value={task.conformationalSampling} className="h-2" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Geschätzte Zeit: {task.estimatedTime}min
                          {task.completedAt && ` | Abgeschlossen: ${new Date(task.completedAt).toLocaleTimeString()}`}
                        </span>
                        <span>Protein-ID: {task.proteinId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Computations Tab */}
        <TabsContent value="computations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu size={20} />
                DNA-Computing Aufgaben
              </CardTitle>
              <CardDescription>
                Verwaltung und Überwachung biologischer Berechnungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {(computationTasks || []).map((task) => (
                    <div key={task.id} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={
                            task.status === 'completed' ? 'default' :
                            task.status === 'processing' ? 'secondary' :
                            task.status === 'failed' ? 'destructive' : 'outline'
                          }>
                            {task.status}
                          </Badge>
                          <h4 className="font-medium">{task.name}</h4>
                        </div>
                        <Badge variant={task.priority === 'critical' ? 'destructive' : task.priority === 'high' ? 'default' : 'secondary'}>
                          {task.priority}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{task.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground">Input:</p>
                          <p className="font-mono bg-secondary/30 p-2 rounded text-xs break-all">{task.inputData}</p>
                        </div>
                        {task.actualOutput && (
                          <div>
                            <p className="font-medium text-muted-foreground">Output:</p>
                            <p className="font-mono bg-secondary/30 p-2 rounded text-xs break-all">{task.actualOutput}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Geschätzte Zeit: {task.estimatedTime}min
                          {task.actualTime && ` | Tatsächlich: ${task.actualTime}min`}
                        </span>
                        {task.assignedProcessor && (
                          <span>Prozessor: {task.assignedProcessor}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DNA Sequences Tab */}
        <TabsContent value="sequences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database size={20} />
                DNA-Sequenz Verarbeitung
              </CardTitle>
              <CardDescription>
                Echtzeitüberwachung der DNA-basierten Datenverarbeitung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {(sequences || []).slice().reverse().map((sequence) => (
                    <div key={sequence.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Atom size={16} className={
                          sequence.status === 'completed' ? 'text-green-500' :
                          sequence.status === 'processing' ? 'text-blue-500' :
                          sequence.status === 'error' ? 'text-red-500' : 'text-gray-500'
                        } />
                        <div>
                          <p className="font-mono text-sm font-medium">{sequence.sequence}</p>
                          <p className="text-xs text-muted-foreground">
                            {sequence.organism} • {sequence.processingTime.toFixed(1)}s • {sequence.complexity.toFixed(1)}% Komplexität
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          sequence.status === 'completed' ? 'default' :
                          sequence.status === 'processing' ? 'secondary' :
                          sequence.status === 'error' ? 'destructive' : 'outline'
                        }>
                          {sequence.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(sequence.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Leistungsanalytik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Biologische Stabilität</span>
                    <span className="text-sm">{(performanceMetrics?.biologicalStability || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={performanceMetrics?.biologicalStability || 0} className="h-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Parallele Operationen</span>
                    <span className="text-sm">{performanceMetrics?.parallelOperations || 0}</span>
                  </div>
                  <Progress value={((performanceMetrics?.parallelOperations || 0) / 15) * 100} className="h-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Erfolgsrate</span>
                    <span className="text-sm">{(performanceMetrics?.successRate || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={performanceMetrics?.successRate || 0} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Molecule size={20} />
                  Protein-Analytik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Durchschn. Protein-Stabilität</span>
                    <span className="text-sm">{(foldingMetrics?.averageStability || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={foldingMetrics?.averageStability || 0} className="h-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Faltungsgenauigkeit</span>
                    <span className="text-sm">{(foldingMetrics?.algorithmAccuracy || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={foldingMetrics?.algorithmAccuracy || 0} className="h-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Erfolgreich Gefaltete</span>
                    <span className="text-sm">{foldingMetrics?.successfulFolds || 0} von {foldingMetrics?.totalProteins || 0}</span>
                  </div>
                  <Progress value={foldingMetrics?.totalProteins ? ((foldingMetrics?.successfulFolds || 0) / foldingMetrics.totalProteins) * 100 : 0} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  Effizienzvergleich
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">DNA + Protein Computing</span>
                    <span className="text-sm font-bold text-green-600">
                      {((performanceMetrics?.averageEfficiency || 0) + (foldingMetrics?.algorithmAccuracy || 0) / 2).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(performanceMetrics?.averageEfficiency || 0) + (foldingMetrics?.algorithmAccuracy || 0) / 2} className="h-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Konventionelle CPUs</span>
                    <span className="text-sm">65.2%</span>
                  </div>
                  <Progress value={65.2} className="h-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Quantum Computing</span>
                    <span className="text-sm">78.9%</span>
                  </div>
                  <Progress value={78.9} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Protein Folding Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine size={20} />
                  Faltungsalgorithmus-Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['AlphaFold', 'QuantumFold', 'HybridFold', 'DeepFold', 'BioFold-AI'].map((algorithm, index) => {
                  const efficiency = 95 - index * 3 + Math.random() * 4
                  return (
                    <div key={algorithm} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <GraphicsCard size={14} />
                          <span className="text-sm font-medium">{algorithm}</span>
                        </div>
                        <span className="text-sm">{efficiency.toFixed(1)}%</span>
                      </div>
                      <Progress value={efficiency} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightning size={20} />
                  Computational Advantage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Molecule size={16} />
                  <AlertDescription>
                    <strong>Protein-Folding-Enhanced DNA-Computing:</strong><br/>
                    • {(((performanceMetrics?.averageEfficiency || 0) + (foldingMetrics?.algorithmAccuracy || 0) / 2) - 65.2).toFixed(1)}% höhere Effizienz als CPUs<br/>
                    • {(foldingMetrics?.computationalThroughput || 0).toLocaleString()} Ops/sec durch Proteinstrukturen<br/>
                    • {(performanceMetrics?.energyEfficiency || 0).toFixed(1)}% geringerer Energieverbrauch<br/>
                    • Selbstoptimierende biologische Algorithmen
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(foldingMetrics?.averageFoldingTime || 0).toFixed(1)}s
                    </div>
                    <div className="text-xs text-green-700">
                      Durchschn. Faltungszeit
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {foldingMetrics?.totalProteins ? Math.floor((foldingMetrics?.computationalThroughput || 0) / foldingMetrics.totalProteins) : 0}
                    </div>
                    <div className="text-xs text-blue-700">
                      Ops/sec pro Protein
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

export default DNAComputingSystem