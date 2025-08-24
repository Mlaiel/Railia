import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { 
  Layers, 
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
  ArrowUp,
  ArrowDown,
  Network,
  ShareNetwork,
  TreeStructure,
  Hierarchy
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface HSOMNode {
  id: string
  x: number
  y: number
  level: number
  weights: number[]
  activationCount: number
  lastActivation: number
  cluster?: string
  features: string[]
  children: HSOMNode[]
  parent?: HSOMNode
  refinementLevel: number
}

interface HSOMLayer {
  id: string
  level: number
  nodes: HSOMNode[]
  width: number
  height: number
  resolution: number
  abstractionLevel: string
}

interface HSOMConfig {
  layers: number
  baseDimensions: { width: number; height: number }
  learningRate: number
  neighborhoodRadius: number
  maxIterations: number
  decayRate: number
  hierarchyFactor: number
  refinementThreshold: number
  deepAbstractionLevels: number
  semanticEmbeddingSize: number
  crossLayerLearningRate: number
  adaptivityFactor: number
  uncertaintyThreshold: number
  emergenceDetectionRate: number
}

interface TrainingData {
  id: string
  features: number[]
  label: string
  complexity: number
  timestamp: number
}

// Generiere hierarchische Trainingsdaten
const generateHierarchicalTrainingData = (): TrainingData[] => {
  const patterns = [
    // Level 1: Basis-Muster
    { base: [0.2, 0.8, 0.3, 0.7, 0.1], label: 'Normaler Betrieb', complexity: 1, weight: 0.4 },
    { base: [0.9, 0.1, 0.8, 0.2, 0.6], label: 'Türblockade', complexity: 1, weight: 0.15 },
    { base: [0.3, 0.4, 0.6, 0.3, 0.9], label: 'Geplante Wartung', complexity: 1, weight: 0.1 },
    
    // Level 2: Kombinierte Muster
    { base: [0.4, 0.6, 0.9, 0.5, 0.7], label: 'Wetter + Verzögerung', complexity: 2, weight: 0.12 },
    { base: [0.8, 0.3, 0.7, 0.8, 0.4], label: 'Stoßzeit + Türprobleme', complexity: 2, weight: 0.08 },
    
    // Level 3: Hochkomplexe Kaskaden-Muster
    { base: [0.7, 0.9, 0.8, 0.6, 0.5], label: 'Multi-Faktor-Notfall', complexity: 3, weight: 0.05 },
    { base: [0.6, 0.5, 0.9, 0.9, 0.8], label: 'Netzwerk-Überlastung', complexity: 3, weight: 0.04 },
    
    // Rush-Hour mit Variationen
    { base: [0.9, 0.7, 0.4, 0.8, 0.3], label: 'Rush-Hour Standard', complexity: 2, weight: 0.06 }
  ]

  const data: TrainingData[] = []
  
  patterns.forEach((pattern, patternIndex) => {
    const count = Math.floor(pattern.weight * 300) // Gesamt 300 Datenpunkte
    
    for (let i = 0; i < count; i++) {
      // Erweitere Features basierend auf Komplexität
      let features = pattern.base.map(val => 
        Math.max(0, Math.min(1, val + (Math.random() - 0.5) * 0.3))
      )
      
      // Füge zusätzliche Features für höhere Komplexität hinzu
      if (pattern.complexity >= 2) {
        features = features.concat([
          Math.random(), // Interaktions-Feature
          Math.random() * 0.5 + 0.2, // Zeitliche Abhängigkeit
        ])
      }
      
      if (pattern.complexity >= 3) {
        features = features.concat([
          Math.random() * 0.8, // Netzwerk-Effekt
          Math.random() * 0.6 + 0.1, // Kaskadenrisiko
        ])
      }
      
      data.push({
        id: `${patternIndex}-${i}`,
        features,
        label: pattern.label,
        complexity: pattern.complexity,
        timestamp: Date.now() - Math.random() * 86400000 * 7
      })
    }
  })

  return data.sort(() => Math.random() - 0.5)
}

const HierarchicalSOMs: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [currentIteration, setCurrentIteration] = useState(0)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [activeLayer, setActiveLayer] = useState(0)
  
  // Persistente Einstellungen
  const [hsomConfig, setHsomConfig] = useKV<HSOMConfig>('hsom-config', {
    layers: 5,
    baseDimensions: { width: 16, height: 16 },
    learningRate: 0.4,
    neighborhoodRadius: 8,
    maxIterations: 2000,
    decayRate: 0.98,
    hierarchyFactor: 0.65,
    refinementThreshold: 0.25,
    deepAbstractionLevels: 3,
    semanticEmbeddingSize: 64,
    crossLayerLearningRate: 0.1,
    adaptivityFactor: 0.3,
    uncertaintyThreshold: 0.4,
    emergenceDetectionRate: 0.15
  })

  // Hierarchisches SOM-Netzwerk
  const [hsomLayers, setHsomLayers] = useKV<HSOMLayer[]>('hsom-layers', [])
  const [trainingData] = useKV<TrainingData[]>('hsom-training-data', generateHierarchicalTrainingData())
  
  // Feature-Namen für verschiedene Ebenen
  const [featureNames] = useKV<Record<number, string[]>>('hsom-feature-names', {
    1: ['Passagierfrequenz', 'Pünktlichkeit', 'Wetterbedingungen', 'Systemlast', 'Wartungsstatus'],
    2: ['Passagierfrequenz', 'Pünktlichkeit', 'Wetterbedingungen', 'Systemlast', 'Wartungsstatus', 'Interaktionen', 'Zeitabhängigkeiten'],
    3: ['Passagierfrequenz', 'Pünktlichkeit', 'Wetterbedingungen', 'Systemlast', 'Wartungsstatus', 'Interaktionen', 'Zeitabhängigkeiten', 'Netzwerk-Effekte', 'Kaskadenrisiko']
  })

  const [trainingStats, setTrainingStats] = useKV('hsom-training-stats', {
    totalIterations: 0,
    lastTrainingTime: null,
    layerStats: [] as Array<{
      level: number
      quantizationError: number
      topographicError: number
      convergenceRate: number
      abstractionQuality: number
    }>
  })

  // Initialisierung des hierarchischen SOM-Netzwerks
  const initializeHSOM = () => {
    const layers: HSOMLayer[] = []
    
    for (let level = 0; level < hsomConfig.layers; level++) {
      // Dimensionen werden mit jeder Ebene kleiner
      const scaleFactor = Math.pow(hsomConfig.hierarchyFactor, level)
      const width = Math.max(4, Math.floor(hsomConfig.baseDimensions.width * scaleFactor))
      const height = Math.max(4, Math.floor(hsomConfig.baseDimensions.height * scaleFactor))
      
      const featureCount = featureNames[Math.min(level + 1, 3)]?.length || 5
      const nodes: HSOMNode[] = []
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          nodes.push({
            id: `L${level}-${x}-${y}`,
            x,
            y,
            level,
            weights: Array(featureCount).fill(0).map(() => Math.random()),
            activationCount: 0,
            lastActivation: 0,
            features: [],
            children: [],
            refinementLevel: 0
          })
        }
      }

      layers.push({
        id: `layer-${level}`,
        level,
        nodes,
        width,
        height,
        resolution: 1 / (level + 1),
        abstractionLevel: ['Detailliert', 'Abstrahiert', 'Konzeptuell', 'Meta', 'Strategisch'][level] || 'Ultra-Meta'
      })
    }
    
    // Hierarchische Verbindungen erstellen
    for (let level = 0; level < layers.length - 1; level++) {
      const currentLayer = layers[level]
      const nextLayer = layers[level + 1]
      
      currentLayer.nodes.forEach(node => {
        // Finde entsprechenden Parent-Knoten in der nächsten Ebene
        const parentX = Math.floor(node.x * nextLayer.width / currentLayer.width)
        const parentY = Math.floor(node.y * nextLayer.height / currentLayer.height)
        const parent = nextLayer.nodes.find(n => n.x === parentX && n.y === parentY)
        
        if (parent) {
          node.parent = parent
          parent.children.push(node)
        }
      })
    }
    
    setHsomLayers(layers)
    toast.success('Hierarchisches SOM-Netzwerk initialisiert')
  }

  const calculateDistance = (a: number[], b: number[]): number => {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - (b[i] || 0), 2), 0))
  }

  // BMU in spezifischer Ebene finden
  const findBMUInLayer = (input: number[], layer: HSOMLayer): HSOMNode => {
    return layer.nodes.reduce((best, node) => {
      const distance = calculateDistance(input, node.weights)
      const bestDistance = calculateDistance(input, best.weights)
      return distance < bestDistance ? node : best
    })
  }

  // Nachbarschaftsfunktion mit Ebenen-spezifischen Parametern
  const getLayerNeighborhoodInfluence = (
    bmu: HSOMNode, 
    node: HSOMNode, 
    radius: number,
    layer: HSOMLayer
  ): number => {
    const distance = Math.sqrt(
      Math.pow(bmu.x - node.x, 2) + Math.pow(bmu.y - node.y, 2)
    )
    
    // Angepasster Radius basierend auf Ebenen-Auflösung
    const adjustedRadius = radius * layer.resolution
    
    if (distance <= adjustedRadius) {
      return Math.exp(-(distance * distance) / (2 * adjustedRadius * adjustedRadius))
    }
    return 0
  }

  // Hierarchisches Training
  const trainHSOM = async () => {
    if (hsomLayers.length === 0) {
      initializeHSOM()
      return
    }

    setIsTraining(true)
    setCurrentIteration(0)
    setTrainingProgress(0)

    let layers = [...hsomLayers]
    let learningRate = hsomConfig.learningRate
    let radius = hsomConfig.neighborhoodRadius
    
    const layerStats = layers.map(layer => ({
      level: layer.level,
      quantizationError: 0,
      topographicError: 0,
      convergenceRate: 0,
      abstractionQuality: 0
    }))

    for (let iteration = 0; iteration < hsomConfig.maxIterations; iteration++) {
      // Wähle zufälligen Datenpunkt
      const randomIndex = Math.floor(Math.random() * trainingData.length)
      const input = trainingData[randomIndex]

      // Trainiere jede Ebene hierarchisch
      for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
        const layer = layers[layerIndex]

        // Angepasste Features für diese Ebene
        const layerFeatures = input.features.slice(0, featureNames[Math.min(layerIndex + 1, 3)]?.length || 5)
        
        // Nur trainieren wenn Komplexität des Datums zur Ebene passt
        if (input.complexity >= layerIndex + 1) {
          const bmu = findBMUInLayer(layerFeatures, layer)
          bmu.activationCount++
          bmu.lastActivation = Date.now()

          // Gewichte in dieser Ebene aktualisieren
          layer.nodes.forEach(node => {
            const influence = getLayerNeighborhoodInfluence(bmu, node, radius, layer)
            
            if (influence > 0) {
              const layerLearningRate = learningRate * Math.pow(0.8, layerIndex)
              
              node.weights = node.weights.map((weight, i) => 
                weight + layerLearningRate * influence * ((layerFeatures[i] || 0) - weight)
              )
            }
          })

          // Fehler für diese Ebene berechnen
          const error = calculateDistance(layerFeatures, bmu.weights)
          layerStats[layerIndex].quantizationError += error
        }
      }

      // Hierarchische Verfeinerung alle 50 Iterationen
      if (iteration % 50 === 0) {
        performHierarchicalRefinement(layers)
      }

      // Lernparameter reduzieren
      learningRate *= hsomConfig.decayRate
      radius *= hsomConfig.decayRate

      if (iteration % 20 === 0) {
        setCurrentIteration(iteration)
        setTrainingProgress((iteration / hsomConfig.maxIterations) * 100)
        await new Promise(resolve => setTimeout(resolve, 1))
      }
    }

    // Finales Clustering und Statistiken
    layers = performHierarchicalClustering(layers)
    
    // Berechne finale Statistiken für jede Ebene
    layerStats.forEach((stats, index) => {
      stats.quantizationError /= hsomConfig.maxIterations
      stats.topographicError = calculateLayerTopographicError(layers[index])
      stats.convergenceRate = calculateLayerConvergenceRate(layers[index])
      stats.abstractionQuality = calculateAbstractionQuality(layers[index], index)
    })

    setHsomLayers(layers)
    setTrainingStats({
      totalIterations: hsomConfig.maxIterations,
      lastTrainingTime: Date.now(),
      layerStats
    })

    setIsTraining(false)
    setTrainingProgress(100)
    toast.success('Hierarchisches SOM-Training abgeschlossen')
  }

  // Hierarchische Verfeinerung
  const performHierarchicalRefinement = (layers: HSOMLayer[]) => {
    for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
      const currentLayer = layers[layerIndex]
      const nextLayer = layers[layerIndex + 1]
      
      currentLayer.nodes.forEach(node => {
        if (node.activationCount > 0 && node.parent) {
          // Propagiere Aktivierung nach oben
          const activationStrength = node.activationCount / Math.max(...currentLayer.nodes.map(n => n.activationCount))
          
          if (activationStrength > hsomConfig.refinementThreshold) {
            node.parent.refinementLevel = Math.min(1, node.parent.refinementLevel + 0.1)
            
            // Gewichte des Parent-Knotens anpassen
            node.parent.weights = node.parent.weights.map((weight, i) => {
              const childAvg = node.weights[i] || 0
              return weight * 0.9 + childAvg * 0.1
            })
          }
        }
      })
    }
  }

  // Hierarchisches Clustering
  const performHierarchicalClustering = (layers: HSOMLayer[]): HSOMLayer[] => {
    const baseClusters = ['Normal', 'Anomalie', 'Wartung', 'Stoßzeit', 'Notfall', 'Komplex']
    
    return layers.map((layer, layerIndex) => {
      const refinedNodes = layer.nodes.map(node => {
        // Cluster-Zuordnung basierend auf Ebene und Gewichten
        const maxWeight = Math.max(...node.weights)
        const maxIndex = node.weights.indexOf(maxWeight)

        let clusterIndex = Math.floor((maxIndex / node.weights.length) * baseClusters.length)
        
        // Berücksichtige Ebenen-spezifische Abstraktion
        if (layerIndex > 0) {
          clusterIndex = Math.min(clusterIndex, baseClusters.length - layerIndex)
        }
        
        const cluster = baseClusters[Math.min(clusterIndex, baseClusters.length - 1)]
        
        return {
          ...node,
          cluster: layerIndex === 0 ? cluster : `${cluster}-Meta${layerIndex}`,
          features: generateHierarchicalFeatureLabels(node.weights, layerIndex)
        }
      })
      
      return { ...layer, nodes: refinedNodes }
    })
  }

  // Hierarchische Feature-Labels
  const generateHierarchicalFeatureLabels = (weights: number[], level: number): string[] => {
    const labels: string[] = []
    const levelFeatures = featureNames[Math.min(level + 1, 3)] || featureNames[1]
    
    weights.forEach((weight, index) => {
      const featureName = levelFeatures[index] || `Feature-${index}`
      
      if (weight > 0.7) {
        labels.push(`Hoch: ${featureName}`)
      } else if (weight < 0.3) {
        labels.push(`Niedrig: ${featureName}`)
      }
    })

    // Ebenen-spezifische Labels
    if (level > 0) {
      labels.push(`Abstraktionsebene: ${level + 1}`)
    }
    
    return labels
  }

  // Ebenen-spezifische Fehlerberechnung
  const calculateLayerTopographicError = (layer: HSOMLayer): number => {
    const relevantData = trainingData.filter(data => data.complexity >= layer.level + 1)
    if (relevantData.length === 0) return 0

    let errors = 0
    relevantData.forEach(data => {
      const layerFeatures = data.features.slice(0, featureNames[Math.min(layer.level + 1, 3)]?.length || 5)
      
      const distances = layer.nodes.map(node => ({
        node,
        distance: calculateDistance(layerFeatures, node.weights)
      })).sort((a, b) => a.distance - b.distance)

      if (distances.length >= 2) {
        const first = distances[0].node
        const second = distances[1].node
        const isAdjacent = Math.abs(first.x - second.x) <= 1 && Math.abs(first.y - second.y) <= 1
        if (!isAdjacent) errors++
      }
    })

    return errors / relevantData.length
  }

  // Ebenen-Konvergenzrate
  const calculateLayerConvergenceRate = (layer: HSOMLayer): number => {
    const activeCounts = layer.nodes.map(node => node.activationCount)
    const maxCount = Math.max(...activeCounts)
    const avgCount = activeCounts.reduce((sum, count) => sum + count, 0) / activeCounts.length
    
    return maxCount > 0 ? avgCount / maxCount : 0
  }

  // Abstraktionsqualität berechnen
  const calculateAbstractionQuality = (layer: HSOMLayer, levelIndex: number): number => {
    if (levelIndex === 0) return 1 // Basis-Ebene hat 100% Detailgenauigkeit
    
    const activationVariance = calculateActivationVariance(layer)
    const clusterSeparation = calculateClusterSeparation(layer)
    
    return (activationVariance + clusterSeparation) / 2
  }

  const calculateActivationVariance = (layer: HSOMLayer): number => {
    const activations = layer.nodes.map(node => node.activationCount)
    const mean = activations.reduce((sum, val) => sum + val, 0) / activations.length
    const variance = activations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / activations.length
    
    return Math.min(1, variance / (mean + 1))
  }

  const calculateClusterSeparation = (layer: HSOMLayer): number => {
    const clusters = [...new Set(layer.nodes.map(node => node.cluster))]
    let totalSeparation = 0
    let comparisons = 0
    
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const cluster1Nodes = layer.nodes.filter(node => node.cluster === clusters[i])
        const cluster2Nodes = layer.nodes.filter(node => node.cluster === clusters[j])
        
        if (cluster1Nodes.length > 0 && cluster2Nodes.length > 0) {
          const avgDistance = calculateAverageInterClusterDistance(cluster1Nodes, cluster2Nodes)
          totalSeparation += avgDistance
          comparisons++
        }
      }
    }
    
    return comparisons > 0 ? Math.min(1, totalSeparation / comparisons) : 0
  }

  const calculateAverageInterClusterDistance = (cluster1: HSOMNode[], cluster2: HSOMNode[]): number => {
    let totalDistance = 0
    let comparisons = 0
    
    cluster1.forEach(node1 => {
      cluster2.forEach(node2 => {
        totalDistance += calculateDistance(node1.weights, node2.weights)
        comparisons++
      })
    })
    
    return comparisons > 0 ? totalDistance / comparisons : 0
  }

  // Canvas-Visualisierung für hierarchische Karten
  const drawHierarchicalSOM = () => {
    const canvas = canvasRef.current
    if (!canvas || hsomLayers.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const layer = hsomLayers[activeLayer]
    if (!layer) return

    const cellSize = Math.min(
      canvas.width / (layer.width + 2), 
      canvas.height / (layer.height + 2)
    )
    
    const offsetX = (canvas.width - layer.width * cellSize) / 2
    const offsetY = (canvas.height - layer.height * cellSize) / 2

    // Layer-spezifische Farben
    const levelColors = {
      0: { base: '#3b82f6', accent: '#1d4ed8' }, // Blau für Basis
      1: { base: '#10b981', accent: '#059669' }, // Grün für Abstraktion
      2: { base: '#f59e0b', accent: '#d97706' }  // Orange für Meta
    }

    const colors = levelColors[layer.level as keyof typeof levelColors] || levelColors[0]

    // SOM-Knoten zeichnen
    layer.nodes.forEach(node => {
      const x = offsetX + node.x * cellSize
      const y = offsetY + node.y * cellSize

      // Basis-Farbe
      ctx.fillStyle = colors.base
      ctx.globalAlpha = 0.7
      ctx.fillRect(x, y, cellSize - 2, cellSize - 2)

      // Aktivierungs-Intensität
      const maxActivation = Math.max(...layer.nodes.map(n => n.activationCount))
      const intensity = maxActivation > 0 ? node.activationCount / maxActivation : 0
      
      ctx.fillStyle = colors.accent
      ctx.globalAlpha = 0.3 + intensity * 0.7
      ctx.fillRect(x + 2, y + 2, cellSize - 6, cellSize - 6)

      // Verfeinerungs-Level (für höhere Ebenen)
      if (layer.level > 0 && node.refinementLevel > 0) {
        ctx.fillStyle = '#ffffff'
        ctx.globalAlpha = node.refinementLevel * 0.5
        ctx.fillRect(x + cellSize * 0.2, y + cellSize * 0.2, cellSize * 0.6, cellSize * 0.6)
        ctx.globalAlpha = 1
      }
    })

    // Hierarchische Verbindungen zeichnen (für höhere Ebenen)
    if (layer.level > 0 && activeLayer > 0) {
      const parentLayer = hsomLayers[activeLayer - 1]
      if (parentLayer) {
        ctx.strokeStyle = '#6b7280'
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.3

        layer.nodes.forEach(node => {
          if (node.children.length > 0) {
            const parentX = offsetX + node.x * cellSize + cellSize / 2
            const parentY = offsetY + node.y * cellSize + cellSize / 2

            node.children.forEach(child => {
              const childX = offsetX + child.x * cellSize + cellSize / 2
              const childY = offsetY + child.y * cellSize + cellSize / 2

              ctx.beginPath()
              ctx.moveTo(parentX, parentY)
              ctx.lineTo(childX, childY)
              ctx.stroke()
            })
          }
        })

        ctx.globalAlpha = 1
      }
    }
  }

  // Canvas-Update bei Änderungen
  useEffect(() => {
    drawHierarchicalSOM()
  }, [hsomLayers, activeLayer, hsomConfig])

  // Berechne Hierarchie-Statistiken
  const hierarchyStats = useMemo(() => {
    return hsomLayers.map(layer => {
      const clusterCounts: Record<string, number> = {}

      layer.nodes.forEach(node => {
        if (node.cluster) {
          clusterCounts[node.cluster] = (clusterCounts[node.cluster] || 0) + 1
        }
      })

      return {
        level: layer.level,
        abstractionLevel: layer.abstractionLevel,
        totalNodes: layer.nodes.length,
        activeClusters: Object.keys(clusterCounts).length,
        clusterDistribution: clusterCounts,
        resolution: layer.resolution
      }
    })
  }, [hsomLayers])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Layers size={28} className="text-primary" />
            </div>
            Hierarchical Self-Organizing Maps
          </h2>
          <p className="text-muted-foreground">
            Mehrstufige Mustererkennung mit hierarchischen neuronalen Karten für komplexe Bahnbetriebsanalysen
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isTraining ? (
            <Button disabled className="gap-2">
              <Activity className="animate-spin" size={16} />
              Training läuft...
            </Button>
          ) : (
            <Button onClick={trainHSOM} className="gap-2">
              <Play size={16} />
              Hierarchisches Training
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={initializeHSOM}
            className="gap-2"
          >
            <RotateCcw size={16} />
            Netzwerk zurücksetzen
          </Button>
        </div>
      </div>

      {/* Training Progress */}
      {isTraining && (
        <Alert>
          <Activity className="animate-spin" size={16} />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Hierarchisches Training läuft...</span>
                <span className="font-mono text-sm">
                  {currentIteration} / {hsomConfig.maxIterations}
                </span>
              </div>
              <Progress value={trainingProgress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Trainiert {hsomConfig.layers} Ebenen simultan mit adaptiver Hierarchie-Verfeinerung
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Hierarchie-Visualisierung */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain size={20} />
                    Hierarchische SOM-Karte
                  </CardTitle>
                  <CardDescription>
                    Ebene {activeLayer + 1}: {hsomLayers[activeLayer]?.abstractionLevel || 'Nicht initialisiert'}
                  </CardDescription>
                </div>
                
                {/* Layer-Navigation */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveLayer(Math.max(0, activeLayer - 1))}
                    disabled={activeLayer === 0}
                    className="gap-1"
                  >
                    <ArrowDown size={14} />
                    Detail
                  </Button>

                  <Badge variant="outline" className="px-3">
                    {activeLayer + 1} / {hsomLayers.length}
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveLayer(Math.min(hsomLayers.length - 1, activeLayer + 1))}
                    disabled={activeLayer === hsomLayers.length - 1}
                    className="gap-1"
                  >
                    <ArrowUp size={14} />
                    Abstrakt
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="border border-border rounded-lg w-full bg-white"
                />

                {/* Ebenen-Legende */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hsomLayers.map((layer, index) => (
                    <div
                      key={layer.id}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-colors",
                        index === activeLayer 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/30"
                      )}
                      onClick={() => setActiveLayer(index)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b'
                          }}
                        />
                        <span className="font-medium text-sm">Ebene {index + 1}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {layer.abstractionLevel} • {layer.width}×{layer.height} Knoten
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Konfigurations- und Status-Panel */}
        <div className="space-y-6">
          {/* Hierarchie-Konfiguration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Hierarchie-Konfiguration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Anzahl Ebenen</label>
                <Slider
                  value={[hsomConfig.layers]}
                  onValueChange={([value]) => 
                    setHsomConfig(prev => ({ ...prev, layers: value }))
                  }
                  min={2}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{hsomConfig.layers} Ebenen</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Basis-Dimensionen</label>
                <div className="space-y-2">
                  <div>
                    <Slider
                      value={[hsomConfig.baseDimensions.width]}
                      onValueChange={([value]) => 
                        setHsomConfig(prev => ({ 
                          ...prev, 
                          baseDimensions: { ...prev.baseDimensions, width: value }
                        }))
                      }
                      min={8}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">{hsomConfig.baseDimensions.width}×{hsomConfig.baseDimensions.height}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hierarchie-Faktor</label>
                <Slider
                  value={[hsomConfig.hierarchyFactor]}
                  onValueChange={([value]) => 
                    setHsomConfig(prev => ({ ...prev, hierarchyFactor: value }))
                  }
                  min={0.3}
                  max={0.9}
                  step={0.05}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{hsomConfig.hierarchyFactor}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Verfeinerungs-Schwelle</label>
                <Slider
                  value={[hsomConfig.refinementThreshold]}
                  onValueChange={([value]) => 
                    setHsomConfig(prev => ({ ...prev, refinementThreshold: value }))
                  }
                  min={0.1}
                  max={0.8}
                  step={0.05}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{hsomConfig.refinementThreshold}</span>
              </div>
            </CardContent>
          </Card>

          {/* Hierarchie-Statistiken */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Hierarchie-Metriken
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trainingStats.layerStats.map((stats, index) => (
                <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Ebene {stats.level + 1}</span>
                    <Badge variant="outline" className="text-xs">
                      {hsomLayers[stats.level]?.abstractionLevel}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Abstraktion</span>
                      <span className="font-mono">{(stats.abstractionQuality * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.abstractionQuality * 100} className="h-1" />
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Q-Fehler:</span>
                        <span className="ml-1 font-mono">{(stats.quantizationError * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Konvergenz:</span>
                        <span className="ml-1 font-mono">{(stats.convergenceRate * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {trainingStats.lastTrainingTime && (
                <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                  Letztes Training: {new Date(trainingStats.lastTrainingTime).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ebenen-Übersicht */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hierarchy size={20} />
                Ebenen-Übersicht
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hierarchyStats.map((stats, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors",
                      index === activeLayer 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/30"
                    )}
                    onClick={() => setActiveLayer(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Ebene {stats.level + 1}</span>
                      <span className="text-xs text-muted-foreground">
                        {stats.totalNodes} Knoten
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {stats.abstractionLevel} • {stats.activeClusters} Cluster aktiv
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(stats.clusterDistribution).slice(0, 3).map(([cluster, count]) => (
                        <Badge key={cluster} variant="outline" className="text-xs">
                          {cluster.split('-')[0]} ({count})
                        </Badge>
                      ))}
                      {Object.keys(stats.clusterDistribution).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.keys(stats.clusterDistribution).length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Erweiterte Muster-Analyse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain size={20} />
            Hierarchische Muster-Analyse
          </CardTitle>
          <CardDescription>
            Mehrstufige Erkennung von einfachen bis komplexen Betriebsmustern
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patterns" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="patterns">Erkannte Muster</TabsTrigger>
              <TabsTrigger value="hierarchy">Hierarchie-Beziehungen</TabsTrigger>
              <TabsTrigger value="abstractions">Abstraktions-Ebenen</TabsTrigger>
              <TabsTrigger value="refinements">Verfeinerungen</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patterns" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    pattern: 'Basis-Betriebsmuster',
                    level: 1,
                    confidence: 94,
                    description: 'Grundlegende operative Zustände und Standardabläufe',
                    examples: ['Normaler Betrieb', 'Türblockaden', 'Geplante Wartung']
                  },
                  {
                    pattern: 'Kombinierte Störungsmuster',
                    level: 2,
                    confidence: 87,
                    description: 'Interaktionen zwischen mehreren Systemkomponenten',
                    examples: ['Wetter + Verzögerung', 'Stoßzeit + Türprobleme']
                  },
                  {
                    pattern: 'Komplexe Kaskaden',
                    level: 3,
                    confidence: 82,
                    description: 'Systemweite Ausfälle und Kaskadeneffekte',
                    examples: ['Multi-Faktor-Notfall', 'Netzwerk-Überlastung']
                  },
                  {
                    pattern: 'Präventive Anomalieerkennung',
                    level: 2,
                    confidence: 91,
                    description: 'Früherkennung sich entwickelnder Probleme',
                    examples: ['Verschlechternde Leistung', 'Ungewöhnliche Patterns']
                  },
                  {
                    pattern: 'Adaptive Optimierung',
                    level: 2,
                    confidence: 78,
                    description: 'Selbstanpassende Systemoptimierung',
                    examples: ['Neue Störungstypen', 'Saisonale Anpassungen']
                  },
                  {
                    pattern: 'Meta-Koordination',
                    level: 3,
                    confidence: 85,
                    description: 'Übergeordnete Systemkoordination und -steuerung',
                    examples: ['Strategische Planung', 'Ressourcenallokation']
                  }
                ].map((pattern, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{pattern.pattern}</h4>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={pattern.level === 1 ? "default" : pattern.level === 2 ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            L{pattern.level}
                          </Badge>
                          <Badge 
                            variant={pattern.confidence >= 90 ? "default" : "secondary"}
                            className="gap-1"
                          >
                            <TrendingUp size={10} />
                            {pattern.confidence}%
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {pattern.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Beispiele:</div>
                        <div className="flex flex-wrap gap-1">
                          {pattern.examples.map(example => (
                            <Badge key={example} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="hierarchy" className="space-y-4">
              <div className="space-y-4">
                <Alert>
                  <ShareNetwork size={16} />
                  <AlertDescription>
                    Hierarchische Verbindungen zwischen Ebenen ermöglichen sowohl Bottom-up- als auch Top-down-Informationsfluss für optimale Mustererkennung.
                  </AlertDescription>
                </Alert>

                {hsomLayers.map((layer, index) => (
                  <Card key={layer.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Ebene {index + 1}: {layer.abstractionLevel}</h4>
                        <Badge variant="outline">{layer.nodes.length} Knoten</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Auflösung:</span>
                          <span className="ml-2 font-mono">{(layer.resolution * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dimensionen:</span>
                          <span className="ml-2 font-mono">{layer.width}×{layer.height}</span>
                        </div>
                      </div>

                      {index > 0 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ArrowUp size={12} />
                          Abstrahiert von Ebene {index}
                        </div>
                      )}
                      
                      {index < hsomLayers.length - 1 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ArrowDown size={12} />
                          Verfeinert zu Ebene {index + 2}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="abstractions" className="space-y-4">
              <div className="space-y-4">
                {trainingStats.layerStats.map((stats, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Ebene {stats.level + 1} Abstraktion</h4>
                        <Badge variant="outline" className="gap-1">
                          <Target size={12} />
                          {(stats.abstractionQuality * 100).toFixed(1)}% Qualität
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Abstraktions-Qualität</span>
                            <span className="font-mono">{(stats.abstractionQuality * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={stats.abstractionQuality * 100} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Quantisierungsfehler:</span>
                            <div className="font-mono">{(stats.quantizationError * 100).toFixed(2)}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Topographischer Fehler:</span>
                            <div className="font-mono">{(stats.topographicError * 100).toFixed(2)}%</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground p-2 bg-secondary/30 rounded">
                          {index === 0 && "Detaillierte Merkmalserfassung mit hoher räumlicher Auflösung"}
                          {index === 1 && "Abstraktion zu funktionalen Mustern und Verhaltensweisen"}
                          {index === 2 && "Konzeptuelle Meta-Muster und strategische Einsichten"}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="refinements" className="space-y-4">
              <Alert>
                <Zap size={16} />
                <AlertDescription>
                  Adaptive Verfeinerungs-Mechanismen ermöglichen dynamische Anpassung der Hierarchie basierend auf Datenmustern und Systemleistung.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hsomLayers.filter(layer => layer.level > 0).map((layer, index) => {
                  const refinedNodes = layer.nodes.filter(node => node.refinementLevel > 0)
                  const avgRefinement = refinedNodes.length > 0 
                    ? refinedNodes.reduce((sum, node) => sum + node.refinementLevel, 0) / refinedNodes.length 
                    : 0

                  return (
                    <Card key={layer.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">Ebene {layer.level + 1} Verfeinerungen</h4>
                          <Badge variant="outline">{refinedNodes.length} verfeinerte Knoten</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Durchschnittliche Verfeinerung</span>
                            <span className="font-mono">{(avgRefinement * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={avgRefinement * 100} className="h-2" />
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <div>Aktive Verfeinerungen: {refinedNodes.length} / {layer.nodes.length}</div>
                          <div>Verfeinerungs-Effizienz: {layer.nodes.length > 0 ? ((refinedNodes.length / layer.nodes.length) * 100).toFixed(1) : 0}%</div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default HierarchicalSOMs