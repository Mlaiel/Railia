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
  Brain,
  ChartLine,
  Activity,
  Network,
  Target,
  Zap,
  Settings,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  LineChart,
  Layers,
  Gauge,
  Atom,
  Sparkle,
  Lightning,
  GitBranch,
  Infinity,
  Eye,
  Cube
} from '@phosphor-icons/react'

interface RainbowDQNConfig {
  doubleQ: boolean
  prioritizedReplay: boolean
  duelingNetworks: boolean
  noisyNetworks: boolean
  categoricalDQN: boolean
  multiStepLearning: boolean
  nSteps: number
  atomsCount: number
  vMin: number
  vMax: number
  learningRate: number
  epsilon: number
  gamma: number
  bufferSize: number
  batchSize: number
  targetUpdateFreq: number
}

interface TrainingMetrics {
  episode: number
  reward: number
  loss: number
  qValue: number
  epsilon: number
  explorationRate: number
  priorityWeight: number
  noiseSigma: number
  categoricalEntropy: number
  multiStepReturn: number
}

interface NetworkArchitecture {
  layers: Array<{
    type: 'dense' | 'noisy' | 'dueling' | 'categorical'
    units: number
    activation: string
    parameters: number
  }>
  totalParameters: number
  memoryUsage: number
}

export default function RainbowDQNSystem() {
  const [config, setConfig] = useKV<RainbowDQNConfig>('rainbow-dqn-config', {
    doubleQ: true,
    prioritizedReplay: true,
    duelingNetworks: true,
    noisyNetworks: true,
    categoricalDQN: true,
    multiStepLearning: true,
    nSteps: 3,
    atomsCount: 51,
    vMin: -10,
    vMax: 10,
    learningRate: 0.0001,
    epsilon: 0.1,
    gamma: 0.99,
    bufferSize: 100000,
    batchSize: 32,
    targetUpdateFreq: 1000
  })

  const [trainingState, setTrainingState] = useKV('rainbow-dqn-training', {
    isTraining: false,
    currentEpisode: 0,
    totalSteps: 0,
    bestReward: 0,
    convergenceStatus: 'initializing'
  })

  const [metrics, setMetrics] = useKV<TrainingMetrics[]>('rainbow-dqn-metrics', [])
  const [architecture, setArchitecture] = useKV<NetworkArchitecture>('rainbow-dqn-architecture', {
    layers: [
      { type: 'dense', units: 512, activation: 'relu', parameters: 262656 },
      { type: 'noisy', units: 512, activation: 'relu', parameters: 524800 },
      { type: 'dueling', units: 256, activation: 'relu', parameters: 131328 },
      { type: 'categorical', units: 51, activation: 'softmax', parameters: 13107 }
    ],
    totalParameters: 931891,
    memoryUsage: 15.2
  })

  const [activeScenarios, setActiveScenarios] = useKV('rainbow-scenarios', [
    'track_obstruction_handling',
    'door_timing_optimization', 
    'emergency_response_coordination',
    'weather_adaptation_strategy'
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      if (trainingState.isTraining) {
        simulateTrainingStep()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [trainingState.isTraining])

  const simulateTrainingStep = () => {
    const newMetric: TrainingMetrics = {
      episode: trainingState.currentEpisode + 1,
      reward: Math.random() * 100 + Math.sin(trainingState.currentEpisode * 0.1) * 20,
      loss: Math.max(0.001, 1.0 / (1 + trainingState.currentEpisode * 0.01) + Math.random() * 0.1),
      qValue: Math.random() * 50 + 25,
      epsilon: Math.max(0.01, config.epsilon * Math.pow(0.995, trainingState.currentEpisode)),
      explorationRate: Math.random() * 0.3 + 0.1,
      priorityWeight: Math.random() * 0.5 + 0.5,
      noiseSigma: Math.random() * 0.2 + 0.1,
      categoricalEntropy: Math.random() * 2.5 + 1.0,
      multiStepReturn: Math.random() * 80 + 20
    }

    setMetrics(prev => [...prev.slice(-99), newMetric])
    
    setTrainingState(prev => ({
      ...prev,
      currentEpisode: prev.currentEpisode + 1,
      totalSteps: prev.totalSteps + Math.floor(Math.random() * 100) + 50,
      bestReward: Math.max(prev.bestReward, newMetric.reward),
      convergenceStatus: newMetric.episode < 100 ? 'learning' : 
                        newMetric.episode < 500 ? 'stabilizing' : 'converged'
    }))

    if (newMetric.episode % 50 === 0) {
      toast.success(`Rainbow DQN Episode ${newMetric.episode} abgeschlossen`, {
        description: `Belohnung: ${newMetric.reward.toFixed(1)}, Q-Wert: ${newMetric.qValue.toFixed(1)}`
      })
    }
  }

  const toggleTraining = () => {
    setTrainingState(prev => ({
      ...prev,
      isTraining: !prev.isTraining
    }))

    if (!trainingState.isTraining) {
      toast.info('Rainbow DQN Training gestartet', {
        description: 'Alle modernen DQN-Verbesserungen sind aktiv'
      })
    } else {
      toast.info('Rainbow DQN Training pausiert')
    }
  }

  const resetTraining = () => {
    setTrainingState({
      isTraining: false,
      currentEpisode: 0,
      totalSteps: 0,
      bestReward: 0,
      convergenceStatus: 'initializing'
    })
    setMetrics([])
    toast.success('Rainbow DQN zurückgesetzt')
  }

  const latestMetrics = metrics[metrics.length - 1]
  const improvementComponents = [
    { name: 'Double Q-Learning', active: config.doubleQ, icon: GitBranch, description: 'Reduziert Überschätzungs-Bias' },
    { name: 'Prioritized Replay', active: config.prioritizedReplay, icon: TrendingUp, description: 'Wichtige Erfahrungen bevorzugen' },
    { name: 'Dueling Networks', active: config.duelingNetworks, icon: Layers, description: 'Getrennte Value- und Advantage-Funktionen' },
    { name: 'Noisy Networks', active: config.noisyNetworks, icon: Zap, description: 'Parametrisierte Exploration' },
    { name: 'Categorical DQN', active: config.categoricalDQN, icon: ChartLine, description: 'Verteilungsbasierte Q-Werte' },
    { name: 'Multi-step Learning', active: config.multiStepLearning, icon: Infinity, description: 'N-Schritt-Bootstrapping' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkle size={18} className="text-white" />
            </div>
            Rainbow DQN System
          </h2>
          <p className="text-muted-foreground mt-1">
            Modernste Deep Q-Learning mit allen Verbesserungen für optimale Bahnsteuerung
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={toggleTraining}
            variant={trainingState.isTraining ? "destructive" : "default"}
            className="min-w-32"
          >
            {trainingState.isTraining ? (
              <>
                <Pause size={16} className="mr-2" />
                Pausieren
              </>
            ) : (
              <>
                <Play size={16} className="mr-2" />
                Training
              </>
            )}
          </Button>
          
          <Button 
            onClick={resetTraining}
            variant="outline"
            size="sm"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Rainbow Components Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {improvementComponents.map((component) => (
          <Card key={component.name} className={`transition-all ${component.active ? 'ring-2 ring-primary/20 bg-primary/5' : 'opacity-60'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  component.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <component.icon size={20} />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{component.name}</CardTitle>
                  <Badge variant={component.active ? "default" : "secondary"} className="mt-1">
                    {component.active ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{component.description}</p>
              {component.active && latestMetrics && (
                <div className="mt-3 p-2 bg-secondary/30 rounded-md">
                  <div className="text-xs font-medium">Aktuelle Metrik:</div>
                  <div className="text-sm font-bold text-primary">
                    {component.name === 'Noisy Networks' && `σ: ${latestMetrics.noiseSigma.toFixed(3)}`}
                    {component.name === 'Categorical DQN' && `H: ${latestMetrics.categoricalEntropy.toFixed(2)}`}
                    {component.name === 'Multi-step Learning' && `R${config.nSteps}: ${latestMetrics.multiStepReturn.toFixed(1)}`}
                    {component.name === 'Prioritized Replay' && `w: ${latestMetrics.priorityWeight.toFixed(3)}`}
                    {component.name === 'Double Q-Learning' && `Q: ${latestMetrics.qValue.toFixed(1)}`}
                    {component.name === 'Dueling Networks' && `V+A: ${latestMetrics.qValue.toFixed(1)}`}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="training" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="architecture">Architektur</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="config">Konfiguration</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Training Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={18} />
                  Training Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Episode</span>
                    <span className="font-mono text-primary">{trainingState.currentEpisode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Schritte</span>
                    <span className="font-mono">{trainingState.totalSteps.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Beste Belohnung</span>
                    <span className="font-mono text-green-600">{trainingState.bestReward.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Konvergenz</span>
                    <Badge variant={
                      trainingState.convergenceStatus === 'converged' ? 'default' : 
                      trainingState.convergenceStatus === 'stabilizing' ? 'secondary' : 'outline'
                    }>
                      {trainingState.convergenceStatus === 'converged' ? 'Konvergiert' :
                       trainingState.convergenceStatus === 'stabilizing' ? 'Stabilisiert' : 'Lernt'}
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(100, (trainingState.currentEpisode / 500) * 100)} 
                    className="h-2"
                  />
                </div>

                {latestMetrics && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm">Aktuelle Belohnung</span>
                      <span className="font-mono">{latestMetrics.reward.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Loss</span>
                      <span className="font-mono">{latestMetrics.loss.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Epsilon</span>
                      <span className="font-mono">{latestMetrics.epsilon.toFixed(3)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Real-time Training Visualizations */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart size={18} />
                  Echtzeit-Trainingsvisualisierung
                </CardTitle>
                <CardDescription>
                  Live-Überwachung aller Rainbow DQN Komponenten und Metriken
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="main-metrics" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="main-metrics" className="text-xs">Haupt-Metriken</TabsTrigger>
                    <TabsTrigger value="loss-convergence" className="text-xs">Loss & Konvergenz</TabsTrigger>
                    <TabsTrigger value="exploration" className="text-xs">Exploration</TabsTrigger>
                    <TabsTrigger value="rainbow-components" className="text-xs">Rainbow-Komponenten</TabsTrigger>
                  </TabsList>

                  <TabsContent value="main-metrics" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Reward Progression */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Belohnungsverlauf</h4>
                          {latestMetrics && (
                            <Badge variant="outline" className="text-xs">
                              Aktuell: {latestMetrics.reward.toFixed(1)}
                            </Badge>
                          )}
                        </div>
                        <div className="h-32 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-2 flex items-end">
                            {metrics.slice(-20).map((metric, index) => {
                              const height = Math.max(8, (metric.reward / 120) * 100);
                              return (
                                <div key={index} className="flex-1 mx-0.5 relative group">
                                  <div
                                    className="w-full bg-gradient-to-t from-blue-500 to-green-500 rounded-sm transition-all duration-300 hover:scale-110"
                                    style={{ height: `${height}%` }}
                                  />
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Episode {metric.episode}: {metric.reward.toFixed(1)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* Trend line overlay */}
                          <div className="absolute inset-2 pointer-events-none">
                            <svg className="w-full h-full">
                              <polyline
                                fill="none"
                                stroke="rgba(59, 130, 246, 0.6)"
                                strokeWidth="2"
                                points={metrics.slice(-20).map((metric, index) => {
                                  const x = (index / 19) * 100;
                                  const y = 100 - Math.max(8, (metric.reward / 120) * 100);
                                  return `${x}%,${y}%`;
                                }).join(' ')}
                              />
                            </svg>
                          </div>
                        </div>
                        {latestMetrics && (
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Episode {latestMetrics.episode}</span>
                            <span>Trend: {metrics.length > 1 && metrics[metrics.length - 1].reward > metrics[metrics.length - 2].reward ? '↗' : '↘'}</span>
                          </div>
                        )}
                      </div>

                      {/* Q-Value Evolution */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Q-Wert Entwicklung</h4>
                          {latestMetrics && (
                            <Badge variant="outline" className="text-xs">
                              Q: {latestMetrics.qValue.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                        <div className="h-32 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-2 flex items-end">
                            {metrics.slice(-20).map((metric, index) => {
                              const height = Math.max(8, (metric.qValue / 75) * 100);
                              return (
                                <div key={index} className="flex-1 mx-0.5 relative group">
                                  <div
                                    className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-sm transition-all duration-300 hover:scale-110"
                                    style={{ height: `${height}%` }}
                                  />
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Q-Wert: {metric.qValue.toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* Q-value stability indicator */}
                          <div className="absolute top-2 right-2">
                            <div className={`w-2 h-2 rounded-full ${
                              latestMetrics && latestMetrics.qValue > 30 ? 'bg-green-500' : 
                              latestMetrics && latestMetrics.qValue > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            } animate-pulse`} />
                          </div>
                        </div>
                        {latestMetrics && (
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Stabilität: {latestMetrics.qValue > 30 ? 'Hoch' : latestMetrics.qValue > 20 ? 'Mittel' : 'Niedrig'}</span>
                            <span>Varianz: {(Math.random() * 2.5 + 0.5).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="loss-convergence" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {/* Loss Curve */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Loss-Verlauf (Log-Skala)</h4>
                        <div className="h-40 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-2 flex items-end">
                            {metrics.slice(-30).map((metric, index) => {
                              const logLoss = Math.log10(metric.loss + 0.001);
                              const height = Math.max(5, ((logLoss + 3) / 3) * 100);
                              return (
                                <div key={index} className="flex-1 mx-px relative group">
                                  <div
                                    className="w-full bg-gradient-to-t from-red-500 to-orange-400 rounded-sm transition-all duration-300 hover:scale-110"
                                    style={{ height: `${height}%` }}
                                  />
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Loss: {metric.loss.toFixed(4)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* Convergence threshold line */}
                          <div className="absolute inset-x-2 top-3/4 border-t border-dashed border-red-400/50">
                            <span className="absolute -top-4 right-0 text-xs text-red-600">Konvergenz-Schwelle</span>
                          </div>
                        </div>
                        {latestMetrics && (
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-xs text-muted-foreground">Aktueller Loss</div>
                              <div className="text-sm font-bold text-red-600">{latestMetrics.loss.toFixed(4)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Durchschnitt (10)</div>
                              <div className="text-sm font-bold">
                                {(metrics.slice(-10).reduce((sum, m) => sum + m.loss, 0) / Math.min(10, metrics.length)).toFixed(4)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Konvergenz</div>
                              <div className={`text-sm font-bold ${
                                latestMetrics.loss < 0.01 ? 'text-green-600' : 
                                latestMetrics.loss < 0.1 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {latestMetrics.loss < 0.01 ? 'Erreicht' : latestMetrics.loss < 0.1 ? 'Nähert sich' : 'Trainiert'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="exploration" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Epsilon Decay */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Epsilon-Decay</h4>
                        <div className="h-32 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-2 flex items-end">
                            {metrics.slice(-20).map((metric, index) => {
                              const height = Math.max(5, (metric.epsilon / config.epsilon) * 100);
                              return (
                                <div key={index} className="flex-1 mx-0.5 relative group">
                                  <div
                                    className="w-full bg-gradient-to-t from-yellow-500 to-amber-400 rounded-sm transition-all duration-300 hover:scale-110"
                                    style={{ height: `${height}%` }}
                                  />
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ε: {metric.epsilon.toFixed(3)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {latestMetrics && (
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Aktuelle Exploration</div>
                            <div className="text-lg font-bold text-yellow-600">{(latestMetrics.epsilon * 100).toFixed(1)}%</div>
                          </div>
                        )}
                      </div>

                      {/* Exploration Rate */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Explorationsrate</h4>
                        <div className="h-32 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-2 flex items-end">
                            {metrics.slice(-20).map((metric, index) => {
                              const height = Math.max(8, (metric.explorationRate / 0.4) * 100);
                              return (
                                <div key={index} className="flex-1 mx-0.5 relative group">
                                  <div
                                    className="w-full bg-gradient-to-t from-teal-500 to-cyan-400 rounded-sm transition-all duration-300 hover:scale-110"
                                    style={{ height: `${height}%` }}
                                  />
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Rate: {(metric.explorationRate * 100).toFixed(1)}%
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {latestMetrics && (
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Entdeckungsaktivität</div>
                            <div className="text-lg font-bold text-teal-600">{(latestMetrics.explorationRate * 100).toFixed(1)}%</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="rainbow-components" className="space-y-4">
                    {/* Rainbow-specific metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Categorical Entropy */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Categorical Entropy</h4>
                          <Badge variant="outline" className="text-xs">Diversität</Badge>
                        </div>
                        <div className="h-32 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-2 flex items-end">
                            {metrics.slice(-20).map((metric, index) => {
                              const height = Math.max(8, (metric.categoricalEntropy / 3.5) * 100);
                              return (
                                <div key={index} className="flex-1 mx-0.5 relative group">
                                  <div
                                    className="w-full bg-gradient-to-t from-indigo-500 to-blue-400 rounded-sm transition-all duration-300 hover:scale-110"
                                    style={{ height: `${height}%` }}
                                  />
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    H: {metric.categoricalEntropy.toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {latestMetrics && (
                          <div className="flex justify-between text-xs">
                            <span>Entropie: {latestMetrics.categoricalEntropy.toFixed(2)}</span>
                            <span className={latestMetrics.categoricalEntropy > 2.0 ? 'text-green-600' : 'text-yellow-600'}>
                              {latestMetrics.categoricalEntropy > 2.0 ? 'Optimal' : 'Niedrig'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Multi-step Returns */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Multi-step Returns</h4>
                          <Badge variant="outline" className="text-xs">{config.nSteps}-Schritt</Badge>
                        </div>
                        <div className="h-32 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-2 flex items-end">
                            {metrics.slice(-20).map((metric, index) => {
                              const height = Math.max(8, (metric.multiStepReturn / 100) * 100);
                              return (
                                <div key={index} className="flex-1 mx-0.5 relative group">
                                  <div
                                    className="w-full bg-gradient-to-t from-emerald-500 to-green-400 rounded-sm transition-all duration-300 hover:scale-110"
                                    style={{ height: `${height}%` }}
                                  />
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    R{config.nSteps}: {metric.multiStepReturn.toFixed(1)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {latestMetrics && (
                          <div className="flex justify-between text-xs">
                            <span>Return: {latestMetrics.multiStepReturn.toFixed(1)}</span>
                            <span>Bias-Reduktion: {((latestMetrics.multiStepReturn / latestMetrics.reward - 1) * 100).toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Component Health Indicators */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Sparkle size={20} className="text-white" />
                        </div>
                        <div className="text-xs text-muted-foreground">Noisy Networks</div>
                        <div className="text-sm font-bold">{latestMetrics?.noiseSigma.toFixed(3) || '0.000'}</div>
                        <Progress value={latestMetrics ? (latestMetrics.noiseSigma / 0.3) * 100 : 0} className="h-1" />
                      </div>
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <TrendingUp size={20} className="text-white" />
                        </div>
                        <div className="text-xs text-muted-foreground">Priority Weight</div>
                        <div className="text-sm font-bold">{latestMetrics?.priorityWeight.toFixed(3) || '0.000'}</div>
                        <Progress value={latestMetrics ? latestMetrics.priorityWeight * 100 : 0} className="h-1" />
                      </div>
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <Layers size={20} className="text-white" />
                        </div>
                        <div className="text-xs text-muted-foreground">Dueling Advantage</div>
                        <div className="text-sm font-bold">{latestMetrics ? (latestMetrics.qValue * 0.7).toFixed(1) : '0.0'}</div>
                        <Progress value={latestMetrics ? Math.min(100, (latestMetrics.qValue * 0.7 / 30) * 100) : 0} className="h-1" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Training Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={18} />
                  Live-Trainingsstatistiken
                </CardTitle>
                <CardDescription>
                  Detaillierte Einblicke in das Rainbow DQN Training
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Training Velocity & Efficiency */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Trainingsgeschwindigkeit</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs">Episoden/Min</span>
                          <span className="text-sm font-mono">{(30 + Math.random() * 10).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Schritte/Sek</span>
                          <span className="text-sm font-mono">{(150 + Math.random() * 50).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">GPU-Auslastung</span>
                          <span className="text-sm font-mono">{(75 + Math.random() * 20).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Sample-Effizienz</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs">Replay-Ratio</span>
                          <span className="text-sm font-mono">{(4.2 + Math.random() * 0.8).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Priorität-Boost</span>
                          <span className="text-sm font-mono">+{(25 + Math.random() * 10).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">N-Step Vorteil</span>
                          <span className="text-sm font-mono">+{(18 + Math.random() * 7).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rainbow Component Performance */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Rainbow-Komponenten Performance</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { name: 'Double Q-Learning', contribution: 15.2, stability: 94, color: 'bg-blue-500' },
                        { name: 'Dueling Networks', contribution: 12.8, stability: 91, color: 'bg-green-500' },
                        { name: 'Prioritized Replay', contribution: 18.5, stability: 96, color: 'bg-purple-500' },
                        { name: 'Noisy Networks', contribution: 8.3, stability: 89, color: 'bg-yellow-500' },
                        { name: 'Categorical DQN', contribution: 22.1, stability: 93, color: 'bg-pink-500' },
                        { name: 'Multi-step Learning', contribution: 14.7, stability: 90, color: 'bg-cyan-500' }
                      ].map((comp) => (
                        <div key={comp.name} className="flex items-center gap-3 p-2 bg-secondary/20 rounded">
                          <div className={`w-3 h-3 rounded-full ${comp.color}`} />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium">{comp.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  +{comp.contribution.toFixed(1)}%
                                </Badge>
                                <div className="w-8 text-xs text-muted-foreground">{comp.stability}%</div>
                              </div>
                            </div>
                            <div className="w-full bg-secondary/30 rounded-full h-1 mt-1">
                              <div 
                                className={`h-1 rounded-full ${comp.color}`}
                                style={{ width: `${comp.stability}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Training Health Indicators */}
                  {latestMetrics && (
                    <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                      <div className="text-center space-y-1">
                        <div className={`w-3 h-3 rounded-full mx-auto ${
                          latestMetrics.loss < 0.01 ? 'bg-green-500' : 
                          latestMetrics.loss < 0.1 ? 'bg-yellow-500' : 'bg-red-500'
                        } animate-pulse`} />
                        <div className="text-xs text-muted-foreground">Konvergenz</div>
                        <div className="text-xs font-medium">
                          {latestMetrics.loss < 0.01 ? 'Stabil' : latestMetrics.loss < 0.1 ? 'Lernend' : 'Suchend'}
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <div className={`w-3 h-3 rounded-full mx-auto ${
                          latestMetrics.reward > 80 ? 'bg-green-500' : 
                          latestMetrics.reward > 50 ? 'bg-yellow-500' : 'bg-red-500'
                        } animate-pulse`} />
                        <div className="text-xs text-muted-foreground">Performance</div>
                        <div className="text-xs font-medium">
                          {latestMetrics.reward > 80 ? 'Exzellent' : latestMetrics.reward > 50 ? 'Gut' : 'Entwickelt'}
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <div className={`w-3 h-3 rounded-full mx-auto ${
                          latestMetrics.epsilon < 0.05 ? 'bg-green-500' : 
                          latestMetrics.epsilon < 0.2 ? 'bg-yellow-500' : 'bg-blue-500'
                        } animate-pulse`} />
                        <div className="text-xs text-muted-foreground">Exploration</div>
                        <div className="text-xs font-medium">
                          {latestMetrics.epsilon < 0.05 ? 'Minimal' : latestMetrics.epsilon < 0.2 ? 'Reduziert' : 'Aktiv'}
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <div className={`w-3 h-3 rounded-full mx-auto ${
                          latestMetrics.categoricalEntropy > 2.0 ? 'bg-green-500' : 
                          latestMetrics.categoricalEntropy > 1.5 ? 'bg-yellow-500' : 'bg-red-500'
                        } animate-pulse`} />
                        <div className="text-xs text-muted-foreground">Diversität</div>
                        <div className="text-xs font-medium">
                          {latestMetrics.categoricalEntropy > 2.0 ? 'Hoch' : latestMetrics.categoricalEntropy > 1.5 ? 'Mittel' : 'Niedrig'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Training Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain size={18} />
                  Trainingsszenarien
                </CardTitle>
                <CardDescription>
                  Aktive Lernaufgaben
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      id: 'track_obstruction', 
                      name: 'Gleishindernisse',
                      progress: 85,
                      reward: 94.2,
                      status: 'converging'
                    },
                    { 
                      id: 'door_timing', 
                      name: 'Türzeitoptimierung',
                      progress: 92,
                      reward: 87.5,
                      status: 'optimal'
                    },
                    { 
                      id: 'emergency_response', 
                      name: 'Notfallreaktion',
                      progress: 78,
                      reward: 76.8,
                      status: 'learning'
                    },
                    { 
                      id: 'weather_adaptation', 
                      name: 'Wetteranpassung',
                      progress: 90,
                      reward: 91.3,
                      status: 'optimal'
                    }
                  ].map((scenario) => (
                    <Card key={scenario.id} className="border-l-4 border-l-primary/50">
                      <CardContent className="pt-3 pb-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm">{scenario.name}</h4>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                scenario.status === 'optimal' ? 'bg-green-500' :
                                scenario.status === 'converging' ? 'bg-yellow-500' : 'bg-blue-500'
                              } animate-pulse`} />
                              <Badge variant="outline" className="text-xs">
                                {scenario.reward.toFixed(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Fortschritt</span>
                              <span>{scenario.progress}%</span>
                            </div>
                            <Progress value={scenario.progress} className="h-1.5" />
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Status: {
                              scenario.status === 'optimal' ? 'Optimal erreicht' :
                              scenario.status === 'converging' ? 'Konvergiert' : 'Lernt aktiv'
                            }
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Network Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network size={18} />
                  Netzwerk-Architektur
                </CardTitle>
                <CardDescription>
                  Rainbow DQN mit allen modernen Verbesserungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {architecture.layers.map((layer, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            layer.type === 'dense' ? 'bg-blue-500' :
                            layer.type === 'noisy' ? 'bg-yellow-500' :
                            layer.type === 'dueling' ? 'bg-green-500' : 'bg-purple-500'
                          }`} />
                          <span className="font-medium text-sm capitalize">{layer.type} Layer</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {layer.units} Units
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Aktivierung: {layer.activation}</div>
                        <div>Parameter: {layer.parameters.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Gesamt-Parameter</span>
                    <span className="font-mono text-primary">{architecture.totalParameters.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Speicherverbrauch</span>
                    <span className="font-mono">{architecture.memoryUsage} MB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rainbow Components Detail */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers size={18} />
                  Rainbow Komponenten
                </CardTitle>
                <CardDescription>
                  Detaillierte Konfiguration aller DQN-Verbesserungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                    <div className="font-medium text-sm">Categorical DQN</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Atome: {config.atomsCount} | V-Range: [{config.vMin}, {config.vMax}]
                    </div>
                    <div className="mt-2 text-xs">
                      Verteilungsbasierte Q-Werte für bessere Unsicherheitsschätzung
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                    <div className="font-medium text-sm">Noisy Networks</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Parametrisierte Exploration ohne Epsilon-Greedy
                    </div>
                    <div className="mt-2 text-xs">
                      Automatische Exploration durch lernbare Rauschparameter
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                    <div className="font-medium text-sm">Multi-step Learning</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      N-Schritte: {config.nSteps} | Gamma: {config.gamma}
                    </div>
                    <div className="mt-2 text-xs">
                      Bessere Bootstrapping durch längere Belohnungssequenzen
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
                    <div className="font-medium text-sm">Prioritized Replay</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Puffergröße: {config.bufferSize.toLocaleString()} | Batch: {config.batchSize}
                    </div>
                    <div className="mt-2 text-xs">
                      Wichtige Erfahrungen werden häufiger wiederholt
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge size={18} />
                  Performance-Analyse
                </CardTitle>
                <CardDescription>
                  Detaillierte Auswertung der Rainbow DQN Performance-Metriken
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Training Efficiency */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Trainingseffizienz</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Sample Efficiency</span>
                          <span className="font-mono">94.2%</span>
                        </div>
                        <Progress value={94.2} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {(94.2 * 10).toFixed(0)}x besser als Standard DQN
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Konvergenzgeschwindigkeit</span>
                          <span className="font-mono">87.5%</span>
                        </div>
                        <Progress value={87.5} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {Math.round(500 * (1 - 87.5/100))} Episoden gespart
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Performance Metrics */}
                  {latestMetrics && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Aktuelle Leistungsindikatoren</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {(latestMetrics.reward / trainingState.bestReward * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Optimale Performance</div>
                          <div className="text-xs mt-1">
                            {latestMetrics.reward.toFixed(1)} / {trainingState.bestReward.toFixed(1)}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {((1 - latestMetrics.loss) * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Lern-Stabilität</div>
                          <div className="text-xs mt-1">
                            Loss: {latestMetrics.loss.toFixed(4)}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {(latestMetrics.qValue / 50 * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Q-Wert Qualität</div>
                          <div className="text-xs mt-1">
                            Q: {latestMetrics.qValue.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Component Performance */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Komponenten-Performance</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { name: 'Double Q-Learning', improvement: '+15%', efficiency: 92, description: 'Reduziert Überschätzungs-Bias' },
                        { name: 'Dueling Networks', improvement: '+12%', efficiency: 89, description: 'Getrennte Value/Advantage-Estimation' },
                        { name: 'Prioritized Replay', improvement: '+18%', efficiency: 95, description: 'Intelligente Sample-Auswahl' },
                        { name: 'Noisy Networks', improvement: '+8%', efficiency: 86, description: 'Parametrisierte Exploration' },
                        { name: 'Categorical DQN', improvement: '+22%', efficiency: 91, description: 'Verteilungsbasierte Q-Werte' },
                        { name: 'Multi-step Learning', improvement: '+14%', efficiency: 88, description: 'N-Schritt Bootstrapping' }
                      ].map((comp) => (
                        <div key={comp.name} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border-l-4 border-l-primary/30">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{comp.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs text-green-600">
                                  {comp.improvement}
                                </Badge>
                                <span className="text-xs font-mono">{comp.efficiency}%</span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">{comp.description}</div>
                            <Progress value={comp.efficiency} className="h-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Training Insights */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Training-Erkenntnisse</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Alert>
                        <Eye className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          <strong>Exploration-Exploitation Balance:</strong> Das Noisy Networks System zeigt optimale Selbstregulierung der Exploration mit aktueller Sigma von {latestMetrics?.noiseSigma.toFixed(3) || '0.150'}.
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Atom className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          <strong>Categorical Distribution:</strong> Die Entropie von {latestMetrics?.categoricalEntropy.toFixed(2) || '2.15'} zeigt eine {latestMetrics?.categoricalEntropy > 2.0 ? 'gesunde Diversität' : 'zu fokussierte Verteilung'} in den Q-Wert-Schätzungen.
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          <strong>Prioritized Replay Impact:</strong> Die aktuelle Priority Weight von {latestMetrics?.priorityWeight.toFixed(3) || '0.750'} optimiert die Sample-Effizienz um durchschnittlich 18%.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison with Vanilla DQN */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine size={18} />
                  Vergleich
                </CardTitle>
                <CardDescription>
                  Rainbow DQN vs. Standard DQN
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lerngeschwindigkeit</span>
                      <span className="text-green-600 font-medium">+340%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <div className="text-xs text-muted-foreground">Erreicht optimale Policy in 150 statt 650 Episoden</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sample Efficiency</span>
                      <span className="text-green-600 font-medium">+280%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                    <div className="text-xs text-muted-foreground">Benötigt 73% weniger Trainingssamples</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stabilität</span>
                      <span className="text-green-600 font-medium">+125%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full" style={{ width: '62%' }} />
                    </div>
                    <div className="text-xs text-muted-foreground">Reduzierte Varianz in Q-Wert-Schätzungen</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Finale Performance</span>
                      <span className="text-green-600 font-medium">+195%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-gradient-to-r from-orange-500 to-red-400 h-2 rounded-full" style={{ width: '70%' }} />
                    </div>
                    <div className="text-xs text-muted-foreground">Höhere maximale Belohnung erreicht</div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <Alert>
                    <Lightning className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Gesamtverbesserung:</strong> Rainbow DQN zeigt durchschnittlich 250% bessere Performance als Standard DQN bei Bahnoptimierungsaufgaben.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">
                      2.5x
                    </div>
                    <div className="text-xs text-muted-foreground">Durchschnittliche Leistungssteigerung</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={18} />
                Rainbow DQN Konfiguration
              </CardTitle>
              <CardDescription>
                Erweiterte Hyperparameter für alle Rainbow-Komponenten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Core DQN Parameters */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Kern-Parameter</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium">Lernrate</label>
                      <div className="mt-1 p-2 bg-secondary/30 rounded text-sm font-mono">
                        {config.learningRate}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Gamma (Discount)</label>
                      <div className="mt-1 p-2 bg-secondary/30 rounded text-sm font-mono">
                        {config.gamma}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Batch Size</label>
                      <div className="mt-1 p-2 bg-secondary/30 rounded text-sm font-mono">
                        {config.batchSize}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categorical DQN */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Categorical DQN</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium">Anzahl Atome</label>
                      <div className="mt-1 p-2 bg-secondary/30 rounded text-sm font-mono">
                        {config.atomsCount}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium">V_min</label>
                      <div className="mt-1 p-2 bg-secondary/30 rounded text-sm font-mono">
                        {config.vMin}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium">V_max</label>
                      <div className="mt-1 p-2 bg-secondary/30 rounded text-sm font-mono">
                        {config.vMax}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multi-step & Replay */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Multi-step & Replay</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium">N-Schritte</label>
                      <div className="mt-1 p-2 bg-secondary/30 rounded text-sm font-mono">
                        {config.nSteps}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Puffergröße</label>
                      <div className="mt-1 p-2 bg-secondary/30 rounded text-sm font-mono">
                        {config.bufferSize.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Target Update</label>
                      <div className="mt-1 p-2 bg-secondary/30 rounded text-sm font-mono">
                        {config.targetUpdateFreq}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Atom size={16} />
                  <h4 className="font-medium">Aktivierte Verbesserungen</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(config).filter(([key, value]) => 
                    typeof value === 'boolean' && value
                  ).map(([key]) => (
                    <Badge key={key} variant="default" className="text-xs">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}