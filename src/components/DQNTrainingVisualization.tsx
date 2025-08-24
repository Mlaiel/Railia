import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Play,
  Pause,
  Stop,
  RefreshCw,
  Activity,
  ChartLine,
  Brain,
  Target,
  Zap,
  BarChart3,
  TrendUp,
  TrendDown,
  Eye,
  Gear,
  Network,
  Lightning,
  Clock,
  CheckCircle,
  AlertTriangle
} from '@phosphor-icons/react'

interface DQNMetrics {
  episode: number
  reward: number
  loss: number
  epsilon: number
  qValue: number
  learningRate: number
  accuracy: number
  timestamp: string
}

interface DQNConfiguration {
  networkArchitecture: string[]
  learningRate: number
  epsilon: number
  epsilonDecay: number
  batchSize: number
  memorySize: number
  targetUpdateFreq: number
  gamma: number
}

interface TrainingVisualization {
  id: string
  name: string
  status: 'idle' | 'training' | 'paused' | 'completed'
  config: DQNConfiguration
  metrics: DQNMetrics[]
  currentEpisode: number
  totalEpisodes: number
  bestReward: number
  convergenceScore: number
  stabilityIndex: number
}

export default function DQNTrainingVisualization() {
  const [trainingSessions, setTrainingSessions] = useKV<TrainingVisualization[]>('dqn-training-sessions', [
    {
      id: 'dqn-urban-1',
      name: 'Städtisches Netzwerk DQN',
      status: 'training',
      config: {
        networkArchitecture: ['512', '256', '128', '64'],
        learningRate: 0.001,
        epsilon: 0.85,
        epsilonDecay: 0.995,
        batchSize: 32,
        memorySize: 100000,
        targetUpdateFreq: 1000,
        gamma: 0.99
      },
      metrics: [],
      currentEpisode: 2347,
      totalEpisodes: 5000,
      bestReward: 892.5,
      convergenceScore: 78.4,
      stabilityIndex: 85.2
    },
    {
      id: 'dqn-mountain-1',
      name: 'Gebirgs-Strecken DQN',
      status: 'training',
      config: {
        networkArchitecture: ['256', '128', '64'],
        learningRate: 0.0015,
        epsilon: 0.75,
        epsilonDecay: 0.99,
        batchSize: 64,
        memorySize: 80000,
        targetUpdateFreq: 800,
        gamma: 0.95
      },
      metrics: [],
      currentEpisode: 1856,
      totalEpisodes: 4000,
      bestReward: 654.2,
      convergenceScore: 65.8,
      stabilityIndex: 72.1
    }
  ])

  const [selectedSession, setSelectedSession] = useState('dqn-urban-1')
  const [activeTab, setActiveTab] = useState('realtime')
  const [isRealTimeUpdating, setIsRealTimeUpdating] = useState(true)

  // Simulate real-time training data
  useEffect(() => {
    if (!isRealTimeUpdating) return

    const interval = setInterval(() => {
      setTrainingSessions(prev => prev.map(session => {
        if (session.status !== 'training') return session

        const newEpisode = session.currentEpisode + Math.floor(Math.random() * 5 + 1)
        const baseReward = 400 + (newEpisode / session.totalEpisodes) * 400
        const noise = (Math.random() - 0.5) * 100
        const newReward = Math.max(0, baseReward + noise)
        
        const newLoss = Math.max(0.001, 0.5 - (newEpisode / session.totalEpisodes) * 0.4 + (Math.random() - 0.5) * 0.1)
        const newEpsilon = Math.max(0.01, session.config.epsilon * session.config.epsilonDecay)
        const newQValue = 200 + (newEpisode / session.totalEpisodes) * 300 + (Math.random() - 0.5) * 50
        const newAccuracy = Math.min(99, 60 + (newEpisode / session.totalEpisodes) * 35 + (Math.random() - 0.5) * 5)

        const newMetric: DQNMetrics = {
          episode: newEpisode,
          reward: newReward,
          loss: newLoss,
          epsilon: newEpsilon,
          qValue: newQValue,
          learningRate: session.config.learningRate,
          accuracy: newAccuracy,
          timestamp: new Date().toISOString()
        }

        const updatedMetrics = [...session.metrics, newMetric].slice(-100) // Keep last 100 metrics

        return {
          ...session,
          currentEpisode: Math.min(newEpisode, session.totalEpisodes),
          metrics: updatedMetrics,
          bestReward: Math.max(session.bestReward, newReward),
          convergenceScore: Math.min(99, session.convergenceScore + Math.random() * 0.5),
          stabilityIndex: Math.max(60, Math.min(95, session.stabilityIndex + (Math.random() - 0.5) * 2)),
          config: {
            ...session.config,
            epsilon: newEpsilon
          },
          status: newEpisode >= session.totalEpisodes ? 'completed' : 'training'
        }
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isRealTimeUpdating, setTrainingSessions])

  const currentSession = trainingSessions.find(s => s.id === selectedSession)
  const recentMetrics = currentSession?.metrics.slice(-20) || []
  const latestMetric = currentSession?.metrics[currentSession.metrics.length - 1]

  const startTraining = (sessionId: string) => {
    setTrainingSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, status: 'training' } : session
    ))
    toast.success('DQN Training gestartet')
  }

  const pauseTraining = (sessionId: string) => {
    setTrainingSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, status: 'paused' } : session
    ))
    toast.info('DQN Training pausiert')
  }

  const resetTraining = (sessionId: string) => {
    setTrainingSessions(prev => prev.map(session => 
      session.id === sessionId ? { 
        ...session, 
        status: 'idle',
        currentEpisode: 0,
        metrics: [],
        bestReward: 0,
        convergenceScore: 0,
        stabilityIndex: 0
      } : session
    ))
    toast.warning('DQN Training zurückgesetzt')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      default: return 'bg-gray-400'
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendUp size={14} className="text-green-500" />
    if (current < previous) return <TrendDown size={14} className="text-red-500" />
    return <div className="w-3.5 h-3.5" />
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Brain size={24} className="text-primary" />
            </div>
            DQN Training Visualisierung
          </h1>
          <p className="text-muted-foreground mt-2">
            Echtzeit-Überwachung von Deep Q-Learning Netzwerken
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={isRealTimeUpdating ? "default" : "outline"}
            onClick={() => setIsRealTimeUpdating(!isRealTimeUpdating)}
          >
            <Activity size={16} className="mr-2" />
            {isRealTimeUpdating ? 'Live' : 'Pausiert'}
          </Button>
        </div>
      </div>

      {/* Session Selection */}
      <div className="flex flex-wrap gap-2">
        {trainingSessions.map((session) => (
          <Button
            key={session.id}
            variant={selectedSession === session.id ? "default" : "outline"}
            onClick={() => setSelectedSession(session.id)}
            className="flex items-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`}></div>
            {session.name}
          </Button>
        ))}
      </div>

      {currentSession && (
        <>
          {/* Current Session Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Aktuelle Episode</CardDescription>
                  <Clock size={16} className="text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {currentSession.currentEpisode.toLocaleString()}
                </div>
                <Progress 
                  value={(currentSession.currentEpisode / currentSession.totalEpisodes) * 100} 
                  className="mt-2 h-2" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  von {currentSession.totalEpisodes.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Beste Belohnung</CardDescription>
                  <Target size={16} className="text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {(currentSession.bestReward || 0).toFixed(1)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {latestMetric && recentMetrics.length > 1 && 
                    getTrendIcon(latestMetric.reward, recentMetrics[recentMetrics.length - 2]?.reward)
                  }
                  <p className="text-xs text-muted-foreground">
                    Aktuell: {latestMetric?.reward.toFixed(1) || '0'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Konvergenz</CardDescription>
                  <ChartLine size={16} className="text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {(currentSession.convergenceScore || 0).toFixed(1)}%
                </div>
                <Progress value={currentSession.convergenceScore} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Stabilität</CardDescription>
                  <CheckCircle size={16} className="text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {(currentSession.stabilityIndex || 0).toFixed(1)}%
                </div>
                <Progress value={currentSession.stabilityIndex} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Training Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gear size={20} />
                Training-Kontrolle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {currentSession.status === 'idle' || currentSession.status === 'paused' ? (
                  <Button 
                    onClick={() => startTraining(currentSession.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play size={16} className="mr-2" />
                    Training starten
                  </Button>
                ) : (
                  <Button 
                    onClick={() => pauseTraining(currentSession.id)}
                    variant="outline"
                  >
                    <Pause size={16} className="mr-2" />
                    Pausieren
                  </Button>
                )}
                
                <Button 
                  onClick={() => resetTraining(currentSession.id)}
                  variant="destructive"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Zurücksetzen
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  <Badge variant="outline" className={`flex items-center gap-1 ${
                    currentSession.status === 'training' ? 'border-green-500 text-green-700' :
                    currentSession.status === 'completed' ? 'border-blue-500 text-blue-700' :
                    'border-gray-500 text-gray-700'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(currentSession.status)}`}></div>
                    {currentSession.status === 'training' ? 'Aktiv' :
                     currentSession.status === 'completed' ? 'Abgeschlossen' :
                     currentSession.status === 'paused' ? 'Pausiert' : 'Bereit'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="realtime">Echtzeit-Metriken</TabsTrigger>
              <TabsTrigger value="network">Netzwerk-Struktur</TabsTrigger>
              <TabsTrigger value="analysis">Leistungsanalyse</TabsTrigger>
            </TabsList>

            <TabsContent value="realtime" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightning size={20} />
                      Live Metriken
                    </CardTitle>
                    <CardDescription>
                      Aktuelle Trainingswerte
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {latestMetric && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Belohnung</div>
                            <div className="text-lg font-semibold text-green-600">
                              {(latestMetric?.reward || 0).toFixed(1)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Verlust</div>
                            <div className="text-lg font-semibold text-red-600">
                              {(latestMetric?.loss || 0).toFixed(4)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Epsilon</div>
                            <div className="text-lg font-semibold text-blue-600">
                              {(latestMetric?.epsilon || 0).toFixed(3)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Q-Wert</div>
                            <div className="text-lg font-semibold text-purple-600">
                              {(latestMetric?.qValue || 0).toFixed(1)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Genauigkeit</div>
                          <Progress value={latestMetric.accuracy} className="h-3" />
                          <div className="text-sm font-medium">{(latestMetric?.accuracy || 0).toFixed(1)}%</div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Episodes Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 size={20} />
                      Episoden-Verlauf
                    </CardTitle>
                    <CardDescription>
                      Letzte 20 Trainings-Episoden
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recentMetrics.slice(-10).map((metric, index) => (
                        <div key={metric.episode} className="flex items-center justify-between text-sm">
                          <span className="font-mono">#{metric.episode}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-secondary rounded">
                              <div 
                                className="bg-primary h-2 rounded"
                                style={{ width: `${Math.min(100, (metric.reward / 1000) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="w-12 text-right font-semibold">
                              {(metric?.reward || 0).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="network" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network size={20} />
                    Netzwerk-Architektur
                  </CardTitle>
                  <CardDescription>
                    DQN Struktur und Hyperparameter
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Network Architecture Visualization */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Neuronale Netzwerk-Schichten</h4>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="w-12 h-16 bg-blue-100 border-2 border-blue-300 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">Input</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">State</div>
                      </div>
                      
                      {currentSession.config.networkArchitecture.map((neurons, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-0.5 bg-gray-400"></div>
                          <div className="text-center">
                            <div className="w-12 h-16 bg-purple-100 border-2 border-purple-300 rounded flex items-center justify-center">
                              <span className="text-xs font-bold">{neurons}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">FC{index + 1}</div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-0.5 bg-gray-400"></div>
                        <div className="text-center">
                          <div className="w-12 h-16 bg-green-100 border-2 border-green-300 rounded flex items-center justify-center">
                            <span className="text-xs font-bold">Q</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Actions</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hyperparameters */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Lernrate</div>
                      <div className="font-mono text-sm bg-secondary p-2 rounded">
                        {currentSession.config.learningRate}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Batch-Größe</div>
                      <div className="font-mono text-sm bg-secondary p-2 rounded">
                        {currentSession.config.batchSize}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Speicher-Größe</div>
                      <div className="font-mono text-sm bg-secondary p-2 rounded">
                        {currentSession.config.memorySize.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Gamma (γ)</div>
                      <div className="font-mono text-sm bg-secondary p-2 rounded">
                        {currentSession.config.gamma}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Target Update</div>
                      <div className="font-mono text-sm bg-secondary p-2 rounded">
                        {currentSession.config.targetUpdateFreq}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Epsilon Decay</div>
                      <div className="font-mono text-sm bg-secondary p-2 rounded">
                        {currentSession.config.epsilonDecay}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Training Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 size={20} />
                      Training-Statistiken
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Fortschritt</span>
                        <span className="text-sm font-medium">
                          {(((currentSession?.currentEpisode || 0) / (currentSession?.totalEpisodes || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={(currentSession.currentEpisode / currentSession.totalEpisodes) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-secondary/50 rounded">
                        <div className="text-lg font-bold text-green-600">
                          {(currentSession?.bestReward || 0).toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Beste Belohnung</div>
                      </div>
                      <div className="text-center p-3 bg-secondary/50 rounded">
                        <div className="text-lg font-bold text-blue-600">
                          {(currentSession?.convergenceScore || 0).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Konvergenz</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Indicators */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye size={20} />
                      Leistungs-Indikatoren
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Stabilität</span>
                          <span>{(currentSession?.stabilityIndex || 0).toFixed(1)}%</span>
                        </div>
                        <Progress value={currentSession.stabilityIndex} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Exploration (Epsilon)</span>
                          <span>{((currentSession?.config?.epsilon || 0) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={currentSession.config.epsilon * 100} className="h-2" />
                      </div>

                      {latestMetric && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Aktuelle Genauigkeit</span>
                            <span>{(latestMetric?.accuracy || 0).toFixed(1)}%</span>
                          </div>
                          <Progress value={latestMetric.accuracy} className="h-2" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}