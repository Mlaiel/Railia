import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Radio, 
  Signal, 
  Antenna, 
  Lightning, 
  Activity, 
  TrendUp, 
  Database, 
  Gauge, 
  Clock,
  Target,
  Brain,
  Zap,
  Network,
  Globe,
  WaveSquare,
  GraphicsCard,
  Broadcast,
  Router
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface NetworkNode {
  id: string
  type: '5G' | '6G' | 'Hybrid'
  location: string
  trainId?: string
  status: 'aktiv' | 'optimierung' | 'wartung' | 'offline'
  latency: number
  bandwidth: number
  coverage: number
  connectedDevices: number
  dataThoughput: number
  signalStrength: number
  beamformingActive: boolean
}

interface UltraLowLatencyTask {
  id: string
  type: 'echtzeit-steuerung' | 'notfall-response' | 'koordination' | 'datenübertragung'
  description: string
  requiredLatency: number
  currentLatency: number
  priority: 'kritisch' | 'hoch' | 'mittel' | 'niedrig'
  status: 'verarbeitung' | 'abgeschlossen' | 'fehler' | 'warteschlange'
  startTime: string
  dataVolume: number
}

interface NetworkMetrics {
  totalNodes: number
  activeConnections: number
  avgLatency: number
  totalBandwidth: number
  uptime: number
  packetsTransmitted: number
  edgeComputingLoad: number
}

export default function FiveGSixGIntegration() {
  const [networkNodes, setNetworkNodes] = useKV<NetworkNode[]>('5g-6g-nodes', [
    {
      id: '5g-node-001',
      type: '5G',
      location: 'Berlin Hauptbahnhof',
      status: 'aktiv',
      latency: 1.2,
      bandwidth: 10000,
      coverage: 98.5,
      connectedDevices: 847,
      dataThoughput: 8.7,
      signalStrength: -65,
      beamformingActive: true
    },
    {
      id: '6g-node-001',
      type: '6G',
      location: 'München Hauptbahnhof',
      status: 'aktiv',
      latency: 0.3,
      bandwidth: 100000,
      coverage: 99.8,
      connectedDevices: 1247,
      dataThoughput: 47.2,
      signalStrength: -58,
      beamformingActive: true
    },
    {
      id: '5g-mobile-001',
      type: '5G',
      location: 'ICE-4501',
      trainId: 'ICE-4501',
      status: 'optimierung',
      latency: 2.1,
      bandwidth: 5000,
      coverage: 94.2,
      connectedDevices: 245,
      dataThoughput: 4.1,
      signalStrength: -72,
      beamformingActive: true
    },
    {
      id: '6g-mobile-001',
      type: '6G',
      location: 'ICE-3201',
      trainId: 'ICE-3201',
      status: 'aktiv',
      latency: 0.5,
      bandwidth: 50000,
      coverage: 99.1,
      connectedDevices: 398,
      dataThoughput: 23.8,
      signalStrength: -61,
      beamformingActive: true
    }
  ])

  const [ultraLowLatencyTasks, setUltraLowLatencyTasks] = useKV<UltraLowLatencyTask[]>('ultra-low-latency-tasks', [
    {
      id: 'ull-001',
      type: 'echtzeit-steuerung',
      description: 'Autonome Notbremsung Zug ICE-4501',
      requiredLatency: 1.0,
      currentLatency: 0.8,
      priority: 'kritisch',
      status: 'verarbeitung',
      startTime: new Date(Date.now() - 2000).toISOString(),
      dataVolume: 2.4
    },
    {
      id: 'ull-002',
      type: 'koordination',
      description: 'Multi-Zug-Koordination Knoten München',
      requiredLatency: 5.0,
      currentLatency: 3.2,
      priority: 'hoch',
      status: 'verarbeitung',
      startTime: new Date(Date.now() - 8000).toISOString(),
      dataVolume: 15.7
    },
    {
      id: 'ull-003',
      type: 'notfall-response',
      description: 'Evakuierungs-Koordination Bahnhof Berlin',
      requiredLatency: 2.0,
      currentLatency: 1.1,
      priority: 'kritisch',
      status: 'abgeschlossen',
      startTime: new Date(Date.now() - 45000).toISOString(),
      dataVolume: 8.9
    }
  ])

  const [networkMetrics, setNetworkMetrics] = useKV<NetworkMetrics>('5g-6g-metrics', {
    totalNodes: 4,
    activeConnections: 2737,
    avgLatency: 1.0,
    totalBandwidth: 165000,
    uptime: 99.9,
    packetsTransmitted: 24789450,
    edgeComputingLoad: 67.4
  })

  const [selectedNode, setSelectedNode] = useState<string>('6g-node-001')

  useEffect(() => {
    const interval = setInterval(() => {
      // Simuliere Echtzeit-Updates der Netzwerk-Knoten
      setNetworkNodes(prev => prev.map(node => ({
        ...node,
        latency: Math.max(0.1, node.latency + (Math.random() - 0.5) * 0.3),
        dataThoughput: Math.max(0, node.dataThoughput + (Math.random() - 0.5) * 2),
        connectedDevices: Math.max(0, node.connectedDevices + Math.floor((Math.random() - 0.5) * 20)),
        signalStrength: Math.max(-90, node.signalStrength + (Math.random() - 0.5) * 3)
      })))

      // Update Task-Status
      setUltraLowLatencyTasks(prev => prev.map(task => ({
        ...task,
        currentLatency: Math.max(0.1, task.currentLatency + (Math.random() - 0.5) * 0.2)
      })))

      // Update Gesamt-Metriken
      setNetworkMetrics(prev => ({
        ...prev,
        avgLatency: networkNodes.reduce((sum, node) => sum + node.latency, 0) / networkNodes.length,
        packetsTransmitted: prev.packetsTransmitted + Math.floor(Math.random() * 1000),
        edgeComputingLoad: Math.max(0, Math.min(100, prev.edgeComputingLoad + (Math.random() - 0.5) * 5))
      }))
    }, 1500)

    return () => clearInterval(interval)
  }, [networkNodes])

  const handleNetworkOptimization = (nodeId: string) => {
    setNetworkNodes(prev => prev.map(n => 
      n.id === nodeId 
        ? { 
            ...n, 
            status: 'optimierung', 
            latency: n.latency * 0.8,
            bandwidth: n.bandwidth * 1.2 
          }
        : n
    ))
    toast.success(`Netzwerk-Optimierung für ${nodeId} gestartet`)
  }

  const handleEmergencyMode = () => {
    setNetworkNodes(prev => prev.map(n => ({
      ...n,
      latency: n.latency * 0.5,
      bandwidth: n.bandwidth * 1.5,
      beamformingActive: true
    })))
    toast.success('Notfall-Modus aktiviert - Ultra-niedrige Latenz')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktiv': return 'bg-green-500'
      case 'optimierung': return 'bg-yellow-500'
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

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'verarbeitung': return 'bg-blue-500'
      case 'abgeschlossen': return 'bg-green-500'
      case 'fehler': return 'bg-red-500'
      case 'warteschlange': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const currentNode = networkNodes.find(n => n.id === selectedNode)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Radio size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">5G/6G-Integration</h1>
            <p className="text-muted-foreground">Ultra-niedrige Latenz für Echtzeit-Entscheidungen</p>
          </div>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Durchschn. Latenz</p>
                <p className="text-2xl font-bold text-blue-600">{networkMetrics.avgLatency.toFixed(1)}ms</p>
              </div>
              <Lightning size={24} className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktive Verbindungen</p>
                <p className="text-2xl font-bold text-cyan-600">{networkMetrics.activeConnections.toLocaleString()}</p>
              </div>
              <Network size={24} className="text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gesamt-Bandbreite</p>
                <p className="text-2xl font-bold text-green-600">{(networkMetrics.totalBandwidth / 1000).toFixed(0)}Gbps</p>
              </div>
              <Signal size={24} className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Edge-Computing</p>
                <p className="text-2xl font-bold text-purple-600">{networkMetrics.edgeComputingLoad.toFixed(0)}%</p>
              </div>
              <GraphicsCard size={24} className="text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="nodes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nodes">Netzwerk-Knoten</TabsTrigger>
          <TabsTrigger value="latency">Ultra-Low-Latency</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="controls">Steuerung</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Node List */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold">Netzwerk-Knoten</h3>
              {networkNodes.map(node => (
                <Card 
                  key={node.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedNode === node.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedNode(node.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{node.id}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={node.type === '6G' ? 'default' : 'secondary'}>
                          {node.type}
                        </Badge>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`}></div>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>{node.location}</div>
                      <div>{node.latency.toFixed(1)}ms Latenz</div>
                      <div>{node.connectedDevices} Geräte</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Node Details */}
            {currentNode && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Antenna size={20} />
                      {currentNode.id} - Details
                    </CardTitle>
                    <CardDescription>
                      {currentNode.location} • {currentNode.type} Netzwerk
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status und Metriken */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Lightning size={16} className="text-blue-500" />
                          <span className="text-sm font-medium">Latenz</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {currentNode.latency.toFixed(1)}ms
                        </div>
                        <Progress value={100 - (currentNode.latency * 10)} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Signal size={16} className="text-green-500" />
                          <span className="text-sm font-medium">Bandbreite</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {(currentNode.bandwidth / 1000).toFixed(0)}Gbps
                        </div>
                        <Progress value={(currentNode.bandwidth / 100000) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Target size={16} className="text-purple-500" />
                          <span className="text-sm font-medium">Abdeckung</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {currentNode.coverage.toFixed(1)}%
                        </div>
                        <Progress value={currentNode.coverage} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendUp size={16} className="text-orange-500" />
                          <span className="text-sm font-medium">Durchsatz</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                          {currentNode.dataThoughput.toFixed(1)}Gbps
                        </div>
                        <Progress value={(currentNode.dataThoughput / 50) * 100} className="h-2" />
                      </div>
                    </div>

                    {/* Erweiterte Metriken */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Network size={16} className="text-primary" />
                          <span className="font-medium">Verbindungsstatus</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Verbundene Geräte:</span>
                            <span className="font-medium">{currentNode.connectedDevices}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Signalstärke:</span>
                            <span className="font-medium">{currentNode.signalStrength}dBm</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Beamforming:</span>
                            <Badge variant={currentNode.beamformingActive ? 'default' : 'outline'}>
                              {currentNode.beamformingActive ? 'Aktiv' : 'Inaktiv'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity size={16} className="text-primary" />
                          <span className="font-medium">Performance</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>CPU-Auslastung:</span>
                            <span className="font-medium">
                              {Math.floor(currentNode.dataThoughput * 2)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Speicher:</span>
                            <span className="font-medium">
                              {Math.floor(currentNode.connectedDevices / 10)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Netzwerk-IO:</span>
                            <span className="font-medium text-green-600">Optimal</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Steuerung */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleNetworkOptimization(currentNode.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        <WaveSquare size={16} className="mr-2" />
                        Optimieren
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

        <TabsContent value="latency" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Ultra-Low-Latency Tasks</h3>
            <Button onClick={handleEmergencyMode} variant="destructive">
              <Lightning size={16} className="mr-2" />
              Notfall-Modus
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ultraLowLatencyTasks.map(task => (
              <Card key={task.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{task.id}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(task.priority) as any}>
                        {task.priority}
                      </Badge>
                      <div className={`w-3 h-3 rounded-full ${getTaskStatusColor(task.status)}`}></div>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Latenz-Anforderung</span>
                      <span className={
                        task.currentLatency <= task.requiredLatency 
                          ? 'text-green-600 font-medium' 
                          : 'text-red-600 font-medium'
                      }>
                        {task.currentLatency.toFixed(1)}ms / {task.requiredLatency.toFixed(1)}ms
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, (task.requiredLatency / task.currentLatency) * 100)} 
                      className="h-2" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Laufzeit</div>
                      <div className="font-medium">
                        {Math.floor((Date.now() - new Date(task.startTime).getTime()) / 1000)}s
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Datenvolumen</div>
                      <div className="font-medium">{task.dataVolume.toFixed(1)}MB</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full ${
                      task.type === 'echtzeit-steuerung' ? 'bg-red-500' :
                      task.type === 'notfall-response' ? 'bg-orange-500' :
                      task.type === 'koordination' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <span className="capitalize">{task.type.replace('-', ' ')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>5G/6G Netzwerk-Performance</CardTitle>
              <CardDescription>
                Echtzeit-Überwachung der Netzwerk-Latenz und -Durchsatz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Netzwerk-Uptime</h4>
                  <div className="text-3xl font-bold text-green-600">
                    {networkMetrics.uptime}%
                  </div>
                  <Progress value={networkMetrics.uptime} className="h-3" />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Pakete übertragen</h4>
                  <div className="text-3xl font-bold text-blue-600">
                    {(networkMetrics.packetsTransmitted / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">
                    +0.1% Fehlerrate
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Edge-Computing-Last</h4>
                  <div className="text-3xl font-bold text-purple-600">
                    {networkMetrics.edgeComputingLoad.toFixed(0)}%
                  </div>
                  <div className="text-sm text-green-600">
                    Optimal verteilt
                  </div>
                </div>
              </div>

              <Alert>
                <Broadcast size={16} />
                <AlertDescription>
                  6G-Knoten erreichen durchschnittlich {networkMetrics.avgLatency.toFixed(1)}ms Latenz 
                  bei {(networkMetrics.totalBandwidth / 1000).toFixed(0)}Gbps Gesamtbandbreite. 
                  Edge-Computing reduziert Verarbeitungszeit um 73%.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Netzwerk-Steuerung</CardTitle>
                <CardDescription>
                  Zentrale Kontrolle aller 5G/6G-Knoten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={handleEmergencyMode}>
                  <Lightning size={16} className="mr-2" />
                  Notfall-Modus (Ultra-Low-Latency)
                </Button>
                <Button variant="outline" className="w-full">
                  <WaveSquare size={16} className="mr-2" />
                  Alle Knoten optimieren
                </Button>
                <Button variant="outline" className="w-full">
                  <Router size={16} className="mr-2" />
                  Load-Balancing aktivieren
                </Button>
                <Button variant="outline" className="w-full">
                  <Gauge size={16} className="mr-2" />
                  Netzwerk-Diagnostik
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latenz-Optimierung</CardTitle>
                <CardDescription>
                  Automatische Anpassung für kritische Anwendungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Echtzeit-Steuerung', latency: '< 1ms', priority: 'Kritisch' },
                  { name: 'Notfall-Response', latency: '< 2ms', priority: 'Hoch' },
                  { name: 'Zug-Koordination', latency: '< 5ms', priority: 'Mittel' },
                  { name: 'Datenübertragung', latency: '< 10ms', priority: 'Niedrig' }
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">Ziel-Latenz: {service.latency}</div>
                    </div>
                    <Badge variant={
                      service.priority === 'Kritisch' ? 'destructive' :
                      service.priority === 'Hoch' ? 'default' : 'outline'
                    }>
                      {service.priority}
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