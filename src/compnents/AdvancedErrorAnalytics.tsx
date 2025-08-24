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
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Activity,
  Shield,
  Lightning,
  Bug,
  Warning,
  Info,
  CircleNotch,
  ChartLine,
  Database,
  GitBranch,
  Pulse,
  Eye,
  Sparkle,
  Wrench,
  Gauge
} from '@phosphor-icons/react';

interface ComplexErrorPattern {
  patternId: string;
  patternName: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'highly_complex';
  detectionConfidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  frequency: number;
  systemImpact: number;
  modelsBehind: string[];
  lastDetected: string;
  predictedNextOccurrence: string;
  mitigationStrategies: string[];
  rootCauses: string[];
  dependencyChain: string[];
  correlatedEvents: string[];
}

interface AdvancedPrediction {
  predictionId: string;
  patternId: string;
  errorType: string;
  confidenceScore: number;
  timeHorizon: number; // minutes
  severity: 'minor' | 'moderate' | 'severe' | 'catastrophic';
  affectedSystems: string[];
  preventionMeasures: string[];
  costOfInaction: number;
  automaticResponse: boolean;
  humanInterventionRequired: boolean;
  complexity: number;
  timestamp: string;
}

interface MLModelInsight {
  modelId: string;
  modelName: string;
  architecture: string;
  specialty: string;
  currentConfidence: number;
  errorDetectionRate: number;
  falsePositiveRate: number;
  processingSpeed: number;
  memoryEfficiency: number;
  lastOptimization: string;
  keyFeatures: string[];
  learningProgress: number;
  adaptationScore: number;
}

interface SystemVulnerability {
  vulnerabilityId: string;
  vulnerabilityName: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  exploitability: number;
  impact: number;
  discoveryMethod: string;
  affectedComponents: string[];
  mitigationStatus: 'none' | 'partial' | 'complete';
  estimatedFixTime: number; // hours
  riskScore: number;
}

const AdvancedErrorAnalytics: React.FC = () => {
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [deepScanEnabled, setDeepScanEnabled] = useState(true);
  const [predictionHorizon, setPredictionHorizon] = useState(720); // 12 hours default
  
  const [complexPatterns, setComplexPatterns] = useKV<ComplexErrorPattern[]>('complex-error-patterns', [
    {
      patternId: 'cascading-delay-pattern',
      patternName: 'Kaskadierende Verspätungs-Kettenreaktion',
      complexity: 'highly_complex',
      detectionConfidence: 94.8,
      riskLevel: 'critical',
      frequency: 18,
      systemImpact: 89,
      modelsBehind: ['lstm-sequence-predictor', 'transformer-anomaly', 'network-optimization'],
      lastDetected: new Date(Date.now() - 3600000).toISOString(),
      predictedNextOccurrence: new Date(Date.now() + 14400000).toISOString(),
      mitigationStrategies: [
        'Proaktive Streckenumleitung',
        'Dynamische Kapazitätsanpassung',
        'Frühzeitige Passagierinformation'
      ],
      rootCauses: [
        'Überlastung kritischer Streckenabschnitte',
        'Verzögerte Störungsbehandlung',
        'Suboptimale Umleitung-Algorithmen'
      ],
      dependencyChain: [
        'Primär-Störung → Streckenblockade',
        'Alternative Routen → Überlastung',
        'Domino-Effekt → Systemweite Verspätungen'
      ],
      correlatedEvents: [
        'Wetter-Anomalien',
        'Stoßzeit-Verkehr',
        'Infrastruktur-Wartung'
      ]
    },
    {
      patternId: 'sensor-degradation-pattern',
      patternName: 'Schleichende Sensor-Degradation',
      complexity: 'complex',
      detectionConfidence: 91.2,
      riskLevel: 'high',
      frequency: 34,
      systemImpact: 67,
      modelsBehind: ['cnn-vision-errors', 'resnet-damage-detector', 'predictive-maintenance'],
      lastDetected: new Date(Date.now() - 7200000).toISOString(),
      predictedNextOccurrence: new Date(Date.now() + 21600000).toISOString(),
      mitigationStrategies: [
        'Automatische Sensor-Redundanz',
        'KI-basierte Kompensation',
        'Prädiktive Wartung'
      ],
      rootCauses: [
        'Umwelteinflüsse (Feuchtigkeit, Temperatur)',
        'Vibrations-bedingte Alterung',
        'Elektromagnetische Interferenz'
      ],
      dependencyChain: [
        'Sensor-Drift → Messungenauigkeit',
        'Fehlende Kalibrierung → Falsche Entscheidungen',
        'System-Kompensation → Überlastung'
      ],
      correlatedEvents: [
        'Wartungszyklen',
        'Wetterwechsel',
        'Fahrzeug-Vibrationen'
      ]
    },
    {
      patternId: 'ai-decision-bias-pattern',
      patternName: 'KI-Entscheidungs-Bias-Akkumulation',
      complexity: 'highly_complex',
      detectionConfidence: 87.6,
      riskLevel: 'medium',
      frequency: 12,
      systemImpact: 56,
      modelsBehind: ['explainable-ai', 'meta-learning', 'bias-detection'],
      lastDetected: new Date(Date.now() - 10800000).toISOString(),
      predictedNextOccurrence: new Date(Date.now() + 28800000).toISOString(),
      mitigationStrategies: [
        'Kontinuierliche Bias-Überwachung',
        'Diverse Trainingsdaten',
        'Algorithmus-Rotation'
      ],
      rootCauses: [
        'Unausgewogene Trainingsdaten',
        'Feedback-Loop-Verstärkung',
        'Kontext-Drift über Zeit'
      ],
      dependencyChain: [
        'Bias im Training → Verzerrte Entscheidungen',
        'Verstärkung durch Feedback → Systematische Fehler',
        'Accumulated Bias → Leistungsabfall'
      ],
      correlatedEvents: [
        'Datenverteilung-Änderungen',
        'Algorithmus-Updates',
        'Externe Einflussfaktoren'
      ]
    }
  ]);

  const [advancedPredictions, setAdvancedPredictions] = useKV<AdvancedPrediction[]>('advanced-predictions', []);
  const [modelInsights, setModelInsights] = useKV<MLModelInsight[]>('ml-model-insights', [
    {
      modelId: 'ensemble-deep-detector',
      modelName: 'Ensemble Deep Error Detector',
      architecture: 'Hybrid CNN-LSTM-Transformer',
      specialty: 'Multi-Modal Fehlererkennung',
      currentConfidence: 96.4,
      errorDetectionRate: 94.8,
      falsePositiveRate: 1.6,
      processingSpeed: 127,
      memoryEfficiency: 87,
      lastOptimization: new Date(Date.now() - 3600000).toISOString(),
      keyFeatures: [
        'Temporal Pattern Recognition',
        'Multi-Modal Fusion',
        'Contextual Understanding',
        'Anomaly Correlation'
      ],
      learningProgress: 89,
      adaptationScore: 92
    },
    {
      modelId: 'causal-reasoning-engine',
      modelName: 'Causal Reasoning Engine',
      architecture: 'Graph Neural Network',
      specialty: 'Ursachen-Wirkungs-Analyse',
      currentConfidence: 91.7,
      errorDetectionRate: 89.2,
      falsePositiveRate: 3.1,
      processingSpeed: 89,
      memoryEfficiency: 94,
      lastOptimization: new Date(Date.now() - 7200000).toISOString(),
      keyFeatures: [
        'Causal Chain Discovery',
        'Root Cause Analysis',
        'Dependency Mapping',
        'Impact Prediction'
      ],
      learningProgress: 76,
      adaptationScore: 88
    }
  ]);

  const [vulnerabilities, setVulnerabilities] = useKV<SystemVulnerability[]>('system-vulnerabilities', [
    {
      vulnerabilityId: 'single-point-failure',
      vulnerabilityName: 'Single Point of Failure in Hauptknotenpunkten',
      description: 'Kritische Infrastruktur ohne ausreichende Redundanz',
      severity: 'critical',
      exploitability: 78,
      impact: 95,
      discoveryMethod: 'Deep Learning Graph Analysis',
      affectedComponents: ['Hauptbahnhof München', 'Zentraler Dispatcher', 'Primäre Datenbank'],
      mitigationStatus: 'partial',
      estimatedFixTime: 168, // 1 Woche
      riskScore: 86
    },
    {
      vulnerabilityId: 'cascade-amplification',
      vulnerabilityName: 'Verstärkungseffekt bei Störungen',
      description: 'Kleine Störungen werden durch Systemdesign verstärkt',
      severity: 'high',
      exploitability: 65,
      impact: 73,
      discoveryMethod: 'Pattern Recognition ML',
      affectedComponents: ['Routing-Algorithmus', 'Kapazitäts-Management', 'Zeitplan-System'],
      mitigationStatus: 'none',
      estimatedFixTime: 72,
      riskScore: 69
    }
  ]);

  // Deep Analysis Simulation
  const runDeepAnalysis = useCallback(async () => {
    setAnalysisRunning(true);
    
    toast.info('Starte Deep Learning Analyse...', {
      description: 'Analysiere komplexe Fehlermuster mit fortgeschrittenen ML-Modellen',
      duration: 3000
    });

    // Simulate analysis duration
    setTimeout(() => {
      // Generate new advanced predictions
      const newPredictions: AdvancedPrediction[] = [];
      
      // Generate predictions based on complex patterns
      complexPatterns.forEach(pattern => {
        if (Math.random() < 0.4) { // 40% chance per pattern
          const prediction: AdvancedPrediction = {
            predictionId: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            patternId: pattern.patternId,
            errorType: pattern.patternName,
            confidenceScore: 75 + Math.random() * 24,
            timeHorizon: Math.floor(Math.random() * predictionHorizon) + 30,
            severity: pattern.riskLevel === 'critical' ? 'catastrophic' :
                     pattern.riskLevel === 'high' ? 'severe' :
                     pattern.riskLevel === 'medium' ? 'moderate' : 'minor',
            affectedSystems: pattern.dependencyChain.slice(0, 2),
            preventionMeasures: pattern.mitigationStrategies.slice(0, 2),
            costOfInaction: Math.floor(Math.random() * 500000) + 50000, // €50k - €550k
            automaticResponse: pattern.complexity !== 'highly_complex',
            humanInterventionRequired: pattern.riskLevel === 'critical',
            complexity: pattern.complexity === 'highly_complex' ? 95 :
                       pattern.complexity === 'complex' ? 75 :
                       pattern.complexity === 'moderate' ? 55 : 35,
            timestamp: new Date().toISOString()
          };
          newPredictions.push(prediction);
        }
      });

      setAdvancedPredictions(prev => [...newPredictions, ...prev.slice(0, 15)]);
      
      // Update model insights with new learning progress
      setModelInsights(prev => prev.map(model => ({
        ...model,
        learningProgress: Math.min(100, model.learningProgress + Math.random() * 5),
        adaptationScore: Math.min(100, model.adaptationScore + Math.random() * 3),
        currentConfidence: Math.min(99.9, model.currentConfidence + Math.random() * 2),
        lastOptimization: new Date().toISOString()
      })));

      setAnalysisRunning(false);
      
      toast.success('Deep Learning Analyse abgeschlossen!', {
        description: `${newPredictions.length} neue Vorhersagen generiert`,
        duration: 5000
      });
    }, 8000);
  }, [complexPatterns, predictionHorizon, setAdvancedPredictions, setModelInsights]);

  // Auto-analysis
  useEffect(() => {
    if (!deepScanEnabled) return;

    const interval = setInterval(() => {
      if (!analysisRunning && Math.random() < 0.3) { // 30% chance every interval
        runDeepAnalysis();
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, [deepScanEnabled, analysisRunning, runDeepAnalysis]);

  const getComplexityColor = (complexity: ComplexErrorPattern['complexity']) => {
    switch (complexity) {
      case 'simple': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'complex': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'highly_complex': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'minor': return <Info size={16} className="text-blue-500" />;
      case 'moderate': return <Warning size={16} className="text-yellow-500" />;
      case 'severe': return <AlertTriangle size={16} className="text-orange-500" />;
      case 'catastrophic': return <Bug size={16} className="text-red-500" />;
      case 'low': return <Info size={16} className="text-green-500" />;
      case 'medium': return <Warning size={16} className="text-yellow-500" />;
      case 'high': return <AlertTriangle size={16} className="text-orange-500" />;
      case 'critical': return <Bug size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-gray-500" />;
    }
  };

  const getRiskScore = (vulnerability: SystemVulnerability) => {
    return (vulnerability.exploitability * vulnerability.impact) / 100;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Brain size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Erweiterte Fehler-Analytics</h1>
            <p className="text-muted-foreground">Deep Learning für komplexeste Fehlermuster und Systemanalyse</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={deepScanEnabled ? "default" : "outline"}
            onClick={() => setDeepScanEnabled(prev => !prev)}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            Deep Scan {deepScanEnabled ? 'Aktiv' : 'Pausiert'}
          </Button>
          
          <Button
            onClick={runDeepAnalysis}
            disabled={analysisRunning}
            className="flex items-center gap-2"
          >
            {analysisRunning ? <CircleNotch size={16} className="animate-spin" /> : <Lightning size={16} />}
            {analysisRunning ? 'Analysiere...' : 'Analyse starten'}
          </Button>
        </div>
      </div>

      {/* Analysis Status */}
      {analysisRunning && (
        <Alert className="border-blue-200 bg-blue-50">
          <Cpu className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <span>Deep Learning Analyse läuft • Verarbeite komplexe Fehlermuster</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">GPU-Cluster aktiv</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="patterns">Komplexe Muster</TabsTrigger>
          <TabsTrigger value="predictions">Vorhersagen</TabsTrigger>
          <TabsTrigger value="insights">Model-Insights</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Schwachstellen</TabsTrigger>
          <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <div className="space-y-4">
            {complexPatterns.map((pattern) => (
              <Card key={pattern.patternId} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getSeverityIcon(pattern.riskLevel)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{pattern.patternName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge className={getComplexityColor(pattern.complexity)} variant="outline">
                            {pattern.complexity.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs">•</span>
                          <span className="text-xs">
                            Konfidenz: {pattern.detectionConfidence.toFixed(1)}%
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">System-Impact</div>
                      <div className="text-lg font-bold text-red-600">{pattern.systemImpact}%</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Häufigkeit</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(pattern.frequency / 50) * 100} className="flex-1 h-2" />
                        <span className="text-sm font-bold">{pattern.frequency}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Erkennungsgenauigkeit</span>
                      <div className="flex items-center gap-2">
                        <Progress value={pattern.detectionConfidence} className="flex-1 h-2" />
                        <span className="text-sm font-bold">{pattern.detectionConfidence.toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">System-Impact</span>
                      <div className="flex items-center gap-2">
                        <Progress value={pattern.systemImpact} className="flex-1 h-2" />
                        <span className="text-sm font-bold">{pattern.systemImpact}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Dependency Chain */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Abhängigkeits-Kette</h4>
                    <div className="space-y-2">
                      {pattern.dependencyChain.map((step, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Root Causes & Mitigation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Grundursachen</h4>
                      <div className="space-y-1">
                        {pattern.rootCauses.map((cause, index) => (
                          <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Bug size={12} className="mt-1 text-red-500" />
                            {cause}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Minderungs-Strategien</h4>
                      <div className="space-y-1">
                        {pattern.mitigationStrategies.map((strategy, index) => (
                          <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Shield size={12} className="mt-1 text-green-500" />
                            {strategy}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Models Behind */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Beteiligte ML-Modelle</h4>
                    <div className="flex flex-wrap gap-2">
                      {pattern.modelsBehind.map((modelId, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {modelId}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Letzte Erkennung: {new Date(pattern.lastDetected).toLocaleString()}</span>
                      <span>Nächste Vorhersage: {new Date(pattern.predictedNextOccurrence).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} className="text-primary" />
                Erweiterte Vorhersagen
              </CardTitle>
              <CardDescription>
                Hochkomplexe Fehlermuster-Vorhersagen mit Deep Learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              {advancedPredictions.length > 0 ? (
                <div className="space-y-4">
                  {advancedPredictions.slice(0, 8).map((prediction) => (
                    <div key={prediction.predictionId} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            {getSeverityIcon(prediction.severity)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{prediction.errorType}</h4>
                            <p className="text-sm text-muted-foreground">
                              Vorhersagezeitraum: {prediction.timeHorizon} Minuten
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            Konfidenz: {prediction.confidenceScore.toFixed(1)}%
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Komplexität: {prediction.complexity}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <h5 className="text-sm font-medium mb-1">Betroffene Systeme</h5>
                          <div className="space-y-1">
                            {prediction.affectedSystems.map((system, index) => (
                              <Badge key={index} variant="secondary" className="text-xs mr-1">
                                {system}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-1">Präventionsmaßnahmen</h5>
                          <div className="space-y-1">
                            {prediction.preventionMeasures.map((measure, index) => (
                              <div key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                                <CheckCircle size={10} className="mt-1 text-green-500" />
                                {measure}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            {prediction.automaticResponse ? (
                              <CheckCircle size={14} className="text-green-500" />
                            ) : (
                              <XCircle size={14} className="text-red-500" />
                            )}
                            <span className="text-xs">Auto-Response</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {prediction.humanInterventionRequired ? (
                              <Warning size={14} className="text-yellow-500" />
                            ) : (
                              <CheckCircle size={14} className="text-green-500" />
                            )}
                            <span className="text-xs">Human Intervention</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Kostenschätzung ohne Intervention: €{prediction.costOfInaction.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Noch keine erweiterten Vorhersagen verfügbar</p>
                  <p className="text-xs text-muted-foreground mt-1">Starten Sie eine Deep-Analyse</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {modelInsights.map((model) => (
              <Card key={model.modelId} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Brain size={16} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{model.modelName}</CardTitle>
                        <CardDescription>
                          {model.architecture} • {model.specialty}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <Badge variant="outline">
                      Konfidenz: {model.currentConfidence.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Erkennungsrate</span>
                      <div className="space-y-1">
                        <Progress value={model.errorDetectionRate} className="h-2" />
                        <p className="text-lg font-bold text-green-600">{model.errorDetectionRate.toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">False Positive</span>
                      <div className="space-y-1">
                        <Progress value={100 - (model.falsePositiveRate * 10)} className="h-2" />
                        <p className="text-lg font-bold text-blue-600">{model.falsePositiveRate.toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Geschwindigkeit</span>
                      <div className="space-y-1">
                        <Progress value={Math.max(0, 100 - (model.processingSpeed / 2))} className="h-2" />
                        <p className="text-lg font-bold text-purple-600">{model.processingSpeed}ms</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Effizienz</span>
                      <div className="space-y-1">
                        <Progress value={model.memoryEfficiency} className="h-2" />
                        <p className="text-lg font-bold text-orange-600">{model.memoryEfficiency}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Kern-Features</h4>
                      <div className="space-y-1">
                        {model.keyFeatures.map((feature, index) => (
                          <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <Sparkle size={12} className="text-primary" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Lernfortschritt</span>
                          <span className="text-sm font-bold">{model.learningProgress}%</span>
                        </div>
                        <Progress value={model.learningProgress} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Anpassungsfähigkeit</span>
                          <span className="text-sm font-bold">{model.adaptationScore}%</span>
                        </div>
                        <Progress value={model.adaptationScore} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground">
                    Letzte Optimierung: {new Date(model.lastOptimization).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} className="text-primary" />
                System-Schwachstellen
              </CardTitle>
              <CardDescription>
                Deep Learning entdeckte Systemvulnerabilitäten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vulnerabilities.map((vuln) => (
                  <div key={vuln.vulnerabilityId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          {getSeverityIcon(vuln.severity)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{vuln.vulnerabilityName}</h4>
                          <p className="text-sm text-muted-foreground">{vuln.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">
                          Risk: {getRiskScore(vuln).toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {vuln.discoveryMethod}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-sm font-medium">Ausnutzbarkeit</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={vuln.exploitability} className="flex-1 h-2" />
                          <span className="text-sm font-bold">{vuln.exploitability}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Impact</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={vuln.impact} className="flex-1 h-2" />
                          <span className="text-sm font-bold">{vuln.impact}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Behebungszeit</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={14} className="text-muted-foreground" />
                          <span className="text-sm font-bold">{vuln.estimatedFixTime}h</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Betroffene Komponenten</h5>
                      <div className="flex flex-wrap gap-2">
                        {vuln.affectedComponents.map((component, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                      <Badge
                        variant={vuln.mitigationStatus === 'complete' ? 'default' : 
                                vuln.mitigationStatus === 'partial' ? 'secondary' : 'destructive'}
                      >
                        Mitigation: {vuln.mitigationStatus}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Risk Score: {vuln.riskScore}/100
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Pattern Complexity Overview */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Pattern-Komplexität</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['simple', 'moderate', 'complex', 'highly_complex'].map((complexity) => {
                    const count = complexPatterns.filter(p => p.complexity === complexity).length;
                    return (
                      <div key={complexity} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{complexity.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${(count / complexPatterns.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold w-6">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Model Performance */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Model-Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modelInsights.map((model) => (
                    <div key={model.modelId} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{model.architecture}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={model.currentConfidence} className="w-16 h-2" />
                        <span className="text-sm font-bold w-12">{model.currentConfidence.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">System-Gesundheit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {Math.round(modelInsights.reduce((acc, m) => acc + m.currentConfidence, 0) / modelInsights.length)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Gesamt-Konfidenz</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {complexPatterns.filter(p => p.riskLevel === 'low').length}
                      </div>
                      <div className="text-xs text-green-600">Niedrig Risk</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">
                        {complexPatterns.filter(p => p.riskLevel === 'critical').length}
                      </div>
                      <div className="text-xs text-red-600">Kritisch</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedErrorAnalytics;