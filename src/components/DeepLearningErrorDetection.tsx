import React, { useState, useEffect, useCallback } from 'react';
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
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  ShieldCheck,
  Lightning,
  Sparkle,
  GitBranch,
  Layers,
  ChartNetwork,
  Matrix,
  Gauge,
  Warning,
  Info,
  Bug
} from '@phosphor-icons/react';

interface DeepLearningModel {
  modelId: string;
  modelName: string;
  architecture: 'CNN' | 'RNN' | 'LSTM' | 'Transformer' | 'GAN' | 'ResNet' | 'BERT' | 'Custom';
  errorType: 'pattern' | 'anomaly' | 'sequence' | 'image' | 'text' | 'hybrid';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  complexityLevel: number;
  trainingProgress: number;
  inferenceTime: number;
  memoryUsage: number;
  lastTrained: string;
  status: 'training' | 'deployed' | 'testing' | 'failed' | 'optimizing';
  detectedPatterns: string[];
  confidence: number;
}

interface ErrorPattern {
  patternId: string;
  patternName: string;
  errorType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: number;
  detectionAccuracy: number;
  lastDetected: string;
  description: string;
  symptoms: string[];
  relatedModels: string[];
}

interface TrainingMetrics {
  epoch: number;
  trainLoss: number;
  validationLoss: number;
  trainAccuracy: number;
  validationAccuracy: number;
  learningRate: number;
  gradientNorm: number;
  memoryUsage: number;
  timestamp: string;
}

interface PredictionResult {
  predictionId: string;
  modelId: string;
  errorType: string;
  confidence: number;
  severity: string;
  predictedAt: string;
  actualOutcome?: boolean;
  preventionAction?: string;
  timeToOccurrence: number; // in minutes
}

const DeepLearningErrorDetection: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [realTimePrediction, setRealTimePrediction] = useState(true);
  
  const [models, setModels] = useKV<DeepLearningModel[]>('dl-error-models', [
    {
      modelId: 'cnn-vision-errors',
      modelName: 'CNN Bildfehler-Detektor',
      architecture: 'CNN',
      errorType: 'image',
      accuracy: 96.8,
      precision: 94.2,
      recall: 97.1,
      f1Score: 95.6,
      falsePositiveRate: 1.8,
      complexityLevel: 85,
      trainingProgress: 100,
      inferenceTime: 45,
      memoryUsage: 2.3,
      lastTrained: new Date(Date.now() - 7200000).toISOString(),
      status: 'deployed',
      detectedPatterns: ['Türblockaden', 'Gesichtserkennung-Fehler', 'Kamera-Ausfälle'],
      confidence: 98.4
    },
    {
      modelId: 'lstm-sequence-predictor',
      modelName: 'LSTM Sequenz-Vorhersager',
      architecture: 'LSTM',
      errorType: 'sequence',
      accuracy: 94.1,
      precision: 91.8,
      recall: 96.3,
      f1Score: 94.0,
      falsePositiveRate: 2.4,
      complexityLevel: 78,
      trainingProgress: 100,
      inferenceTime: 67,
      memoryUsage: 1.8,
      lastTrained: new Date(Date.now() - 14400000).toISOString(),
      status: 'deployed',
      detectedPatterns: ['Verspätungs-Kaskaden', 'Signalstörungen', 'Zeitplan-Anomalien'],
      confidence: 95.7
    },
    {
      modelId: 'transformer-anomaly',
      modelName: 'Transformer Anomalie-Erkennung',
      architecture: 'Transformer',
      errorType: 'anomaly',
      accuracy: 97.9,
      precision: 96.5,
      recall: 98.2,
      f1Score: 97.3,
      falsePositiveRate: 1.1,
      complexityLevel: 92,
      trainingProgress: 100,
      inferenceTime: 89,
      memoryUsage: 4.1,
      lastTrained: new Date(Date.now() - 3600000).toISOString(),
      status: 'deployed',
      detectedPatterns: ['Ungewöhnliche Passagierströme', 'Sensor-Anomalien', 'Wetter-Abweichungen'],
      confidence: 99.1
    },
    {
      modelId: 'gan-failure-predictor',
      modelName: 'GAN Ausfallvorhersage',
      architecture: 'GAN',
      errorType: 'pattern',
      accuracy: 89.3,
      precision: 87.6,
      recall: 91.4,
      f1Score: 89.5,
      falsePositiveRate: 4.2,
      complexityLevel: 94,
      trainingProgress: 75,
      inferenceTime: 134,
      memoryUsage: 5.7,
      lastTrained: new Date(Date.now() - 1800000).toISOString(),
      status: 'training',
      detectedPatterns: ['Hardware-Ausfälle', 'Verschleiß-Muster', 'Komponentenermüdung'],
      confidence: 92.8
    },
    {
      modelId: 'resnet-damage-detector',
      modelName: 'ResNet Schaden-Klassifizierer',
      architecture: 'ResNet',
      errorType: 'image',
      accuracy: 95.4,
      precision: 93.7,
      recall: 96.8,
      f1Score: 95.2,
      falsePositiveRate: 2.1,
      complexityLevel: 87,
      trainingProgress: 100,
      inferenceTime: 56,
      memoryUsage: 3.2,
      lastTrained: new Date(Date.now() - 10800000).toISOString(),
      status: 'deployed',
      detectedPatterns: ['Gleisschäden', 'Infrastruktur-Verschleiß', 'Umweltschäden'],
      confidence: 96.9
    }
  ]);

  const [errorPatterns, setErrorPatterns] = useKV<ErrorPattern[]>('detected-error-patterns', [
    {
      patternId: 'door-blocking-pattern',
      patternName: 'Tür-Blockierungs-Muster',
      errorType: 'Operationaler Fehler',
      severity: 'medium',
      frequency: 34,
      detectionAccuracy: 96.8,
      lastDetected: new Date(Date.now() - 1800000).toISOString(),
      description: 'Wiederkehrende Muster von Türblockaden zu Stoßzeiten',
      symptoms: ['Verlängerte Haltezeiten', 'Passagier-Frustration', 'Domino-Verspätungen'],
      relatedModels: ['cnn-vision-errors', 'lstm-sequence-predictor']
    },
    {
      patternId: 'weather-cascade-pattern',
      patternName: 'Wetter-Kaskaden-Fehler',
      errorType: 'Umweltbedingter Fehler',
      severity: 'high',
      frequency: 12,
      detectionAccuracy: 97.9,
      lastDetected: new Date(Date.now() - 7200000).toISOString(),
      description: 'Wetterbedingte Ausfälle führen zu systemweiten Störungen',
      symptoms: ['Signalausfälle', 'Gleisschäden', 'Streckensperrungen'],
      relatedModels: ['transformer-anomaly', 'resnet-damage-detector']
    },
    {
      patternId: 'hardware-degradation-pattern',
      patternName: 'Hardware-Verschleiß-Muster',
      errorType: 'Technischer Fehler',
      severity: 'critical',
      frequency: 8,
      detectionAccuracy: 89.3,
      lastDetected: new Date(Date.now() - 14400000).toISOString(),
      description: 'Vorhersagbare Hardware-Ausfälle basierend auf Verschleißmustern',
      symptoms: ['Leistungsabfall', 'Intermittierende Fehler', 'Erhöhte Vibration'],
      relatedModels: ['gan-failure-predictor', 'transformer-anomaly']
    }
  ]);

  const [trainingMetrics, setTrainingMetrics] = useKV<TrainingMetrics[]>('dl-training-metrics', []);
  const [predictions, setPredictions] = useKV<PredictionResult[]>('dl-predictions', []);
  const [autoTrainingEnabled, setAutoTrainingEnabled] = useKV('auto-dl-training', true);

  // Simulation realer Training-Metriken
  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      const newMetric: TrainingMetrics = {
        epoch: trainingMetrics.length + 1,
        trainLoss: Math.max(0.05, Math.random() * 0.4 + 0.1),
        validationLoss: Math.max(0.06, Math.random() * 0.45 + 0.12),
        trainAccuracy: Math.min(99.5, 87 + Math.random() * 8 + trainingMetrics.length * 0.15),
        validationAccuracy: Math.min(98.5, 85 + Math.random() * 7 + trainingMetrics.length * 0.12),
        learningRate: 0.001 * Math.pow(0.95, Math.floor(trainingMetrics.length / 10)),
        gradientNorm: Math.random() * 2 + 0.5,
        memoryUsage: 3.2 + Math.random() * 1.8,
        timestamp: new Date().toISOString()
      };

      setTrainingMetrics(prev => [...prev.slice(-49), newMetric]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isTraining, trainingMetrics.length]);

  // Echtzeit-Vorhersage-Simulation
  useEffect(() => {
    if (!realTimePrediction) return;

    const interval = setInterval(() => {
      // Simuliere gelegentliche Fehlererkennung
      if (Math.random() < 0.15) { // 15% Chance pro Intervall
        const randomModel = models[Math.floor(Math.random() * models.length)];
        const errorTypes = ['Türblockade', 'Signalstörung', 'Hardware-Anomalie', 'Wetter-Einfluss', 'Kapazitätsüberschreitung'];
        const severities = ['low', 'medium', 'high', 'critical'];
        
        const newPrediction: PredictionResult = {
          predictionId: `pred_${Date.now()}`,
          modelId: randomModel.modelId,
          errorType: errorTypes[Math.floor(Math.random() * errorTypes.length)],
          confidence: 70 + Math.random() * 29,
          severity: severities[Math.floor(Math.random() * severities.length)],
          predictedAt: new Date().toISOString(),
          timeToOccurrence: Math.floor(Math.random() * 120) + 5, // 5-125 Minuten
          preventionAction: 'Automatische Intervention eingeleitet'
        };

        setPredictions(prev => [newPrediction, ...prev.slice(0, 19)]);
        
        if (newPrediction.confidence > 85) {
          toast.warning(`Hochwahrscheinlicher Fehler erkannt: ${newPrediction.errorType}`, {
            description: `Konfidenz: ${newPrediction.confidence.toFixed(1)}% • Vorhersagezeit: ${newPrediction.timeToOccurrence}min`,
            duration: 6000
          });
        }
      }
    }, 8000); // Alle 8 Sekunden prüfen

    return () => clearInterval(interval);
  }, [realTimePrediction, models]);

  const trainModel = useCallback(async (modelId: string) => {
    const model = models.find(m => m.modelId === modelId);
    if (!model) return;

    setIsTraining(true);
    setSelectedModel(modelId);

    // Update model status
    setModels(prev => prev.map(m => 
      m.modelId === modelId 
        ? { ...m, status: 'training', trainingProgress: 0 }
        : m
    ));

    toast.info(`Training von ${model.modelName} gestartet`, {
      description: `Architektur: ${model.architecture} • Fehlertyp: ${model.errorType}`,
      duration: 4000
    });

    // Reset training metrics
    setTrainingMetrics([]);

    // Simuliere Training-Prozess
    const trainingDuration = 20000; // 20 Sekunden
    const progressInterval = setInterval(() => {
      setModels(prev => prev.map(m => 
        m.modelId === modelId 
          ? { 
              ...m, 
              trainingProgress: Math.min(100, m.trainingProgress + 5 + Math.random() * 5)
            }
          : m
      ));
    }, 1000);

    setTimeout(() => {
      clearInterval(progressInterval);
      
      // Aktualisiere Model mit verbesserter Performance
      const accuracyImprovement = Math.random() * 5 + 1; // 1-6% Verbesserung
      const precisionImprovement = Math.random() * 4 + 0.5;
      const recallImprovement = Math.random() * 3 + 0.8;
      
      setModels(prev => prev.map(m => 
        m.modelId === modelId 
          ? { 
              ...m,
              status: 'deployed',
              trainingProgress: 100,
              accuracy: Math.min(99.9, m.accuracy + accuracyImprovement),
              precision: Math.min(99.5, m.precision + precisionImprovement),
              recall: Math.min(99.8, m.recall + recallImprovement),
              f1Score: Math.min(99.6, m.f1Score + (precisionImprovement + recallImprovement) / 2),
              falsePositiveRate: Math.max(0.1, m.falsePositiveRate - Math.random() * 1),
              confidence: Math.min(99.9, m.confidence + 1 + Math.random() * 2),
              lastTrained: new Date().toISOString(),
              inferenceTime: Math.max(30, m.inferenceTime - Math.random() * 15),
              memoryUsage: m.memoryUsage + Math.random() * 0.5 - 0.25
            }
          : m
      ));

      setIsTraining(false);
      setSelectedModel('');

      toast.success(`${model.modelName} erfolgreich trainiert!`, {
        description: `Genauigkeit verbessert um ${accuracyImprovement.toFixed(1)}%`,
        duration: 5000
      });

    }, trainingDuration);
  }, [models, setModels, setTrainingMetrics]);

  const getArchitectureIcon = (architecture: DeepLearningModel['architecture']) => {
    switch (architecture) {
      case 'CNN': return <Eye size={16} className="text-blue-600" />;
      case 'RNN': return <GitBranch size={16} className="text-green-600" />;
      case 'LSTM': return <ChartNetwork size={16} className="text-purple-600" />;
      case 'Transformer': return <Lightning size={16} className="text-yellow-600" />;
      case 'GAN': return <Sparkle size={16} className="text-pink-600" />;
      case 'ResNet': return <Layers size={16} className="text-indigo-600" />;
      case 'BERT': return <Matrix size={16} className="text-teal-600" />;
      default: return <Brain size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: DeepLearningModel['status']) => {
    switch (status) {
      case 'training': return 'bg-blue-500';
      case 'deployed': return 'bg-green-500';
      case 'testing': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'optimizing': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: DeepLearningModel['status']) => {
    switch (status) {
      case 'training': return 'Training';
      case 'deployed': return 'Aktiv';
      case 'testing': return 'Test';
      case 'failed': return 'Fehler';
      case 'optimizing': return 'Optimierung';
      default: return 'Unbekannt';
    }
  };

  const getSeverityColor = (severity: ErrorPattern['severity']) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: ErrorPattern['severity']) => {
    switch (severity) {
      case 'low': return <Info size={14} />;
      case 'medium': return <Warning size={14} />;
      case 'high': return <AlertTriangle size={14} />;
      case 'critical': return <Bug size={14} />;
      default: return <Info size={14} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Brain size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Deep Learning Fehlererkennung</h1>
            <p className="text-muted-foreground">Erweiterte KI-Modelle für komplexe Fehlererkennungsmuster</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={realTimePrediction ? "default" : "outline"}
            onClick={() => setRealTimePrediction(prev => !prev)}
            className="flex items-center gap-2"
          >
            {realTimePrediction ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
            Echtzeit-Vorhersage {realTimePrediction ? 'Aktiv' : 'Pausiert'}
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {isTraining && (
        <Alert className="border-blue-200 bg-blue-50">
          <Cpu className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <span>Deep Learning Training läuft: {models.find(m => m.modelId === selectedModel)?.modelName}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">GPU-Training aktiv</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="models">Modelle</TabsTrigger>
          <TabsTrigger value="patterns">Fehler-Muster</TabsTrigger>
          <TabsTrigger value="predictions">Vorhersagen</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {models.map((model) => (
              <Card key={model.modelId} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getArchitectureIcon(model.architecture)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{model.modelName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(model.status)}`}></div>
                          {getStatusText(model.status)}
                          <span className="text-xs">•</span>
                          <span className="text-xs">
                            {model.architecture} • {model.errorType}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Konfidenz: {model.confidence.toFixed(1)}%
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => trainModel(model.modelId)}
                        disabled={isTraining || model.status === 'training'}
                        className="flex items-center gap-1"
                      >
                        <Zap size={14} />
                        Trainieren
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {model.status === 'training' && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700">Training-Fortschritt</span>
                        <span className="text-sm font-bold text-blue-700">{model.trainingProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={model.trainingProgress} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Genauigkeit</span>
                      <div className="space-y-1">
                        <Progress value={model.accuracy} className="h-2" />
                        <p className="text-lg font-bold text-primary">{model.accuracy.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Precision</span>
                      <div className="space-y-1">
                        <Progress value={model.precision} className="h-2" />
                        <p className="text-lg font-bold text-green-600">{model.precision.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Recall</span>
                      <div className="space-y-1">
                        <Progress value={model.recall} className="h-2" />
                        <p className="text-lg font-bold text-blue-600">{model.recall.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">F1-Score</span>
                      <div className="space-y-1">
                        <Progress value={model.f1Score} className="h-2" />
                        <p className="text-lg font-bold text-purple-600">{model.f1Score.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Inferenz</span>
                      <div className="space-y-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${Math.max(0, 100 - (model.inferenceTime / 2))}%` }}
                          />
                        </div>
                        <p className="text-lg font-bold text-orange-600">{model.inferenceTime}ms</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Speicher</span>
                      <div className="space-y-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 transition-all duration-300"
                            style={{ width: `${(model.memoryUsage / 8) * 100}%` }}
                          />
                        </div>
                        <p className="text-lg font-bold text-red-600">{model.memoryUsage.toFixed(1)}GB</p>
                      </div>
                    </div>
                  </div>

                  {/* Detected Patterns */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium mb-2">Erkannte Muster</h4>
                    <div className="flex flex-wrap gap-2">
                      {model.detectedPatterns.map((pattern, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-primary" />
                Erkannte Fehler-Muster
              </CardTitle>
              <CardDescription>
                Deep Learning hat diese wiederkehrenden Fehlermuster identifiziert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorPatterns.map((pattern) => (
                  <div key={pattern.patternId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(pattern.severity)}`}>
                          {getSeverityIcon(pattern.severity)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{pattern.patternName}</h4>
                          <p className="text-sm text-muted-foreground">{pattern.errorType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Häufigkeit</div>
                        <div className="text-lg font-bold">{pattern.frequency}</div>
                      </div>
                    </div>

                    <p className="text-sm mb-3">{pattern.description}</p>

                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium mb-1">Symptome:</h5>
                        <div className="flex flex-wrap gap-2">
                          {pattern.symptoms.map((symptom, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">Erkennungsgenauigkeit:</span>
                          <span className="ml-2 font-semibold">{pattern.detectionAccuracy.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Letzte Erkennung:</span>
                          <span className="ml-2 text-xs">{new Date(pattern.lastDetected).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} className="text-primary" />
                Echtzeit-Vorhersagen
              </CardTitle>
              <CardDescription>
                Aktuelle Fehlervorhersagen der Deep Learning Modelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictions.length > 0 ? (
                <div className="space-y-3">
                  {predictions.slice(0, 10).map((prediction) => {
                    const model = models.find(m => m.modelId === prediction.modelId);
                    return (
                      <div key={prediction.predictionId} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle size={16} className="text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium">{prediction.errorType}</p>
                            <p className="text-sm text-muted-foreground">
                              {model?.modelName} • {new Date(prediction.predictedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {prediction.confidence.toFixed(1)}%
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {prediction.timeToOccurrence}min
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {prediction.preventionAction}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Noch keine Vorhersagen verfügbar</p>
                  <p className="text-xs text-muted-foreground mt-1">Aktivieren Sie die Echtzeit-Vorhersage oben</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          {isTraining ? (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity size={20} className="text-primary" />
                    Live Training Metriken
                  </CardTitle>
                  <CardDescription>
                    Echtzeit-Überwachung des Deep Learning Trainings
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
                        <span className="text-sm font-medium text-muted-foreground">Train Loss</span>
                        <p className="text-2xl font-bold text-red-600">
                          {trainingMetrics[trainingMetrics.length - 1]?.trainLoss.toFixed(4) || '0.0000'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Val Accuracy</span>
                        <p className="text-2xl font-bold text-green-600">
                          {trainingMetrics[trainingMetrics.length - 1]?.validationAccuracy.toFixed(1) || '0.0'}%
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">GPU Memory</span>
                        <p className="text-2xl font-bold text-blue-600">
                          {trainingMetrics[trainingMetrics.length - 1]?.memoryUsage.toFixed(1) || '0.0'}GB
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
                        Training-Verlaufskurven werden in Echtzeit angezeigt
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
              <h3 className="text-lg font-semibold mb-2">Kein aktives Deep Learning Training</h3>
              <p className="text-muted-foreground mb-4">Starten Sie das Training eines Modells, um Live-Metriken zu sehen</p>
              <Button onClick={() => trainModel(models[0]?.modelId)}>
                Training starten
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Model Performance Vergleich</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {models.map((model) => (
                    <div key={model.modelId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getArchitectureIcon(model.architecture)}
                        <span className="text-sm font-medium">{model.architecture}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={model.accuracy} className="w-20 h-2" />
                        <span className="text-sm font-bold w-12">{model.accuracy.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Fehler-Kategorien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {errorPatterns.map((pattern) => (
                    <div key={pattern.patternId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(pattern.severity)}
                        <span className="text-sm font-medium">{pattern.severity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(pattern.frequency / 50) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold w-8">{pattern.frequency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeepLearningErrorDetection;