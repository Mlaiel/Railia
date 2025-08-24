import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Network, 
  MapPin, 
  Zap, 
  TrendUp, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  ArrowsCounterClockwise,
  Graph,
  Lightning,
  Timer,
  Target,
  GitBranch,
  Dot,
  ArrowRight,
  Warning
} from '@phosphor-icons/react'

interface Station {
  id: string
  name: string
  type: 'hauptbahnhof' | 'regionalbahnhof' | 'haltepunkt'
  coordinates: { lat: number; lng: number }
  capacity: number
  currentLoad: number
  connections: string[]
  priority: number
}

interface TopologyConnection {
  from: string
  to: string
  weight: number
  capacity: number
  currentFlow: number
  latency: number
  reliability: number
  adaptiveWeight: number
}

interface TopologyOptimization {
  id: string
  timestamp: string
  type: 'load_balancing' | 'capacity_expansion' | 'redundancy_addition' | 'bottleneck_resolution'
  description: string
  impact: number
  estimatedImprovement: number
  status: 'pending' | 'active' | 'completed' | 'failed'
}

export default function DynamicTopologySystem() {
  const [systemActive, setSystemActive] = useKV('topology-system-active', true)
  const [adaptationMode, setAdaptationMode] = useKV('topology-adaptation-mode', 'automatic')
  
  // Network topology state
  const [stations] = useKV('network-stations', [
    {
      id: 'hbf-berlin',
      name: 'Berlin Hauptbahnhof',
      type: 'hauptbahnhof',
      coordinates: { lat: 52.5251, lng: 13.3697 },
      capacity: 1000,
      currentLoad: 750,
      connections: ['hbf-hamburg', 'hbf-muenchen', 'regional-1'],
      priority: 10
    },
    {
      id: 'hbf-hamburg',
      name: 'Hamburg Hauptbahnhof',
      type: 'hauptbahnhof',
      coordinates: { lat: 53.5528, lng: 10.0067 },
      capacity: 800,
      currentLoad: 600,
      connections: ['hbf-berlin', 'regional-2', 'regional-3'],
      priority: 9
    },
    {
      id: 'hbf-muenchen',
      name: 'München Hauptbahnhof',
      type: 'hauptbahnhof',
      coordinates: { lat: 48.1408, lng: 11.5581 },
      capacity: 900,
      currentLoad: 720,
      connections: ['hbf-berlin', 'regional-4', 'regional-5'],
      priority: 9
    },
    {
      id: 'regional-1',
      name: 'Berlin Südkreuz',
      type: 'regionalbahnhof',
      coordinates: { lat: 52.4754, lng: 13.3650 },
      capacity: 400,
      currentLoad: 320,
      connections: ['hbf-berlin', 'haltepunkt-1'],
      priority: 6
    }
  ])

  const [topologyConnections, setTopologyConnections] = useKV('topology-connections', [
    {
      from: 'hbf-berlin',
      to: 'hbf-hamburg',
      weight: 1.0,
      capacity: 500,
      currentFlow: 380,
      latency: 120,
      reliability: 0.98,
      adaptiveWeight: 1.2
    },
    {
      from: 'hbf-berlin',
      to: 'hbf-muenchen',
      weight: 1.0,
      capacity: 450,
      currentFlow: 350,
      latency: 180,
      reliability: 0.96,
      adaptiveWeight: 1.1
    },
    {
      from: 'hbf-hamburg',
      to: 'regional-2',
      weight: 0.8,
      capacity: 200,
      currentFlow: 150,
      latency: 45,
      reliability: 0.99,
      adaptiveWeight: 0.9
    }
  ])

  const [optimizations, setOptimizations] = useKV('topology-optimizations', [])
  const [adaptationMetrics, setAdaptationMetrics] = useKV('adaptation-metrics', {
    totalAdaptations: 247,
    successRate: 94.2,
    averageImprovement: 23.5,
    networkEfficiency: 87.3,
    lastOptimization: new Date().toISOString()
  })

  // Real-time topology analysis
  useEffect(() => {
    if (!systemActive) return

    const interval = setInterval(() => {
      // Simulate real-time topology optimization
      analyzeNetworkTopology()
    }, 15000)

    return () => clearInterval(interval)
  }, [systemActive])

  const analyzeNetworkTopology = async () => {
    // Simulate network analysis with AI
    const analysisPrompt = spark.llmPrompt`
    Analysiere die aktuelle Bahnhof-Netzwerk-Topologie und identifiziere Optimierungsmöglichkeiten:
    
    Stationen: ${JSON.stringify(stations)}
    Verbindungen: ${JSON.stringify(topologyConnections)}
    
    Finde Engpässe, überlastete Knoten und empfehle Topologie-Anpassungen für optimale Verkehrsverteilung.
    `

    try {
      const analysis = await spark.llm(analysisPrompt, 'gpt-4o', true)
      const result = JSON.parse(analysis)
      
      if (result.optimizationsNeeded) {
        generateTopologyOptimizations(result.recommendations)
      }
    } catch (error) {
      console.error('Topology analysis error:', error)
    }
  }

  const generateTopologyOptimizations = (recommendations: any[]) => {
    const newOptimizations = recommendations.map((rec, index) => ({
      id: `opt-${Date.now()}-${index}`,
      timestamp: new Date().toISOString(),
      type: rec.type,
      description: rec.description,
      impact: rec.impact,
      estimatedImprovement: rec.estimatedImprovement,
      status: 'pending' as const
    }))

    setOptimizations(current => [...current, ...newOptimizations].slice(-20))
  }

  const executeTopologyOptimization = async (optimizationId: string) => {
    const optimization = optimizations.find(opt => opt.id === optimizationId)
    if (!optimization) return

    // Update optimization status
    setOptimizations(current => 
      current.map(opt => 
        opt.id === optimizationId 
          ? { ...opt, status: 'active' }
          : opt
      )
    )

    // Simulate topology reconfiguration
    setTimeout(() => {
      // Update connections based on optimization type
      if (optimization.type === 'load_balancing') {
        redistributeNetworkLoad()
      } else if (optimization.type === 'capacity_expansion') {
        expandNetworkCapacity()
      } else if (optimization.type === 'redundancy_addition') {
        addRedundantConnections()
      }

      // Mark as completed
      setOptimizations(current => 
        current.map(opt => 
          opt.id === optimizationId 
            ? { ...opt, status: 'completed' }
            : opt
        )
      )

      // Update metrics
      setAdaptationMetrics(current => ({
        ...current,
        totalAdaptations: current.totalAdaptations + 1,
        networkEfficiency: Math.min(100, current.networkEfficiency + optimization.estimatedImprovement),
        lastOptimization: new Date().toISOString()
      }))

      toast.success(`Topologie-Optimierung "${optimization.description}" erfolgreich angewendet`)
    }, 3000)
  }

  const redistributeNetworkLoad = () => {
    setTopologyConnections(current => 
      current.map(conn => ({
        ...conn,
        adaptiveWeight: conn.currentFlow / conn.capacity > 0.8 
          ? conn.adaptiveWeight * 0.8 
          : conn.adaptiveWeight * 1.1
      }))
    )
  }

  const expandNetworkCapacity = () => {
    setTopologyConnections(current => 
      current.map(conn => ({
        ...conn,
        capacity: conn.currentFlow / conn.capacity > 0.9 
          ? Math.floor(conn.capacity * 1.2)
          : conn.capacity
      }))
    )
  }

  const addRedundantConnections = () => {
    // Simulate adding new redundant connections
    toast.info('Redundante Verbindungen werden hinzugefügt...')
  }

  const getNetworkHealthColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600'
    if (efficiency >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConnectionStatus = (connection: TopologyConnection) => {
    const utilizationRate = connection.capacity > 0 ? (connection.currentFlow || 0) / connection.capacity : 0
    if (utilizationRate > 0.9) return 'critical'
    if (utilizationRate > 0.7) return 'warning'
    return 'normal'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Network size={24} className="text-primary" />
            </div>
            Dynamische Topologie-Anpassung
          </h2>
          <p className="text-muted-foreground">
            Intelligente Netzwerk-Optimierung für optimale Bahnhof-Vernetzung
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={systemActive ? "default" : "outline"}
            onClick={() => setSystemActive(!systemActive)}
            className="flex items-center gap-2"
          >
            {systemActive ? <Zap size={16} /> : <Timer size={16} />}
            {systemActive ? 'Aktiv' : 'Gestoppt'}
          </Button>
        </div>
      </div>

      {/* System Status Alert */}
      {systemActive && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Dynamische Topologie-Anpassung ist aktiv und überwacht kontinuierlich die Netzwerk-Performance
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Netzwerk-Effizienz</p>
                <p className={`text-2xl font-bold ${getNetworkHealthColor(adaptationMetrics?.networkEfficiency || 0)}`}>
                  {(adaptationMetrics?.networkEfficiency || 0).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendUp size={20} className="text-primary" />
              </div>
            </div>
            <Progress 
              value={adaptationMetrics?.networkEfficiency || 0} 
              className="mt-3 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Erfolgreiche Anpassungen</p>
                <p className="text-2xl font-bold text-foreground">
                  {adaptationMetrics.totalAdaptations}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {adaptationMetrics.successRate}% Erfolgsrate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Durchschn. Verbesserung</p>
                <p className="text-2xl font-bold text-green-600">
                  +{adaptationMetrics.averageImprovement}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Lightning size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Optimierungen</p>
                <p className="text-2xl font-bold text-orange-600">
                  {optimizations.filter(opt => opt.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ArrowsCounterClockwise size={20} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="topology" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="topology">Netzwerk-Topologie</TabsTrigger>
          <TabsTrigger value="optimizations">Optimierungen</TabsTrigger>
          <TabsTrigger value="connections">Verbindungen</TabsTrigger>
          <TabsTrigger value="analytics">Analyse</TabsTrigger>
        </TabsList>

        <TabsContent value="topology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Graph size={20} />
                Aktuelle Netzwerk-Topologie
              </CardTitle>
              <CardDescription>
                Übersicht der Bahnhof-Vernetzung und Lastverteilung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stations */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Bahnhöfe</h4>
                  <div className="space-y-3">
                    {stations.map((station) => {
                      const loadPercentage = station.capacity > 0 ? ((station.currentLoad || 0) / station.capacity) * 100 : 0
                      return (
                        <div key={station.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-medium">{station.name}</h5>
                              <Badge variant="outline" className="text-xs mt-1">
                                {station.type}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {station.currentLoad}/{station.capacity}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Auslastung
                              </div>
                            </div>
                          </div>
                          <Progress 
                            value={Math.min(Math.max(loadPercentage || 0, 0), 100)} 
                            className={`h-2 ${loadPercentage > 80 ? 'text-red-500' : loadPercentage > 60 ? 'text-yellow-500' : 'text-green-500'}`}
                          />
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>Priorität: {station.priority}/10</span>
                            <span>{(loadPercentage || 0).toFixed(1)}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Network Visualization Placeholder */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Topologie-Visualisierung</h4>
                  <div className="h-96 border-2 border-dashed border-muted rounded-lg flex items-center justify-center bg-muted/20">
                    <div className="text-center space-y-2">
                      <Network size={48} className="mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Interaktive Netzwerk-Visualisierung
                      </p>
                      <p className="text-sm text-muted-foreground">
                        3D-Topologie-Darstellung wird geladen...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} />
                Aktive Optimierungen
              </CardTitle>
              <CardDescription>
                Laufende und geplante Topologie-Anpassungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Keine Optimierungen erforderlich</p>
                    <p className="text-sm">Das Netzwerk läuft optimal</p>
                  </div>
                ) : (
                  optimizations.map((optimization) => (
                    <div key={optimization.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{optimization.description}</h5>
                            <Badge 
                              variant={
                                optimization.status === 'completed' ? 'default' :
                                optimization.status === 'active' ? 'destructive' :
                                optimization.status === 'failed' ? 'destructive' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {optimization.status === 'pending' && 'Geplant'}
                              {optimization.status === 'active' && 'Aktiv'}
                              {optimization.status === 'completed' && 'Abgeschlossen'}
                              {optimization.status === 'failed' && 'Fehlgeschlagen'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Typ: {optimization.type} • Verbesserung: +{optimization.estimatedImprovement}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(optimization.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {optimization.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => executeTopologyOptimization(optimization.id)}
                            className="ml-4"
                          >
                            Ausführen
                          </Button>
                        )}
                      </div>
                      
                      {optimization.status === 'active' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Fortschritt</span>
                            <span>Wird angewendet...</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch size={20} />
                Netzwerk-Verbindungen
              </CardTitle>
              <CardDescription>
                Status und Performance der Bahnhof-Verbindungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topologyConnections.map((connection, index) => {
                  const utilizationRate = connection.capacity > 0 ? ((connection.currentFlow || 0) / connection.capacity) * 100 : 0
                  const status = getConnectionStatus(connection)
                  
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{connection.from}</span>
                            <ArrowRight size={16} className="text-muted-foreground" />
                            <span className="font-medium">{connection.to}</span>
                          </div>
                          <Badge 
                            variant={status === 'critical' ? 'destructive' : status === 'warning' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {status === 'critical' && 'Kritisch'}
                            {status === 'warning' && 'Warnung'}
                            {status === 'normal' && 'Normal'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {connection.currentFlow}/{connection.capacity}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Durchsatz
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-2 bg-secondary/20 rounded">
                          <div className="text-sm font-medium">{(utilizationRate || 0).toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Auslastung</div>
                        </div>
                        <div className="text-center p-2 bg-secondary/20 rounded">
                          <div className="text-sm font-medium">{connection.latency}ms</div>
                          <div className="text-xs text-muted-foreground">Latenz</div>
                        </div>
                        <div className="text-center p-2 bg-secondary/20 rounded">
                          <div className="text-sm font-medium">{((connection.reliability || 0) * 100).toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Zuverlässigkeit</div>
                        </div>
                        <div className="text-center p-2 bg-secondary/20 rounded">
                          <div className="text-sm font-medium">{(connection.adaptiveWeight || 0).toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">Adaptives Gewicht</div>
                        </div>
                      </div>

                      <Progress 
                        value={Math.min(Math.max(utilizationRate || 0, 0), 100)} 
                        className={`h-2 ${utilizationRate > 90 ? 'text-red-500' : utilizationRate > 70 ? 'text-yellow-500' : 'text-green-500'}`}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Performance-Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm font-medium">Netzwerk-Effizienz</span>
                    <div className="flex items-center gap-2">
                      <TrendUp size={16} className="text-green-600" />
                      <span className="text-green-600 font-medium">+12.3%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm font-medium">Durchschnittliche Latenz</span>
                    <div className="flex items-center gap-2">
                      <TrendUp size={16} className="text-green-600" />
                      <span className="text-green-600 font-medium">-8.7%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm font-medium">Auslastungsverteilung</span>
                    <div className="flex items-center gap-2">
                      <TrendUp size={16} className="text-green-600" />
                      <span className="text-green-600 font-medium">+15.2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Kritische Punkte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border border-yellow-200 bg-yellow-50 rounded">
                    <Warning size={16} className="text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Hohe Auslastung: Berlin-Hamburg</p>
                      <p className="text-xs text-muted-foreground">76% Kapazitätsauslastung erreicht</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border border-red-200 bg-red-50 rounded">
                    <AlertTriangle size={16} className="text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Engpass erkannt: München Hbf</p>
                      <p className="text-xs text-muted-foreground">Eingehende Verbindungen überlastet</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border border-blue-200 bg-blue-50 rounded">
                    <Dot size={16} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Optimierung empfohlen</p>
                      <p className="text-xs text-muted-foreground">Redundante Verbindung für Hamburg-Bremen</p>
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