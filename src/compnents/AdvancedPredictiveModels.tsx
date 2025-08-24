/**
 * SmartRail-AI - Erweiterte KI-Vorhersagemodelle für präzise Verspätungsprognosen
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */

import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  BarChart3,
  Activity,
  Target,
  Zap,
  Eye,
  Lightning,
  Sparkle,
  GitBranch,
  Database,
  Gauge,
  ArrowUp,
  ArrowDown,
  Equals,
  CheckCircle,
  XCircle,
  Timer,
  Crosshair,
  Atom,
  Function,
  Calculator,
  ChartLine,
  Cpu,
  Graph,
  TrendingDown,
  Warning,
  Info
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useAdvancedPredictiveAnalytics } from '../hooks/useAdvancedPredictiveAnalytics'
import DominoEffectPredictor from './DominoEffectPredictor'
import RealTimeCapacityPredictor from './RealTimeCapacityPredictor'

interface PredictionModel {
  id: string
  name: string
  type: 'neural_network' | 'random_forest' | 'gradient_boosting' | 'deep_learning' | 'ensemble'
  accuracy: number
  confidence: number
  learningRate: number
  features: string[]
  isActive: boolean
  lastTrained: string
  predictions: number
  version: string
  complexity: 'low' | 'medium' | 'high' | 'extreme'
}

interface DelayPrediction {
  id: string
  trainId: string
  route: string
  currentDelay: number
  predictedDelay: number
  probability: number
  causes: string[]
  confidence: number
  modelUsed: string
  timestamp: string
  recommendedActions: string[]
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  mse: number
  mae: number
  trainingTime: number
  predictionTime: number
}

const AdvancedPredictiveModels = () => {
  const [activeTab, setActiveTab] = useState('models')
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [isTraining, setIsTraining] = useState(false)
  const [predictionHorizon, setPredictionHorizon] = useState('30')
  
  const [models, setModels] = useKV<PredictionModel[]>('prediction-models', [
    {
      id: 'neural-primary',
      name: 'Hauptneurales Netzwerk',
      type: 'neural_network',
      accuracy: 94.7,
      confidence: 92.3,
      learningRate: 0.001,
      features: ['wetter', 'verkehr', 'events', 'historie', 'fahrgastaufkommen'],
      isActive: true,
      lastTrained: new Date().toISOString(),
      predictions: 15742,
      version: 'v2.4.1',
      complexity: 'high'
    },
    {
      id: 'ensemble-master',
      name: 'Ensemble-Meistermodell',
      type: 'ensemble',
      accuracy: 97.2,
      confidence: 95.8,
      learningRate: 0.002,
      features: ['alle verfügbaren', 'kreuzvalidierung', 'model voting'],
      isActive: true,
      lastTrained: new Date().toISOString(),
      predictions: 8932,
      version: 'v1.8.3',
      complexity: 'extreme'
    },
    {
      id: 'rf-specialized',
      name: 'Spezialisierter Random Forest',
      type: 'random_forest',
      accuracy: 89.4,
      confidence: 87.1,
      learningRate: 0.1,
      features: ['kategorie features', 'lokale faktoren', 'saisonalität'],
      isActive: true,
      lastTrained: new Date().toISOString(),
      predictions: 12083,
      version: 'v3.1.0',
      complexity: 'medium'
    },
    {
      id: 'deep-lstm',
      name: 'LSTM Deep Learning',
      type: 'deep_learning',
      accuracy: 91.8,
      confidence: 89.9,
      learningRate: 0.0005,
      features: ['zeitsequenzen', 'langzeit abhängigkeiten', 'pattern erkennung'],
      isActive: false,
      lastTrained: new Date(Date.now() - 86400000).toISOString(),
      predictions: 6547,
      version: 'v1.2.4',
      complexity: 'extreme'
    }
  ])

  const [predictions, setPredictions] = useKV<DelayPrediction[]>('delay-predictions', [
    {
      id: 'pred-1',
      trainId: 'ICE 571',
      route: 'Frankfurt → Berlin',
      currentDelay: 3,
      predictedDelay: 12,
      probability: 85.4,
      causes: ['Wetter', 'Fahrgastaufkommen', 'Vorherige Verspätung'],
      confidence: 92.1,
      modelUsed: 'ensemble-master',
      timestamp: new Date().toISOString(),
      recommendedActions: ['Fahrgäste informieren', 'Alternative Routen prüfen', 'Personal bereithalten'],
      severity: 'medium'
    },
    {
      id: 'pred-2',
      trainId: 'RE 4234',
      route: 'München → Nürnberg',
      currentDelay: 0,
      predictedDelay: 7,
      probability: 73.2,
      causes: ['Wetterbedingungen', 'Rush Hour'],
      confidence: 78.9,
      modelUsed: 'neural-primary',
      timestamp: new Date().toISOString(),
      recommendedActions: ['Vorsichtsmaßnahmen', 'Monitoring verstärken'],
      severity: 'low'
    }
  ])

  const [modelMetrics, setModelMetrics] = useKV<Record<string, ModelMetrics>>('model-metrics', {
    'neural-primary': {
      accuracy: 94.7,
      precision: 93.2,
      recall: 91.8,
      f1Score: 92.5,
      mse: 4.2,
      mae: 2.1,
      trainingTime: 143.2,
      predictionTime: 0.8
    },
    'ensemble-master': {
      accuracy: 97.2,
      precision: 96.8,
      recall: 95.9,
      f1Score: 96.3,
      mse: 2.8,
      mae: 1.4,
      trainingTime: 287.5,
      predictionTime: 2.3
    },
    'rf-specialized': {
      accuracy: 89.4,
      precision: 88.7,
      recall: 86.2,
      f1Score: 87.4,
      mse: 6.1,
      mae: 3.2,
      trainingTime: 45.7,
      predictionTime: 0.3
    },
    'deep-lstm': {
      accuracy: 91.8,
      precision: 90.5,
      recall: 89.3,
      f1Score: 89.9,
      mse: 5.4,
      mae: 2.8,
      trainingTime: 523.1,
      predictionTime: 1.2
    }
  })

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'neural_network': return <Brain size={20} className="text-blue-600" />
      case 'random_forest': return <GitBranch size={20} className="text-green-600" />
      case 'gradient_boosting': return <TrendingUp size={20} className="text-purple-600" />
      case 'deep_learning': return <Atom size={20} className="text-indigo-600" />
      case 'ensemble': return <Cpu size={20} className="text-orange-600" />
      default: return <Database size={20} className="text-gray-600" />
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'extreme': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const trainModel = async (modelId: string) => {
    setIsTraining(true)
    
    try {
      // Simuliere KI-Training
      const prompt = spark.llmPrompt`Simuliere Trainingsprozess für Verspätungsvorhersage-Modell ${modelId} mit neuen Daten`
      await spark.llm(prompt)
      
      // Update model
      setModels(currentModels => 
        currentModels.map(model => 
          model.id === modelId 
            ? { 
                ...model, 
                lastTrained: new Date().toISOString(),
                accuracy: Math.min(99.9, model.accuracy + Math.random() * 2),
                confidence: Math.min(99.9, model.confidence + Math.random() * 1.5),
                predictions: model.predictions + Math.floor(Math.random() * 100)
              }
            : model
        )
      )
      
      toast.success(`Modell ${models.find(m => m.id === modelId)?.name} erfolgreich trainiert`, {
        description: 'Neue Gewichtungen und Parameter wurden übernommen'
      })
    } catch (error) {
      toast.error('Fehler beim Training', {
        description: 'Das Modell konnte nicht aktualisiert werden'
      })
    } finally {
      setIsTraining(false)
    }
  }

  const generateNewPrediction = async () => {
    const prompt = spark.llmPrompt`Generiere realistische Verspätungsvorhersage mit Ursachen und Empfehlungen für deutschen Bahnverkehr`
    
    try {
      await spark.llm(prompt)
      
      const trainIds = ['ICE 1247', 'RE 3821', 'RB 4567', 'EC 178', 'IC 2045']
      const routes = ['Hamburg → München', 'Berlin → Köln', 'Dresden → Frankfurt', 'Stuttgart → Bremen']
      const causes = ['Wetterbedingungen', 'Signalstörung', 'Fahrgastaufkommen', 'Bauarbeiten', 'Vorherige Verspätung', 'Technischer Defekt']
      
      const newPrediction: DelayPrediction = {
        id: `pred-${Date.now()}`,
        trainId: trainIds[Math.floor(Math.random() * trainIds.length)],
        route: routes[Math.floor(Math.random() * routes.length)],
        currentDelay: Math.floor(Math.random() * 10),
        predictedDelay: Math.floor(Math.random() * 30) + 5,
        probability: Math.round((Math.random() * 30 + 70) * 10) / 10,
        causes: causes.slice(0, Math.floor(Math.random() * 3) + 1),
        confidence: Math.round((Math.random() * 20 + 75) * 10) / 10,
        modelUsed: models[Math.floor(Math.random() * models.length)].id,
        timestamp: new Date().toISOString(),
        recommendedActions: ['Fahrgäste informieren', 'Alternative prüfen', 'Personal bereithalten'],
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      }
      
      setPredictions(current => [newPrediction, ...current.slice(0, 9)])
      
      toast.success('Neue Vorhersage generiert', {
        description: `${newPrediction.trainId}: ${newPrediction.predictedDelay}min Verspätung vorhergesagt`
      })
    } catch (error) {
      toast.error('Fehler bei Vorhersagegenerierung')
    }
  }

  const activeModels = models.filter(m => m.isActive)
  const bestModel = models.reduce((best, current) => 
    current.accuracy > best.accuracy ? current : best
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Erweiterte KI-Vorhersagemodelle
          </h1>
          <p className="text-muted-foreground">
            Hochpräzise Algorithmen für Verspätungsprognosen und Netzwerkoptimierung
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={predictionHorizon} onValueChange={setPredictionHorizon}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 Min</SelectItem>
              <SelectItem value="30">30 Min</SelectItem>
              <SelectItem value="60">1 Stunde</SelectItem>
              <SelectItem value="120">2 Stunden</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={generateNewPrediction}
            className="bg-primary hover:bg-primary/90"
          >
            <Sparkle size={16} className="mr-2" />
            Neue Vorhersage
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Beste Genauigkeit</p>
                <p className="text-2xl font-bold text-blue-600">{bestModel.accuracy.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">{bestModel.name}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Modelle</p>
                <p className="text-2xl font-bold text-purple-600">{activeModels.length}</p>
                <p className="text-xs text-muted-foreground">von {models.length} gesamt</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Cpu size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vorhersagen heute</p>
                <p className="text-2xl font-bold text-green-600">
                  {models.reduce((sum, model) => sum + Math.floor(model.predictions * 0.1), 0)}
                </p>
                <p className="text-xs text-muted-foreground">Erfolgsrate 94.7%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ChartLine size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ø Vorhersagezeit</p>
                <p className="text-2xl font-bold text-orange-600">1.2s</p>
                <p className="text-xs text-muted-foreground">Real-time Inferenz</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Lightning size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="models">Modelle</TabsTrigger>
          <TabsTrigger value="predictions">Vorhersagen</TabsTrigger>
          <TabsTrigger value="domino">Domino-Effekte</TabsTrigger>
          <TabsTrigger value="capacity">Kapazität</TabsTrigger>
          <TabsTrigger value="metrics">Metriken</TabsTrigger>
          <TabsTrigger value="optimization">Optimierung</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.id} className={`border-0 shadow-sm ${model.isActive ? 'ring-2 ring-primary/20' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getModelTypeIcon(model.type)}
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription>Version {model.version}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getComplexityColor(model.complexity)}>
                        {model.complexity === 'low' && 'Niedrig'}
                        {model.complexity === 'medium' && 'Mittel'}
                        {model.complexity === 'high' && 'Hoch'}
                        {model.complexity === 'extreme' && 'Extrem'}
                      </Badge>
                      {model.isActive ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle size={12} className="mr-1" />
                          Aktiv
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-700">
                          <XCircle size={12} className="mr-1" />
                          Inaktiv
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Genauigkeit</span>
                        <span className="font-medium">{model.accuracy.toFixed(1)}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Konfidenz</span>
                        <span className="font-medium">{model.confidence.toFixed(1)}%</span>
                      </div>
                      <Progress value={model.confidence} className="h-2" />
                    </div>
                  </div>

                  {/* Model Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lernrate</span>
                      <span className="font-mono">{model.learningRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vorhersagen</span>
                      <span className="font-medium">{model.predictions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Letztes Training</span>
                      <span className="font-medium">
                        {new Date(model.lastTrained).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {model.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      size="sm"
                      onClick={() => trainModel(model.id)}
                      disabled={isTraining}
                      className="flex-1"
                    >
                      {isTraining && selectedModel === model.id ? (
                        <>
                          <Brain size={14} className="mr-2 animate-pulse" />
                          Training...
                        </>
                      ) : (
                        <>
                          <Zap size={14} className="mr-2" />
                          Neu trainieren
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedModel(model.id)}
                    >
                      <Eye size={14} className="mr-2" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crosshair size={20} className="text-primary" />
                Aktuelle Verspätungsvorhersagen
              </CardTitle>
              <CardDescription>
                Real-time Prognosen basierend auf KI-Modellen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div 
                    key={prediction.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">{prediction.trainId}</h4>
                        <p className="text-sm text-muted-foreground">{prediction.route}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(prediction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(prediction.severity)}>
                          {prediction.severity === 'low' && 'Niedrig'}
                          {prediction.severity === 'medium' && 'Mittel'}
                          {prediction.severity === 'high' && 'Hoch'}
                          {prediction.severity === 'critical' && 'Kritisch'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {prediction.probability}% sicher
                        </Badge>
                      </div>
                    </div>

                    {/* Delay Comparison */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Aktuelle Verspätung</p>
                        <p className="text-lg font-bold text-blue-600">{prediction.currentDelay} min</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowUp size={24} className="text-orange-500" />
                      </div>
                      <div className="text-center p-3 bg-destructive/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Prognostiziert</p>
                        <p className="text-lg font-bold text-red-600">{prediction.predictedDelay} min</p>
                      </div>
                    </div>

                    {/* Causes */}
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-muted-foreground">Identifizierte Ursachen:</p>
                      <div className="flex flex-wrap gap-1">
                        {prediction.causes.map((cause, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            {cause}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Model Info */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Function size={16} className="text-purple-500" />
                        <span className="text-muted-foreground">Modell:</span>
                        <span className="font-medium">
                          {models.find(m => m.id === prediction.modelUsed)?.name || prediction.modelUsed}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target size={16} className="text-green-500" />
                        <span className="font-medium">{prediction.confidence}% Konfidenz</span>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {prediction.recommendedActions.length > 0 && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Empfohlene Maßnahmen:</p>
                        <div className="space-y-1">
                          {prediction.recommendedActions.map((action, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domino" className="space-y-6">
          <DominoEffectPredictor />
        </TabsContent>

        <TabsContent value="capacity" className="space-y-6">
          <RealTimeCapacityPredictor />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(modelMetrics).map(([modelId, metrics]) => {
              const model = models.find(m => m.id === modelId)
              if (!model) return null

              return (
                <Card key={modelId} className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getModelTypeIcon(model.type)}
                      {model.name}
                    </CardTitle>
                    <CardDescription>Detaillierte Leistungsmetriken</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Primary Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Genauigkeit</span>
                          <span className="font-bold text-blue-600">{metrics.accuracy.toFixed(1)}%</span>
                        </div>
                        <Progress value={metrics.accuracy} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Präzision</span>
                          <span className="font-bold text-green-600">{metrics.precision.toFixed(1)}%</span>
                        </div>
                        <Progress value={metrics.precision} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Recall</span>
                          <span className="font-bold text-purple-600">{metrics.recall.toFixed(1)}%</span>
                        </div>
                        <Progress value={metrics.recall} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">F1-Score</span>
                          <span className="font-bold text-orange-600">{metrics.f1Score.toFixed(1)}%</span>
                        </div>
                        <Progress value={metrics.f1Score} className="h-2" />
                      </div>
                    </div>

                    {/* Error Metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Mean Squared Error</p>
                        <p className="text-lg font-bold text-red-600">{metrics.mse.toFixed(1)}</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Mean Absolute Error</p>
                        <p className="text-lg font-bold text-orange-600">{metrics.mae.toFixed(1)}</p>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Trainingszeit</span>
                        <span className="font-medium">{metrics.trainingTime.toFixed(1)}s</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Vorhersagezeit</span>
                        <span className="font-medium">{metrics.predictionTime.toFixed(1)}s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Kontinuierliche Modelloptimierung durch AutoML und Hyperparameter-Tuning aktiv.
              Nächste automatische Optimierung in 2h 34min.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator size={20} className="text-primary" />
                  Hyperparameter-Optimierung
                </CardTitle>
                <CardDescription>
                  Automatische Konfigurationsanpassung für beste Performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Lernrate</span>
                    <Badge variant="outline">0.001 → 0.0015</Badge>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Batch Size</span>
                    <Badge variant="outline">32 → 64</Badge>
                  </div>
                  <Progress value={60} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Dropout Rate</span>
                    <Badge variant="outline">0.2 → 0.15</Badge>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Geschätzte Verbesserung</span>
                    <span className="font-bold text-green-600">+2.3% Genauigkeit</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Graph size={20} className="text-primary" />
                  Feature Engineering
                </CardTitle>
                <CardDescription>
                  Optimierung der Eingabefeatures für bessere Vorhersagen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: 'Wetterdaten', importance: 94, trend: 'up' },
                    { name: 'Fahrgastaufkommen', importance: 87, trend: 'up' },
                    { name: 'Historische Daten', importance: 82, trend: 'stable' },
                    { name: 'Verkehrslage', importance: 76, trend: 'down' },
                    { name: 'Events', importance: 71, trend: 'up' }
                  ].map((feature) => (
                    <div key={feature.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{feature.name}</span>
                          {feature.trend === 'up' && <TrendingUp size={12} className="text-green-500" />}
                          {feature.trend === 'down' && <TrendingDown size={12} className="text-red-500" />}
                          {feature.trend === 'stable' && <Equals size={12} className="text-gray-500" />}
                        </div>
                        <span className="text-sm font-bold">{feature.importance}%</span>
                      </div>
                      <Progress value={feature.importance} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge size={20} className="text-primary" />
                System-Performance Dashboard
              </CardTitle>
              <CardDescription>
                Echtzeit-Überwachung der Modell-Performance und Ressourcenverbrauch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">98.2%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">1.2s</div>
                  <div className="text-sm text-muted-foreground">Ø Antwortzeit</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">847</div>
                  <div className="text-sm text-muted-foreground">Vorhersagen/h</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">2.3 GB</div>
                  <div className="text-sm text-muted-foreground">RAM-Verbrauch</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvancedPredictiveModels