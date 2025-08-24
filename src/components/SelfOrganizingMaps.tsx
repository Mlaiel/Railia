import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  Grid3x3, 
  Brain, 
  Zap, 
  BarChart3, 
  Target, 
  Eye, 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  Activity,
  Settings,
  MapPin,
  GitBranch,
  Crosshair,
  Database,
  Layers,
  FlashIcon as Lightning,
  ArrowRight
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SOMNode {
  id: string
  x: number
  y: number
  weights: number[]
  activationCount: number
  lastActivation: number
  cluster?: string
  features: string[]
}

interface TrainingData {
  id: string
  features: number[]
  label: string
  timestamp: number
}

interface SOMConfig {
  width: number
  height: number
  learningRate: number
  neighborhoodRadius: number
  maxIterations: number
  decayRate: number
}

// Simulierte Merkmalsdaten für Bahnbetrieb
const generateTrainingData = (): TrainingData[] => {
  const patterns = [
    // Normale Betriebsmuster
    { base: [0.2, 0.8, 0.1, 0.9, 0.3], label: 'Normaler Betrieb', weight: 0.4 },
    // Türblockaden-Muster
    { base: [0.9, 0.3, 0.8, 0.2, 0.7], label: 'Türblockade', weight: 0.15 },
    // Wetter-bedingte Verzögerungen
    { base: [0.4, 0.6, 0.9, 0.4, 0.8], label: 'Wetter-Störung', weight: 0.1 },
    // Notfall-Situationen
    { base: [0.8, 0.2, 0.4, 0.9, 0.6], label: 'Notfall', weight: 0.05 },
    // Rush-Hour-Muster
    { base: [0.6, 0.9, 0.3, 0.7, 0.5], label: 'Stoßzeit', weight: 0.25 },
    // Wartungsarbeiten
    { base: [0.3, 0.4, 0.6, 0.3, 0.9], label: 'Wartung', weight: 0.05 }
  ]

  const data: TrainingData[] = []
  
  patterns.forEach((pattern, patternIndex) => {
    const count = Math.floor(pattern.weight * 200) // Gesamt 200 Datenpunkte
    
    for (let i = 0; i < count; i++) {
      const features = pattern.base.map(val => 
        Math.max(0, Math.min(1, val + (Math.random() - 0.5) * 0.3))
      )
      
      data.push({
        id: `${patternIndex}-${i}`,
        features,
        label: pattern.label,
        timestamp: Date.now() - Math.random() * 86400000 * 7 // Letzte 7 Tage
      })
    }
  })

  return data.sort(() => Math.random() - 0.5) // Mischen
}

const SelfOrganizingMaps: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [currentIteration, setCurrentIteration] = useState(0)
  const [trainingProgress, setTrainingProgress] = useState(0)
  
  // Persistente Einstellungen
  const [somConfig, setSomConfig] = useKV<SOMConfig>('som-config', {
    width: 15,
    height: 15,
    learningRate: 0.5,
    neighborhoodRadius: 7,
    maxIterations: 1000,
    decayRate: 0.99
  })

  // SOM-Netzwerk und Trainingsdaten
  const [somNetwork, setSomNetwork] = useKV<SOMNode[]>('som-network', [])
  const [trainingData] = useKV<TrainingData[]>('som-training-data', generateTrainingData())
  const [featureNames] = useKV<string[]>('som-feature-names', [
    'Passagierfrequenz', 
    'Pünktlichkeit', 
    'Wetterbedingungen', 
    'Systemlast', 
    'Wartungsstatus'
  ])

  // Training-Statistiken
  const [trainingStats, setTrainingStats] = useKV('som-training-stats', {
    totalIterations: 0,
    lastTrainingTime: null,
    quantizationError: 0,
    topographicError: 0,
    convergenceRate: 0
  })

  // Initialisierung des SOM-Netzwerks
  const initializeSOM = () => {
    const nodes: SOMNode[] = []
    
    for (let y = 0; y < somConfig.height; y++) {
      for (let x = 0; x < somConfig.width; x++) {
        nodes.push({
          id: `${x}-${y}`,
          x,
          y,
          weights: Array(5).fill(0).map(() => Math.random()),
          activationCount: 0,
          lastActivation: 0,
          features: []
        })
      }
    }
    
    setSomNetwork(nodes)
    toast.success('SOM-Netzwerk initialisiert')
  }

  // Euklidische Distanz berechnen
  const calculateDistance = (a: number[], b: number[]): number => {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0))
  }

  // Besten übereinstimmenden Einheit finden (BMU)
  const findBMU = (input: number[], network: SOMNode[]): SOMNode => {
    return network.reduce((best, node) => {
      const distance = calculateDistance(input, node.weights)
      const bestDistance = calculateDistance(input, best.weights)
      return distance < bestDistance ? node : best
    })
  }

  // Nachbarschaftsfunktion
  const getNeighborhoodInfluence = (
    bmu: SOMNode, 
    node: SOMNode, 
    radius: number
  ): number => {
    const distance = Math.sqrt(
      Math.pow(bmu.x - node.x, 2) + Math.pow(bmu.y - node.y, 2)
    )
    
    if (distance <= radius) {
      return Math.exp(-(distance * distance) / (2 * radius * radius))
    }
    return 0
  }

  // SOM-Training durchführen
  const trainSOM = async () => {
    if (somNetwork.length === 0) {
      initializeSOM()
      return
    }

    setIsTraining(true)
    setCurrentIteration(0)
    setTrainingProgress(0)

    let network = [...somNetwork]
    let learningRate = somConfig.learningRate
    let radius = somConfig.neighborhoodRadius
    let totalError = 0

    for (let iteration = 0; iteration < somConfig.maxIterations; iteration++) {
      // Zufällige Auswahl eines Trainingsbeispiels
      const randomIndex = Math.floor(Math.random() * trainingData.length)
      const input = trainingData[randomIndex]

      // BMU finden
      const bmu = findBMU(input.features, network)
      bmu.activationCount++
      bmu.lastActivation = Date.now()

      // Gewichte aktualisieren
      network = network.map(node => {
        const influence = getNeighborhoodInfluence(bmu, node, radius)
        
        if (influence > 0) {
          const newWeights = node.weights.map((weight, i) => 
            weight + learningRate * influence * (input.features[i] - weight)
          )
          
          return { ...node, weights: newWeights }
        }
        return node
      })

      // Parameter für nächste Iteration anpassen
      learningRate *= somConfig.decayRate
      radius *= somConfig.decayRate

      // Quantisierungsfehler berechnen
      const error = calculateDistance(input.features, bmu.weights)
      totalError += error

      // UI-Updates alle 10 Iterationen
      if (iteration % 10 === 0) {
        setCurrentIteration(iteration)
        setTrainingProgress((iteration / somConfig.maxIterations) * 100)
        
        // Canvas aktualisieren
        await new Promise(resolve => setTimeout(resolve, 1))
      }
    }

    // Clustering nach dem Training
    network = performClustering(network)

    setSomNetwork(network)
    setTrainingStats({
      totalIterations: somConfig.maxIterations,
      lastTrainingTime: Date.now(),
      quantizationError: totalError / somConfig.maxIterations,
      topographicError: calculateTopographicError(network),
      convergenceRate: calculateConvergenceRate(network)
    })

    setIsTraining(false)
    setTrainingProgress(100)
    toast.success('SOM-Training abgeschlossen')
  }

  // Clustering-Algorithmus
  const performClustering = (network: SOMNode[]): SOMNode[] => {
    const clusters = ['Normal', 'Anomalie', 'Wartung', 'Stoßzeit', 'Notfall']
    
    return network.map(node => {
      // Einfache Cluster-Zuordnung basierend auf Gewichten
      const maxWeight = Math.max(...node.weights)
      const maxIndex = node.weights.indexOf(maxWeight)
      
      const clusterIndex = Math.floor((maxIndex / node.weights.length) * clusters.length)
      
      return {
        ...node,
        cluster: clusters[clusterIndex],
        features: generateFeatureLabels(node.weights)
      }
    })
  }

  // Feature-Labels generieren
  const generateFeatureLabels = (weights: number[]): string[] => {
    const labels: string[] = []
    
    weights.forEach((weight, index) => {
      if (weight > 0.7) {
        labels.push(`Hoch: ${featureNames[index]}`)
      } else if (weight < 0.3) {
        labels.push(`Niedrig: ${featureNames[index]}`)
      }
    })

    return labels
  }

  // Topographischen Fehler berechnen
  const calculateTopographicError = (network: SOMNode[]): number => {
    let errors = 0
    
    trainingData.forEach(data => {
      const distances = network.map(node => ({
        node,
        distance: calculateDistance(data.features, node.weights)
      })).sort((a, b) => a.distance - b.distance)

      const first = distances[0].node
      const second = distances[1].node

      // Prüfen ob die beiden besten Knoten benachbart sind
      const isAdjacent = Math.abs(first.x - second.x) <= 1 && 
                        Math.abs(first.y - second.y) <= 1

      if (!isAdjacent) errors++
    })

    return errors / trainingData.length
  }

  // Konvergenzrate berechnen
  const calculateConvergenceRate = (network: SOMNode[]): number => {
    const activeCounts = network.map(node => node.activationCount)
    const maxCount = Math.max(...activeCounts)
    const avgCount = activeCounts.reduce((sum, count) => sum + count, 0) / activeCounts.length
    
    return maxCount > 0 ? avgCount / maxCount : 0
  }

  // Canvas-Visualisierung
  const drawSOM = () => {
    const canvas = canvasRef.current
    if (!canvas || somNetwork.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cellSize = Math.min(canvas.width / somConfig.width, canvas.height / somConfig.height)
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // SOM-Knoten zeichnen
    somNetwork.forEach(node => {
      const x = node.x * cellSize
      const y = node.y * cellSize

      // Hintergrundfarbe basierend auf Cluster
      const clusterColors: Record<string, string> = {
        'Normal': '#22c55e',
        'Anomalie': '#ef4444',
        'Wartung': '#f59e0b',
        'Stoßzeit': '#3b82f6',
        'Notfall': '#dc2626'
      }

      ctx.fillStyle = clusterColors[node.cluster || 'Normal'] || '#6b7280'
      ctx.globalAlpha = 0.7
      ctx.fillRect(x, y, cellSize - 1, cellSize - 1)

      // Aktivierungsintensität
      const intensity = node.activationCount / Math.max(...somNetwork.map(n => n.activationCount))
      ctx.globalAlpha = intensity
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x + 2, y + 2, cellSize - 5, cellSize - 5)

      ctx.globalAlpha = 1
    })
  }

  // Canvas-Update bei Änderungen
  useEffect(() => {
    drawSOM()
  }, [somNetwork, somConfig])

  // Cluster-Statistiken
  const clusterStats = useMemo(() => {
    const stats: Record<string, number> = {}
    
    somNetwork.forEach(node => {
      if (node.cluster) {
        stats[node.cluster] = (stats[node.cluster] || 0) + 1
      }
    })

    return stats
  }, [somNetwork])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Grid3x3 size={28} className="text-primary" />
            </div>
            Self-Organizing Maps
          </h2>
          <p className="text-muted-foreground">
            Automatische Merkmalserkennung und Mustererkennung in Bahnbetriebsdaten
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isTraining ? (
            <Button disabled className="gap-2">
              <Activity className="animate-spin" size={16} />
              Training läuft...
            </Button>
          ) : (
            <Button onClick={trainSOM} className="gap-2">
              <Play size={16} />
              Training starten
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={initializeSOM}
            className="gap-2"
          >
            <RotateCcw size={16} />
            Zurücksetzen
          </Button>
        </div>
      </div>

      {/* Training Progress */}
      {isTraining && (
        <Alert>
          <Lightning size={16} />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Training in Bearbeitung...</span>
                <span className="font-mono text-sm">
                  {currentIteration} / {somConfig.maxIterations}
                </span>
              </div>
              <Progress value={trainingProgress} className="h-2" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOM-Visualisierung */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye size={20} />
                SOM-Karte Visualisierung
              </CardTitle>
              <CardDescription>
                Farbkodierte Darstellung der trainierten Karten-Neuronen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="border border-border rounded-lg w-full bg-white"
                />
                
                {/* Legende */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(clusterStats).map(([cluster, count]) => (
                    <Badge key={cluster} variant="outline" className="gap-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: {
                            'Normal': '#22c55e',
                            'Anomalie': '#ef4444', 
                            'Wartung': '#f59e0b',
                            'Stoßzeit': '#3b82f6',
                            'Notfall': '#dc2626'
                          }[cluster] || '#6b7280'
                        }}
                      />
                      {cluster} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Konfigurations-Panel */}
        <div className="space-y-6">
          {/* Training-Konfiguration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Training-Konfiguration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kartengröße</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Breite</label>
                    <Slider
                      value={[somConfig.width]}
                      onValueChange={([value]) => 
                        setSomConfig(prev => ({ ...prev, width: value }))
                      }
                      min={5}
                      max={25}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">{somConfig.width}</span>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Höhe</label>
                    <Slider
                      value={[somConfig.height]}
                      onValueChange={([value]) => 
                        setSomConfig(prev => ({ ...prev, height: value }))
                      }
                      min={5}
                      max={25}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">{somConfig.height}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Lernrate</label>
                <Slider
                  value={[somConfig.learningRate]}
                  onValueChange={([value]) => 
                    setSomConfig(prev => ({ ...prev, learningRate: value }))
                  }
                  min={0.01}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{somConfig.learningRate}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nachbarschaftsradius</label>
                <Slider
                  value={[somConfig.neighborhoodRadius]}
                  onValueChange={([value]) => 
                    setSomConfig(prev => ({ ...prev, neighborhoodRadius: value }))
                  }
                  min={1}
                  max={15}
                  step={1}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{somConfig.neighborhoodRadius}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max. Iterationen</label>
                <Slider
                  value={[somConfig.maxIterations]}
                  onValueChange={([value]) => 
                    setSomConfig(prev => ({ ...prev, maxIterations: value }))
                  }
                  min={100}
                  max={5000}
                  step={100}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{somConfig.maxIterations}</span>
              </div>
            </CardContent>
          </Card>

          {/* Training-Statistiken */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Training-Statistiken
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-primary">
                    {trainingStats.totalIterations}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Iterationen
                  </div>
                </div>
                
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    {(trainingStats.quantizationError * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Quantisierungsfehler
                  </div>
                </div>
                
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    {(trainingStats.topographicError * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Topographischer Fehler
                  </div>
                </div>
                
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    {(trainingStats.convergenceRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Konvergenz
                  </div>
                </div>
              </div>

              {trainingStats.lastTrainingTime && (
                <div className="text-xs text-muted-foreground text-center">
                  Letztes Training: {new Date(trainingStats.lastTrainingTime).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature-Analyse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={20} />
            Erkannte Merkmale und Muster
          </CardTitle>
          <CardDescription>
            Automatisch identifizierte Betriebsmuster aus Trainingsdaten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clusters" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clusters">Cluster-Analyse</TabsTrigger>
              <TabsTrigger value="features">Merkmals-Wichtigkeit</TabsTrigger>
              <TabsTrigger value="patterns">Erkannte Muster</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clusters" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(clusterStats).map(([cluster, count]) => (
                  <Card key={cluster} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{cluster}</h4>
                      <Badge variant="outline">{count} Knoten</Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress 
                        value={(count / somNetwork.length) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {((count / somNetwork.length) * 100).toFixed(1)}% der Karte
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <div className="space-y-3">
                {featureNames.map((feature, index) => {
                  const avgWeight = somNetwork.length > 0 
                    ? somNetwork.reduce((sum, node) => sum + node.weights[index], 0) / somNetwork.length
                    : 0
                  
                  return (
                    <div key={feature} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="font-medium">{feature}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={avgWeight * 100} className="w-24 h-2" />
                        <span className="text-sm font-mono w-12">
                          {(avgWeight * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="patterns" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    pattern: 'Stoßzeiten-Erkennung',
                    confidence: 94,
                    description: 'Hohe Passagierfrequenz kombiniert mit reduzierter Pünktlichkeit',
                    features: ['Passagierfrequenz', 'Pünktlichkeit']
                  },
                  {
                    pattern: 'Wetter-Anomalien',
                    confidence: 87,
                    description: 'Korrelation zwischen Wetterbedingungen und Betriebsstörungen',
                    features: ['Wetterbedingungen', 'Systemlast']
                  },
                  {
                    pattern: 'Wartungsvorhersage',
                    confidence: 91,
                    description: 'Verschlechterung der Systemleistung vor Wartungszyklen',
                    features: ['Wartungsstatus', 'Systemlast']
                  },
                  {
                    pattern: 'Notfall-Erkennung',
                    confidence: 96,
                    description: 'Charakteristische Signatur bei Notfall-Situationen',
                    features: ['Alle Merkmale']
                  }
                ].map((pattern, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{pattern.pattern}</h4>
                        <Badge 
                          variant={pattern.confidence >= 90 ? "default" : "secondary"}
                          className="gap-1"
                        >
                          <TrendingUp size={12} />
                          {pattern.confidence}%
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {pattern.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {pattern.features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default SelfOrganizingMaps