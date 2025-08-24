import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Drone,
  Brain,
  Users,
  Network,
  Activity,
  Target,
  MapPin,
  Lightning,
  Settings,
  TrendUp,
  Graph,
  Warning,
  CheckCircle,
  Clock,
  Globe,
  Gear,
  Eye,
  ShieldCheck,
  FlowArrow,
  ChartBar,
  Database,
  Cpu,
  Robot,
  Sparkle,
  TreeStructure,
  Atom,
  MathOperations,
  CircuitBoard,
  Play,
  Pause,
  ArrowsClockwise
} from '@phosphor-icons/react'

interface DroneUnit {
  id: string
  position: { x: number; y: number; z: number }
  status: 'active' | 'learning' | 'standby' | 'maintenance'
  aiLevel: number
  batteryLevel: number
  mission: string
  learningProgress: number
  cooperationScore: number
  specialization: 'scout' | 'inspector' | 'analyzer' | 'coordinator'
  experience: number
}

interface SwarmIntelligence {
  id: string
  name: string
  droneCount: number
  avgIntelligence: number
  cooperationEfficiency: number
  missionsCompleted: number
  learningRate: number
  adaptabilityScore: number
}

interface LearningModule {
  id: string
  name: string
  type: 'pattern_recognition' | 'decision_making' | 'cooperation' | 'navigation' | 'deep_rl' | 'neural_evolution' | 'meta_learning'
  progress: number
  accuracy: number
  status: 'training' | 'active' | 'updating'
}

interface DeepRLAgent {
  id: string
  name: string
  architecture: 'DQN' | 'A3C' | 'PPO' | 'SAC' | 'TD3' | 'Rainbow'
  explorationRate: number
  learningRate: number
  memorySize: number
  episodes: number
  rewards: number[]
  performanceScore: number
  complexityLevel: number
  status: 'training' | 'deployed' | 'evaluating'
}

interface NeuralNetwork {
  id: string
  layers: number[]
  activationFunction: string
  optimizer: string
  batchSize: number
  epochs: number
  loss: number
  accuracy: number
  computationalCost: number
}

interface SwarmStrategy {
  id: string
  name: string
  type: 'hierarchical' | 'distributed' | 'emergent' | 'hybrid'
  decisionComplexity: number
  coordinationEfficiency: number
  adaptabilityScore: number
  energyEfficiency: number
  scalabilityFactor: number
}

export default function SelfLearningDroneSwarms() {
  const [selectedSwarm, setSelectedSwarm] = useState<string>('alpha')
  const [selectedAgent, setSelectedAgent] = useState<string>('dqn-primary')
  const [isLearningActive, setIsLearningActive] = useKV('swarm-learning-active', true)
  const [realTimeMode, setRealTimeMode] = useKV('swarm-realtime-mode', false)
  const [deepRLEnabled, setDeepRLEnabled] = useKV('deep-rl-enabled', true)
  const [complexityLevel, setComplexityLevel] = useKV('complexity-level', [75])
  const [explorationRate, setExplorationRate] = useKV('exploration-rate', [0.15])
  const [learningRate, setLearningRate] = useKV('learning-rate', [0.001])

  // Drohnen-Schwarm-Daten
  const [swarms, setSwarms] = useKV<SwarmIntelligence[]>('drone-swarms', [
    {
      id: 'alpha',
      name: 'Alpha-Schwarm (Hauptbahnhof)',
      droneCount: 12,
      avgIntelligence: 87,
      cooperationEfficiency: 94,
      missionsCompleted: 2847,
      learningRate: 12.5,
      adaptabilityScore: 89
    },
    {
      id: 'beta',
      name: 'Beta-Schwarm (Fernstrecken)',
      droneCount: 8,
      avgIntelligence: 92,
      cooperationEfficiency: 88,
      missionsCompleted: 1923,
      learningRate: 15.2,
      adaptabilityScore: 93
    },
    {
      id: 'gamma',
      name: 'Gamma-Schwarm (Stadtverkehr)',
      droneCount: 15,
      avgIntelligence: 85,
      cooperationEfficiency: 91,
      missionsCompleted: 3651,
      learningRate: 11.8,
      adaptabilityScore: 86
    }
  ])

  const [drones, setDrones] = useKV<DroneUnit[]>('smart-drones', [
    {
      id: 'drone-001',
      position: { x: 45.2, y: 12.8, z: 25 },
      status: 'active',
      aiLevel: 89,
      batteryLevel: 87,
      mission: 'Gleisinspektion Sektor A-12',
      learningProgress: 94,
      cooperationScore: 96,
      specialization: 'scout',
      experience: 2847
    },
    {
      id: 'drone-002',
      position: { x: 47.1, y: 15.3, z: 30 },
      status: 'learning',
      aiLevel: 92,
      batteryLevel: 73,
      mission: 'KI-Training: Hinderniserkennung',
      learningProgress: 67,
      cooperationScore: 88,
      specialization: 'inspector',
      experience: 1923
    },
    {
      id: 'drone-003',
      position: { x: 43.8, y: 11.2, z: 22 },
      status: 'active',
      aiLevel: 85,
      batteryLevel: 91,
      mission: 'Wetteranalyse Streckenabschnitt 7',
      learningProgress: 88,
      cooperationScore: 93,
      specialization: 'analyzer',
      experience: 3156
    }
  ])

  const [learningModules, setLearningModules] = useKV<LearningModule[]>('learning-modules', [
    {
      id: 'pattern-rec',
      name: 'Mustererkennung',
      type: 'pattern_recognition',
      progress: 87,
      accuracy: 94.2,
      status: 'active'
    },
    {
      id: 'decision-ai',
      name: 'Entscheidungsfindung',
      type: 'decision_making',
      progress: 92,
      accuracy: 89.7,
      status: 'training'
    },
    {
      id: 'cooperation',
      name: 'Schwarm-Kooperation',
      type: 'cooperation',
      progress: 95,
      accuracy: 96.8,
      status: 'active'
    },
    {
      id: 'navigation',
      name: 'Adaptive Navigation',
      type: 'navigation',
      progress: 78,
      accuracy: 91.3,
      status: 'updating'
    },
    {
      id: 'deep-rl',
      name: 'Deep Reinforcement Learning',
      type: 'deep_rl',
      progress: 84,
      accuracy: 92.7,
      status: 'training'
    },
    {
      id: 'neural-evolution',
      name: 'Neuronale Evolution',
      type: 'neural_evolution',
      progress: 76,
      accuracy: 88.4,
      status: 'active'
    },
    {
      id: 'meta-learning',
      name: 'Meta-Learning',
      type: 'meta_learning',
      progress: 69,
      accuracy: 85.9,
      status: 'training'
    }
  ])

  // Deep RL Agenten
  const [deepRLAgents, setDeepRLAgents] = useKV<DeepRLAgent[]>('deep-rl-agents', [
    {
      id: 'dqn-primary',
      name: 'DQN Haupt-Agent',
      architecture: 'DQN',
      explorationRate: 0.15,
      learningRate: 0.001,
      memorySize: 100000,
      episodes: 15420,
      rewards: [245, 289, 312, 276, 334, 298, 356, 287, 421, 378],
      performanceScore: 87.3,
      complexityLevel: 75,
      status: 'deployed'
    },
    {
      id: 'ppo-coordination',
      name: 'PPO Koordinations-Agent',
      architecture: 'PPO',
      explorationRate: 0.08,
      learningRate: 0.0003,
      memorySize: 50000,
      episodes: 8920,
      rewards: [156, 198, 234, 267, 289, 245, 298, 321, 276, 334],
      performanceScore: 92.1,
      complexityLevel: 68,
      status: 'training'
    },
    {
      id: 'sac-adaptive',
      name: 'SAC Adaptions-Agent',
      architecture: 'SAC',
      explorationRate: 0.12,
      learningRate: 0.0005,
      memorySize: 75000,
      episodes: 12380,
      rewards: [198, 234, 276, 298, 334, 356, 389, 298, 445, 412],
      performanceScore: 89.7,
      complexityLevel: 82,
      status: 'evaluating'
    },
    {
      id: 'rainbow-master',
      name: 'Rainbow Master-Agent',
      architecture: 'Rainbow',
      explorationRate: 0.05,
      learningRate: 0.00025,
      memorySize: 200000,
      episodes: 23470,
      rewards: [289, 334, 378, 421, 456, 398, 523, 467, 589, 534],
      performanceScore: 94.6,
      complexityLevel: 95,
      status: 'deployed'
    }
  ])

  // Neuronale Netzwerk-Architekturen
  const [neuralNetworks, setNeuralNetworks] = useKV<NeuralNetwork[]>('neural-networks', [
    {
      id: 'primary-dqn',
      layers: [256, 512, 256, 128, 64],
      activationFunction: 'ReLU',
      optimizer: 'Adam',
      batchSize: 64,
      epochs: 1000,
      loss: 0.023,
      accuracy: 94.2,
      computationalCost: 67
    },
    {
      id: 'cooperation-net',
      layers: [512, 1024, 512, 256, 128],
      activationFunction: 'Swish',
      optimizer: 'AdamW',
      batchSize: 128,
      epochs: 2500,
      loss: 0.018,
      accuracy: 96.7,
      computationalCost: 84
    },
    {
      id: 'meta-network',
      layers: [128, 256, 512, 256, 64],
      activationFunction: 'GELU',
      optimizer: 'RMSprop',
      batchSize: 32,
      epochs: 800,
      loss: 0.031,
      accuracy: 91.8,
      computationalCost: 52
    }
  ])

  // Schwarm-Strategien
  const [swarmStrategies, setSwarmStrategies] = useKV<SwarmStrategy[]>('swarm-strategies', [
    {
      id: 'hierarchical',
      name: 'Hierarchische Koordination',
      type: 'hierarchical',
      decisionComplexity: 85,
      coordinationEfficiency: 92,
      adaptabilityScore: 78,
      energyEfficiency: 88,
      scalabilityFactor: 94
    },
    {
      id: 'distributed',
      name: 'Verteilte Intelligenz',
      type: 'distributed',
      decisionComplexity: 92,
      coordinationEfficiency: 87,
      adaptabilityScore: 95,
      energyEfficiency: 83,
      scalabilityFactor: 98
    },
    {
      id: 'emergent',
      name: 'Emergente Schwarm-KI',
      type: 'emergent',
      decisionComplexity: 98,
      coordinationEfficiency: 89,
      adaptabilityScore: 97,
      energyEfficiency: 79,
      scalabilityFactor: 91
    },
    {
      id: 'hybrid',
      name: 'Hybrid Deep-RL System',
      type: 'hybrid',
      decisionComplexity: 96,
      coordinationEfficiency: 94,
      adaptabilityScore: 93,
      energyEfficiency: 91,
      scalabilityFactor: 96
    }
  ])

  // Echtzeit-Updates simulieren
  useEffect(() => {
    if (!realTimeMode) return

    const interval = setInterval(() => {
      // Drohnen-Updates simulieren
      setDrones(currentDrones => 
        currentDrones.map(drone => ({
          ...drone,
          aiLevel: Math.min(100, drone.aiLevel + Math.random() * 0.5),
          learningProgress: Math.min(100, drone.learningProgress + Math.random() * 1.2),
          cooperationScore: Math.min(100, drone.cooperationScore + Math.random() * 0.3),
          batteryLevel: Math.max(0, drone.batteryLevel - Math.random() * 0.1)
        }))
      )

      // Lernmodule aktualisieren
      setLearningModules(currentModules =>
        currentModules.map(module => ({
          ...module,
          progress: Math.min(100, module.progress + Math.random() * 0.8),
          accuracy: Math.min(100, module.accuracy + Math.random() * 0.2)
        }))
      )

      // Deep RL Agenten aktualisieren
      setDeepRLAgents(currentAgents =>
        currentAgents.map(agent => ({
          ...agent,
          episodes: agent.episodes + Math.floor(Math.random() * 5),
          performanceScore: Math.min(100, agent.performanceScore + Math.random() * 0.3),
          rewards: [...agent.rewards.slice(1), agent.rewards[agent.rewards.length - 1] + Math.random() * 50 - 25]
        }))
      )

      // Neuronale Netzwerke aktualisieren
      setNeuralNetworks(currentNetworks =>
        currentNetworks.map(network => ({
          ...network,
          loss: Math.max(0.001, network.loss - Math.random() * 0.002),
          accuracy: Math.min(100, network.accuracy + Math.random() * 0.1),
          epochs: network.epochs + Math.floor(Math.random() * 10)
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [realTimeMode, setDrones, setLearningModules, setDeepRLAgents, setNeuralNetworks])

  const selectedSwarmData = swarms.find(s => s.id === selectedSwarm)
  const selectedAgentData = deepRLAgents.find(a => a.id === selectedAgent)
  const swarmDrones = drones.filter(d => d.status !== 'maintenance')

  const initiateLearningSession = () => {
    toast.success('Neues Deep-RL Lernszenario gestartet', {
      description: 'Drohnen-Schwarm beginnt mit fortgeschrittenem Reinforcement Learning'
    })
    
    setDrones(currentDrones =>
      currentDrones.map(drone => ({
        ...drone,
        status: Math.random() > 0.7 ? 'learning' : drone.status,
        mission: drone.status === 'learning' ? 'Deep-RL Training: Komplexe Entscheidungen' : drone.mission
      }))
    )
  }

  const optimizeSwarmCooperation = () => {
    toast.success('Deep-RL Schwarm-Optimierung aktiviert', {
      description: 'Neuronale Netzwerke verbessern komplexe Entscheidungsalgorithmen'
    })
    
    setSwarms(currentSwarms =>
      currentSwarms.map(swarm => 
        swarm.id === selectedSwarm
          ? {
              ...swarm,
              cooperationEfficiency: Math.min(100, swarm.cooperationEfficiency + 2),
              learningRate: swarm.learningRate + 0.5,
              adaptabilityScore: Math.min(100, swarm.adaptabilityScore + 1.5)
            }
          : swarm
      )
    )
  }

  const startDeepRLTraining = () => {
    toast.success('Deep Reinforcement Learning Training gestartet', {
      description: 'Erweiterte neuronale Netzwerke beginnen komplexes Training'
    })
    
    setDeepRLAgents(currentAgents =>
      currentAgents.map(agent => ({
        ...agent,
        status: 'training',
        episodes: agent.episodes + 1,
        explorationRate: Math.max(0.01, agent.explorationRate * 0.995)
      }))
    )
  }

  const deployOptimizedAgent = () => {
    if (!selectedAgentData) return
    
    toast.success(`${selectedAgentData.name} optimiert und deployed`, {
      description: 'Deep-RL Agent ist bereit für komplexe Missionen'
    })
    
    setDeepRLAgents(currentAgents =>
      currentAgents.map(agent => 
        agent.id === selectedAgent
          ? { ...agent, status: 'deployed', performanceScore: Math.min(100, agent.performanceScore + 2) }
          : agent
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'learning': return 'bg-blue-500'
      case 'standby': return 'bg-yellow-500'
      case 'maintenance': return 'bg-red-500'
      case 'training': return 'bg-blue-500'
      case 'deployed': return 'bg-green-500'
      case 'evaluating': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getArchitectureColor = (architecture: string) => {
    switch (architecture) {
      case 'DQN': return 'bg-blue-500'
      case 'PPO': return 'bg-green-500'
      case 'SAC': return 'bg-purple-500'
      case 'A3C': return 'bg-orange-500'
      case 'TD3': return 'bg-pink-500'
      case 'Rainbow': return 'bg-gradient-to-r from-purple-500 to-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const getNetworkComplexityLabel = (layers: number[]) => {
    const totalParams = layers.reduce((acc, curr, index) => 
      index < layers.length - 1 ? acc + (curr * layers[index + 1]) : acc, 0
    )
    if (totalParams > 500000) return 'Sehr komplex'
    if (totalParams > 100000) return 'Komplex'
    if (totalParams > 50000) return 'Mittel'
    return 'Einfach'
  }

  const getSpecializationIcon = (specialization: string) => {
    switch (specialization) {
      case 'scout': return <Eye size={16} />
      case 'inspector': return <ShieldCheck size={16} />
      case 'analyzer': return <Brain size={16} />
      case 'coordinator': return <Network size={16} />
      default: return <Drone size={16} />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Users size={24} className="text-primary-foreground" />
            </div>
            Selbstlernende Drohnen-Schwärme
          </h1>
          <p className="text-muted-foreground mt-2">
            Kooperative KI-Intelligenz für autonome Bahnnetz-Überwachung
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setRealTimeMode(!realTimeMode)}
            variant={realTimeMode ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Activity size={16} />
            {realTimeMode ? 'Echtzeit aktiv' : 'Echtzeit starten'}
          </Button>
          
          <Button
            onClick={initiateLearningSession}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Brain size={16} />
            Deep-RL Training
          </Button>
          
          <Button
            onClick={optimizeSwarmCooperation}
            className="flex items-center gap-2"
          >
            <Lightning size={16} />
            Schwarm optimieren
          </Button>
          
          <Button
            onClick={startDeepRLTraining}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Cpu size={16} />
            RL-Training starten
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Drohnen</p>
                <p className="text-2xl font-bold">{swarmDrones.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Drone size={24} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Durchschnittliche KI-Level</p>
                <p className="text-2xl font-bold">
                  {Math.round(swarmDrones.reduce((acc, d) => acc + d.aiLevel, 0) / swarmDrones.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Brain size={24} className="text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kooperations-Effizienz</p>
                <p className="text-2xl font-bold">{selectedSwarmData?.cooperationEfficiency}%</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lerngeschwindigkeit</p>
                <p className="text-2xl font-bold">{selectedSwarmData?.learningRate}x</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <TrendUp size={24} className="text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="swarms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="swarms">Schwarm-Übersicht</TabsTrigger>
          <TabsTrigger value="deep-rl">Deep RL Agenten</TabsTrigger>
          <TabsTrigger value="neural-nets">Neuronale Netzwerke</TabsTrigger>
          <TabsTrigger value="strategies">Schwarm-Strategien</TabsTrigger>
          <TabsTrigger value="learning">KI-Lernmodule</TabsTrigger>
          <TabsTrigger value="cooperation">Kooperations-KI</TabsTrigger>
        </TabsList>

        <TabsContent value="swarms">
          <div className="space-y-6">
            {/* Schwarm-Auswahl */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network size={20} />
                  Drohnen-Schwärme
                </CardTitle>
                <CardDescription>
                  Wählen Sie einen Schwarm für detaillierte Analyse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {swarms.map((swarm) => (
                    <Card 
                      key={swarm.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedSwarm === swarm.id 
                          ? 'ring-2 ring-primary border-primary' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedSwarm(swarm.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{swarm.name}</h3>
                            <Badge variant={selectedSwarm === swarm.id ? "default" : "outline"}>
                              {swarm.droneCount} Drohnen
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>KI-Level:</span>
                              <span className="font-medium">{swarm.avgIntelligence}%</span>
                            </div>
                            <Progress value={swarm.avgIntelligence} className="h-2" />
                            
                            <div className="flex justify-between text-sm">
                              <span>Kooperation:</span>
                              <span className="font-medium">{swarm.cooperationEfficiency}%</span>
                            </div>
                            <Progress value={swarm.cooperationEfficiency} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center p-2 bg-secondary/50 rounded">
                              <div className="font-semibold">{swarm.missionsCompleted}</div>
                              <div className="text-muted-foreground">Missionen</div>
                            </div>
                            <div className="text-center p-2 bg-secondary/50 rounded">
                              <div className="font-semibold">{swarm.adaptabilityScore}%</div>
                              <div className="text-muted-foreground">Anpassung</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detaillierte Schwarm-Analyse */}
            {selectedSwarmData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBar size={20} />
                    {selectedSwarmData.name} - Detailanalyse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Leistungsmetriken</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Durchschnittliche Intelligenz</span>
                            <span className="text-sm font-medium">{selectedSwarmData.avgIntelligence}%</span>
                          </div>
                          <Progress value={selectedSwarmData.avgIntelligence} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Kooperationseffizienz</span>
                            <span className="text-sm font-medium">{selectedSwarmData.cooperationEfficiency}%</span>
                          </div>
                          <Progress value={selectedSwarmData.cooperationEfficiency} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Anpassungsfähigkeit</span>
                            <span className="text-sm font-medium">{selectedSwarmData.adaptabilityScore}%</span>
                          </div>
                          <Progress value={selectedSwarmData.adaptabilityScore} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Schwarm-Statistiken</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{selectedSwarmData.missionsCompleted}</div>
                          <div className="text-sm text-muted-foreground">Abgeschlossene Missionen</div>
                        </div>
                        
                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                          <div className="text-2xl font-bold text-blue-500">{selectedSwarmData.learningRate}x</div>
                          <div className="text-sm text-muted-foreground">Lerngeschwindigkeit</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="deep-rl">
          <div className="space-y-6">
            {/* Deep RL Agent-Übersicht */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Robot size={20} />
                      Deep Reinforcement Learning Agenten
                    </CardTitle>
                    <CardDescription>
                      Fortgeschrittene neuronale Agenten für komplexe Entscheidungsfindung
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="deep-rl-mode"
                        checked={deepRLEnabled}
                        onCheckedChange={setDeepRLEnabled}
                      />
                      <Label htmlFor="deep-rl-mode" className="text-sm font-medium">
                        Deep RL aktiviert
                      </Label>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {deepRLAgents.map((agent) => (
                    <Card 
                      key={agent.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedAgent === agent.id 
                          ? 'ring-2 ring-primary border-primary' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedAgent(agent.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getArchitectureColor(agent.architecture)}`}></div>
                              <h3 className="font-semibold">{agent.name}</h3>
                            </div>
                            <Badge 
                              variant={agent.status === 'deployed' ? "default" : 
                                     agent.status === 'training' ? "secondary" : "outline"}
                              className="capitalize"
                            >
                              {agent.status === 'deployed' ? 'Deployed' :
                               agent.status === 'training' ? 'Training' : 'Evaluiert'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="space-y-1">
                              <span className="text-muted-foreground">Architektur:</span>
                              <div className="font-medium">{agent.architecture}</div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground">Episoden:</span>
                              <div className="font-medium">{agent.episodes.toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Performance:</span>
                                <span className="font-medium">{agent.performanceScore.toFixed(1)}%</span>
                              </div>
                              <Progress value={agent.performanceScore} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Komplexität:</span>
                                <span className="font-medium">{agent.complexityLevel}%</span>
                              </div>
                              <Progress value={agent.complexityLevel} className="h-2" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-secondary/30 rounded">
                              <div className="font-semibold">{agent.explorationRate.toFixed(3)}</div>
                              <div className="text-muted-foreground">Exploration</div>
                            </div>
                            <div className="text-center p-2 bg-secondary/30 rounded">
                              <div className="font-semibold">{agent.learningRate.toFixed(4)}</div>
                              <div className="text-muted-foreground">Learn Rate</div>
                            </div>
                            <div className="text-center p-2 bg-secondary/30 rounded">
                              <div className="font-semibold">{(agent.memorySize / 1000).toFixed(0)}K</div>
                              <div className="text-muted-foreground">Memory</div>
                            </div>
                          </div>
                          
                          {/* Reward Verlauf (Mini-Chart) */}
                          <div className="space-y-2">
                            <span className="text-sm font-medium">Reward-Verlauf:</span>
                            <div className="flex items-end gap-1 h-8">
                              {agent.rewards.slice(-10).map((reward, index) => (
                                <div
                                  key={index}
                                  className="bg-primary rounded-t flex-1"
                                  style={{
                                    height: `${(reward / Math.max(...agent.rewards)) * 100}%`,
                                    minHeight: '2px'
                                  }}
                                />
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground text-center">
                              Letzte 10 Episoden: Ø {(agent.rewards.slice(-10).reduce((a, b) => a + b, 0) / 10).toFixed(1)} Punkte
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deep RL Konfiguration */}
            {selectedAgentData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings size={20} />
                    {selectedAgentData.name} - Konfiguration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Exploration Rate: {explorationRate[0].toFixed(3)}
                          </Label>
                          <Slider
                            value={explorationRate}
                            onValueChange={setExplorationRate}
                            max={1}
                            min={0.001}
                            step={0.001}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Learning Rate: {learningRate[0].toFixed(4)}
                          </Label>
                          <Slider
                            value={learningRate}
                            onValueChange={setLearningRate}
                            max={0.01}
                            min={0.0001}
                            step={0.0001}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Komplexitätslevel: {complexityLevel[0]}%
                          </Label>
                          <Slider
                            value={complexityLevel}
                            onValueChange={setComplexityLevel}
                            max={100}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button onClick={startDeepRLTraining} className="flex items-center gap-2">
                          <Play size={16} />
                          Training starten
                        </Button>
                        <Button onClick={deployOptimizedAgent} variant="outline" className="flex items-center gap-2">
                          <CheckCircle size={16} />
                          Agent deployen
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Agent-Statistiken</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between p-3 bg-secondary/30 rounded-lg">
                          <span className="text-sm">Durchschnittlicher Reward:</span>
                          <span className="font-semibold">
                            {(selectedAgentData.rewards.reduce((a, b) => a + b, 0) / selectedAgentData.rewards.length).toFixed(1)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between p-3 bg-secondary/30 rounded-lg">
                          <span className="text-sm">Bester Reward:</span>
                          <span className="font-semibold">{Math.max(...selectedAgentData.rewards)}</span>
                        </div>
                        
                        <div className="flex justify-between p-3 bg-secondary/30 rounded-lg">
                          <span className="text-sm">Training-Sessions:</span>
                          <span className="font-semibold">{selectedAgentData.episodes.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between p-3 bg-secondary/30 rounded-lg">
                          <span className="text-sm">Memory-Auslastung:</span>
                          <span className="font-semibold">
                            {((selectedAgentData.memorySize * 0.85) / 1000).toFixed(0)}K / {(selectedAgentData.memorySize / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="neural-nets">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircuitBoard size={20} />
                Neuronale Netzwerk-Architekturen
              </CardTitle>
              <CardDescription>
                Fortgeschrittene Deep Learning Netzwerke für Drohnen-KI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {neuralNetworks.map((network) => (
                  <Card key={network.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h3 className="font-semibold capitalize">{network.id.replace('-', ' ')}</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Aktivierung:</span>
                              <Badge variant="outline">{network.activationFunction}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Optimizer:</span>
                              <Badge variant="outline">{network.optimizer}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Komplexität:</span>
                              <Badge variant="secondary">{getNetworkComplexityLabel(network.layers)}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-medium">Netzwerk-Architektur</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            {network.layers.map((neurons, index) => (
                              <div key={index} className="flex items-center gap-1">
                                <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                                  {neurons}
                                </div>
                                {index < network.layers.length - 1 && (
                                  <ArrowsClockwise size={12} className="text-muted-foreground" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Parameter: ~{network.layers.reduce((acc, curr, idx) => 
                              idx < network.layers.length - 1 ? acc + (curr * network.layers[idx + 1]) : acc, 0
                            ).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-medium">Performance-Metriken</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Genauigkeit:</span>
                                <span className="font-medium">{network.accuracy.toFixed(1)}%</span>
                              </div>
                              <Progress value={network.accuracy} className="h-2" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="text-center p-2 bg-secondary/30 rounded">
                                <div className="font-semibold">{network.loss.toFixed(4)}</div>
                                <div className="text-muted-foreground">Loss</div>
                              </div>
                              <div className="text-center p-2 bg-secondary/30 rounded">
                                <div className="font-semibold">{network.epochs.toLocaleString()}</div>
                                <div className="text-muted-foreground">Epochen</div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Rechenaufwand:</span>
                                <span className="font-medium">{network.computationalCost}%</span>
                              </div>
                              <Progress value={network.computationalCost} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreeStructure size={20} />
                Schwarm-Intelligenz-Strategien
              </CardTitle>
              <CardDescription>
                Verschiedene Ansätze für koordinierte Drohnen-Entscheidungsfindung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {swarmStrategies.map((strategy) => (
                  <Card key={strategy.id} className="transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{strategy.name}</h3>
                          <Badge 
                            variant={strategy.type === 'hybrid' ? "default" : "outline"}
                            className="capitalize"
                          >
                            {strategy.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Entscheidungskomplexität</div>
                            <div className="flex items-center gap-2">
                              <Progress value={strategy.decisionComplexity} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{strategy.decisionComplexity}%</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Koordinationseffizienz</div>
                            <div className="flex items-center gap-2">
                              <Progress value={strategy.coordinationEfficiency} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{strategy.coordinationEfficiency}%</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Anpassungsfähigkeit</div>
                            <div className="flex items-center gap-2">
                              <Progress value={strategy.adaptabilityScore} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{strategy.adaptabilityScore}%</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Energieeffizienz</div>
                            <div className="flex items-center gap-2">
                              <Progress value={strategy.energyEfficiency} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{strategy.energyEfficiency}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-lg font-bold text-primary">{strategy.scalabilityFactor}%</div>
                          <div className="text-xs text-muted-foreground">Skalierbarkeit</div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {strategy.type === 'hierarchical' && 'Zentrale Koordination mit klaren Befehlsketten'}
                          {strategy.type === 'distributed' && 'Dezentrale Entscheidungsfindung auf allen Ebenen'}
                          {strategy.type === 'emergent' && 'Selbstorganisierende Schwarm-Intelligenz'}
                          {strategy.type === 'hybrid' && 'Kombination verschiedener KI-Ansätze für optimale Leistung'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drones">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Drone size={20} />
                Einzelne Drohnen-Einheiten
              </CardTitle>
              <CardDescription>
                Detaillierte Übersicht aller Drohnen im ausgewählten Schwarm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {swarmDrones.map((drone) => (
                  <Card key={drone.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(drone.status)}`}></div>
                            <span className="font-semibold">{drone.id}</span>
                            <Badge variant="outline" className="text-xs">
                              {getSpecializationIcon(drone.specialization)}
                              <span className="ml-1 capitalize">{drone.specialization}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{drone.mission}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <MapPin size={12} />
                            <span>
                              {drone.position.x.toFixed(1)}, {drone.position.y.toFixed(1)}, {drone.position.z}m
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>KI-Level:</span>
                              <span className="font-medium">{drone.aiLevel.toFixed(1)}%</span>
                            </div>
                            <Progress value={drone.aiLevel} className="h-1.5" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Batterie:</span>
                              <span className="font-medium">{drone.batteryLevel.toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={drone.batteryLevel} 
                              className="h-1.5"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Lernfortschritt:</span>
                              <span className="font-medium">{drone.learningProgress.toFixed(1)}%</span>
                            </div>
                            <Progress value={drone.learningProgress} className="h-1.5" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Kooperation:</span>
                              <span className="font-medium">{drone.cooperationScore.toFixed(1)}%</span>
                            </div>
                            <Progress value={drone.cooperationScore} className="h-1.5" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-center p-2 bg-secondary/30 rounded">
                            <div className="text-lg font-bold">{drone.experience}</div>
                            <div className="text-xs text-muted-foreground">Erfahrungspunkte</div>
                          </div>
                          
                          <Badge 
                            variant={drone.status === 'active' ? "default" : 
                                   drone.status === 'learning' ? "secondary" : "outline"}
                            className="w-full justify-center capitalize"
                          >
                            {drone.status === 'active' ? 'Aktiv' :
                             drone.status === 'learning' ? 'Lernt' :
                             drone.status === 'standby' ? 'Bereitschaft' : 'Wartung'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain size={20} />
                Erweiterte KI-Lernmodule
              </CardTitle>
              <CardDescription>
                Fortschrittliche Algorithmen inkl. Deep Reinforcement Learning für selbstlernende Drohnen-Intelligenz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {learningModules.map((module) => (
                  <Card key={module.id}>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{module.name}</h3>
                          <Badge 
                            variant={module.status === 'active' ? "default" : 
                                   module.status === 'training' ? "secondary" : "outline"}
                          >
                            {module.status === 'active' ? 'Aktiv' :
                             module.status === 'training' ? 'Training' : 'Aktualisiert'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Trainingsfortschritt:</span>
                              <span className="font-medium">{module.progress.toFixed(1)}%</span>
                            </div>
                            <Progress value={module.progress} />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Genauigkeit:</span>
                              <span className="font-medium">{module.accuracy.toFixed(1)}%</span>
                            </div>
                            <Progress value={module.accuracy} />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {module.type === 'deep_rl' && <Cpu size={14} />}
                          {module.type === 'neural_evolution' && <Atom size={14} />}
                          {module.type === 'meta_learning' && <Sparkle size={14} />}
                          {['pattern_recognition', 'decision_making', 'cooperation', 'navigation'].includes(module.type) && <Database size={14} />}
                          <span className="capitalize">{module.type.replace('_', ' ')}</span>
                        </div>
                        
                        {module.type === 'deep_rl' && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <div className="text-xs font-medium text-blue-700 mb-1">Deep RL Features:</div>
                            <div className="text-xs text-blue-600">
                              • Multi-Agent Learning<br/>
                              • Experience Replay<br/>
                              • Policy Optimization
                            </div>
                          </div>
                        )}
                        
                        {module.type === 'neural_evolution' && (
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <div className="text-xs font-medium text-purple-700 mb-1">Evolution Features:</div>
                            <div className="text-xs text-purple-600">
                              • Genetic Algorithms<br/>
                              • Network Mutation<br/>
                              • Population-based Training
                            </div>
                          </div>
                        )}
                        
                        {module.type === 'meta_learning' && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="text-xs font-medium text-green-700 mb-1">Meta Learning:</div>
                            <div className="text-xs text-green-600">
                              • Few-Shot Learning<br/>
                              • Adaptive Algorithms<br/>
                              • Transfer Learning
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cooperation">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network size={20} />
                  Deep-RL Kooperative Intelligenz
                </CardTitle>
                <CardDescription>
                  Erweiterte Schwarm-Koordination mit Deep Reinforcement Learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Klassische Schwarm-Koordination</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FlowArrow size={16} className="text-primary" />
                          <span className="text-sm">Kommunikationseffizienz</span>
                        </div>
                        <span className="font-semibold">96.4%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target size={16} className="text-blue-500" />
                          <span className="text-sm">Aufgabenverteilung</span>
                        </div>
                        <span className="font-semibold">94.1%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Lightning size={16} className="text-yellow-500" />
                          <span className="text-sm">Reaktionszeit</span>
                        </div>
                        <span className="font-semibold">0.3s</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Deep-RL Entscheidungen</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Robot size={16} className="text-blue-600" />
                          <span className="text-sm">Policy-Optimierung</span>
                        </div>
                        <span className="font-semibold text-blue-600">92.8%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <MathOperations size={16} className="text-green-600" />
                          <span className="text-sm">Q-Value Konvergenz</span>
                        </div>
                        <span className="font-semibold text-green-600">89.3%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2">
                          <Atom size={16} className="text-purple-600" />
                          <span className="text-sm">Multi-Agent Reward</span>
                        </div>
                        <span className="font-semibold text-purple-600">347.2</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Erweiterte Metriken</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Kollektive RL-Performance:</span>
                          <span className="font-medium">91.7%</span>
                        </div>
                        <Progress value={91.7} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Exploration vs Exploitation:</span>
                          <span className="font-medium">87.2%</span>
                        </div>
                        <Progress value={87.2} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Deep-RL Konvergenz:</span>
                          <span className="font-medium">94.5%</span>
                        </div>
                        <Progress value={94.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircuitBoard size={20} />
                    Multi-Agent Deep-RL Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deepRLAgents.filter(agent => agent.status === 'deployed').map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getArchitectureColor(agent.architecture)}`}></div>
                          <div>
                            <div className="font-medium text-sm">{agent.name}</div>
                            <div className="text-xs text-muted-foreground">{agent.architecture}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">{agent.performanceScore.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Performance</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkle size={20} />
                    Emergente Schwarm-Eigenschaften
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="font-medium text-sm text-green-700 mb-1">Kollektive Intelligenz</div>
                      <div className="text-xs text-green-600">
                        Deep-RL Agenten entwickeln emergente Kooperationsstrategien, die über programmierte Verhaltensweisen hinausgehen.
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="font-medium text-sm text-purple-700 mb-1">Adaptive Spezialisierung</div>
                      <div className="text-xs text-purple-600">
                        Drohnen entwickeln automatisch Expertisen für spezifische Aufgabenbereiche durch Reinforcement Learning.
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="font-medium text-sm text-orange-700 mb-1">Resiliente Koordination</div>
                      <div className="text-xs text-orange-600">
                        Selbstheilende Schwarm-Strukturen durch Deep-RL basierte Redundanz- und Ausfallkompensation.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <CheckCircle size={16} />
              <AlertDescription>
                <strong>Deep Reinforcement Learning aktiv:</strong> Schwarm-KI nutzt fortgeschrittene neuronale Netzwerke 
                für komplexe Entscheidungsfindung. Aktuelle Verbesserung: +4.7% in Multi-Agent-Koordination durch 
                Rainbow DQN Integration.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}