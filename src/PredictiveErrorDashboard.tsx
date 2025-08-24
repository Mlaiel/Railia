/**
 * SmartRail-AI Predictive Error Dashboard
 * 
 * Dashboard für ML-basierte Fehlervorhersage und proaktive Systemdiagnose
 * © 2024 Fahed Mlaiel - mlaiel@live.de
 */

import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { SmartRailErrorBoundary } from '@/components/SmartRailErrorBoundary'
import { 
  Brain, 
  TrendUp, 
  AlertTriangle, 
  Activity, 
  Target, 
  Cpu, 
  Database, 
  RefreshCw,
  Eye,
  BarChart3,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Play,
  Pause,
  ChartLine,
  ThermometerSimple,
  HardDrive
} from '@phosphor-icons/react'
import { 
  predictiveErrorML, 
  FailurePrediction, 
  SystemMetrics 
} from '@/utils/predictiveErrorML'
import { errorHandler } from '@/utils/errorHandling'

interface MLPredictionCardProps {
  prediction: FailurePrediction
  onDismiss: (id: string) => void
  onTakeAction: (id: string, action: string) => void
}

const MLPredictionCard = ({ prediction, onDismiss, onTakeAction }: MLPredictionCardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-blue-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SYSTEM_FAILURE': return <AlertTriangle size={20} />
      case 'PERFORMANCE_DEGRADATION': return <TrendUp size={20} />
      case 'COMPONENT_FAILURE': return <Cpu size={20} />
      default: return <Brain size={20} />
    }
  }

  return (
    <Card className="border-l-4 border-l-orange-500 mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${getSeverityColor(prediction.severity)} text-white`}>
              {getTypeIcon(prediction.predictionType)}
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">
                {prediction.predictionType === 'SYSTEM_FAILURE' ? 'Systemausfall-Vorhersage' :
                 prediction.predictionType === 'PERFORMANCE_DEGRADATION' ? 'Performance-Degradation' :
                 'Komponenten-Ausfall'}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Clock size={14} />
                In {prediction.timeToFailure} Minuten erwartet
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={prediction.severity === 'critical' ? 'destructive' : 'secondary'}>
              {Math.round(prediction.probability * 100)}% Wahrscheinlichkeit
            </Badge>
            <Badge variant="outline" className="text-xs">
              Konfidenz: {Math.round(prediction.confidence * 100)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Betroffene Komponenten */}
        <div>
          <h4 className="text-sm font-medium mb-2">Betroffene Komponenten:</h4>
          <div className="flex flex-wrap gap-2">
            {prediction.affectedComponents.map((component, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {component}
              </Badge>
            ))}
          </div>
        </div>

        {/* Trigger Metriken */}
        <div>
          <h4 className="text-sm font-medium mb-2">Auslöser-Metriken:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(prediction.triggerMetrics).map(([key, value]) => (
              <div key={key} className="flex justify-between p-2 bg-muted/50 rounded">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-mono">{typeof value === 'number' ? value.toFixed(2) : value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Empfohlene Aktionen */}
        <div>
          <h4 className="text-sm font-medium mb-2">Empfohlene Aktionen:</h4>
          <div className="space-y-2">
            {prediction.recommendedActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <span className="text-sm">{action}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onTakeAction(prediction.id, action)}
                  className="text-xs h-6 px-2"
                >
                  Ausführen
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Aktionen */}
        <div className="flex gap-2 pt-2 border-t">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDismiss(prediction.id)}
            className="flex-1"
          >
            Verwerfen
          </Button>
          <Button 
            size="sm" 
            variant="default"
            onClick={() => onTakeAction(prediction.id, 'investigate')}
            className="flex-1"
          >
            Untersuchen
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface SystemMetricsDisplayProps {
  metrics: SystemMetrics | null
}

const SystemMetricsDisplay = ({ metrics }: SystemMetricsDisplayProps) => {
  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Activity size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Keine aktuellen Metriken verfügbar</p>
        </CardContent>
      </Card>
    )
  }

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'text-red-600 bg-red-50'
    if (usage >= 70) return 'text-orange-600 bg-orange-50'
    if (usage >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* CPU Auslastung */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Cpu size={20} className="text-primary" />
            <CardTitle className="text-sm">CPU-Auslastung</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{metrics.cpuUsage.toFixed(1)}%</span>
              <Badge className={`${getUsageColor(metrics.cpuUsage)} border-0`}>
                {metrics.cpuUsage >= 90 ? 'Kritisch' : 
                 metrics.cpuUsage >= 70 ? 'Hoch' : 
                 metrics.cpuUsage >= 50 ? 'Mittel' : 'Normal'}
              </Badge>
            </div>
            <Progress value={metrics.cpuUsage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Speicher */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-primary" />
            <CardTitle className="text-sm">Speicher-Auslastung</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{metrics.memoryUsage.toFixed(1)}%</span>
              <Badge className={`${getUsageColor(metrics.memoryUsage)} border-0`}>
                {metrics.memoryUsage >= 95 ? 'Kritisch' : 
                 metrics.memoryUsage >= 80 ? 'Hoch' : 'Normal'}
              </Badge>
            </div>
            <Progress value={metrics.memoryUsage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Netzwerk Latenz */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            <CardTitle className="text-sm">Netzwerk-Latenz</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{metrics.networkLatency.toFixed(0)}ms</span>
              <Badge className={`${metrics.networkLatency > 1000 ? 'text-red-600 bg-red-50' : 
                                  metrics.networkLatency > 500 ? 'text-orange-600 bg-orange-50' : 
                                  'text-green-600 bg-green-50'} border-0`}>
                {metrics.networkLatency > 1000 ? 'Hoch' : 
                 metrics.networkLatency > 500 ? 'Mittel' : 'Niedrig'}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {metrics.activeConnections} aktive Verbindungen
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fehlerrate */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-primary" />
            <CardTitle className="text-sm">Fehlerrate</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{metrics.errorRate.toFixed(1)}</span>
              <Badge className={`${metrics.errorRate > 10 ? 'text-red-600 bg-red-50' : 
                                  metrics.errorRate > 5 ? 'text-orange-600 bg-orange-50' : 
                                  'text-green-600 bg-green-50'} border-0`}>
                {metrics.errorRate > 10 ? 'Hoch' : 
                 metrics.errorRate > 5 ? 'Mittel' : 'Niedrig'}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Fehler pro Minute
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Antwortzeit */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            <CardTitle className="text-sm">Antwortzeit</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{metrics.responseTime.toFixed(0)}ms</span>
              <Badge className={`${metrics.responseTime > 5000 ? 'text-red-600 bg-red-50' : 
                                  metrics.responseTime > 2000 ? 'text-orange-600 bg-orange-50' : 
                                  'text-green-600 bg-green-50'} border-0`}>
                {metrics.responseTime > 5000 ? 'Langsam' : 
                 metrics.responseTime > 2000 ? 'Mittel' : 'Schnell'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System-Temperatur */}
      {metrics.temperature && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ThermometerSimple size={20} className="text-primary" />
              <CardTitle className="text-sm">System-Temperatur</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{metrics.temperature.toFixed(1)}°C</span>
                <Badge className={`${metrics.temperature > 80 ? 'text-red-600 bg-red-50' : 
                                    metrics.temperature > 70 ? 'text-orange-600 bg-orange-50' : 
                                    'text-green-600 bg-green-50'} border-0`}>
                  {metrics.temperature > 80 ? 'Heiß' : 
                   metrics.temperature > 70 ? 'Warm' : 'Normal'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function PredictiveErrorDashboard() {
  const [predictions, setPredictions] = useKV<FailurePrediction[]>('ml-predictions', [])
  const [currentMetrics, setCurrentMetrics] = useState<SystemMetrics | null>(null)
  const [isMLActive, setIsMLActive] = useKV('ml-system-active', true)
  const [isTraining, setIsTraining] = useState(false)
  const [modelPerformance, setModelPerformance] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    lastTraining: null as Date | null,
    dataPoints: 0
  })

  // ML-System initialisieren
  useEffect(() => {
    const initializeMLSystem = async () => {
      try {
        if (isMLActive) {
          await predictiveErrorML.initialize()
          toast.success('ML-System erfolgreich initialisiert', {
            description: 'Predictive Error Detection aktiv',
            duration: 3000
          })
        }
      } catch (error) {
        errorHandler.handleError(error, 'AI_PROCESSING', 'PredictiveErrorDashboard')
        toast.error('ML-System Initialisierung fehlgeschlagen')
      }
    }

    initializeMLSystem()
  }, [isMLActive])

  // Regelmäßige Updates
  useEffect(() => {
    if (!isMLActive) return

    const updateInterval = setInterval(async () => {
      try {
        // Aktuelle Vorhersagen abrufen
        const newPredictions = await predictiveErrorML.predictFailures()
        setPredictions(newPredictions)

        // Modell-Performance aktualisieren
        const performance = predictiveErrorML.getModelPerformance()
        setModelPerformance(performance)

      } catch (error) {
        errorHandler.handleError(error, 'AI_PROCESSING', 'PredictiveErrorUpdate')
      }
    }, 30000) // Alle 30 Sekunden

    return () => clearInterval(updateInterval)
  }, [isMLActive, setPredictions])

  // Metriken-Simulation (in echter Implementierung würden echte Metriken kommen)
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      const simulatedMetrics: SystemMetrics = {
        timestamp: new Date(),
        cpuUsage: Math.random() * 100,
        memoryUsage: 60 + Math.random() * 35,
        networkLatency: 10 + Math.random() * 200,
        activeConnections: Math.floor(200 + Math.random() * 100),
        errorRate: Math.random() * 8,
        responseTime: 100 + Math.random() * 500,
        temperature: 45 + Math.random() * 30,
        diskUsage: 60 + Math.random() * 30
      }

      setCurrentMetrics(simulatedMetrics)
      
      if (isMLActive) {
        predictiveErrorML.addSystemMetrics(simulatedMetrics)
      }
    }, 60000) // Jede Minute

    // Sofortige erste Metriken
    const initialMetrics: SystemMetrics = {
      timestamp: new Date(),
      cpuUsage: 45 + Math.random() * 30,
      memoryUsage: 65 + Math.random() * 20,
      networkLatency: 15 + Math.random() * 50,
      activeConnections: 245,
      errorRate: Math.random() * 3,
      responseTime: 150 + Math.random() * 200,
      temperature: 52 + Math.random() * 15,
      diskUsage: 68 + Math.random() * 15
    }
    setCurrentMetrics(initialMetrics)

    return () => clearInterval(metricsInterval)
  }, [isMLActive])

  const handleDismissPrediction = useCallback((predictionId: string) => {
    setPredictions(prev => prev.filter(p => p.id !== predictionId))
    toast.info('Vorhersage verworfen')
  }, [setPredictions])

  const handleTakeAction = useCallback(async (predictionId: string, action: string) => {
    try {
      toast.loading('Führe Aktion aus...', { id: predictionId })
      
      // Simuliere Aktionsausführung
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Aktion "${action}" erfolgreich ausgeführt`, {
        id: predictionId,
        duration: 3000
      })

      // Vorhersage als bearbeitet markieren
      setPredictions(prev => prev.filter(p => p.id !== predictionId))
      
    } catch (error) {
      toast.error('Aktion fehlgeschlagen', { id: predictionId })
      errorHandler.handleError(error, 'AI_PROCESSING', 'PredictiveAction')
    }
  }, [setPredictions])

  const handleTrainModels = useCallback(async () => {
    try {
      setIsTraining(true)
      toast.loading('Trainiere ML-Modelle...', { id: 'training' })
      
      const success = await predictiveErrorML.trainModels()
      
      if (success) {
        toast.success('ML-Training erfolgreich abgeschlossen', {
          id: 'training',
          duration: 5000
        })
        
        // Performance neu laden
        const performance = predictiveErrorML.getModelPerformance()
        setModelPerformance(performance)
      } else {
        toast.error('ML-Training fehlgeschlagen', { id: 'training' })
      }
      
    } catch (error) {
      toast.error('Training-Fehler', { id: 'training' })
      errorHandler.handleError(error, 'AI_PROCESSING', 'MLTraining')
    } finally {
      setIsTraining(false)
    }
  }, [])

  const toggleMLSystem = useCallback(() => {
    setIsMLActive(prev => !prev)
    toast.info(isMLActive ? 'ML-System deaktiviert' : 'ML-System aktiviert')
  }, [isMLActive, setIsMLActive])

  return (
    <SmartRailErrorBoundary level="module" componentName="PredictiveErrorDashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Brain size={28} className="text-primary" />
              </div>
              Predictive Error ML System
            </h1>
            <p className="text-muted-foreground mt-1">
              Machine Learning-basierte Vorhersage kritischer Systemfehler
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={isMLActive ? "destructive" : "default"}
              onClick={toggleMLSystem}
              className="flex items-center gap-2"
            >
              {isMLActive ? <Pause size={16} /> : <Play size={16} />}
              {isMLActive ? 'ML Stoppen' : 'ML Starten'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleTrainModels}
              disabled={isTraining || !isMLActive}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={isTraining ? 'animate-spin' : ''} />
              {isTraining ? 'Trainiert...' : 'Modelle Trainieren'}
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${isMLActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  <Brain size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{isMLActive ? 'Aktiv' : 'Inaktiv'}</div>
                  <div className="text-sm text-muted-foreground">ML-System Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Target size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{predictions.length}</div>
                  <div className="text-sm text-muted-foreground">Aktive Vorhersagen</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(modelPerformance.accuracy * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Modell-Genauigkeit</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                  <Database size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{modelPerformance.dataPoints}</div>
                  <div className="text-sm text-muted-foreground">Datenpunkte</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ML System nicht aktiv Warnung */}
        {!isMLActive && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Das ML-System ist derzeit deaktiviert. Aktivieren Sie es, um Fehlervorhersagen zu erhalten.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions">Vorhersagen</TabsTrigger>
            <TabsTrigger value="metrics">System-Metriken</TabsTrigger>
            <TabsTrigger value="performance">Modell-Performance</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          {/* Vorhersagen Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Aktuelle Fehlervorhersagen</h2>
              <Badge variant="outline" className="font-mono">
                {predictions.length} aktiv
              </Badge>
            </div>

            {predictions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-green-700 mb-2">Keine kritischen Vorhersagen</h3>
                  <p className="text-muted-foreground">
                    Das ML-System hat derzeit keine kritischen Systemfehler vorhergesagt.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {predictions
                  .sort((a, b) => b.probability - a.probability)
                  .map(prediction => (
                    <SmartRailErrorBoundary key={prediction.id} level="component" componentName="MLPredictionCard">
                      <MLPredictionCard
                        prediction={prediction}
                        onDismiss={handleDismissPrediction}
                        onTakeAction={handleTakeAction}
                      />
                    </SmartRailErrorBoundary>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* System-Metriken Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Aktuelle System-Metriken</h2>
              <Badge variant="outline" className="font-mono">
                Live-Überwachung
              </Badge>
            </div>
            
            <SmartRailErrorBoundary level="component" componentName="SystemMetricsDisplay">
              <SystemMetricsDisplay metrics={currentMetrics} />
            </SmartRailErrorBoundary>
          </TabsContent>

          {/* Modell-Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">ML-Modell Performance</h2>
              <Button variant="outline" onClick={handleTrainModels} disabled={isTraining}>
                <RefreshCw size={16} className={`mr-2 ${isTraining ? 'animate-spin' : ''}`} />
                {isTraining ? 'Training läuft...' : 'Neu trainieren'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target size={16} />
                    Genauigkeit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round(modelPerformance.accuracy * 100)}%
                  </div>
                  <Progress value={modelPerformance.accuracy * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye size={16} />
                    Präzision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(modelPerformance.precision * 100)}%
                  </div>
                  <Progress value={modelPerformance.precision * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield size={16} />
                    Recall
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round(modelPerformance.recall * 100)}%
                  </div>
                  <Progress value={modelPerformance.recall * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ChartLine size={16} />
                    F1-Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {Math.round(modelPerformance.f1Score * 100)}%
                  </div>
                  <Progress value={modelPerformance.f1Score * 100} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Training-Informationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Letztes Training</div>
                    <div className="font-mono text-sm">
                      {modelPerformance.lastTraining 
                        ? modelPerformance.lastTraining.toLocaleString()
                        : 'Noch nicht trainiert'
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Verfügbare Datenpunkte</div>
                    <div className="font-mono text-sm">{modelPerformance.dataPoints.toLocaleString()}</div>
                  </div>
                </div>
                
                {modelPerformance.dataPoints < 100 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Nicht genügend Trainingsdaten verfügbar. Mindestens 100 Datenpunkte erforderlich für zuverlässige Vorhersagen.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Einstellungen Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">ML-System Einstellungen</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings size={20} />
                    System-Konfiguration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ML-System Status</span>
                      <Badge variant={isMLActive ? "default" : "secondary"}>
                        {isMLActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Vorhersage-Horizont</span>
                      <span className="text-sm font-mono">30 Minuten</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Konfidenz-Schwellenwert</span>
                      <span className="text-sm font-mono">70%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Retraining-Intervall</span>
                      <span className="text-sm font-mono">6 Stunden</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain size={20} />
                    Aktive ML-Modelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Neural Network (System)',
                    'LSTM (Netzwerk)',
                    'Random Forest (KI)',
                    'Gradient Boosting (Drohnen)',
                    'Anomaly Detection (Sensoren)'
                  ].map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                      <span className="text-sm">{model}</span>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle size={12} className="mr-1" />
                        Aktiv
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SmartRailErrorBoundary>
  )
}