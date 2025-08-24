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
  Network,
  Brain,
  Shield,
  Activity,
  Users,
  Globe,
  Lock,
  TrendUp,
  Target,
  Cpu,
  Eye,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Database,
  Download,
  Upload
} from '@phosphor-icons/react'

interface FederatedNode {
  id: string
  name: string
  location: string
  nodeType: 'bahnhof' | 'leitstelle' | 'werkstatt' | 'zentrale'
  status: 'online' | 'offline' | 'training' | 'synchronizing'
  dataPoints: number
  modelAccuracy: number
  lastUpdate: string
  bandwidth: number
  latency: number
  security: 'hoch' | 'mittel' | 'niedrig'
  computePower: number
  privacyLevel: number
}

interface FederatedModel {
  id: string
  name: string
  task: string
  accuracy: number
  rounds: number
  participants: number
  dataPrivacy: boolean
  modelSize: number
  convergenceRate: number
  lastAggregation: string
  status: 'training' | 'aggregating' | 'deployed' | 'testing'
}

interface TrainingRound {
  id: string
  round: number
  participants: string[]
  globalAccuracy: number
  localAccuracies: number[]
  communicationCost: number
  duration: number
  privacyBudget: number
  convergence: number
  status: 'completed' | 'running' | 'failed'
}

export default function FederatedLearningSystem() {
  const [isTraining, setIsTraining] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>('delay-prediction')
  const [privacyMode, setPrivacyMode] = useState(true)

  const [federatedNodes, setFederatedNodes] = useKV<FederatedNode[]>('federated-nodes', [
    {
      id: 'berlin-hbf',
      name: 'Berlin Hauptbahnhof',
      location: 'Berlin',
      nodeType: 'bahnhof',
      status: 'training',
      dataPoints: 125000,
      modelAccuracy: 94.7,
      lastUpdate: new Date(Date.now() - 5000).toISOString(),
      bandwidth: 1000,
      latency: 12,
      security: 'hoch',
      computePower: 85,
      privacyLevel: 98
    },
    {
      id: 'munich-hbf',
      name: 'München Hauptbahnhof',
      location: 'München',
      nodeType: 'bahnhof',
      status: 'online',
      dataPoints: 98000,
      modelAccuracy: 92.3,
      lastUpdate: new Date(Date.now() - 15000).toISOString(),
      bandwidth: 800,
      latency: 18,
      security: 'hoch',
      computePower: 78,
      privacyLevel: 96
    },
    {
      id: 'hamburg-hbf',
      name: 'Hamburg Hauptbahnhof',
      location: 'Hamburg',
      nodeType: 'bahnhof',
      status: 'synchronizing',
      dataPoints: 87000,
      modelAccuracy: 91.8,
      lastUpdate: new Date(Date.now() - 8000).toISOString(),
      bandwidth: 750,
      latency: 22,
      security: 'hoch',
      computePower: 72,
      privacyLevel: 94
    },
    {
      id: 'cologne-leitstelle',
      name: 'Köln Leitstelle',
      location: 'Köln',
      nodeType: 'leitstelle',
      status: 'online',
      dataPoints: 156000,
      modelAccuracy: 96.1,
      lastUpdate: new Date(Date.now() - 25000).toISOString(),
      bandwidth: 1200,
      latency: 8,
      security: 'hoch',
      computePower: 92,
      privacyLevel: 99
    },
    {
      id: 'frankfurt-werkstatt',
      name: 'Frankfurt Werkstatt',
      location: 'Frankfurt',
      nodeType: 'werkstatt',
      status: 'offline',
      dataPoints: 45000,
      modelAccuracy: 88.5,
      lastUpdate: new Date(Date.now() - 120000).toISOString(),
      bandwidth: 500,
      latency: 35,
      security: 'mittel',
      computePower: 55,
      privacyLevel: 91
    },
    {
      id: 'db-zentrale',
      name: 'DB Zentrale',
      location: 'Berlin',
      nodeType: 'zentrale',
      status: 'training',
      dataPoints: 500000,
      modelAccuracy: 97.8,
      lastUpdate: new Date(Date.now() - 3000).toISOString(),
      bandwidth: 2000,
      latency: 5,
      security: 'hoch',
      computePower: 98,
      privacyLevel: 99
    }
  ])

  const [federatedModels, setFederatedModels] = useKV<FederatedModel[]>('federated-models', [
    {
      id: 'delay-prediction',
      name: 'Verspätungs-Vorhersage',
      task: 'Prognose von Zugverspätungen basierend auf lokalen Daten',
      accuracy: 95.4,
      rounds: 127,
      participants: 5,
      dataPrivacy: true,
      modelSize: 45.2,
      convergenceRate: 0.98,
      lastAggregation: new Date(Date.now() - 15000).toISOString(),
      status: 'training'
    },
    {
      id: 'passenger-flow',
      name: 'Fahrgast-Strom-Analyse',
      task: 'Optimierung der Fahrgastverteilung in Echtzeit',
      accuracy: 92.1,
      rounds: 89,
      participants: 4,
      dataPrivacy: true,
      modelSize: 32.8,
      convergenceRate: 0.95,
      lastAggregation: new Date(Date.now() - 45000).toISOString(),
      status: 'deployed'
    },
    {
      id: 'maintenance-schedule',
      name: 'Wartungs-Optimierung',
      task: 'Vorhersage optimaler Wartungsintervalle',
      accuracy: 89.7,
      rounds: 156,
      participants: 6,
      dataPrivacy: true,
      modelSize: 28.5,
      convergenceRate: 0.91,
      lastAggregation: new Date(Date.now() - 75000).toISOString(),
      status: 'aggregating'
    },
    {
      id: 'security-detection',
      name: 'Sicherheits-Erkennung',
      task: 'Anomalie-Erkennung für Sicherheitsvorfälle',
      accuracy: 97.2,
      rounds: 203,
      participants: 5,
      dataPrivacy: true,
      modelSize: 67.1,
      convergenceRate: 0.99,
      lastAggregation: new Date(Date.now() - 8000).toISOString(),
      status: 'testing'
    }
  ])

  const [trainingRounds, setTrainingRounds] = useKV<TrainingRound[]>('training-rounds', [
    {
      id: 'round-127',
      round: 127,
      participants: ['berlin-hbf', 'munich-hbf', 'hamburg-hbf', 'cologne-leitstelle', 'db-zentrale'],
      globalAccuracy: 95.4,
      localAccuracies: [94.7, 92.3, 91.8, 96.1, 97.8],
      communicationCost: 2.3,
      duration: 45,
      privacyBudget: 0.85,
      convergence: 0.98,
      status: 'completed'
    },
    {
      id: 'round-126',
      round: 126,
      participants: ['berlin-hbf', 'munich-hbf', 'cologne-leitstelle', 'db-zentrale'],
      globalAccuracy: 95.1,
      localAccuracies: [94.2, 91.8, 95.9, 97.5],
      communicationCost: 1.8,
      duration: 42,
      privacyBudget: 0.87,
      convergence: 0.96,
      status: 'completed'
    }
  ])

  const [systemMetrics, setSystemMetrics] = useKV('federated-metrics', {
    totalNodes: 6,
    activeNodes: 5,
    totalDataPoints: 1011000,
    avgAccuracy: 94.7,
    communicationEfficiency: 87.3,
    privacyBudget: 0.85,
    aggregationLatency: 12.5,
    modelConvergence: 0.97
  })

  // Simulate federated training rounds
  useEffect(() => {
    if (!isTraining) return

    const interval = setInterval(() => {
      // Update node accuracies
      setFederatedNodes(prev => prev.map(node => ({
        ...node,
        modelAccuracy: node.status === 'training' 
          ? Math.min(99.5, node.modelAccuracy + Math.random() * 0.2)
          : node.modelAccuracy,
        lastUpdate: node.status === 'training' ? new Date().toISOString() : node.lastUpdate
      })))

      // Update model metrics
      setFederatedModels(prev => prev.map(model => ({
        ...model,
        accuracy: model.status === 'training'
          ? Math.min(99, model.accuracy + Math.random() * 0.1)
          : model.accuracy,
        rounds: model.status === 'training' ? model.rounds + 1 : model.rounds
      })))

      // Update system metrics
      setSystemMetrics(prev => ({
        ...prev,
        avgAccuracy: Math.min(99, prev.avgAccuracy + Math.random() * 0.05),
        communicationEfficiency: Math.max(80, Math.min(95, prev.communicationEfficiency + (Math.random() - 0.5) * 2)),
        privacyBudget: Math.max(0.5, prev.privacyBudget - 0.001)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isTraining, setFederatedNodes, setFederatedModels, setSystemMetrics])

  const startFederatedTraining = async () => {
    setIsTraining(true)
    
    // Update participating nodes to training status
    setFederatedNodes(prev => prev.map(node => 
      node.status === 'online' ? { ...node, status: 'training' } : node
    ))

    toast.success('Federated Learning gestartet', {
      description: `${systemMetrics.activeNodes} Knoten nehmen am Training teil`
    })
  }

  const stopFederatedTraining = () => {
    setIsTraining(false)
    
    // Reset nodes to online status
    setFederatedNodes(prev => prev.map(node => 
      node.status === 'training' ? { ...node, status: 'online' } : node
    ))

    toast.info('Federated Learning gestoppt')
  }

  const aggregateModel = async (modelId: string) => {
    const model = federatedModels.find(m => m.id === modelId)
    if (!model) return

    setFederatedModels(prev => prev.map(m => 
      m.id === modelId ? { ...m, status: 'aggregating' } : m
    ))

    toast.info(`Modell-Aggregation für ${model.name} gestartet`)

    // Simulate aggregation process
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Create new training round
    const newRound: TrainingRound = {
      id: `round-${model.rounds + 1}`,
      round: model.rounds + 1,
      participants: federatedNodes.filter(n => n.status !== 'offline').map(n => n.id),
      globalAccuracy: model.accuracy + Math.random() * 0.5,
      localAccuracies: federatedNodes.filter(n => n.status !== 'offline').map(n => n.modelAccuracy),
      communicationCost: 1.5 + Math.random() * 1.5,
      duration: 30 + Math.random() * 30,
      privacyBudget: systemMetrics.privacyBudget,
      convergence: 0.9 + Math.random() * 0.09,
      status: 'completed'
    }

    setTrainingRounds(prev => [newRound, ...prev])

    setFederatedModels(prev => prev.map(m => 
      m.id === modelId ? { 
        ...m, 
        status: 'deployed',
        accuracy: newRound.globalAccuracy,
        rounds: newRound.round,
        lastAggregation: new Date().toISOString()
      } : m
    ))

    toast.success('Modell-Aggregation abgeschlossen', {
      description: `Neue Genauigkeit: ${newRound.globalAccuracy.toFixed(1)}%`
    })
  }

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'bahnhof': return 'bg-blue-100 text-blue-800'
      case 'leitstelle': return 'bg-purple-100 text-purple-800'
      case 'werkstatt': return 'bg-orange-100 text-orange-800'
      case 'zentrale': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'training': return 'bg-blue-100 text-blue-800'
      case 'synchronizing': return 'bg-yellow-100 text-yellow-800'
      case 'offline': return 'bg-red-100 text-red-800'
      case 'aggregating': return 'bg-purple-100 text-purple-800'
      case 'deployed': return 'bg-green-100 text-green-800'
      case 'testing': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case 'hoch': return <Shield size={14} className="text-green-600" />
      case 'mittel': return <Shield size={14} className="text-yellow-600" />
      case 'niedrig': return <Shield size={14} className="text-red-600" />
      default: return <Shield size={14} className="text-gray-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Network size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Federated Learning System</h1>
            <p className="text-muted-foreground">Dezentrale Modell-Optimierung zwischen Bahnhöfen</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setPrivacyMode(!privacyMode)}
            variant="outline"
            className="gap-2"
          >
            <Lock size={16} />
            Privacy {privacyMode ? 'Ein' : 'Aus'}
          </Button>
          <Button
            onClick={isTraining ? stopFederatedTraining : startFederatedTraining}
            variant={isTraining ? "destructive" : "default"}
            className="gap-2"
          >
            {isTraining ? <Pause size={16} /> : <Play size={16} />}
            {isTraining ? 'Training stoppen' : 'Training starten'}
          </Button>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {systemMetrics.activeNodes}/{systemMetrics.totalNodes} Aktive Knoten
          </Badge>
        </div>
      </div>

      {/* Privacy Status Alert */}
      <Alert className={privacyMode ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
        <Lock className={`h-4 w-4 ${privacyMode ? 'text-green-600' : 'text-yellow-600'}`} />
        <AlertDescription className={privacyMode ? 'text-green-800' : 'text-yellow-800'}>
          Datenschutz-Modus {privacyMode ? 'aktiviert' : 'deaktiviert'} • 
          Privacy Budget: {systemMetrics.privacyBudget.toFixed(3)} • 
          Durchschnittliche Genauigkeit: {systemMetrics.avgAccuracy.toFixed(1)}% • 
          Kommunikationseffizienz: {systemMetrics.communicationEfficiency.toFixed(1)}%
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="nodes">Knoten</TabsTrigger>
          <TabsTrigger value="models">Modelle</TabsTrigger>
          <TabsTrigger value="rounds">Training-Runden</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {systemMetrics.activeNodes}/{systemMetrics.totalNodes}
                </div>
                <div className="text-sm text-muted-foreground">Aktive Knoten</div>
                <Progress value={(systemMetrics.activeNodes / systemMetrics.totalNodes) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Target size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {systemMetrics.avgAccuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Ø Genauigkeit</div>
                <Progress value={systemMetrics.avgAccuracy} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Database size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {(systemMetrics.totalDataPoints / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-muted-foreground">Datenpunkte</div>
                <Progress value={75} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {systemMetrics.aggregationLatency.toFixed(1)}s
                </div>
                <div className="text-sm text-muted-foreground">Latenz</div>
                <Progress value={(systemMetrics.aggregationLatency / 60) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain size={18} />
                  Training-Fortschritt
                </CardTitle>
                <CardDescription>Aktuelle Federated Learning Runde</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Modell-Konvergenz</span>
                    <span className="text-sm">{(systemMetrics.modelConvergence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.modelConvergence * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Kommunikationseffizienz</span>
                    <span className="text-sm">{systemMetrics.communicationEfficiency.toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.communicationEfficiency} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {federatedModels.find(m => m.id === selectedModel)?.rounds || 0}
                    </div>
                    <div className="text-xs text-blue-600">Runden</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {systemMetrics.privacyBudget.toFixed(3)}
                    </div>
                    <div className="text-xs text-green-600">Privacy Budget</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={18} />
                  Datenschutz & Sicherheit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Differential Privacy</span>
                    <span className="text-sm">Aktiviert</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Homomorphe Verschlüsselung</span>
                    <span className="text-sm">Aktiviert</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Secure Aggregation</span>
                    <span className="text-sm">Aktiviert</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Knoten-Sicherheit:</h4>
                  {federatedNodes.filter(n => n.status !== 'offline').slice(0, 3).map(node => (
                    <div key={node.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSecurityIcon(node.security)}
                        <span className="text-sm">{node.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {node.privacyLevel}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Nodes */}
        <TabsContent value="nodes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {federatedNodes.map(node => (
              <Card key={node.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Cpu size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{node.name}</h3>
                        <p className="text-sm text-muted-foreground">{node.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getNodeTypeColor(node.nodeType)}>
                        {node.nodeType}
                      </Badge>
                      <Badge className={getStatusColor(node.status)}>
                        {node.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-primary">{node.dataPoints.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Datenpunkte</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{node.modelAccuracy.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Genauigkeit</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Rechenleistung</span>
                      <span className="text-sm">{node.computePower}%</span>
                    </div>
                    <Progress value={node.computePower} className="h-2" />
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bandbreite:</span>
                        <span className="font-medium">{node.bandwidth}Mbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latenz:</span>
                        <span className="font-medium">{node.latency}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Privacy:</span>
                        <span className="font-medium">{node.privacyLevel}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-muted-foreground">
                    Letztes Update: {Math.floor((Date.now() - new Date(node.lastUpdate).getTime()) / 1000)}s ago
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Models */}
        <TabsContent value="models" className="space-y-6">
          <div className="space-y-4">
            {federatedModels.map(model => (
              <Card key={model.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Brain size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">{model.task}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(model.status)}>
                        {model.status}
                      </Badge>
                      {model.dataPrivacy && (
                        <Badge className="bg-green-100 text-green-800">
                          Privacy-Konform
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-primary">{model.accuracy.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Genauigkeit</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{model.rounds}</div>
                      <div className="text-xs text-muted-foreground">Runden</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{model.participants}</div>
                      <div className="text-xs text-muted-foreground">Teilnehmer</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">{model.modelSize.toFixed(1)}MB</div>
                      <div className="text-xs text-muted-foreground">Modell-Größe</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Konvergenzrate</span>
                      <span className="text-sm">{(model.convergenceRate * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={model.convergenceRate * 100} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-muted-foreground">
                      Letzte Aggregation: {Math.floor((Date.now() - new Date(model.lastAggregation).getTime()) / 1000)}s ago
                    </div>
                    <Button
                      onClick={() => aggregateModel(model.id)}
                      disabled={model.status === 'aggregating'}
                      size="sm"
                      className="gap-2"
                    >
                      {model.status === 'aggregating' ? (
                        <>
                          <RotateCcw size={14} className="animate-spin" />
                          Aggregiere...
                        </>
                      ) : (
                        <>
                          <Download size={14} />
                          Aggregieren
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Training Rounds */}
        <TabsContent value="rounds" className="space-y-6">
          <div className="space-y-4">
            {trainingRounds.map(round => (
              <Card key={round.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <Activity size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Runde {round.round}</h3>
                        <p className="text-sm text-muted-foreground">{round.participants.length} Teilnehmer</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(round.status)}>
                      {round.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-primary">{round.globalAccuracy.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Globale Genauigkeit</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{round.duration}s</div>
                      <div className="text-xs text-muted-foreground">Dauer</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{round.communicationCost.toFixed(1)}GB</div>
                      <div className="text-xs text-muted-foreground">Kommunikation</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">{round.privacyBudget.toFixed(3)}</div>
                      <div className="text-xs text-muted-foreground">Privacy Budget</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Konvergenz</span>
                      <span className="text-sm">{(round.convergence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={round.convergence * 100} className="h-2" />
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Lokale Genauigkeiten:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {round.localAccuracies.map((accuracy, index) => (
                        <div key={index} className="text-center p-2 bg-blue-50 rounded text-xs">
                          <div className="font-medium text-blue-800">{accuracy.toFixed(1)}%</div>
                          <div className="text-blue-600">Knoten {index + 1}</div>
                        </div>
                      ))}
                    </div>
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