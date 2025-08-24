import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { 
  Brain, 
  Cpu, 
  Gauge, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  TrendingUp,
  Network,
  Timer,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Layers,
  Zap,
  Target,
  Activity
} from '@phosphor-icons/react'

interface ModelArchitecture {
  id: string
  name: string
  layers: number
  parameters: number
  accuracy: number
  latency: number
  memoryUsage: number
  efficiency: number
  generation: number
  parentId?: string
  hyperparameters: {
    learningRate: number
    batchSize: number
    dropoutRate: number
    activationFunction: string
  }
}

interface NASExperiment {
  id: string
  name: string
  status: 'running' | 'completed' | 'paused' | 'failed'
  startTime: string
  endTime?: string
  currentGeneration: number
  maxGenerations: number
  bestAccuracy: number
  populationSize: number
  searchSpace: string[]
  objectives: ('accuracy' | 'latency' | 'memory' | 'efficiency')[]
}

interface SearchMetrics {
  generationsCompleted: number
  modelsEvaluated: number
  bestAccuracy: number
  averageLatency: number
  paretoFrontier: ModelArchitecture[]
  convergenceRate: number
  diversityIndex: number
}

export default function NeuralArchitectureSearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<string>('multi-objective-search')
  const [searchProgress, setSearchProgress] = useState(0)
  const [currentGeneration, setCurrentGeneration] = useState(0)
  
  // KV Storage für persistente Daten
  const [experiments, setExperiments] = useKV<NASExperiment[]>('nas-experiments', [])
  const [architectures, setArchitectures] = useKV<ModelArchitecture[]>('nas-architectures', [])
  const [searchMetrics, setSearchMetrics] = useKV<SearchMetrics>('nas-metrics', {
    generationsCompleted: 0,
    modelsEvaluated: 0,
    bestAccuracy: 0,
    averageLatency: 0,
    paretoFrontier: [],
    convergenceRate: 0,
    diversityIndex: 0
  })
  
  // Search Configuration
  const [searchConfig, setSearchConfig] = useKV('nas-search-config', {
    populationSize: 50,
    maxGenerations: 100,
    mutationRate: 0.1,
    crossoverRate: 0.8,
    objectives: ['accuracy', 'latency'],
    searchSpace: ['cnn', 'transformer', 'resnet', 'efficientnet'],
    targetDataset: 'rail-surveillance'
  })

  // Initialisierung der Standard-Experimente
  useEffect(() => {
    if (experiments.length === 0) {
      const defaultExperiments: NASExperiment[] = [
        {
          id: 'multi-objective-search',
          name: 'Multi-Objektiv Optimierung',
          status: 'paused',
          startTime: new Date().toISOString(),
          currentGeneration: 0,
          maxGenerations: 100,
          bestAccuracy: 0,
          populationSize: 50,
          searchSpace: ['CNN', 'Transformer', 'ResNet', 'EfficientNet'],
          objectives: ['accuracy', 'latency', 'memory']
        },
        {
          id: 'latency-optimized',
          name: 'Latenz-Optimierte Suche',
          status: 'paused',
          startTime: new Date().toISOString(),
          currentGeneration: 0,
          maxGenerations: 80,
          bestAccuracy: 0,
          populationSize: 30,
          searchSpace: ['MobileNet', 'EfficientNet', 'SqueezeNet'],
          objectives: ['latency', 'accuracy']
        },
        {
          id: 'accuracy-focused',
          name: 'Genauigkeits-Fokussierte Suche',
          status: 'paused',
          startTime: new Date().toISOString(),
          currentGeneration: 0,
          maxGenerations: 120,
          bestAccuracy: 0,
          populationSize: 80,
          searchSpace: ['ResNet', 'DenseNet', 'Vision Transformer'],
          objectives: ['accuracy', 'efficiency']
        }
      ]
      setExperiments(defaultExperiments)
    }
  }, [experiments, setExperiments])

  // Simulation der NAS Suche
  const startNASSearch = async () => {
    if (isSearching) return
    
    setIsSearching(true)
    setSearchProgress(0)
    setCurrentGeneration(0)
    
    const experiment = experiments.find(exp => exp.id === selectedExperiment)
    if (!experiment) return

    // Update experiment status
    setExperiments(prev => prev.map(exp => 
      exp.id === selectedExperiment 
        ? { ...exp, status: 'running', startTime: new Date().toISOString() }
        : exp
    ))

    try {
      // Simuliere NAS Generationen
      for (let generation = 1; generation <= experiment.maxGenerations; generation++) {
        if (!isSearching) break
        
        // Simuliere Modell-Evaluation
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Generiere neue Architekturen für diese Generation
        const newArchitectures = generateArchitectures(generation, experiment.populationSize)
        setArchitectures(prev => [...prev, ...newArchitectures])
        
        // Update Metriken
        const bestArch = newArchitectures.reduce((best, current) => 
          current.accuracy > best.accuracy ? current : best
        )
        
        setSearchMetrics(prev => ({
          ...prev,
          generationsCompleted: generation,
          modelsEvaluated: prev.modelsEvaluated + newArchitectures.length,
          bestAccuracy: Math.max(prev.bestAccuracy, bestArch.accuracy),
          averageLatency: newArchitectures.reduce((sum, arch) => sum + arch.latency, 0) / newArchitectures.length,
          convergenceRate: calculateConvergenceRate(generation),
          diversityIndex: calculateDiversityIndex(newArchitectures)
        }))
        
        setCurrentGeneration(generation)
        setSearchProgress((generation / experiment.maxGenerations) * 100)
        
        // Update experiment
        setExperiments(prev => prev.map(exp => 
          exp.id === selectedExperiment 
            ? { 
                ...exp, 
                currentGeneration: generation,
                bestAccuracy: Math.max(exp.bestAccuracy, bestArch.accuracy)
              }
            : exp
        ))

        if (generation % 10 === 0) {
          toast.success(`Generation ${generation} abgeschlossen`, {
            description: `Beste Genauigkeit: ${bestArch.accuracy.toFixed(2)}%`
          })
        }
      }

      // Experiment abgeschlossen
      setExperiments(prev => prev.map(exp => 
        exp.id === selectedExperiment 
          ? { ...exp, status: 'completed', endTime: new Date().toISOString() }
          : exp
      ))
      
      toast.success('NAS-Suche erfolgreich abgeschlossen!', {
        description: `Beste Architektur mit ${searchMetrics.bestAccuracy.toFixed(2)}% Genauigkeit gefunden`
      })
      
    } catch (error) {
      setExperiments(prev => prev.map(exp => 
        exp.id === selectedExperiment 
          ? { ...exp, status: 'failed' }
          : exp
      ))
      toast.error('NAS-Suche fehlgeschlagen')
    } finally {
      setIsSearching(false)
    }
  }

  const stopNASSearch = () => {
    setIsSearching(false)
    setExperiments(prev => prev.map(exp => 
      exp.id === selectedExperiment 
        ? { ...exp, status: 'paused' }
        : exp
    ))
    toast.info('NAS-Suche angehalten')
  }

  const generateArchitectures = (generation: number, count: number): ModelArchitecture[] => {
    const architectures: ModelArchitecture[] = []
    
    for (let i = 0; i < count; i++) {
      const layers = Math.floor(Math.random() * 20) + 5
      const parameters = Math.floor(Math.random() * 50000000) + 1000000
      const accuracy = Math.min(95, 60 + Math.random() * 30 + generation * 0.5)
      const latency = Math.max(1, 50 - Math.random() * 40 - generation * 0.3)
      const memoryUsage = parameters * 4 / (1024 * 1024) // MB
      
      architectures.push({
        id: `arch-${generation}-${i}`,
        name: `NAS-Gen${generation}-${i}`,
        layers,
        parameters,
        accuracy,
        latency,
        memoryUsage,
        efficiency: accuracy / (latency * memoryUsage * 0.001),
        generation,
        hyperparameters: {
          learningRate: 0.001 + Math.random() * 0.009,
          batchSize: Math.pow(2, Math.floor(Math.random() * 6) + 3), // 8-256
          dropoutRate: Math.random() * 0.5,
          activationFunction: ['ReLU', 'GELU', 'Swish', 'Mish'][Math.floor(Math.random() * 4)]
        }
      })
    }
    
    return architectures
  }

  const calculateConvergenceRate = (generation: number): number => {
    return Math.max(0, 100 - generation * 2)
  }

  const calculateDiversityIndex = (architectures: ModelArchitecture[]): number => {
    if (architectures.length <= 1) return 0
    
    const avgLayers = architectures.reduce((sum, arch) => sum + arch.layers, 0) / architectures.length
    const variance = architectures.reduce((sum, arch) => sum + Math.pow(arch.layers - avgLayers, 2), 0) / architectures.length
    return Math.min(100, variance * 2)
  }

  const resetExperiment = () => {
    setArchitectures([])
    setSearchMetrics({
      generationsCompleted: 0,
      modelsEvaluated: 0,
      bestAccuracy: 0,
      averageLatency: 0,
      paretoFrontier: [],
      convergenceRate: 0,
      diversityIndex: 0
    })
    setCurrentGeneration(0)
    setSearchProgress(0)
    
    setExperiments(prev => prev.map(exp => 
      exp.id === selectedExperiment 
        ? { ...exp, status: 'paused', currentGeneration: 0, bestAccuracy: 0 }
        : exp
    ))
    
    toast.success('Experiment zurückgesetzt')
  }

  const currentExperiment = experiments.find(exp => exp.id === selectedExperiment)
  const topArchitectures = architectures
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Brain size={20} className="text-primary" />
            </div>
            Neural Architecture Search
          </h2>
          <p className="text-sm text-muted-foreground">
            Automatische Optimierung neuronaler Netzwerk-Architekturen für Bahnbetriebs-KI
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={resetExperiment}
            disabled={isSearching}
          >
            <RefreshCw size={16} className="mr-2" />
            Reset
          </Button>
          
          {isSearching ? (
            <Button onClick={stopNASSearch} variant="destructive" size="sm">
              <Pause size={16} className="mr-2" />
              Stoppen
            </Button>
          ) : (
            <Button onClick={startNASSearch} size="sm">
              <Play size={16} className="mr-2" />
              Suche starten
            </Button>
          )}
        </div>
      </div>

      {/* Search Progress */}
      {isSearching && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Generation {currentGeneration} von {currentExperiment?.maxGenerations}</span>
                <span className="text-sm font-mono">{searchProgress.toFixed(1)}%</span>
              </div>
              <Progress value={searchProgress} className="w-full" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Suche</TabsTrigger>
          <TabsTrigger value="architectures">Architekturen</TabsTrigger>
          <TabsTrigger value="metrics">Metriken</TabsTrigger>
          <TabsTrigger value="config">Konfiguration</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experiment Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={18} />
                  Aktives Experiment
                </CardTitle>
                <CardDescription>
                  Wählen Sie ein NAS-Experiment aus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedExperiment} onValueChange={setSelectedExperiment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experiments.map(experiment => (
                      <SelectItem key={experiment.id} value={experiment.id}>
                        {experiment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {currentExperiment && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={
                        currentExperiment.status === 'running' ? 'default' :
                        currentExperiment.status === 'completed' ? 'secondary' :
                        currentExperiment.status === 'failed' ? 'destructive' : 'outline'
                      }>
                        {currentExperiment.status === 'running' ? 'Läuft' :
                         currentExperiment.status === 'completed' ? 'Abgeschlossen' :
                         currentExperiment.status === 'failed' ? 'Fehlgeschlagen' : 'Angehalten'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Populationsgröße:</span>
                        <div className="font-medium">{currentExperiment.populationSize}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max. Generationen:</span>
                        <div className="font-medium">{currentExperiment.maxGenerations}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Aktuelle Generation:</span>
                        <div className="font-medium">{currentExperiment.currentGeneration}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Beste Genauigkeit:</span>
                        <div className="font-medium">{currentExperiment.bestAccuracy.toFixed(2)}%</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Suchraum:</span>
                      <div className="flex flex-wrap gap-1">
                        {currentExperiment.searchSpace.map(space => (
                          <Badge key={space} variant="outline" className="text-xs">
                            {space}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search Metrics Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={18} />
                  Such-Metriken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {searchMetrics.generationsCompleted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Generationen abgeschlossen
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {searchMetrics.modelsEvaluated}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Modelle evaluiert
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      {searchMetrics.bestAccuracy.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Beste Genauigkeit
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {searchMetrics.averageLatency.toFixed(1)}ms
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Durchschn. Latenz
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Konvergenz-Rate</span>
                      <span>{searchMetrics.convergenceRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={searchMetrics.convergenceRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Diversitäts-Index</span>
                      <span>{searchMetrics.diversityIndex.toFixed(1)}%</span>
                    </div>
                    <Progress value={searchMetrics.diversityIndex} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="architectures" className="space-y-6">
          {/* Top Architectures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={18} />
                Top Architekturen
              </CardTitle>
              <CardDescription>
                Die besten gefundenen Netzwerk-Architekturen
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topArchitectures.length > 0 ? (
                <div className="space-y-4">
                  {topArchitectures.map((arch, index) => (
                    <div key={arch.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{arch.name}</span>
                          <Badge variant="secondary">Gen {arch.generation}</Badge>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {arch.accuracy.toFixed(2)}%
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Schichten:</span>
                          <div className="font-medium">{arch.layers}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Parameter:</span>
                          <div className="font-medium">{(arch.parameters / 1000000).toFixed(1)}M</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Latenz:</span>
                          <div className="font-medium">{arch.latency.toFixed(1)}ms</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Speicher:</span>
                          <div className="font-medium">{arch.memoryUsage.toFixed(1)}MB</div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="text-sm text-muted-foreground mb-2">Hyperparameter:</div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                          <span>LR: {arch.hyperparameters.learningRate.toFixed(4)}</span>
                          <span>Batch: {arch.hyperparameters.batchSize}</span>
                          <span>Dropout: {arch.hyperparameters.dropoutRate.toFixed(2)}</span>
                          <span>Aktivierung: {arch.hyperparameters.activationFunction}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Noch keine Architekturen gefunden.</p>
                  <p className="text-sm">Starten Sie eine NAS-Suche, um Architekturen zu generieren.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge size={18} />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Genauigkeits-Trend</span>
                    <Badge variant="secondary">+{(Math.random() * 5).toFixed(1)}%</Badge>
                  </div>
                  <Progress value={75 + Math.random() * 20} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Latenz-Optimierung</span>
                    <Badge variant="secondary">-{(Math.random() * 20).toFixed(1)}ms</Badge>
                  </div>
                  <Progress value={60 + Math.random() * 30} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Speicher-Effizienz</span>
                    <Badge variant="secondary">-{(Math.random() * 15).toFixed(1)}MB</Badge>
                  </div>
                  <Progress value={80 + Math.random() * 15} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={18} />
                  Such-Statistiken
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <div className="text-xl font-bold">{(Math.random() * 50 + 50).toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Verbesserungsrate</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <div className="text-xl font-bold">{(Math.random() * 10 + 5).toFixed(1)}h</div>
                    <div className="text-xs text-muted-foreground">Geschätzte Restzeit</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <div className="text-xl font-bold">{Math.floor(Math.random() * 1000 + 500)}</div>
                    <div className="text-xs text-muted-foreground">Evaluationen/h</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <div className="text-xl font-bold">{(Math.random() * 30 + 70).toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Ressourcen-Nutzung</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={18} />
                Such-Konfiguration
              </CardTitle>
              <CardDescription>
                Anpassung der NAS-Parameter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Populationsgröße</label>
                    <Slider
                      value={[searchConfig.populationSize]}
                      onValueChange={([value]) => setSearchConfig(prev => ({ ...prev, populationSize: value }))}
                      max={200}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">{searchConfig.populationSize} Modelle pro Generation</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maximale Generationen</label>
                    <Slider
                      value={[searchConfig.maxGenerations]}
                      onValueChange={([value]) => setSearchConfig(prev => ({ ...prev, maxGenerations: value }))}
                      max={500}
                      min={20}
                      step={20}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">{searchConfig.maxGenerations} Generationen</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mutationsrate</label>
                    <Slider
                      value={[searchConfig.mutationRate * 100]}
                      onValueChange={([value]) => setSearchConfig(prev => ({ ...prev, mutationRate: value / 100 }))}
                      max={50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">{(searchConfig.mutationRate * 100).toFixed(0)}% Mutationswahrscheinlichkeit</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Crossover-Rate</label>
                    <Slider
                      value={[searchConfig.crossoverRate * 100]}
                      onValueChange={([value]) => setSearchConfig(prev => ({ ...prev, crossoverRate: value / 100 }))}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">{(searchConfig.crossoverRate * 100).toFixed(0)}% Crossover-Wahrscheinlichkeit</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Optimierungsziele</label>
                  <div className="space-y-2">
                    {[
                      { key: 'accuracy', label: 'Genauigkeit' },
                      { key: 'latency', label: 'Latenz' },
                      { key: 'memory', label: 'Speicherverbrauch' },
                      { key: 'efficiency', label: 'Energieeffizienz' }
                    ].map(objective => (
                      <label key={objective.key} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={searchConfig.objectives.includes(objective.key as any)}
                          onChange={(e) => {
                            setSearchConfig(prev => ({
                              ...prev,
                              objectives: e.target.checked
                                ? [...prev.objectives, objective.key as any]
                                : prev.objectives.filter(obj => obj !== objective.key)
                            }))
                          }}
                          className="rounded"
                        />
                        <span>{objective.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Architektur-Suchraum</label>
                  <div className="space-y-2">
                    {[
                      'CNN', 'Transformer', 'ResNet', 'EfficientNet', 
                      'MobileNet', 'DenseNet', 'Vision Transformer'
                    ].map(arch => (
                      <label key={arch} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={searchConfig.searchSpace.includes(arch)}
                          onChange={(e) => {
                            setSearchConfig(prev => ({
                              ...prev,
                              searchSpace: e.target.checked
                                ? [...prev.searchSpace, arch]
                                : prev.searchSpace.filter(space => space !== arch)
                            }))
                          }}
                          className="rounded"
                        />
                        <span>{arch}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}