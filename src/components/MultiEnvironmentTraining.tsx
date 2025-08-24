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
  Play,
  Pause,
  Stop,
  RefreshCw,
  MapPin,
  Activity,
  ChartLine,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Cpu,
  Network,
  Target,
  Zap,
  BarChart3,
  GitBranch,
  Globe,
  Route,
  Train,
  Mountain,
  Building,
  TreePine
} from '@phosphor-icons/react'

interface TrainingEnvironment {
  id: string
  name: string
  type: 'urban' | 'suburban' | 'rural' | 'mountain' | 'coastal'
  description: string
  complexity: number
  status: 'idle' | 'training' | 'paused' | 'completed' | 'error'
  progress: number
  accuracy: number
  episodes: number
  totalEpisodes: number
  learningRate: number
  lastUpdate: string
  config: {
    trackLength: number
    stations: number
    curves: number
    bridges: number
    tunnels: number
    weatherVariability: number
    passengerDensity: number
    trafficComplexity: number
  }
  metrics: {
    averageDelay: number
    delayReduction: number
    safetyScore: number
    efficiency: number
    energyConsumption: number
  }
}

interface ParallelTrainingSession {
  id: string
  name: string
  status: 'running' | 'paused' | 'completed' | 'failed'
  startTime: string
  environments: string[]
  totalProgress: number
  convergenceRate: number
  crossValidationScore: number
}

export default function MultiEnvironmentTraining() {
  const [environments, setEnvironments] = useKV<TrainingEnvironment[]>('multi-env-training-environments', [
    {
      id: 'env-urban-1',
      name: 'Berlin Stadtbahn',
      type: 'urban',
      description: 'Hochfrequente städtische Strecke mit komplexen Knotenpunkten',
      complexity: 9,
      status: 'training',
      progress: 67,
      accuracy: 89.4,
      episodes: 3350,
      totalEpisodes: 5000,
      learningRate: 0.001,
      lastUpdate: new Date().toISOString(),
      config: {
        trackLength: 45,
        stations: 24,
        curves: 156,
        bridges: 8,
        tunnels: 12,
        weatherVariability: 6,
        passengerDensity: 95,
        trafficComplexity: 9
      },
      metrics: {
        averageDelay: 2.3,
        delayReduction: 78.5,
        safetyScore: 97.8,
        efficiency: 92.1,
        energyConsumption: 145.2
      }
    },
    {
      id: 'env-mountain-1',
      name: 'Alpen-Express Route',
      type: 'mountain',
      description: 'Gebirgsstrecke mit extremen Steigungen und Wetterherausforderungen',
      complexity: 8,
      status: 'training',
      progress: 45,
      accuracy: 76.2,
      episodes: 2250,
      totalEpisodes: 5000,
      learningRate: 0.0015,
      lastUpdate: new Date().toISOString(),
      config: {
        trackLength: 78,
        stations: 12,
        curves: 234,
        bridges: 45,
        tunnels: 23,
        weatherVariability: 9,
        passengerDensity: 35,
        trafficComplexity: 7
      },
      metrics: {
        averageDelay: 4.7,
        delayReduction: 45.2,
        safetyScore: 94.1,
        efficiency: 78.4,
        energyConsumption: 220.8
      }
    },
    {
      id: 'env-coastal-1',
      name: 'Nordsee-Küstenlinie',
      type: 'coastal',
      description: 'Küstenstrecke mit Salzluft-Korrosion und Sturmeinflüssen',
      complexity: 7,
      status: 'paused',
      progress: 32,
      accuracy: 71.8,
      episodes: 1600,
      totalEpisodes: 5000,
      learningRate: 0.0012,
      lastUpdate: new Date().toISOString(),
      config: {
        trackLength: 92,
        stations: 18,
        curves: 89,
        bridges: 12,
        tunnels: 3,
        weatherVariability: 8,
        passengerDensity: 55,
        trafficComplexity: 6
      },
      metrics: {
        averageDelay: 3.1,
        delayReduction: 52.7,
        safetyScore: 95.6,
        efficiency: 84.2,
        energyConsumption: 178.5
      }
    },
    {
      id: 'env-rural-1',
      name: 'Ländliche Verbindung',
      type: 'rural',
      description: 'Ländliche Strecke mit geringer Frequenz und Wildtierquerungen',
      complexity: 5,
      status: 'completed',
      progress: 100,
      accuracy: 94.7,
      episodes: 5000,
      totalEpisodes: 5000,
      learningRate: 0.0008,
      lastUpdate: new Date().toISOString(),
      config: {
        trackLength: 156,
        stations: 8,
        curves: 67,
        bridges: 18,
        tunnels: 5,
        weatherVariability: 7,
        passengerDensity: 25,
        trafficComplexity: 3
      },
      metrics: {
        averageDelay: 1.2,
        delayReduction: 89.3,
        safetyScore: 98.4,
        efficiency: 96.8,
        energyConsumption: 98.7
      }
    }
  ])

  const [trainingSessions, setTrainingSessions] = useKV<ParallelTrainingSession[]>('parallel-training-sessions', [
    {
      id: 'session-1',
      name: 'Gesamtnetz-Optimierung',
      status: 'running',
      startTime: new Date(Date.now() - 3600000).toISOString(),
      environments: ['env-urban-1', 'env-mountain-1', 'env-coastal-1'],
      totalProgress: 48,
      convergenceRate: 0.85,
      crossValidationScore: 82.4
    }
  ])

  const [activeTab, setActiveTab] = useState('environments')
  const [isGlobalTraining, setIsGlobalTraining] = useState(true)
  const [systemLoad, setSystemLoad] = useState(74)

  useEffect(() => {
    const interval = setInterval(() => {
      setEnvironments(prev => prev.map(env => {
        if (env.status === 'training') {
          const newProgress = Math.min(env.progress + Math.random() * 2, 100)
          const newAccuracy = env.accuracy + (Math.random() - 0.5) * 0.5
          const newEpisodes = env.episodes + Math.floor(Math.random() * 10 + 5)
          
          return {
            ...env,
            progress: newProgress,
            accuracy: Math.max(60, Math.min(99, newAccuracy)),
            episodes: Math.min(newEpisodes, env.totalEpisodes),
            lastUpdate: new Date().toISOString(),
            status: newProgress >= 100 ? 'completed' : 'training'
          }
        }
        return env
      }))

      setSystemLoad(prev => Math.max(30, Math.min(95, prev + (Math.random() - 0.5) * 10)))
    }, 3000)

    return () => clearInterval(interval)
  }, [setEnvironments])

  const startTraining = (envId: string) => {
    setEnvironments(prev => prev.map(env => 
      env.id === envId ? { ...env, status: 'training' } : env
    ))
    toast.success('Training gestartet für ' + environments.find(e => e.id === envId)?.name)
  }

  const pauseTraining = (envId: string) => {
    setEnvironments(prev => prev.map(env => 
      env.id === envId ? { ...env, status: 'paused' } : env
    ))
    toast.info('Training pausiert für ' + environments.find(e => e.id === envId)?.name)
  }

  const stopTraining = (envId: string) => {
    setEnvironments(prev => prev.map(env => 
      env.id === envId ? { ...env, status: 'idle', progress: 0, episodes: 0 } : env
    ))
    toast.warning('Training gestoppt für ' + environments.find(e => e.id === envId)?.name)
  }

  const startGlobalTraining = () => {
    const idleEnvs = environments.filter(env => env.status === 'idle' || env.status === 'paused')
    if (idleEnvs.length === 0) {
      toast.error('Keine verfügbaren Umgebungen für globales Training')
      return
    }

    setEnvironments(prev => prev.map(env => 
      idleEnvs.some(idle => idle.id === env.id) ? { ...env, status: 'training' } : env
    ))

    const newSession: ParallelTrainingSession = {
      id: `session-${Date.now()}`,
      name: `Multi-Umgebungs-Training ${new Date().toLocaleTimeString()}`,
      status: 'running',
      startTime: new Date().toISOString(),
      environments: idleEnvs.map(env => env.id),
      totalProgress: 0,
      convergenceRate: 0,
      crossValidationScore: 0
    }

    setTrainingSessions(prev => [newSession, ...prev])
    setIsGlobalTraining(true)
    toast.success(`Globales Training gestartet für ${idleEnvs.length} Umgebungen`)
  }

  const getEnvironmentIcon = (type: string) => {
    switch (type) {
      case 'urban': return <Building size={20} />
      case 'mountain': return <Mountain size={20} />
      case 'coastal': return <Globe size={20} />
      case 'rural': return <TreePine size={20} />
      default: return <MapPin size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const runningEnvironments = environments.filter(env => env.status === 'training').length
  const completedEnvironments = environments.filter(env => env.status === 'completed').length
  const averageAccuracy = environments.reduce((sum, env) => sum + env.accuracy, 0) / environments.length

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <GitBranch size={24} className="text-primary" />
            </div>
            Multi-Environment-Training
          </h1>
          <p className="text-muted-foreground mt-2">
            Paralleles Training für verschiedene Bahnstrecken-Konfigurationen
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={startGlobalTraining} className="bg-primary hover:bg-primary/90">
            <Play size={16} className="mr-2" />
            Globales Training starten
          </Button>
        </div>
      </div>

      {/* Global Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Aktive Trainings</CardDescription>
              <Activity size={16} className="text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{runningEnvironments}</div>
            <p className="text-xs text-muted-foreground">von {environments.length} Umgebungen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Abgeschlossen</CardDescription>
              <CheckCircle size={16} className="text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedEnvironments}</div>
            <p className="text-xs text-muted-foreground">erfolgreich trainiert</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Durchschnittliche Genauigkeit</CardDescription>
              <Target size={16} className="text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{averageAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">über alle Umgebungen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>System-Last</CardDescription>
              <Cpu size={16} className="text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{systemLoad}%</div>
            <Progress value={systemLoad} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* System Load Alert */}
      {systemLoad > 90 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Hohe System-Last erkannt. Erwägen Sie eine Reduzierung der parallelen Trainings.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="environments">Trainings-Umgebungen</TabsTrigger>
          <TabsTrigger value="sessions">Parallele Sessions</TabsTrigger>
          <TabsTrigger value="analysis">Vergleichsanalyse</TabsTrigger>
        </TabsList>

        <TabsContent value="environments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {environments.map((env) => (
              <Card key={env.id} className="relative overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                        {getEnvironmentIcon(env.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{env.name}</CardTitle>
                        <CardDescription>{env.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(env.status)}`}></div>
                      <Badge variant="outline" className="capitalize">
                        {env.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fortschritt</span>
                      <span>{env.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={env.progress} className="h-2" />
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Genauigkeit</div>
                      <div className="text-lg font-semibold text-green-600">{env.accuracy.toFixed(1)}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Episoden</div>
                      <div className="text-lg font-semibold">{env.episodes.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Environment Configuration */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/50 p-3 rounded-lg">
                    <div>Stationen: {env.config.stations}</div>
                    <div>Komplexität: {env.complexity}/10</div>
                    <div>Kurven: {env.config.curves}</div>
                    <div>Tunnel: {env.config.tunnels}</div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2 pt-2">
                    {env.status === 'idle' || env.status === 'paused' ? (
                      <Button 
                        size="sm" 
                        onClick={() => startTraining(env.id)}
                        className="flex-1"
                      >
                        <Play size={14} className="mr-1" />
                        Starten
                      </Button>
                    ) : env.status === 'training' ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => pauseTraining(env.id)}
                        className="flex-1"
                      >
                        <Pause size={14} className="mr-1" />
                        Pausieren
                      </Button>
                    ) : null}
                    
                    {env.status !== 'idle' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => stopTraining(env.id)}
                      >
                        <Stop size={14} className="mr-1" />
                        Stoppen
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="space-y-4">
            {trainingSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Network size={20} />
                        {session.name}
                      </CardTitle>
                      <CardDescription>
                        Gestartet: {new Date(session.startTime).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={session.status === 'running' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Gesamtfortschritt</div>
                      <div className="text-xl font-semibold">{session.totalProgress}%</div>
                      <Progress value={session.totalProgress} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Konvergenzrate</div>
                      <div className="text-xl font-semibold text-blue-600">{session.convergenceRate.toFixed(2)}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Kreuzvalidierung</div>
                      <div className="text-xl font-semibold text-green-600">{session.crossValidationScore.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Beteiligte Umgebungen:</div>
                    <div className="flex flex-wrap gap-2">
                      {session.environments.map(envId => {
                        const env = environments.find(e => e.id === envId)
                        return env ? (
                          <Badge key={envId} variant="outline" className="flex items-center gap-1">
                            {getEnvironmentIcon(env.type)}
                            {env.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Leistungsvergleich
                </CardTitle>
                <CardDescription>
                  Vergleich der Trainingsmetriken zwischen Umgebungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {environments.map((env) => (
                    <div key={env.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{env.name}</span>
                        <span className="text-sm text-muted-foreground">{env.accuracy.toFixed(1)}%</span>
                      </div>
                      <Progress value={env.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Environment Complexity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine size={20} />
                  Komplexitätsanalyse
                </CardTitle>
                <CardDescription>
                  Zusammenhang zwischen Komplexität und Leistung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {environments.map((env) => (
                    <div key={env.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <div className="font-medium">{env.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Komplexität: {env.complexity}/10
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{env.metrics.delayReduction.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Verspätungsreduktion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cross-Environment Transfer Learning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route size={20} />
                Transfer Learning Matrix
              </CardTitle>
              <CardDescription>
                Wissenstransfer zwischen verschiedenen Umgebungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {environments.map((sourceEnv) => (
                  <div key={sourceEnv.id} className="space-y-2">
                    <div className="text-sm font-medium text-center">{sourceEnv.name}</div>
                    <div className="space-y-1">
                      {environments.map((targetEnv) => (
                        <div key={targetEnv.id} className="flex items-center justify-between text-xs">
                          <span>{targetEnv.name.split(' ')[0]}</span>
                          <span className="font-mono">
                            {sourceEnv.id === targetEnv.id ? '100%' : 
                             Math.abs(sourceEnv.complexity - targetEnv.complexity) <= 2 ? '85%' :
                             Math.abs(sourceEnv.complexity - targetEnv.complexity) <= 4 ? '65%' : '35%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}