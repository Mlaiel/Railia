import React, { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Brain, 
  TrendUp, 
  Cpu, 
  Settings, 
  PlayCircle, 
  PauseCircle,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Zap,
  Target,
  Database,
  Gauge,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from '@phosphor-icons/react';

interface AlgorithmPerformance {
  algorithmId: string;
  algorithmName: string;
  accuracy: number;
  efficiency: number;
  responseTime: number;
  errorRate: number;
  confidence: number;
  trainingIterations: number;
  lastOptimized: string;
  status: 'optimizing' | 'stable' | 'degraded' | 'improving';
}

interface OptimizationResult {
  algorithmId: string;
  oldPerformance: number;
  newPerformance: number;
  improvement: number;
  timestamp: string;
  parameters: Record<string, any>;
}

interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
  learningRate: number;
}

const MachineLearningOptimizer: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  
  const [algorithms, setAlgorithms] = useKV<AlgorithmPerformance[]>('ml-algorithms', [
    {
      algorithmId: 'door-prediction',
      algorithmName: 'Tür-Vorhersage-Algorithmus',
      accuracy: 94.2,
      efficiency: 89.1,
      responseTime: 125,
      errorRate: 2.1,
      confidence: 96.8,
      trainingIterations: 1247,
      lastOptimized: new Date(Date.now() - 3600000).toISOString(),
      status: 'stable'
    },
    {
      algorithmId: 'intrusion-detection',
      algorithmName: 'Eindringlingserkennung',
      accuracy: 97.8,
      efficiency: 91.5,
      responseTime: 89,
      errorRate: 1.2,
      confidence: 98.1,
      trainingIterations: 2156,
      lastOptimized: new Date(Date.now() - 7200000).toISOString(),
      status: 'improving'
    },
    {
      algorithmId: 'weather-prediction',
      algorithmName: 'Wettervorhersage-KI',
      accuracy: 91.6,
      efficiency: 87.3,
      responseTime: 201,
      errorRate: 3.4,
      confidence: 94.2,
      trainingIterations: 891,
      lastOptimized: new Date(Date.now() - 14400000).toISOString(),
      status: 'degraded'
    },
    {
      algorithmId: 'network-optimization',
      algorithmName: 'Netzwerk-Optimierung',
      accuracy: 96.1,
      efficiency: 93.7,
      responseTime: 156,
      errorRate: 1.8,
      confidence: 97.3,
      trainingIterations: 1834,
      lastOptimized: new Date(Date.now() - 1800000).toISOString(),
      status: 'optimizing'
    },
    {
      algorithmId: 'medical-emergency',
      algorithmName: 'Notfall-Erkennung',
      accuracy: 93.4,
      efficiency: 88.9,
      responseTime: 142,
      errorRate: 2.7,
      confidence: 95.6,
      trainingIterations: 967,
      lastOptimized: new Date(Date.now() - 10800000).toISOString(),
      status: 'stable'
    }
  ]);

  const [optimizationResults, setOptimizationResults] = useKV<OptimizationResult[]>('optimization-results', []);
  const [trainingMetrics, setTrainingMetrics] = useKV<TrainingMetrics[]>('training-metrics', []);
  const [autoOptimizationEnabled, setAutoOptimizationEnabled] = useKV('auto-optimization', true);
  const [optimizationSettings, setOptimizationSettings] = useKV('optimization-settings', {
    minAccuracyThreshold: 90,
    maxResponseTime: 200,
    retrainingInterval: 24, // hours
    performanceThreshold: 5 // % decrease to trigger retraining
  });

  // Simulate real-time training metrics
  useEffect(() => {
    if (!isOptimizing) return;

    const interval = setInterval(() => {
      const newMetric: TrainingMetrics = {
        epoch: trainingMetrics.length + 1,
        loss: Math.max(0.1, Math.random() * 0.5 + 0.1),
        accuracy: Math.min(99.5, 85 + Math.random() * 10 + trainingMetrics.length * 0.1),
        validationLoss: Math.max(0.1, Math.random() * 0.6 + 0.15),
        validationAccuracy: Math.min(98, 83 + Math.random() * 8 + trainingMetrics.length * 0.12),
        learningRate: 0.001 * Math.pow(0.95, Math.floor(trainingMetrics.length / 10))
      };

      setTrainingMetrics(prev => [...prev.slice(-49), newMetric]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isOptimizing, trainingMetrics.length]);

  // Auto-optimization monitoring
  useEffect(() => {
    if (!autoOptimizationEnabled) return;

    const interval = setInterval(() => {
      algorithms.forEach(algorithm => {
        // Check if algorithm needs optimization
        const timeSinceLastOptimization = Date.now() - new Date(algorithm.lastOptimized).getTime();
        const hoursElapsed = timeSinceLastOptimization / (1000 * 60 * 60);
        
        if (hoursElapsed >= optimizationSettings.retrainingInterval || 
            algorithm.accuracy < optimizationSettings.minAccuracyThreshold ||
            algorithm.responseTime > optimizationSettings.maxResponseTime) {
          
          // Trigger automatic optimization
          if (algorithm.status !== 'optimizing') {
            optimizeAlgorithm(algorithm.algorithmId, true);
          }
        }
      });
    }, 300000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [algorithms, autoOptimizationEnabled, optimizationSettings]);

  const optimizeAlgorithm = async (algorithmId: string, isAutomatic = false) => {
    const algorithm = algorithms.find(a => a.algorithmId === algorithmId);
    if (!algorithm) return;

    setIsOptimizing(true);
    setSelectedAlgorithm(algorithmId);

    // Update algorithm status
    setAlgorithms(prev => prev.map(a => 
      a.algorithmId === algorithmId 
        ? { ...a, status: 'optimizing' as const }
        : a
    ));

    toast.info(`Optimierung von ${algorithm.algorithmName} gestartet`, {
      duration: 3000
    });

    // Simulate optimization process
    const optimizationDuration = 15000; // 15 seconds for demo
    const startTime = Date.now();

    // Generate training metrics during optimization
    setTrainingMetrics([]);

    setTimeout(async () => {
      // Generate optimization results
      const oldAccuracy = algorithm.accuracy;
      const improvement = Math.random() * 8 + 2; // 2-10% improvement
      const newAccuracy = Math.min(99.5, oldAccuracy + improvement);
      const newEfficiency = Math.min(99, algorithm.efficiency + Math.random() * 5 + 1);
      const newResponseTime = Math.max(50, algorithm.responseTime - Math.random() * 30 - 10);
      const newErrorRate = Math.max(0.1, algorithm.errorRate - Math.random() * 1.5 - 0.5);

      // Record optimization result
      const result: OptimizationResult = {
        algorithmId,
        oldPerformance: oldAccuracy,
        newPerformance: newAccuracy,
        improvement: newAccuracy - oldAccuracy,
        timestamp: new Date().toISOString(),
        parameters: {
          learningRate: 0.001 * (0.8 + Math.random() * 0.4),
          batchSize: Math.floor(Math.random() * 64) + 32,
          epochs: Math.floor(Math.random() * 50) + 50,
          hiddenLayers: Math.floor(Math.random() * 3) + 2,
          dropout: Math.random() * 0.3 + 0.1
        }
      };

      setOptimizationResults(prev => [result, ...prev.slice(0, 9)]);

      // Update algorithm performance
      setAlgorithms(prev => prev.map(a => 
        a.algorithmId === algorithmId 
          ? { 
              ...a, 
              accuracy: newAccuracy,
              efficiency: newEfficiency,
              responseTime: newResponseTime,
              errorRate: newErrorRate,
              confidence: Math.min(99, algorithm.confidence + 1),
              trainingIterations: algorithm.trainingIterations + Math.floor(Math.random() * 100) + 50,
              lastOptimized: new Date().toISOString(),
              status: 'stable' as const
            }
          : a
      ));

      setIsOptimizing(false);
      setSelectedAlgorithm('');

      toast.success(`${algorithm.algorithmName} erfolgreich optimiert! Genauigkeit verbessert um ${improvement.toFixed(1)}%`, {
        duration: 5000
      });

    }, optimizationDuration);
  };

  const getStatusColor = (status: AlgorithmPerformance['status']) => {
    switch (status) {
      case 'optimizing': return 'bg-blue-500';
      case 'stable': return 'bg-green-500';
      case 'degraded': return 'bg-red-500';
      case 'improving': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: AlgorithmPerformance['status']) => {
    switch (status) {
      case 'optimizing': return 'Optimiert';
      case 'stable': return 'Stabil';
      case 'degraded': return 'Verschlechtert';
      case 'improving': return 'Verbessert sich';
      default: return 'Unbekannt';
    }
  };

  const getTrendIcon = (current: number, baseline: number) => {
    if (current > baseline + 1) return <ArrowUp size={14} className="text-green-600" />;
    if (current < baseline - 1) return <ArrowDown size={14} className="text-red-600" />;
    return <Minus size={14} className="text-yellow-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Brain size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Maschinelles Lernen Optimierer</h1>
            <p className="text-muted-foreground">Automatische Algorithmus-Optimierung mit KI</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={autoOptimizationEnabled ? "default" : "outline"}
            onClick={() => setAutoOptimizationEnabled(prev => !prev)}
            className="flex items-center gap-2"
          >
            {autoOptimizationEnabled ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
            Auto-Optimierung {autoOptimizationEnabled ? 'Aktiv' : 'Pausiert'}
          </Button>
        </div>
      </div>

      {/* System Status Alert */}
      {isOptimizing && (
        <Alert className="border-blue-200 bg-blue-50">
          <Cpu className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <span>Optimierung läuft für: {algorithms.find(a => a.algorithmId === selectedAlgorithm)?.algorithmName}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Training aktiv</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="algorithms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="algorithms">Algorithmen</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="results">Ergebnisse</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="algorithms" className="space-y-4">
          <div className="grid gap-4">
            {algorithms.map((algorithm) => (
              <Card key={algorithm.algorithmId} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Target size={16} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{algorithm.algorithmName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(algorithm.status)}`}></div>
                          {getStatusText(algorithm.status)}
                          <span className="text-xs">•</span>
                          <span className="text-xs">
                            Letztes Training: {new Date(algorithm.lastOptimized).toLocaleString()}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {algorithm.trainingIterations} Iterationen
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => optimizeAlgorithm(algorithm.algorithmId)}
                        disabled={isOptimizing || algorithm.status === 'optimizing'}
                        className="flex items-center gap-1"
                      >
                        <Zap size={14} />
                        Optimieren
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Genauigkeit</span>
                        {getTrendIcon(algorithm.accuracy, 90)}
                      </div>
                      <div className="space-y-1">
                        <Progress value={algorithm.accuracy} className="h-2" />
                        <p className="text-lg font-bold text-primary">{algorithm.accuracy.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Effizienz</span>
                        {getTrendIcon(algorithm.efficiency, 85)}
                      </div>
                      <div className="space-y-1">
                        <Progress value={algorithm.efficiency} className="h-2" />
                        <p className="text-lg font-bold text-green-600">{algorithm.efficiency.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Antwortzeit</span>
                        {getTrendIcon(200 - algorithm.responseTime, 100)}
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${Math.min(100, (300 - algorithm.responseTime) / 3)}%` }}
                          />
                        </div>
                        <p className="text-lg font-bold text-blue-600">{algorithm.responseTime}ms</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Fehlerrate</span>
                        {getTrendIcon(10 - algorithm.errorRate, 5)}
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 transition-all duration-300"
                            style={{ width: `${algorithm.errorRate * 10}%` }}
                          />
                        </div>
                        <p className="text-lg font-bold text-red-600">{algorithm.errorRate.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Vertrauen</span>
                        {getTrendIcon(algorithm.confidence, 95)}
                      </div>
                      <div className="space-y-1">
                        <Progress value={algorithm.confidence} className="h-2" />
                        <p className="text-lg font-bold text-purple-600">{algorithm.confidence.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          {isOptimizing ? (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity size={20} className="text-primary" />
                    Live Training Metriken
                  </CardTitle>
                  <CardDescription>
                    Echtzeit-Überwachung des Optimierungsprozesses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {trainingMetrics.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Epoch</span>
                        <p className="text-2xl font-bold text-primary">
                          {trainingMetrics[trainingMetrics.length - 1]?.epoch || 0}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Verlust</span>
                        <p className="text-2xl font-bold text-red-600">
                          {trainingMetrics[trainingMetrics.length - 1]?.loss.toFixed(4) || '0.0000'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Genauigkeit</span>
                        <p className="text-2xl font-bold text-green-600">
                          {trainingMetrics[trainingMetrics.length - 1]?.accuracy.toFixed(1) || '0.0'}%
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Lernrate</span>
                        <p className="text-2xl font-bold text-blue-600">
                          {trainingMetrics[trainingMetrics.length - 1]?.learningRate.toFixed(6) || '0.000000'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <BarChart3 size={24} className="text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Training-Diagramm wird in Echtzeit aktualisiert
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Kein aktives Training</h3>
              <p className="text-muted-foreground mb-4">Starten Sie die Optimierung eines Algorithmus, um Live-Metriken zu sehen</p>
              <Button onClick={() => optimizeAlgorithm(algorithms[0]?.algorithmId)}>
                Training starten
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp size={20} className="text-primary" />
                Optimierungsergebnisse
              </CardTitle>
              <CardDescription>
                Verlauf der Algorithmus-Verbesserungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              {optimizationResults.length > 0 ? (
                <div className="space-y-4">
                  {optimizationResults.map((result, index) => {
                    const algorithm = algorithms.find(a => a.algorithmId === result.algorithmId);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle size={16} className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{algorithm?.algorithmName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Verbesserung</p>
                          <p className="text-lg font-bold text-green-600">
                            +{result.improvement.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Noch keine Optimierungsergebnisse verfügbar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} className="text-primary" />
                Optimierungseinstellungen
              </CardTitle>
              <CardDescription>
                Konfiguration der automatischen Optimierung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Minimale Genauigkeitsschwelle
                    </label>
                    <div className="flex items-center gap-3">
                      <Progress value={optimizationSettings.minAccuracyThreshold} className="flex-1" />
                      <span className="text-sm font-medium w-12">
                        {optimizationSettings.minAccuracyThreshold}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Maximale Antwortzeit
                    </label>
                    <div className="flex items-center gap-3">
                      <Progress value={(optimizationSettings.maxResponseTime / 500) * 100} className="flex-1" />
                      <span className="text-sm font-medium w-12">
                        {optimizationSettings.maxResponseTime}ms
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Neutraining-Intervall
                    </label>
                    <div className="flex items-center gap-3">
                      <Progress value={(optimizationSettings.retrainingInterval / 48) * 100} className="flex-1" />
                      <span className="text-sm font-medium w-12">
                        {optimizationSettings.retrainingInterval}h
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Leistungsabfall-Schwelle
                    </label>
                    <div className="flex items-center gap-3">
                      <Progress value={(optimizationSettings.performanceThreshold / 20) * 100} className="flex-1" />
                      <span className="text-sm font-medium w-12">
                        {optimizationSettings.performanceThreshold}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatische Optimierung</h4>
                    <p className="text-sm text-muted-foreground">
                      Algorithmen werden automatisch optimiert, wenn sie die Schwellenwerte unterschreiten
                    </p>
                  </div>
                  <Button
                    variant={autoOptimizationEnabled ? "default" : "outline"}
                    onClick={() => setAutoOptimizationEnabled(prev => !prev)}
                  >
                    {autoOptimizationEnabled ? 'Aktiviert' : 'Deaktiviert'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MachineLearningOptimizer;