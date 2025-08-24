import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Brain, 
  Network, 
  Sparkle, 
  TrendUp, 
  Settings, 
  CheckCircle, 
  Clock,
  Map,
  Target,
  ArrowUp,
  ArrowDown,
  Activity,
  Database,
  Cpu,
  Lightning,
  ChartLine,
  Layers,
  Shuffle
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TrackConfiguration {
  id: string
  name: string
  type: 'hochgeschwindigkeit' | 'regional' | 'urban' | 'gueter'
  length: number
  stations: number
  complexity: number
  adaptationProgress: number
  lastAdaptation: string
  performance: {
    accuracy: number
    adaptationTime: number
    transferSuccess: number
  }
}

interface MetaLearningModel {
  id: string
  name: string
  algorithm: string
  status: 'training' | 'ready' | 'adapting' | 'optimizing'
  adaptationSpeed: number
  transferEfficiency: number
  memoryUtilization: number
  lastUpdate: string
}

export default function MetaLearningSystem() {
  const [configurations, setConfigurations] = useKV<TrackConfiguration[]>('meta-learning-configs', [
    {
      id: 'config-1',
      name: 'ICE-Strecke Hamburg-München',
      type: 'hochgeschwindigkeit',
      length: 623,
      stations: 8,
      complexity: 0.85,
      adaptationProgress: 92,
      lastAdaptation: new Date().toISOString(),
      performance: { accuracy: 94.7, adaptationTime: 12.3, transferSuccess: 89.2 }
    },
    {
      id: 'config-2', 
      name: 'S-Bahn Berlin Ring',
      type: 'urban',
      length: 37.5,
      stations: 27,
      complexity: 0.72,
      adaptationProgress: 78,
      lastAdaptation: new Date(Date.now() - 3600000).toISOString(),
      performance: { accuracy: 91.3, adaptationTime: 8.7, transferSuccess: 85.6 }
    },
    {
      id: 'config-3',
      name: 'Rheintalbahn Karlsruhe-Basel',
      type: 'regional',
      length: 181,
      stations: 15,
      complexity: 0.68,
      adaptationProgress: 34,
      lastAdaptation: new Date(Date.now() - 7200000).toISOString(),
      performance: { accuracy: 87.1, adaptationTime: 15.2, transferSuccess: 76.4 }
    }
  ])

  const [models, setModels] = useKV<MetaLearningModel[]>('meta-learning-models', [
    {
      id: 'maml-1',
      name: 'MAML Basis-Modell',
      algorithm: 'Model-Agnostic Meta-Learning',
      status: 'ready',
      adaptationSpeed: 94.2,
      transferEfficiency: 87.8,
      memoryUtilization: 68.5,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'reptile-1',
      name: 'Reptile Optimizer',
      algorithm: 'Reptile Meta-Learning',
      status: 'adapting',
      adaptationSpeed: 89.7,
      transferEfficiency: 92.1,
      memoryUtilization: 72.3,
      lastUpdate: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'prototypical-1',
      name: 'Prototypical Networks',
      algorithm: 'Prototypical Meta-Learning',
      status: 'training',
      adaptationSpeed: 91.5,
      transferEfficiency: 85.9,
      memoryUtilization: 64.1,
      lastUpdate: new Date(Date.now() - 3600000).toISOString()
    }
  ])

  const [adaptationMetrics] = useKV('meta-learning-metrics', {
    totalConfigurations: 127,
    successfulAdaptations: 118,
    averageAdaptationTime: 11.4,
    transferLearningEfficiency: 88.7,
    crossDomainPerformance: 92.3,
    memoryRetention: 94.8
  })

  const [selectedConfig, setSelectedConfig] = useState<string>('')
  const [newConfigName, setNewConfigName] = useState('')
  const [isAdapting, setIsAdapting] = useState(false)

  const startAdaptation = async (configId: string) => {
    if (!configId) {
      toast.error('Bitte wählen Sie eine Konfiguration aus')
      return
    }

    setIsAdapting(true)
    toast.info('Meta-Learning Anpassung gestartet')

    try {
      // Simulate meta-learning adaptation process
      const config = configurations.find(c => c.id === configId)
      if (!config) return

      // Update configuration with adaptation progress
      setConfigurations(current => 
        current.map(c => 
          c.id === configId 
            ? {
                ...c,
                adaptationProgress: Math.min(c.adaptationProgress + 15, 100),
                lastAdaptation: new Date().toISOString(),
                performance: {
                  accuracy: Math.min(c.performance.accuracy + 2.1, 98),
                  adaptationTime: Math.max(c.performance.adaptationTime - 1.2, 5),
                  transferSuccess: Math.min(c.performance.transferSuccess + 3.5, 95)
                }
              }
            : c
        )
      )

      // Update model status
      setModels(current =>
        current.map(m => ({
          ...m,
          status: 'adapting' as const,
          lastUpdate: new Date().toISOString()
        }))
      )

      // Simulate adaptation completion
      setTimeout(() => {
        setModels(current =>
          current.map(m => ({
            ...m,
            status: 'ready' as const,
            adaptationSpeed: Math.min(m.adaptationSpeed + 1.5, 100),
            transferEfficiency: Math.min(m.transferEfficiency + 1.2, 100)
          }))
        )
        setIsAdapting(false)
        toast.success(`Anpassung für ${config.name} erfolgreich abgeschlossen`)
      }, 3000)

    } catch (error) {
      setIsAdapting(false)
      toast.error('Fehler bei der Meta-Learning Anpassung')
    }
  }

  const createNewConfiguration = async () => {
    if (!newConfigName.trim()) {
      toast.error('Bitte geben Sie einen Konfigurationsnamen ein')
      return
    }

    const newConfig: TrackConfiguration = {
      id: `config-${Date.now()}`,
      name: newConfigName.trim(),
      type: 'regional',
      length: Math.floor(Math.random() * 200) + 50,
      stations: Math.floor(Math.random() * 20) + 5,
      complexity: Math.random() * 0.5 + 0.4,
      adaptationProgress: 0,
      lastAdaptation: new Date().toISOString(),
      performance: {
        accuracy: 75 + Math.random() * 10,
        adaptationTime: 20 + Math.random() * 10,
        transferSuccess: 70 + Math.random() * 15
      }
    }

    setConfigurations(current => [...current, newConfig])
    setNewConfigName('')
    toast.success(`Neue Konfiguration "${newConfig.name}" erstellt`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600'
      case 'adapting': return 'text-blue-600'
      case 'training': return 'text-orange-600'
      case 'optimizing': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle size={16} />
      case 'adapting': return <Activity size={16} />
      case 'training': return <TrendUp size={16} />
      case 'optimizing': return <Settings size={16} />
      default: return <Clock size={16} />
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meta-Learning System</h1>
            <p className="text-muted-foreground">Schnelle Anpassung an neue Bahnstrecken-Konfigurationen</p>
          </div>
        </div>
      </div>

      {/* System Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Konfigurationen</p>
                <p className="text-2xl font-bold text-blue-700">{adaptationMetrics.totalConfigurations}</p>
              </div>
              <Database size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Erfolgsrate</p>
                <p className="text-2xl font-bold text-green-700">
                  {((adaptationMetrics.successfulAdaptations / adaptationMetrics.totalConfigurations) * 100).toFixed(1)}%
                </p>
              </div>
              <Target size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ø Anpassungszeit</p>
                <p className="text-2xl font-bold text-purple-700">{adaptationMetrics.averageAdaptationTime}min</p>
              </div>
              <Lightning size={24} className="text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transfer-Effizienz</p>
                <p className="text-2xl font-bold text-orange-700">{adaptationMetrics.transferLearningEfficiency}%</p>
              </div>
              <Shuffle size={24} className="text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Meta-Learning Models */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkle size={20} className="text-primary" />
              <CardTitle>Meta-Learning Modelle</CardTitle>
            </div>
            <CardDescription>
              Aktive Meta-Learning Algorithmen für Strecken-Anpassung
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {models.map(model => (
              <div key={model.id} className="p-4 border border-border/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 ${getStatusColor(model.status)}`}>
                      {getStatusIcon(model.status)}
                      <span className="text-sm font-medium capitalize">{model.status}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {model.algorithm}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-foreground">{model.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Letzte Aktualisierung: {new Date(model.lastUpdate).toLocaleTimeString()}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Anpassungsgeschwindigkeit</p>
                    <div className="flex items-center gap-2">
                      <Progress value={model.adaptationSpeed} className="flex-1 h-1.5" />
                      <span className="font-medium text-foreground">{model.adaptationSpeed.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Transfer-Effizienz</p>
                    <div className="flex items-center gap-2">
                      <Progress value={model.transferEfficiency} className="flex-1 h-1.5" />
                      <span className="font-medium text-foreground">{model.transferEfficiency.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Speicher-Nutzung</p>
                    <div className="flex items-center gap-2">
                      <Progress value={model.memoryUtilization} className="flex-1 h-1.5" />
                      <span className="font-medium text-foreground">{model.memoryUtilization.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Track Configurations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Map size={20} className="text-primary" />
              <CardTitle>Strecken-Konfigurationen</CardTitle>
            </div>
            <CardDescription>
              Überwachte Bahnstrecken mit Meta-Learning Status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {configurations.map(config => (
              <div key={config.id} className="p-4 border border-border/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{config.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{config.length}km</span>
                      <span>•</span>
                      <span>{config.stations} Stationen</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {config.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{config.adaptationProgress}%</span>
                      {config.adaptationProgress > 80 ? (
                        <ArrowUp size={14} className="text-green-600" />
                      ) : (
                        <ArrowDown size={14} className="text-orange-600" />
                      )}
                    </div>
                    <Progress value={config.adaptationProgress} className="w-16 h-1.5" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-secondary/30 rounded">
                    <p className="text-muted-foreground">Genauigkeit</p>
                    <p className="font-medium">{config.performance.accuracy.toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-2 bg-secondary/30 rounded">
                    <p className="text-muted-foreground">Zeit</p>
                    <p className="font-medium">{config.performance.adaptationTime.toFixed(1)}min</p>
                  </div>
                  <div className="text-center p-2 bg-secondary/30 rounded">
                    <p className="text-muted-foreground">Transfer</p>
                    <p className="font-medium">{config.performance.transferSuccess.toFixed(1)}%</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => startAdaptation(config.id)}
                  disabled={isAdapting || config.adaptationProgress >= 95}
                >
                  {config.adaptationProgress >= 95 ? 'Optimiert' : 'Anpassung starten'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Adaptation Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightning size={20} className="text-primary" />
            <CardTitle>Schnell-Anpassung</CardTitle>
          </div>
          <CardDescription>
            Neue Bahnstrecken-Konfiguration für Meta-Learning erstellen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="config-name">Neue Konfiguration</Label>
              <Input
                id="config-name"
                placeholder="z.B. S-Bahn Frankfurt Hauptlinie"
                value={newConfigName}
                onChange={(e) => setNewConfigName(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={createNewConfiguration}
                disabled={!newConfigName.trim()}
                className="w-full md:w-auto"
              >
                Konfiguration erstellen
              </Button>
            </div>
          </div>

          {isAdapting && (
            <Alert>
              <Activity className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Meta-Learning Anpassung läuft... Die Algorithmen analysieren die neue Strecken-Konfiguration 
                und optimieren die Parameter für maximale Transferleistung.
              </AlertDescription>
            </Alert>
          )}

          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
            <div className="flex items-center gap-3 mb-3">
              <ChartLine size={20} className="text-blue-600" />
              <h4 className="font-medium text-blue-900">Meta-Learning Vorteile</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-800">Schnelle Anpassung</p>
                <p className="text-blue-700">Neue Strecken in unter 15 Minuten optimiert</p>
              </div>
              <div>
                <p className="font-medium text-blue-800">Transfer Learning</p>
                <p className="text-blue-700">Wissen von ähnlichen Strecken wird übertragen</p>
              </div>
              <div>
                <p className="font-medium text-blue-800">Kontinuierliche Verbesserung</p>
                <p className="text-blue-700">Algorithmen werden mit jeder Anpassung besser</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}