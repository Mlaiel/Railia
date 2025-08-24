import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Brain, 
  Target, 
  TrendUp, 
  Users, 
  Gauge, 
  Award,
  Zap,
  Activity,
  Shield,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Network,
  CircuitBoard,
  Cpu,
  Graph,
  Lightning,
  Atom,
  Diamond,
  PlusCircle,
  MinusCircle,
  Function,
  Layers,
  MathOperations
} from '@phosphor-icons/react'

interface Agent {
  id: string
  name: string
  role: string
  specialization: string[]
  currentTask: string
  performance: number
  reward: number
  confidence: number
  adaptability: number
  status: 'active' | 'learning' | 'idle' | 'optimizing'
  dqnNetworkId?: string
  qValues?: number[]
  experienceBufferSize?: number
}

interface Task {
  id: string
  name: string
  priority: number
  complexity: number
  requiredSkills: string[]
  assignedAgent: string | null
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed'
  reward: number
  deadline: string
  stateVector?: number[]
  actionSpace?: string[]
}

interface LearningMetrics {
  episodeCount: number
  averageReward: number
  convergenceRate: number
  explorationRate: number
  learningRate: number
  totalSteps: number
  successRate: number
  adaptationSpeed: number
  dqnLoss: number
  targetNetworkUpdates: number
  experienceReplaySize: number
}

interface RLOptimizer {
  isTraining: boolean
  currentEpisode: number
  explorationRate: number
  learningRate: number
  rewardThreshold: number
  convergenceTarget: number
  adaptationEnabled: boolean
  dqnEnabled: boolean
  targetNetworkUpdateFreq: number
  batchSize: number
  memorySize: number
  discountFactor: number
  doubleQEnabled: boolean
  prioritizedReplayEnabled: boolean
}

interface DQNNetwork {
  id: string
  name: string
  architecture: DQNLayer[]
  inputSize: number
  outputSize: number
  isActive: boolean
  trainingSteps: number
  averageLoss: number
  lastUpdate: string
  networkType: 'main' | 'target'
  agentId: string
}

interface DQNLayer {
  id: string
  type: 'dense' | 'conv2d' | 'dropout' | 'batch_norm' | 'activation'
  neurons?: number
  activationFunction?: 'relu' | 'sigmoid' | 'tanh' | 'leaky_relu' | 'softmax'
  dropoutRate?: number
  kernelSize?: number
  filters?: number
  parameters: number
  outputShape: number[]
}

interface ExperienceBuffer {
  state: number[]
  action: number
  reward: number
  nextState: number[]
  done: boolean
  priority?: number
  timestamp: string
}

const ReinforcementLearningOptimizer = () => {
  const [agents, setAgents] = useKV<Agent[]>('rl-agents', [
    {
      id: 'agent-1',
      name: 'KI-Koordinator Alpha',
      role: 'task_coordinator',
      specialization: ['task_allocation', 'priority_management', 'resource_optimization'],
      currentTask: 'Optimierung der Aufgabenverteilung',
      performance: 87,
      reward: 245.8,
      confidence: 92,
      adaptability: 85,
      status: 'active',
      dqnNetworkId: 'dqn-coordinator-main',
      qValues: [0.85, 0.72, 0.91, 0.68, 0.79],
      experienceBufferSize: 8472
    },
    {
      id: 'agent-2',
      name: 'Überwachungs-Bot Beta',
      role: 'surveillance_specialist',
      specialization: ['anomaly_detection', 'pattern_recognition', 'risk_assessment'],
      currentTask: 'Gleisüberwachung Sektor 7',
      performance: 94,
      reward: 312.4,
      confidence: 96,
      adaptability: 78,
      status: 'active',
      dqnNetworkId: 'dqn-surveillance-main',
      qValues: [0.93, 0.87, 0.95, 0.82, 0.88],
      experienceBufferSize: 12358
    },
    {
      id: 'agent-3',
      name: 'Wartungs-Agent Gamma',
      role: 'maintenance_optimizer',
      specialization: ['predictive_maintenance', 'resource_scheduling', 'fault_diagnosis'],
      currentTask: 'Wartungsplanung KW 15',
      performance: 76,
      reward: 189.2,
      confidence: 82,
      adaptability: 91,
      status: 'learning',
      dqnNetworkId: 'dqn-maintenance-main',
      qValues: [0.76, 0.68, 0.84, 0.71, 0.79],
      experienceBufferSize: 6847
    },
    {
      id: 'agent-4',
      name: 'Notfall-Responder Delta',
      role: 'emergency_coordinator',
      specialization: ['emergency_response', 'crisis_management', 'resource_mobilization'],
      currentTask: 'Bereitschaftsdienst',
      performance: 88,
      reward: 278.6,
      confidence: 89,
      adaptability: 94,
      status: 'idle',
      dqnNetworkId: 'dqn-emergency-main',
      qValues: [0.88, 0.82, 0.91, 0.85, 0.87],
      experienceBufferSize: 9521
    }
  ])

  const [tasks, setTasks] = useKV<Task[]>('rl-tasks', [
    {
      id: 'task-1',
      name: 'Gleis-Inspektion Strecke A1-B5',
      priority: 8,
      complexity: 6,
      requiredSkills: ['surveillance', 'anomaly_detection'],
      assignedAgent: 'agent-2',
      status: 'in_progress',
      reward: 85,
      deadline: '2024-01-15T14:00:00Z',
      stateVector: [0.8, 0.6, 0.7, 0.9, 0.5, 0.3, 0.8],
      actionSpace: ['inspect', 'alert', 'continue', 'escalate', 'defer']
    },
    {
      id: 'task-2',
      name: 'Wartungsoptimierung Bahnhof Central',
      priority: 9,
      complexity: 8,
      requiredSkills: ['maintenance', 'scheduling', 'optimization'],
      assignedAgent: null,
      status: 'pending',
      reward: 120,
      deadline: '2024-01-16T09:00:00Z',
      stateVector: [0.9, 0.8, 0.4, 0.6, 0.7, 0.9, 0.5],
      actionSpace: ['schedule', 'defer', 'prioritize', 'resource_allocate', 'emergency_mode']
    },
    {
      id: 'task-3',
      name: 'Netzwerk-Optimierung Rush Hour',
      priority: 10,
      complexity: 9,
      requiredSkills: ['coordination', 'optimization', 'real_time_analysis'],
      assignedAgent: 'agent-1',
      status: 'assigned',
      reward: 150,
      deadline: '2024-01-15T08:00:00Z',
      stateVector: [1.0, 0.9, 0.8, 0.7, 0.9, 0.8, 0.9],
      actionSpace: ['optimize', 'reroute', 'delay', 'prioritize', 'emergency_stop']
    }
  ])

  const [learningMetrics, setLearningMetrics] = useKV<LearningMetrics>('rl-metrics', {
    episodeCount: 1247,
    averageReward: 267.8,
    convergenceRate: 0.89,
    explorationRate: 0.15,
    learningRate: 0.001,
    totalSteps: 45892,
    successRate: 0.94,
    adaptationSpeed: 0.76,
    dqnLoss: 0.042,
    targetNetworkUpdates: 156,
    experienceReplaySize: 50000
  })

  const [optimizer, setOptimizer] = useKV<RLOptimizer>('rl-optimizer', {
    isTraining: true,
    currentEpisode: 1247,
    explorationRate: 0.15,
    learningRate: 0.001,
    rewardThreshold: 250.0,
    convergenceTarget: 0.95,
    adaptationEnabled: true,
    dqnEnabled: true,
    targetNetworkUpdateFreq: 1000,
    batchSize: 32,
    memorySize: 50000,
    discountFactor: 0.99,
    doubleQEnabled: true,
    prioritizedReplayEnabled: true
  })

  const [dqnNetworks, setDqnNetworks] = useKV<DQNNetwork[]>('dqn-networks', [
    {
      id: 'dqn-coordinator-main',
      name: 'Koordinator Haupt-Netzwerk',
      architecture: [
        {
          id: 'input-layer',
          type: 'dense',
          neurons: 128,
          activationFunction: 'relu',
          parameters: 1024,
          outputShape: [128]
        },
        {
          id: 'hidden-1',
          type: 'dense',
          neurons: 256,
          activationFunction: 'relu',
          parameters: 32768,
          outputShape: [256]
        },
        {
          id: 'dropout-1',
          type: 'dropout',
          dropoutRate: 0.2,
          parameters: 0,
          outputShape: [256]
        },
        {
          id: 'hidden-2',
          type: 'dense',
          neurons: 128,
          activationFunction: 'relu',
          parameters: 32768,
          outputShape: [128]
        },
        {
          id: 'output-layer',
          type: 'dense',
          neurons: 5,
          activationFunction: 'softmax',
          parameters: 645,
          outputShape: [5]
        }
      ],
      inputSize: 8,
      outputSize: 5,
      isActive: true,
      trainingSteps: 15672,
      averageLoss: 0.042,
      lastUpdate: new Date().toISOString(),
      networkType: 'main',
      agentId: 'agent-1'
    },
    {
      id: 'dqn-surveillance-main',
      name: 'Überwachung Haupt-Netzwerk',
      architecture: [
        {
          id: 'conv-1',
          type: 'conv2d',
          filters: 32,
          kernelSize: 3,
          activationFunction: 'relu',
          parameters: 896,
          outputShape: [32, 64, 64]
        },
        {
          id: 'conv-2',
          type: 'conv2d',
          filters: 64,
          kernelSize: 3,
          activationFunction: 'relu',
          parameters: 18496,
          outputShape: [64, 32, 32]
        },
        {
          id: 'dense-1',
          type: 'dense',
          neurons: 512,
          activationFunction: 'relu',
          parameters: 33554432,
          outputShape: [512]
        },
        {
          id: 'output-layer',
          type: 'dense',
          neurons: 7,
          activationFunction: 'softmax',
          parameters: 3591,
          outputShape: [7]
        }
      ],
      inputSize: 65536,
      outputSize: 7,
      isActive: true,
      trainingSteps: 22841,
      averageLoss: 0.031,
      lastUpdate: new Date().toISOString(),
      networkType: 'main',
      agentId: 'agent-2'
    }
  ])

  const [experienceBuffer, setExperienceBuffer] = useKV<ExperienceBuffer[]>('experience-buffer', [])

  const [selectedAgent, setSelectedAgent] = useState<string>('')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDQN, setSelectedDQN] = useState<string>('')

  useEffect(() => {
    if (optimizer.isTraining && optimizer.dqnEnabled) {
      const interval = setInterval(() => {
        // Simuliere Deep Q-Learning Updates
        setLearningMetrics(current => ({
          ...current,
          episodeCount: current.episodeCount + 1,
          averageReward: current.averageReward + (Math.random() - 0.5) * 2,
          totalSteps: current.totalSteps + Math.floor(Math.random() * 5) + 1,
          successRate: Math.min(0.99, current.successRate + (Math.random() - 0.45) * 0.01),
          convergenceRate: Math.min(0.99, current.convergenceRate + (Math.random() - 0.4) * 0.005),
          dqnLoss: Math.max(0.001, current.dqnLoss + (Math.random() - 0.5) * 0.01),
          targetNetworkUpdates: current.targetNetworkUpdates + (Math.random() > 0.9 ? 1 : 0),
          experienceReplaySize: Math.min(optimizer.memorySize, current.experienceReplaySize + Math.floor(Math.random() * 10))
        }))

        // Aktualisiere Agent Performance basierend auf DQN
        setAgents(currentAgents => 
          currentAgents.map(agent => ({
            ...agent,
            performance: Math.max(0, Math.min(100, agent.performance + (Math.random() - 0.4) * 2)),
            reward: Math.max(0, agent.reward + (Math.random() - 0.3) * 5),
            confidence: Math.max(0, Math.min(100, agent.confidence + (Math.random() - 0.45) * 1.5)),
            qValues: agent.qValues?.map(q => Math.max(0, Math.min(1, q + (Math.random() - 0.5) * 0.1))),
            experienceBufferSize: Math.max(0, (agent.experienceBufferSize || 0) + Math.floor(Math.random() * 5))
          }))
        )

        // Aktualisiere DQN Netzwerke
        setDqnNetworks(currentNetworks =>
          currentNetworks.map(network => ({
            ...network,
            trainingSteps: network.trainingSteps + Math.floor(Math.random() * 3) + 1,
            averageLoss: Math.max(0.001, network.averageLoss + (Math.random() - 0.5) * 0.005),
            lastUpdate: new Date().toISOString()
          }))
        )

        // Simuliere Experience Replay Updates
        if (Math.random() > 0.7) {
          const newExperience: ExperienceBuffer = {
            state: Array.from({length: 8}, () => Math.random()),
            action: Math.floor(Math.random() * 5),
            reward: Math.random() * 100,
            nextState: Array.from({length: 8}, () => Math.random()),
            done: Math.random() > 0.8,
            priority: optimizer.prioritizedReplayEnabled ? Math.random() : undefined,
            timestamp: new Date().toISOString()
          }

          setExperienceBuffer(current => {
            const updated = [...current, newExperience]
            return updated.slice(-optimizer.memorySize) // Begrenze Buffer-Größe
          })
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [optimizer.isTraining, optimizer.dqnEnabled, optimizer.memorySize, optimizer.prioritizedReplayEnabled, setLearningMetrics, setAgents, setDqnNetworks, setExperienceBuffer])

  const startTraining = async () => {
    setOptimizer(current => ({ ...current, isTraining: true }))
    toast.success('Deep Q-Learning Training gestartet', {
      description: 'Neuronale Netzwerke optimieren komplexe Entscheidungsfindung'
    })
  }

  const pauseTraining = async () => {
    setOptimizer(current => ({ ...current, isTraining: false }))
    toast.info('DQN Training pausiert')
  }

  const resetLearning = async () => {
    setLearningMetrics({
      episodeCount: 0,
      averageReward: 0,
      convergenceRate: 0,
      explorationRate: 1.0,
      learningRate: 0.01,
      totalSteps: 0,
      successRate: 0,
      adaptationSpeed: 0,
      dqnLoss: 1.0,
      targetNetworkUpdates: 0,
      experienceReplaySize: 0
    })
    
    setOptimizer({
      isTraining: false,
      currentEpisode: 0,
      explorationRate: 1.0,
      learningRate: 0.01,
      rewardThreshold: 100.0,
      convergenceTarget: 0.8,
      adaptationEnabled: true,
      dqnEnabled: true,
      targetNetworkUpdateFreq: 1000,
      batchSize: 32,
      memorySize: 50000,
      discountFactor: 0.99,
      doubleQEnabled: true,
      prioritizedReplayEnabled: false
    })

    setExperienceBuffer([])
    
    toast.success('DQN Parameter zurückgesetzt')
  }

  const updateTargetNetwork = async () => {
    setDqnNetworks(current => 
      current.map(network => ({
        ...network,
        lastUpdate: new Date().toISOString(),
        trainingSteps: network.trainingSteps + 1
      }))
    )

    setLearningMetrics(current => ({
      ...current,
      targetNetworkUpdates: current.targetNetworkUpdates + 1
    }))

    toast.success('Target-Netzwerke aktualisiert', {
      description: 'Stabilität der DQN-Algorithmen verbessert'
    })
  }

  const createNewDQNArchitecture = async () => {
    const newNetwork: DQNNetwork = {
      id: `dqn-custom-${Date.now()}`,
      name: `Benutzerdefiniertes Netzwerk ${dqnNetworks.length + 1}`,
      architecture: [
        {
          id: 'input-layer',
          type: 'dense',
          neurons: 64,
          activationFunction: 'relu',
          parameters: 512,
          outputShape: [64]
        },
        {
          id: 'hidden-1',
          type: 'dense',
          neurons: 128,
          activationFunction: 'relu',
          parameters: 8192,
          outputShape: [128]
        },
        {
          id: 'output-layer',
          type: 'dense',
          neurons: 4,
          activationFunction: 'softmax',
          parameters: 516,
          outputShape: [4]
        }
      ],
      inputSize: 8,
      outputSize: 4,
      isActive: false,
      trainingSteps: 0,
      averageLoss: 1.0,
      lastUpdate: new Date().toISOString(),
      networkType: 'main',
      agentId: 'custom'
    }

    setDqnNetworks(current => [...current, newNetwork])
    toast.success('Neue DQN-Architektur erstellt')
  }

  const optimizeTaskAllocation = async () => {
    if (!optimizer.dqnEnabled) {
      toast.error('DQN muss aktiviert sein für optimierte Aufgabenverteilung')
      return
    }

    // Simuliere DQN-basierte Aufgabenoptimierung
    const pendingTasks = tasks.filter(task => task.status === 'pending')
    const availableAgents = agents.filter(agent => agent.status === 'idle' || agent.status === 'active')

    for (const task of pendingTasks) {
      // Verwende Q-Values für intelligente Agent-Auswahl
      const bestAgent = availableAgents.reduce((best, current) => {
        const taskSuitability = current.specialization.filter(skill => 
          task.requiredSkills.some(req => req.includes(skill.split('_')[0]))
        ).length
        
        // Berechne DQN-Score basierend auf Q-Values und Zustandsvektor
        const avgQValue = current.qValues ? 
          current.qValues.reduce((sum, q) => sum + q, 0) / current.qValues.length : 0.5
        
        const dqnScore = avgQValue * 0.4 + current.performance * 0.3 + taskSuitability * 20 + current.confidence * 0.1
        
        return dqnScore > (best.score || 0) ? { agent: current, score: dqnScore } : best
      }, { agent: null as Agent | null, score: 0 })

      if (bestAgent.agent) {
        setTasks(currentTasks => 
          currentTasks.map(t => 
            t.id === task.id 
              ? { ...t, assignedAgent: bestAgent.agent!.id, status: 'assigned' as const }
              : t
          )
        )

        // Aktualisiere Experience Buffer mit neuer Erfahrung
        const newExperience: ExperienceBuffer = {
          state: task.stateVector || Array.from({length: 8}, () => Math.random()),
          action: task.actionSpace?.indexOf('assign') || 0,
          reward: task.reward,
          nextState: Array.from({length: 8}, () => Math.random()),
          done: false,
          priority: optimizer.prioritizedReplayEnabled ? task.priority / 10 : undefined,
          timestamp: new Date().toISOString()
        }

        setExperienceBuffer(current => [...current.slice(-optimizer.memorySize + 1), newExperience])
      }
    }

    toast.success('DQN-Optimierung abgeschlossen', {
      description: 'Aufgabenverteilung basierend auf Deep Q-Learning optimiert'
    })
  }

  const getLayerIcon = (layerType: string) => {
    switch (layerType) {
      case 'dense': return <CircuitBoard size={16} className="text-blue-600" />
      case 'conv2d': return <Layers size={16} className="text-green-600" />
      case 'dropout': return <MinusCircle size={16} className="text-orange-600" />
      case 'batch_norm': return <Function size={16} className="text-purple-600" />
      case 'activation': return <Lightning size={16} className="text-yellow-600" />
      default: return <Atom size={16} className="text-gray-600" />
    }
  }

  const getActivationColor = (activation: string) => {
    switch (activation) {
      case 'relu': return 'text-blue-600'
      case 'sigmoid': return 'text-green-600'
      case 'tanh': return 'text-purple-600'
      case 'leaky_relu': return 'text-orange-600'
      case 'softmax': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'learning': return 'bg-blue-500'
      case 'idle': return 'bg-yellow-500'
      case 'optimizing': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getAgentStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'learning': return 'secondary'
      case 'idle': return 'outline'
      case 'optimizing': return 'default'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Deep Q-Learning Reinforcement Optimierer
          </h1>
          <p className="text-muted-foreground">
            Neuronale Netzwerke für komplexe Entscheidungsfindung und selbstoptimierte Agentenrollen
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={optimizeTaskAllocation}
            className="gap-2"
            disabled={!optimizer.adaptationEnabled || !optimizer.dqnEnabled}
          >
            <Target size={16} />
            DQN-Optimierung
          </Button>

          <Button
            onClick={updateTargetNetwork}
            variant="outline"
            className="gap-2"
            disabled={!optimizer.dqnEnabled}
          >
            <Network size={16} />
            Target Update
          </Button>
          
          {optimizer.isTraining ? (
            <Button onClick={pauseTraining} variant="outline" className="gap-2">
              <Pause size={16} />
              Pausieren
            </Button>
          ) : (
            <Button onClick={startTraining} className="gap-2">
              <Play size={16} />
              DQN Training
            </Button>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">DQN Training</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {learningMetrics.episodeCount.toLocaleString()}
                </span>
                <Badge variant={optimizer.isTraining && optimizer.dqnEnabled ? "default" : "outline"}>
                  {optimizer.isTraining && optimizer.dqnEnabled ? 'DQN Aktiv' : 'Pausiert'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Episoden absolviert</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-green-600" />
              <CardTitle className="text-sm">Durchschn. Belohnung</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {learningMetrics.averageReward.toFixed(1)}
              </div>
              <div className="flex items-center gap-1">
                <TrendUp className="h-3 w-3 text-green-600" />
                <p className="text-xs text-muted-foreground">+2.4% zur Vorwoche</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm">Erfolgsrate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {(learningMetrics.successRate * 100).toFixed(1)}%
              </div>
              <Progress value={learningMetrics.successRate * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-sm">DQN Verlust</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {learningMetrics.dqnLoss.toFixed(3)}
              </div>
              <div className="flex items-center gap-1">
                <Lightning className="h-3 w-3 text-purple-600" />
                <p className="text-xs text-muted-foreground">Neuronaler Verlust</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-orange-600" />
              <CardTitle className="text-sm">Experience Replay</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {learningMetrics.experienceReplaySize.toLocaleString()}
              </div>
              <Progress value={(learningMetrics.experienceReplaySize / optimizer.memorySize) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">Speicher-Auslastung</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="dqn">DQN Netzwerke</TabsTrigger>
          <TabsTrigger value="agents">Agenten</TabsTrigger>
          <TabsTrigger value="tasks">Aufgaben</TabsTrigger>
          <TabsTrigger value="experience">Experience Replay</TabsTrigger>
          <TabsTrigger value="learning">Parameter</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* DQN Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircuitBoard className="h-5 w-5" />
                Deep Q-Learning Performance
              </CardTitle>
              <CardDescription>
                Echtzeitanalytik der neuronalen Netzwerk-Algorithmen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Netzwerk-Metriken</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>DQN Verlust</span>
                      <span className="font-mono">{learningMetrics.dqnLoss.toFixed(4)}</span>
                    </div>
                    <Progress value={Math.max(0, 100 - learningMetrics.dqnLoss * 1000)} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Target Updates</span>
                      <span className="font-mono">{learningMetrics.targetNetworkUpdates}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Exploration Rate</span>
                      <span className="font-mono">{(learningMetrics.explorationRate * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={learningMetrics.explorationRate * 100} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">DQN Konfiguration</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Batch-Größe</span>
                      <span className="font-mono">{optimizer.batchSize}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Speicher-Größe</span>
                      <span className="font-mono">{optimizer.memorySize.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Discount Factor</span>
                      <span className="font-mono">{optimizer.discountFactor}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Double Q-Learning</span>
                      <Badge variant={optimizer.doubleQEnabled ? "default" : "outline"}>
                        {optimizer.doubleQEnabled ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Experience Replay</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Buffer-Auslastung</span>
                      <span className="font-mono">
                        {((learningMetrics.experienceReplaySize / optimizer.memorySize) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(learningMetrics.experienceReplaySize / optimizer.memorySize) * 100} 
                      className="h-2" 
                    />
                    
                    <div className="flex justify-between text-sm">
                      <span>Prioritized Replay</span>
                      <Badge variant={optimizer.prioritizedReplayEnabled ? "default" : "outline"}>
                        {optimizer.prioritizedReplayEnabled ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Learning Rate</span>
                      <span className="font-mono">{learningMetrics.learningRate.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Q-Values Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Agenten Q-Werte Übersicht
              </CardTitle>
              <CardDescription>
                Aktuelle Q-Werte und DQN-Performance der Agenten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map(agent => (
                  <div
                    key={agent.id}
                    className="p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">DQN: {agent.dqnNetworkId}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getAgentStatusColor(agent.status)}`} />
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Q-Werte (Ø)</span>
                          <span className="font-mono">
                            {agent.qValues ? (agent.qValues.reduce((a, b) => a + b, 0) / agent.qValues.length).toFixed(3) : 'N/A'}
                          </span>
                        </div>
                        {agent.qValues && (
                          <div className="flex gap-1">
                            {agent.qValues.map((qValue, index) => (
                              <div
                                key={index}
                                className="flex-1 bg-secondary rounded-sm overflow-hidden"
                                style={{ height: '8px' }}
                              >
                                <div
                                  className="bg-primary h-full transition-all duration-300"
                                  style={{ width: `${qValue * 100}%` }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Experience Buffer</span>
                          <div className="font-mono">
                            {agent.experienceBufferSize?.toLocaleString() || '0'}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Performance</span>
                          <div className="font-semibold">{agent.performance.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dqn" className="space-y-6">
          {/* DQN Network Architecture */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Deep Q-Network Architekturen</h2>
              <p className="text-muted-foreground">Verwaltung und Überwachung der neuronalen Netzwerke</p>
            </div>
            <Button onClick={createNewDQNArchitecture} className="gap-2">
              <PlusCircle size={16} />
              Neue Architektur
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dqnNetworks.map(network => (
              <Card key={network.id} className={selectedDQN === network.id ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Cpu className="h-5 w-5" />
                        {network.name}
                      </CardTitle>
                      <CardDescription>
                        Agent: {agents.find(a => a.id === network.agentId)?.name || 'Unzugewiesen'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={network.isActive ? "default" : "outline"}>
                        {network.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                      <Badge variant="outline">
                        {network.networkType}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Input</div>
                      <div className="font-mono">{network.inputSize}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Output</div>
                      <div className="font-mono">{network.outputSize}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Training Steps</div>
                      <div className="font-mono">{network.trainingSteps.toLocaleString()}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Netzwerk-Architektur</h4>
                    <div className="space-y-2">
                      {network.architecture.map((layer, index) => (
                        <div 
                          key={layer.id}
                          className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getLayerIcon(layer.type)}
                            <div>
                              <div className="font-medium text-sm">
                                {layer.type === 'dense' ? `Dense (${layer.neurons})` :
                                 layer.type === 'conv2d' ? `Conv2D (${layer.filters}x${layer.kernelSize})` :
                                 layer.type === 'dropout' ? `Dropout (${layer.dropoutRate})` :
                                 layer.type.charAt(0).toUpperCase() + layer.type.slice(1)}
                              </div>
                              {layer.activationFunction && (
                                <div className={`text-xs ${getActivationColor(layer.activationFunction)}`}>
                                  {layer.activationFunction}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono">{layer.parameters.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Parameter</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Durchschn. Verlust</div>
                      <div className="text-lg font-bold text-purple-600">
                        {network.averageLoss.toFixed(4)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Letzte Aktualisierung</div>
                      <div className="text-sm font-mono">
                        {new Date(network.lastUpdate).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map(agent => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription>{agent.role.replace('_', ' ')}</CardDescription>
                    </div>
                    <Badge variant={getAgentStatusBadge(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Performance</div>
                      <div className="text-xl font-bold">{agent.performance.toFixed(1)}%</div>
                      <Progress value={agent.performance} className="h-2 mt-1" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Belohnung</div>
                      <div className="text-xl font-bold">{agent.reward.toFixed(1)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Vertrauen</div>
                      <div className="text-lg font-semibold">{agent.confidence}%</div>
                      <Progress value={agent.confidence} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Anpassungsfähigkeit</div>
                      <div className="text-lg font-semibold">{agent.adaptability}%</div>
                      <Progress value={agent.adaptability} className="h-1 mt-1" />
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Spezialisierungen</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.specialization.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Q-Werte</div>
                      {agent.qValues ? (
                        <div className="space-y-2">
                          <div className="flex gap-1">
                            {agent.qValues.map((qValue, index) => (
                              <div key={index} className="flex-1 text-center">
                                <div className="text-xs font-mono">{qValue.toFixed(2)}</div>
                                <div className="h-2 bg-secondary rounded-sm overflow-hidden mt-1">
                                  <div
                                    className="bg-primary h-full transition-all duration-300"
                                    style={{ width: `${qValue * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Ø Q-Wert: {(agent.qValues.reduce((a, b) => a + b, 0) / agent.qValues.length).toFixed(3)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">Keine Q-Werte verfügbar</div>
                      )}
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">DQN Konfiguration</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Netzwerk-ID:</span>
                          <span className="font-mono text-xs">{agent.dqnNetworkId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Experience Buffer:</span>
                          <span className="font-mono">{agent.experienceBufferSize?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aufgaben-Management</CardTitle>
              <CardDescription>
                RL-optimierte Aufgabenverteilung und Prioritätsverwaltung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{task.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Priorität: {task.priority}/10</span>
                          <span>Komplexität: {task.complexity}/10</span>
                          <span>Belohnung: {task.reward}</span>
                        </div>
                      </div>
                      <Badge variant={
                        task.status === 'completed' ? 'default' :
                        task.status === 'in_progress' ? 'secondary' :
                        task.status === 'assigned' ? 'outline' :
                        task.status === 'failed' ? 'destructive' : 'outline'
                      }>
                        {task.status}
                      </Badge>
                    </div>

                    {/* DQN State Vector Visualization */}
                    {task.stateVector && (
                      <div className="mb-3">
                        <div className="text-sm text-muted-foreground mb-1">Zustandsvektor</div>
                        <div className="flex gap-1">
                          {task.stateVector.map((state, index) => (
                            <div key={index} className="flex-1">
                              <div className="h-3 bg-secondary rounded-sm overflow-hidden">
                                <div
                                  className="bg-blue-500 h-full transition-all duration-300"
                                  style={{ width: `${state * 100}%` }}
                                />
                              </div>
                              <div className="text-xs text-center mt-1 font-mono">{state.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Aktionsraum</div>
                        <div className="flex flex-wrap gap-1">
                          {task.actionSpace?.map(action => (
                            <Badge key={action} variant="outline" className="text-xs">
                              {action.replace('_', ' ')}
                            </Badge>
                          )) || (
                            <Badge variant="outline" className="text-xs">Keine Aktionen definiert</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Zugewiesener Agent</div>
                        <div className="text-sm">
                          {task.assignedAgent 
                            ? agents.find(a => a.id === task.assignedAgent)?.name || 'Unbekannt'
                            : 'Nicht zugewiesen'
                          }
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm">
                        <span>Deadline</span>
                        <span>{new Date(task.deadline).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MathOperations className="h-5 w-5" />
                Experience Replay Buffer
              </CardTitle>
              <CardDescription>
                Gespeicherte Erfahrungen für das Training der DQN-Netzwerke
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{experienceBuffer.length}</div>
                    <div className="text-sm text-muted-foreground">Gespeicherte Erfahrungen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{optimizer.memorySize.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Max. Speicherkapazität</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {((experienceBuffer.length / optimizer.memorySize) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Auslastung</div>
                  </div>
                </div>

                <Progress value={(experienceBuffer.length / optimizer.memorySize) * 100} className="h-3" />

                {experienceBuffer.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Neueste Erfahrungen</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {experienceBuffer.slice(-10).reverse().map((experience, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-secondary/20">
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Zustand</div>
                              <div className="font-mono text-xs">
                                [{experience.state.map(s => s.toFixed(2)).join(', ')}]
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Aktion</div>
                              <div className="font-mono">{experience.action}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Belohnung</div>
                              <div className="font-bold text-green-600">{experience.reward.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Abgeschlossen</div>
                              <Badge variant={experience.done ? "destructive" : "default"}>
                                {experience.done ? 'Ja' : 'Nein'}
                              </Badge>
                            </div>
                          </div>
                          {optimizer.prioritizedReplayEnabled && experience.priority && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Priorität:</span>
                              <Progress value={experience.priority * 100} className="h-1 flex-1" />
                              <span className="text-xs font-mono">{experience.priority.toFixed(3)}</span>
                            </div>
                          )}
                          <div className="mt-2 text-xs text-muted-foreground">
                            {new Date(experience.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  DQN-Parameter
                </CardTitle>
                <CardDescription>
                  Konfiguration der Deep Q-Learning Algorithmen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">DQN Aktiviert</span>
                    <Badge variant={optimizer.dqnEnabled ? "default" : "outline"}>
                      {optimizer.dqnEnabled ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Exploration Rate</span>
                    <span className="text-sm font-mono">{optimizer.explorationRate.toFixed(3)}</span>
                  </div>
                  <Progress value={optimizer.explorationRate * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Learning Rate</span>
                    <span className="text-sm font-mono">{optimizer.learningRate.toFixed(4)}</span>
                  </div>
                  <Progress value={optimizer.learningRate * 1000} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Batch-Größe</span>
                    <span className="text-sm font-mono">{optimizer.batchSize}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Memory-Größe</span>
                    <span className="text-sm font-mono">{optimizer.memorySize.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Discount Factor (γ)</span>
                    <span className="text-sm font-mono">{optimizer.discountFactor}</span>
                  </div>
                  <Progress value={optimizer.discountFactor * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Target Update Frequenz</span>
                    <span className="text-sm font-mono">{optimizer.targetNetworkUpdateFreq}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button 
                    onClick={resetLearning} 
                    variant="outline" 
                    className="w-full gap-2"
                  >
                    <RotateCcw size={16} />
                    DQN Parameter zurücksetzen
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Erweiterte DQN-Metriken
                </CardTitle>
                <CardDescription>
                  Detaillierte Überwachung des Deep Q-Learning Prozesses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Double Q-Learning</div>
                    <Badge variant={optimizer.doubleQEnabled ? "default" : "outline"}>
                      {optimizer.doubleQEnabled ? 'Aktiviert' : 'Deaktiviert'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Prioritized Replay</div>
                    <Badge variant={optimizer.prioritizedReplayEnabled ? "default" : "outline"}>
                      {optimizer.prioritizedReplayEnabled ? 'Aktiviert' : 'Deaktiviert'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Episoden</div>
                    <div className="text-2xl font-bold">{learningMetrics.episodeCount.toLocaleString()}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Target Updates</div>
                    <div className="text-2xl font-bold">{learningMetrics.targetNetworkUpdates}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">DQN Verlust</div>
                    <div className="text-xl font-bold text-purple-600">
                      {learningMetrics.dqnLoss.toFixed(4)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Erfolgsrate</div>
                    <div className="text-xl font-bold text-blue-600">
                      {(learningMetrics.successRate * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Das Deep Q-Learning System läuft optimal. Aktueller Verlust: {learningMetrics.dqnLoss.toFixed(4)}, 
                    {dqnNetworks.filter(n => n.isActive).length} aktive Netzwerke.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReinforcementLearningOptimizer