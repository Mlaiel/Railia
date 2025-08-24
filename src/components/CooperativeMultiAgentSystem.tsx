import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Drone, 
  Target, 
  Activity, 
  Network, 
  Eye,
  MapPin,
  Brain,
  Shield,
  Zap,
  Clock,
  BarChart3,
  Settings,
  Play,
  Pause,
  Square,
  Repeat,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Gauge,
  Wrench
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DroneAgent {
  id: string
  name: string
  role: 'leader' | 'scout' | 'inspector' | 'support'
  position: { x: number; y: number; z: number }
  battery: number
  status: 'active' | 'standby' | 'charging' | 'maintenance'
  capabilities: string[]
  currentTask: string | null
  coordination: {
    teamId: string
    communicationRange: number
    trustLevel: number
  }
}

interface MultiAgentMission {
  id: string
  name: string
  type: 'infrastructure' | 'emergency' | 'security' | 'maintenance'
  complexity: 'simple' | 'medium' | 'complex' | 'critical'
  assignedAgents: string[]
  status: 'planning' | 'active' | 'paused' | 'completed' | 'failed'
  progress: number
  startTime: string
  estimatedDuration: number
  objectives: string[]
  coordinationStrategy: 'hierarchical' | 'distributed' | 'hybrid'
}

interface CoordinationProtocol {
  id: string
  name: string
  strategy: 'consensus' | 'auction' | 'contract' | 'swarm'
  efficiency: number
  complexity: number
  reliability: number
}

export default function CooperativeMultiAgentSystem() {
  const [droneAgents, setDroneAgents] = useKV<DroneAgent[]>('multi-agent-drones', [
    {
      id: 'agent-alpha-01',
      name: 'Alpha Teamleiter',
      role: 'leader',
      position: { x: 52.520008, y: 13.404954, z: 100 },
      battery: 95,
      status: 'active',
      capabilities: ['coordination', 'communication', 'navigation', 'decision_making'],
      currentTask: 'Koordination Gleis-Inspektion Sektor 7',
      coordination: {
        teamId: 'team-alpha',
        communicationRange: 5000,
        trustLevel: 98
      }
    },
    {
      id: 'agent-beta-02',
      name: 'Beta Aufklärer',
      role: 'scout',
      position: { x: 52.521008, y: 13.405954, z: 80 },
      battery: 88,
      status: 'active',
      capabilities: ['thermal_imaging', 'high_resolution_camera', 'lidar', 'fast_movement'],
      currentTask: 'Vorausinspektion Brücke B-47',
      coordination: {
        teamId: 'team-alpha',
        communicationRange: 3000,
        trustLevel: 92
      }
    },
    {
      id: 'agent-gamma-03',
      name: 'Gamma Inspektor',
      role: 'inspector',
      position: { x: 52.519008, y: 13.403954, z: 60 },
      battery: 91,
      status: 'active',
      capabilities: ['ultrasonic_testing', 'magnetic_particle', 'visual_inspection', 'ai_analysis'],
      currentTask: 'Detailinspektion Schienen-Verschleiß',
      coordination: {
        teamId: 'team-alpha',
        communicationRange: 2500,
        trustLevel: 95
      }
    },
    {
      id: 'agent-delta-04',
      name: 'Delta Support',
      role: 'support',
      position: { x: 52.518008, y: 13.402954, z: 40 },
      battery: 76,
      status: 'standby',
      capabilities: ['emergency_response', 'backup_power', 'tool_delivery', 'data_relay'],
      currentTask: null,
      coordination: {
        teamId: 'team-alpha',
        communicationRange: 4000,
        trustLevel: 89
      }
    }
  ])

  const [activeMissions, setActiveMissions] = useKV<MultiAgentMission[]>('multi-agent-missions', [
    {
      id: 'mission-001',
      name: 'Komplette Brücken-Inspektion B-47',
      type: 'infrastructure',
      complexity: 'complex',
      assignedAgents: ['agent-alpha-01', 'agent-beta-02', 'agent-gamma-03'],
      status: 'active',
      progress: 67,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      estimatedDuration: 180,
      objectives: [
        'Strukturelle Integrität prüfen',
        'Verschleißanalyse durchführen',
        'Sicherheitsrisiken identifizieren',
        'Wartungsempfehlungen erstellen'
      ],
      coordinationStrategy: 'hierarchical'
    }
  ])

  const [coordinationProtocols] = useKV<CoordinationProtocol[]>('coordination-protocols', [
    {
      id: 'consensus-protocol',
      name: 'Konsens-Protokoll',
      strategy: 'consensus',
      efficiency: 85,
      complexity: 60,
      reliability: 95
    },
    {
      id: 'auction-protocol',
      name: 'Auktions-Protokoll',
      strategy: 'auction',
      efficiency: 92,
      complexity: 45,
      reliability: 88
    },
    {
      id: 'swarm-protocol',
      name: 'Schwarm-Protokoll',
      strategy: 'swarm',
      efficiency: 78,
      complexity: 75,
      reliability: 90
    }
  ])

  const [systemMetrics, setSystemMetrics] = useKV('multi-agent-metrics', {
    totalAgents: 4,
    activeTeams: 1,
    coordinationEfficiency: 89,
    communicationLatency: 0.023,
    taskCompletionRate: 94,
    autonomyLevel: 87
  })

  const [newMissionForm, setNewMissionForm] = useState({
    name: '',
    type: 'infrastructure' as MultiAgentMission['type'],
    complexity: 'medium' as MultiAgentMission['complexity'],
    objectives: '',
    coordinationStrategy: 'hierarchical' as MultiAgentMission['coordinationStrategy'],
    selectedAgents: [] as string[]
  })

  const [simulationRunning, setSimulationRunning] = useState(false)

  // Simuliere Agentenaktivitäten
  useEffect(() => {
    if (!simulationRunning) return

    const interval = setInterval(() => {
      setDroneAgents(currentAgents => 
        currentAgents.map(agent => {
          const batteryChange = Math.random() * 2 - 1
          const trustChange = Math.random() * 4 - 2
          
          return {
            ...agent,
            battery: Math.max(20, Math.min(100, agent.battery + batteryChange)),
            coordination: {
              ...agent.coordination,
              trustLevel: Math.max(50, Math.min(100, agent.coordination.trustLevel + trustChange))
            },
            position: {
              ...agent.position,
              x: agent.position.x + (Math.random() - 0.5) * 0.001,
              y: agent.position.y + (Math.random() - 0.5) * 0.001,
              z: Math.max(20, Math.min(200, agent.position.z + (Math.random() - 0.5) * 10))
            }
          }
        })
      )

      setActiveMissions(currentMissions =>
        currentMissions.map(mission => {
          if (mission.status === 'active') {
            const progressIncrease = Math.random() * 3
            const newProgress = Math.min(100, mission.progress + progressIncrease)
            
            return {
              ...mission,
              progress: newProgress,
              status: newProgress >= 100 ? 'completed' : 'active'
            }
          }
          return mission
        })
      )

      // Update system metrics
      setSystemMetrics(current => ({
        ...current,
        coordinationEfficiency: Math.max(70, Math.min(100, current.coordinationEfficiency + (Math.random() - 0.5) * 2)),
        communicationLatency: Math.max(0.01, Math.min(0.1, current.communicationLatency + (Math.random() - 0.5) * 0.01)),
        taskCompletionRate: Math.max(80, Math.min(100, current.taskCompletionRate + (Math.random() - 0.5) * 1)),
        autonomyLevel: Math.max(70, Math.min(95, current.autonomyLevel + (Math.random() - 0.5) * 2))
      }))

    }, 5000)

    return () => clearInterval(interval)
  }, [simulationRunning, setDroneAgents, setActiveMissions, setSystemMetrics])

  const handleCreateMission = () => {
    if (!newMissionForm.name || newMissionForm.selectedAgents.length === 0) {
      toast.error('Bitte alle erforderlichen Felder ausfüllen')
      return
    }

    const newMission: MultiAgentMission = {
      id: `mission-${Date.now()}`,
      name: newMissionForm.name,
      type: newMissionForm.type,
      complexity: newMissionForm.complexity,
      assignedAgents: newMissionForm.selectedAgents,
      status: 'planning',
      progress: 0,
      startTime: new Date().toISOString(),
      estimatedDuration: newMissionForm.complexity === 'simple' ? 60 : 
                        newMissionForm.complexity === 'medium' ? 120 :
                        newMissionForm.complexity === 'complex' ? 180 : 240,
      objectives: newMissionForm.objectives.split('\n').filter(obj => obj.trim()),
      coordinationStrategy: newMissionForm.coordinationStrategy
    }

    setActiveMissions(current => [...current, newMission])
    
    // Reset form
    setNewMissionForm({
      name: '',
      type: 'infrastructure',
      complexity: 'medium',
      objectives: '',
      coordinationStrategy: 'hierarchical',
      selectedAgents: []
    })

    toast.success(`Mission "${newMission.name}" erstellt`)
  }

  const startMission = (missionId: string) => {
    setActiveMissions(current =>
      current.map(mission =>
        mission.id === missionId
          ? { ...mission, status: 'active' as const, startTime: new Date().toISOString() }
          : mission
      )
    )
    toast.success('Mission gestartet')
  }

  const pauseMission = (missionId: string) => {
    setActiveMissions(current =>
      current.map(mission =>
        mission.id === missionId
          ? { ...mission, status: 'paused' as const }
          : mission
      )
    )
    toast.info('Mission pausiert')
  }

  const getRoleIcon = (role: DroneAgent['role']) => {
    switch (role) {
      case 'leader': return <Users size={16} className="text-blue-600" />
      case 'scout': return <Eye size={16} className="text-green-600" />
      case 'inspector': return <Target size={16} className="text-purple-600" />
      case 'support': return <Shield size={16} className="text-orange-600" />
    }
  }

  const getStatusColor = (status: DroneAgent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'standby': return 'bg-yellow-500'
      case 'charging': return 'bg-blue-500'
      case 'maintenance': return 'bg-red-500'
    }
  }

  const getMissionStatusColor = (status: MultiAgentMission['status']) => {
    switch (status) {
      case 'planning': return 'bg-gray-500'
      case 'active': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'failed': return 'bg-red-500'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            Kooperative Multi-Agent-Systeme
          </h1>
          <p className="text-muted-foreground mt-1">
            Koordinierte Drohnen-Schwärme für komplexe Inspektionsaufgaben
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={simulationRunning ? "destructive" : "default"}
            onClick={() => setSimulationRunning(!simulationRunning)}
            className="flex items-center gap-2"
          >
            {simulationRunning ? <Pause size={16} /> : <Play size={16} />}
            {simulationRunning ? 'Pause' : 'Simulation starten'}
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktive Agenten</p>
                <p className="text-2xl font-bold text-primary">{systemMetrics.totalAgents}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Drone size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Koordinationseffizienz</p>
                <p className="text-2xl font-bold text-green-600">{systemMetrics.coordinationEfficiency}%</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Network size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kommunikationslatenz</p>
                <p className="text-2xl font-bold text-blue-600">{systemMetrics.communicationLatency.toFixed(3)}s</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Autonomiegrad</p>
                <p className="text-2xl font-bold text-purple-600">{systemMetrics.autonomyLevel}%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain size={20} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">Agenten-Übersicht</TabsTrigger>
          <TabsTrigger value="missions">Missionen</TabsTrigger>
          <TabsTrigger value="coordination">Koordination</TabsTrigger>
          <TabsTrigger value="create">Mission erstellen</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          {/* Drone Agents Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {droneAgents.map(agent => (
              <Card key={agent.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getRoleIcon(agent.role)}
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription className="capitalize">{agent.role} • Team {agent.coordination.teamId}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                      <Badge variant="outline" className="capitalize">
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Battery and Trust Level */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Batterie</span>
                        <span className="font-medium">{agent.battery}%</span>
                      </div>
                      <Progress value={agent.battery} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Vertrauen</span>
                        <span className="font-medium">{agent.coordination.trustLevel}%</span>
                      </div>
                      <Progress value={agent.coordination.trustLevel} className="h-2" />
                    </div>
                  </div>

                  {/* Current Task */}
                  {agent.currentTask && (
                    <Alert>
                      <Activity size={16} />
                      <AlertDescription className="text-sm">
                        <strong>Aktuelle Aufgabe:</strong> {agent.currentTask}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Capabilities */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Fähigkeiten</h4>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.map(capability => (
                        <Badge key={capability} variant="secondary" className="text-xs">
                          {capability.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Position */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>
                      {agent.position.x.toFixed(6)}, {agent.position.y.toFixed(6)} • {agent.position.z}m
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="missions" className="space-y-6">
          {/* Active Missions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aktive Missionen</h3>
            {activeMissions.map(mission => (
              <Card key={mission.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{mission.name}</CardTitle>
                      <CardDescription>
                        {mission.type} • {mission.complexity} • {mission.coordinationStrategy}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getMissionStatusColor(mission.status)}`}></div>
                      <Badge variant="outline" className="capitalize">
                        {mission.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Fortschritt</span>
                      <span className="font-medium">{mission.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={mission.progress} className="h-3" />
                  </div>

                  {/* Mission Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Zugewiesene Agenten</h4>
                      <div className="space-y-1">
                        {mission.assignedAgents.map(agentId => {
                          const agent = droneAgents.find(a => a.id === agentId)
                          return agent ? (
                            <div key={agentId} className="flex items-center gap-2 text-sm">
                              {getRoleIcon(agent.role)}
                              <span>{agent.name}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Ziele</h4>
                      <ul className="text-sm space-y-1">
                        {mission.objectives.map((objective, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle size={12} className="text-green-600" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Mission Controls */}
                  <div className="flex gap-2 pt-2">
                    {mission.status === 'planning' && (
                      <Button 
                        size="sm" 
                        onClick={() => startMission(mission.id)}
                        className="flex items-center gap-2"
                      >
                        <Play size={14} />
                        Starten
                      </Button>
                    )}
                    {mission.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => pauseMission(mission.id)}
                        className="flex items-center gap-2"
                      >
                        <Pause size={14} />
                        Pausieren
                      </Button>
                    )}
                    {mission.status === 'paused' && (
                      <Button 
                        size="sm" 
                        onClick={() => startMission(mission.id)}
                        className="flex items-center gap-2"
                      >
                        <Play size={14} />
                        Fortsetzen
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coordination" className="space-y-6">
          {/* Coordination Protocols */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Koordinationsprotokolle</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coordinationProtocols.map(protocol => (
                <Card key={protocol.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{protocol.name}</CardTitle>
                    <CardDescription className="capitalize">{protocol.strategy}-Strategie</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Effizienz</span>
                          <span className="font-medium">{protocol.efficiency}%</span>
                        </div>
                        <Progress value={protocol.efficiency} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Komplexität</span>
                          <span className="font-medium">{protocol.complexity}%</span>
                        </div>
                        <Progress value={protocol.complexity} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Zuverlässigkeit</span>
                          <span className="font-medium">{protocol.reliability}%</span>
                        </div>
                        <Progress value={protocol.reliability} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          {/* Create New Mission */}
          <Card>
            <CardHeader>
              <CardTitle>Neue Multi-Agent-Mission erstellen</CardTitle>
              <CardDescription>
                Konfigurieren Sie eine neue kooperative Mission für Ihre Drohnen-Agenten
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mission-name">Missionsname</Label>
                  <Input
                    id="mission-name"
                    value={newMissionForm.name}
                    onChange={(e) => setNewMissionForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="z.B. Brückeninspektion B-47"
                  />
                </div>
                <div>
                  <Label htmlFor="mission-type">Missionstyp</Label>
                  <Select value={newMissionForm.type} onValueChange={(value: MultiAgentMission['type']) => 
                    setNewMissionForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">Infrastruktur</SelectItem>
                      <SelectItem value="emergency">Notfall</SelectItem>
                      <SelectItem value="security">Sicherheit</SelectItem>
                      <SelectItem value="maintenance">Wartung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mission-complexity">Komplexität</Label>
                  <Select value={newMissionForm.complexity} onValueChange={(value: MultiAgentMission['complexity']) => 
                    setNewMissionForm(prev => ({ ...prev, complexity: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Einfach (60min)</SelectItem>
                      <SelectItem value="medium">Mittel (120min)</SelectItem>
                      <SelectItem value="complex">Komplex (180min)</SelectItem>
                      <SelectItem value="critical">Kritisch (240min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="coordination-strategy">Koordinationsstrategie</Label>
                  <Select value={newMissionForm.coordinationStrategy} onValueChange={(value: MultiAgentMission['coordinationStrategy']) => 
                    setNewMissionForm(prev => ({ ...prev, coordinationStrategy: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hierarchical">Hierarchisch</SelectItem>
                      <SelectItem value="distributed">Verteilt</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="mission-objectives">Missionsziele (ein Ziel pro Zeile)</Label>
                <textarea
                  id="mission-objectives"
                  className="w-full p-3 border border-input rounded-md resize-none h-24"
                  value={newMissionForm.objectives}
                  onChange={(e) => setNewMissionForm(prev => ({ ...prev, objectives: e.target.value }))}
                  placeholder="Strukturelle Integrität prüfen&#10;Verschleißanalyse durchführen&#10;Sicherheitsrisiken identifizieren"
                />
              </div>

              <div>
                <Label>Agenten auswählen</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {droneAgents.map(agent => (
                    <div key={agent.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id={`agent-${agent.id}`}
                        checked={newMissionForm.selectedAgents.includes(agent.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewMissionForm(prev => ({
                              ...prev,
                              selectedAgents: [...prev.selectedAgents, agent.id]
                            }))
                          } else {
                            setNewMissionForm(prev => ({
                              ...prev,
                              selectedAgents: prev.selectedAgents.filter(id => id !== agent.id)
                            }))
                          }
                        }}
                        className="rounded"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        {getRoleIcon(agent.role)}
                        <div>
                          <div className="font-medium text-sm">{agent.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{agent.role}</div>
                        </div>
                      </div>
                      <Badge 
                        variant={agent.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateMission} className="w-full">
                Mission erstellen
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}